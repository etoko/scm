/*********************************************************
 * Script handles all operations regarding prescriptions.
 ********************************************************/

/**
 *Function creates an environment for creating a new prescription.
 */
function newPrescription()
{
    var prescriptionId = dijit.byId("PrescriptionNo");
    var prescriptionPatient = dojo.byId("PrescriptionPatient");
    var prescriptionStaff = dojo.byId("PrescriptionsPrescribedBy");
    var prescriptionDate = dojo.byId("PrescriptionsPrescriptionDate");
    var prescriptionNotes = dijit.byId("PrescriptionNotes");

    prescriptionId.setValue("");
    prescriptionPatient.value = "";
    prescriptionNotes.setValue("");
    prescriptionStaff.innerHTML = "";
    prescriptionDate.innerHTML = new Date();

    resetPrescriptionDetails();

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=add",
        load: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>New Prescription", type: "info", duration: 20000}]);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of function newPrescription

/**
 * Function saves a new prescription into the system
 */
function savePrescription()
{
    var grid = dijit.byId("PrescriptionsDetailsTable");
    var patientId = dijit.byId("PrescriptionPatient").getValue();
    var notes = dijit.byId("PrescriptionNotes").getValue();

    var value;
    var data = "";
    var i = 0;
    i = Math.abs(i);
    var itemName="itemName";
    var itemQuantity="itemQuantity";
    var returnedValue = null;

    var formToValidate = dijit.byId("PrescriptionsForm");

    if (formToValidate.validate())
    {dojo.publish("/saving",[{message: "<font size='2'><b>Saving ...", type: "info", duration: 4000}]);

    for (i = 0; i < 9; i++)
    {
        if (grid.getItem(i) == null)
        {
            break;
        }
        
        returnedValue = grid.store.getValue(grid.getItem(i), "drug");
        if ((returnedValue == "") || (returnedValue == null))
        {
            continue;
        }
        
        value = (itemName+i) + "=" + returnedValue;
        value = value + "&itemQuantity" + i +"=" + grid.store.getValue(grid.getItem(i), "dosage");
        data = data + "&" + value;
    }

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=save&PrescriptionPatient=" + patientId + "&PrescriptionNotes=" + notes + data,
        load: function (response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>...Saved", type: "info", duration: 5000}]);
        },
        error: function (response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }
    });
    }
} //End of function savePrescription

function deletePrescription()
{
    var id = dijit.byId("PrescriptionNo").getValue();
    dojo.publish("/saving", [{message: "<font size='2'><b>Deleting...", type:"info", duration: 5000}])
    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=delete&id=" + id,
        load: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>...Deleted", type:"info", duration: 10000}]);
            nextPrescription();
            dijit.byId("PrescriptionsDeleteDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced problems while deleting " +
                    "prescription with Id: " + id, type:"error", duration: 10000}])
        }
    });
} //End of function deletePrescription

function firstPrescription()
{
    var position = 0;

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=first",
        load: function(response)
        {
            var prescription = dojo.fromJson(response);

            populatePrescriptionControls(prescription, position);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }

    });
} //End of method firstPrescription

function previousPrescription()
{
    var position = dojo.cookie("PrescriptionPosition");

    if ((position == undefined) || (position == null))
    {
        firstPrescription();
        return;
    }

    position = Math.abs(position);
    position = position - 1;

    if (position < 0)
    {
        firstPrescription();

        var navigationInformation =  dojo.byId("NavigationInformation");
        navigationInformation.innerHTML = "You have reached the first prescription";
        dijit.byId("NavigationDialog").show();

         return;
    }

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var prescription = dojo.fromJson(response);

            if (prescription.status == "logout")
            {
                document.location = "login.jsp";
            }

            populatePrescriptionControls(prescription, position);
            
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }

    });
} //End of method firstPrescription

