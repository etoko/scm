/* 
 * Handles all operations of Members
 */

/**
 *Function invokes a servlet through AJAX that creates an environment for the 
 *addition of a new member.
 */
function newMember()
{
    dijit.byId("MemberId").setValue("");
    dijit.byId("MemberFirstname").setValue("");
    dijit.byId("MemberLastname").setValue("");
    dijit.byId("MemberOthernames").setValue("");
    dijit.byId("MemberCode").setValue("");
    dijit.byId("MemberNotes").setValue("");
    dojo.byId("MemberOrganisationName").value = "";

    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=add",
        error: function(response)
        {
            dojo.publish("/saved", [{message: "Experienced errors: " + response, type: "error", duration: 0}]);
        }
    });
} //End of function newMember

function saveMember()
{
    var memberForm = dijit.byId("MemberForm");

    if (memberForm.validate())
    {
        dojo.publish("/saving", [{message: "<font-size='2'><b>Saving...: " , type: "info", duration: 5000}]);

        dojo.xhrPost(
        {
            url: "servlets/memberManager?operationType=save",
            form: "MemberForm",
            load: function (response)
            {
//                var feedback = dojo.fromJson(response);
//
//                try
//                {
//                    if (feedback.saveStatus == "unknownMember")
//                    {
//                        var dialog = dijit.byId("InformationMessageDialog");
//                        dojo.byId("InformationMessageInformation").innerHTML =
//                            "Unknown Member";
//                        dialog.show();
//                        return;
//                    }
//                }
//                catch (e)
//                {
//                    alert(e);
//                }
                
                dojo.publish("/saved", [{message: "<font-size='2'><b>...Saved " + response, type: "info", duration: 10000}]);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font-size='2'><b>...Failed: " + response, type: "error", duration: 5000}]);
            }
        });
    }//End of outer if statement block
}//End of function saveMember

/**
 *Function invokes servlet that continues the sequence to delete/ remove a member
 *of Member from the persistence layer.
 */
function deleteMember()
{
    dijit.byId("MemberDeleteDialog").hide();
    
    dojo.publish("/saving", [{message: "<font-size='2'><b>Deleting...", type: "info", duration: 15}]);
    
    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=delete",
        load: function(response)
        {
            dojo.publish("/saved", [{message: "<font-size='2'><b>...deleted: " + response, type: "info", duration: 15}]);
            nextMember();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font-size='2'><b>...Failed: " + response, type: "error", duration: 15}]);
        }
    });

    dijit.byId("MemberDeleteDialog").hide();
} //End of function removeMember

/**
 * Navigates to the first member of Member
 */
function firstMember()
{
    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dijit.byId("MemberOrganisationName");

    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=first",
        handleAs: "text",
        load: function (response)
        {
            var member = dojo.fromJson(response);

            if (member.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }

            memberId.setValue(member.memberId);
            firstname.setValue(member.firstname);
            lastname.setValue(member.lastname);
            othernames.setValue(member.othernames);
            memberCode.setValue(member.code);
            //organisation.setValue(member.organisation);
            
            dojo.cookie("currentMember", 0, {expires: 5});
            memberNavigator();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font-size='2'><b>Error...: " + response, type: "error", duration: 0}]);
        }
    });
} //End of function firstMember

/**
 * Navigates to the previous member of Member
 */
function previousMember()
{
    getMemberNumber();
    var MemberNumber = dojo.cookie("MemberNumber");
    var Memberid = dojo.cookie("currentMember");

    if ((Memberid == undefined))
    {
        Memberid = 0;
    }

    MemberNumber = Math.abs(MemberNumber);
    Memberid = Math.abs(Memberid);

    Memberid = Memberid - 1;

    if (Memberid < 0)
    {
        Memberid = 0;
        dijit.byId("MemberBORDialog").show();
        firstMember();
        return;
    }

    if (Memberid >= MemberNumber)
    {
        dijit.byId("MemberBORDialog").show();
        lastMember();
        return;
    }

    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dijit.byId("MemberOrganisationName");


      dojo.xhrGet(
      {
            url: "servlets/memberManager?operationType=next&memberId="+Memberid,
            handleAs: "text",
            load: function(response)
            {
                var member = dojo.fromJson(response);

                if (member.status == "logout")
                {
                    window.location = "login.jsp";
                    return;
                }


                memberId.setValue(member.memberId);
            firstname.setValue(member.firstname);
            lastname.setValue(member.lastname);
            othernames.setValue(member.othernames);
            memberCode.setValue(member.code);

                dojo.cookie("currentMember", Memberid, {expires: 5});
                memberNavigator();
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "Error...: " + response, type: "error", duration: 0}]);
            }
        });
} //End of function previousMember

