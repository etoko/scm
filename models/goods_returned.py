
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

