
from datetime import datetime

from sqlalchemy import (
    Column,
    Boolean,
    Integer,
    Text,
    Sequence,
    DateTime,
    String,
    ForeignKey,
    Table,
    UniqueConstraint,
    )
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import ( 
     relationship, backref, 
     column_property,
     synonym,
     )

from sqlalchemy.types import (
    Unicode, UnicodeText)

from zope.sqlalchemy import ZopeTransactionExtension
from pyramid.security import (
  Allow,
  Everyone,
  authenticated_userid,
  remember,
  forget,
  )

import cryptacular.bcrypt

from scm.util import dump_datetime
from .meta import Base, DBSession

user_groups = Table(u"user_groups", Base.metadata,
  Column(u"user_id", Integer, ForeignKey("users.id")),
  Column(u"group_id", Integer, ForeignKey("groups.id"))
  )

user_permissions = Table(u"user_permissions", Base.metadata,
  Column(u"user_id", Integer, ForeignKey("users.id")),
  Column(u"permission_id", Integer, ForeignKey("permissions.id"))
  )

group_permissions = Table(u"group_permissions", Base.metadata,
  Column(u"group_id", Integer, ForeignKey("groups.id")),
  Column(u"permission_id", Integer, ForeignKey("permissions.id"))
  )

crypt = cryptacular.bcrypt.BCRYPTPasswordManager()

def hash_password(password):
    return unicode(crypt.encode(password))

class User(Base):
   
    __tablename__ = u"users"
    
    id = Column(u"id", Integer, Sequence("user_id_seq"), primary_key = True)
    username = Column(u"username", String(16), nullable = False, unique = True)
    first_name = Column(u"first_name", String(20), nullable = False)
    last_name = Column(u"last_name", String(50), nullable = False)
    other_name = Column(u"other_name", String(50), nullable = True)
    fullname = column_property(first_name + " " + last_name)
    email_address = Column(u"email_address", String(60))
#    password = Column(u"password", String(150), nullable = False)
    is_staff = Column(u"is_staff", Boolean, nullable = False)
    is_superuser = Column(u"is_superuser", Boolean, nullable = False)
    theme = Column(String(30), default = "claro", nullable = True)
    last_login = Column(u"last_login", DateTime, default = datetime.now(), 
      nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(u"created_date", DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(u"modified_date", DateTime, 
      default = datetime.now(), onupdate = datetime.now())
    position = 0
 
    groups = relationship("Group", secondary = user_groups, backref = "users")
    permissions = relationship("Permission", secondary = user_permissions,
      backref = "users")
    _password = Column('password', Unicode(60))

    def _get_password(self):
        return self._password

    def _set_password(self, password):
        self._password = hash_password(password)

    password = property(_get_password, _set_password)
    password = synonym('_password', descriptor=password)

    def __init__(self, username, first_name, last_name, is_staff=False, \
                 is_active=False, is_superuser=False, last_login = datetime.now()):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = ""
        self.password = "editor"
        self.is_staff = is_staff
        self.is_active = is_active
        self.last_login = last_login

    def __repr__(self):
        return "<User: '%s', '%s', '%s'>" % (self.username, self.first_name, 
          self.last_name)

    __table_args__ = (UniqueConstraint("username", "email_address"),)

    @property
    def to_dict(self):
        """
        flatten model to dict. suitable for use in jsonification
        """
        return {
          "id":            self.id,
          "username":      self.username,
          "first_name":    self.first_name,
          "last_name":     self.last_name,
          "full_name":     self.fullname,
          "email_address": self.email_address,
          "password":      self.password,
          "is_staff":      self.is_staff,
          "is_superuser":  self.is_superuser,
          "theme":         self.theme,
          "last_login":    dump_datetime(self.last_login),
          "position":      self.position,
          "permissions":   [permission.to_dict for permission in self.permissions]
          }
    
    @classmethod
    def get_by_username(cls, username):
        return DBSession.query(cls).filter(cls.username == username).first()

    @classmethod
    def check_password(cls, username, password):
        user = cls.get_by_username(username)
        if not user:
            return False
        return crypt.check(user.password, password)
 

class Group(Base):
    """
    Groups 
    """ 
    __tablename__ = "groups"
    
    id = Column("id", Integer, Sequence("group_id_seq"), primary_key = True)
    name = Column("name", String(30), nullable = False)
    created_by = Column("created_by", Integer, ForeignKey("users.id"))
    creation_date = Column(DateTime, onupdate = datetime.now())
    modified_by = Column(u"modified_by", Integer, ForeignKey("users.id"))
    modified_date = Column(u"modified_date", DateTime, 
      default = datetime.now(), onupdate = datetime.now())

    permissions = relationship("Permission", secondary = group_permissions,
      backref = "groups")

    def __init__(self, name):
        self.name = name
    
    def __repr__(self):    
        return "<Group %d %s>" % (self.id, self.name,)
    @property
    def to_dict(self):
        return {
               "id":            self.id,
               "name":          self.name,
               "created_by":    self.created_by,
               "creation_date": dump_datetime(self.creation_date),
               "modified_by":   self.modified_by,
               "modified_date": dump_datetime(self.modified_date)
               }


class Permission(Base):
    """
    Permissions - List of priviliges that are contained in the system

    This lists all the permissions that a user/group has. By default, groups
    will be given a specified list of permissions. These can be overridden by
    custom assigning a user a given list of selected permissions.
    """
    __tablename__ = "permissions"

    id = Column(Integer, Sequence("permission_id_seq"), primary_key = True)
    name = Column(u"name", String(50), nullable = False)
    description = Column(u"description", String(100), nullable = False)
    
    @property
    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "description": self.description,
        }


