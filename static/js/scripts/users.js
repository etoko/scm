/* 
 * Handles all operations of user
 */

/**
 *Function invokes a servlet through AJAX that creates an environment for the 
 *addition of a new  user.
 */
function user_new()
{
    dijit.byId("user_username").setValue("");
    dijit.byId("user_first_name").setValue("");
    dijit.byId("user_last_name").setValue("");
    dijit.byId("user_email_address").setValue("");
   // dijit.byId("user_Notes").setValue("");

    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=add",
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced errors: " + response, type: "error", duration: 0}]);
        }
    });
} //End of function newuser_

/**
 * Function saves/ updates a Patient's details
 */
function user_save()
{
    status_message_display("busy", "Creating user account ...")

    dojo.byId("users_operation").value = "CREATE";
    var form = dijit.byId("users_form");
    if (form.validate())
    {
        dojo.xhrPost(
        {
            url: "/users/operations",
            putData: dojo.formToJson("users_form"),
            load: function (response)
            {
                status_message_display("success", "Successfully created user account");
            },
            error: function(response)
            {
                status_message_display("error", "Failed to create account " + response);
            }
        });
    }//End of outer if statement block
}//End of function saveuser_

/**
 *Function invokes servlet that continues the sequence to delete/ remove a member
 *of user from the persistence layer.
 */
function user_delete()
{
    dijit.byId("userDeleteDialog").hide();
    
    dojo.publish("/saving", [{message: "<font size='2'><b>Deleting...", type: "info", duration: 5000}]);
    
    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=delete",
        load: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...deleted: " + response, type: "info", duration: 10000}]);
            user_next();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Failed: " + response, type: "error", duration: 10000}]);
        }
    });

    dijit.byId("userDeleteDialog").hide();
} //End of function removeuser_

/**
 * Navigates to the first  user
 */
function user_first()
{
    var position = 0;
    dojo.byId("users_position").value = position;
    var operation = dojo.byId("users_operation"); 
    operation.value = "FIRST"
    dojo.xhrPost(
    {
        url: "/users/operations",
        putData: dojo.formToJson("users_form"),
        handleAs: "text",
        load: function (response)
        {
            var user = dojo.fromJson(response);
            populate_user_widgets(user);
        },
        error: function(response)
        {
            status_message_display("error", response.message);
        }
    });
} //End of function user_first

/**
 * Navigates to the previous  user
 */
function user_previous()
{
    dojo.byId("users_operation").value = "PREVIOUS";
    
    dojo.xhrPost(
    {
          url: "/users/operations",
          putData: dojo.formToJson("users_form"),
          handleAs: "text",
          load: function(response)
          {
              var user = dojo.fromJson(response);
              populate_user_widgets(user);
          },
          error: function(response)
          {
              status_message_display("error", response);
          }
    });
} //End of function user_previous

/**
 * Navigates to the next  user
 */
function user_next()
{
    dojo.byId("users_operation").value = "NEXT";
    dojo.xhrPost(
    {
          url: "/users/operations",
          putData: dojo.formToJson("users_form"),
          handleAs: "text",
          load: function(response)
          {
              var user = dojo.fromJson(response);
              populate_user_widgets(user);
          },
          error: function(response)
          {
              status_message_display("error", response);
          }
      });
} //End of function user_next

/**
 * Navigates to the last  user
 */
function user_last()
{    
    dojo.byId("users_operation").value = "LAST";
    dojo.xhrPost(
    {
          url: "/users/operations",
          putData: dojo.formToJson("users_form"),
          handleAs: "text",
          load: function(response)
          {
              var user = dojo.fromJson(response);
              populate_user_widgets(user);
          },
          error: function(response)
          {
              status_message_display("error", response);
          }
    });
} //End of function user_last

/**
 * Function populates the user controls with particulars of the user member
 */
