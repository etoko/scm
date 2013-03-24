#!/usr/bin/env python
#
__author__ = "Emmanuel Toko <http://emmanueltoko.blogspot.com>"

from abc import ABCMeta, abstractmethod

class ApiController:
    """
    Abstract class that must be implemented by all Classes that intend to 
    manipulate the Models
    
    Abstract class contains methods to carry out CRUD - Create, Read, Update and 
    Delete operations on models
    """
    __metaclass__ = ABCMeta

    @abstractmethod
    def create():
            pass
    
    def update():
            pass
    
    @abstractmethod
    def get(self, *args, **kwargs):
        pass
    
    @abstractmethod
    def delete(self, j_permission):
        pass
