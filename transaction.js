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
    for (const key in data) {
      const input = this.form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = data[key];
      }
    }
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

  /* Form */
  formManager.init("selling-form");

  // Clear form fields
  document.getElementById("clear-form").addEventListener("click", function () {
    formManager.reset();
  });

  // Initialize the form manager
  formManager.init("selling-form");

  // Handle the "Add to List" button
  const addToListButton = document.getElementById("add-to-list");
  addToListButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Validate form data
    if (!formManager.validate()) {
      alert("Please fill out all required fields.");
      return;
    }

    // Get the form data
    const formData = formManager.getData();

    // Add the product to the list
    addProductToList(formData);

    // Reset the form
    formManager.reset();
  });

  const shoppingList = document
    .getElementById("shopping-list")
    .querySelector("tbody");
});

function addProductToList(product) {
  const shoppingList = document.querySelector("#shopping-list tbody");

  // Create a new row
  const row = document.createElement("tr");

  // Populate row cells
  row.innerHTML = `
    <td><span class="number-circle">3</span></td>
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
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </td>
`;

  // Add row to the product list
  shoppingList.appendChild(row);

  // Add event listeners for Edit and Delete buttons
  row
    .querySelector(".edit-btn")
    .addEventListener("click", () => editProduct(row));
  row
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteProduct(row));
}

function editProduct(row) {
  const cells = row.querySelectorAll("td");

  // Populate form with row data for editing
  const productName = cells[0].textContent;
  const quantity = `${cells[1].textContent} & ${cells[2].textContent}`;
  const price = cells[3].textContent;

  formManager.populate({
    productName,
    quantity,
    price,
  });

  // Highlight the row being edited
  row.classList.add("editing");

  // Optionally, change the "Add to List" button to "Update Product"
  const addToListButton = document.getElementById("add-to-list");
  addToListButton.textContent = "Update Product";

  // Handle the update logic
  addToListButton.addEventListener("click", function updateProduct(e) {
    e.preventDefault();

    // Validate and get updated data
    if (!formManager.validate()) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedData = formManager.getData();

    // Update the row data
    cells[0].textContent = updatedData.productName;
    cells[1].textContent = updatedData.quantity.split("&")[0].trim();
    cells[2].textContent = updatedData.quantity.split("&")[1].trim();
    cells[3].textContent = parseFloat(updatedData.price).toFixed(2);

    // Reset the form and button state
    formManager.reset();
    addToListButton.textContent = "Add to List";

    // Remove editing class and event listener
    row.classList.remove("editing");
    addToListButton.removeEventListener("click", updateProduct);
  });
}

function deleteProduct(row) {
  // Remove the row from the product list
  row.remove();
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


