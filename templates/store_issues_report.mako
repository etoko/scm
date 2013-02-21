<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <form id="StoreIssueReport.Form" dojoType="dijit.form.Form">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                    <td colspan="5">
                        <div id="StoreIssueReport.toolbar" dojoType="dijit.Toolbar">
                           <button dojoType="dijit.form.Button" id="StoreIssueReport.print">
                                <img src="static/resources/images/print.png" height="16px" width="16px"/>
                                Print Preview
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("StoreIssueReport.State").innerHTML;

                                    if (display.toString() == "none")
                                    {
                                        changeOfParameters("print")
                                        return;
                                    }
                                    else if (display.toString() == "noResults")
                                    {
                                        noResultsToDisplay("Store Issues", "print")
                                        return;
                                    }

                                    var DepartmentId = dijit.byId("StoreIssueReportDepartment").getValue();
                                    var DepartmentName = dojo.byId("StoreIssueReportDepartment").value;
                                    var beginDate = dojo.byId("StoreIssueReportBeginDate").value;
                                    var endDate = dojo.byId("StoreIssueReportEndDate").value;
                                    var formToValidate = dijit.byId("StoreIssueReport.Form");

                                    if (formToValidate.validate())
                                    {
                                        window.open("procurement/print/StoreIssueReportDialog.jsp?operationType=findByDepartment&output=HTML&DepartmentName=" +
                                            DepartmentName + "&DepartmentId=" + DepartmentId + "&beginDate=" + beginDate + "&endDate=" + endDate,
                                             "Purchase Order by Department - Print Preview",
                                             "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
                                    }
                                </script>
                           </button>
                           <button dojoType="dijit.form.Button" id="StoreIssueReport.update">
                                <img src="static/resources/images/drive-harddisk.png" height="20px"/>
                                Save To File
                                <script type="dojo/method" event="onClick" args="evt">
                                    var display = dojo.byId("StoreIssueReport.State").innerHTML;
                                    display = display.toString();
                                    
                                    if (display == "none")
                                    {
                                        changeOfParameters("save");
                                        return;
                                    }
                                    else if (display == "noResults")
                                    {
                                        noResultsToDisplay("Store Issues", "Save To File")
                                        return;
                                    }

                                    var formToValidate = dijit.byId("StoreIssueReport.Form");

                                    if (formToValidate.validate() )
                                    {
                                        dojo.byId("SaveDialogURL").innerHTML = "storeIssueReportManager";
                                        dijit.byId("SaveDialog").show();
                                    }
                                </script>
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
                            jsId="StoreIssueReportDepartmentStore"
                            url="servlets/departmentManager?operationType=getNames">
                        </div>
                        <label for="StoreIssueReport.Department">Department:</label>
                    </td>
                    <td colspan="3">
                        <input dojoType="dijit.form.FilteringSelect" required="true"
                            store="StoreIssueReportDepartmentStore" invalidMessage="You must enter the Department"
                            searchAttr="name" name="LPODepartment" style="width:95%;"
                            onchange="javascript:dojo.byId('StoreIssueReport.State').innerHTML='none';"
                            id="StoreIssueReport.Department" />
                    </td>
                    <td>
                        <input id="StoreIssuesReport.IncludeDept" dojoType="dijit.form.CheckBox" type="checkbox"
                           onchange="javascript:dojo.byId('StoreIssueReport.State').innerHTML='none';" onclick="enableDepartment()" checked/>
                        <label for="StoreIssuesReport.IncludeDept">Include in Search: </label>
                    </td>
                </tr>
                <tr>
                    <td><label for="StoreIssueReport.BeginDate">From:</label></td>
                    <td>
                        <input id="StoreIssueReport.BeginDate" type="text" dojoType="dijit.form.DateTextBox"
                            onchange="javascript:dojo.byId('StoreIssueReport.State').innerHTML='none';"
                            constraints="{datePattern:'dd-MMM-yyyy'}"  required="true" />
                    </td>
                    <td><label for="StoreIssueReport.EndDate">To :</label></td>
                    <td>
                        <input id="StoreIssueReport.EndDate" type="text" dojoType="dijit.form.DateTextBox"
                            onchange="javascript:dojo.byId('StoreIssueReport.State').innerHTML='none';"
                            constraints="{datePattern:'dd-MMM-yyyy'}" required="true"/>
                    </td>
                    <td>
                        <button dojoType="dijit.form.Button" onclick="getStoreIssues()">
                            <img src="static/resources/images/find.png" height="20" />
                            Search
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="StoreIssueReport.State" style="display: none;">noResults</div>
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="height: 25px;">
                        <span id="StoreIssueReport.SearchMessage" style="font-weight:bold"></span>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <div dojoType="dojo.data.ItemFileReadStore"
                            jsId="StoreIssueReportStore" url="static/resources/json/genericEmptyjson.json">
                        </div>

                        <table id="StoreIssueReport.Details" dojoType="dojox.grid.DataGrid" store="StoreIssueReportStore" autoHeight="true"
                           style="width:95%; height:400px; border:1px solid silver;" query="{ orderId: '*' }" clientSort="true">
                            <thead>
                               <tr>
                                  <th field="counter" width="5%">#</th>
                                  <th field="issueId" width="15%">Issue #</th>
                                  <th field="issueDate" width="20%">Issue Date</th>
                                  <th field="department" width="60%">Department</th>
                               </tr>
                            </thead>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td><div id="StoreIssueReport.DetailNavigator"></div></td>
                </tr>
            </table>
        </form>
    </body>
</html>
