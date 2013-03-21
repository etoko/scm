from scm.models import DBSession, Requisition

from sqlchemy.types import Boolean

class RequisitionController(ApiController):
    """
    Class manages requistion operations
    """
    id = 0
    requested_date = None
    expected_date = None
    department_id = 0
    requested_by = 0
    requested_date = None
    recommended_by = 0
    recommended_date = None
    approved_by = 0
    approved_date = None
    items = []
    created_by = 0
    created_date = None
    modified_by = 0
    modified_date = None

    def _set_attributes():
        self.id = j_requistion.pop("requisition.id")
        self.request_date = j_requisition.pop("requisition.request_date")
        self.expected_date = j_requisition.pop("requisition.expected_date")
        self.department_id = j_requisition.pop("requisition.department_id")
        self.requested_by = j_requisition.pop("requisition.requested_by")
        self.requested_date = j_requisition.pop("requisition.requested_date")
        self.recommended_by = j_requistion.pop("requistion.recommended_by")
        self.recommended_date = j_requistion.pop("requistion.recommended_date")
        self.approved_by = j_requisition.pop("requisition.approved_by")
        self.approved_date = j_reqisition.pop("requisition.approved_date")
        self.items = j_requisition.pop("requisition.items")
        self.created_by = requisition.pop("requisition.created_by")
        self.created_date = requisition.pop("requisition.created_date")
        self.modified_by = requisition.pop("requisition.modified_by")
        self.modified_date = requisition.pop("requisition.modified_date")

    def _set_requisition(requisition):
        requisition.request_date = self.request_date
        requisition.expected_date = self.expected_date
        requisition.department_id = self.department_id
        requisition.requested_by = self.requested_by
        requisition.requested_date = self.requested_date
        requisition.recommended_by = self.recommended_by
        requisition.recommended_date = self.recommended_date
        requisition.approved_by = self.approved_by
        requisition.approved_date = self.approved_date
        requisition.items = self.items
        requisition.created_by = self.created_by
        requisition.created_date = self.created_date
        requisition.modified_by = self.modified_by
        requisition.modified_date = self.modified_date
        return requisition
        
    def save(self, j_requisition):
        _set_attributes()
        if self.id == -1:
            _create()
        else:
            _update()

        def _create():
            requisition = Requisition()
            requisition = _set_requisition(requisition)

            with transaction.manager:
                DBSession.add(requisition)
                transaction.commit()
 
        def _update():
            with transaction.manager:
                requisition = DBSession.get(requisition.id)
                requisition = _set_requisition(requisition)
                DBSession.merge(requisition)
                transaction.commit()

    def get(self, **kwargs):
        try:
            id = kwargs.pop("requisition.id")
            transaction.manager:
                return DBSession.query(Requisition).get(id).first()
        except KeyError as err:
            return DBSession.query(Requisition).filter(voided = False)

    def delete(self, requisition_id):
        requisition = get(requisition_id)
        requisition.void = True

        with transaction.manager:
            DBSession.merge(requisition)
            transaction.commit()
