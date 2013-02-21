/* 
 * Script handles all operations on departments such as addition of new
 * departments, updating existing departments, navigation and so on.
 */


/**
 * Function creates an environment suitable for addition of a new department
 *
 */
function newDepartment()
{
    var id = dijit.byId("Department.DepartmentId");
    var name = dijit.byId("Department.Name");
    var type = dijit.byId("Department.Type");
    var notes = dijit.byId("Department.Notes");

    dojo.xhrGet(
    {
        url: "servlets/departmentManager?operationType=add",
        load: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Enter new Department", type: "info", duration: 15000}]);
            id.setValue("");
    name.setValue("");
    type.setValue("");
    notes.setValue("");
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Failed: " + response, type: "error", duration: 15000}]);
        }
    });
} //End of function addDepartment

/**
 *Function saves a new deparment or updates an existing department
 *
 */
function saveDepartment()
{
    var formToValidate = dijit.byId("Department.Form");

    if (formToValidate.validate())
    {
        dojo.publish("/saving", [{message: "<font size='2'><b>Saving...", type: "info", duration: 15000}]);

        dojo.xhrGet(
        {
            form: "Department.Form",
            url: "servlets/departmentManager?operationType=save",
            load: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Saved", type: "info", duration: 15000}]);
                var department = dojo.fromJson(response);
                populateDepartmentControls(department);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Failed: " + response, type: "error", duration: 15000}]);
            }
        });
    }



} //End of function saveDepartment

/**
 * Function navigates to the first department
 */
function firstDepartment()
{
    dojo.xhrGet(
    {
        url: "servlets/departmentManager?operationType=first",
        load: function(response)
        {
            var department = dojo.fromJson(response);

            populateDepartmentControls(department);
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function first

/**
 * Function navigates to the previous department
 */
function previousDepartment()
{

} //End of function previousDepartment

/**
 * Function navigates to the next department
 */
function nextDepartment()
{
    
} //End of function nextDepartment

/**
 * Function navigates to the last department
 */
function lastDepartment()
{
    dojo.xhrGet(
    {
        url: "servlets/departmentManager?operationType=last",
        load: function(response)
        {
            var department = dojo.fromJson(response);
            populateDepartmentControls(department);
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function last

function populateDepartmentControls(department)
{
    var departmentName = department.name;

    if (departmentName.toString() == "none")
    {
        dojo.byId("InformationMessage").innerHTML = "There are no departments";
        dijit.byId("InformationMessageDialog").show();
        
        return;
    }

    var id = dijit.byId("Department.DepartmentId");
    var name = dijit.byId("Department.Name");
    var type = dijit.byId("Department.Type");
    var notes = dijit.byId("Department.Notes");

    id.setValue(department.departmentid);
    name.setValue(department.name);
    type.setValue(department.type);
    notes.setValue(department.notes);
} //End of function populateDepartmentControls

