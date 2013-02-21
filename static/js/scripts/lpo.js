/*
 *Handles operations of the Local Purchase Order  page such as navigation, saving
 *new records and so on.
*/

function getSupplierAddress()
{
    var supplierID = dijit.byId("LPOSupplier").getValue();
    var supplierAddress = dijit.byId("LPOSupplierAddress");
    var supplierTelNo = dijit.byId("LPOSupplierTelNo");
    var supplierFaxNo = dijit.byId("LPOSupplierFaxNo");

    if ((supplierID == null) || (supplierID == ""))
    {
        return;
    }
    
    dojo.xhrGet(
    {
        url: "servlets/supplierManager?operationType=findByPk&supplierId="+supplierID,
        load: function (response)
        {
            var supplier = dojo.fromJson(response);
            supplierAddress.setValue(supplier.address);
            supplierTelNo.setValue(supplier.tel);
            supplierFaxNo.setValue(supplier.fax);
        },
        error: function (response)
        {
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000000}]);
        }
    });
}//End of function getSupplierAddress

function getGRNs()
{
    var lpoId = dijit.byId("LPO.Id").getValue();
    var grid = dijit.byId("LPOGRNTable");
    
    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=getGRNs&lpoId=" + lpoId,
        load: function(response)
        {
            var grns = dojo.fromJson(response);
            var store = new dojo.data.ItemFileReadStore({data: grns});
            dijit.byId("LPOGRNs").show();
            grid.setStore(store);
        },
        error: function(response)
        {
            var statusCode = Math.abs(response.status);

            if (statusCode == 0)
            {
                document.location = "login.jsp";
            }

            statusMessageDisplays("error", "You have been logged out after " +
                "your session timed out!");
        }
    });
} //End of function getGRNs

/**
 * Function creates a new LPO
 */
function newLPO()
{
    var lpoNumber = dijit.byId("LPO.Id");
    var status = dojo.byId("LPOStatus");
    var supplierID = dijit.byId("LPOSupplier");
    var supplierAddress = dijit.byId("LPOSupplierAddress");
    var supplierTelNo = dijit.byId("LPOSupplierTelNo");
    var supplierFaxNo = dijit.byId("LPOSupplierFaxNo");
    var orderDate = dijit.byId("LPOOrderDate");
    var deliveryDate = dijit.byId("LPODeliveryDate");
    var paymentTerms = dijit.byId("LPOPaymentTerms");
    var warranty = dijit.byId("LPOWarranty");
    dijit.byId("LPO.DeliveryLocation").setValue("");
    dijit.byId("LPOGrandTotal").setValue("");

    var grid = dijit.byId("lpoDetailsTable");

    lpoNumber.setValue(0); /*alert("Isrone Rocks");*/
    supplierAddress.setValue("");
    supplierTelNo.setValue("");
    supplierFaxNo.setValue("");
    orderDate.setValue("");
    deliveryDate.setValue("");
    paymentTerms.setValue("");
    warranty.setValue("");
    status.innerHTML = "PENDING";

    dojo.publish("/saved", [{message: "<font size='2'><b>Enter new LPO", type: "info", duration: 5000000}]);

    var newStore = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
    grid.setStore(newStore);
} //End of function newLPO

/**
 * Function to save a new LPO entity into the system
 */
function saveLPO()
{
    var lpoStatus = dojo.byId("LPOStatus").innerHTML;
    
    if (lpoStatus.toString() !== "PENDING")
    {
        var message = dojo.byId("InformationMessage");
        message.innerHTML = "You cannot edit a purchase order for which at least one Goods Received Note has already been received";
        dijit.byId("InformationMessageDialog").show();
        return;
    }//ENd of if statement block

    var lpoField = dijit.byId("LPO.Id");
    var orderDate = dojo.byId("LPOOrderDate").value;
    var deliveryDate = dojo.byId("LPODeliveryDate").value;
    var formToValidate = dijit.byId("LPOForm");

    //Checker if the user did not click the "New" button of Purchase Order tab
    /*
    if (lpoField.getValue().toString() == "NaN")
    {
        var message = dojo.byId("ErrorMessage");
        message.innerHTML = "Click the \"New\" button to create a new Purchase Order or navigate to a specified Purchase Order in order to edit it";
        dijit.byId("ErrorMessageDialog").show();
        return;
    }
    */
   
    if (formToValidate.validate())
    {
        var lpoId = lpoField.getValue();
        var data = "&LPO.Id=" + lpoId + "&orderDate=" + orderDate + "&deliveryDate=" + deliveryDate;

        dojo.publish("/saving", [{message: "<font size='2'><b>Saving...</b>", type: "info", duration: 5000}]);
        dojo.xhrPost(
        {
            form: "LPOForm",
            url: "servlets/lPOManager?operationType=save" + data,
            load: function(response)
            {
                var results = dojo.fromJson(response);
                lpoField.setValue(results.lPOId);
                dojo.publish("/saved", [{message: "<font size='2'><b>...Saved</b>", type: "info", duration: 10000}]);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Failed: </b>" + response, type: "error", duration: 10000}]);
            }
        });
    }
} //End of function save

