/*
 * Script handles all operations on Goods Received Report
 */

/**
 * Function enables/ disables the Department FilteringSelect control
 */
function enableDepartment()
{
    var Department = dijit.byId("StoreIssueReport.Department");

     if (Department.disabled)
         Department.setDisabled(false);
     else
         Department.setDisabled(true);
} //End of function enableDepartment

/**
 * Function retrieves Goods Received Notes basing on submitted parameters
 */
function getStoreIssues()
{
    var department = dijit.byId("StoreIssueReport.Department");
    var beginDate = dijit.byId("StoreIssueReport.BeginDate").getValue();
    var endDate = dijit.byId("StoreIssueReport.EndDate").getValue();
    var grid = dijit.byId("StoreIssueReport.Details")
    var formToValidate = dijit.byId("StoreIssueReport.Form");
    var navigator = dojo.byId("StoreIssueReport.DetailNavigator");
    var statusMessage = dojo.byId("StatusMessage");
    var statusIcon = dojo.byId("StatusIcon");
    var store = null;
    var state = dojo.byId("StoreIssueReport.State");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("StoreIssueReport.BeginDate").value;
        endDate = dojo.byId("StoreIssueReport.EndDate").value;

        var parameters = "";
        var dateMessage = "";

        if (department.disabled)
        {
            parameters =  "output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate;

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate;
            }
        } //End of if statement block
        else
        {
            var departmentName = dojo.byId("StoreIssueReport.Department").value;
            parameters =  "departmentName=" + departmentName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&departmentId=" + department.getValue();

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate + " from " + departmentName;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate
                 + " from " + departmentName;;
            }
        } //End of else statement block

        dojo.byId("StoreIssueReport.SearchMessage").innerHTML =
            "<img src='resources/images/loading.gif' height='18px'> Searching...";
        statusIcon.innerHTML = "<img src='resources/images/loading.gif' height='18px'>";
        statusMessage.innerHTML = "Searching ...";

        parameters += "&startPosition=0";

        dojo.xhrGet(
        {
            url: "servlets/storeIssueReportManager?" + parameters,
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
                        links += "<a href=\"javascript:navigateStoreIssueReportReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " Store Issue" : " Store Issues") +
                    dateMessage;

                dojo.byId("StoreIssueReport.SearchMessage").innerHTML = message;
                dojo.byId("StoreIssueReport.State").innerHTML = "display";
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
                dojo.byId("StoreIssueReport.SearchMessage").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block

} //End of function getStoreIssues()

/**
 * Function navigates across records in the StoreIssueReportReport DataGrid if search results
 * returned to the DataGRid are greater than 25
 */
function navigateStoreIssueReportReport(startPosition)
{
    var department = dijit.byId("StoreIssueReport.Department");
    var beginDate = dijit.byId("StoreIssueReport.BeginDate").getValue();
    var endDate = dijit.byId("StoreIssueReport.EndDate").getValue();
    var grid = dijit.byId("StoreIssueReport.Details");
    var statusMessage = dojo.byId("StatusMessage");
    var formToValidate = dijit.byId("StoreIssueReport.Form");
    var navigator = dojo.byId("StoreIssueReport.DetailNavigator");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("StoreIssueReport.BeginDate").value;
        endDate = dojo.byId("StoreIssueReport.EndDate").value;

        var parameters = "";
        var dateMessage = "";

        if (department.disabled)
        {
            parameters =  "output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate;

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate;
            }
        } //End of if statement block
        else
        {
            var departmentName = dojo.byId("StoreIssueReport.Department").value;
            parameters =  "departmentName=" + departmentName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&departmentId=" + department.getValue();

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate + " from " + departmentName;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate
                 + " from " + departmentName;;
            }
        } //End of else statement block

        dojo.byId("StoreIssueReport.SearchMessage").innerHTML =
            "<img src='resources/images/loading.gif'> Searching...";

        parameters += "&startPosition=" + startPosition;

        dojo.xhrGet(
        {
            url: "servlets/storeIssueReportManager?" + parameters,
            load: function(response)
            {
                var issues = dojo.fromJson(response);
                var store = new dojo.data.ItemFileWriteStore({data: issues});

                grid.setStore(store);

                var message =   "";
                var number = Math.abs(issues.number);
                var links= "";

                if (number > 25)
                {
                    var counter = 0;
                    for (var i = 0; i < number; i+=25)
                    {
                        links += "<a href=\"javascript:navigateStoreIssueReportReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " Store Issue" : " Store Issues") +
                    dateMessage;
                dojo.byId("StoreIssueReport.SearchMessage").innerHTML = message;
                dojo.byId("StoreIssueReport.State").innerHTML = "display";
                navigator.innerHTML = links;

                if (number == 0)
                {
                    state.innerHTML = "noResults";
                }
                else
                    state.innerHTML = "display";
            },
            error: function(response)
            {
                dojo.byId("StoreIssueReport.SearchMessage").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block

} //End of function navigateStoreIssueReportReport