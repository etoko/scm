//consultList.js

/**
 * Script handles web-tier operations on the consult list page
 */

/**
 * Function adds a member to the consult list
 */
function addToConsultList()
{
    var grid = dijit.byId("waitingListGrid");
    var memberId = grid.store.getValue(grid.getItem(0), "memberId");
//    alert(memberId);
    dojo.publish("/saving",[{message: "<font size='2'><b>Adding To Consultation...</b>", type: "info", duration: 5000}]);

    dojo.xhrGet(
    {
        url: "servlets/consultManager?operationType=save&memberId=" + memberId,
        load: function (response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Added To Consultation", type: "info", duration: 5000}]);
            viewWaitingList();
        },
        error: function(response)
        {
          dojo.publish("/saved",[{message: "<font size='2'><b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function addToconsultList

/**
 * Function adds a member to the consult list
 */
function viewConsultList()
{
    dojo.publish("/saving",[{message: "<font size='2'><b>Reloading ...", type: "info", duration: 5000}]);
    var grid = dijit.byId("ConsultListGrid");
    
    dojo.xhrGet(
    {
        url: "servlets/consultManager?operationType=get&output=JSON",
        handleAs: "text",
        load: function (response)
        {   
            var data = dojo.fromJson(response);
            
            var store = new dojo.data.ItemFileWriteStore({data: data});
            
            if (data.status == "true")
            {
                grid.setStore(store);
                dojo.publish("/saved",[{message: "<font size='2'><b>Reloaded Consultation List", type: "info", duration: 10000}]);
            }
            else
            {
                var newStore = new dojo.data.ItemFileWriteStore({url: "resources/json/emptyConsultList.json"});
                grid.setStore(newStore);
                alert("No one is in the consult list");
            }
        },
        error: function(response)
        {
          dojo.publish("/saved",[{message: "<font size='2'><b>...encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function addToconsultList

/**
 *Function saves the consult list to a spreadsheet file document on disk.
 */
function saveConsultListToSpreadSheet(fileName)
{
    window.showModalDialog("servlets/consultManager?operationType=get&output=spreadsheet&fileName=" + fileName,
    'VersionWindow',
    'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');
    
} //End of function saveToSpreadSheet

/**
 * Function saves the consult list to a PDF document file on disk.
 */
function saveConsultListToPDF(fileName)
{
    if (fileName != null)
    {
        try
        {
            dijit.byId("ConsultListSaveDialog").hide();
            window.showModalDialog("servlets/consultManager?operationType=get&output=pdf&fileName=" + fileName,
            'VersionWindow',
            'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');
        }
        catch (e)
        {
            window.open("servlets/consultManager?operationType=get&output=pdf",
            'VersionWindow',
            'scrollbars=no, modal=yes,resizable=yes,width=700,height=500,top=0');
        }
    }
    else
    {
        alert("Enter a file name");
    }
    
} //End of function saveToPDF