/**
 *Function saves an LOPDetail
 */
function saveLPODetail()
{
    var unitPrice = dijit.byId("LPODetailsUnitPrice");
    var total = dijit.byId("LPODetailsTotal");
    var formToValidate = dijit.byId("LPODetailForm");
    var item = dijit.byId("LPOSupplierItems").getValue();
    var itemName = dojo.byId("LPOSupplierItems").value;
    var quantity = dijit.byId("LPODetailsQuantity").getValue();
    var lpoId = dijit.byId("LPO.Id").getValue();
    var detailId = dojo.byId("LPODetailId").innerHTML;
    var grid = dijit.byId("lpoDetailsTable");
    var lpoDetailId = "";

    var rowCount = grid.rowCount;

    if (formToValidate.validate())
    {
        for (var i = 0; i < rowCount; i++)
        {
            var value = grid.getItem(i);

            if (value == null)
            {
                break;
            }
            else
            {
                if ( item == value.itemId)
                {
                    var detailSaveStatus = dojo.byId("LPODetailSaveStatus").innerHTML;

                    if (detailSaveStatus.toString() == "save")
                    {
                        var message = dojo.byId("ErrorMessage");
                        message.innerHTML = itemName + " is already in the Purchase Order";
                        dijit.byId("ErrorMessageDialog").show();
                        return;
                    }
                } //End of inner if statement block
            } //End of else statement block
        }//ENd of for statement block
    
        var data = "&LPODetailId=" + detailId + "&LPOId=" + lpoId +
            "&LPODetailsQuantity=" + quantity + "&LPOSupplierItems=" + item;
        
        dojo.xhrPost(
        {
            url: "servlets/lPODetailManager?operationType=save" + data,
            load: function(response)
            {
                var detail = dojo.fromJson(response);
                lpoDetailId = detail.detailId;
                item = detail.itemId;
                itemName = detail.itemName;
                unitPrice = detail.unitPrice;
                quantity = detail.quantity;
                total = detail.total;
                
                var gridStore = grid.store;
                var rowIndex = dojo.byId("LPODetailRowIndex").innerHTML;
                var newDetail = {lpoDetailId: lpoDetailId, itemId: item, Item: itemName, unitPrice: unitPrice, quantity: quantity, Total: total};

                if (detailId == -1)
                {
                    gridStore.newItem(newDetail);
                } //ENd of if statement block
                else
                {
                    var item = grid.getItem(rowIndex);

                    grid.store.setValue(item, "lpoDetailId", lpoDetailId);
                    grid.store.setValue(item, "itemId", item);
                    grid.store.setValue(item, "Item", itemName);
                    grid.store.setValue(item, "unitPrice", unitPrice);
                    grid.store.setValue(item, "quantity", quantity);
                    grid.store.setValue(item, "Total", total);
                } //End of else statement block
                
                calculateGrandTotal();

                dojo.byId("LPODetailId").innerHTML = -1;
                dojo.byId("LPODetailSaveStatus").innerHTML = "save";
                dijit.byId("LPODetailDialog").hide();
            },
            error: function(response)
            {
                alert(response);
            }
        });

    } //End of fi statement block
} //End of method saveLPODetail

/**
 *Function deletes an LPO item from the LPODetails Table as well as the
 *underlying persistence.
 */
