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

class LocationType(Base):
    __tablename__ = "location_types"
    id = Column(Integer, Sequence("location_type_id_seq"), primary_key = True)
    name = Column(String(50), nullable = False)
    description = Column(Text, nullable = True)

    def __init__(self, name):
        self.name = name

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, Sequence("location_id_seq"), primary_key = True)
    name = Column(String, nullable = False)
    location_type = Column(Integer, ForeignKey("location_types.id"))
    parent = Column(Integer, ForeignKey("locations.id"), nullable = True)
    
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "<Location: %d, %s>" % (self.id, self.name)

    def __dict__(self):
        return

