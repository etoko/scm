/* 
 * Script handles operations on Drugs Issue reports
 */

function drugsIssueByDate()
{
    var formToValidate = dijit.byId("DrugsIssueByDate.Form");
    var searchMessage = dojo.byId("DrugsIssueByDate.Search");

    if (formToValidate.validate())
    {var beginDate = dijit.byId("DrugsIssueByDate.BeginDate").getValue();
    var endDate = dijit.byId("DrugsIssueByDate.EndDate").getValue();
    var grid = dijit.byId("DrugsIssueByDate.Details");

    if (endDate < beginDate)
    {
        dojo.byId("ErrorMessage").innerHTML = "End date is earlier than the begin date";
        dijit.byId("ErrorMessageDialog").show();

        searchMessage.innerHTML = "<img src='resources/images/dialog-warning.png'> " +
            "End date is earlier than the begin date. Ensure that the end \n\
            data of the search is later than the start date";
        var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
        grid.setStore(store);
        
        return;
    }

    beginDate = dojo.byId("DrugsIssueByDate.BeginDate").value;
    endDate = dojo.byId("DrugsIssueByDate.EndDate").value;

    searchMessage.innerHTML =
        "<b><img src='resources/images/loading.gif'> Searching...";

    dojo.xhrGet(
    {
        url: "servlets/drugsIssueManager?operationType=betweenDates&beginDate=" +
            beginDate + "&endDate=" + endDate,
        load: function(response)
        {
            var issues = dojo.fromJson(response);
            searchMessage.innerHTML ="<b>Found " + issues.size + " drugs issues";

            var store = new dojo.data.ItemFileWriteStore({data: issues});
            grid.setStore(store);
        },
        error: function(response)
        {
            searchMessage.innerHTML = "Experienced an error " + response + "";
        
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced " +
                "a problem", type: "error", duration: 5000}]);
        }
    });
    } //End of if statement block
} //End of function drugsIssueByDate

/**
 * Function searches for Drugs Issues basing on staff and date parameters
 */
function drugsIssueByStaff()
{
    var formToValidate = dijit.byId("DrugsIssueByStaff.Form");
    var searchMessage = dojo.byId("DrugsIssueByStaff.Search");

    if (formToValidate.validate())
    {
        var staffId = dijit.byId("DrugsIssueByStaff.Staff");
        var beginDate = dijit.byId("DrugsIssueByStaff.BeginDate").getValue();
        var endDate = dijit.byId("DrugsIssueByStaff.EndDate").getValue();
        var grid = dijit.byId("DrugsIssueByStaff.Details");

        if (endDate < beginDate)
        {
            dojo.byId("ErrorMessage").innerHTML = "End date is earlier than the begin date";
            dijit.byId("ErrorMessageDialog").show();

            searchMessage.innerHTML = "<img src='resources/images/dialog-warning.png'> " +
                "End date is earlier than the begin date. Ensure that the end \n\
                data of the search is later than the start date";
            var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
            grid.setStore(store);

            return;
        }

        beginDate = dojo.byId("DrugsIssueByStaff.BeginDate").value;
        endDate = dojo.byId("DrugsIssueByStaff.EndDate").value;

        searchMessage.innerHTML =
            "<b><img src='resources/images/loading.gif'> Searching...";

        dojo.xhrGet(
        {
            url: "servlets/drugsIssueManager?operationType=findByStaff&beginDate=" +
                beginDate + "&endDate=" + endDate + "&staffId=" + staffId,
            load: function(response)
            {
                var issues = dojo.fromJson(response);
                searchMessage.innerHTML ="<b>Found " + issues.size + " drugs issues";

                var store = new dojo.data.ItemFileWriteStore({data: issues});
                grid.setStore(store);
            },
            error: function(response)
            {
                searchMessage.innerHTML = "Experienced an error " + response + "";

                dojo.publish("/saved", [{message: "<font size='2'><b>Experienced " +
                    "a problem", type: "error", duration: 5000}]);
            }
        });
    } //End of if statement block
} //End of function drugsIssueByDate
