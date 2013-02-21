<%--
    Document   : items
    Created on : Jul 4, 2009, 5:48:30 PM
    Author     : root
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Ttems</title>
    </head>
    <body>
        <table cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td width="630">
                        <div id="items.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="items.new" onclick="newItem()"
                                iconClass="dijitEditorIcon dijitEditorIconCopy"
                                showLabel="true">
                            New
                           </button>
                           <button dojoType="dijit.form.Button" id="items.update"
                            onclick="saveItem()" iconClass="dijitEditorIcon dijitEditorIconSave"
                            showLabel="true">Save</button>

                           <button dojoType="dijit.form.Button" id="items.delete"
                            iconClass="dijitEditorIcon dijitEditorIconDelete"
                                showLabel="true">
                            Delete
                                <script type="dojo/method" event="onClick" args="evt">
                                    dijit.byId("ItemDeleteDialog").show();
                                </script>
                           </button>
                           <button dojoType="dijit.form.Button" id="items.first" onClick="firstItem()">
                               <img alt="first button" src="resources/images/first.png"
                               height="16" width="16">
                                   First
                            </button>
                           <button dojoType="dijit.form.Button" id="items.previous" onClick="previousItem()">
                               <img src="resources/images/previous.png" width="16" height="16">
                               Previous
                           </button>
                           <button dojoType="dijit.form.Button" id="items.next" onClick="nextItem()">
                               <img src="resources/images/next.png" width="16" height="16">
                               Next
                           </button>
                           <button dojoType="dijit.form.Button" id="items.last" onClick="lastItem()">
                               <img src="resources/images/last.png" width="16" height="16">
                                Last
                            </button>
                            <button dojoType="dijit.form.Button" id="items.find" onclick="findItem()">
                               <img src="resources/images/find.png" width="16" height="16">
                                Find
                                <script type="dojo/method" event="onClick" args="evt">
                                    // Show the Dialog:
                                    dijit.byId("ItemFindDialog").show();
                                </script>
                            </button>
                            &nbsp;&nbsp;
                    </div>
                    </td>
            </tr>
            <tr>
                <td>
                    <table border="0" width="600">
                        <tbody>
                            <tr>
                                <td>
                                    <div id="ItemFindDialog" dojoType="dijit.Dialog" title="Search">
                                        <table width="300" border="0">
                                             <tr>
                                                 <td align="left">
                                                     Enter the name of the item in the text box
                                                 </td>
                                             </tr>
                                             <tr align="center">
                                                 <td>
                                                     <input dojoType="dijit.form.TextBox" name="itemNamekeywords" id ="itemNamekeywords"
                                                           type="text" style="width:25em" />
                                                     <button dojoType="dijit.form.Button" onclick="findItem()">
                                                         <img src="resources/images/find.png" height="18">
                                                         Search
                                                     </button>
                                                    <button id="ItemSearchCancelButton" dojoType="dijit.form.Button">
                                                        <img src="resources/images/cancel.png">
                                                        Cancel
                                                        <script type="dojo/method" event="onClick" args="evt">
                                                            dijit.byId("ItemFindDialog").hide();
                                                        </script>
                                                    </button>
                                                     <input type="hidden" name="operationType" value="find">
                                                 </td>
                                             </tr>
                                             <tr>
                                                 <td colspan="2">
                                                     <div id="ItemSearchResults" style="font-weight: bold; text-align: left;"></div>
                                                 </td>
                                             </tr>
                                             <tr>
                                                 <td colspan="2">
                                                     <div dojoType="dojo.data.ItemFileWriteStore"
                                                        jsId="itemSearchStore" url="resources/json/genericEmptyjson.json">
                                                    </div>

                                                     <table id="itemSearchGrid" dojoType="dojox.grid.DataGrid" store="itemSearchStore"
                                                        query="{ itemId: '*' }" clientSort="true" style="width:600px; height:400px; cursor:pointer;">
                                                        <script type="dojo/method" event="onRowClick" args="evt">
                                                            var grid = evt.grid;
                                                            var itemId = grid.store.getValue(grid.getItem(evt.rowIndex), "itemId");
                                                            var itemPosition = grid.store.getValue(grid.getItem(evt.rowIndex), "position");

                                                            navigateToItem(itemId, itemPosition);
                                                            dojo.byId("ItemSearchResults").innerHTML = "";
                                                            dijit.byId("ItemFindDialog").hide();
                                                        </script>
                                                        <thead>
                                                           <tr>
                                                              <th field="itemId" hidden="true" width="5em">Supplier Id</th>
                                                              <th field="position" hidden="true" width="5em">Position</th>
                                                              <th field="itemName" width="250px">Item</th>
                                                              <th field="supplier" width="310px">Supplier</th>
                                                           </tr>
                                                        </thead>
                                                    </table>
                                                 </td>
                                             </tr>

                                         </table>
                                    </div>

                                    <div id="ItemDeleteDialog" dojoType="dijit.Dialog" title="Delete">
                                         <table width="300">
                                             <tr align="center">
                                                 <td valign="middle" align="left" style="width:50px;">
                                                     <img src="resources/images/question.png">
                                                 </td>
                                                 <td align="left">
                                                     Are you sure you want to delete this item?
                                                 </td>
                                             </tr>
                                             <tr align="center">
                                                 <td colspan="2">
                                                     <button dojoType="dijit.form.Button" onclick="deleteItem()" id="ItemDeleteButton">
                                                         <img src="resources/images/delete.png" height="18" />
                                                         Delete
                                                     </button>

                                                    <button id="itemDeleteCancelButton" dojoType="dijit.form.Button">
                                                        <img src="resources/images/cancel.png" />
                                                        Cancel
                                                        <script type="dojo/method" event="onClick" args="evt">
                                                            dijit.byId("ItemDeleteDialog").hide();
                                                        </script>
                                                    </button>
                                                 </td>
                                             </tr>
                                         </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <form dojoType="dijit.form.Form" id="itemsForm" name="itemsForm"
                                    action="servlets/itemManager" method="post">
                                        <table border="0" cellspacing="10">
                                            <tr>
                                                <td style="width:125px;">
                                                    <label for="itemsNavigator">Navigation:</label>
                                                </td>
                                                <td>
                                                    <span id="itemsNavigator">0</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="Items.Id">Item Id</label>
                                                </td>
                                                <td>
                                                    <input id="Items.Id" name="ItemId" type="text" dojoType="dijit.form.NumberTextBox" readonly/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="ItemName">Name:</label>
                                                </td>
                                                <td>
                                                    <input type="text" name="ItemName" id="ItemName"
                                                       dojoType="dijit.form.ValidationTextBox" trim="true"
                                                       uppercase="true" required="true" size="60"
                                                       invalidMessage="You must enter the item's name"
                                                       style="width: 30em;" value=""/>
                                                       </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div dojoType="dojo.data.ItemFileReadStore"
                                                        jsId="categoryStore"
                                                        url="servlets/categoryManager?operationType=getNames">
                                                    </div>
                                                    <label for="Items.Categories">Category:</label>
                                                </td>
                                                <td>
                                                    <input dojoType="dijit.form.FilteringSelect" required="true"
                                                        store="categoryStore" invalidMessage="You must select the item's category"
                                                        searchAttr="name" name="Items.Categories" style="width:430px;"
                                                        id="Items.Categories" name="Items.Categories"/>
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>

                                                    <div dojoType="dojo.data.ItemFileReadStore"
                                                        jsId="supplierStore"
                                                        url="servlets/supplierManager?operationType=getNames">
                                                    </div>

                                                    <label for="ItemSupplier">Supplier:</label>
                                                </td>
                                                <td>
                                                    <input dojoType="dijit.form.FilteringSelect"
                                                        store="supplierStore" invalidMessage="You must select the item's supplier"
                                                        searchAttr="name" style="width:430px;" name="ItemSupplier"
                                                        id="ItemSupplier">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="ItemUnitMeasurement">Measurement:</label>
                                                </td>
                                                <td>
                                                    <input type="text" name="ItemUnitMeasurement" id="ItemUnitMeasurement" size="11"
                                                       dojoType="dijit.form.TextBox"  style="width:15em;"/>
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                       <label for="ItemUnitPrice">Unit Price (UGX):</label>
                                                </td>
                                                <td>
                                                       <input dojoType="dijit.form.NumberTextBox" type="text" style="width:30em;"
                                                            constraints="{fractional:true}" id="ItemUnitPrice" name="ItemUnitPrice">
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="ItemQuantity">Quantity:</label>
                                                </td>
                                                <td>
                                                       <input dojoType="dijit.form.NumberTextBox" type="text" style="width:30em;"
                                                              constraints="{fractional:true}" id="ItemQuantity" name="ItemQuantity" readonly>
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="ItemDescription">Description:</label>
                                                </td>
                                                <td>
                                                    <input dojoType="dijit.form.TextBox" type="text" name="ItemDescription" id="ItemDescription"
                                                       size="30"  style="width:30em;"/>
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="hidden" value="save" name="operationType">
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>&nbsp;<br>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center">

                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>


