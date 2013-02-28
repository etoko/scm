
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

