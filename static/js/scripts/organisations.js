/*
 *Script handles all operations of the items page such as navigation, adding new
 *items entities and so on
 **/
function newOrganisation()
{
    //lastOrganisation();

    var organisationname = dojo.byId("organisationName");
    var organisationDate = dojo.byId("organisationDate");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationFaxNumber = dojo.byId("organisationFaxNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

    organisationname.value = "";
    organisationDate.value = "";
    organisationTelephoneNumber.value = "";
    organisationFaxNumber.value = "";
    organisationEmail.value = "";
    organisationAddress.value = "";
    organisationCity.value = "";
    organisationCountry.value = "";

    dojo.xhrGet(
    {
        url: "servlets/organisationManager?operationType=add",
        load: function (response)
        {
            dojo.cookie("newOrganisation", "true", {expires: 5});
            
        },
        error: function (response)
        {
            dojo.publish("/saving", [{message: "<font size='2'><b>...Failed", type: "error", duration: 15}]);
        }
    });
}

/**
* function persists or mergers an entity
*/
function saveOrganisation()
{
    dojo.publish("/saving",[{message: "<font size='2'><b>Saving...", type: "info", duration: 15}]);

    if (dijit.byId("organisationForm" ).validate())
    {
        dojo.xhrPost(
        {
            url: "servlets/organisationManager" ,
            form: "organisationForm" ,
            timeout: 5000,
            load: function(response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...Saved", type: "info", duration: 0}]);
            },
            error: function(response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...Failed", type: "error", duration: 0}]);
            }
        });
    }

    var flag = dojo.cookie("newOrganisation");

    if (flag == "true")
    {
        dojo.cookie("newOrganisation", "false", {expires: 5});
    }
}//End of function saveOrganisation

/**
 *Function navigates to the first organisation entity
 */
function firstOrganisation()
{
    var organisationid = 0;

    var organisationname = dojo.byId("organisationName");
    var organisationContact = dojo.byId("organisationContact");
    var organisationDate = dojo.byId("organisationDate");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationFaxNumber = dojo.byId("organisationFaxNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

//The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
    dojo.xhrGet(
    {
        url: "servlets/organisationManager?operationType=first",
        handleAs: "text",
        load: function(response)
        {
            var organisation = dojo.fromJson(response);

            organisationname.value = organisation.name;
            organisationEmail.value = organisation.email;
            organisationTelephoneNumber.value = organisation.phone;
            organisationAddress.value = organisation.address;
            organisationCity.value = organisation.city;
            organisationCountry.value = organisation.country;

            dojo.cookie("currentOrganisation", organisationid, {expires: 5});
            getOrganisationSize();
            organisationsNavigator();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
        }
    });
}//End of function firstOrganisation

/**
 * Function navigates to the previous organisation entity
 */
function previousOrganisation()
{
    var organisationid = dojo.cookie("currentOrganisation");

    if ((organisationid == undefined) || (organisationid == null))
    {
        organisationid = 0;
    }

    organisationid = Math.abs(organisationid);

    if (organisationid < 0)
    {
        organisationid = 0;
    }

    if (organisationid == 0)
    {
        dojo.byId("NavigationInformation").innerHTML = "You have reached the first organisation!";
        dijit.byId("NavigationDialog").show();
        firstOrganisation();
        return;
    }

    organisationid = organisationid - 1;

    var organisationname = dojo.byId("organisationName");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

    //The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
    dojo.xhrGet(
    {
        url: "servlets/organisationManager?operationType=previous&previousOrganisation="+organisationid,
        handleAs: "text",
        load: function(response)
        {
            var organisation = dojo.fromJson(response);

            organisationname.value = organisation.name;
            organisationEmail.value = organisation.email;
            organisationTelephoneNumber.value = organisation.phone;
            organisationAddress.value = organisation.address;
            organisationCity.value = organisation.city;
            organisationCountry.value = organisation.country;

            dojo.cookie("currentOrganisation", organisationid, {expires: 5});

            organisationsNavigator();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
        }
    });
}//End of function previousOrganisation

/**
 *Function navigates to the next Organisation
 */
function nextOrganisation()
{
    var organisationid = dojo.cookie("currentOrganisation");
    getOrganisationSize();
    var organisationNumber = dojo.cookie("numberOfOrganisations");

    if ((organisationid == undefined) || (organisationid == null))
    {
        organisationid = 0;
    }

    organisationid = Math.abs(organisationid);
    organisationNumber = Math.abs(organisationNumber);

    if (organisationid < 0)
    {
        organisationid = 0;
    }

    var organisationname = dojo.byId("organisationName");
    var organisationDate = dojo.byId("organisationDate");
    var organisationContact = dojo.byId("organisationContact");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationFaxNumber = dojo.byId("organisationFaxNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

    organisationid = organisationid + 1;

    if (organisationid >= organisationNumber)
    {
        dojo.byId("NavigationInformation").innerHTML = "You have reached the last organisation!";
        dijit.byId("NavigationDialog").show();
        lastOrganisation();
        return;
    }

    //The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
    dojo.xhrGet(
    {
        url: "servlets/organisationManager?operationType=next&nextOrganisation="+organisationid,
        handleAs: "text",
        load: function(response)
        {
            var organisation = dojo.fromJson(response);

            organisationname.value = organisation.name;
            organisationEmail.value = organisation.email;
            organisationTelephoneNumber.value = organisation.phone;
            organisationAddress.value = organisation.address;
            organisationCity.value = organisation.city;
            organisationCountry.value = organisation.country;

            dojo.cookie("currentOrganisation", organisationid, {expires: 5});

            organisationsNavigator();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
        }
    });
}//End of function nextOrganisation

function lastOrganisation()
{
    var organisationid = dojo.cookie("currentOrganisation");
    getOrganisationSize();
    var organisationSize = dojo.cookie("numberOfOrganisations");

    var organisationname = dojo.byId("organisationName");
    var organisationContact = dojo.byId("organisationContact");
    var organisationDate = dojo.byId("organisationDate");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationFaxNumber = dojo.byId("organisationFaxNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

    organisationAddress.textContent = "Hitch";

    //The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
       dojo.xhrGet(
        {
            url: "servlets/organisationManager?operationType=last",
            handleAs: "text",
            load: function(response)
            {
                var organisation = dojo.fromJson(response);

                organisationname.value = organisation.name;
                organisationEmail.value = organisation.email;
                organisationTelephoneNumber.value = organisation.phone;
                organisationAddress.value = organisation.address;
                organisationCity.value = organisation.city;
                organisationCountry.value = organisation.country;
                organisationid = organisation.navigationid;

                organisationSize = Math.abs(organisationSize);

                dojo.cookie("currentOrganisation", organisationSize, {expires: 5});
                organisationsNavigator();
            },
            error: function(response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
            }
        });
}//End of function lastOrganisation

/**
 * Function retrieves the organisation size and stores it in a cookie
 */
function getOrganisationSize()
{
      dojo.xhrGet(
      {
          url: "servlets/organisationManager?operationType=size",
          load: function (response)
          {
              var organisationjson = dojo.fromJson(response);

              var num = organisationjson.size;
              dojo.cookie("numberOfOrganisations", num, {expires: 5});
          },
          error: function (response)
          {
              dojo.publish("/saved",[{message: "<font size='2'><b>Failed Operation", type: "error", duration: 0}]);
          }
      });
}//End of function getOrganisationSize

/**
 * Function to delete a organisation entity
 */
function deleteOrganisation()
{
    var organisationDialog = dijit.byId("OrganisationDeleteDialog");

    dojo.publish("/saving",[ "Deleting..." ]);

    dojo.xhrPost(
    {
        url: "servlets/organisationManager?operationType=delete" ,
        timeout: 5000,
        load: function()
        {
            saveToaster._setHideTimer(0);
            organisationDialog.hide();
            nextOrganisation();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
        }
    });
}//End of function deleteOrganisation

/**
 *Function to search and return details of a organisation entity
 */
function findOrganisation()
{
    var keywords = dijit.byId("organisationkeywords").getValue();
    var operationType = "find";

    dojo.byId("OrganisationSearchResults").innerHTML = "Searching...";

    dojo.xhrGet(
    {
        url: "servlets/organisationManager?keywords="+ keywords + "&operationType=" + operationType,
        timeout: 5000,
        load: function(response)
        {
            dojo.byId("OrganisationSearchResults").innerHTML = response;
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
        }
    });
}//End of function findOrganisation

/**
 * Function displays navigation details e.g 1 to 2 to 3 ... n
 */
function organisationsNavigator()
{
    var organisationid = dojo.cookie("currentOrganisation");
    var navigator = dojo.byId("organisationsNavigator");
    var organisationSize = dojo.cookie("numberOfOrganisations");

    organisationid = Math.abs(organisationid);
    organisationid = organisationid + 1;
    organisationSize = Math.abs(organisationSize);

    if (organisationid > organisationSize)
    {
        organisationid = organisationSize;
    }
    navigator.innerHTML = organisationid + " of " + organisationSize;
}//End of function organisationsNavigator

/**
 *Function navigates to a organisation with the organisationID specified by organisationID
*/
function navigateToOrganisation(organisationID, organisationPosition)
{
    var organisationname = dojo.byId("organisationName");
    var organisationContact = dojo.byId("organisationContact");
    var organisationDate = dojo.byId("organisationDate");
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber");
    var organisationFaxNumber = dojo.byId("organisationFaxNumber");
    var organisationEmail = dojo.byId("organisationEmailAddress");
    var organisationAddress = dojo.byId("organisationAddress");
    var organisationCity = dojo.byId("organisationCity");
    var organisationCountry = dojo.byId("organisationCountry");

       dojo.xhrGet(
        {
            url: "servlets/organisationManager?operationType=findByPK&pk="+organisationID,
            handleAs: "text",
            load: function(response)
            {
                var organisation = dojo.fromJson(response);

                organisationname.value = organisation.name;
                organisationEmail.value = organisation.email;
                organisationTelephoneNumber.value = organisation.phone;
                organisationAddress.value = organisation.address;
                organisationCity.value = organisation.city;
                organisationCountry.value = organisation.country;
                var position = organisation.navigationid;
                dojo.cookie("currentOrganisation", position, {expires: 5});
                getOrganisationSize();
                organisationsNavigator();
            },
            error: function(response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...Failed<br>" + response, type: "error", duration: 0}]);
            }
        });

        var searchDialog = dijit.byId("OrganisationsFindDialog");
        searchDialog.hide();
}//End of method navigateToOrganisation

/**
 * Function displays the print dialog for the organisation tab.
 */
function organisationsPrint()
{
    var organisationname = dojo.byId("organisationName").value;
    var organisationContact = dojo.byId("organisationContact").value;
    var organisationTelephoneNumber = dojo.byId("organisationTelephoneNumber").value;
    var organisationFaxNumber = dojo.byId("organisationFaxNumber").value;
    var organisationEmail = dojo.byId("organisationEmailAddress").value;
    var organisationAddress = dojo.byId("organisationAddress").value;
    var organisationCity = dojo.byId("organisationCity").value;
    var organisationCountry = dojo.byId("organisationCountry").value;

    window.open('procurement/organisationsprint.jsp?name='+organisationname + '&contact=' +
        organisationContact +'&tel='+ organisationTelephoneNumber +'&fax=' + organisationFaxNumber +
        '&email=' + organisationEmail + '&address='+ organisationAddress +
        '&city='+ organisationCity +'&country=' + organisationCountry,
    '',
    'menubar=no,location=no,scrollbars=yes,resizable=yes,height=550,width=816,statusbar=yes,screenX=100,screenY=100,top=100,left=100');
}