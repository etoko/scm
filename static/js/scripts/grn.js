/* 
 * Script handles all oerations on the GRN tab.
 */

/**
 *Function deletes a GRN from the system
 */
function deleteGRN()
{
    var id = dijit.byId("grnNo").getValue();
    dojo.publish("/saving", [{message: "Deleting ...", type: "info", duration: 10000}]);

    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=delete&grnId=" + id,
        handleAs: "text",
        load: function(response)
        {
            dojo.publish("/saved", [{message: "Successfully Deleted GRN", type: "info", duration: 10000}]);
            nextGRN();
        },
        error: function(response)
        {
            var message = dojo.fromJson(response);
            dojo.publish("/saved",[{message: "Experienced an error deleting LPO", type: "error", duration: 10000}]);
        }
    });

    dijit.byId("grnDeleteDialog").hide();
} //End of function deleteGRN

/**
 * Function clears the input controls for entering new data.
 */
function newGRN()
{
    var grnNo = dijit.byId("grnNo");
    var deliveryNote = dijit.byId("grnDeliveryNote");
    var receivedDate = dijit.byId("grnReceivedDate");
    var lpoNo = dijit.byId("grnLPONo");
    var grnInvoiceNo = dijit.byId("grnInvoiceNo");
    var grnNotes = dijit.byId("grnNotes");
    var grid = dijit.byId("GRNDetails");
    
    var currentGRN = dojo.cookie("CurrentGRN");
    var grnSize = dojo.cookie("GRNSize");
    grnSize = Math.abs(grnSize);
    currentGRN = Math.abs(currentGRN);

    currentGRN = grnSize - 1;

    dojo.cookie("CurrentGRN", currentGRN + 1, {expires: 5});
    dojo.cookie("GRNSize", grnSize + 1, {expires: 5});

    
    dojo.publish("/saved",[{message: "<b>Enter New GRN", type: "info", duration: 30000}]);
    

    grnNo.setValue("0");
    deliveryNote.setValue("");
    receivedDate.setValue("");
    lpoNo.setValue("");
    grnInvoiceNo.setValue("");
    grnNotes.setValue("");

    var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
    grid.setStore(store);
} //End of function newGRN

/**
 * Function saves a GoodsReceivedNote into the system. Same function also updates
 * an existing grn into the system.
 */
function saveGRN()
{
    var grnId = dijit.byId("grnNo").getValue();
    var grid = dijit.byId("GRNDetails");
    var item;
    var parameters = "";
    var itemValue = "";
    var quantityValue = "";
    var detailIdValue = "";
    var itemId = "paramId";
    var detailId = "paramDetailId";
    var quantity = "paramQuantity";
    var inComplete = dojo.byId("GRN.Status").innerHTML;
    
    for (var i = 0; i < 500; i++)
    {
        item = grid.getItem(i);

        if (item == null)
        {
            break;
        }
        else
        {
            parameters = parameters + "&";
            itemValue = item.ItemId;
            quantityValue = item.quantity;
            detailIdValue = item.GRNDetailId;
            var invalidValue = Math.abs(quantityValue);

            if (detailIdValue == undefined)
            {
                detailIdValue = 0;
            }

            if (invalidValue.toString() == "NaN")
            {
                alert("Not a valid quantity: " + quantityValue + " for item: " + item.Item);
                return;
            }

            parameters = parameters + detailId + i + "=" + detailIdValue +
                 "&" + itemId + i + "=" + itemValue + "&" + quantity + i + "=" +
                quantityValue;
        }
    }

    var date = dojo.byId("grnReceivedDate").value;
    var lpoNo = dijit.byId("grnLPONo").getValue();
//    alert(parameters);
//    return;

    if (dijit.byId("grnForm").validate())
    {
        dojo.publish("/saving",[{message: "<b><font size='2'><b>Saving...", type: "info", duration: 5000}]);
        
        dojo.xhrPost(
        {
            form: "grnForm",
            url: "servlets/grnManager?operationType=save&orderStatus=" + inComplete + "&grnId=" + grnId + "&grnLPONo=" +lpoNo + "&grnReceivedDate="+ date + parameters,
            load: function(response)
            {
                var grn = dojo.fromJson(response);
                populateGRNControls(grn, 0);

                //saveToaster.setContent("<b><font size='2'><b>...Saved", "message", 10000);
                saveToaster.hide();
                dojo.publish("/saved",[{message: "<b><font size='2'><b>...Saved", type: "info", duration: 10000}]);
                //dojo.byId("GRN.Status").innerHTML = "false";
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                dojo.publish("/saved",[{message: "<b><font size='2'><b>...Failed: " + response, type: "error", duration: 10000}]);
            }
        });
    }
}

/**
 * Navigates to the first GRN
 */