/**
 * Navigates to the next member of Member
 */
function nextMember()
{
    getMemberNumber();
    var MemberNumber = dojo.cookie("MemberNumber");
    var currentMember = dojo.cookie("currentMember");

    if ((currentMember == undefined))
    {
        currentMember = 0;
    }

    MemberNumber = Math.abs(MemberNumber);
    currentMember = Math.abs(currentMember);
    
    if (currentMember < 0)
    {
        currentMember = 0;
    }

    currentMember = currentMember + 1;
    
    if (currentMember >= MemberNumber)
    {
        dijit.byId("MemberEORDialog").show();
        return;
    }
    
    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dijit.byId("MemberOrganisationName");


      dojo.xhrGet(
      {
            url: "servlets/memberManager?operationType=next&memberId=" + currentMember,
            handleAs: "text",
            load: function(response)
            {
                var member = dojo.fromJson(response);

                if (member.status == "logout")
                {
                    window.location = "login.jsp";
                    return;
                }


                memberId.setValue(member.memberId);
            firstname.setValue(member.firstname);
            lastname.setValue(member.lastname);
            othernames.setValue(member.othernames);
            memberCode.setValue(member.code);

                dojo.cookie("currentMember", currentMember, {expires: 5});
                memberNavigator();
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "Error...: " + response, type: "error", duration: 0}]);
            }
        });
} //End of function nextMember

/**
 * Navigates to the last member of Member
 */
function lastMember()
{
    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dijit.byId("MemberOrganisationName");

    var Memberid = dojo.cookie("currentMember");
    getMemberNumber();
    var MemberNumber = dojo.cookie("MemberNumber");
    MemberNumber = Math.abs(MemberNumber);
    MemberNumber = MemberNumber - 1;
    Memberid = MemberNumber;
    
    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=last",
        handleAs: "text",
        load: function (response)
        {
            var member = dojo.fromJson(response);

            if (member.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }


            memberId.setValue(member.memberId);
            firstname.setValue(member.firstname);
            lastname.setValue(member.lastname);
            othernames.setValue(member.othernames);
            memberCode.setValue(member.code);
            
            dojo.cookie("currentMember", Memberid, {expires: 5});
            memberNavigator();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "Error...: " + response, type: "error", duration: 0}]);
        }
    });
} //End of function lastMember

/**
 *Function searches for Member entities with the specified keywords.
 */
function findMember()
{
    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dojo.byId("MemberOrganisationName");
    var gender = dijit.byId("MemberGender");

    var keywords = dijit.byId("MemberNamekeywords").getValue();
    //var MemberSearchResults = dojo.byId("MemberSearchResults");
    
    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=findByPK&keywords=" + keywords,
        handleAs: "text",
        load: function (response)
        {
            var member = dojo.fromJson(response);

            if (member.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }

//            alert(member.Results);
//            return;
            if (member.Results == "zero")
            {
                dojo.byId("MemberSearchResults").innerHTML = "No members with ID: " + keywords;
                return;
            }
            
            memberId.setValue(member.memberId);
            firstname.setValue(member.firstname);
            lastname.setValue(member.lastname);
            othernames.setValue(member.othernames);
            memberCode.setValue(member.code);
            gender.setValue(member.gender);
            organisation.value = member.organisation;
            
            dijit.byId("MemberFindDialog").hide();
            //MemberSearchResults.innerHTML = response;
        },
        error: function (response)
        {
            MemberSearchResults.innerHTML = response + " Did not find ";
        }
    });
} //End of function find

/**
 * Retrieves the number of Member in the persistence context
 */
function getMemberNumber()
{
    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=number",
        handleAs: "text",
        load: function(response)
        {
            var MemberNumber = dojo.fromJson(response);
            dojo.cookie("MemberNumber", MemberNumber.size, {expires: 5});
        },
        error: function(response)
        {
            alert(response);
        }
    });
}//getMemberNumber

