
//alert("Fread added" );

//dojo.declare("TabContainer", dijit.layout.TabContainer, {
//    _setupChild: function(child){
//         this.inherited(arguments);
//         console.log("I've seen: ", child);
//    }
//});

function which_tab()
{
    tab_container = dijit.byId("TabContainer");
    tab = tab_container.selectedChildWidget;
    title = tab.title.toString();
    return title;
}

function first()
{
    selected_tab = which_tab();
    if (selected_tab == "Users")
        user_first();
}

function previous()
{
    selected_tab = which_tab();
    if (selected_tab == "Users")
        user_previous();
}

function next()
{
    selected_tab = which_tab();
    if (selected_tab == "Users")
        user_next();
}

function last()
{
    selected_tab = which_tab();
    if (selected_tab == "Users")
        user_last();
}

function save()
{
    selected_tab = which_tab();
    if (selected_tab == "Users")
        user_save(); 
    else if (selected_tab == "Suppliers")
        supplier_save();
}//End save function

/**
 * Function imports the required classes.
 */
function importClasses()
{
    dojo.require("dojo.cookie");
    dojo.require("dojo.parser" );
    dojo.require("dojo.fx.easing");

    dojo.require("dijit.Dialog");
    dojo.require("dijit.Menu");
    dojo.require("dijit.MenuItem");
    dojo.require("dijit.ProgressBar");
    dojo.require("dijit.TitlePane");
    dojo.require("dijit.Toolbar");
    dojo.require("dijit.ToolbarSeparator");
    dojo.require("dijit.ColorPalette");
    dojo.require("dijit.Tooltip");
    
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.layout.BorderContainer");
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dijit.layout.AccordionContainer");
    
    dojo.require("dijit.form.ValidationTextBox");
    dojo.require("dijit.form.DateTextBox");
    dojo.require("dijit.form.NumberTextBox");
    dojo.require("dijit.form.Form");
    dojo.require("dijit.form.Textarea");
    dojo.require("dijit.form.ComboBox");
    dojo.require("dijit.form.CurrencyTextBox");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.FilteringSelect");
    dojo.require("dijit.form.Select");
    dojo.require("dijit.form.TimeTextBox");
    dojo.require("dijit.form.RadioButton");
    dojo.require("dijit.form.CheckBox");
    dojo.require("dijit.form.TextBox");
   
    dojo.require("dojo.data.ItemFileReadStore");
    dojo.require("dojo.data.ItemFileWriteStore");
    dojo.require("dojox.data.FileStore");
    
    dojo.require("dojox.form.PasswordValidator");
    dojo.require("dojox.layout.ExpandoPane");
    dojo.require("dojox.widget.Standby");
    dojo.require("dojox.widget.Toaster");
    dojo.require("dojox.grid.Grid");
    dojo.require("dojox.grid.DataGrid");

    dojo.require("dojox.fx.text");

    dojo.require("dijit.form.VerticalSlider");
    dojo.require("dijit.form.HorizontalSlider");

} //End of function importClasses

function clearProcurementCookies()
{
    dojo.cookie("Suppliers", null, {expires: -1});
    dojo.cookie("Items", null, {expires: -1});
    dojo.cookie("Suppliers Report", null, {expires: -1});
    dojo.cookie("Local Purchase Order", null, {expires: -1});
    dojo.cookie("Requisitions", null, {expires: -1});
    dojo.cookie("Goods Received",null, {expires: -1});
    dojo.cookie("Departments", null, {expires: -1});
    dojo.cookie("BIN Card", null, {expires: -1});
    dojo.cookie("LPO Report", null, {expires: -1});
    dojo.cookie("currentLPO", null, {expires: -1});
    dojo.cookie("numberofLPOs", null, {expires: -1});
    dojo.cookie("currentsupplier", null, {expires: -1});
    dojo.cookie("numberofsuppliers", null, {expires: -1});
    dojo.cookie("PO By Supplier", null, {expires: -1});
    dojo.cookie("PO By Status", null, {expires: -1});
    dojo.cookie("CurrentGRN", null, {expires: -1});
    dojo.cookie("GRNSize", null, {expires: -1});
    dojo.cookie("numberofitems", null, {expires: -1});
    dojo.cookie("currentitem", null, {expires: -1});
    dojo.cookie("Store Issues", null, {expires: -1});
    dojo.cookie("CurrentStoreIssue", null, {expires: -1});
    dojo.cookie("StoreIssueSize", null, {expires: -1});
    dojo.cookie("Change Password", null, {expires: -1});
    dojo.cookie("Categories", null, {expires: -1});
    dojo.cookie("CurrentCategory", null, {expires: -1});
    dojo.cookie("CategorySize", null, {expires: -1});
    dojo.cookie("Banks", null, {expires: -1});
    dojo.cookie("Store Issue Report", null, {expires: -1});
    dojo.cookie("Goods Received Report", null, {expires: -1});
    dojo.cookie("BIN Card", null, {expires: -1});
    dojo.cookie("Profile", null, {expires: -1});
    dojo.cookie("Requisition", null, {expires: -1});
    dojo.cookie("Address", null, {expires: -1});
} //End of function clearProcurementCookies

