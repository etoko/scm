#!/usr/bin/env python

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
from sqlalchemy.orm import relationship, backref, column_property
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension
from pyramid.security import (
  Allow,
  Everyone,
  )

from ims.util import dump_datetime

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

class RootFactory(object):
    __acl__ = [ (Allow, Everyone, "view"), (Allow, "group:editors", "edit") ]
    def __init__(self, request):
        pass


class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=True)
    value = Column(Integer)

    def __init__(self, name, value):
        self.name = name
        self.value = value

    def __unicode__(self):
        return ("%s, %s") % (self.name, self.value)
    
    def str(self):
        return ("%s, %s") % (self.name, self.value)
    
    @property
    def to_dict(self):
        return ("%s, %s") % (self.name, self.value)


class LocationType(Base):
    __tablename__ = "location_types"
    id = Column(Integer, Sequence("location_type_id_seq"), primary_key = True)
    name = Column(String(50), nullable = False)
    description = Column(Text, nullable = True)

    def __init__(self, name):
        self.name = name

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, Sequence("location_id_seq"), primary_key = True)
    name = Column(String, nullable = False)
    location_type = Column(Integer, ForeignKey("location_types.id"))
    parent = Column(Integer, ForeignKey("locations.id"), nullable = True)
    
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "<Location: %d, %s>" % (self.id, self.name)

    def __dict__(self):
        return

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

class User(Base):
   
    __tablename__ = u"users"
    
    id = Column(u"id", Integer, Sequence("user_id_seq"), primary_key = True)
    username = Column(u"username", String(16), nullable = False)
    first_name = Column(u"first_name", String(20), nullable = False)
    last_name = Column(u"last_name", String(50), nullable = False)
    other_name = Column(u"other_name", String(50), nullable = True)
    fullname = column_property(first_name + " " + last_name)
    email_address = Column(u"email_address", String(60))
    password = Column(u"password", String(150), nullable = False)
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

    def __init__(self, username, first_name, last_name, is_staff=False, \
                 is_active=False, last_login = datetime.now()):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = ""
        self.password = ""
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

