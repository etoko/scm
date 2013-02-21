<%-- 
    Document   : storeIssueContent.jsp
    Created on : Jan 28, 2010, 3:19:11 PM
    Author     : Emmanuel Toko a.k.a Manu
--%>


<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <style type="text/css">
            @import "../../resources/js/dijit/themes/soria/soria.css";
            @import "../../resources/js/dojo/resources/dojo.css";
            @import "../../resources/js/dojox/widget/Toaster/Toaster.css";
            @import "../../resources/js/dojox/grid/_grid/soriaGrid.css";
            @import "../../resources/js/dojox/grid/_grid/Grid.css";
            @import "../../resources/js/dojox/widget/Standby/Standby.css";
            @import "../../resources/js/dojox/grid/resources/Grid.css";
            @import "../../resources/js/dojox/grid/resources/soriaGrid.css";
        </style>
        <script type="text/javascript" src="../../resources/js/dojo/dojo.js"  djConfig="parseOnLoad:true, isDebug: false">
        </script>
        <script>
                dojo.addOnLoad(
                function()
                {
                    var patientPrintData  = dojo.byId("patientPrintData");

                    dojo.xhrGet(
                    {
                        url: "../../servlets/storeIssueManager?operationType=find&output=HTML&issueId=<%=request.getParameter("issueId")%>",
                        load: function(response)
                        {
                            patientPrintData.innerHTML = response;
                        },
                        error: function(response)
                        {
                            patientPrintData.innerHTML = response;
                        }
                    });
                });
                </script>
    </head>
    <body class="soria" style="font-size:15px;">
        <center>
            <table border="0" width="700px">
                <tr>
                    <td>
                        <div id="patientPrintId" style="display:none"></div>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="0">
                        <div id="patientPrintData">

                        </div>
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>
