
/**
 *Method creates an environment for the entry of a new DrugsIssue
 */
function newDrugsIssue()
{
    var issueNo = dijit.byId("DrugsIssue.Id");
    var prescription = dijit.byId("DrugsIssue.Prescription");
    var issuedBy = dijit.byId("DrugsIssue.IssuedBy");
    var issuedTo = dijit.byId("DrugsIssue.IssuedTo");
    var date = dijit.byId("DrugsIssue.IssueDate");
    var notes = dijit.byId("DrugsIssue.Notes");
    var grid = dijit.byId("DrugsIssue.DetailsTable");

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=add",
        load: function(response)
        {
            var results = dojo.fromJson(response);
            issueNo.setValue(0);
            prescription.setValue("");
            issuedBy.setValue(results.name);
            date.setValue(results.date);
            issuedTo.setValue("");
            notes.setValue("");
            var store = new dojo.data.ItemFileWriteStore({url: "resources/json/drugsissue.json"})
            grid.setStore(store);
            dojo.publish("/saved",[{message: "<font size='2'><b>Enter New Drugs Issue", type: "info", duration: 15000}]);
        },
        error: function(response)
        {

        }
    });
} //End of method newDrugsIssue

/**
 * Function navigates to the first DrugsIssue entity.
 */
function firstDrugsIssue()
{
    var position = 0;
    
    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=first",
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            populateDrugsIssueControls(issue, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced" +
                    " a problem: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function firstDrugsIssue

/**
 *Function navigates to the previous DrugsIssue
 */
function previousDrugsIssue()
{
    var position = dojo.cookie("CurrentDrugsIssue");

    if ((position == undefined) || (position == null))
    {
            position = 0;
    }

    position = Math.abs(position);
    position = position - 1;

    if (position < 0)
    {
        dojo.byId("NavigationInformation").innerHTML = "You have reached the " +
            "first drugs Issue!";

        dijit.byId("NavigationDialog").show();
        
        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            populateDrugsIssueControls(issue, position);
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function previousDrugsIssue

/**
 *Function navigates to the next DrugsIssue
 */
function nextDrugsIssue()
{
    var position = dojo.cookie("CurrentDrugsIssue");
    var size = dojo.cookie("DrugsIssueSize");
    
    if ((position == undefined) || (position == null))
    {
            position = 0;
    }

    if ((size == undefined) || (size == null))
    {
            size = 0;
    }

    position = Math.abs(position);
    position = position + 1;
    size = Math.abs(size);
    
    if (position >= size)
    {
        dojo.byId("NavigationInformation").innerHTML = "You have reached the " +
            "last drugs Issue!";

        dijit.byId("NavigationDialog").show();

        lastDrugsIssue();
        
        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            populateDrugsIssueControls(issue, position);
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function previousDrugsIssue

/**
 * Function navigates to the last DrugsIssue entity.
 */
function lastDrugsIssue()
{
    var position = 0;

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=last",
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            position = Math.abs(issue.size) - 1;
            populateDrugsIssueControls(issue, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced" +
                    " a problem: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function lastDrugsIssue

/**
 * Function retrieves the details of a prescription and populates the drugs 
 * issue table.
 */
function drugsIssueGetPrescriptionById(prescriptionId, patient, patientId)
{
    var grid = dijit.byId("DrugsIssue.DetailsTable");
    var prescription = dijit.byId("DrugsIssue.Prescription");
    var issuedTo = dijit.byId("DrugsIssue.IssuedTo");
    var issuedToId = dojo.byId("DrugsIssue.IssuedToId");

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=findByPK&output=JSON&id=" + prescriptionId,
        load: function(response)
        {
            var results = dojo.fromJson(response);
            var store = new dojo.data.ItemFileWriteStore({data: results});

            issuedTo.setValue(patient);
            issuedToId.innerHTML = patientId;
            prescription.setValue(prescriptionId);
            grid.setStore(store);
            dijit.byId("DrugsIssuePrescriptionsList").hide();
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function drugsIssueGetPrescriptionById

/**
 * Function saves or updates a DrugsIssue
 */
function saveDrugsIssue()
{
    var issueId = dijit.byId("DrugsIssue.Id").getValue();
    var notes = dijit.byId("DrugsIssue.Notes").getValue();
    var prescriptionId = dijit.byId("DrugsIssue.Prescription").getValue();

    prescriptionId = prescriptionId.toString();

    if ((prescriptionId == "") || (prescriptionId == "NaN"))
    {
        dojo.byId("InformationMessage").innerHTML = "Please ensure that you have selected a Drugs Issue";
        dijit.byId("InformationMessageDialog").show();

        return;
    }
    
    var grid = dijit.byId("DrugsIssue.DetailsTable");
    
    var value = "";
    var data = "&issueId=" + issueId + "&prescriptionId=" + prescriptionId +
        "&notes=" + notes;
    var i = 0;
    i = Math.abs(i);

    var returnedValue = null;

    var formToValidate = dijit.byId("DrugsIssue.Form");

    if (formToValidate.validate())
    {

        for (i = 0; i < 100; i++)
        {
            if (grid.getItem(i) == null)
            {
                break;
            }

            returnedValue = grid.store.getValue(grid.getItem(i), "counter");
            if ((returnedValue == "") || (returnedValue == null))
            {
                continue;
            }

            value = value + "&drug" + i +"=" + grid.store.getValue(grid.getItem(i), "itemId");
            value = value + "&quantity" + i +"=" + grid.store.getValue(grid.getItem(i), "quantity");
            value = value + "&dose" + i +"=" + grid.store.getValue(grid.getItem(i), "dosage");
            value = value + "&detailId" + i +"=" + grid.store.getValue(grid.getItem(i), "detailId");
            data = data + value;
        }

        dojo.publish("/saving",[{message: "<font size='2'><b>Saving...", type: "info", duration: 5000}]);

        var position = dojo.cookie("CurrentDrugsIssue");

        dojo.xhrPost(
        {
            url: "servlets/drugsIssueManager?operationType=save" + data,
            load: function(response)
            {
                var issue = dojo.fromJson(response);

                if (position.toString() == "NaN")
                {
                    position = Math.abs(issue.size) - 1;
                }

                position = Math.abs(issue.size) - 1;
//                var data = issue.issueId + issue.prescriptionId + issue.issuedBy
//                     + issue.issuedTo + issue.issuedDate + issue.notes;
                populateDrugsIssueControls(issue, position);
                dojo.publish("/saved",[{message: "<font size='2'><b>...Saved", type: "info", duration: 10000}]);
            },
            error: function (response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...encountered an error: " + response, type: "error", duration: 5000}]);
            }
        });
    }
    
} //End of function saveDrugsIssue

/**
 * Function searches for and returns a Drugs Issue (if it is available) or informs
 * the user that the Drugs Issue is unavailable
 */
function findDrugsIssue()
{
    var id = dijit.byId("DrugsIssue.SearchKeywords").getValue();
    dojo.byId("DrugsIssue.SearchResults").innerHTML = "<b>Searching...";
    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=get&output=JSON&id=" + id,
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            var issueId = issue.issueId;

            if (issueId.toString() ==  "null")
            {
                dojo.byId("DrugsIssue.SearchResults").innerHTML =
                    "<b><img src='resources/images/dialog-warning.png'> &nbsp;"+
                    "Did not find Drugs Issue with Id: " + id;
                
                return;
            }

            var position = 0;
            populateDrugsIssueControls(issue, position);
            dijit.byId("DrugsIssue.SearchDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "Experienced a problem",
                    type: "error", duration: 5000}]);
        }
    });
} //End of function findDrugsIssue

/**
 * Function refreshes up a Drugs Issue and returns its most up-to-date data.
 */
function refreshDrugsIssue()
{
    var id = dijit.byId("DrugsIssue.Id").getValue();

    id = id.toString();

    if ((id == "") || (id == "NaN")|| (id == "0"))
    {
        dojo.byId("InformationMessage").innerHTML = "Please ensure that you have\n\
            selected a Drugs Issue";
        dijit.byId("InformationMessageDialog").show();

        return;
    }

    var position = dojo.cookie("CurrentDrugsIssue");
    position = Math.abs(position);
    
    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=get&output=JSON&id=" + id,
        load: function(response)
        {
            var issue = dojo.fromJson(response);
            var issueId = issue.issueId;

            if (issueId.toString() ==  "null")
            {
                dojo.byId("DrugsIssue.SearchResults").innerHTML =
                    "<b><img src='resources/images/dialog-warning.png'> &nbsp;"+
                    "Did not find Drugs Issue with Id: " + id;

                return;
            }

            populateDrugsIssueControls(issue, position);
            
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "Experienced a problem",
                    type: "error", duration: 5000}]);
        }
    });
} //ENd of function refreshDrugsIssue

