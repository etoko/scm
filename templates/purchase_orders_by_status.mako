<form id="LPOReportByStatusForm" dojoType="dijit.form.Form">
  <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
    <tr>
      <td colspan="5">
      </td>
  </tr>
  <tr>
      <td><div id="LPOByStatus.State" style="display: none;">none</div> &nbsp;</td>
  </tr>
  <tr>
      <td>
   <table cellspacing="5" cellpadding="0" width="100%">
<tr>
    <td style="width: 13%;"><label for="LPOReportByStatusStatus">Status:</label></td>
    <td colspan="3">
 <select id="LPOReportByStatusStatus" dojoType="dijit.form.FilteringSelect" required="true" onchange="lpoByStaffChange()"
  style="width:97%;">
     <option value="ALL">ALL</option>
     <option value="COMPLETE">COMPLETE</option>
     <option value="PENDING">PENDING</option>
     <option value="PARTIALLY COMPLETE">PARTIALLY COMPLETE</option>
 </select>
    </td>
</tr>
<tr>
    <td><label for="LPOReportByStatusBeginDate">Begin Date:</label></td>
    <td>
 <input id="LPOReportByStatusBeginDate" type="text" dojoType="dijit.form.DateTextBox" onchange="lpoByStaffChange()"
     constraints="{datePattern:'dd-MMM-yyyy'}" style="width:95%;" required="true" />
    </td>
    <td><label for="LPOReportByStatusEndDate">End Date:</label></td>
    <td>
 <input id="LPOReportByStatusEndDate" type="text" dojoType="dijit.form.DateTextBox" onchange="lpoByStaffChange()"
     constraints="{datePattern:'dd-MMM-yyyy'}" style="width:95%;" required="true"/>
    </td>
</tr>
<tr>
    <td>
 &nbsp;
    </td>
</tr>
<tr>
    <td colspan="5">
 <span id="LPOByStatusSearch" style="font-weight:bold"></span>
    </td>
</tr>
<tr>
    <td colspan="5">
 <div dojoType="dojo.data.ItemFileReadStore"
     jsId="LPOByStatusStore" url="static/resources/json/lpoByStatus.json">
 </div>

 <table id="LPOByStatusDetails" jsId="lpoByStatusDetails" dojoType="dojox.grid.DataGrid" store="LPOByStatusStore" autoHeight="true"
    style="width:100%; height:700px; border:1px solid silver; font-size: 100%; cursor: pointer;"
    query="{ orderId: '*' }" clientSort="true">
     <script type="dojo/method" event="onClick" args="evt">
  var id = lpoByStatusDetails.store.getValue(lpoByStatusDetails.getItem(evt.rowIndex), "orderId");
  lpoPrintPreview(id);
     </script>
     <thead>
 <tr>
    <th field="counter" width="3%">#</th>
    <th field="orderId" width="7%">LPO #</th>
    <th field="orderdate" width="15%">Order Date</th>
    <th field="supplier" width="47%">Supplier</th>
    <th field="total" width="10%">Total</th>
    <th field="status" hidden="false" width="17%">Status</th>
 </tr>
     </thead>
 </table>
    </td>
</tr>
<tr>
    <td><div id="LPO.DetailNavigator"></div></td>
</tr>
   </table>
      </td>
  </tr>
     </table>
 </form>
