<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
<table width="100%" cellspacing="0">
            <tr>
                <td colspan="2">
                </td>
            </tr>
            <tr>
                <td>
                    <div id="Bank.BranchDialog" dojoType="dijit.Dialog" title="Bank Branch">
                        <form id="Bank.BranchForm" dojoType="dijit.form.Form"  method="post" action="servlets/Bank.BranchManager?operationType=save">
                            <table cellspacing="5" width="600px" border="0">
                                <tr>
                                    <td><div id="Bank.BranchId" style="display: none">-1</div></td>
                                    <td><div id="Bank.BranchRowIndex" style="display: none">-1</div></td>
                                </tr>
                                <tr>
                                    <td style="width: 18%;">Branch Name:</td>
                                    <td colspan="3">
                                        <input id="Bank.BranchName" name="Bank.BranchName" dojoType="dijit.form.ValidationTextBox" required="true"
                                               invalidMessage="You must enter the branch name" style="width: 100%" />
                                    </td>

                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td colspan="3">
                                        <input id="Bank.BranchAddress" name="Bank.BranchAddress" dojoType="dijit.form.Textarea"
                                             style="width: 100%"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td colspan="3">
                                        <input id="Bank.BranchEmail" dojoType="dijit.form.TextBox"
                                          name="Bank.BranchEmail" style="width: 100%" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tel:</td>
                                    <td>
                                        <input id="Bank.BranchTel" name="Bank.BranchTel" dojoType="dijit.form.TextBox"/>
                                    </td>
                                    <td>Fax:</td>
                                    <td>
                                        <input id="Bank.BranchFax" name="Bank.BranchFax" dojoType="dijit.form.TextBox"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>City:</td>
                                    <td>
                                        <input id="Bank.BranchCity" name="Bank.BranchCity" dojoType="dijit.form.TextBox"/>
                                    </td>
                                    <td>Country:</td>
                                    <td>
                                        <input id="Bank.BranchCountry" name="Bank.BranchCountry" dojoType="dijit.form.TextBox"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" colspan="4">
                                        <br/>
                                        <button dojoType="dijit.form.Button" onclick="saveBankBranch()">
                                            <img src="/static/images/floppy.png" height="18"/>
                                            Save
                                        </button>
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/images/cancel.png" />
                                            Cancel
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dijit.byId("Bank.BranchDialog").hide();
                                            </script>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <form id="Bank.Form" dojoType="dijit.form.Form">
                        <table cellspacing="10" width="100%" border="0">
                            <tr>
                                <td>Bank Id:</td>
                                <td><input id="Bank.Id" name="bankId" dojoType="dijit.form.NumberTextBox" readonly/></td>
                            </tr>
                            <tr>
                                <td>Name:</td>
                                <td><input id="Bank.Name" name="name" dojoType="dijit.form.ValidationTextBox" required="true" style="width: 100%" /></td>
                            </tr>
                            <tr>
                                <td colspan="2">Branches:</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div dojoType="dijit.Toolbar">
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/images/newrow1.png"/>
                                            Add Branch
                                            <script type="dojo/method" event="onClick" args="evt">
                                                dojo.byId("Bank.BranchId").innerHTML = -1;
                                                var bankId = dijit.byId("Bank.Id");
                                                dojo.byId("Bank.BranchRowIndex").innerHTML = -1;
                                                dijit.byId("Bank.BranchName").setValue("");
                                                dijit.byId("Bank.BranchAddress").setValue("");
                                                dijit.byId("Bank.BranchEmail").setValue("");
                                                dijit.byId("Bank.BranchTel").setValue("");
                                                dijit.byId("Bank.BranchFax").setValue("");
                                                dijit.byId("Bank.BranchCity").setValue("");
                                                dijit.byId("Bank.BranchCountry").setValue("");

                                                var id = dijit.byId("Bank.Id").getValue();
                                                id = Math.round(id);

                                                if (id > 0 )
                                                    dijit.byId("Bank.BranchDialog").show();
                                                else
                                                {
                                                    dojo.byId("InformationMessage").innerHTML = "First navigate to an existing bank or save the current bank";
                                                    dijit.byId("InformationMessageDialog").show();
                                                }
                                            </script>
                                        </button>
                                        <button dojoType="dijit.form.Button">
                                            <img src="/static/images/deleterow.png"/>
                                            Delete Branch
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div jsId="Bank.branchesStore" dojoType="dojo.data.ItemFileWriteStore"
                                         url="/static/json/genericEmptyjson.json"></div>
                                    <table id="Bank.Branches" dojoType="dojox.grid.DataGrid" store="Bank.branchesStore" query="{branchId: '*'}"
                                         autoHeight="true" style="border:1px solid silver; height:250px; width:100%; font-size: 100%;" clientSort="true">
                                        <script type="dojo/method" event="onRowDblClick" args="evt">
                                            var grid = evt.grid;
                                            var id = grid.store.getValue(grid.getItem(evt.rowIndex), "branchId");
                                            var name = grid.store.getValue(grid.getItem(evt.rowIndex), "branchName");
                                            var address = grid.store.getValue(grid.getItem(evt.rowIndex), "branchAddress");
                                            var city = grid.store.getValue(grid.getItem(evt.rowIndex), "branchCity");

                                            var branchId = dojo.byId("Bank.BranchId");
                                            var rowIndex = dojo.byId("Bank.BranchRowIndex");
                                            var branchName = dijit.byId("Bank.BranchName");
                                            var branchAddress = dijit.byId("Bank.BranchAddress");
                                            var branchEmail = dijit.byId("Bank.BranchEmail");
                                            var branchTel = dijit.byId("Bank.BranchTel");
                                            var branchFax = dijit.byId("Bank.BranchFax");
                                            var branchCity = dijit.byId("Bank.BranchCity");
                                            var branchCountry = dijit.byId("Bank.BranchCountry");

                                            branchId.innerHTML = id;
                                            rowIndex.innerHTML = evt.rowIndex;
                                            branchName.setValue(name);
                                            branchAddress.setValue(address);
                                            branchCity.setValue(city);

                                            dijit.byId("Bank.BranchDialog").show();
                                        </script>
                                        <thead>
                                            <tr>
                                                <th field="branchId" width="0%" hidden="true">BranchId</th>
                                                <th field="branchName" width="20%">Branch Name</th>
                                                <th field="branchAddress" width="60%">Address</th>
                                                <th field="branchCity" width="20%">City/ Town</th>
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
