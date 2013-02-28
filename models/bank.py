
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


