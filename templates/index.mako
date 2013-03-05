<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
  <head>
    <title>${app_name}</title>
    <style type="text/css">
      @import "/static/js/dijit/themes/soria/soria.css";
      @import "/static/js/dijit/themes/ivory/ivory.css";
      @import "/static/js/dijit/themes/tundra/tundra.css";
      @import "/static/js/dijit/themes/nihilo/nihilo.css";
      @import "/static/js/dojo/dojo.css";
      @import "/static/js/dojox/widget/Toaster/Toaster.css";
      @import "/static/js/dojox/grid/_grid/ivoryGrid.css";
      @import "/static/js/dojox/grid/_grid/soriaGrid.css";
      @import "/static/js/dojox/grid/_grid/tundraGrid.css";
      @import "/static/js/dojox/grid/_grid/nihiloGrid.css";
      @import "/static/js/dojox/grid/_grid/Grid.css";
      @import "/static/js/dojox/widget/Standby/Standby.css";
      @import "/static/js/dojox/grid/Grid.css";
      @import "/static/js/dojox/grid/ivoryGrid.css";
      @import "/static/js/dojox/grid/soriaGrid.css";
      @import "/static/js/dojox/grid/tundraGrid.css";
      @import "/static/js/dojox/grid/nihiloGrid.css";
      @import "/static/js/dojox/layout/ExpandoPane.css";
      @import "/static/js/dijit/themes/claro/claro.css";
      @import "/static/js/dojox/grid/enhanced/resources/claro/EnhancedGrid.css";
      @import "/static/js/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css";
      @import "/static/js/dojox/widget/Portlet/Portlet.css";
      @import "/static/js/dojox/layout/resources/GridContainer.css";
      @import "/static/js/dojox/layout/resources/DndGridContainer.css";
    </style>

    <link rel="stylesheet" href="/static/js/dijit/themes/claro/document.css"/>
    <link rel="stylesheet" href="/static/js/dijit/tests/css/dijitTests.css"/>

    <script src="/static/js/dojo/dojo.js" djConfig="parseOnLoad:true, isDebug: false"> </script>
    <script type="text/javascript" src="/static/js/scripts/index.js"></script>
 
   <style type="text/css">
     html, body { height: 100%; width: 100%; padding: 0; border: 0; }
      #main { height: 100%; width: 100%; border: 0; }
      #header { margin: 0; }
      #leftAccordion { width: 25%; }
      #bottomTabs { height: 40%; }
      #hs-1width {
        width:400px;
        height:40px;
      }
      /* pre-loader specific stuff to prevent unsightly flash of unstyled content */
      #loader {
        padding:0;
        margin:0;
        position:absolute;
        top:0; left:0;
        width:100%; height:100%;
        background:#ededed;
        z-index:999;
        vertical-align:middle;
      }
      #loaderInner {
        padding:5px;
        position:relative;
        left:0;
        top:0;
        width:175px;
        background:#3c3;
        color:#fff;
      }

      #indTestBar,
      #setTestBar {
        width:400px;
      }

      hr.spacer { border:0; background-color:#ededed; width:80%; height:1px; }

      /* rules used to test custom setting of TextBox padding */
      .inputPadding0 .dijitInputField { padding: 0 !important; }
      .inputPadding1 .dijitInputField { padding: 1px !important; }
      .inputPadding2 .dijitInputField { padding: 2px !important; }
      .inputPadding3 .dijitInputField { padding: 3px !important; }
      .inputPadding4 .dijitInputField { padding: 4px !important; }
      .inputPadding5 .dijitInputField { padding: 5px !important; }
    </style>

    <script type="text/javascript">
      dojo.require("dijit.CheckedMenuItem");
      dojo.require("dijit.Dialog");
      dojo.require("dijit.form.Button");
      dojo.require("dijit.form.CheckBox");
      dojo.require("dijit.form.ComboBox");
      dojo.require("dijit.form.ComboButton");
      dojo.require("dijit.form.DateTextBox");
      dojo.require("dijit.form.FilteringSelect");
      dojo.require("dijit.form.Form");
      dojo.require("dijit.form.MultiSelect");
      dojo.require("dijit.form.NumberTextBox");
      dojo.require("dijit.form.Textarea");
      dojo.require("dijit.form.TextBox");
      dojo.require("dijit.form.ValidationTextBox");
      dojo.require("dijit.layout.AccordionContainer");
      dojo.require("dijit.layout.BorderContainer");
      dojo.require("dijit.layout.ContentPane");
      dojo.require("dijit.layout.TabContainer");
      dojo.require("dojox.layout.GridContainer");
      dojo.require("dijit.Menu");
      dojo.require("dijit.Menu");
      dojo.require("dijit.MenuItem");
      dojo.require("dijit.MenuItem");
      dojo.require("dijit.MenuSeparator");
      dojo.require("dijit.PopupMenuItem");
      dojo.require("dijit.ProgressBar");
      dojo.require("dijit.TitlePane");
      dojo.require("dijit.Toolbar");
      dojo.require("dijit.ToolbarSeparator");
      dojo.require("dijit.Tooltip");
      dojo.require("dojo.cookie");
      dojo.require("dojo.data.ItemFileReadStore");
      dojo.require("dojo.data.ItemFileWriteStore");
      dojo.require("dojo.fx.easing");
      dojo.require("dojo.parser" );
      dojo.require("dojox.form.PasswordValidator")
      dojo.require("dojox.grid.EnhancedGrid");
      dojo.require("dojox.widget.Portlet");
  dojo.require("dijit.dijit");
  dojo.require("dojox.widget.Portlet");
  dojo.require("dojox.widget.FeedPortlet");
  dojo.require("dojox.layout.GridContainer");
  dojo.require("dojox.widget.Calendar");
      //dojo.require("dojox.widget.PortletSettings");
    </script>
    <script type="text/javascript">
      function addTab(header, link)
      {
        var container = dijit.byId("TabContainer");
        var tabs = container.getChildren();
        var visible = false;

        dojo.forEach(tabs, function(tab, index)
        {
            if (tab.title.toString() == header)
            {
                visible = true;
                container.selectChild(tab);
            }
        });
    
        if (visible)
            return;
        
        var pane = new dijit.layout.ContentPane({ title:header, href:link, closable:true });
        container.addChild(pane);
        container.selectChild(pane);

        if (header == "Goods Returned Report")
        {
            myTextBox = new dijit.form.TextBox({
                name: "firstname",
                value: "" /* no or empty value! */,
                placeHolder: "type in your name"
            }, "firstname").placeAt("reports_widget");
        }
      }
    </script>

    <script type="text/javascript" src="/static/js/scripts/suppliers.js"></script>
    <script type="text/javascript" src="/static/js/scripts/users.js"></script>
  </head>
  <body class=claro>
    <div data-dojo-type="dijit.layout.BorderContainer" style="width: 100%; height: 100%;">
    <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'top'" style="padding:0">
      <div data-dojo-type="dijit.Toolbar"> 
        <button data-dojo-type="dijit.form.Button" iconClass="dijitEditorIcon dijitEditorIconCopy" showLabel="true"> New </button>
        <button dojoType="dijit.form.Button" id="_update" onclick="save()" iconClass="dijitEditorIcon dijitEditorIconSave" showLabel="true"> Save </button>
        <button dojoType="dijit.form.Button"> <img src="/static/images/drive-harddisk.png" />
          Save To File
          <script type="dojo/method" event="onClick" args="evt">
            var Id = dijit.byId("_Id").getValue();
             if (Id.toString() == "NaN")
            {
              dojo.byId("InformationMessage").innerHTML = "You can only save to file a viewable ";
              dijit.byId("InformationMessageDialog").show();
              return;
            }
             dojo.byId("SaveDialogURL").innerHTML = "Manager";
            dijit.byId("SaveDialog").show();
          </script>
        </button>
        <button dojoType="dijit.form.Button" id="_delete" iconClass="dijitEditorIcon dijitEditorIconDelete" showLabel="true">
          Delete
          <script type="dojo/method" event="onClick" args="evt">
            var Id = dijit.byId("_Id").getValue();
        
            if (Id.toString() == "NaN")
            {
                dojo.byId("InformationMessage").innerHTML = "You can only delete a viewable ";
                dijit.byId("InformationMessageDialog").show();
                return;
            }
        
           var Status = dojo.byId("Status").innerHTML;
        
            if (Status.toString() !== "PENDING")
            {
              var message = dojo.byId("InformationMessage");
              message.innerHTML = "You cannot edit a purchase order for which at least one Goods Received Note has already been received";
              dijit.byId("InformationMessageDialog").show();
        
              return;
            }//ENd of if statement block
        
            dijit.byId("DeleteDialog").show();
          </script>
        </button>
        <button dojoType="dijit.form.Button" id="_print"> <img src="/static/images/printer.png" width="16" height="16"/>
           Print Preview
           <script type="dojo/method" event="onClick" args="evt">
             var _id = dijit.byId("_id").getValue();
         
             if (_id.toString() == "NaN")
             {
               dojo.byId("InformationMessage").innerHTML = "You can only preview a viewable ";
               dijit.byId("InformationMessageDialog").show();
               return;
             }
         
             PrintPreview(_id);
           </script>
         </button>
         <button dojoType="dijit.form.Button" onclick="refresh_()"> <img src="/static/images/refresh.png"/> &nbsp;Refresh </button>
         <div dojoType="dijit.ToolbarSeparator" label="Dropdowns"></div>&nbsp;&nbsp;&nbsp;
         <label for="Keywords">Search:</label>
         <input dojoType="dijit.form.NumberTextBox" name="keywords" id ="_keywords" required="true" maxlength="10" invalidMessage="Invalid Purchase Order Number"
             constraints="{pattern: '##0'}" type="text" onchange="find()" style="width: 150px;" />
         <button dojoType="dijit.form.Button" placeHolder="search-terms" id="_find" onclick="find()"> <img src="/static/images/find.png" width="16" height="16"> Find </button>
         &nbsp;&nbsp;
         <div id="_search_results" style="display:inline; font-weight:bold; border:0px solid; float:right;">
           <div data-dojo-type="dijit.form.DropDownButton">
             <span><img src="/static/images/user.png"/>${user}</span>
               <div data-dojo-type="dijit.Menu" id="windowContextMenu" data-dojo-props="contextMenuForWindow:true" style="display: none;">
                   <div data-dojo-type="dijit.MenuItem" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconCut',
                       onClick:function(){alert('not actually cutting anything, just a test!')}">Change Password</div>
                   <div data-dojo-type="dijit.MenuItem" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconCopy',
                       onClick:function(){alert('not actually copying anything, just a test!')}">Settings</div>
                   <div data-dojo-type="dijit.MenuSeparator"></div>
               </div>
           </div>
           <div dojoType="dijit.form.Button">
             <script type="dojo/method" event="onClick" args="evt">
               var str = "Logout";
               window.location ="logout";
             </script>
             <img height="16" src="/static/images/logout.png"/> Logout
           </div>
         </div>
         
       </div>
       <div id="_toolbar2" dojoType="dijit.Toolbar">
         <button dojoType="dijit.form.Button" id="_first" onClick="first()"> <img alt="first button" src="/static/images/first.png" height="16" width="16"> First </button>
         <button dojoType="dijit.form.Button" id="_previous" onClick="previous()"> <img src="/static/images/previous.png" width="16" height="16"> Previous </button>
         <button dojoType="dijit.form.Button" id="_next" onClick="next()"> <img src="/static/images/next.png" width="16" height="16"> Next </button>
         <button dojoType="dijit.form.Button" id="_last" onClick="last()"> <img src="/static/images/last.png" width="16" height="16"> Last </button>
         &nbsp;
         <label for="_current_position">Navigation:</label>
         <span id="current_position" dojoType="dijit.form.NumberTextBox" style="width: 30px;" min="0" max="100"># </span> of <span id="_count">#</span>
         <div data-dojo-type="dijit.ToolbarSeparator"></div> 
         <span id="reports_widget"></span>
         <label for="start_date">Start Date</label><input id="start_date" data-dojo-type="dijit.form.DateTextBox" />
         <label for="end_date">End Date</label><input id="end_date" data-dojo-type="dijit.form.DateTextBox" />
         <div data-dojo-type="dijit.form.Button">Generate</div>
         <div id="report_widgets_area"></div>
       </div>
  <%block name = "page_content"> </%block>
       <span> </span>
       </div>
       <div data-dojo-type="dijit.layout.AccordionContainer" data-dojo-props="region:'leading'" style="width: 15%;" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true" >
         <div data-dojo-type="dijit.layout.AccordionPane" title="Forms">
           <div data-dojo-type="dijit.Menu" style="border: 0; width: 100%;" >
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Departments', '/departments/')">Departments</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Suppliers', '/suppliers/')">Suppliers</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Items', '/proc/')">Items</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Banks', '/banks/')">Banks</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Requisitions', '/requisitions/')">Requisitions</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Purchase Orders', '/purchase_orders/')">Purchase Orders</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Goods Received Note', '/goods_received/')">Goods Received</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Goods Returned', '/goods_returned/')">Goods Returned</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Store Issues', '/store_issues/')">Store Issues</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Delivery Note', '/delivery_note/')">Delivery Note</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Users', '/users/')">Users</div>
               <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('GSM Modem', '/modem/')">Modem</div>
             </div>
           </div>
         <div data-dojo-type="dijit.layout.AccordionPane" title="Reports">
           <div data-dojo-type="dijit.Menu" style="border: 0; width: 100%;" >
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Bin Card', '/bincard/')">BIN Card</div>
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Supplier Report', '/suppliers/')">Suppliers</div>
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Items', '/proc/')">Items</div>
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Banks', '/banks/')">Banks</div>
             <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Requisitions Report', '/requisitions_report/')">Requisitions</div>
             <div data-dojo-type="dijit.PopupMenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"'> <span>Purchase Orders</span>
               <div data-dojo-type="dijit.Menu" style="border: 0; width: 100%;" >
                 <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('P. O. by Status', '/purchase_orders_by_status/')">...By Status</div>
                 <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('P. O by Suppliers', '/purchase_orders_by_supplier/')">...By Supplier</div>
               </div>
             </div>
           <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Goods Received Note Report', '/goods_received_report/')">Goods Received</div>
           <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Goods Returned Report', '/goods_returned_report/')">Goods Returned</div>
           <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Store Issues Report', '/store_issues_report/')">Store Issues</div>
           <div data-dojo-type="dijit.MenuItem" data-dojo-props='iconClass:"dijitEditorIcon dijitEditorIconPaste"' onClick="addTab('Delivery Note Report', '/delivery_note_report/')">Delivery Note</div>
         </div>
       </div>
     <div data-dojo-type="dijit.layout.AccordionPane" title="pane #3"> accordion pane #3 </div>
   </div>










   <div id="TabContainer" onchange="alert("cooh");" data-dojo-type="dijit.layout.TabContainer" data-dojo-props="region:'center'">
     <script type="dojo/method" event="onClick" args="evt">
       //alert("Clicked Me!");
     </script>