/**
 * Function adds a closable tab to the viewable interface
 */
function addTabs(header, link)
{
    
    tab_container = dijit.byId("TabContainer");
    tabs = tab_container.getChildren();
    dojo.forEach(tabs, function(tab, index)
    {
        alert(tab.title);
    });
    
    dojo.xhrGet(
    {
        url: "servlets/staffManager",
        load: function(response)
        {
            if (response.toString().length > 1)
            {
                alert(message);

                return;
            }
        },
        error: function(response)
        {
            if (response.status == 0)
            {
                sessionEnded();
            }
            else
                document.location = "login.jsp";
            //alert(response);
        }
    });

    var tabs = dijit.byId("ContentTabContainer");

    var tabLink = dojo.cookie(header);
    dojo.cookie(header, link, {expires: 5});

    if (link == tabLink)
    {
       var message = header + " Tab is already open in the Tab Pane";

       status_message_display("info", message);
       
        return;
    }

    var pane = new dijit.layout.ContentPane({title: header, href:link, closable: true,
        refreshOnShow: false,
        onClose: function()
        {
           // confirm() returns true or false, so return that.
           var confirmation = confirm("Do you really want to close this tab?");

           if (confirmation == true)
           {
               dojo.cookie(header, "link", {expires: 1});
           }
            return confirmation;
       }
    });
    
    pane.closable;
    tabs.addChild(pane);
    tabs.selectChild(pane);
} //End of Function addTab

function sessionEnded()
{
     var message = "Your login session has expired!" +
                    "\n\n Please re-login to continue ";
                
    alert(message);
    document.location = "index.jsp";
}

/**
 * Function ensures that the user enters a username and password before
 * submitting the form for validation by the authentication service. This is the
 * first stage of user validation.
 */
function validateLogin()
{
    var formToValidate = dijit.byId("LoginForm");

    if (formToValidate.validate())
    {
        return true;
    }
    else
        return false;
} //End of function validateLogin

/**
 * Function ensures that the user enters a username and password before
 * submitting the form for validation by the authentication service. This is the
 * first stage of user validation.
 */
function validateLoginError()
{
    var formToValidate = dijit.byId("LoginErrorForm");

    if (formToValidate.validate())
    {
        return true;
    }
    else
        return false;
} //End of function validateLoginError

/* 
 * Function saves an entity and its associated entities to a file on disk.
 */
