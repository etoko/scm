/* 
 * Script handles all bank operations
 */

/**
 * Function sets the bank Id value convinient for addition of a new Bank
 */
function newBank()
{
    var name = dijit.byId("Bank.Name");
    var bankId = dijit.byId("Bank.Id");
    var grid = dijit.byId("Bank.Branches");

    bankId.setValue("0");
    name.setValue("");
    var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
    grid.setStore(store);

    dojo.publish("/saved", {message: "<font size='2'><b>Enter new Bank",
            type: 'info;', duration: 15000});
} //End of function newBank

/**
 * Function saves/ updates Bank details
 */
function saveBank()
{
    var formToValidate = dijit.byId("Bank.Form");
    var position = 0;
    var message = "Saving...";
    var icon = "resources/images/busy.gif";

    if (formToValidate.validate())
    {
        statusMessageDisplays(icon, message);
        
        dojo.publish("/saving", [{message: "<font size='2'><b>Saving...",
            type: 'info', duration: 5000}]);

        dojo.xhrPost(
        {
            form: "Bank.Form",
            url: "servlets/bankManager?operationType=save",
            load: function(response)
            {
                var bank = dojo.fromJson(response);
                populateBankControls(bank, position);

                dojo.publish("/saved", [{message: "<font size='2'><b>...Saved",
                    type: 'info', duration: 10000}]);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                    type: 'error', duration: 5000}]);
            }
        });
    } //End of if statement block
} //End of method save

/**
 * Function navigates to the first bank
 */
function firstBank()
{
    var position = 0;
    
    dojo.xhrGet(
    {
        url: "servlets/bankManager?operationType=first",
        load: function(response)
        {
            var bank = dojo.fromJson(response);
            populateBankControls(bank, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                type: 'error', duration: 5000}]);
        }
    });
} //End of function firstBank

/**
 * Function navigates to the previous bank
 */
function previousBank()
{
    var position = dojo.cookie("CurrentBank");

    if ((position == undefined) || (position == null))
        position = 0;

    position = Math.abs(position);
    --position;

    if (position < 0)
        position = 0;
    
    dojo.xhrGet(
    {
        url: "servlets/bankManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var bank = dojo.fromJson(response);
            populateBankControls(bank, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error: " + response,
                type: 'error', duration: 5000}]);
        }
    });
} //End of function firstBank

/**
 * Function navigates to the next bank
 */
function nextBank()
{
    var position = dojo.cookie("CurrentBank");
    var number = dojo.cookie("BankNumber");

    if ((position == undefined) || (position == null))
        position = 0;

    position = Math.abs(position);
    ++position;

    if ((number == undefined) || (number == null))
        number = 0;

    number = Math.abs(number);

    if (position >= number)
        position = number - 1;
    
    dojo.xhrGet(
    {
        url: "servlets/bankManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var bank = dojo.fromJson(response);
            populateBankControls(bank, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error: " + response,
                type: 'error', duration: 5000}]);
        }
    });
} //End of function nextBank


/**
 * Function navigates to the last bank
 */
function lastBank()
{
    var position = dojo.cookie("BankNumber");

    if ((position == undefined) || (position == null))
        position = 0;

    position = Math.abs(position);
    --position;

    dojo.xhrGet(
    {
        url: "servlets/bankManager?operationType=last",
        load: function(response)
        {
            var bank = dojo.fromJson(response);
            populateBankControls(bank, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                type: 'error', duration: 5000}]);
        }
    });
} //End of function firstBank

/**
 * Function saves/ updates Bank Branch entities.
 */
function saveBankBranch()
{
    var formToValidate = dijit.byId("Bank.BranchForm");
    var branchId = dojo.byId("Bank.BranchId").innerHTML;
    var bankId = dijit.byId("Bank.Id");
    var grid = dijit.byId("Bank.Branches");
    var rowIndex = dojo.byId("Bank.BranchRowIndex").innerHTML;
    
    if (formToValidate.validate())
    {
        dojo.xhrPost(
        {
            form: "Bank.BranchForm",
            url: "servlets/bankBranchManager?operationType=save&bankId=" + bankId + "&branchId=" + branchId,
            load: function(response)
            {
                var bank = dojo.fromJson(response);
                var store = grid.store;

                if (branchId == -1)
                {
                    var newBranch = {branchId: bank.branchId, branchName: bank.branchName, branchAddress: bank.branchAddress, branchCity: bank.branchCity};
                    grid.store.newItem(newBranch);
                }
                else
                {
                    var item = grid.getItem(rowIndex);
                    
                    grid.store.setValue(item, "branchName", bank.branchName);
                    grid.store.setValue(item, "branchAddress", bank.branchAddress);
                    grid.store.setValue(item, "branchCity", bank.branchCity);
                }

                dojo.byId("Bank.BranchRowIndex").innerHTML = -1;
                dijit.byId("Bank.BranchDialog").hide();
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                    type: 'error', duration: 5000}]);
            }
        });
    } //End of if statement block

} //End of function saveBankBranch

