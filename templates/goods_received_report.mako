<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <form id="GoodsReceivedNoteReport.Form" dojoType="dijit.form.Form">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                    <td colspan="5">
                        <div id="GoodsReceivedNoteReport.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="GoodsReceivedNoteReport.print">
                                <img src="resources/images/print.png" height="16px" width="16px"/>
                                Print Preview
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("GoodsReceivedNoteReport.State").innerHTML;

                                    if (display.toString() == "none")
                                    {
                                        changeOfParameters("print")
                                        return;
                                    }
                                    else if (display.toString() == "noResults")
                                    {
                                        noResultsToDisplay("GRNs", "print")
                                        return;
                                    }

                                    var supplier = dijit.byId("GoodsReceivedNoteReport.Supplier");
                                    var SupplierId = dijit.byId("GoodsReceivedNoteReport.Supplier").getValue();
                                    var SupplierName = dojo.byId("GoodsReceivedNoteReport.Supplier").value;
                                    var beginDate = dojo.byId("GoodsReceivedNoteReport.BeginDate").value;
                                    var endDate = dojo.byId("GoodsReceivedNoteReport.EndDate").value;
                                    var formToValidate = dijit.byId("GoodsReceivedNoteReport.Form");
                                    
                                    if (formToValidate.validate())
                                    {
                                        if (supplier.disabled == true)
                                        {
                                            window.open("procurement/print/grnReportDialog.jsp?operationType=get&output=HTML" +
                                                "&beginDate=" + beginDate + "&endDate=" + endDate,
                                                "Goods Received Note Report - Print Preview",
                                                "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes");
                                        }
                                        else
                                        {
                                            window.open("procurement/print/grnReportDialog.jsp?operationType=get&output=HTML&supplierName=" +
                                                SupplierName + "&supplierId=" + SupplierId + "&beginDate=" + beginDate + "&endDate=" + endDate,
                                                "Goods Received Note Report - Print Preview",
                                                "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes");
                                        }
                                    }
                                </script>
                           </button>
                           <button dojoType="dijit.form.Button" id="GoodsReceivedNoteReport.update">
                                <img src="resources/images/drive-harddisk.png" height="20px"/>
                                Save To File
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("GoodsReceivedNoteReport.State").innerHTML;

                                    if (display.toString() == "none")
                                    {
                                        changeOfParameters("save");
                                        return;
                                    }
                                    else if (display.toString() == "noResults")
                                    {
                                        noResultsToDisplay("GRNs", "Save To File")
                                        return;
                                    }

                                    var formToValidate = dijit.byId("GoodsReceivedNoteReport.Form");

                                    if (formToValidate.validate() )
                                    {
                                        dojo.byId("SaveDialogURL").innerHTML = "GoodsReceivedNoteReport";
                                        dijit.byId("SaveDialog").show();
                                    }
                                </script>
                            </button>
                            <button dojoType="dijit.form.Button" onclick="getGoodsReceivedNote()">
                                <img src="resources/images/find.png" height="20" />
                                Search
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" cellspacing="5" cellpadding="0" border="0">
                            <tr>
                                <td>
                                    <div dojoType="dojo.data.ItemFileReadStore"
                                        jsId="GoodsReceivedNoteReportSupplierStore"
                                        url="servlets/supplierManager?operationType=getNames">
                                    </div>
                                    <label for="GoodsReceivedNoteReport.Supplier">Supplier:</label>
                                </td>
                                <td colspan="3">
                                    <input dojoType="dijit.form.FilteringSelect" required="true"
                                        store="GoodsReceivedNoteReportSupplierStore" invalidMessage="You must enter the Supplier"
                                        searchAttr="name" name="GoodsReceivedNoteReport.Supplier" style="width:95%;"
                                        onchange="javascript:dojo.byId('GoodsReceivedNoteReport.State').innerHTML='none';"
                                        id="GoodsReceivedNoteReport.Supplier" />
                                </td>
                                <td>
                                    <input id="GoodsReceivedNoteReport.IncludeDept" dojoType="dijit.form.CheckBox" type="checkbox"
                                       onchange="javascript:dojo.byId('GoodsReceivedNoteReport.State').innerHTML='none';"
                                       onclick="enableSupplier()" checked/>
                                    <label for="GoodsReceivedNoteReport.IncludeDept">Include in Search</label>
                                </td>
                            </tr>

                            <tr>
                                <td><label for="GoodsReceivedNoteReport.BeginDate">Begin Date:</label></td>
                                <td>
                                    <input id="GoodsReceivedNoteReport.BeginDate" type="text" dojoType="dijit.form.DateTextBox"
                                       onchange="javascript:dojo.byId('GoodsReceivedNoteReport.State').innerHTML='none';"
                                        constraints="{datePattern:'dd-MMM-yyyy'}" style="width:90%;" required="true" />
                                </td>
                                <td><label for="GoodsReceivedNoteReport.EndDate">End Date:</label></td>
                                <td>
                                    <input id="GoodsReceivedNoteReport.EndDate" type="text" dojoType="dijit.form.DateTextBox"
                                           onchange="javascript:dojo.byId('GoodsReceivedNoteReport.State').innerHTML='none';"
                                        constraints="{datePattern:'dd-MMM-yyyy'}" style="width:90%;" required="true"/>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5">
                                    <div id="GoodsReceivedNoteReport.State" style="display: none;">noResults</div>
                                    &nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="height: 20px;">
                                    <span id="GoodsReceivedNoteReportSearch" style="font-weight:bold"></span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5">
                                    <div dojoType="dojo.data.ItemFileReadStore"
                                        jsId="GoodsReceivedNoteReport.Store" url="resources/json/genericEmptyjson.json">
                                    </div>

                                    <table id="GoodsReceivedNoteReport.Details" dojoType="dojox.grid.DataGrid" store="GoodsReceivedNoteReport.Store"
                                       style="width:97%; height:400px; border:1px solid silver; font-size: 100%; cursor: pointer;" query="{ orderId: '*' }" clientSort="true"
                                       autoHeight="true" jsId="grnReportDetails">
                                        <script type="dojo/method" event="onRowDblClick" args="evt">
                                            var id = grnReportDetails.store.getValue(grnReportDetails.getItem(evt.rowIndex), "id");
                                            grnPrintPreview(id);
                                        </script>
                                        <thead>
                                           <tr>
                                              <th field="counter" width="3%">#</th>
                                              <th field="id" width="10%">GRN #</th>
                                              <th field="date" width="18%">Date</th>
                                              <th field="deliveryNote" width="15%">Delivery #</th>
                                              <th field="invoiceId" width="15%">Invoice #</th>
                                              <th field="lpoId" width="10%">LPO #</th>
                                              <th field="supplier" width="50%">Supplier</th>
                                           </tr>
                                        </thead>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td><div id="GoodsReceivedReport.DetailNavigator"></div></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
            </table>
        </form>
    </body>
</html>
