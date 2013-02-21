/*
 * Script handles operations on the ward tab
 */

/**
 * Function activates the date controls depending on which status list item of
 * the patient is selected.
 */
function activateWardDateControls()
{
    var beginDate = dijit.byId("Ward.BeginDate");
    var endDate = dijit.byId("Ward.EndDate");
    var status = dijit.byId("Ward.Status").getValue();
    status = status.toString();
    
    if (status == "RECEIVING TREATMENT")
    {
        beginDate.disabled = true;
        endDate.disabled = true;
    } //End if statement block
    else
    {
        beginDate.disabled = false;
        endDate.disabled = false;
    } //End of else statement block
} //End of function displayDateControls()

/**
 * Function prints out the patients in a ward
 */
function getPatients()
{
    activateWardDateControls();
    
    var ward = dijit.byId("Ward.Ward").getValue();
    var wardName = dojo.byId("Ward.Ward").value;
    var status = dijit.byId("Ward.Status").getValue();
    var grid = dijit.byId("Ward.SearchGrid");
    var resultsLabel = dojo.byId("Ward.SearchResults");

    var beginDate = dijit.byId("Ward.BeginDate").getValue();
    var endDate = dijit.byId("Ward.EndDate").getValue();
    var message = "";

    if (beginDate > endDate)
    {
        var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
        grid.setStore(store);
        
        dojo.byId("InformationMessage").innerHTML = "Start date of the search" +
            " query cannot be later than the end date";
        dijit.byId("InformationMessageDialog").show();
        
        return;
    }
    
    beginDate = dojo.byId("Ward.BeginDate").value;
    endDate = dojo.byId("Ward.EndDate").value;
    
    var formToValidate = dijit.byId("Ward.Form");

    if (formToValidate.validate())
    {
        var dateMessage = "";

        if (beginDate == endDate)
            dateMessage = " on " + beginDate;
        else
            dateMessage = " between " + beginDate + " and " + endDate ;

        resultsLabel.innerHTML = "<img src='resources/images/loading.gif'> Searching...";

        dojo.xhrGet(
        {
            url: "servlets/wardManager?operationType=getPatients&output=JSON&wardId=" + ward
                    + "&status=" + status + "&beginDate=" + beginDate + "&endDate=" + endDate,
            load: function(response)
            {
                var patients = dojo.fromJson(response);
                var size = patients.size;

                var store = new dojo.data.ItemFileWriteStore({data: patients});
                grid.setStore(store);

                status = status.toString();
                var message = " who are receiving treatment, were discharged " +
                    "from or died from";

                size = Math.abs(size);

                if (status == "RECEIVING TREATMENT")
                {
                    message = " currently receiving treatment in";
                }
                else if (status == "DISCHARGED")
                {
                    if (size > 1)
                        message = " who were discharged from";
                    else
                        message = " who was discharged from";

                }
                else if (status == "DEAD")
                {
                    message = " who died in ";
                }

                if (size > 1)
                {
                    message = "Found " + size + " patients " +
                    message + " ward " + wardName;
                }
                else
                {
                    message = "Found " + size + " patient " +
                    message + " ward " + wardName;
                }

                resultsLabel.innerHTML = message + dateMessage;
            },
            error: function(response)
            {
                resultsLabel.innerHTML = "Experienced a problem" +
                    " while retrieving the patients: " + response;
            }
        });
    }
} //End of function getPatients

function wardPrintPreview()
{

    var ward = dijit.byId("Ward.Ward").getValue();
    var wardName = dojo.byId("Ward.Ward").value;
    var status = dijit.byId("Ward.Status").getValue();
    var grid = dijit.byId("Ward.SearchGrid");
    var beginDate = dojo.byId("Ward.BeginDate").value;
    var endDate = dojo.byId("Ward.EndDate").value;

    activateWardDateControls();
    
    var formToValidate = dijit.byId("Ward.Form");

    if (formToValidate.validate())
    {
        window.open("doctor/print/wardDialog.jsp?operationType=getPatients&output="
            + "HTML&wardId=" + ward + "&status=" + status + "&beginDate=" +
            beginDate + "&endDate=" + endDate,
            "CNN_WindowName",
            "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
    }
} //End of function wardPrintPreview