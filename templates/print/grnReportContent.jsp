<%-- 
    Document   : grnReportContent.jsp
    Created on : Apr 1, 2010, 11:42:01 AM
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
                    var grnReportData  = dojo.byId("grnReportData");

                    dojo.xhrGet(
                    {
                        <%
                        String supplierId = request.getParameter("supplierId");

                        if (supplierId == null)
                        {
                        %>
                           url: "../../servlets/goodsReceivedNoteReportManager?operationType=get&output=HTML&beginDate=<%=request.getParameter("beginDate")%>&endDate=<%=request.getParameter("endDate")%>",
                        <%
                        }
                        else
                        {
                        %>
                           url: "../../servlets/goodsReceivedNoteReportManager?operationType=get&output=HTML&supplierName=<%=request.getParameter("supplierName")%>&supplierId=<%=request.getParameter("supplierId")%>&beginDate=<%=request.getParameter("beginDate")%>&endDate=<%=request.getParameter("endDate")%>",
                        <%
                        }
                        %>
                        
                        load: function(response)
                        {
                            grnReportData.innerHTML = response;
                        },
                        error: function(response)
                        {
                            grnReportData.innerHTML = response;
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
                        <div id="grnReportId" style="display:none"></div>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="0">
                        <div id="grnReportData">

                        </div>
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>

