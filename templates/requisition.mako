<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
    
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Requisition</title>
    </head>
    <body class="tundra">
        <table cellspacing="0" cellpadding="0" width="100%" border="0">
            <tr>
                <td>
                </td>
            </tr>
            <tr>
                <td>
        <table border="0" width="100%">
            <tr>
                <td>
                    <div id="requisitionDeleteDialog" dojoType="dijit.Dialog" title="Confirm Deletion" style="width: 330px;">
                        <table align="center">
                             <tr align="center">
                                 <td valign="middle" style="width:50px;">
                                     <img src="/static/images/question.png">
                                 </td>
                                 <td align="center">
                                     Are you sure you want to delete this Requisition<br/>
                                     NOTE: This operation may affect the LPO this Requisition
                                     was generated for.
                                 </td>
                             </tr>
                             <tr align="center">
                                 <td colspan="2">
                                     <button dojoType="dijit.form.Button" onclick="deleteRequisition()"
                                           showLabel="true" iconClass="dijitEditorIcon dijitEditorIconDelete">
                                         Delete
                                     </button>

                                    <button id="requisitionDeleteCancelButton" dojoType="dijit.form.Button">
                                        <img src="/static/images/cancel.png" />
                                        Cancel
                                        <script type="dojo/method" event="onClick" args="evt">
                                            dijit.byId("requisitionDeleteDialog").hide();
                                        </script>
                                    </button>
                                 </td>
                             </tr>
                         </table>
                    </div>
                    <div id="RequisitionPendingLPOs" dojoType="dijit.Dialog" title="Pending Local Purchase Orders">
                        <table style="width:750px;">
                            <tr>
                                <td>
                                    <div dojoType="dijit.Toolbar">
                                        <button dojoType="dijit.form.Button" onclick="refreshLPOsByStatus()">
                                            <img src="/static/images/refresh.png"/>
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
                                   <table id="RequisitionPendingLPOTable" dojoType="dojox.grid.DataGrid" store="pendingLPOs"
                                    style="border:1px solid silver; height:350px; width:100%; cursor: pointer;"
                                    query="{ lpoId: '*' }" clientSort="true">
                                        <script type="dojo/method" event="onRowDblClick" args="evt">
                                            var grid = evt.grid;
                                            var lpoId = grid.store.getValue(grid.getItem(evt.rowIndex), "lpoId");

                                            dijit.byId("requisitionLPONo").setValue(lpoId);
                                            dijit.byId("RequisitionPendingLPOs").hide();
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
                    <div id="RequisitionDetailDialog" dojoType="dijit.Dialog" title="Goods Received Note Item">
                        <form id="RequisitionDetailForm" dojoType="dijit.form.Form"  method="post" action="servlets/lPODetailManager?operationType=save">
                            <table cellspacing="5" width="500px" border="0">
                                <tr>
                                    <td><div id="RequisitionDetailId" style="display: none;">-1</div></td>
                                    <td><div id="RequisitionDetailRowIndex" style="display: none">-1</div></td>
                                    <td><div id="RequisitionDetailSaveStatus" style="display: none">save</div></td>
                                    <td colspan="2"><div id="RequisitionDetailErrorMessage" style="display: block"></div></td>
                                </tr>
                                <tr>
                                    <td><label for="RequisitionItems">Item:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.FilteringSelect" required="true"
                                            invalidMessage="You must select the Item"
                                            searchAttr="Item" name="RequisitionSupplierItems"
                                            id="RequisitionItems" style="width: 100%;">
                                    </td>

                                </tr>
                                <tr>
                                    <td><label for="RequisitionDetailsQuantity">Quantity:</label></td>
                                    <td>
                                        <input id="RequisitionDetailsQuantity" dojoType="dijit.form.NumberTextBox"
                                                style="width: 100%;" constraints="{min:1}" invalidMessage="Enter a digit greater than zero!"
                                         name="RequisitionDetailsQuantity" required="true"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" colspan="2">
                                        <button dojoType="dijit.form.Button" onclick="saveRequisitionDetail()">
                                            <img src="/static/images/floppy.png" height="18" />
                                            Save
                                        </button>
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/images/cancel.png" />
                                            Cancel
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("RequisitionDetailDialog").hide();
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
                        <form dojoType="dijit.form.Form" id="requisitionForm" name="requisitionForm"
                        action="servlets/itemManager" method="post">
                            <table cellspacing="5" border="0">
                                <tr>
                                    <td>
                                        <div id="Requisition.Status" style="display: none;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="requisitionNo">Requisition #:</label></td>
                                    <td colspan="3">
                                        <input id="requisitionNo" dojoType="dijit.form.NumberTextBox" style=" color:black;" disabled/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="requisitionLPONo">LPO #:</label></td>
                                    <td>
                                        <input id="requisitionLPONo" name="requisitionLPONo" dojoType="dijit.form.NumberTextBox"
                                            constraints="{pattern: '##0'}"  disabled
                                            style="width:140px; color:black;" />
                                        <button dojoType="dijit.form.Button">
                                            Select
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("RequisitionPendingLPOs").show();
                                            </script>
                                        </button>
                                    </td>
                                    <td align="right"><label for="requisitionReceivedDate">Date:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.DateTextBox" type="text"
                                            constraints="{datePattern:'dd-MMM-yyyy'}" required="true"
                                        id="requisitionReceivedDate" name="requisitionReceivedDate">
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="requisitionInvoiceNo">Invoice #:</label></td>
                                    <td>
                                        <input dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}" type="text" required="true"
                                               id="requisitionInvoiceNo" name="requisitionInvoiceNo" maxlength="8" />
                                    </td>
                                    <td align="right" style="width:150px;">
                                        <label for="requisitionDeliveryNote">Delivery Note #:</label>
                                    </td>
                                    <td>
                                        <input  dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}" type="text"
                                            required="true" name="requisitionDeliveryNote" id="requisitionDeliveryNote" maxlength="8" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="requisitionWarranty">Notes:</label></td>
                                    <td colspan="3">
                                        <input type="text" dojoType="dijit.form.TextBox" style="width:100%;"
                                            name="requisitionNotes" id="requisitionNotes"/>
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
                                <img src="/static/images/newrow1.png">
                                Add Item
                                <script type="dojo/method" event="onClick" args="evt">
                                    var requisitionId = dijit.byId("requisitionNo").getValue();
                                    requisitionId = requisitionId.toString();
                                    if ((requisitionId == "NaN") || (requisitionId == "0") || (requisitionId.length < 1))
                                    {
                                        dojo.byId("WarningMessage").innerHTML = "First save the Requisition before " +
                                            "adding items to it!";
                                        dijit.byId("WarningMessageDialog").show();

                                        return;
                                    }

                                    var lpoId = dijit.byId("requisitionLPONo").getValue();
                                    
                                    dojo.xhrGet(
                                    {
                                        url: "servlets/lPOManager?operationType=lpoItems&lpoId=" + lpoId,
                                        //handleAs: "text",
                                        load: function(response)
                                        {
                                            var results = dojo.fromJson(response);
                                            var store = new dojo.data.ItemFileWriteStore({data: results});
                                            
                                            dijit.byId("RequisitionItems").store = store;
                                        },
                                        error: function(response)
                                        {
                                            dojo.publish("/saved", [{message: "...Failed: " + response, type: "error", duration: 5000}]);
                                            alert("Did not find LPO with identification number: " + keywords);
                                        }
                                    });
                                    //dijit.byId("RequisitionItems").store = store;
                                    dijit.byId("RequisitionItems").setValue("");
                                    dijit.byId("RequisitionDetailsQuantity").setValue("");
                                    dijit.byId("RequisitionDetailDialog").show();
                                </script>
                            </button>
                            <button dojoType="dijit.form.Button">
                                <img src="/static/images/deleterow.png">
                                &nbsp; Delete Item
                                <script type="dojo/method" event="onClick" args="evt">
                                    var grid = dijit.byId("RequisitionDetails");
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

                                    dojo.byId("Requisition.Status").innerHTML = true;
                                </script>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div dojoType="dojo.data.ItemFileWriteStore"
                            jsId="requisitionStore" url="/static/json/requisition.json">
                        </div>
                        <table id="RequisitionDetails" dojoType="dojox.grid.DataGrid" store="requisitionStore" autoHeight="true"
                            style="height:200px; border:1px solid silver; width: 95%; font-size: 100%;" query="{ ItemId: '*' }" clientSort="true">
                           <script type="dojo/connect" event="onCellClick" args="evt" >
                               //var searchTerms = this.model.getRow(evt.rowIndex).description;
                               var grid = dijit.byId("requisitionDetailsTable");
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
                                  <th field="RequisitionDetailId" width="5%" hidden="true" editable="false">RequisitionDetailId</th>
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
