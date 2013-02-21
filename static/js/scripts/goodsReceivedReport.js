/* 
 * Script handles all operations on Goods Received Report
 */

/**
 * Function enables/ disables the Supplier FilteringSelect control
 */
function enableSupplier()
{
    var Supplier = dijit.byId("GoodsReceivedNoteReport.Supplier");

     if (Supplier.disabled)
         Supplier.setDisabled(false);
     else
         Supplier.setDisabled(true);
} //End of function enableSupplier

/**
 * Function retrieves Goods Received Notes basing on submitted parameters
 */
function getGoodsReceivedNote()
{
    var supplier = dijit.byId("GoodsReceivedNoteReport.Supplier");
    var beginDate = dijit.byId("GoodsReceivedNoteReport.BeginDate").getValue();
    var endDate = dijit.byId("GoodsReceivedNoteReport.EndDate").getValue();
    var grid = dijit.byId("GoodsReceivedNoteReport.Details")
    var formToValidate = dijit.byId("GoodsReceivedNoteReport.Form");
    var navigator = dojo.byId("GoodsReceivedReport.DetailNavigator");
    var statusMessage = dojo.byId("StatusMessage");
    var statusIcon = dojo.byId("StatusIcon");
    var store = null;
    var state = dojo.byId("GoodsReceivedNoteReport.State");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("GoodsReceivedNoteReport.BeginDate").value;
        endDate = dojo.byId("GoodsReceivedNoteReport.EndDate").value;
        
        var parameters = "";
        var dateMessage = "";

        if (supplier.disabled)
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
            var supplierName = dojo.byId("GoodsReceivedNoteReport.Supplier").value;
            parameters =  "supplierName=" + supplierName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&supplierId=" + supplier.getValue();

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate + " from " + supplierName;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate
                 + " from " + supplierName;;
            }
        } //End of else statement block

        dojo.byId("GoodsReceivedNoteReportSearch").innerHTML =
            "<img src='resources/images/loading.gif' height='18px'> Searching...";
        statusIcon.innerHTML = "<img src='resources/images/loading.gif' height='18px'>";
        statusMessage.innerHTML = "Searching ...";

        parameters += "&startPosition=0";
        
        dojo.xhrGet(
        {
            url: "servlets/goodsReceivedNoteReportManager?" + parameters,
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
                        links += "<a href=\"javascript:navigateGRNReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " GRN" : " GRNs") +
                    dateMessage;

                dojo.byId("GoodsReceivedNoteReportSearch").innerHTML = message;
                dojo.byId("GoodsReceivedNoteReport.State").innerHTML = "display";
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
                dojo.byId("GoodsReceivedNoteReportSearch").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block

} //End of function getGoodsReceivedNote

/**
 * Function navigates across records in the GRNReport DataGrid if search results
 * returned to the DataGRid are greater than 25
 */
function navigateGRNReport(startPosition)
{
    var supplier = dijit.byId("GoodsReceivedNoteReport.Supplier");
    var beginDate = dijit.byId("GoodsReceivedNoteReport.BeginDate").getValue();
    var endDate = dijit.byId("GoodsReceivedNoteReport.EndDate").getValue();
    var grid = dijit.byId("GoodsReceivedNoteReport.Details");
    var statusMessage = dojo.byId("StatusMessage");
    var formToValidate = dijit.byId("GoodsReceivedNoteReport.Form");
    var navigator = dojo.byId("GoodsReceivedReport.DetailNavigator");
    var state = dojo.byId("GoodsReceivedNoteReport.State");

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, navigator);
            return;
        }

        beginDate = dojo.byId("GoodsReceivedNoteReport.BeginDate").value;
        endDate = dojo.byId("GoodsReceivedNoteReport.EndDate").value;

        var parameters = "";
        var dateMessage = "";

        if (supplier.disabled)
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
            var supplierName = dojo.byId("GoodsReceivedNoteReport.Supplier").value;
            parameters =  "supplierName=" + supplierName + "&output=JSON&beginDate=" + beginDate + "&endDate=" +
                endDate + "&supplierId=" + supplier.getValue();

            if (beginDate == endDate)
            {
                dateMessage = " received on " + beginDate + " from " + supplierName;
            }
            else
            {
                dateMessage = " received between " + beginDate + " and  " + endDate
                 + " from " + supplierName;;
            }
        } //End of else statement block

        dojo.byId("GoodsReceivedNoteReportSearch").innerHTML =
            "<img src='resources/images/loading.gif'> Searching...";

        parameters += "&startPosition=" + startPosition;

        dojo.xhrGet(
        {
            url: "servlets/goodsReceivedNoteReportManager?" + parameters,
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
                        links += "<a href=\"javascript:navigateGRNReport(" + i +
                            ")\">" + ++counter + "</a> &nbsp;&nbsp;";
                    }
                }

                message = "Found " + number + (number == 1 ? " GRN" : " GRNs") +
                    dateMessage;
                dojo.byId("GoodsReceivedNoteReportSearch").innerHTML = message;
                dojo.byId("GoodsReceivedNoteReport.State").innerHTML = "display";
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
                dojo.byId("GoodsReceivedNoteReportSearch").innerHTML = "";
                clearGrid(grid);
                navigator.innerHTML = "";
                statusMessage.innerHTML = "";
                statusMessage.innerHTML = response;
            }
        });
    } //End of if statement block
    
} //End of function navigateGRNReport