function firstGRN()
{
    var position = 0;
    
    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=first",
        handleAs: "text",
        load: function(response)
        {
            var grn = dojo.fromJson(response);

            populateGRNControls(grn, position);
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved",[{message: "<b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of firstGRN

function previousGRN()
{
    var position = dojo.cookie("CurrentGRN");

    if ((position == undefined)|| (position == null) || (position.toString() == "NaN"))
    {
            position = 1;
    }

    position = Math.abs(position);

    if (position > 0)
    {
        position = position - 1;
    }
    else
    {
        firstGRN();
        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the first GRN!";
        dijit.byId("NavigationDialog").show();
        return;
    }

    if (position <= 0)
    {
        position = 1;
    }

    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=previous&position=" + position,
        handleAs: "text",
        load: function(response)
        {
            var grn = dojo.fromJson(response);

            populateGRNControls(grn, position);
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved",[{message: "<b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
}//End of function previousGRN

function nextGRN()
{
    var position = dojo.cookie("CurrentGRN");
    
    if ((position == undefined) || (position == null) || (position.toString() == "NaN"))
    {
            position = 1;
    }
    position = Math.abs(position);

    if (position <= 0)
    {
        position = 1;
    }

    var grnSize = dojo.cookie("GRNSize");
    grnSize = Math.abs(grnSize);

    if (position < grnSize)
    {
        position = position + 1;

        if (position >= grnSize)
        {
            lastGRN();
            dojo.byId("NavigationInformation").innerHTML =
                "You have reached the last GRN!";
            dijit.byId("NavigationDialog").show();
            return;
        }
    }
    
    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=next&position=" + position,
        //handleAs: "json",
        load: function(response)
        {
            var grn = dojo.fromJson(response);
            //populateGRNControls(response, position);
            populateGRNControls(grn, position);
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved",[{message: "<b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
}//End of function nextGRN

function lastGRN()
{
    var currentGRN = dojo.cookie("CurrentGRN");
    
    currentGRN = Math.abs(currentGRN);

    if (currentGRN < 0)
    {
        currentGRN = 0;
    }

    var grnSize = dojo.cookie("GRNSize");
    grnSize = Math.abs(grnSize);

    currentGRN = grnSize - 1;

    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=last",
        handleAs: "text",
        load: function(response)
        {
            var grn = dojo.fromJson(response);
            var position  = Math.abs(grn.size);
            
            populateGRNControls(grn, (position - 1));
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved",[{message: "<b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function lastGRN

function getGRNSize()
{
    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=size",
        handleAs: "text",
        load: function(response)
        {
            var grnSize = dojo.fromJson(response);
            dojo.cookie("GRNSize", grnSize.size, {expires: 5});
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
                return;
            }

            dojo.publish("/saved",[{message: "<b>...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function getGRNSize

/**
 * Function searches for an navigates to the searched item
 */
function findGRN()
{
    var grnId = dijit.byId("GRNKeywords").getValue();
    var controlToValidate = dijit.byId("GRNKeywords");
    var findButton = dijit.byId("GRN.Find");
    
    if (controlToValidate.validate())
    {
        findButton.disabled = true;
        statusMessageDisplays("searching", "Searching...");

        dojo.xhrGet(
        {
            url: "servlets/grnManager?operationType=find&output=JSON&grnId=" + grnId,
            load: function(response)
            {
                var grn = dojo.fromJson(response);
                var grnNo = grn.GRNNo;
 
                if (grnNo == 0)
                {
                    statusMessageDisplays("warning", "Did not find GRN #" + grnId);
                    findButton.disabled = false;
                    return;
                }

                statusMessageDisplays("info", "Found #" + grnId);
                populateGRNControls(grn, 0);
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Experienced a problems while" +
                " searching for GRN: #" + grnId);
            }
        });

        findButton.disabled = false;
    }//End of if statement block
//    else
//        controlToValidate.focus();

} //End of function findGRN

function refreshGRN()
{
    var grnId = dijit.byId("grnNo").getValue();

    if (grnId.toString() == "NaN")
    {
        dojo.byId("InformationMessage").innerHTML = "You can only refresh a viewable GRN";
        dijit.byId("InformationMessageDialog").show();
        return;
    }

    var position = dojo.cookie("CurrentGRN");

    if (position.toString() == "NaN")
        position = 0;

    position = Math.abs(position);

    dojo.xhrGet(
    {
        url: "servlets/grnManager?operationType=find&output=JSON&grnId=" + grnId,
        load: function(response)
        {
            var grn = dojo.fromJson(response);
            
            populateGRNControls(grn, position);
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
} //End of function findGRN

/**
 * Function saves a GRN Detail Item
 */
function saveGRNDetail()
{
    var grnId = dijit.byId("grnNo").getValue();
    var itemId = dijit.byId("GRNItems").getValue();
    var quantity = dijit.byId("GRNDetailsQuantity").getValue();
    var detailId = dojo.byId("GRNDetailId").innerHTML;
    var grid = dijit.byId("GRNDetails");
    var store = grid.store;

    var parameters = "grnId=" + grnId + "&detailId=" + detailId + "&itemId=" +
        itemId + "&quantity=" + quantity;

    /*
     * Now checking to ensure that the same item is not resaved (so that the
     *  same Item does not appear twice in the same GRN
     */

    var currentItemId;
    var currentItem;

    var rowCount = grid.rowCount;
    
    if (rowCount > 0)
    {
        for (var i = 0; i < rowCount; i++)
        {
            currentItemId = store.getValue(grid.getItem(i), "ItemId");
            currentItem = store.getValue(grid.getItem(i), "Item");

            if (currentItemId == itemId)
            {
                dojo.byId("ErrorMessage").innerHTML = currentItem +
                    " has " + "already been saved!";
                dijit.byId("ErrorMessageDialog").show();

                return;
            }
        }
    }
    
    if (dijit.byId("GRNDetailForm").validate())
    {
        dojo.xhrGet(
        {
            url: "servlets/grnDetailManager?operationType=save&" + parameters,
            load: function(response)
            {
                var detail = dojo.fromJson(response);

                var id = Math.abs(detail.id);

                if (id == 2)
                {

                    dojo.byId("ErrorMessage").innerHTML = "Quantity " +
                        "entered exceeds the quantity in the Purchase Order!";
                    dijit.byId("ErrorMessageDialog").show();
                    
                    var message =
                        "Quantity entered exceeds the quantity in the Purchase " +
                        " Order by : " +
                        detail.quantity;
                    statusMessageDisplays("error", message);

                    return;
                }

                var item = {GRNDetailId: detail.id, ItemId: detail.itemId,
                    Item: detail.item, quantity: detail.quantity};

                store.newItem(item);

                dijit.byId("GRNDetailDialog").hide();
                dojo.byId("GRNDetailErrorMessage").innerHTML = "";
            },
            error: function(response)
            {
                if (response.status == 0)
                {
                    sessionEnded();
                    return;
                }

                statusMessageDisplays("error", "Experienced unexpected error");
            }
        });
    } //End of if statement block
} //End of function saveGRNDetail

/**
 * Function populates the GRN controls with appropriate values
 */
function populateGRNControls(grn, position)
{
    var grnNo = dijit.byId("grnNo");
    var deliveryNote = dijit.byId("grnDeliveryNote");
    var receivedDate = dojo.byId("grnReceivedDate");
    var lpoNo = dijit.byId("grnLPONo");
    var grnInvoiceNo = dijit.byId("grnInvoiceNo");
    var grnNotes = dijit.byId("grnNotes");
    var grid = dijit.byId("GRNDetails");

    var grnId = Math.abs(grn.GRNNo);
    //alert(grnId);
    if (grnId == 0)
    {
        grnNo.setValue("");
        deliveryNote.setValue("");
        receivedDate.value = "";
        lpoNo.setValue("");
        grnInvoiceNo.setValue("");
        grnNotes.setValue("");
        dojo.byId("GRN.Status").innerHTML = "";

        clearGrid(grid);

        var size = grn.size;

        var navigator = dojo.byId("grnNavigator");

        dojo.cookie("GRNSize", 0, {expires: 1});
        dojo.cookie("CurrentGRN", 0,  {expires: 1});
        navigator.innerHTML = 0 + " of " + 0;
    }
    else
    {
        grnNo.setValue(grn.GRNNo);
        deliveryNote.setValue(grn.DeliveryNoteNo);
        receivedDate.value = grn.Date;
        lpoNo.setValue(grn.LPONo);
        grnInvoiceNo.setValue(grn.InvoiceNo);
        grnNotes.setValue(grn.Notes);
        dojo.byId("GRN.Status").innerHTML = "";
        var newStore = new dojo.data.ItemFileWriteStore({data: grn});
        grid.setStore(newStore);

        var size = grn.size;

        var navigator = dojo.byId("grnNavigator");

        dojo.cookie("GRNSize", size, {expires: 1});
        dojo.cookie("CurrentGRN", position,  {expires: 1});
        navigator.innerHTML = (position + 1) + " of " + size;
    }
} //End of function populateGRNControls

function getPendingLPOItems()
{
    var lpoId = dijit.byId("grnLPONo").getValue();

    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=lpoItems&lpoId=" + lpoId,
        load:  function(response)
        {
            var results = dojo.fromJson(response);

            var newStore = new dojo.data.ItemFileWriteStore({data: results});
            var grid = dijit.byId("GRNDetails");
            grid.setStore(newStore);

        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End of function getPendingLPOItems

function grnPrintPreview(id)
{
    window.open("procurement/print/grnDialog.jsp?operationType=find&output=HTML&grnId=" + id,
         "Goods Received Note", "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes");
}