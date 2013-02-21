//lporeport.js
function lpoByStaff()
{
    
} //lpoByStaff

/**
 * Function retrieves purchase orders by their dates
 */
function lpoByStatus()
{
    var status = dijit.byId("LPOReportByStatusStatus").getValue();
    var beginDate = dijit.byId("LPOReportByStatusBeginDate").getValue();
    var endDate = dijit.byId("LPOReportByStatusEndDate").getValue();
    var formToValidate = dijit.byId("LPOReportByStatusForm");
    var grid = dijit.byId("LPOByStatusDetails");

    if (formToValidate.validate())
    {
        dojo.byId("LPOByStatusSearch").innerHTML = "<img src='resources/images/loading.gif'> Searching..."
        dojo.byId("StatusIcon").innerHTML = "<img src='resources/images/loading.gif'>";
        dojo.byId("StatusMessage").innerHTML = "Searching ..."
        
        if (beginDate > endDate)
        {
            var store = new dojo.data.ItemFileReadStore({url: "resources/json/lpoByStatus.json"});
            grid.setStore(store);
            dojo.byId("LPOByStatusSearch").innerHTML = "";
            dojo.byId("ErrorMessage").innerHTML = "Begin date is later than end date!";
            dijit.byId("ErrorMessageDialog").show();
            
            return;
        }

        beginDate = dojo.byId("LPOReportByStatusBeginDate").value;
        endDate = dojo.byId("LPOReportByStatusEndDate").value;

        dojo.xhrPost(
        {
            url: "servlets/purchaseOrderReport?operationType=findByStatus&output=JSON&startPosition=0&beginDate=" + beginDate + "&endDate=" + endDate + "&status=" +  status,
            load: function(response)
            {
                var lpos = dojo.fromJson(response);
                var number = Math.abs(lpos.number);

                if (number > 0)
                    dojo.byId("LPOByStatus.State").innerHTML = "block";
                else
                    dojo.byId("LPOByStatus.State").innerHTML = "none";

                var purchaseorders = (status.toString() == "ALL" ? "" : " " + status);
                purchaseorders += (number == 1? " purchase order " :
                    " purchase orders ");

                var statusMessage = "";

                if (beginDate == endDate)
                {
                    statusMessage = lpos.number  + purchaseorders + "made on " +
                        beginDate;
                }
                else
                {
                    statusMessage = lpos.number + purchaseorders +
                        "made between " + beginDate + " and " + endDate;
                }

                dojo.byId("LPOByStatusSearch").innerHTML = statusMessage;

                var store = new dojo.data.ItemFileReadStore({data: lpos});
                grid.setStore(store);

                var size = Math.abs(lpos.number);
                var navigator = dojo.byId("LPO.DetailNavigator");
                var list = "";

                if (size > 25)
                {
                    list = "Navigator: ";
                    
                    var j = 1;
                    for (var i = 0; i <= size; i += 25)
                    {
                        list += "<a href=\"javascript:navigateLPOReportByStatus(" + i + ")\">" + (j++) + "</a>  &raquo; ";
                    }
                }//End of if statement block

                navigator.innerHTML = list;
                statusMessageDisplays(statusMessage);
                dojo.byId("StatusIcon").innerHTML = "";
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");
                clearGrid(grid);
            }
        });
    }
} //End of function lpoByStatus

function lpoBySupplier()
{
    var supplier = dijit.byId("LPOReportBySupplierSupplier").getValue();
    var supplierName = dojo.byId("LPOReportBySupplierSupplier").value;
    var beginDate = dijit.byId("LPOReportBySupplierBeginDate").getValue();
    var endDate = dijit.byId("LPOReportBySupplierEndDate").getValue();
    var formToValidate = dijit.byId("LPOReportBySupplierForm");
    var grid = dijit.byId("LPOBySupplierDetails");
    var statusMessage = "";
    
    if (formToValidate.validate())
    {
        dojo.byId("StatusIcon").innerHTML = "<img src='resources/images/loading.gif'>";
        dojo.byId("StatusMessage").innerHTML = "Searching ..."
        
        dojo.byId("LPOBySupplierSearch").innerHTML = "<img src='resources/images/loading.gif'> Searching..."

        if (beginDate > endDate)
        {
            var store = new dojo.data.ItemFileReadStore({url: "resources/json/lpoByStatus.json"});
            grid.setStore(store);
            dojo.byId("LPOBySupplierSearch").innerHTML = "";
            dojo.byId("InformationMessage").innerHTML = "Begin date is later than end date!";
            dijit.byId("InformationMessageDialog").show();

            return;
        }

        beginDate = dojo.byId("LPOReportBySupplierBeginDate").value;
        endDate = dojo.byId("LPOReportBySupplierEndDate").value;

        dojo.xhrPost(
        {
            timeout: 30000,
            url: "servlets/purchaseOrderReport?operationType=findBySupplier&output=JSON&startPosition=0&beginDate=" + beginDate + "&endDate=" + endDate + "&supplierId=" +  supplier,
            load: function(response)
            {
                var lpos = dojo.fromJson(response);
                var number = Math.abs(lpos.number);
                var purchaseorders = (number == 1? " Purchase order " : " Purchase orders ");

                if (beginDate == endDate)
                {
                    statusMessage = lpos.number  + purchaseorders + "made to " +
                        supplierName +  " on " + beginDate;
                }
                else
                {
                    statusMessage = lpos.number  + purchaseorders + "made to " +
                        supplierName +  " between " + beginDate + " and " +
                        endDate;
                }

                dojo.byId("LPOBySupplierSearch").innerHTML = statusMessage;

                var store = new dojo.data.ItemFileReadStore({data: lpos});
                grid.setStore(store);

                if (number > 0)
                    dojo.byId("LPOReportBySupplier.State").innerHTML = "block";
                else
                    dojo.byId("LPOReportBySupplier.State").innerHTML = "none";

                statusMessageDisplays(statusMessage);
                dojo.byId("StatusIcon").innerHTML = "";
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders!");
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders!");

                clearGrid(grid);
            }
        });
    }//End of if statement block
} //lpoBySupplier

