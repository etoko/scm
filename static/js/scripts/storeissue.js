/* 
 * Script handles all user interface operations on store issues such as addtion
 * of new Store issues, navigation and so on
 */

/**
 * Function creates a session environment for addition of a new store issue
 */
function newStoreIssue()
{
    dijit.byId("StoresIssue.No").setValue("");
    dijit.byId("StoresIssue.Department").setValue("");
    dijit.byId("StoresIssue.IssueDate").setValue("");
    dijit.byId("StoresIssue.Notes").setValue("");

    var grid = dijit.byId("StoresIssueDetail.Table");
    var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
    grid.setStore(store);

    dojo.publish("/saved", [{message: "<b>Enter new Store Issue", type: "info", duration: 15000}]);
} //End of function newStoreIssue

function saveStoreIssue()
{
    var issueId = dijit.byId("StoresIssue.No").getValue();
    var department = dijit.byId("StoresIssue.Department").getValue();
    var issueDate = dojo.byId("StoresIssue.IssueDate").value;
    var notes = dijit.byId("StoresIssue.Notes").getValue();

    var formToValidate = dijit.byId("StoresIssue.Form");
    
    var position = 0;
    position = dojo.cookie("CurrentStoreIssue");
    position = Math.abs(position);

    if (formToValidate.validate())
    {
        dojo.publish("/saving", [{message: "<b>Saving...", type: "info", duration: 5000}]);

        var parameters = "operationType=save&StoresIssue.No=" + issueId + 
            "&StoresIssue.IssueDate=" + issueDate + "&StoresIssue.Department=" +
            department + "&StoresIssue.Notes=" + notes;
        
        dojo.xhrPost(
        {
            url: "servlets/storeIssueManager?" + parameters,
            load: function(response)
            {
                var storeIssue = dojo.fromJson(response);
                
                populateStoreIssueControls(storeIssue, position);
                dojo.publish("/saved", [{message: "<b>...Saved", type: "info", duration: 10000}]);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }
                
                dojo.publish("/saved", [{message: "<b>Experienced an error while saving" + response, type: "error", duration: 15000}]);
            }
        });
    }
} //End of function saveStoreIssue

/**
 * Function saves a store issue item.
 */
function saveStoreIssueDetail()
{
    var issueId = dijit.byId("StoresIssue.No").getValue();
    var item = dijit.byId("StoresIssueDetail.Item").getValue();
    var itemName = dojo.byId("StoresIssueDetail.Item").value;
    var detailId = dojo.byId("StoresIssue.DetailId").innerHTML;
    var quantity = dijit.byId("StoresIssueDetail.Quantity").getValue();
    
    var grid = dijit.byId("StoresIssueDetail.Table");
    var gridStore = grid.store;
    var newDetail = {StoresIssueDetailId: item, Item: itemName, quantity: quantity};
    
    var issueDetailNumber = 500; //Assume the highest row of the LPODetail table
    var i = Math.abs(0);

    var formToValidate = dijit.byId("StoresIssueDetail.Form");
    var data = "&StoreIssueId=" + issueId + "&detailId=" + detailId + 
        "&StoresIssueDetail.Item=" + item + "&StoresIssueDetail.Quantity=" + quantity;
    
    if (formToValidate.validate())
    {
        dojo.xhrGet(
        {
            url: "servlets/storeIssueDetailManager?operationType=save" + data,
            load: function(response)
            {
                for (i = 0; i < issueDetailNumber; i++)
                {
                    issueDetailNumber = issueDetailNumber + i;

                    if (grid.getItem(i) == null)
                    {
                        //Can also use the jsId of the store: StoresIssueDetailsStore
                        try
                        {
                            gridStore.newItem(newDetail);
                        }
                        catch (e)
                        {
                            alert(e);
                        }

                        dijit.byId("StoresIssue.DetailDialog").hide();
                        return;
                    }
                    else
                    {
                        var itemValue = grid.getItem(i);
                        var listItem =  itemValue.Item.toString();

                        if (listItem == itemName.toString())
                        {
                            alert(itemName + " is already in the list");
                            return;
                        }
                    }
                } //End of for statement block
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", response);
            }
        });
    }//End of if statement block
} //End of function saveStoreIssueDetail

/**
 *Function navigates to the first store issue
 */
function firstStoreIssue()
{
    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=first",
        load: function(response)
            {
                var storeIssue = dojo.fromJson(response);

                populateStoreIssueControls(storeIssue, 0);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", response);
                dojo.publish("/saved", [{message: "<b>Experienced an Error", type: "error", duration: 15000}]);
            }
    });
} //End of function firstStoreIssue

/**
 * Function navigates to the previous Store Issue
 */
function previousStoreIssue()
{
    var position = dojo.cookie("CurrentStoreIssue");

    if ((position == null) || (position == undefined))
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position - 1;

    if (position < 0)
    {
        position = 0;

        firstStoreIssue();
        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the first Store Issue!";
        dijit.byId("NavigationDialog").show();
        
        return;
    } //End of

    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=previous&position=" + position,
        load: function(response)
            {
                var storeIssue = dojo.fromJson(response);

                populateStoreIssueControls(storeIssue, position);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", response);
                dojo.publish("/saved", [{message: "<b>Experienced an error", type: "error", duration: 10000}]);
            }
    });
} //End of function previousStoreIssue

/**
 * Function navigates to the previous Store Issue
 */
