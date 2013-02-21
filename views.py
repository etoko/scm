import json
from datetime import datetime
import transaction

from pyramid.httpexceptions import (
                                   exception_response,
                                   HTTPFound,
                                   HTTPNotFound,
                                   HTTPForbidden,
                                   )
from pyramid.renderers import render_to_response
from pyramid.response import Response
from pyramid.static import static_view
from pyramid.security import authenticated_userid, forget, remember
from pyramid.view import view_config

from sqlalchemy.exc import IntegrityError

from scm.controllers import (
                            SupplierController, 
                            UserController, 
                            PermissionController,
                            )
from scm.security import USERS
from scm.util import operations

supplier_controller = SupplierController()
user_controller = UserController()
permission_controller = PermissionController()

@view_config(route_name='home', renderer='index.mako', permission = "edit")
#@view_config(route_name='home', renderer='index.mako')
def index(request):
    userid = authenticated_userid(request)
    print request.session
    return {'app_name':'Inventory Management System', "user":userid}


################Authorisation Section#################################

@view_config(route_name = "login", renderer = "login.mako")
@view_config(context = HTTPForbidden, renderer = "login.mako")
def login(request):
    login_page = request.route_url("login")
    referrer = request.url
    
    if referrer == login_page:
        referrer = "/"
    
    came_from = request.params.get("came_from", referrer)
    message = ""
    login = ""
    password = ""

    if "form.submitted" in request.params:
        login = request.params["login"]
        password = request.params["password"]
        
        if USERS.get(login) == password:
            headers = remember(request, login)
            print came_from
            return HTTPFound(location = came_from, headers = headers)

        message = "Failed login"
    return dict(message = message, url = request.application_url + "/login",
                came_from = came_from, login = login, password = password,)


@view_config(route_name = "logout")
def logout(request):
    headers = forget(request)
    return HTTPFound(location = request.route_url("home"), 
                     headers = headers)

@view_config(route_name='supplier_controller', renderer='json')
def suppliers(request):
    j_supplier = request.json_body
    
    def _create(j_supplier):
        try:
            supplier_controller.add(j_supplier)
        except IntegrityError:
            print "Error saving supplier"

    def _read():
        pass

    def _delete():
        pass

    operation = j_supplier["supplier_operation"]
    print j_supplier["supplier_name"], j_supplier["supplier_id"]

    if operation == "CREATE":
        if j_supplier["supplier_name"]:
            supplier_controller.save(j_supplier)
    
    return j_supplier

#######Admin##########################
@view_config(route_name = "user_controller", renderer = "json")
def users(request):
    def _create(request, jsonified_user):
        try:
            user_controller.add(jsonified_user)
        except IntegrityError as err:
            raise ValueError("User with username %s already exists" % (username,))

    def _read(request, jsonified_user):
        #read_type is one of first, previous, next or last
        #MARKED FOR CACHING USING BEAKER AND/OR MEMCACHED
        read_type = jsonified_user["users_operation"]
        user_num = len(user_controller.get())
        try:
            if read_type == "FIRST":
                user = user_controller.get()[0]
            elif read_type == "LAST":
                user = user_controller.get()[-1]
            else:
                position = int(jsonified_user["users_position"])
                if read_type == "NEXT":
                    position += 1
                elif read_type == "PREVIOUS":
                    position -= 1
    
                if position >= user_num:
                   position = -1
                   print "REACHED LAST USER"
                elif position < 0:
                   position = 0
                   print "REACHED FIRST USER"
                user = user_controller.get()[position]
                user.position = user_controller.index(user) 
            #users = [user.serialize for user in users]
        except (IndexError, ValueError, TypeError):
            #Perhaps reached the end of the list
            if read_type == "NEXT":
                user = user_controller.get()[0]
            else:
                user = user_controller.get()[-1]
        except Exception as err:
            print "%s %s" % (err.args, err.message, )
            return None
    
        return user.to_dict
    
    jsonified_user = request.json_body
    operation = ""
    try:
        operation = jsonified_user["users_operation"]
    except KeyError:
        raise KeyError("No operation type specified")

    if operation == operations()[0]: 
        _create(request, jsonified_user)
    elif operation in ["FIRST", "PREVIOUS","NEXT", "LAST"]:
        user = _read(request, jsonified_user)
    
    return user