function lpoReportStaffTransactions()
{
    var staffName = dijit.byId("LPOReportStaffName").getValue();
    var lpoTable = dijit.byId("LPOByStaffDetails");

    dojo.xhrGet(
    {
        url: "servlets/staffManager?operationType=lpoReportByStaff&staffID=" + staffName,
        handleAs: "text",
        load: function(response)
        {
            var lpo = dojo.fromJson(response);
            var newStore = new dojo.data.ItemFileWriteStore({data: lpo});
            lpoTable.setStore(newStore);
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");
                sessionEnded();
                return;
            }

            statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");
        }

    });
}

function lPOReportByStaffPrint()
{
    
}

function lpoByStaffChange()
{
    dojo.byId("LPOByStatus.State").innerHTML = "none";
}

function navigateLPOReportByStatus(startPosition)
{
    var status = dijit.byId("LPOReportByStatusStatus").getValue();
    var beginDate = dijit.byId("LPOReportByStatusBeginDate").getValue();
    var endDate = dijit.byId("LPOReportByStatusEndDate").getValue();
    var formToValidate = dijit.byId("LPOReportByStatusForm");
    var grid = dijit.byId("LPOByStatusDetails");

    if (formToValidate.validate())
    {
        dojo.byId("LPOByStatusSearch").innerHTML = "<img src='resources/images/loading.gif'> Searching..."

        if (beginDate > endDate)
        {
            var store = new dojo.data.ItemFileReadStore({url: "resources/json/lpoByStatus.json"});
            grid.setStore(store);
            dojo.byId("LPOByStatusSearch").innerHTML = "";
            dojo.byId("ErrorMessage").innerHTML = "Begin date is later than end date!";
            dijit.byId("ErrorMessageDialog").show();

            return;
        }

        beginDate = dojo.byId("LPOReportByStatusBeginDate").value;
        endDate = dojo.byId("LPOReportByStatusEndDate").value;

        dojo.xhrPost(
        {
            url: "servlets/purchaseOrderReport?operationType=findByStatus&output=JSON&startPosition=" + startPosition
                + "&beginDate=" + beginDate + "&endDate=" + endDate + "&status=" +  status,
            load: function(response)
            {
                var lpos = dojo.fromJson(response);
                var number = Math.abs(lpos.number);

                if (number > 0)
                    dojo.byId("LPOByStatus.State").innerHTML = "block";
                else
                    dojo.byId("LPOByStatus.State").innerHTML = "none";

                var purchaseorders = (status.toString() == "ALL" ? "" : " " + status);
                purchaseorders += (number == 1? " purchase order " : " purchase orders ");

                if (beginDate == endDate)
                {
                    dojo.byId("LPOByStatusSearch").innerHTML = lpos.number  +
                    purchaseorders + "made on " + beginDate;
                }
                else
                {
                    dojo.byId("LPOByStatusSearch").innerHTML = lpos.number  +
                    purchaseorders + "made between " + beginDate + " and " + endDate;
                }

                var store = new dojo.data.ItemFileReadStore({data: lpos});
                grid.setStore(store);

                var size = Math.abs(lpos.number);
                var navigator = dojo.byId("LPO.DetailNavigator");
                var list = "Navigator: ";

                if (size > 25)
                {
                    var j = 1;
                    for (var i = 0; i <= size; i += 25)
                    {
                        list += "<a href=\"javascript:navigateLPOReportByStatus(" + i + ")\">" + (j++) + "</a>  &raquo; ";
                    }
                }//End of if statement block

                navigator.innerHTML = list;
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Encountered a problem while retrieving the purchase orders");

                clearGrid(grid);
            }
        });
    }
} //End of function navigateLPOReportByStatus