function nextStoreIssue()
{
    var position = dojo.cookie("CurrentStoreIssue");

    if ((position == null) || (position == undefined))
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position + 1;

    var size = dojo.cookie("StoreIssueSize");
    size = Math.abs(size);

    if (size <= position)
    {
        lastStoreIssue();

        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the last Store Issue!";
        dijit.byId("NavigationDialog").show();

        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=previous&position=" + position,
        load: function(response)
            {
                var storeIssue = dojo.fromJson(response);

                populateStoreIssueControls(storeIssue, position);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", response);
                dojo.publish("/saved", [{message: "<b>Experienced an error", type: "error", duration: 15000}]);
            }
    });
} //End of function nextStoreIssue

/**
 *Function navigates to the last store issue
 */
function lastStoreIssue()
{
    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=last",
        load: function(response)
            {
                var storeIssue = dojo.fromJson(response);

                populateStoreIssueControls(storeIssue, (Math.abs(storeIssue.size)-1));
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                dojo.publish("/saved", [{message: "<b>Experienced an error", type: "error", duration: 15000}]);
            }
    });
} //End of function lastStoreIssue

/**
 *Function deletes a store issue from the system
 */
function deleteStoreIssue()
{
    var issueId = dijit.byId("StoresIssue.No").getValue();
    dojo.publish("/saving", [{message: "<b>Deleting...: ", type: "info", duration: 5000}]);

    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=delete&issueId=" + issueId,
        load: function(response)
        {
            dojo.publish("/saved", [{message: "<b>...Deleted", type: "info", duration: 10000}]);
            nextStoreIssue();
            dijit.byId("StoresIssue.DeleteDialog").hide();
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved", [{message: "<b>...Failed", type: "error", duration: 5000}]);
        }
    });
} //End of function deleteStoreIssue

/**
 * Function to search for a given StoreIssue
 */
function refreshStoreIssue()
{
    var issueId = dijit.byId("StoresIssue.No").getValue();

    if (issueId.toString() == "NaN")
    {
        dojo.byId("InformationMessage").innerHTML = "You can only refresh a viewable Store Issue";
        dijit.byId("InformationMessageDialog").show();
        return;
    }
    
    var position = 0;
    
    dojo.xhrGet(
    {
        url: "servlets/storeIssueManager?operationType=find&output=JSON&issueId=" + issueId,
        load: function(response)
            {
                var storeIssue = dojo.fromJson(response);

                populateStoreIssueControls(storeIssue, position);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                dojo.publish("/saved", [{message: "<b>Experienced an error", type: "error", duration: 10000}]);
            }
    });
} //End of function findStoreIssue

/**
 * Function to search for a given StoreIssue
 */
function findStoreIssue()
{
    var issueId = dijit.byId("StoresIssue.Keywords").getValue();
    var position = 0;

    if (dijit.byId("StoresIssue.Keywords").validate())
    {
        statusMessage("resources/images/loading.gif", "Searching ...");
        
        dojo.xhrGet(
        {
            url: "servlets/storeIssueManager?operationType=find&output=JSON&issueId=" + issueId,
            load: function(response)
                {
                    var storeIssue = dojo.fromJson(response);

                    populateStoreIssueControls(storeIssue, position);
                    statusMessageDisplays(null, "... Found Store Issue #" + issueId);
                },
                error: function(response)
                {
                    if (response.status == 0)
                    {
                        sessionEnded();
                        return;
                    }

                    statusMessageDisplays("error", "Experienced an error while searching store issue #" + issueId);
                    dojo.publish("/saved", [{message: "<b>Experienced an error", type: "error", duration: 15000}]);
                }
        });
    }
} //End of function findStoreIssue

/**
 * Function, as the name suggests, simply populates the store issue  controls
 * with particulars of the specified store issue parameter
 */
function populateStoreIssueControls(storeIssue, position)
{
    var id = storeIssue.issueId;

    if (id.toString() == "0")
    {
        dojo.byId("InformationMessage").innerHTML = "No Store Issues to display";
        dijit.byId("InformationMessageDialog").show();
        return;
    }
    
    var issueId = dijit.byId("StoresIssue.No");
    var department = dijit.byId("StoresIssue.Department");
    var issueDate = dojo.byId("StoresIssue.IssueDate");
    var notes = dijit.byId("StoresIssue.Notes");
    var navigator = dojo.byId("StoresIssue.Navigator");

    issueId.setValue(storeIssue.issueId);
    issueDate.value = (storeIssue.issueDate);
    department.setValue(storeIssue.department);
    notes.setValue(storeIssue.notes);

    var grid = dijit.byId("StoresIssueDetail.Table");
    var store = new dojo.data.ItemFileWriteStore({data: storeIssue})
    grid.setStore(store);

    var size = Math.abs(storeIssue.size);
    dojo.cookie("CurrentStoreIssue", position, {expires: 5})
    dojo.cookie("StoreIssueSize", size, {expires: 5})

    navigator.innerHTML = (position + 1) + " of " + size;
} //End of function populateStoreIssueControls

/**
 * Function to preview a store issue before printing
 */
function storeIssuePrintPreview(issueId)
{
    window.open("procurement/print/storeIssueDialog.jsp?operationType=find&output=HTML&issueId=" + issueId,
        "Store Issue Print Preview",
        "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes");
} //End of function storeIssuePrintPreview