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
    // Initialize jQuery Tabs
    $("#tabs").tabs();

    // Initialize sliders and input binding
    $(".slider").each(function() {
        let inputId = $(this).attr("id").replace("Slider", ""); // Get the corresponding input ID

        // Initialize sliders
        $(this).slider({
            min: -50,
            max: 50,
            value: 0,  // Default value
            slide: function(event, ui) {
                $("#" + inputId).val(ui.value); // Update the input field when the slider is moved
                updateDynamicTable(); // Update the dynamic table when slider changes
            }
        });

        // Update the slider if the input field changes
        $("#" + inputId).on("input", function() {
            let value = parseInt($(this).val()); // Get the value from the input field
            if (value >= -50 && value <= 50) { // Ensure the value is within range
                $("#" + inputId + "Slider").slider("value", value); // Update slider
                updateDynamicTable(); // Update the dynamic table when input changes
            }
        });
    });

    // Initialize jQuery validation for the form
    $.validator.addMethod("greaterThan", function(value, element, param) {
        const target = $(param).val();
        return this.optional(element) || parseInt(value) > parseInt(target);
    }, "Value must be greater.");

    $("#dataForm").validate({
        rules: {
            colmNumStart: { required: true, number: true, range: [-50, 50] },
            colmNumEnd: { required: true, number: true, range: [-50, 50], greaterThan: "#colmNumStart" },
            minRowValue: { required: true, number: true, range: [-50, 50] },
            maxRowValue: { required: true, number: true, range: [-50, 50], greaterThan: "#minRowValue" }
        },

        submitHandler: function () {
            const colmNumStart = parseInt($('#colmNumStart').val());
            const colmNumEnd = parseInt($('#colmNumEnd').val());
            const minRowValue = parseInt($('#minRowValue').val());
            const maxRowValue = parseInt($('#maxRowValue').val());

            // Generate the table and display it in a new tab
            addTableToTab(colmNumStart, colmNumEnd, minRowValue, maxRowValue);
        }
    });

    // Handle "Delete All Tabs" action
    $("#deleteAllTabs").on("click", function () {
        $("#tabList").empty();  // Remove all tab labels
        $("#tabContent").empty();  // Remove all tab content
        $("#tabs").tabs("refresh"); // Refresh the tabs interface
    });

    // Create the initial dynamic table when the page is loaded
    updateDynamicTable();
});

// Function to update the dynamic table based on current input values
function updateDynamicTable() {
    const colmNumStart = parseInt($("#colmNumStart").val()) || 0;
    const colmNumEnd = parseInt($("#colmNumEnd").val()) || 0;
    const minRowValue = parseInt($("#minRowValue").val()) || 0;
    const maxRowValue = parseInt($("#maxRowValue").val()) || 0;

    // Ensure valid input for a preview table
    if (colmNumStart > colmNumEnd || minRowValue > maxRowValue) {
        $("#tableContainer").html("<p>Please ensure valid input ranges for a preview.</p>");
        return;
    }

    // Generate the preview table HTML
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

// Function to add the table to a new tab on submission
function addTableToTab(colmNumStart, colmNumEnd, minRowValue, maxRowValue) {
    const tabLabel = `Cols: ${colmNumStart}-${colmNumEnd} | Rows: ${minRowValue}-${maxRowValue}`;
    const tabId = `tab-${colmNumStart}-${colmNumEnd}-${minRowValue}-${maxRowValue}`;

    // Check if a tab with these parameters already exists
    const tabExists = $(`#${tabId}`).length > 0;
    if (tabExists) {
        alert("A tab with these parameters already exists.");
        return;
    }

    // Create a new tab and tab content (table)
    const newTab = $(`<li><a href="#${tabId}">${tabLabel}</a><span class="closeTab">X</span></li>`);
    const newTabContent = $(`<div id="${tabId}">${$("#tableContainer").html()}</div>`);

    // Append the new tab and its content to the tab container
    $("#tabList").append(newTab);
    $("#tabContent").append(newTabContent);
    $("#tabs").tabs("refresh");

    // Add functionality to close the tab when the close button is clicked
    newTab.find(".closeTab").on("click", function () {
        $(`#${tabId}`).remove();
        newTab.remove();
        $("#tabs").tabs("refresh");
    });
}





// end of scripts.js file