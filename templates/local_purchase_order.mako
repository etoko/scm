<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
<table border="0" cellspacing="5" style="width:100%">
  <tr>
    <td style="width:125px;"></td>
    <td><!--<div id="LPONavigator">0</div>--></td>
  </tr>
             
  <tr>
    <td colspan="4">
      <table border="0" width="100%">
        <tr>
          <td style="width:125px;"><label for="LPO.Id">LPO #:</label></td>
          <td style="width: 210px;">
            <input name="LPO.Id" id="LPO.Id" dojoType="dijit.form.NumberTextBox" constraints="{pattern: '##0'}" disabled style="color:black;"/>
          </td>
          <td style="width:110px;" align="right">Status: &nbsp;</td>
            <div dojoType="dijit.Tooltip" connectId="LPOStatus">
              Click to view the list of <b>GRNs</b> created<br>for this <b>Purchase Order</b>
            </div>
          <td><span id="LPOStatus">PENDING ${logged_in} </span></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td><label for="LPOSupplier" accesskey="S">Supplier:</label></td>
    <td>
      <div dojoType="dojo.data.ItemFileReadStore" jsId="supplierStore" url=""></div>
        <input dojoType="dijit.form.FilteringSelect" required="true" store="supplierStore" invalidMessage="You must enter the supplier" searchAttr="name" name="LPOSupplier" style="width:100%;" id="LPOSupplier" onchange="getSupplierAddress()">
    </td>
  </tr>
  <tr>
    <td><label for="LPOSupplierAddress" accesskey="A">Address</label></td>
    <td>
      <input id="LPOSupplierAddress" dojoType="dijit.form.Textarea" disabled id="LPOSupplierAddress" style="width:100%; color:black;"/>
    </td>
  </tr>
  <tr>
    <td colspan="4">
      <table>
        <tr>
          <td style="width:125px;"><label for="LPOSupplierTelNo">Tel:</label></td>
          <td>
            <input dojoType="dijit.form.TextBox" id="LPOSupplierTelNo" style="color:black;" disabled/>
          </td>
          <td align="right" style="width:110px;"><label for="LPOSupplierFaxNo">Fax:</label></td>
          <td><input dojoType="dijit.form.TextBox" id="LPOSupplierFaxNo" style="color:black;" disabled/></td>
       </tr>
     </table>
   </td>
 </tr>
 <tr>
   <td colspan="2">
     <table>
       <tr>
         <td style="width:125px;"><label for="LPOOrderDate">Order Date:</label></td>
         <td>
           <input dojoType="dijit.form.DateTextBox" type="text" required="true" constraints="{datePattern:'dd-MMM-yyyy'}" id="LPOOrderDate" name="LPOOrderDate">
         </td>
         <td align="right" style="width:110px;">
           <label for="LPODeliveryDate">Delivery Date:</label>
         </td>
         <td>
           <input dojoType="dijit.form.DateTextBox" type="text" constraints="{datePattern:'dd-MMM-yyyy'}" required="true" id="LPODeliveryDate" name="LPODeliveryDate">
         </td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td><label for="LPOPaymentTerms">Payment Terms:</label></td>
  <td>
    <select dojoType="dijit.form.ComboBox" required="true" name="LPOPaymentTerms" id="LPOPaymentTerms">
      <option>Cash</option>
      <option>Cheque</option>
      <option>Electronic Funds Transfer</option>
    </select>
  </td>
</tr>
<tr>
  <td><label for="LPO.DeliveryLocation">Delivery Location:</label></td>
  <td>
    <input type="text" dojoType="dijit.form.TextBox" style="width:100%;" name="LPO.DeliveryLocation" id="LPO.DeliveryLocation"/>
  </td>
</tr>
<tr>
  <td valign="top"><label for="LPOWarranty">Warranty:</label></td>
  <td>
    <input type="text" dojoType="dijit.form.Textarea" style="width:100%;" name="LPOWarranty" id="LPOWarranty"/>
  </td>
</tr>