function saveToFile()
{
    var message = dojo.byId("InformationMessage");
    var formToValidate = dijit.byId("SaveDialogForm");

    if (formToValidate.validate())
    {
        var fileName = dijit.byId("SaveDialogFileName").getValue();

        var fileType = dijit.byId("SaveDialogFileType").getValue();
        var manager = dojo.byId("SaveDialogURL").innerHTML;

        if (fileType == "xlsx")
        {
            dojo.byId("InformationMessage").innerHTML = "Microsoft Excel 2007 format " +
                "has not yet been implemented! :-(";
            dijit.byId("InformationMessageDialog").show();
            
            return;
        }

        manager = manager.toString();

        if (manager == "lPOManager")
        {
            var lpoId = null;
            lpoId = dijit.byId("LPO.Id").getValue();
            fileType = fileType.toString();
            if ((fileType == "xlsx") || (fileType == "xls"))
            {
                //dijit.byId("SaveDialog").hide();

                message.innerHTML = "Format is not supported for Purchase Orders";
                dijit.byId("InformationMessageDialog").show();

                return;
            }

            dijit.byId("SaveDialog").hide();
            document.location = "servlets/" + manager + "?operationType=find&output="+ fileType + "&fileName=" + fileName + "&keywords=" + lpoId;
        }
        else if (manager == "grnManager")
        {
            if (fileType == "xls")
            {
                dojo.byId("InformationMessage").innerHTML = "Microsoft Excel format " +
                    "is not supported for Goods Received Notes! :-(";
                dijit.byId("InformationMessageDialog").show();

                return;
            }

            var grnId = dijit.byId("grnNo").getValue();

            if (fileType.toString() == "SpreadSheet")
            {
                dijit.byId("SaveDialog").hide();

                message.innerHTML = "Format is not supported for Goods Received Notes";
                dijit.byId("InformationMessageDialog").show();

                return;
            }

            dijit.byId("SaveDialog").hide();
            document.location = "servlets/" + manager + "?operationType=find&output=" +
                fileType + "&fileName=" + fileName + "&grnId=" + grnId;
        }
        else if (manager == "storeIssueManager")
        {
            var issueId = dijit.byId("StoresIssue.No").getValue();

            if (fileType.toString() == "SpreadSheet")
            {
                dijit.byId("SaveDialog").hide();

                message.innerHTML = "Format is not supported for Store Issued Notes";
                dijit.byId("InformationMessageDialog").show();

                return;
            }

            dijit.byId("SaveDialog").hide();
            document.location = "servlets/" + manager + "?operationType=find&output=" +
                fileType + "&fileName=" + fileName + "&issueId=" + issueId;
        }
        else if (manager == "drugsIssueManager")
        {
            saveDrugsIssueToFile(fileName, fileType, message, manager);
        }
        else if (manager == "wardManager")
        {
            var ward = dijit.byId("Ward.Ward").getValue();
            var wardName = dojo.byId("Ward.Ward").value;
            var supplierId = dijit.byId("Ward.Status").getValue();
            var grid = dijit.byId("Ward.SearchGrid");
            var beginDate = dojo.byId("Ward.BeginDate").value;
            var endDate = dojo.byId("Ward.EndDate").value;

            document.location = "servlets/wardManager?operationType=getPatients&output=" 
                + fileType + "&wardId=" + ward + "&fileName=" + fileName +
                "&status=" + supplierId + "&beginDate=" + beginDate + "&endDate=" + endDate;
        }
        else if (manager == "patientByDeptManager")
        {
            var department = dijit.byId("PatientByDeptDept").getValue();
            var supplierId = dijit.byId("PatientByDeptStatus").getValue();

            document.location =  "servlets/patientByDeptManager?operationType=getNames&department=" + department + "&status=" +
                supplierId + "&output=" + fileType + "&fileName=" + fileName +
                "&beginDate=" + beginDate + "&endDate=" + endDate;
        }
        else if (manager == "patientManager")
        {
             patientId = dijit.byId("PatientId").getValue()
        }
        else if (manager == "departmentManager")
        {
            var ward = dijit.byId("Ward.Ward").getValue();
            var supplierId = dijit.byId("Ward.Status").getValue();
            
            document.location = "servlets/departmentManager?operationType=get&output="+ fileType + "&fileName=" + fileName + "&id=" + ward + "&status=" +supplierId;

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "supplierManager")
        {
            var supplierId = dijit.byId("SupplierReport.SupplierName").getValue();

            document.location = "servlets/supplierManager?operationType=get&output="+ fileType + "&fileName=" + fileName + "&supplierId=" + supplierId ;

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "purchaseOrderReportByStatus")
        {
            var supplierId = dijit.byId("LPOReportByStatusStatus").getValue();
            var beginDate = dojo.byId("LPOReportByStatusBeginDate").value;
            var endDate = dojo.byId("LPOReportByStatusEndDate").value;

            document.location = "servlets/purchaseOrderReport?operationType=findByStatus&output=" +
                fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                "&endDate=" + endDate + "&status=" +  supplierId;

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "purchaseOrderReportBySupplier")
        {
            var supplierId = dijit.byId("LPOReportBySupplierSupplier").getValue();
            var supplierName = dojo.byId("LPOReportBySupplierSupplier").value;
            var beginDate = dojo.byId("LPOReportBySupplierBeginDate").value;
            var endDate = dojo.byId("LPOReportBySupplierEndDate").value;

            document.location =
                "servlets/purchaseOrderReport?operationType=findBySupplier&output=" +
                fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                "&endDate=" + endDate + "&supplierId=" +  supplierId + "&supplierName=" + supplierName;

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "GoodsReceivedNoteReport")
        {
            var supplier = dijit.byId("GoodsReceivedNoteReport.Supplier");
            var beginDate = dojo.byId("GoodsReceivedNoteReport.BeginDate").value;
            var endDate = dojo.byId("GoodsReceivedNoteReport.EndDate").value;
            var supplierName = dojo.byId("GoodsReceivedNoteReport.Supplier").value;

            if (supplier.disabled == false)
            {
                document.location =
                    "servlets/goodsReceivedNoteReportManager?operationType=get&output=" +
                    fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                    "&endDate=" + endDate + "&supplierId=" +  supplier + "&supplierName=" + supplierName;
            }
            else
            {
                document.location =
                    "servlets/goodsReceivedNoteReportManager?operationType=get&output=" +
                    fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                    "&endDate=" + endDate;
            }

            supplier = supplier.getValue()

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "storeIssueReportManager")
        {
            var department = dijit.byId("StoreIssueReport.Department");
            var beginDate = dojo.byId("StoreIssueReport.BeginDate").value;
            var endDate = dojo.byId("StoreIssueReport.EndDate").value;
            var departmentName = dojo.byId("StoreIssueReport.Department").value;

            if (department.disabled == false)
            {
                document.location =
                    "servlets/storeIssueReportManager?operationType=get&output=" +
                    fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                    "&endDate=" + endDate + "&departmentId=" +  department + "&departmentName=" + departmentName;
            }
            else
            {
                document.location =
                    "servlets/storeIssueReportManager?operationType=get&output=" +
                    fileType + "&fileName=" + fileName + "&beginDate=" + beginDate +
                    "&endDate=" + endDate;
            }

            department = department.getValue()

            dijit.byId("SaveDialog").hide();
            return;
        }
        else if (manager == "itemTransactionsManager")
        {
            var itemId = dijit.byId("ItemTransactions.Item").getValue();
            var itemName = dojo.byId("ItemTransactions.Item").value;
            var beginDate = dojo.byId("ItemTransactions.BeginDate").value;
            var endDate = dojo.byId("ItemTransactions.EndDate").value;
            var order = dijit.byId("ItemTransactions.Order").getValue();
            var issue = dijit.byId("ItemTransactions.Issue").getValue();
            var grn = dijit.byId("ItemTransactions.GRN").getValue();

            order = (order == false ? "" : "&order=" + order);
            issue = (issue == false ? "" : "&issue=" + issue);
            grn = (grn == false ? "" : "&grn=" + grn);

            var parameters = "&itemId=" + itemId + "&itemName=" + itemName +
                "&beginDate=" + beginDate + "&endDate=" + endDate + order +
                issue + grn;

            document.location =
                "servlets/itemTransactionManager?operationType=get&output=" +
                fileType + "&fileName=" + fileName + parameters;

            dijit.byId("SaveDialog").hide();
            return;
        }
        
        dijit.byId("SaveDialog").hide();
    }//End of if statement block
} //End of function saveToFile

