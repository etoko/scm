
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