class Group(Base):
   """
    
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


class Supplier(Base):
    
    __tablename__ = "suppliers"

    id = Column("id", Integer, Sequence("supplier_id_seq"), primary_key = True)
    name = Column("name", String)
    created_by = Column(Integer, ForeignKey("users.id"), nullable = True)
    created_on = Column(DateTime, default = datetime.now())
    modified_by = Column(Integer, ForeignKey("users.id"), nullable = True)
    modified_on = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    branches = relationship("SupplierBranch")

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "<Supplier: %d, %s>" % (self.id, self.name)

    __table_args__ = (UniqueConstraint("name"),)

    @property
    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "created_by":  self.created_by,
            "created_on":  dump_datetime(self.created_on),
            "modified_by": self.modified_by,
            "modified_on": dump_datetime(self.modified_on),
        }


class SupplierBranch(Base):

    __tablename__ = "supplier_branches"

    id = Column(Integer, Sequence("supplier_branch_id_seq"), primary_key = True)
    supplier = Column(Integer, ForeignKey("suppliers.id"), nullable = False)
    street_address = Column("street_address", String)
    tel_1 = Column("tel_1", String(20))
    tel_2 = Column("tel_2", String(20))
    email_address = Column("email_address", String, nullable = True)
    website = Column(String(30), nullable = True)
    #city = 
    items = relationship("Item")
 
    def __init__(self, supplier_id): 
       self.supplier = supplier_id
    
    def __repr__(self):
        return "<SupplierBranch: %d, supplier: %s %s>" % \
                (self.id, self.supplier, self.street_address)

    @property
    def to_dict(self):
        """
        Return a dictionary of a branch's attributes
        """
        return {
        "id":             self.id,
        "supplier":       self.supplier,
        "street_address": self.street_address,
        "tel_1":          self.tel_1,
        "tel_2":          self.tel_2,
        "email_address":  self.email_address,
        "website":        self.website
        }

class Item(Base):

    __tablename__ = "items"

    id = Column(Integer, Sequence("item_id_seq"), primary_key = True)
    name = Column(String(50))
    unit_of_measurement = Column(String(50))
    category = Column(ForeignKey("item_categories.id"))
    vat_inclusive = Column(Boolean)
    created_by = Column(ForeignKey("users.id"))
    created_on = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_on = Column(DateTime, default = datetime.now(), 
      onupdate = datetime.now())
    supplier = Column(Integer, ForeignKey("supplier_branches.id"))

    def __init__(self, name, supplier):
        self.name = name
        self.supplier = supplier

    def __repr__(self):
        return "<Item: %d, %s>" % (self.id, self.name,)

    @property
    def to_dict(self):
        return {
            "id":                  self.id,
            "name":                self.name,
            "unit_of_measurement": self.unit_of_measurement,
            "supplier":            self.supplier.to_dict,
            "category":            self.category.to_dict,
            "vat_inclusive":       self.vat_inclusive,
            "created_by":          self.created_by,
            "created_on":          self.created_on,
            "modified_by":         self.modified_by,
            "modified_date":       self.modified_on
        }

class Department(Base):
    """
    department - object representation of the department table

    This class contains data represents as a row in the department table
    """    
    __tablename__ = "departments"
    
    id = Column(Integer, Sequence("department_id_seq"), primary_key = True)
    name = Column(String(30), nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_on = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_on = Column(DateTime, default = datetime.now())

    department_items = relationship("DepartmentItem")

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "<Department: %d %s>" % (self.id, self.name,)

    @property
    def to_dict(self):
        """
        Flatten model for JSON use
        """
        return {
            "id":          self.id,
            "name":        self.name,
            "created_by":  self.created_by,
            "created_on":  self.created_on,
            "modified_by": self.modified_by,
            "modified_on": self.modified_on
        }

class ItemCategory(Base):

    __tablename__ = "item_categories"

    id = Column(Integer, Sequence("item_category_id_seq"), primary_key = True)
    name = Column(String(30), nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_on = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_on = Column(DateTime, default = datetime.now(), onupdate = datetime.now())


class DepartmentItem(Base):

    __tablename__ = "department_items"

    id = Column(Integer, Sequence("department_item_id_seq"), primary_key = True)
    item = Column(ForeignKey("items.id"), nullable = False)
    department = Column(ForeignKey("departments.id"), nullable = False)
    quantity = Column(Integer, nullable = False)
    
    __table_args__ = (
        UniqueConstraint("item", "department"),
    )


class Status(Base):

    __tablename__ = "status"
    
    id = Column("id", Integer, Sequence("status_id_seq"), primary_key = True)
    name = Column("name", String)
    created_on = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_on = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = True)


class History(Base):

    __tablename__ = "history"

    id = Column(Integer, Sequence("history_id_seq"), primary_key = True)
    action_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())
    username = Column(ForeignKey("users.id"))
    action = Column(String(100))
    before = Column(Text)
    after = Column(Text)


class Bank(Base):

    __tablename__ = "banks"

    id = Column(Integer, Sequence("bank_id_seq"), primary_key = True)
    name = Column(String(50), nullable = False)
    website = Column(String(50), nullable = True)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    branches = relationship("BankBranch")

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "<Bank: %d %s>" % (self.id, self.name, )
 
    @property
    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "website":     self.website,
            "created_by":  self.created_by,
            "created_on":  dump_date(self.created_on),
            "modified_by": self.modified_on,
            "modified_on": dump_datetime(self.modified_on)
        }


class BankBranch(Base):

    __tablename__ = "bank_branches"

    id = Column(Integer, Sequence("bank_branch_id_seq"), primary_key = True)
    name = Column(String(50), nullable = False)
    bank = Column(ForeignKey("banks.id"))
    address = Column(Text)
    phone = Column(String(30))
    email_address = Column(String(50))

    def __init__(self):
        pass


class DeliveryNote(Base):
   
    __tablename__ = "delivery_notes"

    id = Column(Integer, Sequence("delivery_note_id_seq"), primary_key = True)
    local_purchase_order = Column(ForeignKey("local_purchase_orders.id"))
    location  = Column(ForeignKey("locations.id"))
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    delivery_note_items = relationship("DeliveryNoteItem")
   
class DeliveryNoteItem(Base):

    __tablename__ = "delivery_note_items"

    id = Column(Integer, Sequence("delivery_note_item_id_seq"), primary_key = True)
    delivery_note = Column(ForeignKey("delivery_notes.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer, nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    __table_args__ = ( 
        UniqueConstraint("delivery_note", "department_item"),
    )   


class GoodsReceivedNote(Base):

    __tablename__ = "goods_received_notes"

    id = Column(Integer, Sequence("goods_received_note_id_seq"), primary_key = True)
    local_purchase_order = Column(ForeignKey("local_purchase_orders.id"))
    received_by = Column(ForeignKey("users.id"))
    received_date = Column(DateTime, default = datetime.now())
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    goods_received_items = relationship("GoodsReceivedNoteItem")


class GoodsReceivedNoteItem(Base):

    __tablename__ = "goods_received_note_items"

    id = Column(Integer, Sequence("goods_received_note_item_id_seq"), primary_key = True)
    goods_received_note = Column(ForeignKey("goods_received_notes.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer, nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    __table_args__ = ( 
        UniqueConstraint("goods_received_note", "department_item"),
    )   


class GoodsReturnedNote(Base):

    __tablename__ = "goods_returned_notes"

    id = Column(Integer, Sequence("goods_returned_note_id_seq"), primary_key = True)
    delivery_note = Column(ForeignKey("delivery_notes.id"))
    returned_by = Column(ForeignKey("users.id"))
    returned_date = Column(DateTime, default = datetime.now())
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    goods_returned_items = relationship("GoodsReturnedNoteItem")

    def __init__(self, delivery_note):
        self.delivery_note = delivery_note

    def __repr__(self):
        return "<goods_returned_note>"


class GoodsReturnedNoteItem(Base):

    __tablename__ = "goods_returned_note_items"

    id = Column(Integer, Sequence("goods_received_note_item_id_seq"), primary_key = True)
    goods_returned_note = Column(ForeignKey("goods_returned_notes.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer, nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = \
      Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    __table_args__ = (
        UniqueConstraint("goods_returned_note", "department_item"),
    )


class LocalPurchaseOrder(Base):

    __tablename__ = "local_purchase_orders"

    id = Column("id", Integer, Sequence("local_purchase_order_id_seq"), primary_key=True)
    department = Column(Integer, ForeignKey("departments.id"))
    prepared_date = Column("prepared_date", DateTime, onupdate=datetime.now())
    delivery_date = Column("delivery_date", DateTime, onupdate=datetime.now())
    delivery_location = Column(Integer, ForeignKey("locations.id"))
    supplier = Column(ForeignKey("suppliers.id"))
    status = Column(Integer, ForeignKey("status.id"))
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())
    local_purchase_order_items = relationship("LocalPurchaseOrderItem")

    @property
    def to_dict(self):
        return {
          "id":                         self.id,
          "department":                 self.department,
          "prepared_date":              self.prepared_date,
          "delivery_date":              self.delivery_date ,
          "delivery_location":          self.delivery_location,
          "supplier":                   self.supplier,
          "status":                     self.status,
          "created_by":                 self.created_by,
          "created_date":               dump.datetime(self.created_date),
          "modified_by":                self.modified_by,
          "modified_date":              self.modified_date,
          "local_purchase_order_items": \
            [item.to_dict for item in self.local_purchase_order_items],
          }


class LocalPurchaseOrderItem(Base):
    
    __tablename__ = "local_purchase_order_item"
    
    id = Column("id", Integer,
           Sequence("local_purchase_order_item_id_seq"), primary_key = True)
    local_purchase_order = \
           Column(Integer, ForeignKey("local_purchase_orders.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer, nullable=False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, onupdate=datetime.now())

    __table_args = ( 
        UniqueConstraint("local_purchase_order", "department_item"),)   
   
    @property
    def to_dict(self):
        return {
          "id":                   self.id,
          "local_purchase_order": self.local_purchase_order,
          "department_item":      self.department_item,
          "quantity":             self.quantity,
          "created_by":           self.created_by,
          "created_date":         self.created_date,
          "modified_by":          self.modified_by,
          "modified_date":        self.modified_date
          }


class Requisition(Base):

    __tablename__ = "requisitions"

    id = Column(Integer, Sequence("requisition_id_seq"), primary_key = True)
    request_date = Column(DateTime, default = datetime.now())
    expected_date = Column(DateTime)
    department = Column(ForeignKey("departments.id"))
    requested_by = Column(ForeignKey("users.id"))
    recommended_by = Column(ForeignKey("users.id"))
    recommended_date = Column(DateTime, default = datetime.now())
    approved_by = Column(ForeignKey("users.id"))
    approved_date = Column(DateTime, default = datetime.now())
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = Column(DateTime, default = datetime.now(), onupdate = datetime.now())
    requisition_items = relationship("RequisitionItem")

    @property
    def to_dict(self):
        return {
          "id": self.id,
          "request_date":      self.request_date,
          "expected_date":     self.expected_date,
          "department":        self.department,
          "requested_by":      self.requested_by,
          "recommended_by":    self.recommended_by,
          "recommended_date":  self.recommended_date,
          "approved_by":       self.approved_by,
          "approved_date":     self.approved_date,
          "created_by":        self.created_by,
          "created_date":      self.created_date,
          "modified_by":       self.modified_by,
          "modified_date":     self.modified_date,
          "requisition_items": \
            [item.to_dict for item in self.requisition_items]
          }


class RequisitionItem(Base):

    __tablename__ = "requisition_items"

    id = Column(Integer, Sequence("requisition_item_id"), primary_key = True)
    requisition = Column(ForeignKey("requisitions.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = \
      Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    __table_args__ = (
        UniqueConstraint("requisition", "department_item"),)

    @property
    def to_dict(self):
        return {
          "id":              self.id,
          "requisition":     self.requisition,
          "department_item": self.department_item,
          "quantity":        self.quantity,
          "created_by":      self.created_by,
          "created_date":    self.created_date,
          "modified_by":     self.modified_by,
          "modified_date":   self.modified_date
          }


class StoresIssueNote(Base):

    __tablename__ = "stores_issue_notes"

    id = Column(Integer, Sequence("stores_issue_note_id"), primary_key = True)
    requisition = Column(ForeignKey("requisitions.id"))
    issued_to = Column(ForeignKey("users.id"))
    issued_date = Column(DateTime, default = datetime.now())
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = \
      Column(DateTime, default = datetime.now(), onupdate = datetime.now())
    store_issue_items = relationship("StoresIssueNoteItem")

    @property
    def to_dict(self):
        return {
          "id":                self.id,
          "requisition":       self.requisition,
          "issued_to":         self.issued_to,
          "issue_date":        self.issue_date,
          "created_by":        self.created_by,
          "created_date":      dump_datetime(self.created_date),
          "modified_by":       self.modified_by,
          "modified_date":     dump_datetime(self.modified_date),
          "store_issed_items": [item.to_dict for item in store_issue_items]
          }


class StoresIssueNoteItem(Base):

    __tablename__ = "stores_issue_note_items"
    
    id = \
      Column(Integer, Sequence("stores_issue_note_item_id"), primary_key = True)
    stores_issue_note = Column(ForeignKey("stores_issue_notes.id"))
    department_item = Column(ForeignKey("department_items.id"))
    quantity = Column(Integer, nullable = False)
    created_by = Column(ForeignKey("users.id"))
    created_date = Column(DateTime, default = datetime.now())
    modified_by = Column(ForeignKey("users.id"))
    modified_date = \
      Column(DateTime, default = datetime.now(), onupdate = datetime.now())

    __table_args__ = ( 
        UniqueConstraint("stores_issue_note", "department_item"),
    )   

    @property
    def to_dict(self):
        return {
          "id":                self.id,
          "stores_issue_note": self.store_issue_note,
          "department_item":   self.department_item,
          "quantity":          self.quantity,
          "created_by":        self.created_by,
          "created_date":      self.created_date,
          "modified_by":       self.modified_by,
          "modified_date":     self.modified_date
         }