function populate_user_widgets(user)
{
    var user_id = dojo.byId("users_id");
    var navigation_position = dojo.byId("users_position");
    var username = dijit.byId("users_username");
    var firstname = dijit.byId("users_firstname");
    var lastname = dijit.byId("users_lastname");
    var email_address = dijit.byId("users_email");
    var last_login = dojo.byId("users_last_login");
    var current_position = dijit.byId("current_position");
    var assigned_permissions_widget = dojo.byId("users_assigned_permissions");

    permissions = user.permissions;
    navigation_position.value = user.position;
    user_id.value = user.id;
    username.setValue(user.username);
    firstname.setValue(user.first_name);
    lastname.setValue(user.last_name);
    email_address.setValue(user.email_address);
    last_login.innerHTML = user.last_login;
    current_position.setValue(Math.abs(user.position) + 1);
    
    dojo.forEach(permissions, function(permission){
        dojo.create("option", {value: permission.id, innerHTML: permission.description},assigned_permissions_widget);
        //dojo.place(option, assigned_permissions_widget);
    });
}

function users_assigned_privileges()
{
    var assigned_privileges = dijit.byId("users_assigned_permissions");
    alert(assigned_privileges);
    assigned_privileges.addSelected(dijit.byId("users_available_permissions"));
}

/**
 *Function searches for user entities with the specified keywords.
 */
function finduser_()
{
    var keywords = dijit.byId("userNamekeywords").getValue();
    var userSearchResults = dojo.byId("userSearchResults");
    
    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=find&keywords=" + keywords,
        handleAs: "text",
        load: function (response)
        {
            var user = dojo.fromJson(response);

            if (user.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }
            
            userSearchResults.innerHTML = response;
        },
        error: function (response)
        {
            userSearchResults.innerHTML = response;
        }
    });
} //End of function find

/**
 * Retrieves the number of user in the persistence context
 */
function getuser_Number()
{
    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=number",
        handleAs: "text",
        load: function(response)
        {
            var userNumber = dojo.fromJson(response);
            dojo.cookie("userNumber", userNumber.size, {expires: 5});
        },
        error: function(response)
        {
            alert(response);
        }
    });
}//getuser_Number

/**
 *
 */
function changePassword()
{
    var formToValidate = dijit.byId("passwordForm");

    if (formToValidate.validate())
    {
        dojo.publish("/saving", [{message: "<font size='2'><b>Changing Password...", type: "info", duration: 5000}]);
        dojo.xhrPost(
        {
            form: "passwordForm",
            url: "servlets/userManager",
            load: function(response)
            {
                var results = dojo.fromJson(response);

                if (results.status == "logout")
                {
                    document.location = "login.jsp";
                    return;
                }
                else if (results.status == "Different")
                {
                    dojo.publish("/saved", [{message: "<font size='2'><b>Old Password is invalid", type: "error", duration: 5000}]);
                    return;
                }
                
                dojo.publish("/saved", [{message: "<font size='2'><b>...Changed Password", type: "info", duration: 10000}]);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>Error...: " + response, type: "error", duration: 5000}]);
            }
        });
    }
}

/**
 * Function logs a user out of the system
 */
function logoutUser()
{
    document.location = 'servlets/userManager?operationType=logout';
}

/**
 * Function checks the availability status of a user name for a  user
 */
function userusernameAvaillability()
{
    var statusField = dojo.byId("userusernameAvailabilityStatus");
    var keywords = dijit.byId("user_username").getValue();

    if ((keywords == null) || (keywords == undefined) || (keywords == "")  ||
        (keywords == " "))
    {
        dijit.byId("user_InformationDialog").show();
        return;
    }
    
    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=findByName&keywords=" + keywords,
        handleAs: "text",
        load: function (response)
        {
            var status = dojo.fromJson(response);
            var statusMessage = (status.status).toString();

            if (statusMessage == "available")
                statusField.innerHTML = "<span style=\"background-color:green;color:white\">User name is " + statusMessage +"</span>";
            else
                statusField.innerHTML = "<span style=\"background-color:red;color:white;font-weight:bold\">User name is " + statusMessage +"</span>";
                
        },
        error: function()
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Error... " + response, type: "error", duration: 0}]);
        }
    });

} //End of function userusernameAvaillability()

function navigateTouser_(userId, position)
{
    dojo.xhrGet(
    {
        url: "servlets/userManager?operationType=findByPK&userId=" + userId,
        handleAs: "text",
        load: function (response)
        {
            var user = dojo.fromJson(response);

            if (user.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }

            populate_user_widgets(user, position);
            
            dijit.byId("userFindDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Error...: " + response, type: "error", duration: 0}]);
        }
    });
} //End of method navigateTouser_

