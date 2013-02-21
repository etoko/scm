/* 
 * Function handles all operations of the records tab
 */

/**
 * Function enables/ disables the Staff FilteringSelect control
 */
function enableRecordStaff()
{
    var staff = dijit.byId("Records.Staff");

     if (staff.disabled)
         staff.setDisabled(false);
     else
         staff.setDisabled(true);
} //End of function enableStaff

/**
 * Function enables/ disables the Staff FilteringSelect control
 */
function enableRecordFilter()
{
    var filter = dijit.byId("Records.FilterByType");

     if (filter.disabled)
         filter.setDisabled(false);
     else
         filter.setDisabled(true);
} //End of function enableStaff

/**
 * Function retrieves Goods Received Notes basing on submitted parameters
 */
function getRecords()
{
    var staff = dijit.byId("Records.Staff");
    var beginDate = dijit.byId("Records.BeginDate").getValue();
    var endDate = dijit.byId("Records.EndDate").getValue();
    var grid = dijit.byId("Records.Details");
    var formToValidate = dijit.byId("Records.Form");
    var navigator = dojo.byId("Records.DetailNavigator");
    var statusMessage = dojo.byId("StatusMessage");
    var statusIcon = dojo.byId("StatusIcon");
    var store = null;
    var state = dojo.byId("Records.State");
    var filterByType = dijit.byId("Records.FilterByType");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("Records.BeginDate").value;
        endDate = dojo.byId("Records.EndDate").value;

        var parameters = "";
        var dateMessage = "";

        if (beginDate == endDate)
        {
            dateMessage = " received on " + beginDate;
        }
        else
        {
            dateMessage = " received between " + beginDate + " and  " + endDate;
        }

        if (staff.disabled)
        {
            parameters =  "output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate;
        } //End of if statement block
        else
        {
            var staffName = dojo.byId("Records.Staff").value;
            parameters =  "staffName=" + staffName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&staffId=" + staff.getValue();
        } //End of else statement block

        if (filterByType.disabled == false)
        {
            parameters += "&filterByType=" + filterByType.getValue();
        }

        statusIcon.innerHTML = "<img src='resources/images/loading.gif' height='18px'>";
        statusMessage.innerHTML = "Searching ...";

        parameters += "&startPosition=0";

        dojo.xhrGet(
        {
            url: "servlets/recordManager?" + parameters,
            load: function(response)
            {
                var issues = dojo.fromJson(response);

                store = new dojo.data.ItemFileWriteStore({data: issues});
                grid.setStore(store);

                var message =   "";
                var number = Math.abs(issues.number);
                var links= "";

                if (number > 25)
                {
                    var counter = 0;
                    for (var i = 0; i < number; i+=25)
                    {
                        links += "<a href=\"javascript:navigateRecordReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " Record" : " Records") +
                    dateMessage;

                dojo.byId("RecordsSearch").innerHTML = message;
                dojo.byId("Records.State").innerHTML = "display";
                navigator.innerHTML = links;
                statusIcon.innerHTML = "";
                statusMessageDisplays(null, message);

                if (number == 0)
                {
                    state.innerHTML = "noResults";
                }
                else
                    state.innerHTML = "display";
            },
            error: function(response)
            {
                dojo.byId("RecordsSearch").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block

} //End of function getRecords

/**
 * Function navigates across records in the RecordReport DataGrid if search results
 * returned to the DataGRid are greater than 25
 */
function navigateRecordReport(startPosition)
{
    var staff = dijit.byId("Records.Staff");
    var beginDate = dijit.byId("Records.BeginDate").getValue();
    var endDate = dijit.byId("Records.EndDate").getValue();
    var grid = dijit.byId("Records.Details");
    var formToValidate = dijit.byId("Records.Form");
    var navigator = dojo.byId("Records.DetailNavigator");
    var statusMessage = dojo.byId("StatusMessage");
    var statusIcon = dojo.byId("StatusIcon");
    var store = null;
    var state = dojo.byId("Records.State");
    var filterByType = dijit.byId("Records.FilterByType");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("Records.BeginDate").value;
        endDate = dojo.byId("Records.EndDate").value;

        var parameters = "";
        var dateMessage = "";

        if (beginDate == endDate)
        {
            dateMessage = " received on " + beginDate;
        }
        else
        {
            dateMessage = " received between " + beginDate + " and  " + endDate;
        }

        if (staff.disabled)
        {
            parameters =  "output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate;
        } //End of if statement block
        else
        {
            var staffName = dojo.byId("Records.Staff").value;
            parameters =  "staffName=" + staffName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&staffId=" + staff.getValue();
        } //End of else statement block

        if (filterByType.disabled == false)
        {
            parameters += "&filterByType=" + filterByType.getValue();
        }

        statusIcon.innerHTML = "<img src='resources/images/loading.gif' height='18px'>";
        statusMessage.innerHTML = "Searching ...";

        parameters += "&startPosition=" + startPosition;

        dojo.xhrGet(
        {
            url: "servlets/recordManager?" + parameters,
            load: function(response)
            {
                var issues = dojo.fromJson(response);

                store = new dojo.data.ItemFileWriteStore({data: issues});
                grid.setStore(store);

                var message =   "";
                var number = Math.abs(issues.number);
                var links= "";

                if (number > 25)
                {
                    var counter = 0;
                    for (var i = 0; i < number; i+=25)
                    {
                        links += "<a href=\"javascript:navigateRecordReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " Record" : " Records") +
                    dateMessage;

                dojo.byId("RecordsSearch").innerHTML = message;
                dojo.byId("Records.State").innerHTML = "display";
                navigator.innerHTML = links;
                statusIcon.innerHTML = "";
                statusMessageDisplays(null, message);

                if (number == 0)
                {
                    state.innerHTML = "noResults";
                }
                else
                    state.innerHTML = "display";
            },
            error: function(response)
            {
                dojo.byId("RecordsSearch").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block

} //End of function navigateRecordReport

function refreshRecordStaff()
{
    var staff = dijit.byId("Records.Staff");

    dojo.xhrGet(
    {
        url: "servlets/staffManager?operationType=get",
        load: function(response)
        {
            var results = dojo.fromJson(response);
            var store = new dojo.data.ItemFileWriteStore({data: results});

            staff.store = store;
        },
        error: function(response)
        {
            alert("Error: " + response);
        }
    });
}