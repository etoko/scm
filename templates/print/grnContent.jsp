<%-- 
    Document   : grnContent.jsp
    Created on : Apr 23, 2010, 06:18:30 AM
    Author     : Emmanuel Toko a.k.a Manu
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
   
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <style type="text/css">
            @import "../../resources/js/dojo/resources/dojo.css";
        </style>
        <script type="text/javascript" src="../../resources/js/dojo/dojo.js"  djConfig="parseOnLoad:true, isDebug: false">
        </script>
        <script>
                dojo.addOnLoad(
                function()
                {
                    var grnPrintData  = dojo.byId("grnPrintData");
                    
                    dojo.xhrGet(
                    {
                        url: "../../servlets/grnManager?operationType=find&output=HTML&grnId=<%=request.getParameter("grnId")%>",
                        load: function(response)
                        {
                            grnPrintData.innerHTML = response;
                        },
                        error: function(response)
                        {
                            grnPrintData.innerHTML = response;
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
                        <div id="grnPrintId" style="display:none"></div>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="0">
                        <div id="grnPrintData">

                        </div>
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>
