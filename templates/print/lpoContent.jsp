<%-- 
    Document   : prescriptionContent.jsp
    Created on : Dec 26, 2009, 10:53:30 AM
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
                    var patientPrintData  = dojo.byId("patientPrintData");
                    
                    dojo.xhrGet(
                    {
                        url: "../../servlets/lPOManager?operationType=find&output=HTML&keywords=<%=request.getParameter("keywords")%>",
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