<div data-dojo-type="dojox.layout.GridContainer"
    id="gc1"
    title="Dashboard"
    closable="true"
    acceptTypes="dojox.widget.Portlet, dojox.widget.FeedPortlet,dojox.widget.ExpandableFeedPortlet"
    hasResizableColumns="false"
    opacity="0.3"
    nbZones="2"
    allowAutoScroll="true"
    withHandles="true"
    handleClasses="dijitTitlePaneTitle"
    region="center"
    minChildWidth="200"
    minColWidth="40">

    <div data-dojo-type="dojox.widget.Portlet" title="First Portlet">

      <div data-dojo-type="dojox.widget.PortletSettings">
        Put whatever settings you like in here
      </div>
      <div>
         Drag me around by clicking on my title bar
      </div>
    </div>


    <div data-dojo-type="dojox.widget.ExpandableFeedPortlet" title="Dojo News"
      id="todaysNews"
      maxResults="5">
      <select data-dojo-type="dojox.widget.PortletFeedSettings">
        <option value="http://shaneosullivan.wordpress.com/category/dojo/feed/">Dojo Blatherings</option>
        <option value="http://www.dojotoolkit.org/aggregator/rss">Planet Dojo</option>
        <option value="http://feeds2.feedburner.com/ajaxian">Ajaxian</option>
      </select>

      <div>
        This is a FeedPortlet with a multiple feeds.
        Click the settings icon in the title bar to choose different feed to load.
      </div>
    </div>


    <div data-dojo-type="dojox.widget.Portlet" title="Calendar Portlet">
      <div data-dojo-type="dojox.widget.PortletSettings">
        Put whatever settings you like in here
      </div>
      <div>
         Drag me around by clicking on my title bar.
      </div>
      <div data-dojo-type="dojox.widget.Calendar">
        <script type="dojo/connect" data-dojo-event="onValueSelected" data-dojo-args="date">
          dojo.byId("dateGoesHere").innerHTML = "Date Selected: " + date.toString();
        </script>
      </div>
      <div id="dateGoesHere">

      </div>
    </div>

  </div>


   </div>

