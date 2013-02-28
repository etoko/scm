
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
