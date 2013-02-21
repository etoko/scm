<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Goods Received Note</title>
    </head>
    <body class="tundra">
        <table cellspacing="0" cellpadding="0" width="100%" border="0">
            <tr>
                <td>
                        <div id="Goods_Returned.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="Goods_Returned.new" onclick="newGoods_Returned()"
                                iconClass="dijitEditorIcon dijitEditorIconCopy"
                                showLabel="true">
                            New
                           </button>
                           <button dojoType="dijit.form.Button" id="Goods_Returned.update"
                            onclick="saveGoods_Returned()" iconClass="dijitEditorIcon dijitEditorIconSave"
                            showLabel="true">
                               Save
                           </button>
                            <button dojoType="dijit.form.Button">
                                <img src="/static/resources/images/drive-harddisk.png" height="20px"/>
                                Save To File
                                <script type="dojo/method" event="onClick" args="evt">
                                    var Goods_ReturnedId = dijit.byId("Goods_ReturnedNo").getValue();

                                    if (Goods_ReturnedId.toString() == "NaN")
                                    {
                                        dojo.byId("InformationMessage").innerHTML = "You can only save to file a viewable Goods_Returned";
                                        dijit.byId("InformationMessageDialog").show();
                                        return;
                                    }

                                    dojo.byId("SaveDialogURL").innerHTML = "Goods_ReturnedManager";
                                    dijit.byId("SaveDialog").show();
                                </script>
                            </button>

                           <button dojoType="dijit.form.Button" id="Goods_Returned.delete"
                            iconClass="dijitEditorIcon dijitEditorIconDelete"
                                showLabel="true">
                            Delete
                                <script type="dojo/method" event="onClick" args="evt">
                                    var Goods_ReturnedId = dijit.byId("Goods_ReturnedNo").getValue();

                                    if (Goods_ReturnedId.toString() == "NaN")
                                    {
                                        dojo.byId("InformationMessage").innerHTML = "You can only delete a viewable Goods_Returned";
                                        dijit.byId("InformationMessageDialog").show();
                                        return;
                                    }
                                    dijit.byId("Goods_ReturnedDeleteDialog").show();
                                </script>
                           </button>
                           <button dojoType="dijit.form.Button">
                               <img src="/static/resources/images/printer.png" width="16px" height="16px"/>
                               Print Preview
                               <script type="dojo/method" event="onClick" args="evt">
                                   var Goods_ReturnedId = dijit.byId("Goods_ReturnedNo").getValue();
                                   
                                   if (Goods_ReturnedId.toString() == "NaN")
                                    {
                                        dojo.byId("InformationMessage").innerHTML = "You can only preview a viewable LPO";
                                        dijit.byId("InformationMessageDialog").show();
                                        return;
                                    }

                                    Goods_ReturnedPrintPreview(Goods_ReturnedId);
                               </script>
                           </button>
                           <button dojoType="dijit.form.Button" onclick="refreshGoods_Returned()">
                               <img src="/static/resources/images/refresh.png"/>
                               Refresh
                           </button>
                    </div>
                    <div dojoType="dijit.Toolbar">
                        <button dojoType="dijit.form.Button" id="Goods_Returned.first" onClick="firstGoods_Returned()">
                           <img alt="first button" src="/static/resources/images/first.png"
                           height="16" width="16">
                               First
                        </button>
                       <button dojoType="dijit.form.Button" id="Goods_Returned.previous" onClick="previousGoods_Returned()">
                           <img src="/static/resources/images/previous.png" width="16" height="16">
                           Previous
                       </button>
                       <button dojoType="dijit.form.Button" id="Goods_Returned.next" onClick="nextGoods_Returned()">
                           <img src="/static/resources/images/next.png" width="16" height="16">
                           Next
                       </button>
                       <button dojoType="dijit.form.Button" id="Goods_Returned.last" onClick="lastGoods_Returned()">
                           <img src="/static/resources/images/last.png" width="16" height="16">
                            Last
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <input dojoType="dijit.form.NumberTextBox" name="keywords" id ="Goods_ReturnedKeywords"
                            required="true" constraints="{pattern: '##0'}" style="width: 150px;"
                            type="text" onchange="findGoods_Returned()" maxlength="10"
                            invalidMessage="Invalid Goods_Returned Number" />
                        <button dojoType="dijit.form.Button" id="Goods_Returned.Find" onclick="findGoods_Returned()">
                           <img src="/static/resources/images/find.png" width="16" height="16">
                           Find
                        </button>
                        <span id="Goods_ReturnedSearchResults" style="font-weight:bold; font-size: 12px;"></span>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
        <table border="0" width="100%">
            <tr>
                <td>
                    <div id="Goods_ReturnedDeleteDialog" dojoType="dijit.Dialog" title="Confirm Deletion" style="width: 330px;">
                        <table align="center">
                             <tr align="center">
                                 <td valign="middle" style="width:50px;">
                                     <img src="/static/resources/images/question.png">
                                 </td>
                                 <td align="center">
                                     Are you sure you want to delete this Goods_Returned<br/>
                                     NOTE: This operation may affect the LPO this Goods_Returned
                                     was generated for.
                                 </td>
                             </tr>
                             <tr align="center">
                                 <td colspan="2">
                                     <button dojoType="dijit.form.Button" onclick="deleteGoods_Returned()"
                                           showLabel="true" iconClass="dijitEditorIcon dijitEditorIconDelete">
                                         Delete
                                     </button>

                                    <button id="Goods_ReturnedDeleteCancelButton" dojoType="dijit.form.Button">
                                        <img src="/static/resources/images/cancel.png" />
                                        Cancel
                                        <script type="dojo/method" event="onClick" args="evt">
                                            dijit.byId("Goods_ReturnedDeleteDialog").hide();
                                        </script>
                                    </button>
                                 </td>
                             </tr>
                         </table>
                    </div>
                    <div id="Goods_ReturnedPendingLPOs" dojoType="dijit.Dialog" title="Pending Local Purchase Orders">
                        <table style="width:750px;">
                            <tr>
                                <td>
                                    <div dojoType="dijit.Toolbar">
                                        <button dojoType="dijit.form.Button" onclick="refreshLPOsByStatus()">
                                            <img src="/static/resources/images/refresh.png"/>
                                            &nbsp;Refresh
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div dojoType="dojo.data.ItemFileWriteStore"
                                        jsId="pendingLPOs" url="servlets/lPOManager?operationType=pending&status=pending">
                                    </div>
                                   <table id="Goods_ReturnedPendingLPOTable" dojoType="dojox.grid.DataGrid" store="pendingLPOs"
                                    style="border:1px solid silver; height:350px; width:100%; cursor: pointer;"
                                    query="{ lpoId: '*' }" clientSort="true">
                                        <script type="dojo/method" event="onRowDblClick" args="evt">
                                            var grid = evt.grid;
                                            var lpoId = grid.store.getValue(grid.getItem(evt.rowIndex), "lpoId");

                                            dijit.byId("Goods_ReturnedLPONo").setValue(lpoId);
                                            dijit.byId("Goods_ReturnedPendingLPOs").hide();
                                        </script>
                                        <thead>
                                           <tr>
                                              <th field="lpoId" width="60px" editable="false">LPO #</th>
                                              <th field="supplier" width="330px" editable="false">Supplier</th>
                                              <th field="orderDate" width="90px" editable="false">Order Date</th>
                                              <th field="deliveryDate" width="90px" editable="false">Delivery Date</th>
                                              <th field="status" width="180px" editable="false">Status</th>
                                           </tr>
                                        </thead>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="Goods_ReturnedDetailDialog" dojoType="dijit.Dialog" title="Goods Received Note Item">
                        <form id="Goods_ReturnedDetailForm" dojoType="dijit.form.Form"  method="post" action="servlets/lPODetailManager?operationType=save">
                            <table cellspacing="5" width="500px" border="0">
                                <tr>
                                    <td><div id="Goods_ReturnedDetailId" style="display: none;">-1</div></td>
                                    <td><div id="Goods_ReturnedDetailRowIndex" style="display: none">-1</div></td>
                                    <td><div id="Goods_ReturnedDetailSaveStatus" style="display: none">save</div></td>
                                    <td colspan="2"><div id="Goods_ReturnedDetailErrorMessage" style="display: block"></div></td>
                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedItems">Item:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.FilteringSelect" required="true"
                                            invalidMessage="You must select the Item"
                                            searchAttr="Item" name="Goods_ReturnedSupplierItems"
                                            id="Goods_ReturnedItems" style="width: 100%;">
                                    </td>

                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedDetailsQuantity">Quantity:</label></td>
                                    <td>
                                        <input id="Goods_ReturnedDetailsQuantity" dojoType="dijit.form.NumberTextBox"
                                                style="width: 100%;" constraints="{min:1}" invalidMessage="Enter a digit greater than zero!"
                                         name="Goods_ReturnedDetailsQuantity" required="true"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" colspan="2">
                                        <button dojoType="dijit.form.Button" onclick="saveGoods_ReturnedDetail()">
                                            <img src="/static/resources/images/floppy.png" height="18" />
                                            Save
                                        </button>
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/resources/images/cancel.png" />
                                            Cancel
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("Goods_ReturnedDetailDialog").hide();
                                            </script>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </td>
            </tr>
            <tbody>
                <tr>
                    <td>
                        <form dojoType="dijit.form.Form" id="Goods_ReturnedForm" name="Goods_ReturnedForm"
                        action="servlets/itemManager" method="post">
                            <table cellspacing="5" border="0">
                                <tr>
                                    <td>
                                        <div id="Goods_Returned.Status" style="display: none;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:50px;"><label for="Goods_ReturnedNavigator">Navigation:</label></td>
                                    <td><div id="Goods_ReturnedNavigator">0</div></td>
                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedNo">Goods_Returned #:</label></td>
                                    <td colspan="3">
                                        <input id="Goods_ReturnedNo" dojoType="dijit.form.NumberTextBox" style=" color:black;" disabled/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedLPONo">LPO #:</label></td>
                                    <td>
                                        <input id="Goods_ReturnedLPONo" name="Goods_ReturnedLPONo" dojoType="dijit.form.NumberTextBox"
                                            constraints="{pattern: '##0'}"  disabled
                                            style="width:140px; color:black;" />
                                        <button dojoType="dijit.form.Button">
                                            Select
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("Goods_ReturnedPendingLPOs").show();
                                            </script>
                                        </button>
                                    </td>
                                    <td align="right"><label for="Goods_ReturnedReceivedDate">Date:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.DateTextBox" type="text"
                                            constraints="{datePattern:'dd-MMM-yyyy'}" required="true"
                                        id="Goods_ReturnedReceivedDate" name="Goods_ReturnedReceivedDate">
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedInvoiceNo">Invoice #:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}" type="text" required="true"
                                               id="Goods_ReturnedInvoiceNo" name="Goods_ReturnedInvoiceNo" maxlength="8" />
                                    </td>
                                    <td align="right" style="width:150px;">
                                        <label for="Goods_ReturnedDeliveryNote">Delivery Note #:</label>
                                    </td>
                                    <td>
                                        <input  dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}" type="text"
                                            required="true" name="Goods_ReturnedDeliveryNote" id="Goods_ReturnedDeliveryNote" maxlength="8" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="Goods_ReturnedWarranty">Notes:</label></td>
                                    <td colspan="3">
                                        <input type="text" dojoType="dijit.form.TextBox" style="width:100%;"
                                            name="Goods_ReturnedNotes" id="Goods_ReturnedNotes"/>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td>
                        <div dojoType="dijit.Toolbar">
                            <button dojoType="dijit.form.Button">
                                <img src="/static/resources/images/newrow1.png">
                                Add Item
                                <script type="dojo/method" event="onClick" args="evt">
                                    var Goods_ReturnedId = dijit.byId("Goods_ReturnedNo").getValue();
                                    Goods_ReturnedId = Goods_ReturnedId.toString();
                                    if ((Goods_ReturnedId == "NaN") || (Goods_ReturnedId == "0") || (Goods_ReturnedId.length < 1))
                                    {
                                        dojo.byId("WarningMessage").innerHTML = "First save the Goods_Returned before " +
                                            "adding items to it!";
                                        dijit.byId("WarningMessageDialog").show();

                                        return;
                                    }

                                    var lpoId = dijit.byId("Goods_ReturnedLPONo").getValue();
                                    
                                    dojo.xhrGet(
                                    {
                                        url: "servlets/lPOManager?operationType=lpoItems&lpoId=" + lpoId,
                                        //handleAs: "text",
                                        load: function(response)
                                        {
                                            var results = dojo.fromJson(response);
                                            var store = new dojo.data.ItemFileWriteStore({data: results});
                                            
                                            dijit.byId("Goods_ReturnedItems").store = store;
                                        },
                                        error: function(response)
                                        {
                                            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
                                            alert("Did not find LPO with identification number: " + keywords);
                                        }
                                    });
                                    //dijit.byId("Goods_ReturnedItems").store = store;
                                    dijit.byId("Goods_ReturnedItems").setValue("");
                                    dijit.byId("Goods_ReturnedDetailsQuantity").setValue("");
                                    dijit.byId("Goods_ReturnedDetailDialog").show();
                                </script>
                            </button>
                            <button dojoType="dijit.form.Button">
                                <img src="/static/resources/images/deleterow.png">
                                &nbsp; Delete Item
                                <script type="dojo/method" event="onClick" args="evt">
                                    var grid = dijit.byId("Goods_ReturnedDetails");
                                    var items = grid.selection.getSelected();
                                    var message = dojo.byId("InformationMessage");
                                    var store = grid.store;
                                    
                                    if ((items == null) || (items == ""))
                                    {
                                        message.innerHTML = "First select a row in the table";
                                        dijit.byId("InformationMessageDialog").show();
                                        return;
                                    }

                                    // Get all selected items from the Grid:
                                    if(items.length)
                                    {
                                        // Iterate through the list of selected items.
                                        // The current item is available in the variable
                                        // "selectedItem" within the following function:
                                        dojo.forEach(items, function(selectedItem) {
                                            if(selectedItem !== null) {
                                                // Delete the item from the data store:
                                                store.deleteItem(selectedItem);
                                            } // end if
                                        }); // end forEach
                                    } // end if

                                    dojo.byId("Goods_Returned.Status").innerHTML = true;
                                </script>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div dojoType="dojo.data.ItemFileWriteStore"
                            jsId="Goods_ReturnedStore" url="/static/resources/json/Goods_Returned.json">
                        </div>
                        <table id="Goods_ReturnedDetails" dojoType="dojox.grid.DataGrid" store="Goods_ReturnedStore" autoHeight="true"
                            style="height:200px; border:1px solid silver; width: 95%; font-size: 100%;" query="{ ItemId: '*' }" clientSort="true">
                           <script type="dojo/connect" event="onCellClick" args="evt" >
                               //var searchTerms = this.model.getRow(evt.rowIndex).description;
                               var grid = dijit.byId("Goods_ReturnedDetailsTable");
                               var value = grid.store.getValue(grid.getItem(evt.rowIndex), "Item");

                               if (evt.cellIndex != 2)
                               {
                                   return; //Return is valid
                               }
                               if (value == undefined)
                               {
                                   return;
                               }
                               //alert(value + " " + evt.cellIndex);

                               dojo.xhrGet(
                               {
                                    url: "servlets/itemManager?operationType=findByName&keywords=" + value,
                                    handleAs: "text",
                                    load: function (response)
                                    {
                                        alert(response);
                                    },
                                    error: function(response)
                                    {
                                        dojo.publish("/saved", [{message: "Experience an error: " + response, type: "error", duration: 5000}]);
                                    }
                               });
                            </script>
                            <thead>
                               <tr>
                                  <th field="Goods_ReturnedDetailId" width="5%" hidden="true" editable="false">Goods_ReturnedDetailId</th>
                                  <th field="ItemId" width="5%" hidden="true" editable="false">ItemId</th>
                                  <th field="Item" width="80%" editable="false">Item</th>
                                  <th field="quantity" editable="false" width="20%">Quantity</th>
                               </tr>
                            </thead>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
                </td>
            </tr>
        </table>
    </body>
</html>