/**
 * Function populates the bank controls with bank particulars
 */
function populateBankControls(bank, position)
{
    var id = dijit.byId("Bank.Id");
    var name = dijit.byId("Bank.Name");
    var grid = dijit.byId("Bank.Branches");
    var navigator = dojo.byId("Bank.Navigator");

    id.setValue(bank.id);
    name.setValue(bank.name);

    var store = new dojo.data.ItemFileWriteStore({data: bank});
    grid.setStore(store);
    
    var size = bank.size;
    dojo.cookie("BankNumber", size, {expires: 5});
    dojo.cookie("CurrentBank", position, {expires: 5});

    navigator.innerHTML = (position + 1) + " of " + size;
    
} //End of function populateBankControls

function getBranches()
{
    var bankId = dijit.byId("Suppliers.Bank").getValue();
    var branchControl = dijit.byId("Suppliers.BankBranch");
    
    if (bankId.toString() == "")
        return;
    
    dojo.xhrGet(
    {
        url: "servlets/bankBranchManager?operationType=getNames&bankId=" + bankId,
        load: function(response)
        {
            var branches = dojo.fromJson(response);
            
            var store = new dojo.data.ItemFileReadStore({data: branches});
            branchControl.searchAttr = "name";
            branchControl.store = (store);
            branchControl.setValue("");
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                type: 'error', duration: 5000}]);
        }
    });
} //End of method getBranches

function saveAccount()
{
    var formToValidate = dijit.byId("Suppliers.BankingInfoForm");
    var bankingInfoId = dojo.byId("Suppliers.BankingInfoId").innerHTML;
    var supplierId = dijit.byId("Supplier.Id").getValue();
    var branchId = dijit.byId("Suppliers.BankBranch").getValue();
    var accountName = dijit.byId("Suppliers.AccountName").getValue();
    var accountNumber = dijit.byId("Suppliers.AccountNumber").getValue();

    if (formToValidate.validate())
    {
        dojo.xhrGet(
        {
            url: "servlets/bankInfoManager?operationType=save&bankingInfoId=" + bankingInfoId
                + "&Supplier.Id=" + supplierId + "&Suppliers.BankBranch=" +
                branchId + "&Suppliers.AccountName=" + accountName +
                "&Suppliers.AccountNumber=" + accountNumber,
            load: function(response)
            {
                refreshSupplier();
                dijit.byId("Suppliers.BankingInfoDialog").hide();
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                    type: 'error', duration: 5000}]);
            }
        });
    } //End of if statement block
}

function showAccountDialog(update)
{
    if (update)
    {
        var bankValue = dojo.byId("Supplier.BankValue").innerHTML;
        var bankInfoId = dojo.byId("Suppliers.BankingInfoId").innerHTML;
        var branchValue = dojo.byId("Supplier.BranchValue").innerHTML;
        var accountIdValue = dojo.byId("Supplier.AccountIdValue").innerHTML;
        var accountNameValue = dojo.byId("Supplier.AccountNameValue").innerHTML;

        dojo.byId("Suppliers.BankingInfoId").innerHTML = bankInfoId;
        dojo.byId("Suppliers.Bank").value = (bankValue);
        dojo.byId("Suppliers.BankBranch").value = (branchValue);
        dijit.byId("Suppliers.AccountName").setValue(accountNameValue);
        dijit.byId("Suppliers.AccountNumber").setValue(accountIdValue);
    }
    else
    {
        dojo.byId("Suppliers.BankingInfoId").innerHTML = 0;
        dojo.byId("Suppliers.Bank").value = ("");
        dojo.byId("Suppliers.BankBranch").value = ("");
        dijit.byId("Suppliers.AccountName").setValue("");
        dijit.byId("Suppliers.AccountNumber").setValue("");
    }

    dijit.byId("Suppliers.BankingInfoDialog").show();
} //End of function showAccountDialog

function deleteSupplierBankInfo(show)
{
    if (show)
        dijit.byId("Supplier.BankDeleteDialog").show();
    else
    {
        var bankInfoId = dojo.byId("Suppliers.BankingInfoId").innerHTML;

        dojo.xhrGet(
        {
            url: "servlets/bankInfoManager?operationType=delete&bankInfoId=" + bankInfoId,
            load: function(response)
            {
                refreshSupplier();
                dijit.byId("Supplier.BankDeleteDialog").hide();
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Experienced an error",
                    type: 'error', duration: 5000}]);
            }
        });
    }
}