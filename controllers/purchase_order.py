#!env python

from scm.models import DBSession, LocalPurchaseOrder
from . import ApiController

class LocalPurchaseOrder(ApiController):
    """
    Class handles all CRUD operations on LocalPurchaseOrder instances
    """

    id = 0
    department = None
    prepared_date = None
    delivery_date = None
    delivery_location = None
    supplier = None
    status = None
    created_by = None
    created_date = None
    modified_by = None
    modified_date = None

    def _set_attributes(j_l_purchase_order):
        id = j_l_purchase_order.pop("l_purchase_order.id")
        department = j_l_purchase_order.pop("l_purchase_order.department")
        prepared_date = j_l_purchase_order.pop("l_purchase_order.prepared_date")
        delivery_date = j_l_purchase_order.pop("l_purchase_order.delivery_date")
        delivery_location = j_l_purchase_order.pop("l_purchase_order.delivery_location")
        supplier = j_l_purchase_order.pop("l_purchase_order.supplier")
        status = j_l_purchase_order.pop("l_purchase_order.status")
        created_by = j_l_purchase_order.pop("l_purchase_order.created_by")
        created_date = j_l_purchase_order.pop("l_purchase_order.created_date")
        modified_by = j_l_purchase_order.pop("l_purchase_order.modified_by")
        modified_date = j_l_purchase_order.pop("l_purchase_order.modified_date")
    
    def _is_valid(j_l_purchase_order):
        if not j_l_purchase_order:
            return False
        _set_attributes(j_l_purchase_order)
        return True if self.id >= -1 else False

    def _set_purchase_order(purchase_order):
        purchase_order.department = self.department 
        purchase_order.preparted_date = self.prepared_date 
        purchase_order.delivery_date = self.delivery_date 
        purchase_order.delivery_location = self.delivery_location 
        purchase_order.supplier = self.supplier 
        purchase_order.status = self.status 
        purchase_order.created_by = self.created_by 
        purchase_order.created_date = self.created_date 
        purchase_order.modified_by = self.modified_by 
        purchase_order.modified_date = self.modified_date
        return purchase_order

    def save(self, j_l_purchase_order):
        if not _is_valid(j_l_purchase_order):
            raise KeyError("Invalid Purchase Order submitted")
       
        _create() if self.id == -1 else _update()

        def _create():
            purchase_order = _set_purchase_order(LocalPurchaseOrder())
            
            with transaction.manager:
                DBSession.add(purchase_order)
                transaction.commit()

        def _update():
            purchase_order_id = self.id
            purchase_order = _set_purchase_order(get({"id": purchase_order_id}))
            
            with transaction.manager:
                DBSession.merge(purchase_order)
                transaction.commit()

    def get(self, **kwargs):
        try:
            purchase_order_id = kwargs.pop("id");
        except KeyError as err:
            raise KeyError()
    def delete(self, j_l_purchase_order):
        pass