function saveDrugsIssueToFile(fileName, fileType, message, manager)
{
    var issueId = dijit.byId("DrugsIssue.Id").getValue();

    if (fileType.toString() == "SpreadSheet")
    {
        dijit.byId("SaveDialog").hide();

        message.innerHTML = "Format is not supported for Drugs Issue Notes";
        dijit.byId("InformationMessageDialog").show();

        return;
    }

    dijit.byId("SaveDialog").hide();
    document.location = "servlets/" + manager + "?operationType=get&output=" +
        fileType + "&fileName=" + fileName + "&id=" + issueId;
}//End of function saveDrugsIssueToFile

function clearDoctorCookies()
{
    dojo.cookie("Members", null, {expires: -1});
    dojo.cookie("Organisations", null, {expires: -1});
    dojo.cookie("Patients", null, {expires: -1});
    dojo.cookie("Waiting List", null, {expires: -1});
    dojo.cookie("Consult List", null, {expires: -1});
    dojo.cookie("Prescriptions", null, {expires: -1});
    dojo.cookie("Patients By Date", null, {expires: -1});
    dojo.cookie("Patient's History", null, {expires: -1});
    dojo.cookie("Change Password", null, {expires: -1});
    dojo.cookie("Personal Info", null, {expires: -1});
    dojo.cookie("Patients By Dept", null, {expires: -1});
    dojo.cookie("Out Patients", null, {expires: -1});
    dojo.cookie("PrescriptionPosition", null, {expires: -1});
    dojo.cookie("PrescriptionNumber", null, {expires: -1});
    dojo.cookie("Patients By Count", null, {expires: -1});
    dojo.cookie("Ward", null, {expires: -1});
} //End of function clearDoctorCookies

/**
 * Function clears cookies created by the receptionist
 */
function clearReceptionistCookies()
{
    dojo.cookie("Members", "false", {expires: -1});
    dojo.cookie("Organisations", "false", {expires: -1});
    dojo.cookie("Waiting List", "false", {expires: -1});
    dojo.cookie("Consult List", "false", {expires: -1});
    dojo.cookie("Patients", "false", {expires: -1});
} //End of function clearReceptionistCookies