function deleteDrugsIssue()
{
    var id = dijit.byId("DrugsIssue.Id");
    
    dojo.publish("/saving",[{message: "<font size='2'><b>Deleting...", type: "info", duration: 5000}]);

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=delete&id=" + id,
        load: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Deleted Drugs Issue", type: "info", duration: 10000}]);
            nextDrugsIssue();
            dijit.byId("DrugsIssue.DeleteDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function deleteDrugsIssue

function populateDrugsIssueControls(issue, position)
{
    var drugsIssueNo = dijit.byId("DrugsIssue.Id");
    var prescription = dijit.byId("DrugsIssue.Prescription");
    var issuedBy = dijit.byId("DrugsIssue.IssuedBy");
    var issuedTo = dijit.byId("DrugsIssue.IssuedTo");
    var date = dijit.byId("DrugsIssue.IssueDate");
    var notes = dijit.byId("DrugsIssue.Notes");
    var grid = dijit.byId("DrugsIssue.DetailsTable");

    drugsIssueNo.setValue(issue.issueId);
    prescription.setValue(issue.prescriptionId);
    issuedBy.setValue(issue.issuedBy);
    issuedTo.setValue(issue.issuedTo);
    date.setValue(issue.issuedDate);
    notes.setValue(issue.notes);
    
    var store = new dojo.data.ItemFileWriteStore({data: issue});
    grid.setStore(store);

    dojo.byId("DrugsIssue.Navigator").innerHTML = (position + 1) + " of " + issue.size;

    dojo.cookie("CurrentDrugsIssue", position, {expires: 5});
    dojo.cookie("DrugsIssueSize", issue.size, {expires: 5});
}//End of function populateDrugsIssueControls