function nextPrescription()
{
    var position = dojo.cookie("PrescriptionPosition");

    if ((position == undefined) || (position == null))
    {
        firstPrescription();
        return;
    }

    var size = dojo.cookie("PrescriptionNumber");

    if ((size == undefined) || (size == null))
    {
        lastPrescription();
        return;
    }

    size = Math.abs(size);

    position = Math.abs(position);
    position = position + 1;

    if (position >= size)
    {
        position = (size - 1);
        lastPrescription();
        var navigationInformation =  dojo.byId("NavigationInformation");
        navigationInformation.innerHTML = "You have reached the last prescription";
        dijit.byId("NavigationDialog").show();

        return;
    }

    if (position < 0)
    {
         firstPrescription();
         return;
    }

    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=navigate&position=" + position,
        load: function(response)
        {
            var prescription = dojo.fromJson(response);

            populatePrescriptionControls(prescription, position);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }

    });
} //End of method firstPrescription

function lastPrescription()
{
    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=last",
        load: function(response)
        {
            var prescription = dojo.fromJson(response);

            if (prescription.status == "logout")
            {
                document.location = "login.jsp";
            }
            var position = Math.abs(prescription.size) - 1;
            populatePrescriptionControls(prescription, position);
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }
    });
} //End of method lastPrescription

function resetPrescriptionDetails()
{
    var grid = dijit.byId("PrescriptionsDetailsTable");
    var store = new dojo.data.ItemFileWriteStore({url: "resources/json/prescriptions.json"});
    grid.setStore(store);
}

function prescriptionPrint()
{
    
}

function navigateToPrescription()
{
    var keywords = dijit.byId("PrescriptionsKeywords").getValue();
    dojo.byId("PrescriptionsSearchResults").innerHTML = "<b>Searching...";
    
    var position = dojo.cookie("PrescriptionPosition");

    if ((position == undefined) || (position == null))
        position = 0;
    
    if (position.toString() == "NaN")
    {
        position = 0;
    }
    
    dojo.xhrGet(
    {
        url: "servlets/prescriptionManager?operationType=findByPK&output=JSON&keywords=" + keywords,
        load: function(response)
        {
            var prescription = dojo.fromJson(response);

            if (prescription.PrescriptionId == "none")
            {
                dojo.byId("PrescriptionsSearchResults").innerHTML =
                    "<b>Did not find prescriptions with Id: " + keywords;
                return;
            }

            position = Math.abs(position);
            populatePrescriptionControls(prescription, position);

            dojo.byId("PrescriptionsSearchResults").innerHTML = "";
            dijit.byId("PrescriptionsFindDialog").hide();
        },
        error: function(response)
        {
            dojo.publish("/saved",[{message: "<font size='2'><b>Error: " + response, type: "error", duration: 5000}]);
        }
    });
}//End of function navigateToPrescription

function populatePrescriptionControls(prescription, position)
{
    if ((prescription.PrescriptionId).toString() == "null")
    {
        var message = "There are no prescriptions to display";
        dojo.byId("InformationMessage").innerHTML = message;
        dijit.byId("InformationMessageDialog").show();

        return;
    }

    var id = dijit.byId("PrescriptionNo");
    var patient = dojo.byId("PrescriptionPatient");
    var status = dojo.byId("Prescription.Status");
    var prescribedBy = dijit.byId("PrescriptionsPrescribedBy");
    var date = dijit.byId("PrescriptionsPrescriptionDate");
    var notes = dijit.byId("PrescriptionNotes");
    var grid = dijit.byId("PrescriptionsDetailsTable");

    id.setValue(prescription.PrescriptionId);
    status.innerHTML = prescription.status;
    patient.value = prescription.Patient;
    prescribedBy.setValue(prescription.staff);
    date.setValue(prescription.date);
    notes.setValue(prescription.notes);

    var store = new dojo.data.ItemFileWriteStore({data: prescription});
    grid.setStore(store);
    var navigator = dojo.byId("PrescriptionNavigator");
    var size = prescription.size;
    navigator.innerHTML = (position + 1) + " of " + size;
    dojo.cookie("PrescriptionPosition", position, {expires: 5});
    dojo.cookie("PrescriptionNumber", size, {expires: 5});
} //End of function populatePrescriptionControls
