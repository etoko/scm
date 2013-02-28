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
