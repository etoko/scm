#maintainer etoko
#date 2012-03-15 19:22

from datetime import datetime
import os
import sys
import transaction

from beaker.cache import cache_region

from sqlalchemy import engine_from_config
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from pyramid.security import (
  Allow,
  Everyone,
  )

from scm.models import (
    Base,
    DBSession,
    User,
    Group,
    Permission,
    )
from scm.controllers import ApiController
from scm.util.security import sha256_digest

class UserController(ApiController):
    """
    Controller for User, Group and Permission models
    """
    def create(self, jsonified_user):
        username = None
        first_name = None
        last_name = None
        email_address = None
        password = None
        is_active = None
        is_superuser = None

        try:
            username = jsonified_user["users_username"]
            first_name = jsonified_user["users_first_name"]
            last_name = jsonified_user["users_last_name"]
            password = jsonified_user["users_password"]
            is_active = jsonified_user["users_active"]
            is_superuser = jsonified_user["users_superuser"]
            email_address = jsonified_user["users_email_address"]
        except KeyError as err:
            print err
            raise KeyError()
    
        if is_active == "on":
           is_active = True
        if is_superuser == "on":
           is_superuser = True
       
        errors = {} #list of data entry errors
    
        if username is None or first_name is None or last_name is None:
            if username is None:
                errors["username"] = "No Username"
            elif first_name is None:
                errors["first_name"] = "No First Name"
            else:
                errors["last_name"] = "No Last Name"
                    
            return errors
        if username is None:
            raise ValueError("username was not supplied")
        elif first_name is None:
            raise ValueError("first name not entered")
        elif last_name is None:
             raise ValueError("last name not entered")
        
        user = User(username, first_name, last_name)
        user.last_login = datetime.now()
        user.password = password
        user.is_active = is_active
        user.is_superuser = True
        user.is_staff = True
        if permissions:
            permissions = [user_manager.get(Permission, i) for i in permissions]
            user.permissions = permissions
       
        if _is_valid(user):
            try:
                user.password = sha256_digest(password)
            except ValueError as err:
                print err.message
                raise ValueError("No password supplied")
                
            with transaction.manager:
                DBSession.add(user)
        else:
            print "Invalid user"
    
    def update(self, user):
        if _is_valid(user):
            with transaction.manager:
                DBSession.merge(user)
    
    def get(self, **kwargs):
        """
        Retrieve a user or list of users depending on the arguments passed
        to the function
        """
        #Determine if user is searching by id or username
        user_id = kwargs.pop("user_id", None)
        username = kwargs.pop("username", None)
    
        try:
            print user_id
            user_id = int(user_id)
        except TypeError or ValueError: user_id = 0
    
        if username is None and user_id == 0:
            print "USERNAME IS NONW AND USERID = 0"
            return self._all()
        elif user_id > 0 and username is None:
            print "USERNAME IS NONW AND USERID = 0"
            return DBSession.query(User).get(user_id)
        elif user_id == 0 and username is not None:
            print "USERNAME IS NOT NONE AND USERID = 0"
            if len(username) == 0:
                raise ValueError("Illegal username entered")
            users = DBSession.query(User). \
                    filter(or_(User.username.like('%' + username + '%'),\
                    User.fullname.like('%' + username + '%'))).all()
            return users
        elif user_id > 0 and username is not None:
            print "BOTH ARE FILLED INUSERNAME IS NOT NONE AND USERID = 0"
            users = DBSession.query(User).filter( \
                  or_(User.id == user_id,\
                  User.username.like('%' + username + '%'))).all()
        return
    
    #@cache_region("minute", "users")
    def _all(self):
        users = []
        #with transaction.manager:
            #users = DBSession.query(User).order_by(User.id). \
            #            options(joinedload('permissions')).all()
        #return users
        return None
        
    def index(self, class_name):
        if isinstance(class_name, User):
            with transaction.manager:
                users = [user.id for user in DBSession.query(User).all()]
                #rint [("User: %s class: %s") % (user.serialize, class_name.serialize) for user in users if user == class_name]
                return users.index(class_name.id)
        elif isinstance(class_name, Permission):
            with transaction.manager:
                permissions = DBSession.query(Permission).all()
                return permissions.index(class_name)
    
        return -1

    def delete(self, j_user):
        pass
    
    def _is_valid(user):
        """
        Check the validity of a user instance returning true 
        if valid, otherwise false
        """
        if user.username and user.id and user.first_name and user.last_name:
            return True
    
        return False


class GroupController(ApiController):
    """
    Class to handle all Group operations such as creation, read, update and Delete
    """
    id = None
    name = None
    created_date = None
    created_by = None
    modified_by = None
    modified_date = None

    def create(self, j_group):
        """
        Create a new Group
        """
        try:
            name = j_group.pop("group.name")
            created_by = j_group.pop("group.created_by")
            created_date = j_group.pop("group.creation_date") \
              if "group.creation_date" in j_group else None 
            modified_by = j_group.pop("group.modified_by") 
            modified_date = j_group.pop("group.modified_date") \
              if "group.modified_date" in j_group else None
        except KeyError as err:
            print err, j_group
            raise KeyError()

        group = Group(name)
        group.created_by = User.get_by_username(created_by)
        group.modified_by = User.get_by_username(modified_by)
        group.created_by = group.created_by.id
        group.modified_by = group.modified_by.id
        created_date = datetime.now()
        group.created_date = created_date
        group.modified_date = created_date

        with transaction.manager:
            DBSession.add(group)
            transaction.commit()
     
    def update(self, j_group):
        """
        Update an existing Group
        """
        try:
            id = j_group.pop("id")
            name = j_group.pop("name")
        except KeyError as err:
            print err
            raise KeyError 
        
        with transaction.manager:
            group = DBSession.get()

    def get(self, **kwargs):
        return DBSession.query(Group).all()

    def delete(self, j_group):
        try:
            name = j_group.pop("group.name")
            id = j_group.pop("group.id")
        except KeyError as err:
            print err
            raise KeyError()
        with transaction.manager:
            DBSession.delete()

class PermissionController(ApiController):
    permission_id = permission_name = permission_description = None
    def __init__(self, **kwargs):
        p_id = kwargs.pop("permission_id", None)
        p_name = kwargs.pop("permission_name", None)

    def create(self, j_permission):
        pass
    
    def update():
            pass
    
        print "Implementing save"
    
    @cache_region("hour", "permissions")
    def _all(self):
        with transaction.manager: 
            return DBSession.query(Permission). \
                                  order_by(Permission.id).all()
 
    def get(self, *args, **kwargs):
        return self._all()
   
    def delete(self, j_permission):
        pass
