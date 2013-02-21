<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Stores Issue Note</title>
    </head>
    <body>
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <tr>
                <td>
                    <div id="StoresIssue.toolbar" dojoType="dijit.Toolbar">
                       <button dojoType="dijit.form.Button" id="StoresIssue.new" onclick="newStoreIssue()"
                            iconClass="dijitEditorIcon dijitEditorIconCopy"
                            showLabel="true">
                        New
                       </button>
                       <button dojoType="dijit.form.Button" id="StoresIssue.update"
                        onclick="saveStoreIssue()" iconClass="dijitEditorIcon dijitEditorIconSave"
                        showLabel="true">Save</button>
                        <button dojoType="dijit.form.Button">
                            <img src="/static/resources/images/drive-harddisk.png" height="20px"/>
                            Save To File
                            <script type="dojo/method" event="onClick" args="evt">
                                var StoresIssueId = dijit.byId("StoresIssue.No").getValue();

                                if (StoresIssueId.toString() == "NaN")
                                {
                                    dojo.byId("InformationMessage").innerHTML = "You can only save to file a viewable Store Issue";
                                    dijit.byId("InformationMessageDialog").show();
                                    return;
                                }

                                dojo.byId("SaveDialogURL").innerHTML = "storeIssueManager";
                                dijit.byId("SaveDialog").show();
                            </script>
                        </button>

                       <button dojoType="dijit.form.Button" id="StoresIssue.delete"
                        iconClass="dijitEditorIcon dijitEditorIconDelete"
                            showLabel="true">
                        Delete
                            <script type="dojo/method" event="onClick" args="evt">
                                var StoresIssueId = dijit.byId("StoresIssue.No").getValue();

                                if (StoresIssueId.toString() == "NaN")
                                {
                                    dojo.byId("InformationMessage").innerHTML = "You can only delete a viewable StoresIssue";
                                    dijit.byId("InformationMessageDialog").show();
                                    return;
                                }

                                dijit.byId("StoresIssue.DeleteDialog").show();
                            </script>
                       </button>
                        <button dojoType="dijit.form.Button" id="StoresIssue.print">
                            <img src="/static/resources/images/print.png" width="16" height="16"/>
                            Print Preview
                            <script type="dojo/method" event="onClick" args="evt">
                                storeIssuePrintPreview(dijit.byId("StoresIssue.No").getValue());
                            </script>
                       </button>
                       <button dojoType="dijit.form.Button" onclick="refreshStoreIssue()">
                            <img src="/static/resources/images/refresh.png"/>
                            &nbsp;Refresh
                        </button>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div id="StoresIssue.toolbar2" dojoType="dijit.Toolbar">
                        <button dojoType="dijit.form.Button" id="StoresIssue.first" onClick="firstStoreIssue()">
                               <img alt="first button" src="/static/resources/images/first.png"
                               height="16" width="16">
                                   First
                            </button>
                           <button dojoType="dijit.form.Button" id="StoresIssue.previous" onClick="previousStoreIssue()">
                               <img src="/static/resources/images/previous.png" width="16" height="16">
                               Previous
                           </button>
                           <button dojoType="dijit.form.Button" id="StoresIssue.next" onClick="nextStoreIssue()">
                               <img src="/static/resources/images/next.png" width="16" height="16">
                               Next
                           </button>
                           <button dojoType="dijit.form.Button" id="StoresIssue.last" onClick="lastStoreIssue()">
                               <img src="/static/resources/images/last.png" width="16" height="16">
                                Last
                            </button>
                            &nbsp;&nbsp;&nbsp;
                            <input dojoType="dijit.form.NumberTextBox" name="keywords" id ="StoresIssue.Keywords"
                                   required="true" style="width: 150px;" maxlength="10" constraints="{pattern: '##0'}"
                                   invalidMessage="Invalid Store Issue Number" type="text" onchange="findStoreIssue()"/>
                            <button dojoType="dijit.form.Button" id="StoresIssue.find" onclick="findStoreIssue()">
                               <img src="/static/resources/images/find.png" width="16" height="16">
                                Find
                            </button>
                    </div>
                </td>
            </tr>
            <tr valign="top">
                <td>
                        <div id="StoresIssue.DeleteDialog" dojoType="dijit.Dialog" title="Delete">
                             <table width="360">
                                 <tr align="center">
                                     <td valign="middle" align="center" style="width:50px;">
                                         <img src="/static/resources/images/help-browser.png">
                                     </td>
                                     <td align="left">
                                         Are you sure you want to delete this Store Issue<br>
                                        <b>NOTE: You cannot undo this operation</b>
                                     </td>
                                 </tr>
                                 <tr align="center">
                                     <td colspan="2">
                                         <button dojoType="dijit.form.Button" onclick="deleteStoreIssue()"
                                             iconClass="dijitEditorIcon dijitEditorIconDelete" showLabel="true">
                                             Delete
                                         </button>

                                        <button id="StoresIssue.DeleteCancelButton" dojoType="dijit.form.Button">
                                            <img src="/static/resources/images/cancel.png" />
                                            Cancel
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("StoresIssue.DeleteDialog").hide();
                                            </script>
                                        </button>
                                     </td>
                                 </tr>
                             </table>
                        </div>

                        <div id="StoresIssue.DetailDialog" dojoType="dijit.Dialog" title="Store Issue Item">
                            <form id="StoresIssueDetail.Form" dojoType="dijit.form.Form"  method="post" action="servlets/StoresIssueDetailManager?operationType=save">
                                <table cellspacing="5" width="400px">
                                    <tr>
                                        <td><div id="StoresIssue.DetailId" style="display: none">-1</div></td>
                                        <td><div id="StoresIssue.DetailRowIndex" style="display: none">-1</div></td>
                                    </tr>
                                    <tr>
                                        <td>Item</td>
                                        <td>
                                            <div dojoType="dojo.data.ItemFileReadStore"
                                                jsId="StoresIssueItemStore"
                                                url="servlets/itemManager?operationType=getNames">
                                            </div>
                                            <input dojoType="dijit.form.FilteringSelect" required="true"
                                                store="StoresIssueItemStore" invalidMessage="You must select the Item"
                                                searchAttr="name" name="StoresIssue.Item" style="width: 100%"
                                                id="StoresIssueDetail.Item" >
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Quantity</td>
                                        <td>
                                            <input id="StoresIssueDetail.Quantity" dojoType="dijit.form.NumberTextBox"
                                             name="StoresIssueDetail.Quantity" required="true" style="width: 100%" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" colspan="2">
                                            <button dojoType="dijit.form.Button" onclick="saveStoreIssueDetail()">
                                                <img src="/static/resources/images/floppy.png" />
                                                Save
                                            </button>
                                            <button dojoType="dijit.form.Button">
                                                <img src="/static/resources/images/cancel.png" />
                                                Cancel
                                                <script type="dojo/method" event="onClick" args="evt">
                                                    dijit.byId("StoresIssue.DetailDialog").hide();
                                                </script>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <div id="StoresIssue.DeleteItem" dojoType="dijit.Dialog" title="Delete Stores Issue Item">
                            <table>
                                <tr>
                                    <td align="center" style="width:50px;">
                                        <img src="/static/resources/images/help-browser.png"/>
                                    </td>
                                    <td>
                                        Are you sure you want to delete this item ordered<br>
                                        <b>NOTE: You cannot undo this operation</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="center">
                                        <button dojoType="dijit.form.Button" onclick="deleteStoresIssueItem()">
                                            Delete
                                        </button>
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/resources/images/cancel.png" />
                                            Cancel
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("StoresIssue.DeleteItem").hide();
                                            </script>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <form id="StoresIssue.Form" dojoType="dijit.form.Form" method="post">
                        <table border="0" cellspacing="5" style="width:100%">
                            <tr>
                                <td><label>Navigation</label></td>
                                <td><div id="StoresIssue.Navigator">0</div></td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="StoresIssue.No">Issue #:</label>
                                </td>
                                <td>
                                    <input id="StoresIssue.No" name="StoresIssue.No" dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}"
                                    disabled style="width:180px; color:black;"/>
                                </td>
                            </tr>
                            <tr>
                                <td><label for="StoresIssue.OrderDate">Issue Date:</label></td>
                                <td>
                                    <input dojoType="dijit.form.DateTextBox" type="text" required="true"
                                        constraints="{datePattern:'dd-MMM-yyyy'}" style="width:180px;"
                                        id="StoresIssue.IssueDate" name="StoresIssue.IssueDate">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="StoresIssue.Supplier">Department/ Ward:</label>
                                </td>
                                <td>
                                    <div dojoType="dojo.data.ItemFileReadStore"
                                        jsId="departmentStore"
                                        url="servlets/departmentManager?operationType=getNames">
                                    </div>
                                    <input dojoType="dijit.form.FilteringSelect" required="true"
                                        store="departmentStore" invalidMessage="You must select the department"
                                        searchAttr="name" name="StoresIssue.Department" style="width:479px;"
                                        id="StoresIssue.Department">
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><label for="StoresIssue.Notes">Notes:</label></td>
                                <td>
                                    <input type="text" dojoType="dijit.form.Textarea" style="width:475px;"
                                        name="StoresIssue.Notes" id="StoresIssue.Notes"/>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr valign="bottom">
                                    <td colspan="2">
                                        <div dojoType="dijit.Toolbar">
                                            <button dojoType="dijit.form.Button">
                                                <img src="/static/resources/images/newrow1.png">
                                                    &nbsp; Add Detail
                                                    <script type="dojo/method" event="onClick" args="evt">
                                                        var StoresIssueNo = dijit.byId("StoresIssue.No").getValue();
                                                        StoresIssueNo = StoresIssueNo.toString();
                                                        
                                                        if ((StoresIssueNo.length < 1) || (StoresIssueNo == "NaN"))
                                                        {
                                                            var message = dojo.byId("InformationMessage");
                                                            message.innerHTML = "Please select the StoresIssue. whose details are to be appended";
                                                            dijit.byId("InformationMessageDialog").show();

                                                            return;
                                                        }

                                                        dojo.byId("StoresIssue.DetailId").innerHTML = -1;
                                                        dijit.byId("StoresIssue.DetailDialog").show();
                                                </script>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div dojoType="dojo.data.ItemFileWriteStore"
                                            jsId="StoresIssueDetailsStore" url="/static/resources/json/genericEmptyjson.json">
                                        </div>

                                       <table id="StoresIssueDetail.Table" dojoType="dojox.grid.DataGrid" store="StoresIssueDetailsStore" 
                                              selectionMode="single" autoHeight="true"
                                           style="border:1px solid silver; height:250px; width:100%;" query="{ StoresIssueDetailId: '*' }" clientSort="true">
                                               <script type="dojo/connect" event="onRowDblClick" args="evt" >
                                                   dijit.byId("StoresIssue.Supplier").focus();

                                                   var grid = evt.grid;

                                                   var detailId = grid.store.getValue(grid.getItem(evt.rowIndex), "StoresIssueDetailId");
                                                   var item = grid.store.getValue(grid.getItem(evt.rowIndex), "Item");
                                                   var unitPrice = grid.store.getValue(grid.getItem(evt.rowIndex), "unitPrice");
                                                   var quantity = grid.store.getValue(grid.getItem(evt.rowIndex), "quantity");
                                                   var total = grid.store.getValue(grid.getItem(evt.rowIndex), "Total");

                                                   var supplierId = dijit.byId("StoresIssue.Supplier").getValue();

                                                            dojo.xhrGet(
                                                            {
                                                                url: "servlets/supplierManager?operationType=details&supplierId=" + supplierId,
                                                                load: function(response)
                                                                {
                                                                    var results = dojo.fromJson(response);
                                                                    var store = new dojo.data.ItemFileReadStore({data: results});
                                                                    var items = dijit.byId("StoresIssue.SupplierItems");
                                                                    items.store = (store);
                                                                },
                                                                error: function(response)
                                                                {
                                                                    alert(response);
                                                                }

                                                            });


                                                   dojo.byId("StoresIssue.DetailId").innerHTML = detailId;
                                                   dijit.byId("StoresIssue.SupplierItems").setValue(item);
                                                   dijit.byId("StoresIssue.DetailsUnitPrice").setValue(unitPrice);
                                                   dijit.byId("StoresIssue.DetailsQuantity").setValue(quantity);
                                                   dijit.byId("StoresIssue.DetailsTotal").setValue(total);

                                                   dijit.byId("StoresIssue.DetailDialog").show();
                                                </script>

                                            <thead>
                                               <tr>
                                                  <th field="StoresIssueDetailId" width="5%" hidden="true" editable="false">ItemId</th>
                                                  <th field="Item" width="70%" editable="false">Item</th>
                                                  <th field="quantity" editable="false"  width="25%"
                                                      editor="dojox.grid.editors.Dijit"
                                                      editorClass="dijit.form.NumberTextBox"
                                                      constraint="{min: 0, max:5000}"
                                                      editorProps="{required:true}">Quantity</th>
                                               </tr>
                                            </thead>
                                        </table>
                                    </td>
                                </tr>
                        </table>
                    </form>
                </td>
            </tr>
        </table>
    </body>
</html>
