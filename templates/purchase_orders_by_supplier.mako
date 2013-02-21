<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <form id="LPOReportBySupplierForm" dojoType="dijit.form.Form">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
                <td colspan="5">
                    <div id="LPOReportBySupplier.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="LPOReportBySupplier.print">
                                <img src="static/resources/images/print.png" height="16px" width="16px"/>
                                Print Preview
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("LPOReportBySupplier.State").innerHTML;

                                    if (display.toString() == "none")
                                    {
                                        dojo.byId("InformationMessage").innerHTML = "You can only print successful search results. First submit your search query";
                                        dijit.byId("InformationMessageDialog").show();
                                        
                                        return;
                                    }

                                    var supplierId = dijit.byId("LPOReportBySupplierSupplier").getValue();
                                    var supplierName = dojo.byId("LPOReportBySupplierSupplier").value;
                                    var beginDate = dojo.byId("LPOReportBySupplierBeginDate").value;
                                    var endDate = dojo.byId("LPOReportBySupplierEndDate").value;
                                    var formToValidate = dijit.byId("LPOReportBySupplierForm");

                                    if (formToValidate.validate())
                                    {
                                        window.open("procurement/print/lpoBySupplierDialog.jsp?operationType=findBySupplier&output=HTML&supplierName=" +
                                            supplierName + "&supplierId=" + supplierId + "&beginDate=" + beginDate + "&endDate=" + endDate,
                                             "Purchase Order by Supplier - Print Preview",
                                             "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
                                    }
                                </script>
                           </button>
                           <button dojoType="dijit.form.Button" id="LPOReportBySupplier.update">
                                <img src="static/resources/images/drive-harddisk.png" height="20px"/>
                                Save To File
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("LPOReportBySupplier.State").innerHTML;

                                    if (display.toString() == "none")
                                    {
                                        dojo.byId("InformationMessage").innerHTML = "You can only save to file search results. First submit your search query";
                                        dijit.byId("InformationMessageDialog").show();
                                        return;
                                    }

                                    var formToValidate = dijit.byId("LPOReportBySupplierForm");

                                    if (formToValidate.validate() )
                                    {
                                        dojo.byId("SaveDialogURL").innerHTML = "purchaseOrderReportBySupplier";
                                        dijit.byId("SaveDialog").show();
                                    }
                                </script>
                            </button>
                            <button dojoType="dijit.form.Button" onclick="lpoBySupplier()">
                                <img src="static/resources/images/find.png" height="20" />
                                Search
                            </button>
                    </div>

                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>
                    <div dojoType="dojo.data.ItemFileReadStore"
                        jsId="LPOReportBySupplierSupplierStore"
                        url="servlets/supplierManager?operationType=getNames">
                    </div>
                    <label for="LPOReportBySupplierSupplier">Supplier:</label>
                    
                    &nbsp;&nbsp;&nbsp;
                </td>
                <td colspan="4">
                    <input dojoType="dijit.form.FilteringSelect" required="true"
                        store="LPOReportBySupplierSupplierStore" invalidMessage="You must enter the supplier"
                        searchAttr="name" name="LPOSupplier" style="width:460px;"
                        id="LPOReportBySupplierSupplier">
                </td>
            </tr>
            <tr>
                <td><label for="LPOReportBySupplierBeginDate">Begin Date:</label></td>
                <td>
                    
                    <input id="LPOReportBySupplierBeginDate" type="text" dojoType="dijit.form.DateTextBox"
                        constraints="{datePattern:'dd-MMM-yyyy'}" style="width:175px;" required="true" />
                </td>
                <td><label for="LPOReportBySupplierEndDate">End Date:</label></td>
                <td>
                    <input id="LPOReportBySupplierEndDate" type="text" dojoType="dijit.form.DateTextBox"
                        constraints="{datePattern:'dd-MMM-yyyy'}" style="width:175px;" required="true"/>
                </td>
            </tr>
            <tr>
                <td>
                    <div id="LPOReportBySupplier.State" style="display: none;">none</div>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <span id="LPOBySupplierSearch" style="font-weight:bold"></span>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <div dojoType="dojo.data.ItemFileReadStore"
                        jsId="LPOBySupplierStore" url="static/resources/json/lpoByStatus.json">
                    </div>

                    <table id="LPOBySupplierDetails" jsId="lpoBySupplierDetails"
                           dojoType="dojox.grid.DataGrid" store="LPOBySupplierStore" autoHeight="true"
                       style="width:100%; height:400px; border:1px solid silver; cursor: pointer;"
                       query="{ orderId: '*' }" clientSort="true">
                        <script type="dojo/method" event="onClick" args="evt">
                            var id = lpoBySupplierDetails.store.getValue(
                            lpoBySupplierDetails.getItem(evt.rowIndex), "orderId");
                            lpoPrintPreview(id);
                        </script>
                        <thead>
                           <tr>
                              <th field="counter" width="20px">#</th>
                              <th field="orderId" width="70px">LPO #</th>
                              <th field="orderdate" width="110px">Order Date</th>
                              <th field="deliverydate" width="110px">Delivery Date</th>
                              <th field="total" width="128px">Total</th>
                              <th field="status" hidden="false" width="200px">Status</th>
                           </tr>
                        </thead>
                    </table>
                </td>
            </tr>
        </table>
        </form>
    </body>
</html>
