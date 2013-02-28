
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
from scm.models import Base

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