<!--
   -->
 <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'bottom'"><div id="status_content"><span id="status_icon">Bottom pane</span><span id="status_message">Message Area</span></div></div>
</div>

<div id="NavigationDialog" dojoType="dijit.Dialog" title="Navigation" style="width: 330px;">
      <table align="center" cellspacing="5">
           <tr align="center">
               <td valign="middle" style="width:3em">
                   <img src="resources/images/info.png">
               </td>
               <td align="left">
                   <div id="NavigationInformation"></div>
               </td>
           </tr>

           <tr align="center">
               <td colspan="2">
                  <button id="NavigationCancelButton" dojoType="dijit.form.Button">
                      <img src="resources/images/cancel.png" />
                      Cancel
                      <script type="dojo/method" event="onClick" args="evt">
dijit.byId("NavigationDialog").hide();
                      </script>
                  </button>
               </td>
           </tr>
       </table>
  </div>

  <div id="SaveDialog" dojoType="dijit.Dialog" title="Save" style="width: 330px">
      <form id="SaveDialogForm" dojoType="dijit.form.Form" onsubmit="return false">
          <table cellspacing="10">
              <tr>
                  <td>
                      <label>File Name:</label>
                      <input dojoType="dijit.form.ValidationTextBox" type="text" required="true"
   name="WaitingListFileName" id="SaveDialogFileName" style="width: 70%"/>
                  </td>
              </tr>
              <tr>
                  <td>
                      <label>File Type :</label>
                      <select dojoType="dijit.form.Select" id="SaveDialogFileType"  required="true" style="width: 73%">
