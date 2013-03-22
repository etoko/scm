
from scm.models import DBSession, Department

class DepartmentController(ApiController):
    """
    Class controls all CRUD operations on the Deparmtent model instances
    """
    id = 0;
    name = None
    created_by = None
    created_date = None
    modified_by = None
    modified_date = None
    items = {}

    def _set_attributes(j_department):
        self.id = j_department.pop("department.id")
        self.name = j_department.pop("department.name")
        self.created_by = j_department.pop("department.created_by")
        self.created_on = j_department.pop("department.created_on")
        self.modified_by = j_department.pop("department.modified_by")
        self.modified_date = j_department.pop("department.modified_on")
        self.items = j_department.pop("department.items")

    def _valid(j_department):
        """
        Checks the validity of the dictionary to determine whether it is valid
        "enough" to be used to create or update a Department instance
        """
        try:
            department_id = j_department.pop("department.id")
             return department_id >=-1:

        except KeyError as err:
            print err
            return False
        return False
    
    def _set_department(department):
        department.name = self.name
        department.created_by = self.created_by
        department.created_date = self.created_date
        department.modified_by = self.modified_by
        department.modified_on = self.modified_on
        department.items = self.items
        return department

    def save(self, j_department):
        """
        Function creates and updates a Department instance
        """
        _set_attributes(j_department)
        
        if self.id == -1:
            _create()
        else:
            _update()

        def _create():
            department = _set_department(Department())
            with transaction.manager:
                DBSession.add(department)
                transaction.commit()

        def _update():
            department = _set_department(get(self.id))
            
            with transaction.manager:
                DBSession.merge(department)
                transaction.commit()

    def get(self, **kwargs):
        try:
            department_id = kwargs.pop("department.id")
            return DBSession.query(Department).get(int(department_id)).first()
        except KeyError as err:
            print err
            return DBSession.query(Department).all()
        return None

    def delete(self, j_department):
        _set_attributes(j_department)
        department = get(self.id)
        department.void = True
     
        with transaction.manager:
            DBSession.merge(department)
            transaction.commit()