function deleteLPOItem()
{
    var grid = dijit.byId("lpoDetailsTable");
    var items = grid.selection.getSelected();
    var store = grid.store;
    var lpoDetailId = null;

    if(items.length)
    {
        // Iterate through the list of selected items.
        // The current item is available in the variable
        // "selectedItem" within the following function:

        dojo.forEach(items, function(selectedItem)
        {
            if(selectedItem !== null)
            {
                lpoDetailId = selectedItem.lpoDetailId;
            } // end if

        }); // end forEach
    }//End of if statememt

    if ( lpoDetailId !== null)
    {
        dojo.publish("/saving", [{message: "<font size='2'><b>Deleting Item...</b>", type: "info", duration: 5000}]);
        
        dojo.xhrGet(
        {
            url: "servlets/lPODetailManager?operationType=delete&LPODetailId=" + lpoDetailId,
            load: function(response)
            {
                if(items.length)
                {
                    // Iterate through the list of selected items.
                    // The current item is available in the variable
                    // "selectedItem" within the following function:
                    dojo.forEach(items, function(selectedItem)
                    {
                        if(selectedItem !== null)
                        {
                            // Delete the item from the data store:
                            store.deleteItem(selectedItem);
                        } // end if
                    }); // end forEach
                } // end if
                dojo.publish("/saved", [{message: "<font size='2'><b>...Deleted Item</b>", type: "info", duration: 10000}]);

            },
            error: function(response)
            {
                dojo.publish("/saving", [{message: "<font size='2'><b>...Failed</b>" + response, type: "error", duration: 10000}]);
            }

        });
    }
    else
    {
        alert("Encountered an unexpected error!<br> Try refreshing the page");
    }

    dijit.byId("LPODeleteItem").hide();
} //End of function deleteLPOItem

function firstLPO()
{    
    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=first",
        handleAs: "text",
        load: function (response)
        {
            var lpo = dojo.fromJson(response);
            
            var position = 0;
            populateLPOControls(lpo, position);
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                Window.location = "login.jsp"
            }
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
        }

    });
}

function previousLPO()
{
    var position = dojo.cookie("currentLPO");

    if ((position == undefined) || (position == null))
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position - 1;

    if (position < 0)
    {
        position = 0;
        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the first Local Purchase Order!";
        dijit.byId("NavigationDialog").show();
        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=previous&position=" + position,
        handleAs: "text",
        load: function (response)
        {
            var lpo = dojo.fromJson(response);

            populateLPOControls(lpo, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
        }
    });
}//End of function previousLPO

/**
 *Function navigates to the nextLPO
 */
function nextLPO()
{
    var position = dojo.cookie("currentLPO");

    if (position == undefined)
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position + 1;

    var numberOfLPOs = dojo.cookie("numberofLPOs");
    numberOfLPOs = Math.abs(numberOfLPOs);

    if (position > (numberOfLPOs - 1))
    {
        position = (numberOfLPOs - 1);
        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the last Local Purchase Order!";
        dijit.byId("NavigationDialog").show();
        return;
    }//End of if statement block

    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=next&position=" + position,
        handleAs: "text",
        load: function (response)
        {
            var lpo = dojo.fromJson(response);
            
            populateLPOControls(lpo, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000000}]);
        }

    });
}//End of function nextLPO

/**
 *Navigates to the last Local Purchase Order in the list.
 */
function lastLPO()
{
    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=last",
        handleAs: "text",
        load: function (response)
        {
            var lpo = dojo.fromJson(response);
            var position = Math.abs(lpo.size) - 1;
            populateLPOControls(lpo, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
        }

    });
}//End of function lastLPO

/**
 * function searches and displays particulars of an LPO entity.
 */
