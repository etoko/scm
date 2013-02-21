/* 
 * Script handles all operations on the In-Patients form
 */

/**
 * Function creates a session environment for adding a new In-Patient.
 */
function newPatient()
{
    var patientId = dijit.byId("PatientId");
    var patientName = dojo.byId("PatientNameDisplay");
    var patientIdField = dojo.byId("PatientIdHidden");
    var patientType = dijit.byId("PatientType");
    var patientWard = dijit.byId("PatientWard");
    var patientBed = dijit.byId("PatientBed");
    var patientAdmittedBy = dojo.byId("patientAdmittedBy");
    var patientAdmittedDate = dojo.byId("patientAdmittedDate");
    var patientUpdatedBy = dojo.byId("patientUpdatedBy");
    var patientUpdatedDate = dojo.byId("patientUpdatedDate");
    var patientDischargedDate = dojo.byId("patientDischargedDate");
    var patientNotes = dijit.byId("PatientNotes");
    var patientStatus = dijit.byId("PatientStatus");
    var grid = dijit.byId("patientDetailsGrid");

    dojo.xhrGet(
    {
        url: "servlets/patientManager?operationType=add",
        load: function()
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Enter Patient Info ", type: "info", duration: 20000}]);
            patientId.setValue(" ");
            patientName.innerHTML = "Click the Choose button to select the new patient name";
            patientIdField.innerHTML = "";
            patientType.setValue("");
            patientWard.setValue("");
            patientBed.setValue("");
            patientAdmittedBy.innerHTML = "";
            patientAdmittedDate.innerHTML = "";
            patientUpdatedBy.innerHTML = "";
            patientUpdatedDate.innerHTML = "";
            patientDischargedDate.innerHTML = "";
            patientNotes.setValue("");
            patientStatus.setValue("");

            var store = new dojo.data.ItemFileWriteStore({url: "resources/json/patientDetails.json"})
            grid.setStore(store);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function newPatient

/**
 * Function saves an In-Patient's data to the database.
 */
function savePatient()
{
    var patientId = dojo.byId("PatientIdHidden").innerHTML;

    if (patientId == '-1')
    {
        var message = dojo.byId("InformationMessage");
        message.innerHTML = "Please select the patient whose particulars are to be saved";
        dijit.byId("InformationMessageDialog").show();

        return;
    }

    if (dojo.byId("PatientIdHidden") == "-1")
    {
        dijit.byId("InformationMessageDialog").show();
        return;
    }

    var patientIdHidden = dojo.byId("PatientIdHidden").innerHTML;
    
    var returnedValue = null;

    var formToValidate = dijit.byId("PatientForm");
    dijit.byId("PatientType").focus();

    if (formToValidate.validate())
    {
        dojo.publish("/saving",[{message: "<font size='2'><b>Saving...", type: "info", duration: 5000}]);

        dojo.xhrPost(
        {
            form: "PatientForm",
            url: "servlets/patientManager?operationType=save&PatientId="+ patientId,
            load: function(response)
            {
                var results = dojo.fromJson(response);

                dijit.byId("PatientId").setValue(results.patientId);

                dojo.publish("/saved",[{message: "<font size='2'><b>...Saved", type: "info", duration: 10000}]);
            },
            error: function (response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>...encountered an error: " + response, type: "error", duration: 5000}]);
            }
        });
    }
} //End of function savePatient

/**
 *Function saves a patient's health particulars
 */
function savePatientDetail()
{
    var patientId = dijit.byId("PatientId").getValue();
    var date = dojo.byId("patientDetailsDate").value;
    var detailId = dojo.byId("patientDetailDetailId").innerHTML;
    var counter = dojo.byId("patientDetailCounter").innerHTML;
    var weight = dijit.byId("patientDetailsWeight").getValue();
    var temperature = dijit.byId("patientDetailsTemperature").getValue();
    var pulse = dijit.byId("patientDetailsPulse").getValue();
    var observation = dijit.byId("patientDetailsObservation").getValue();
    var deduction = dijit.byId("patientDetailsDeduction").getValue();
    var rowIndex = dojo.byId("patientDetailRowIndex").innerHTML;
    
    var parameters = "patientId=" + patientId + "&weight=" + weight + 
        "&temperature=" + temperature + "&pulse=" + pulse + "&observation=" +
        observation + "&deduction=" + deduction + "&date=" + date +
        "&detailId=" + detailId;
    
    var formToValidate = dijit.byId("patientDetailForm");
    detailId = Math.abs(detailId);

    if (formToValidate.validate())
    {
        dojo.xhrGet(
        {
            url: "servlets/patientDetailManager?operationType=save&" + parameters,
            load: function(response)
            {
                var detail = dojo.fromJson(response);
                
                var grid = dijit.byId("patientDetailsGrid");
                var store = grid.store;

                if (detailId == -1)
                {
                    var newPatientDetail =
                        {
                            detailId: detail.detailId, counter: counter,
                            date: detail.date, weight: detail.weight, temp: detail.temp,
                            pulse: detail.pulse, observation: detail.observation,
                            deduction: detail.deduction
                        };
                    
                    grid.store.newItem(newPatientDetail);
                }
                else
                {
                    var item = grid.getItem(rowIndex);
                    
                    grid.store.setValue(item, "detailId", detail.detailId);
                    grid.store.setValue(item, "counter", counter);
                    grid.store.setValue(item, "date", detail.date);
                    grid.store.setValue(item, "weight", detail.weight);
                    grid.store.setValue(item, "temp", detail.temp);
                    grid.store.setValue(item, "pulse", detail.pulse);
                    grid.store.setValue(item, "observation", detail.observation);
                    grid.store.setValue(item, "deduction", detail.deduction);
                }

                dojo.byId("patientDetailDetailId").innerHTML = -1;
                dijit.byId("patientDetailDialog").hide();
            },
            error: function(response)
            {
                alert(response);
                return;
            }
        });
    }
}//End of function savePatientDetail()

/**
 * Function disables or enables the patient ward and bed details depending on
 * whether they are In-Patients or Out-Patients
 */
function changeOfPatientType()
{
    var patientType = dijit.byId("PatientType").getValue();
    var inPatientWard = dijit.byId("PatientWard");
    var inPatientBed = dijit.byId("PatientBed");

    if (patientType == "OUT-PATIENT")
    {
        inPatientWard.disabled = true;
        inPatientBed.disabled = true;
    }
    else
    {
        inPatientWard.disabled = false;
        inPatientBed.disabled = false;
    }
}

/**
 *Function searches for patients whose lastname is similar to the entered
 *keywords.
 */
function findPatient()
{
    var keywords = dijit.byId("PatientNamekeywords").getValue();
    keywords = dojo.trim(keywords);
    
    if (keywords.length < 2)
    {
        dojo.byId("PatientSearchResults").innerHTML = "<img src='resources/images/dialog-warning.png'> Enter a minimum of two" +
            " letters in the name";
        return;
    }

    dojo.byId("PatientSearchResults").innerHTML = "<img src='resources/images/loading.gif'> Searching...";
    
    dojo.xhrGet(
    {
        url: "servlets/patientManager?operationType=getNames&keywords=" + keywords,
        load: function(response)
        {
            var data = dojo.fromJson(response);
            var patientStore = new dojo.data.ItemFileWriteStore({data: data});
            var grid = dijit.byId("patientSearchGrid");
            var results = data.results;

            if (results == "zero")
            {
                dojo.byId("PatientSearchResults").innerHTML =
                    "Found 0 patients with the name containing the keywords '" +
                keywords + "'";

                patientStore = new dojo.data.ItemFileWriteStore({url: "resources/json/emptyConsultList.json"});
                //grid.setStore(patientStore);
                return;
            }

            dojo.byId("PatientSearchResults").innerHTML = "Found " +
                data.results + " patient(s) with the name containing the keywords '" +
                keywords + "'";
            
            grid.setStore(patientStore);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function findPatient

/**
 *Function searches for patients whose lastname is similar to the entered
 *keywords.
 */
function findPatientsByDept()
{
    activatePatientByDeptDateControls();
    
    var formToValidate = dijit.byId("PatientByDept.Form");
    //alert("Here");
    if (formToValidate.validate())
    {
        var department = dijit.byId("PatientByDeptDept").getValue();
        var status = dijit.byId("PatientByDeptStatus").getValue();

        dojo.byId("PatientByDept.SearchResults").innerHTML = "<img src='resources/images/loading.gif'> Searching...";
        //alert("Here");
        dojo.xhrGet(
        {
            url: "servlets/patientByDeptManager?operationType=getNames&output=JSON&department=" + department + "&status=" + status,
            load: function(response)
            {
                var data = dojo.fromJson(response);
                var patientStore = new dojo.data.ItemFileWriteStore({data: data});
                var grid = dijit.byId("PatientByDept.SearchGrid");
                var results = data.results;

                if (results == "zero")
                {
                    dojo.byId("PatientByDept.SearchResults").innerHTML =
                        "Found 0 patients ";

                    patientStore = new dojo.data.ItemFileWriteStore({url: "resources/json/emptyConsultList.json"});
                    //grid.setStore(patientStore);
                    return;
                }

                dojo.byId("PatientByDept.SearchResults").innerHTML = "Found " +
                    data.results + " patient(s)";

                grid.setStore(patientStore);
            },
            error: function(response)
            {
                dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
            }
        });
    } //End of outer if statement block
} //End of function findPatient

/**
 * Function activates the date controls depending on which status list item of
 * the patient is selected.
 */
function activatePatientByDeptDateControls()
{
    var beginDate = dijit.byId("PatientsByDept.BeginDate");
    var endDate = dijit.byId("PatientsByDept.EndDate");
    var status = dijit.byId("PatientByDeptStatus").getValue();
    var dept = dijit.byId("PatientByDeptDept").getValue();

    status = status.toString();
    
    if (status == "RECEIVING TREATMENT")
    {
        beginDate.disabled = true;
        endDate.disabled = true;
    } //End if statement block
    else
    {
        beginDate.disabled = false;
        endDate.disabled = false;
    } //End of else statement block
} //End of function activatePatientByDeptDateControls

function navigateToPatient(searchTerms, searchName)
{
    var patientId = dijit.byId("PatientId");
    var patientName = dojo.byId("PatientNameDisplay");
    var patientIdField = dojo.byId("PatientIdHidden");
    var patientType = dijit.byId("PatientType");
    var patientWard = dojo.byId("PatientWard");
    var patientBed = dijit.byId("PatientBed");
    var patientAdmittedBy = dojo.byId("patientAdmittedBy");
    var patientAdmittedDate = dojo.byId("patientAdmittedDate");
    var patientUpdatedBy = dojo.byId("patientUpdatedBy");
    var patientUpdatedDate = dojo.byId("patientUpdatedDate");
    var patientDischargedDate = dojo.byId("patientDischargedDate");
    var patientNotes = dijit.byId("PatientNotes");
    var patientStatus = dijit.byId("PatientStatus");
    var grid = dijit.byId("patientDetailsGrid");

    dojo.xhrGet(
    {
        url: "servlets/patientManager?operationType=findByPK&output=JSON&startPosition=0&patientId=" + searchTerms,
        handleAs: "text",
        load: function(response)
        {
            var results = dojo.fromJson(response);
            
            patientId.setValue(results.patientId);
            patientName.innerHTML = searchName;
            patientIdField.innerHTML = results.patientId;
            patientAdmittedBy.innerHTML = results.admittedBy;
            patientAdmittedDate.innerHTML = results.admissionDate;
            patientUpdatedBy.innerHTML = results.updatedBy;
            patientUpdatedDate.innerHTML = results.updatedDate;
            patientDischargedDate.innerHTML = results.dischargedDate;
            patientType.setValue(results.patientType);
            patientWard.value = (results.wardno);
            patientBed.setValue(results.bedno);
            patientNotes.setValue(results.notes);
            patientStatus.setValue(results.status);
            dojo.byId("Patient.DetailNavigationPosition").innerHTML = 0;

            var store = new dojo.data.ItemFileWriteStore({data: results});
            grid.setStore(store);

            var size = Math.abs(results.size);
            var navigator = dojo.byId("Patient.DetailNavigator");
            var list = "Navigator: ";

            if (size > 10)
            {
                var j = 1;
                for (var i = 0; i <= size; i = i+10)
                {
                    list += "<a href=\"javascript:navigatePatientDetails(" + i + ")\">" + (j++) + "</a>  &raquo; ";
                }
            }//End of if statement block

            navigator.innerHTML = list;
            
            dijit.byId("PatientFindDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of method navigateToPatient

function navigatePatientDetails(startPosition)
{
    dojo.byId("Patient.DetailNavigationPosition").innerHTML = startPosition;
    dojo.publish("/saving",[{message: "<font size='2'><b>Loading...", type: "info", duration: 2000}]);

    var patientId = dijit.byId("PatientId").getValue();
    var grid = dijit.byId("patientDetailsGrid");

    dojo.xhrGet(
    {
        url: "servlets/patientManager?operationType=findByPK&output=JSON&startPosition=" +
             startPosition + "&patientId=" + patientId,
        handleAs: "text",
        load: function(response)
        {
            var results = dojo.fromJson(response);
    
            var store = new dojo.data.ItemFileWriteStore({data: results});
            grid.setStore(store);

            dojo.publish("/saved",[{message: "<font size='2'><b>...Loaded", type: "info", duration: 3000}]);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of method navigateToPatient

/**
 * Function deletes a patient from the system
 */
function deletePatient()
{
    dijit.byId("PatientType").setValue("OUT-PATIENT");
}

function patientNameDisplay()
{
    dojo.byId("PatientNameDisplay").innerHTML = dojo.byId("PatientNameHidden").innerHTML;
}

function refreshPatientDetails()
{
    var patientId = dijit.byId("PatientId").getValue();
    var grid = dijit.byId("patientDetailsGrid");
    var position = dojo.byId("Patient.DetailNavigationPosition").innerHTML;

    if (patientId.length < 1)
    {
        var message = dojo.byId("InformationMessage");
        message.innerHTML = "Please select the patient whose particulars are to be refreshed";
        dijit.byId("InformationMessageDialog").show();

        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/patientManager?operationType=findByPK&output=JSON&patientId=" + patientId + "&startPosition=" + position,
        handleAs: "text",
        load: function(response)
        {
            var results = dojo.fromJson(response);

            var store = new dojo.data.ItemFileWriteStore({data: results});
            grid.setStore(store);

            var size = Math.abs(results.size);
            var navigator = dojo.byId("Patient.DetailNavigator");
            var list = "Navigator: ";

            if (size > 10)
            {
                var j = 1;
                for (var i = 0; i <= size; i = i+10)
                {
                    list += "<a href=\"javascript:navigatePatientDetails(" + i + ")\">" + (j++) + "</a> &raquo; ";
                }
            }//End of if statement block

            navigator.innerHTML = list;

            dijit.byId("PatientFindDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Encountered an error: " + response, type: "error", duration: 5000}]);
        }
    });
}