@view_config(route_name = "permissions", renderer = "json")
def permissions(request):
    permissions = DBSession.query(Permission).all()
    for permission in permissions:
        print ("%s %s %s") % (permission.id, permission.name, permission.description,)
    
    return permissions
    

#@view_config(route_name='purchase_orders_page', 
#             renderer='local_purchase_order.mako', permission = "edit")
@view_config(route_name='purchase_orders_page', 
             renderer='local_purchase_order.mako')
def purchase_order_page(request):
    if not request.is_xhr:
        return HTTPNotFound(location = "home")

    logged_in = authenticated_userid(request)
    return dict(logged_in = logged_in, page_title = "Local Purchase Order", page = "Purchase")

@view_config(route_name='requisitions_page', renderer='requisition.mako')
def requisition_page(request):
    return {'project':'Inventory Management System'}

@view_config(route_name='suppliers_page', renderer="suppliers.mako")
def suppliers_page(request):
    logged_in = ""
    return dict(logged_in = logged_in, page_title = "Suppliers", page = "Suppliers")

@view_config(route_name='banks_page', renderer="banks.mako")
def banks_page(request):
    return {"bank": "Bank"}

@view_config(route_name='departments_page', renderer="departments.mako")
def departments_page(request):
    return {'suppliers': "Suppliers"}

@view_config(route_name="goods_received_page", renderer="goods_received.mako")
def goods_received_page(request):
    return {"goods_received": "goods_received"}

@view_config(route_name="goods_returned_page", renderer="goods_returned.mako")
def goods_returned_page(request):
    return {"goods_returned": "goods_returned"}
    
@view_config(route_name='store_issues_page', renderer='store_issues.mako')
def store_issues_page(request):
    return {"first_name":"first_name", "last_name" : "last_name", \
            "project" : "Inventory Management System"}

@view_config(route_name="bincard_page", renderer="bincard.mako")
def bin_card_page(request):
    return {"templates/": "stores.pt"}

@view_config(route_name="modem_page", renderer="modem.mako")
def modem_page(request):
    from scm.pygsm import GsmModem
    network = None
    signal_strength = None
    service_center = None
    hardware = None
    try:
        modem = GsmModem(port = "/dev/ttyUSB0")
        modem.connect()
        #modem.boot()
        network = modem.network
        signal_strength = modem.signal_strength()
        service_center = modem._get_service_center()
        hardware = modem.hardware()
    except Exception as err:
        err.message

    return {"network":network, "signal_strength":signal_strength,\
            "service_center": service_center, "hardware":hardware}

@view_config(route_name = "users_page", renderer = "users.mako")
def users_view_page(request):
    permissions = permission_controller.get()
    print [("%s %s %s") % (permission.id, permission.name, permission.description,) for permission in permissions]
    logged_in = ""
    return {logged_in:logged_in, "permissions":permissions}


#######Reports###############################################
@view_config(route_name = "purchase_orders_by_status_page", 
  renderer = "purchase_orders_by_status.mako")
def purchase_orders_by_status_page(request):
    logged_in = ""
    return {logged_in:logged_in}
@view_config(route_name = "purchase_orders_by_supplier_page", 
  renderer = "purchase_orders_by_supplier.mako")
def purchase_orders_by_supplier_page(request):
    logged_in = ""
    return {logged_in:logged_in}
@view_config(route_name="goods_received_report_page", 
  renderer="goods_received_report.mako")
def goods_received_report_page(request):
    return {"goods_received": "goods_received"}

@view_config(route_name="goods_returned_report_page", renderer="goods_returned_report.mako")
def goods_returned_report_page(request):
    return {"goods_returned": "goods_returned"}
