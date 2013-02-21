<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
             <style>
        .formContainer {
           width:600px;
           height:600px; 
        }
        label { /*
           width:80px;
           float:left; */
        }
        </style>
    </head>
    <body>
        <div>
            <table>
                <tr>
                    <td>
                         <div id="LPOReportTabContainer" dojoType="dijit.layout.TabContainer"
                            style="width: 615px;" doLayout="false">
                            <div dojoType="dijit.layout.ContentPane" title="LPO By Staff" selected="true" href="procurement/reports/lpobystaff.jsp">
                                
                            </div>
                              <div dojoType="dijit.layout.ContentPane" title="LPO By Date" href="procurement/reports/lpobydate.jsp">
                                  
                              </div>
                              <div dojoType="dijit.layout.ContentPane" title="LPO By Supplier" closable="false" href="procurement/reports/lpobysupplier.jsp">
                                  
                              </div>
                          </div>
                    </td>
                </tr>
                
            </table>
        </div>
    </body>
</html>
