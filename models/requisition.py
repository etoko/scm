from .meta import Base

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
    void = Column(Boolean, default = False)
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

