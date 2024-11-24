// Create a modal service/manager
const modalManager = {
  modal: null,

  init() {
    this.modal = document.getElementById("modal");
  },

  open() {
    this.modal.style.display = "flex";
  },

  close() {
    this.modal.style.display = "none";
  },
};

// Create a form service/manager
const formManager = {
  form: null,
  inputs: null,

  // Initialize the manager with the form element
  init(formId) {
    this.form = document.getElementById(formId);
    this.inputs = this.form.querySelectorAll("input, textarea, select");
  },

  // Reset the form fields
  reset() {
    if (this.form) {
      this.form.reset();
    }
  },

  // Populate the form with existing data (e.g., for editing)
  populate(data) {
    this.form.productName.value = data.productName;
    this.form.quantity.value = data.quantity;
    this.form["sub-unit"].value = data.subUnits;
    this.form.price.value = data.price;
    this.form["total-price"].value = data.totalPrice;
  },

  // Get the form data as an object
  getData() {
    const productName = document.getElementById("product-name").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    // Get the span element by its ID
    const quantityUnitElement = document.getElementById("quantityUnit");
    // Retrieve the value (as a string) and convert it to a number
    const quantityUnit = parseInt(quantityUnitElement.textContent.trim(), 10);
    // Log or use the value
    console.log(quantityUnit); // This will log 12 in your example

    const subUnits = parseInt(
      document.getElementById("sub-unit").value.trim(),
      10
    );
    const unitPrice = parseFloat(document.getElementById("price").value.trim());

    console.log(
      "Product Name",
      productName,
      "Quantity Selected:",
      quantity,
      "Quantity Unit",
      quantityUnit,
      "Sub-units",
      subUnits,
      "Unit Price",
      unitPrice,
      // "Quantity",
      // `${unitQuantity} & ${subUnit}`,
      "Total Price",
      unitPrice * subUnits
    );
    return {
      productName,
      quantity,
      quantityUnit,
      subUnits,
      unitPrice,
    };
  },

  // Add validation logic (optional)
  validate() {
    let isValid = true;
    this.inputs.forEach((input) => {
      if (input.required && !input.value.trim()) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });
    return isValid;
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Model
  modalManager.init();
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const openModalBtn = document.getElementById("open-modal-btn");
  // Event listener to open the modal
  openModalBtn.addEventListener("click", function () {
    modalManager.open();
  });

  // Event listener to close the modal
  closeModalBtn.addEventListener("click", function () {
    modalManager.close();
  });

  // Optional: Close modal when clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === modalManager.modal) {
      modalManager.close();
    }
  });

  // Initialize the form manager
  formManager.init("selling-form");

  // Clear form fields
  document.getElementById("clear-form").addEventListener("click", function () {
    formManager.reset();
  });

  // Handle the "Add to List" button
  // const addToListButton = document.getElementById("add-to-list");
  // addToListButton.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   // Validate form data
  //   if (!formManager.validate()) {
  //     alert("Please fill out all required fields.");
  //     return;
  //   }

  //   // Get the form data
  //   const formData = formManager.getData();

  //   // Add the product to the list
  //   addProductToList(formData);

  //   // Reset the form
  //   formManager.reset();
  // });

  // const shoppingList = document
  //   .getElementById("shopping-list")
  //   .querySelector("tbody");

  // Delegate form submission handling to a parent element
  document.getElementById("selling-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission
    const form = e.target;
    const editingRowIndex = form.dataset.editingRowIndex; // Retrieve row index
    console.log("Editing Row Form Index:", editingRowIndex);

    // Pass the index or null (if not editing) to handleFormSubmit
    handleFormSubmit(e, editingRowIndex ? parseInt(editingRowIndex, 10) : null);
  });
});

function addProductToList(product) {
  const shoppingList = document.querySelector("#shopping-list tbody");
  const rowCount = shoppingList.children.length;
  // Create a new row
  const newRow = document.createElement("tr");
  // Populate row cells
  newRow.innerHTML = `
    <td><span class="number-circle">${rowCount + 1}</span></td>
    <td>${product.productName}</td>
    <td>
    <span class="main-quantity">${product.quantity}</span>
    <span class="sub-quantity highlight">${product.quantityUnit}</span>
    </td> <!-- Quantity -->
    <td>${
      product.subUnits ? product.subUnits : "N/A"
    }</td> <!-- Sub-unit or units (if there's a separate value) -->
    <td>${
      product.unitPrice ? product.unitPrice : "N/A"
    }</td> <!-- Unit Price -->
    <td>${
      product.unitPrice && product.subUnits
        ? parseFloat((product.unitPrice * product.subUnits).toFixed(2))
        : "N/A"
    }</td> <!-- Total Price -->
    <td>
      <button class="btn edit">Edit</button>
      <button class="btn del">Del</button>
    </td>
`;

  // Add row to the product list
  shoppingList.appendChild(newRow);

  // Add event listeners for Edit and Delete buttons
  newRow
    .querySelector(".edit")
    .addEventListener("click", () => editProduct(newRow));
  newRow
    .querySelector(".del")
    .addEventListener("click", () => deleteProduct(newRow));
}

