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

from zope.sqlalchemy import ZopeTransactionExtension
from pyramid.security import (
  Allow,
  Everyone,
  )

from scm.util import dump_datetime
from .meta import Base
from .meta import DBSession
from .user import User, Permission, Group
from location import Location
from .supplier import Supplier, SupplierBranch
from .store_issue import StoresIssueNote, StoresIssueNoteItem
from .requisition import Requisition, RequisitionItem
from .department import Department
from delivery_note import DeliveryNote
from .purchase_order import LocalPurchaseOrder
from .goods_received import GoodsReceivedNote
from .goods_returned import GoodsReturnedNote, GoodsReturnedNote
from .item import Item
from purchase_order import LocalPurchaseOrder, LocalPurchaseOrderItem

class RootFactory(object):
    __acl__ = [ (Allow, Everyone, "view"), (Allow, "group:editors", "edit") ]
    def __init__(self, request):
        pass

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