<option value="doc">Microsoft Word
<option value="odt">OpenOffice Document
<option value="pdf">PDF
<option value="xls">Microsoft Excel 97 - 2003
<option value="xlsx">Microsoft Excel 2007
                      </select>
                      <div id="SaveDialogURL" style="display:none">
                      </div>
                  </td>
              </tr>
              <tr>
                  <td align="center">
                      <button dojoType="dijit.form.Button" onclick="saveToFile()">
<img src="resources/images/drive-harddisk.png" height="20px"/>
Save
                      </button>

                      <button dojoType="dijit.form.Button">
<img src="resources/images/cancel.png" />
Cancel
<script type="dojo/method" event="onClick" args="evt">
    dijit.byId("SaveDialog").hide();
</script>
                      </button>
                  </td>
              </tr>
          </table>
      </form>
  </div>
  <div id="InformationMessageDialog" dojoType="dijit.Dialog" title="Information" style="width: 330px">
      <table align="center" cellspacing="5">
           <tr align="center">
               <td valign="middle" style="width:3em">
                   <img src="resources/images/info.png">
               </td>
               <td align="center">
                   <div id="InformationMessage"></div>
               </td>
           </tr>
           <tr align="center">
               <td colspan="2">

                  <button id="InformationMessageCancelButton" dojoType="dijit.form.Button">
                      <img src="resources/images/cancel.png" />
                      Cancel
                      <script type="dojo/method" event="onClick" args="evt">
