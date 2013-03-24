
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

from zope.sqlalchemy import ZopeTransactionExtension
from pyramid.security import (
  Allow,
  Everyone,
  )

from scm.util import dump_datetime
from .meta import Base
from scm.models import Requisition

local_purchase_order_requisitions = Table(u"local_purchase_order_requisitions", 
  Base.metadata,
  Column(u"local_purchase_order_id", Integer, ForeignKey("local_purchase_orders.id")),
  Column(u"requisition_id", Integer, ForeignKey("requisitions.id")),
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
    voided = Column(Boolean, default = False)
    local_purchase_order_items = relationship("LocalPurchaseOrderItem")
    requisitions = relationship("Requisition", \
      secondary = local_purchase_order_requisitions, backref = "local_purchase_orders")

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

