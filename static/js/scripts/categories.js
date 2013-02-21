/* 
 * Script handles all operations on Categories such as addition of new Categories
 * searching for categories, updating existing categories and navigating through
 * categories
 */

/**
 * Function creates an environment of a new category
 */
function newCategory()
{
    
    var id = dijit.byId("Categories.Id");
    var name = dijit.byId("Categories.Name");
    var notes = dijit.byId("Categories.Notes");
    var grid = dijit.byId("Categories.Details");
    var navigator = dojo.byId("Categories.Navigator");
    var newId = dojo.byId("Categories.newId");
    
    newId.innerHTML = "0";
    id.setValue("0");
    name.setValue("");
    notes.setValue("");
    navigator.innerHTML = " # of #";
    
    var store = new dojo.data.ItemFileWriteStore({url: "resources/json/genericEmptyjson.json"});
    grid.setStore(store);
    
    dojo.publish("/saving", [{message: "<font size='2'><b>Enter new Category",
        type:"info", duration:15000}]);
} //End of function newCategory

/**
 * Function saves/ updates a Category
 */
function saveCategory()
{
    var formToValidate = dijit.byId("Categories.Form");

    if (formToValidate.validate())
    {
        dojo.publish("/saving", [{message: "<font size='2'><b>Saving...",
        type:"info", duration:5000}]);

        dojo.xhrPost(
        {
            form: "Categories.Form",
            url: "servlets/categoryManager?operationType=save",
            load: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>...Saved",
                    type:"info", duration:10000}]);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: 
                    "<font size='2'><b>...Experienced errors",
                    type:"error", duration:10000}]);
            }
        });
    } //End of if statement block
} //End of function saveCategory

/**
 * Function navigates to the first category
 */
function firstCategory()
{
    var position = 0;

    dojo.xhrGet(
    {
        url: "servlets/categoryManager?operationType=first",
        load: function(response)
        {
            var category = dojo.fromJson(response);
            populateCategoryControls(category, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced " +
                        "a problem" + response,
                    type: "error", duration: 15000}])
        }
    });
} //End of function firstCategory

/**
 * Function navigates to the previous Category
 */
function previousCategory()
{
    var position = dojo.cookie("CurrentCategory");

    if ((position == null) || (position == undefined))
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position - 1;

    if (position < 0)
    {
        position = 0;

        firstCategory();
        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the first Category!";
        dijit.byId("NavigationDialog").show();

        return;
    } //End of

    dojo.xhrGet(
    {
        url: "servlets/categoryManager?operationType=previous&position=" + position,
        load: function(response)
            {
                var category = dojo.fromJson(response);

                populateCategoryControls(category, position);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>Experienced an error: " + response, type: "error", duration: 15000}]);
            }
    });
} //End of function previousCategory

/**
 * Function to navigate to the nextCategory
 */
function nextCategory()
{
    var position = dojo.cookie("CurrentCategory");

    if ((position == null) || (position == undefined))
    {
        position = 0;
    }

    position = Math.abs(position);
    position = position + 1;

    var size = dojo.cookie("CategorySize");
    size = Math.abs(size);

    if (size <= position)
    {
        lastCategory();

        dojo.byId("NavigationInformation").innerHTML =
            "You have reached the last Category!";
        dijit.byId("NavigationDialog").show();

        return;
    }

    dojo.xhrGet(
    {
        url: "servlets/categoryManager?operationType=previous&position=" + position,
        load: function(response)
            {
                var category = dojo.fromJson(response);

                populateCategoryControls(category, position);
            },
            error: function(response)
            {
                dojo.publish("/saved", [{message: "<font size='2'><b>Experienced an error: " + response, type: "error", duration: 15000}]);
            }
    });
} //End of function nextCateogry

/**
 * Function navigates to the last category
 */
function lastCategory()
{
    var size = dojo.cookie("CategorySize");
    size = Math.abs(size);

    var position = size - 1;

    dojo.xhrGet(
    {
        url: "servlets/categoryManager?operationType=last",
        load: function(response)
        {
            var category = dojo.fromJson(response);
            populateCategoryControls(category, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced " +
                        "a problem",
                    type: "error", duration: 15000}])
        }
    });
} //End of function lastCategory

function refreshCategory()
{
    var id = dijit.byId("Categories.Id").getValue();
    var position = 0;
    dojo.xhrGet(
    {
        url: "servlets/categoryManager?operationType=find&output=JSON&categoryId=" + id,
        load: function(response)
        {
            var category = dojo.fromJson(response);
            populateCategoryControls(category, position);
        },
        error: function(response)
        {
            dojo.publish("/saved", [{message: "<font size='2'><b>Experienced " +
                        "a problem",
                    type: "error", duration: 15000}])
        }
    });
}

/**
 * Function populates categories controls in the web interface
 */
function populateCategoryControls(category, position)
{
    if (category.categoryId == 0)
    {
        dojo.byId("InformationMessage").innerHTML = "No Categories to display";
        dijit.byId("InformationMessageDialog").show();
        return;
    } //End of if statement block

    var id = dijit.byId("Categories.Id");
    var name = dijit.byId("Categories.Name");
    var notes = dijit.byId("Categories.Notes");
    var grid = dijit.byId("Categories.Details");
    var navigator = dojo.byId("Categories.Navigator");
    
    id.setValue(category.categoryId);
    name.setValue(category.name);
    notes.setValue(category.notes);

    var store = new dojo.data.ItemFileWriteStore({data: category});
    grid.setStore(store);

    var size = Math.abs(category.size);
    dojo.cookie("CurrentCategory", position, {expires: 5})
    dojo.cookie("CategorySize", size, {expires: 5})
    navigator.innerHTML = (position + 1) + " of " + size;
} //End of function populateCategoryControls
