from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

from pyramid_beaker import set_cache_regions_from_settings
 
from sqlalchemy import engine_from_config

from scm.security import groupfinder
from scm.models import DBSession
from scm.models import StoresIssueNote, StoresIssueNoteItem

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    authn_policy = AuthTktAuthenticationPolicy(
      "sosecret", callback = groupfinder)
    authz_policy = ACLAuthorizationPolicy()
    set_cache_regions_from_settings(settings)
    config = Configurator(settings=settings,
                          root_factory = "scm.models.RootFactory")
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)
    #config.add_static_view('static', 'static', cache_max_age=3600)
    #config.add_route('home', '/')
    #config.scan()
    #return config.make_wsgi_app()


    config.add_view('scm.views.suppliers',
                 name='supplier',
                 renderer='json')


    config.add_static_view('static', 'static', cache_max_age=3600)
    #config.add_static_view(name='static', path='/var/www/static', cache_max_age=3600)
    config.add_route("login", "/login")
    config.add_route("logout", "/logout")
    config.add_route('home', '/')
    config.add_route('proc', '/proc/')
    config.add_route('modem_page', '/modem/')

    ###finance
    config.add_route('banks_page', '/banks/')

    #procurement
    config.add_route('purchase_orders_page', '/purchase_orders/')
    config.add_route('requisitions_page', '/requisitions/')
    config.add_route('departments_page', '/departments/')
    config.add_route('suppliers_page', '/suppliers/')
    config.add_route('store_issues_page', '/store_issues/')	
    config.add_route('delivery_note_page', '/delivery_note/')
    config.add_route('goods_received_page', '/goods_received/')
    config.add_route('goods_returned_page', '/goods_returned/')
    config.add_route('users_page', '/users/')

    config.add_route('bincard_page', '/bincard/')
    config.add_route('purchase_orders_by_status_page', '/purchase_orders_by_status/')
    config.add_route('purchase_orders_by_supplier_page', '/purchase_orders_by_supplier/')
    config.add_route('store_issues_report_page', '/store_issues_report/')
    config.add_route('goods_received_report_page', '/goods_received_report/')
    config.add_route('goods_returned_report_page', '/goods_returned_report/')
    config.add_route("permissions", "/permissions/")

    #######controller operations###############################################
    config.add_route('supplier_controller', '/supplier/operations')

    ####admin###################
    config.add_route("user_controller", '/users/operations')
    
    config.scan()

    return config.make_wsgi_app()