function findLPO()
{
    var searchControl = dijit.byId("LPOKeywords");
    var keywords = dijit.byId("LPOKeywords").getValue();

    var lpoSearchResults = dojo.byId("LPOSearchResults");

    if (searchControl.validate())
    {
        var currentLPO = dojo.cookie("currentLPO");

        if (currentLPO == undefined)
        {
            currentLPO = 0;
        }

        currentLPO = Math.abs(currentLPO);
        currentLPO = currentLPO + 1;

        var numberOfLPOs = dojo.cookie("numberofLPOs");
        numberOfLPOs = Math.abs(numberOfLPOs);

        statusMessage("searching", "Searching ...");

        if (keywords.toString() == "NaN")
        {
            lpoSearchResults.innerHTML = "Enter a valid LPO #";
            return;
        }

        dojo.xhrGet(
        {
            url: "servlets/lPOManager?operationType=find&output=JSON&keywords=" + keywords,
            handleAs: "text",
            load: function(response)
            {
                var lpo = dojo.fromJson(response);

                if (lpo.LPONo == -1)
                {
                    statusMessageDisplays("warning", "Did not find LPO #: " + keywords);
                    return;
                }
                var position = 0;
                populateLPOControls(lpo, position);
                
                statusMessageDisplays("info", "... Found LPO #" + keywords);
                dijit.byId("LPOSupplier").focus();
            },
            error: function(response)
            {
                statusMessageDisplays("resources/images/error-large.gif", 
                "... Experienced a problem while searching for LPO #" +
                    keywords);
                dojo.publish("/saved", [{message: "...Failed: " + response,
                        type: "error", duration: 5000}]);
            }
        });

        lPOStatusMessageDisplays();
    } //End of if statement block
}//End of function findLPO

/**
 * Function to delete the current LPO
 */
function deleteLPO()
{
    var id = dijit.byId("LPO.Id");
    var status = dojo.byId("LPOStatus").innerHTML;
    var parameters = "&id=" + id + "&status=" + status;

    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=delete" + parameters,
        load: function (response)
        {
            nextLPO();
            dijit.byId("LPODeleteDialog").hide();
        },
        error: function(response)
        {
            var errorMessage = "Failed to delete LPO. It probably has a GRN already created for it. First delete any associated GRNs before deleting this LPO";
            //dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000000}]);
            dijit.byId("LPODeleteDialog").hide();
            dojo.byId("ErrorMessage").innerHTML = errorMessage;
            dijit.byId("ErrorMessageDialog").show();
        }
    });
}//End of function deleteLPO

function lpoPrint()
{
    var grid = dijit.byId("lpoDetailsTable");
//    var numOfRows = grid.getRowCount();
    var value = grid.store.getValue(grid.getItem(0), "Item");
    alert(value + " row count: " );
    alert(grid.rows.getRowCount());

// WindowObjectReference = window.open("procurement/suppliersprint.jsp",
// "CNN_WindowName",
// "menubar=no,location=no,resizable=no,scrollbars=no,status=no");

}

/**
 * Function retrieves the price of an item
 */
function findItemPrice()
{
    var itemId = dijit.byId("LPOSupplierItems").getValue();

    if (itemId.length < 1)
    {
        return;
    }

    var unitPrice = dijit.byId("LPODetailsUnitPrice");

    dojo.xhrGet(
    {
        url: "servlets/itemManager?operationType=findByPK&itemId="+itemId,
        handleAs: "text",
        load: function(response)
        {
            var item = dojo.fromJson(response);
            unitPrice.setValue(item.itemUnitPrice);
            calculateItemTotal();
        },
        error: function(response)
        {
            dojo.publish("/saving", [{message: "...Failed " + response, type: "error", duration: 5000}]);
        }
    });

} //End of function findItemPrice

/**
 * Function calculates the section total of a row in LPO details.
 */
function calculateItemTotal()
{
    var unitPrice = dijit.byId("LPODetailsUnitPrice").getValue();
    var quantity = dijit.byId("LPODetailsQuantity").getValue();
    var total = dijit.byId("LPODetailsTotal");

    unitPrice = Math.abs(unitPrice);
    quantity = Math.abs(quantity);

    total.setValue(unitPrice * quantity);
} //End of function calculateItemTotal

/**
 * Function calculates the grand total of items in the grid
 */
function calculateGrandTotal()
{
    var grid = dijit.byId("lpoDetailsTable");

    var i = 0;
    i = Math.abs(i);

    var item = null;

    var grandTotal = 0;
    grandTotal = Math.abs(grandTotal);
    var total = 0;

    for (i = 0; i < 500; i++)
    {
        item = grid.getItem(i)

        if (item == null)
        {
            break;
        }
        total = grid.store.getValue(grid.getItem(i), "Total");

        total = Math.abs(total);

        grandTotal = grandTotal + total;
    }

    dijit.byId("LPOGrandTotal").setValue(grandTotal);
} //End of function calculateGrandTotal

