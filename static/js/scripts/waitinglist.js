//waitingList.js

/**
 * Script handles web-tier operations on the waiting list page
 */

/**
 * Function adds a member to the waiting list
 */
function addToWaitingList()
{
    var memberId = dijit.byId("MemberId").getValue();

    dojo.publish("/saving",[{message: "<font size='2'><b>Adding ...", type: "info", duration: 4000}]);

    dojo.xhrGet(
    {
        url: "servlets/waitingListManager?operationType=save&memberId=" + memberId,
        load: function (response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Added to Waiting List", type: "info", duration: 5000}]);
        },
        error: function(response)
        {
          dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function addToWaitingList

/**
 * Function adds a member to the waiting list
 */
function viewWaitingList()
{
    dojo.publish("/saving",[{message: "<font size='2'><b>Reloading ...", type: "info", duration: 4000}]);
    var contentArea = dojo.byId("xyz");
    dojo.xhrGet(
    {
        url: "servlets/waitingListManager?operationType=get",
        handleAs: "text",
        load: function (response)
        {   
            var data = dojo.fromJson(response);
            
            var grid = dijit.byId("waitingListGrid");
            var store = new dojo.data.ItemFileWriteStore({data: data});

            dojo.publish("/saved",[{message: "<font size='2'><b>...Reloaded Waiting List", type: "info", duration: 10000}]);
            if (data.status == "true")
            {
                grid.setStore(store);
            }
            else
            {
                var newStore = new dojo.data.ItemFileWriteStore({url: "resources/json/emptyWaitingList.json"});
                grid.setStore(newStore);
                alert("No one is in the waiting list");
            }
        },
        error: function(response)
        {
          dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an Error: " + response, type: "error", duration: 0}]);
        }
    });
} //End of function addToWaitingList

/**
 *Function saves the Waiting list to a spreadsheet file document on disk.
 */
function saveWaitingListToSpreadSheet(fileName)
{
    window.showModalDialog("servlets/waitingListManager?operationType=get&output=spreadsheet&fileName=" + fileName,
    'VersionWindow',
    'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');

} //End of function saveToSpreadSheet

/**
 * Function saves the Waiting list to a PDF document file on disk.
 */
function saveWaitingListToPDF(fileName)
{
    if (fileName != null)
    {
        try
        {
            dijit.byId("WaitingListSaveDialog").hide();
            window.showModalDialog("servlets/waitingListManager?operationType=get&output=pdf&fileName=" + fileName,
            'VersionWindow',
            'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');
        }
        catch (e)
        {
            window.open("servlets/waitingListManager?operationType=get&output=pdf",
            'VersionWindow',
            'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');
        }
    }
    else
    {
        alert("Enter a file name");
    }

} //End of function saveToPDF