// function editProduct(row) {
//   // Open the modal
//   console.log("Updating model opened!");
//   modalManager.open();

//   // Highlight the row being edited
//   row.classList.add("editing");

//   // Get data from the row
//   const productName = row.cells[1].textContent;
//   const mainQuantity = row.querySelector(".main-quantity").textContent;
//   const quantityUnit = row.querySelector(".sub-quantity").textContent;
//   const subUnits = row.cells[3].textContent;
//   const unitPrice = row.cells[4].textContent;

//   // Populate form with data
//   document.getElementById("product-name").value = productName;
//   document.getElementById("quantity").value = mainQuantity;
//   document.getElementById("quantityUnit").textContent = quantityUnit;
//   document.getElementById("sub-unit").value =
//     subUnits === "N/A" ? "" : subUnits;
//   document.getElementById("price").value = unitPrice === "N/A" ? "" : unitPrice;

//   // Calculate and set total price
//   if (unitPrice !== "N/A" && subUnits !== "N/A") {
//     const totalPrice = (parseFloat(unitPrice) * parseFloat(subUnits)).toFixed(
//       2
//     );
//     document.getElementById("total-price").value = totalPrice;
//     document.getElementById("subunits-span").textContent = subUnits;
//   }

//   // Store reference to the row being edited
//   document.getElementById("selling-form").dataset.editingRow = Array.from(
//     row.parentNode.children
//   ).indexOf(row);

//   // Update form submission handler
//   const form = document.getElementById("selling-form");
//   form.onsubmit = (e) => {
//     e.preventDefault();

//     const product = {
//       productName: document.getElementById("product-name").value,
//       quantity: document.getElementById("quantity").value,
//       quantityUnit: document.getElementById("quantityUnit").textContent,
//       subUnits: document.getElementById("sub-unit").value,
//       unitPrice: document.getElementById("price").value,
//     };

//     // Update the existing row
//     updateProductRow(row, product);

//     // Remove editing class and event listener
//     row.classList.remove("editing");

//     // Close modal and reset form
//     modalManager.close();
//     form.reset();
//     document.getElementById("total-price").value = "";
//     document.getElementById("subunits-span").textContent = "";
//     delete form.dataset.editingRow;
//   };
// }

function deleteProduct(row) {
  // Remove the row from the product list
  row.remove();
  // Update row numbers
  updateRowNumbers();
}

// Function to update row numbers after deletion
function updateRowNumbers() {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row, index) => {
    const numberCell = row.cells[0];
    numberCell.innerHTML = `<span class="number-circle">${index + 1}</span>`;
  });
}

let currentEditingRow = null; // Declare a global variable to track the row being edited
function editProduct(row) {
  console.log("Row ", row);
  modalManager.open();

  // Highlight the row being edited
  row.classList.add("editing");
  currentEditingRow = row; // Save a reference to the row being edited

  // Get data from the row
  const productName = row.cells[1].textContent;
  const mainQuantity = row.querySelector(".main-quantity").textContent;
  const quantityUnit = row.querySelector(".sub-quantity").textContent;
  const subUnits = row.cells[3].textContent;
  const unitPrice = row.cells[4].textContent;

  // Populate form with data
  document.getElementById("product-name").value = productName;
  document.getElementById("quantity").value = mainQuantity;
  document.getElementById("quantityUnit").textContent = quantityUnit;
  document.getElementById("sub-unit").value =
    subUnits === "N/A" ? "" : subUnits;
  document.getElementById("price").value = unitPrice === "N/A" ? "" : unitPrice;

  // Calculate and set total price
  if (unitPrice !== "N/A" && subUnits !== "N/A") {
    const totalPrice = (parseFloat(unitPrice) * parseFloat(subUnits)).toFixed(
      2
    );
    document.getElementById("total-price").value = totalPrice;
    document.getElementById("subunits-span").textContent = subUnits;
  }

  // Set the editing row index in the form's dataset
  const form = document.getElementById("selling-form");
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);
  form.dataset.editingRowIndex = rowIndex; // Save the row index
  console.log("Row index set: ", rowIndex);

  // Convert Add button to Update button
  const addButton = document.getElementById("add-to-list");
  addButton.textContent = "Update";

  // // Modify form submission handler
  // const form = document.getElementById("selling-form");
  // form.onsubmit = (e) => handleFormSubmit(e, row);
}

// function handleFormSubmit(e, editingRowIndex = null) {
//   e.preventDefault();
//   console.log("Form Submiting Editing Row ", editingRowIndex);

//   // Get form data
//   const product = formManager.getData();