<td>&nbsp;</td>
</tr>
<tr valign="bottom">
  <td colspan="2">
    <!--
    <div dojoType="dijit.Toolbar">
      <button dojoType="dijit.form.Button">
        <img src="/static/images/newrow1.png">
        &nbsp; Add Item
        <script type="dojo/method" event="onClick" args="evt">
          var lpoStatus = dojo.byId("LPOStatus").innerHTML;

          if (lpoStatus.toString() !== "PENDING")
          {
            var message = dojo.byId("InformationMessage");
            message.innerHTML = "You cannot edit a purchase order for which at least one Goods Received Note has already been received";
            dijit.byId("InformationMessageDialog").show();
            return;
           //ENd of if statement block

           dijit.byId("LPOSupplier").focus();
           var lPONo = dijit.byId("LPO.Id").getValue();
           lPONo = lPONo.toString();
                                                        
           if ((lPONo.length < 1) || (lPONo == "NaN") || (lPONo == "0"))
           {
             var message = dojo.byId("WarningMessage");
             message.innerHTML = "First Save this LPO before appending details";
             dijit.byId("WarningMessageDialog").show();

             return;
           }

           var supplierId = dijit.byId("LPOSupplier").getValue();
                                                        
           dojo.xhrGet(
           {
             url: "servlets/supplierManager?operationType=details&supplierId=" + supplierId,
             load: function(response)
             {
               var results = dojo.fromJson(response);
               var store = new dojo.data.ItemFileReadStore({data: results});
               var items = dijit.byId("LPOSupplierItems");
               items.store = (store);
             },
             error: function(response)
             {
               dojo.publish("/saving", [{message:"<font size='2'>Failed to retrieve items. Try closing this dialog box and re-open it", type: "error", duration: 5000}])
             }

          });

          dojo.byId("LPODetailId").innerHTML = -1;
          dijit.byId("LPODetailDialog").show();
        </script>
      </button>
      <button dojoType="dijit.form.Button">
        <img src="/static/images/deleterow.png">
        &nbsp; Delete Item
        <script type="dojo/method" event="onClick" args="evt">
          var lpoStatus = dojo.byId("LPOStatus").innerHTML;

          if (lpoStatus.toString() !== "PENDING")
          {
            var message = dojo.byId("InformationMessage");
            message.innerHTML = "You cannot edit a purchase order for which at least one Goods Received Note has already been received";
            dijit.byId("InformationMessageDialog").show();
            return;
          }//ENd of if statement block

          var grid = dijit.byId("lpoDetailsTable");
          var items = grid.selection.getSelected();
          var message = dojo.byId("InformationMessage");
                                                    
          if ((items == null) || (items == ""))
          {
            message.innerHTML = "First select a row in the table";
            dijit.byId("InformationMessageDialog").show();
            return;
          }
                                                    
          dijit.byId("LPODeleteItem").show();
        </script>
      </button>
    </div>
    -->
  </td>
</tr>
<tr>
  <td colspan="2">
    <div dojoType="dojo.data.ItemFileWriteStore" jsId="lpoDetailsStore" url="/static/json/genericEmptyjson.json"></div>
    <table id="lpoDetailsTable" dojoType="dojox.grid.DataGrid" store="lpoDetailsStore" selectionMode="single" style="border:1px solid silver; height:250px; width:95%; cursor: pointer; font-size: 100%;" 
      query="{ lpoDetailId: '*' }" clientSort="true" autoHeight="true">
      <script type="dojo/connect" event="onRowDblClick" args="evt" >
        var lpoStatus = dojo.byId("LPOStatus").innerHTML;
                                                   
        if (lpoStatus.toString() !== "PENDING")
        {
          var message = dojo.byId("InformationMessage");
          message.innerHTML = "You cannot edit a purchase order for which at least one Goods Received Note has already been received";
          dijit.byId("InformationMessageDialog").show();
          return;
        }//ENd of if statement block

        dijit.byId("LPOSupplier").focus();

        var grid = evt.grid;
        var detailId = grid.store.getValue(grid.getItem(evt.rowIndex), "lpoDetailId");
        var item = grid.store.getValue(grid.getItem(evt.rowIndex), "Item");
        var unitPrice = grid.store.getValue(grid.getItem(evt.rowIndex), "unitPrice");
        var quantity = grid.store.getValue(grid.getItem(evt.rowIndex), "quantity");
        var total = grid.store.getValue(grid.getItem(evt.rowIndex), "Total");
        var supplierId = dijit.byId("LPOSupplier").getValue();

        dojo.xhrGet(
        {
          url: "servlets/supplierManager?operationType=details&supplierId=" + supplierId,
          load: function(response)
          {
            var results = dojo.fromJson(response);
            var store = new dojo.data.ItemFileReadStore({data: results});
            var items = dijit.byId("LPOSupplierItems");
            items.store = (store);
          },
          error: function(response)
          {
            dojo.publish("/saving", [{message: "<font size='2'>Experienced an unexpected problem", type: "info", duration: 5000}]);
          }
        });

        dojo.byId("LPODetailId").innerHTML = detailId;
        dojo.byId("LPOSupplierItems").value = (item);
        dijit.byId("LPODetailsUnitPrice").setValue(unitPrice);
        dijit.byId("LPODetailsQuantity").setValue(quantity);
        dijit.byId("LPODetailsTotal").setValue(total);
        dojo.byId("LPODetailRowIndex").innerHTML = evt.rowIndex;
        dojo.byId("LPODetailSaveStatus").innerHTML = "update";
        dijit.byId("LPODetailDialog").show();
      </script>

      <thead>
        <tr>
          <th field="lpoDetailId" width="0%" hidden="true" editable="false">DetailId</th>
          <th field="itemId" width="0%" hidden="true" editable="false">ItemId</th>
          <th field="Item" width="40%" editable="false">Item</th>
          <th field="unitPrice" editable="false" width="20%">Unit Price</th>
          <th field="quantity" editable="false"  width="15%">Quantity</th>
          <th field="Total" editable="false" width="25%">Total</th>
        </tr>
      </thead>
    </table>
  </td>
</tr>
<tr>
  <td colspan="2" align="right">
    <label for="LPOGrandTotal">Grand Total</label>
    <input id="LPOGrandTotal" dojoType="dijit.form.CurrencyTextBox" style="color: black;" constraints="{fractional:false}" currency="UGX " readonly>
  </td>
</tr>
</table>
