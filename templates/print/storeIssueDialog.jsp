<%-- 
    Document   : storeIssueDialog.jsp
    Created on : Jan 28, 2010, 3:18:22 PM
    Author     : Emmanuel Toko a.k.a Manu
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Store Issue - Print</title>
    </head>
<!-- Frameset for Nav, ButtonNav, and Content frames -->
    <frameset cols="100%" frameborder="yes" border="1">

        <!-- Frameset for ButtonNav and Content Frames -->

        <frameset rows="32,*" frameborder="yes" border="0">

            <!-- ButtonNav Frame -->
            <frame src="header.html" name="buttonNavFrame" frameBorder="yes"
             scrolling="no" border="0" id="buttonNavFrame"
             title="Frame Containing Navigation Buttons" />

            <!-- Content Frame -->
            <frame src="storeIssueContent.jsp?operationType=find&output=HTML&issueId=<%=request.getParameter("issueId")%>"
             name="contentFrame" border="1" frameBorder="yes" scrolling="auto"
             id="contentFrame" title="Frame Containing Online Help Text" />

        </frameset>
    </frameset>

    <noframes>
        <body>
            <span id="noFramesText">This page requires frames</span>
        </body>
    </noframes>
</html>
