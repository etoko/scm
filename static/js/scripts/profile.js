/* 
 * Script handles all operations of profiles.
 */

/**
 * Function updates a profile
 */
function updateProfile()
{
//    var body = dojo.byId("body");
//    dojo.query(body).style("fontSize", "80%");
//    dojo.query(body).addClass("soria");

    dojo.xhrGet(
    {
        form: "Profile.Form",
        url: "servlets/staffManager?operationType=profile",
        load: function(response)
        {
            statusMessageDisplays(null, "Successfully updated profile");
            document.location = "";
        },
        error: function(response)
        {
            statusMessageDisplays(null, "Experienced a problem while " +
                "updating your profile");
        }
    });
} //End of function updateProfile
