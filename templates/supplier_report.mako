<%-- 
    Document   : suppliers
    Created on : Oct 2, 2009, 3:30:20 AM
    Author     : root
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Supplier Report</title>
    </head>
    <body>
        <table width="100%" border="0">
            <tr>
                <td>
                    <div id="SupplierReport.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="SupplierReport.Refresh"
                                   onclick="getSupplierDetailsReport()">
                               <img src="resources/images/refresh.png" height="18" />
                                Refresh
                           </button>
                           <button dojoType="dijit.form.Button" id="SupplierReport.print"
                                   onclick="profilePrint()">
                                Print
                           </button>
                           <button dojoType="dijit.form.Button" id="SupplierReport.ToFile">
                               <img src="resources/images/drive-harddisk.png" height="18" />
                               Save To File
                               <script type="dojo/method" event="onClick" args="evt">
                                   dojo.byId("SaveDialogURL").innerHTML = "supplierManager";
                                   dijit.byId("SaveDialog").show();
                               </script>
                           </button>
                           <button dojoType="dijit.form.Button" onclick="getSupplierDetailsReport()">
                                <img src="resources/images/find.png" height="18" />
                                View Details
                            </button>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <form id="SupplierReport.Form" dojoType="dijit.form.Form">
                        <table cellspacing="5" border="0" style="width: 95%;">
                            <tr>
                                <td style="width: 15%">
                                    <div dojoType="dojo.data.ItemFileReadStore" jsId="supplierStore"
                                        url="servlets/supplierManager?operationType=getNames">
                                    </div>
                                    <label for="SupplierReport.SupplierName">Supplier:</label>
                                </td>
                                <td colspan="3">
                                    <input id="SupplierReport.SupplierName" name="ItemSupplier" dojoType="dijit.form.FilteringSelect"
                                        store="supplierStore" invalidMessage="You must enter the supplier's name"
                                        searchAttr="name" style="width:100%;" required="true" />
                                </td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.Contact">Contact:</label></td>
                                <td colspan="3"><input dojoType="dijit.form.TextBox" id="SupplierReport.Contact"
                                                       style="width: 100%;" class="disabledInput" disabled></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.Address">Address:</label></td>
                                <td colspan="3">
                                    <input dojoType="dijit.form.Textarea" id="SupplierReport.Address"
                                                        class="disabledInput" disabled></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.Email">Email:</label></td>
                                <td colspan="3"><input dojoType="dijit.form.TextBox" id="SupplierReport.Email"
                                                     style="width: 100%;" class="disabledInput" disabled></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.Tel">Tel:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.Tel" style="width: 90%;"
                                           class="disabledInput" disabled></td>
                                <td><label for="SupplierReport.Fax">Fax:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.Fax"
                                            class="disabledInput" style="width: 100%;" disabled></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.City">City:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.City" style="width: 90%;"
                                            class="disabledInput" disabled></td>
                                <td><label for="SupplierReport.Country">Country:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.Country"
                                            class="disabledInput" style="width: 100%;" disabled></td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border-bottom: 1px solid silver;"><br/><b>Banking Information</b></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.Bank">Bank:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.Bank"
                                            class="disabledInput" style="width: 90%;" disabled></td>
                                <td><label for="SupplierReport.Branch">Branch:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.Branch"
                                            class="disabledInput" style="width: 100%;" disabled></td>
                            </tr>
                            <tr>
                                <td><label for="SupplierReport.AccountName">Account Name:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.AccountName"
                                            class="disabledInput" style="width: 90%;" disabled></td>
                                <td><label for="SupplierReport.AccountNumber">Country:</label></td>
                                <td><input dojoType="dijit.form.TextBox" id="SupplierReport.AccountNumber"
                                            class="disabledInput" style="width: 100%;" disabled></td>
                            </tr>
                        </table>
                    </form>
                </td>
            </tr>
            <tr>
                <td><br><b>Items supplied:</b>
                    <div dojoType="dojo.data.ItemFileWriteStore"
                        jsId="itemStore" url="resources/json/genericEmptyjson.json"></div>
                    <table id="SupplierReport.Items" dojoType="dojox.grid.DataGrid" store="itemStore"
                           loadingMessage="Loading" autoHeight="true"
                           style="width: 100%; height: 300px; border: 1px solid silver; font-size: 100%;"
                           query="{ itemId: '*' }" clientSort="true">
                            <thead>
                               <tr>
                                  <th field="itemId" width="2%" hidden="true">Item Id</th>
                                  <th field="name" width="60%">Item Name</th>
                                  <th field="unitMeasurement" width="20%">Unit Measurement</th>
                                  <th field="unitPrice" width="18%">Unit Price</th>
                               </tr>
                            </thead>
                        </table>
                </td>
            </tr>
        </table>
    </body>
</html>
