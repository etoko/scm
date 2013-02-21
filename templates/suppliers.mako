<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
  <table width="100%" cellspacing="0">
    <tr>
      <td>
        <div id="supplier_branch_dialog" dojoType="dijit.Dialog" title="Supplier Branch">
          <form id="supplier_branch_form" dojoType="dijit.form.Form" method="post">
            <table cellspacing="5" width="100%" border="3">
              <tr>
                <td><div id="supplier_branch_id" style="display: none">-1</div></td>
                <td><div id="supplier_branch_row_index" style="display: none">-1</div></td>
              </tr/>
              <tr>
                <td style="width: 18%;">Branch Name:</td>
                <td colspan="3">
                    <input id="supplier_branch_name" name="supplier_branch_name" dojoType="dijit.form.ValidationTextBox" required="true"
                     invalidMessage="You must enter the branch name" style="width: 100%" />
                </td>
              </tr>
              <tr>
            <td>Address:</td>
            <td colspan="3">
                <input id="supplier_branch_address" name="supplier_branch_address" dojoType="dijit.form.Textarea"
               style="width: 100%"/>
            </td>
              </tr>
              <tr>
            <td>Email:</td>
            <td colspan="3">
                <input id="supplier_branch_email" dojoType="dijit.form.TextBox"
                  name="supplier_branch_email" style="width: 100%" />
            </td>
              </tr>
              <tr>
            <td>Tel:</td>
            <td>
                <input id="supplier_branch_tel" name="supplier_branch_tel" dojoType="dijit.form.TextBox"/>
            </td>
            <td>Fax:</td>
            <td>
                <input id="supplier_branch_fax" name="supplier_branch_fax" dojoType="dijit.form.TextBox"/>
            </td>
              </tr>
              <tr>
            <td>City:</td>
            <td>:w

                <input id="supplier_branch_city" name="supplier_branch_city" dojoType="dijit.form.TextBox"/>
            </td>
            <td>Country:</td>
            <td>
                <input id="supplier_branch_country" name="supplier_branch_country" dojoType="dijit.form.TextBox"/>
            </td>
              </tr>
              <tr>
            <td align="center" colspan="4">
                <br/>
                <button dojoType="dijit.form.Button" onclick="savesupplier_Branch()">
              <img src="/static/images/floppy.png" height="18"/>
              Save
                </button>
                <button dojoType="dijit.form.Button">
              <img src="/static/images/cancel.png" />
              Cancel
              <script type="dojo/method" event="onClick" args="evt">
                dijit.byId("supplier_branch_dialog").hide();
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
      <form id="supplier_form" dojoType="dijit.form.Form">
    <table cellspacing="10" width="100%" border="0">
        <tr>
      <td></td>
      <td><input type="hidden" id="supplier_id" name="supplier_id" />-1</td>
            <input type="hidden" id="supplier_operation" name="supplier_operation" value="CREATE" /></td>
        </tr>
        <tr>
      <td width="10%">Name:</td>
      <td><input id="supplier_name" name="supplier_name" dojoType="dijit.form.ValidationTextBox" required="true" style="width: 60%" /></td>
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
                dojo.byId("supplier_branch_id").innerHTML = -1;
                var supplier_Id = dojo.byId("supplier_id");
                dojo.byId("supplier_branch_row_index").innerHTML = -1;
                dijit.byId("supplier_branch_name").setValue("");
                dijit.byId("supplier_branch_address").setValue("");
                dijit.byId("supplier_branch_email").setValue("");
                dijit.byId("supplier_branch_tel").setValue("");
                dijit.byId("supplier_branch_fax").setValue("");
                dijit.byId("supplier_branch_city").setValue("");
                dijit.byId("supplier_branch_country").setValue("");
                
                var id = dojo.byId("supplier_id").value;
                id = Math.round(id);
                
                if (id > 0 )
                    dijit.byId("supplier_branch_dialog").show();
                else
                {
                    dojo.byId("InformationMessage").innerHTML = "First navigate to an existing supplier_ or save the current supplier_";
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
    <div jsId="supplier_branches_store" dojoType="dojo.data.ItemFileWriteStore"
         url="/static/json/genericEmptyjson.json"></div>
    <table id="supplier_branches" dojoType="dojox.grid.DataGrid" store="supplier_.branches_store" query="{branchId: '*'}"
       autoHeight="true" style="border:1px solid silver; height:250px; width:100%; font-size: 100%;" clientSort="true">
        <script type="dojo/method" event="onRowDblClick" args="evt">
      var grid = evt.grid;
      var id = grid.store.getValue(grid.getItem(evt.rowIndex), "branch_id");
      var name = grid.store.getValue(grid.getItem(evt.rowIndex), "branch_name");
      var address = grid.store.getValue(grid.getItem(evt.rowIndex), "branch_address");
      var city = grid.store.getValue(grid.getItem(evt.rowIndex), "branch_city");
    
      var branchId = dojo.byId("supplier_branch_id");
      var rowIndex = dojo.byId("supplier_Branch_row_index");
      var branchName = dijit.byId("supplier_branch_name");
      var branchAddress = dijit.byId("supplier_branch_address");
      var branchEmail = dijit.byId("supplier_branch_email");
      var branchTel = dijit.byId("supplier_branch_tel");
      var branchFax = dijit.byId("supplier_branch_fax");
      var branchCity = dijit.byId("supplier_branch_city");
      var branchCountry = dijit.byId("supplier_branch_country");
    
      branchId.innerHTML = id;
      rowIndex.innerHTML = evt.rowIndex;
      branchName.setValue(name);
      branchAddress.setValue(address);
      branchCity.setValue(city);
    
      dijit.byId("supplier_branch_dialog").show();
        </script>
        <thead>
      <tr>
    <th field="branch_id" width="0%" hidden="true">BranchId</th>
    <th field="branch_name" width="20%">Branch Name</th>
    <th field="branch_address" width="60%">Address</th>
    <th field="branch_city" width="20%">City/ Town</th>
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
</html>