function getMemberPatientHistory()
{
    var memberId = dijit.byId("PatientHistoryMemberId").getValue();
    var report = dojo.byId("StatusMessage");
    var memberPicture = dojo.byId("PatientHistory.MemberImage");
    var memberName = dijit.byId("PatientHistory.Name");
    var memberGender = dijit.byId("PatientHistory.Gender");
    var memberOrganisation = dijit.byId("PatientHistory.Organisation");
    var memberPatientTimes = dijit.byId("PatientHistory.NumberOfTimes");


    if (dijit.byId("PatientHistoryMemberId").validate())
    {
        dojo.publish("/saving",[{message: "<font size='2'><b>Loading Patient History", type: "info", duration: 5000}]);
        report.innerHTML = "Searching ...";

        dojo.xhrGet(
        {
            url: "servlets/patientManager?operationType=history&memberId=" + memberId,
            handleAs: "text",
            load: function (response)
            {
                var data = dojo.fromJson(response);

                var grid = dijit.byId("patientHistoryGrid");
                var store = new dojo.data.ItemFileWriteStore({data: data});

                dojo.publish("/saved",[{message: "<font size='2'><b>Loaded Patient History", type: "info", duration: 10000}]);

                if (data.status == "true")
                {
                    //report.innerHTML = ;
                    statusMessageDisplays("", "... Found member with # " + memberId)
                     memberName.setValue(data.patientName);
                     memberGender.setValue(data.Gender);
                     memberOrganisation.setValue(data.Organisation);
                     memberPatientTimes.setValue(data.NoOfTimes);

                    memberPicture.innerHTML = "<img src='servlets/viewMember?memberId=" + memberId + "' height='130px' />";

                    grid.setStore(store);
                }
                else if (data.status == "null")
                {
                    report.innerHTML = "No member with #" + memberId;
                    memberName.setValue("");
                     memberGender.setValue("");
                     memberOrganisation.setValue("");
                     memberPatientTimes.setValue("");

                    memberPicture.innerHTML = "";

                    var newStore = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
                    grid.setStore(newStore);
                }
                else
                {
                    var newStore = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
                    grid.setStore(newStore);
                }
            },
            error: function(response)
            {
              dojo.publish("/saved",[{message: "<font size='2'><b>Member Not Found", type: "error", duration: 0}]);
              report.innerHTML = "<b>... Not Found</b>" + response;
            }
        });
    }
} //End of function getMemberPatientHistory

function navigateToMember(MemberId, position)
{
    var memberId = dijit.byId("MemberId");
    var firstname = dijit.byId("MemberFirstname");
    var lastname = dijit.byId("MemberLastname");
    var othernames = dijit.byId("MemberOthernames");
    var memberCode = dijit.byId("MemberCode");
    var organisation = dijit.byId("MemberOrganisationName");
    var statusField = dojo.byId("MemberIdAvailabilityStatus");

    dojo.xhrGet(
    {
        url: "servlets/memberManager?operationType=findByPK&MemberId=" + MemberId,
        handleAs: "text",
        load: function (response)
        {
            var Member = dojo.fromJson(response);

            if (Member.status == "logout")
            {
                window.location = "login.jsp";
                return;
            }

            memberId.setValue(Member.memberId);
            firstname.setValue(Member.firstname);
            lastname.setValue(Member.lastname);
            othernames.setValue(Member.othernames);
            memberCode.setValue(Member.memberCode);
            organisation.setValue(Member.group);

            dojo.cookie("currentMember", position, {expires: 5});
            MemberNavigator();
            dijit.byId("MemberFindDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "Error...: " + response, type: "error", duration: 0}]);
        }
    });
} //End of method navigateToMember

/**
 * Function indicates the navigation position of the Member entity in the list of
 * all Member.
 */
function memberNavigator()
{
    var navigator = dojo.byId("MemberNavigator");
    getMemberNumber();

    var MemberNumber = dojo.cookie("MemberNumber");
    var currentMember = dojo.cookie("currentMember");
    currentMember = Math.abs(currentMember);

    navigator.innerHTML = (currentMember + 1) + " of " + MemberNumber;
} //End of function MemberNavigator