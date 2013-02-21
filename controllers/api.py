#!/usr/bin/env python
#
__author__ = "Emmanuel Toko <http://emmanueltoko.blogspot.com>"

from abc import ABCMeta, abstractmethod

class ApiController:
    __metaclass__ = ABCMeta

    @abstractmethod
    def save(self, j_permission):
        def _create():
            pass
    
        def _update():
            pass
    
        assert False, ""
    
    @abstractmethod
    def get(self, *args, **kwargs):
        pass
    
    @abstractmethod
    def delete(self, j_permission):
        pass