function refreshLPO()
{
    var keywords = dijit.byId("LPO.Id").getValue();

    if ((keywords.toString() == "NaN") || (keywords.toString() == "0"))
    {
        dojo.byId("InformationMessage").innerHTML = "You can only refresh a viewable LPO";
        dijit.byId("InformationMessageDialog").show();
        return;
    }

    var position = dojo.cookie("currentLPO");

    if (position == undefined)
    {
        position = 0;
    }

    position = Math.abs(position);

    var numberOfLPOs = dojo.cookie("numberofLPOs");
    numberOfLPOs = Math.abs(numberOfLPOs);

    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=find&output=JSON&keywords=" + keywords,
        handleAs: "text",
        load: function(response)
        {
            var lpo = dojo.fromJson(response);

            populateLPOControls(lpo, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
            alert("Did not find LPO with identification number: " + keywords);
        }
    });
}

/**
 * Function reloads all the pending LPOs
 */
function refreshLPOsByStatus()
{
    var grid = dijit.byId("GRNPendingLPOTable");
    dojo.xhrGet(
    {
        url: "servlets/lPOManager?operationType=pending&output=JSON&status=pending",
        load: function(response)
        {
            var results = dojo.fromJson(response);
            var store = new dojo.data.ItemFileWriteStore({data: results});
            grid.setStore(store);
        },
        error: function(response)
        {
            alert(response);
        }
    });
} //End method refreshLPOsByStatus


function populateLPOControls(lpo, position)
{
    var lpoId = dijit.byId("LPO.Id");
    var orderDate = dojo.byId("LPOOrderDate");
    var deliveryDate = dojo.byId("LPODeliveryDate");
    var supplierAddress = dijit.byId("LPOSupplierAddress");
    var supplierTelNo = dijit.byId("LPOSupplierTelNo");
    var supplierFaxNo = dijit.byId("LPOSupplierFaxNo");
    var lpoSupplier = dijit.byId("LPOSupplier");
    var paymentTerms = dijit.byId("LPOPaymentTerms");
    var warranty = dijit.byId("LPOWarranty");
    var deliveryLocation = dijit.byId("LPO.DeliveryLocation");
    var currentPostion = dijit.byId("LPO.CurrentPosition");
    
    var status = dojo.byId("LPOStatus");
    var navigator = dojo.byId("LPO.Count");

    dijit.byId("LPOGrandTotal").setValue(lpo.grandTotal);
    lpoId.setValue(lpo.LPONo);
    orderDate.value = lpo.OrderDate;
    deliveryDate.value = lpo.DeliveryDate;
    lpoSupplier.setValue(lpo.Supplier);
    supplierAddress.setValue(lpo.SupplierAddress);
    supplierTelNo.setValue(lpo.SupplierTel);
    supplierFaxNo.setValue(lpo.SupplierFax);
    paymentTerms.setValue(lpo.paymentTerms);
    warranty.setValue(lpo.warranty);
    deliveryLocation.setValue(lpo.deliveryLocation);
    status.innerHTML = lpo.Status;
    var lpoSize = lpo.size;
    navigator.innerHTML = lpoSize;
    currentPostion.setValue((position + 1));

    var newStore = new dojo.data.ItemFileWriteStore({data: lpo});
    var grid = dijit.byId("lpoDetailsTable");
    grid.setStore(newStore);

    position = Math.abs(position);
    lpoSize = Math.abs(lpoSize);

    if (position > lpoSize)
    {
        position = lpoSize;
    }

    dojo.cookie("numberofLPOs", lpoSize, {expires: 1});
    dojo.cookie("currentLPO", position,  {expires: 1});
    //calculateGrandTotal();
} //End of method populateLPOControls

function lpoPrintPreview(keywords)
{
    window.open("procurement/print/lpoDialog.jsp?operationType=find&output=HTML&keywords=" + keywords,
         "Purchase Order",
         "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes");
}

/**
 * Function displays status bar messages and appropriate icons
 */
function lPOStatusMessageDisplays()
{
    var messagePane = dojo.byId("LPOSearchResults");
    
    dojo.fadeOut(
    {
        node: messagePane,
        duration: 15000,
        onEnd: function()
        {
            messagePane.innerHTML = "";
            dojo.query(messagePane).style({opacity: 1, visibility: "visible"});
        }
    }).play();
} //End of function lPOStatusMessageDisplays