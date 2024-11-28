/**
 * Author: [Evan Kuczynski]
 * Date Completed: [10/27]
 * Time spent: 8 hrs
 * Description: [File contains 2 functions: one for when the submit button is clicked
 *              and another to generate the dynamic multiplication table]
 *
 * Additional notes: []
 */




$(document).ready(function () {
    // initialize jQuery Tabs
    $("#tabs").tabs();
    
    
    // initialize sliders and input binding
    $(".slider").each(function() {
        let inputId = $(this).attr("id").replace("Slider", ""); // Get the corresponding input ID

        
        // initialize sliders for the sliders 
        $(this).slider({
            min: -50, // set min 
            max: 50, // set max
            value: 0, // set the default value
            slide: function(event, ui) {
                $("#" + inputId).val(ui.value); // update the input field when the slider is moved
                updateDynamicTable(); // update the dynamic table when slider changes
            }
        });

        
        // update the slider if the input field changes
        $("#" + inputId).on("input", function() {
            let value = parseInt($(this).val()); // get value from the input field
            if (value >= -50 && value <= 50) { // check value is within range
                $("#" + inputId + "Slider").slider("value", value); // update current slider
                updateDynamicTable(); // update dynamic table when input changes
            }
        });
    });

    
    // initialize jQuery validation for the form
    $.validator.addMethod("greaterThan", function(value, element, param) {
        const target = $(param).val();
        return this.optional(element) || parseInt(value) > parseInt(target);
    }, "Value must be greater.");

    
    $("#dataForm").validate({
        // rules for column and row range, data type, and weather input is needed or not
        rules: {
            colmNumStart: { required: true, number: true, range: [-50, 50] },
            colmNumEnd: { required: true, number: true, range: [-50, 50], greaterThan: "#colmNumStart" },
            minRowValue: { required: true, number: true, range: [-50, 50] },
            maxRowValue: { required: true, number: true, range: [-50, 50], greaterThan: "#minRowValue" }
        },

        
        // get value of the column and row from the input text fields 
        submitHandler: function () {
            const colmNumStart = parseInt($('#colmNumStart').val());
            const colmNumEnd = parseInt($('#colmNumEnd').val());
            const minRowValue = parseInt($('#minRowValue').val());
            const maxRowValue = parseInt($('#maxRowValue').val());

            
            // generate the table and display it in a new tab
            addTableToTab(colmNumStart, colmNumEnd, minRowValue, maxRowValue);

            // reset the sliders and input fields to their default values after the form is submitted
            resetFormFields();
        }
    });

    
    // handle "Delete All Tabs" action
    $("#deleteAllTabs").on("click", function () {
        $("#tabList").empty();  // remove all tab labels
        $("#tabContent").empty();  // remove all tab content
        $("#tabs").tabs("refresh"); // refresh the tabs interface
    });

    
    // create the initial dynamic table when the page is loaded
    updateDynamicTable();
});


// function to update the dynamic table based on current input values
function updateDynamicTable() {
    const colmNumStart = parseInt($("#colmNumStart").val()) || 0;
    const colmNumEnd = parseInt($("#colmNumEnd").val()) || 0;
    const minRowValue = parseInt($("#minRowValue").val()) || 0;
    const maxRowValue = parseInt($("#maxRowValue").val()) || 0;

    
    // ensure valid input for a preview table, if its not show this message
    if (colmNumStart > colmNumEnd || minRowValue > maxRowValue) {
        $("#tableContainer").html("<p>Please ensure valid input ranges for a preview.</p>");
        return;
    }

    
    // generate the preview table HTML
    let tableHTML = "<table><thead><tr><th></th>";
    for (let col = colmNumStart; col <= colmNumEnd; col++) {
        tableHTML += `<th>${col}</th>`;
    }
    
    tableHTML += "</tr></thead><tbody>";
    for (let row = minRowValue; row <= maxRowValue; row++) {
        tableHTML += `<tr><th>${row}</th>`;
        for (let col = colmNumStart; col <= colmNumEnd; col++) {
            tableHTML += `<td>${row * col}</td>`;
        }
        tableHTML += "</tr>";
    }
    
    tableHTML += "</tbody></table>";
    $("#tableContainer").html(tableHTML);
}



// function to add the table to a new tab on submission
function addTableToTab(colmNumStart, colmNumEnd, minRowValue, maxRowValue) {
    const tabLabel = `Cols: ${colmNumStart}-${colmNumEnd} | Rows: ${minRowValue}-${maxRowValue}`;
    const tabId = `tab-${colmNumStart}-${colmNumEnd}-${minRowValue}-${maxRowValue}`;

    
    // check if a tab with these parameters already exists
    const tabExists = $(`#${tabId}`).length > 0;
    if (tabExists) {
        alert("A tab with these parameters already exists.");
        return;
    }

    
    // create a new tab and tab content (table)
    const newTab = $(`<li><a href="#${tabId}">${tabLabel}</a><span class="closeTab">X</span></li>`);
    const newTabContent = $(`<div id="${tabId}">${$("#tableContainer").html()}</div>`);

    
    // Append the new tab and its content to the tab container
    $("#tabList").append(newTab);
    $("#tabContent").append(newTabContent);
    $("#tabs").tabs("refresh");


    // shrink each newly added tab
    newTab.css({
        'font-size': '12px',   
        'padding': '5px 10px' 
    });
    
    
    // add functionality to close the tab when the close button is clicked
    newTab.find(".closeTab").on("click", function () {
        $(`#${tabId}`).remove();
        newTab.remove();
        $("#tabs").tabs("refresh");
    });
    
}

// Function to reset sliders and input fields after submission
function resetFormFields() {
    // reset input fields
    $("#colmNumStart, #colmNumEnd, #minRowValue, #maxRowValue").val('');

    
    // reset sliders
    $(".slider").each(function () {
        const inputId = $(this).attr("id").replace("Slider", ""); // Get corresponding input ID
        $(this).slider("value", 0); // Set slider to default value
        $("#" + inputId).val(0); // Set the input field value to 0
    });

    $("#tableContainer").html("");
}



// end of scripts.js file