/**
 * Function clears cookies created by the Admin
 */
function clearAdminCookies()
{
    dojo.cookie("Records", "false", {expires: -1});
    dojo.cookie("Users", "false", {expires: -1});
    dojo.cookie("Staff", "false", {expires: -1});
    dojo.cookie("Consult List", "false", {expires: -1});
    dojo.cookie("Patients", "false", {expires: -1});
} //End of function clearReceptionistCookies

/**
 * Function displays status bar messages and appropriate icons and fades them
 * out gradually
 */
function status_message_display(icon, message)
{
    var message_area = dojo.byId("status_message");
    var icon_area = dojo.byId("status_icon");
    var status_content = dojo.byId("status_content");
    message_area.innerHTML = "&nbsp;&nbsp;" + message;

    if (icon == null)
        icon_area.innerHTML = "";
    else
    {
        if (icon == "searching")
            icon_area.innerHTML = "<img src=\"static/images/searching.gif\" height='16px'/>";
        else if (icon == "busy")
            icon_area.innerHTML = "<img src=\"static/images/busy.gif\" />";
        else if (icon == "info")
            icon_area.innerHTML = "<img src=\"static/images/info_small.gif\" />";
        else if (icon == "warning")
            icon_area.innerHTML = "<img src=\"static/images/warning_small.gif\" />";
        else if (icon == "error")
            icon_area.innerHTML = "<img src=\"static/images/error_small.gif\" />";
    }

    if ((icon == "warning") || (icon == "error"))
        dojo.query(status_content).style({color: "red"});

    dojo.fadeOut(
    {
        node: status_content,
        duration: 2000,
        delay: 5000,
        onEnd: function()
        {
            message_area.innerHTML = "Status Bar";
            icon_area.innerHTML = "";
            dojo.query(status_content).style({opacity: 1, visibility: "visible", color: "black"});
        }
    }).play();
} //End of function status_message_display

/**
 * Function sets the innerHTML of the status bar with given parameters.
 * Parameters are strings first, the icon url and the second parameter is the
 * message to be displayed
 */
function status_message(icon, message)
{
    var message_area = dojo.byId("status_message");
    var icon_area = dojo.byId("status_icon");
    
    message_area.innerHTML = message;

    if (icon == null)
        icon_area.innerHTML = "";
    else
    {
        if (icon == "searching")
            icon_area.innerHTML = "<img src='resources/images/searching.gif' height='18px'/>";
        else if (icon == "info")
            icon_area.innerHTML = "<img src=\"resources/images/infoSmall.png\"" + " height='18px'/>";
        else if (icon == "warning")
            icon_area.innerHTML = "<img src=\"resources/images/warning.png\"" + " height='18px'/>";
        else if (icon == "error")
            icon_area.innerHTML = "<img src=\"resources/images/error-large.png\"" + " height='18px'/>";
    }
} //End of function status_message_display

/**
 * Function displays an error message if the start date of a search query is
 * later than the end date.
 * beginDate is the start date of the search
 * endDate is the end date of the search query
 * grid is the dojox.data.DataGrid whose contents are to be cleared
 * htmlTagToClear HTML node whose innerHTML is to be cleared
 */
function dateErrorMessage(beginDate, endDate, grid, htmlTagToClear)
{
    if (beginDate > endDate)
    {
        var message = "Start Date cannot be later than the end date";
        dojo.byId("ErrorMessage").innerHTML = message;
        dijit.byId("ErrorMessageDialog").show();

        if (grid !== null)
            clearGrid(grid);

        if (htmlTagToClear !== null)
            dojo.byId(htmlTagToClear).innerHTML = "&nbsp";
    }
}//End of function dateErrorMessage

/**
 * Function clears the contents of a grid.
 */
function clearGrid(grid)
{
    var store = new dojo.data.ItemFileWriteStore(
        {url: 'resources/json/genericEmptyjson.json'});
        
    grid.setStore(store);
} //End of function clearGrid

/**
 * Function determines if a user attempts to print or save a file to disk after
 * changing field values and has not yet submitted the values for a search
 * first.
 */
function changeOfParameters(action)
{
    var message = "Submit the new parameters before attempting to ";

    if (action == "print")
        message += "print out the data";
    else
        message += "save the data to a file";

    dojo.byId("InformationMessage").innerHTML= message;
    dijit.byId("InformationMessageDialog").show();

} //End of function changeOfParameters

function noResultsToDisplay(type, action)
{
    dojo.byId("InformationMessage").innerHTML= "No " + type + " to " + action;
    dijit.byId("InformationMessageDialog").show();
}