//   if (editingRowIndex) {
//     // Update existing row
//     updateProductRow(editingRowIndex, product);

//     // Reset editing state
//     editingRowIndex.classList.remove("editing");
//     editingRowIndex = null;

//     // Change button back to Add mode
//     const addButton = document.getElementById("add-to-list");
//     addButton.textContent = "Add to List";

//     // delete addButton.dataset.editingRow;
//   } else {
//     // Add new row
//     addProductToList(product);
//   }

//   // Clear form
//   document.getElementById("selling-form").reset();
//   document.getElementById("total-price").value = "";
//   document.getElementById("subunits-span").textContent = "";
// }

function handleFormSubmit(e, editingRowIndex = null) {
  e.preventDefault();

  // Get form data
  const product = formManager.getData();
  console.log("Form data: ", product);
  console.log("Editing Row Index: ", editingRowIndex);

  if (editingRowIndex !== null) {
    // Update existing row
    const table = document.getElementById("shopping-list");
    const row = table.rows[editingRowIndex]; // Find the row by index
    updateProductRow(row, product);

    // Reset editing state
    const form = document.getElementById("selling-form");
    delete form.dataset.editingRowIndex; // Clear editing state
    row.classList.remove("editing");
    currentEditingRow = null; // Clear the reference to the edited row

    // Change button back to Add mode
    const addButton = document.getElementById("add-to-list");
    addButton.textContent = "Add to List";
  } else {
    // Add a new row
    addProductToList(product);
  }

  // Clear the form
  document.getElementById("selling-form").reset();
  document.getElementById("total-price").value = "";
  document.getElementById("subunits-span").textContent = "";
}

function updateProductRow(row, product) {
  const totalPrice =
    product.unitPrice && product.subUnits
      ? parseFloat((product.unitPrice * product.subUnits).toFixed(2))
      : "N/A";

  row.cells[1].textContent = product.productName;
  row.cells[2].innerHTML = `
      <span class="main-quantity">${product.quantity}</span>
      <span class="sub-quantity highlight">${product.quantityUnit}</span>
  `;
  row.cells[3].textContent = product.subUnits || "N/A";
  row.cells[4].textContent = product.unitPrice || "N/A";
  row.cells[5].textContent = totalPrice;
}

// Clear form button functionality
document.getElementById("clear-form").addEventListener("click", () => {
  document.getElementById("selling-form").reset();
  document.getElementById("total-price").value = "";
  document.getElementById("subunits-span").textContent = "";

  // Reset to Add mode if in Edit mode
  const addButton = document.getElementById("add-to-list");
  if (addButton.textContent === "Update") {
    addButton.textContent = "Add to List";
    delete addButton.dataset.editingRow;
  }
});

// Auto-calculate total price when price or sub-units change
document.getElementById("price").addEventListener("input", calculateTotal);
document.getElementById("sub-unit").addEventListener("input", calculateTotal);

function calculateTotal() {
  const price = parseFloat(document.getElementById("price").value) || 0;
  const subUnits = parseFloat(document.getElementById("sub-unit").value) || 0;
  const total = (price * subUnits).toFixed(2);

  document.getElementById("total-price").value = total;
  document.getElementById("subunits-span").textContent = subUnits;
}

// /**
//  * Converts a quantity string (e.g., "3 & 8" or "5") into the total quantity in sub-units.
//  * @param {number} quantityUnit - Number of sub-units in one unit.
//  * @param {string|number} quantityString - Quantity in the form "3 & 8" (units & sub-units) or a simple number.
//  * @returns {number} - The total quantity in sub-units.
//  */
// function convertQuantityToUnits(quantityUnit, quantityString) {
//   if (typeof quantityString === "number") {
//     return quantityString; // If input is a number, it's already total sub-units.
//   }

//   if (quantityString.includes("&")) {
//     const [units, subUnits] = quantityString
//       .split("&")
//       .map((num) => parseInt(num.trim(), 10));
//     return units * quantityUnit + subUnits; // Calculate total sub-units
//   }

//   return parseInt(quantityString.trim(), 10); // For simple inputs like "5", treat it as sub-units.
// }

// /**
//  * Converts a total quantity in sub-units into units and sub-units (e.g., "3 & 8").
//  * @param {number} quantityUnit - Number of sub-units in one unit.
//  * @param {number} totalQuantity - Total quantity in sub-units.
//  * @returns {string|number} - Quantity in the form "3 & 8" (units & sub-units) or just a number if no full units exist.
//  */
// function convertUnitsToQuantity(quantityUnit, totalQuantity) {
//   const units = Math.floor(totalQuantity / quantityUnit); // Calculate full units
//   const remainingSubUnits = totalQuantity % quantityUnit; // Calculate leftover sub-units

//   if (units === 0) {
//     return totalQuantity; // If no full units, return the total as sub-units.
//   }

//   return `${units} & ${remainingSubUnits}`; // Return as a string
// }