dijit.byId("InformationMessageDialog").hide();
                      </script>
                  </button>
               </td>
           </tr>
       </table>
  </div>
  <div id="WarningMessageDialog" dojoType="dijit.Dialog" title="Warning" style="width: 330px;">
      <table align="center" cellspacing="5">
           <tr align="center">
               <td valign="middle" style="width:3em">
                   <img src="resources/images/dialog-warning.png">
               </td>
               <td align="center">
                   <div id="WarningMessage"></div>
               </td>
           </tr>
           <tr align="center">
               <td colspan="2">

                  <button id="WarningMessageCancelButton" dojoType="dijit.form.Button">
                      <img src="resources/images/cancel.png" />
                      Cancel
                      <script type="dojo/method" event="onClick" args="evt">
dijit.byId("WarningMessageDialog").hide();
                      </script>
                  </button>
               </td>
           </tr>
       </table>
  </div>
  <div id="ErrorMessageDialog" dojoType="dijit.Dialog" title="Error" style="width: 330px">
      <table align="center" cellspacing="5">
           <tr align="center">
               <td valign="middle" style="width:3em">
                   <img src="resources/images/error_large.gif">
               </td>
               <td align="center">
                   <div id="ErrorMessage"></div>
               </td>
           </tr>
           <tr align="center">
               <td colspan="2">

                  <button id="ErrorMessageCancelButton" dojoType="dijit.form.Button">
                      <img src="resources/images/cancel.png" />
                      Cancel
                      <script type="dojo/method" event="onClick" args="evt">
dijit.byId("ErrorMessageDialog").hide();
                      </script>
                  </button>
               </td>
           </tr>
       </table>
  </div>




</body>
</html>
