//supplierreport.js

/*
 * Script takes care of the suppliers report tabexport
 */

function getSupplierDetailsReport()
{
    var supplierId = dijit.byId("SupplierReport.SupplierName").getValue();
    var details = dojo.byId("SupplierReport.Details");
    var grid = dijit.byId("SupplierReport.Items");
    var contact = dijit.byId("SupplierReport.Contact");
    var address = dijit.byId("SupplierReport.Address");
    var email = dijit.byId("SupplierReport.Email");
    var tel = dijit.byId("SupplierReport.Tel");
    var fax = dijit.byId("SupplierReport.Fax");
    var city = dijit.byId("SupplierReport.City");
    var country = dijit.byId("SupplierReport.Country");
    var bank = dijit.byId("SupplierReport.Bank");
    var branch = dijit.byId("SupplierReport.Branch");
    var accountName = dijit.byId("SupplierReport.AccountName");
    var accountNumber = dijit.byId("SupplierReport.AccountNumber");

    var formToValidate = dijit.byId("SupplierReport.Form");

    if (formToValidate.validate())
    {
        statusMessage("resources/images/loading.gif", "Retrieving Details ...");

        dojo.xhrGet(
        {
            url: "servlets/supplierManager?operationType=details&supplierId="+supplierId,
            handleAs: "text",
            load: function (response)
            {
                var supplier = dojo.fromJson(response);

                contact.setValue(supplier.contact);
                address.setValue(supplier.address);
                email.setValue(supplier.email);
                tel.setValue(supplier.tel);
                fax.setValue(supplier.fax);
                city.setValue(supplier.city);
                country.setValue(supplier.country);
                    
                 if ((supplier.bank).toString() == "NaN")
                 {
                     bank.setValue("N/a");
                     branch.setValue("N/a");
                     accountName.setValue("N/a");
                     accountNumber.setValue("N/a");
                 }
                 else
                 {
                     bank.setValue(supplier.bank);
                     branch.setValue(supplier.branch);
                     accountName.setValue(supplier.accountName);
                     accountNumber.setValue(supplier.accountId);
                 }

                var detailsStore = new dojo.data.ItemFileWriteStore({data: supplier});
                grid.setStore(detailsStore);

                statusMessageDisplays(null, "... Found supplier Details");
            },
            error: function(response)
            {
                statusMessageDisplays("error-large.gif", "... Experienced " +
                    " problem while retrieving details!");
            }
        });
    } //End of if statement block
}//End of function getSupplierDetailsReport