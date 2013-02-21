function getItemTransactions()
{
    var itemId = dijit.byId("ItemTransactions.Item").getValue();
    var beginDate = dijit.byId("ItemTransactions.BeginDate").getValue();
    var endDate = dijit.byId("ItemTransactions.EndDate").getValue();
    var order = dijit.byId("ItemTransactions.Order").getValue();
    var issue = dijit.byId("ItemTransactions.Issue").getValue();
    var grn = dijit.byId("ItemTransactions.GRN").getValue();
    var grid = dijit.byId("ItemTransactions.Details");
    var store = new dojo.data.ItemFileWriteStore({
        data: "resources/json/genericEmptyjson.json"});
    var formToValidate = dijit.byId("ItemTransactions.Form");
    var searchMessage = dojo.byId("ItemTransactions.SearchMessage");

    if ((order == false) && (issue == false) && (grn == false))
    {
        dojo.byId("InformationMessage").innerHTML = "Select at least one or " +
            "more options of; Purchase Order, Goods Received and Store Issue";
        dijit.byId("InformationMessageDialog").show();
        
        return;
    }

    if (formToValidate.validate())
    {
        if (beginDate > endDate)
        {
            dateErrorMessage(beginDate, endDate, grid, searchMessage);
            return;
        }

        beginDate = dojo.byId("ItemTransactions.BeginDate").value;
        endDate = dojo.byId("ItemTransactions.EndDate").value;

        order = (order == false ? "" : "&order=" + order);
        issue = (issue == false ? "" : "&issue=" + issue);
        grn = (grn == false ? "" : "&grn=" + grn);

        var parameters =  "output=JSON&itemId=" + itemId + "&beginDate=" + beginDate +
            "&endDate="+ endDate + order + issue + grn;
        
        dojo.publish("/saving", [{message: "<b>Retrieving...</b>", type: "info", duration: 5000}]);
        statusMessage("resources/images/loading.gif", "Searching ...");
        
        dojo.xhrGet(
        {
            url: "servlets/itemTransactionManager?" + parameters,
            load: function(response)
            {
                var results = dojo.fromJson(response);

                var number = results.number;
                var message = "Returned " + number + " transactions";
                searchMessage.innerHTML = message;

                store = new dojo.data.ItemFileWriteStore({data: results});
                grid.setStore(store);
                statusMessageDisplays(null, message);
                dojo.publish("/saved", [{message: "<b>... Retrieved</b>", type: "info", duration: 7000}]);
                dojo.byId("ItemTransactions.State").innerHTML = "display";

            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    statusMessageDisplays("error", "Experienced an error ");
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Experienced an error ");
                dojo.publish("/saved", [{message: "<b>Sorry Unexpected Problem</b>", type: "error", duration: 10000}]);
            }
        });

    }//End of if statement block
} //End of function getItemTransactions

function itemTransactionsParameterChange()
{
    dojo.byId("ItemTransactions.State").innerHTML = "none";
}