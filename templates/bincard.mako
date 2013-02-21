
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
        .formContainer {
           width:600px;
           height:600px;
        }
        label {
           width:80px;
           float:left;
        }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td>
                    <label for="bincardItemName">Item:</label>
                    <div dojoType="dojo.data.ItemFileReadStore" jsId="itemStore"
                        url="servlets/supplierManager?operationType=getSuppliers"></div>
                    <div id="bincardItemName" dojoType="dijit.form.FilteringSelect"
                    store="itemStore"></div><br><br>
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td>
                                <label for="bincardStartDate">Start date:</label>
                                <div id ="bincardStartDate" dojoType="dijit.form.DateTextBox"></div>
                            </td>
                            <td>&nbsp;&nbsp;</td>
                            <td>
                                <label for="bincardEndDate">End date:</label>
                                <div id ="bincardEndDate" dojoType="dijit.form.DateTextBox"></div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>

                    <table dojoType="dojox.grid.DataGrid">
                        <thead>

                        </thead>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
