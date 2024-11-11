// modal functionality
document.addEventListener("DOMContentLoaded", function () {
  // Model
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const openModalBtn = document.getElementById("open-modal-btn");
  // Form
  const modalForm = document.getElementById("party-form");
  const form1 = document.getElementById("form-1");
  const form2 = document.getElementById("form-2");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const clearBtns = document.querySelectorAll(".clear-btn");

  // Handling open and close functionallities
  function openModal() {
    modal.style.display = "flex";
  }
  function closeModal() {
    modal.style.display = "none";
  }

  // Event listeners for openning the modal
  openModalBtn.addEventListener("click", openModal);

  // Event listeners for closing the modal
  closeModalBtn.addEventListener("click", closeModal);

  // Close modal if clicking outside of content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Clear form functionality
  clearBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Find the closest parent form
      const form = e.target.closest(".personal-info, .commerce-details");
      if (form) {
        const inputs = form.querySelectorAll("input, select");
        inputs.forEach((input) => {
          input.value = "";
        });
      }
    });
  });

  /* MOBILE VIEW */
  // Helper function to check if we're on mobile view
  const isMobileView = () => window.innerWidth < 768;

  // Initial setup
  if (!isMobileView()) {
    form1.classList.remove("hidden");
    form2.classList.remove("hidden");
  }

  //Handle resize events to manage visibility
  window.addEventListener("resize", () => {
    if (!isMobileView()) {
      // Remove hidden class from both forms on desktop
      form1.classList.remove("hidden");
      form2.classList.remove("hidden");
    } else {
      // Reset to initial state on mobile
      form1.classList.remove("hidden");
      form2.classList.add("hidden");
    }
  });

  // Page switching logic (mobile only)
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      if (isMobileView() && validatePersonalInfo()) {
        clearAllErrors(); // if exists
        form1.classList.add("hidden");
        form2.classList.remove("hidden");
      }
    });

    prevBtn.addEventListener("click", () => {
      if (isMobileView()) {
        form2.classList.add("hidden");
        form1.classList.remove("hidden");
      }
    });
  }

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from submitting

    const formValidationResult = validateForm();
    if (formValidationResult.isValid) {
      const formData = formValidationResult.formData;
      // Proceed with processing formData
      console.log("Form Data Collected:", formData);

      // You can now send this data to the server, close the modal, or display a success message
      submitForm(formData);

      // Show a success message, clear the form and close the modal
      showSuccessMessage();
      resetForm();
      closeModal();
    } else {
      // Handle invalid form, as errors are displayed
      showSummaryError("Please fix the highlighted errors.");
    }
  });
});

function submitForm(formData) {
  console.log("Form submitted successefully");

  // Convert formData to a JSON string
  const formDataString = JSON.stringify(formData);

  // Store the JSON string in local storage
  localStorage.setItem("PartiesData", formDataString);
}

function validateForm() {
  const isPersonalInfoValid = validatePersonalInfo();
  const isCommerceDetailsValid = validateCommerceDetails();

  if (isPersonalInfoValid && isCommerceDetailsValid) {
    const formData = { ...isPersonalInfoValid, ...isCommerceDetailsValid };
    return { isValid: true, formData }; // Form is valid, return data
  } else {
    showSummaryError("Please fix the highlighted errors.");
    return { isValid: false }; // Form is invalid, no data to return
  }
}

function validatePersonalInfo() {
  // Personal Info Form inputs
  const name = document.getElementById("full-name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const type = document.getElementById("type").value.trim();

  // Run all individual validators
  const isNameValid = validateName(name);
  const isAddressValid = validateAddress(address);
  const isPhoneValid = validatePhone(phone);
  const isTypeValid = validateType(type);

  if (isNameValid && isAddressValid && isPhoneValid && isTypeValid) {
    return { name, address, phone, type }; // Form is valid
  } else {
    showSummaryError("Please fix the highlighted errors.");
    return false; // Prevent form submission
  }
}

function validateCommerceDetails() {
  // Commerce Details Form inputs
  const nrc = document.getElementById("nrc").value.trim();
  const nif = document.getElementById("nif").value.trim();
  const ia = document.getElementById("ia").value.trim();
  const nis = document.getElementById("nis").value.trim();

  // Run all individual validators
  const isNRC_valid = validateNRC(nrc);
  const isNIF_valid = validateNIF(nif);
  const isIA_valid = validateIA(ia);
  const isNIS_valid = validateNIS(nis);

  if (isNRC_valid && isNIF_valid && isIA_valid && isNIS_valid) {
    return { nrc, nif, ia, nis }; // Form is valid
  } else {
    showSummaryError("Please fix the highlighted errors.");
    return false; // Prevent form submission
  }
}

function validateName(name) {
  if (name.trim() === "") {
    showError("full-name", "Party Full Name is required");
    return false;
  }
  if (name.length < 3) {
    showError("full-name", "Full Name must be at least 3 characters.");
    return false;
  }
  removeError("full-name");
  return true;
}

function validateAddress(address) {
  if (address.trim() !== "" && address.length <= 4) {
    showError("address", "Address is to short must be >= 4 ");
    return false;
  }
  removeError("address");
  return true;
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10}$/; // Adjust pattern as needed
  if (!phoneRegex.test(phone)) {
    showError(
      "phone",
      `Phone number must be 10 digits. Yours is ${phone.length} `
    );
    return false;
  }
  removeError("phone");
  return true;
}

function validateType(type) {
  const validTypes = ["customer", "supplier", "both"];
  if (!validTypes.includes(type)) {
    showError(
      "type",
      "Invalid type. Must be 'customer', 'supplier', or 'both'."
    );
    return true;
  }
  removeError("type");
  return true;
}

function validateNRC(nrc) {
  const nrcPattern = /^[0-9]{2}\/[0-9]{2}-[0-9]{7}[A-Z][0-9]{2}$/;
  if (nrc && !nrcPattern.test(nrc)) {
    showError("nrc", "Invalid NRC format. Expected format: XX/XX-XXXXXXXAXX");
    return false;
  }
  removeError("nrc");
  return true;
}

function validateNIF(nif) {
  const nifPattern = /^[0-9]{15}$/;
  if (nif && !nifPattern.test(nif)) {
    showError("nif", "Invalid NIF format. Expected format: 15 digits.");
    return false;
  }
  removeError("nif");
  return true;
}

function validateIA(ia) {
  const iaPattern = /^[0-9]{11}$/;
  if (ia && !iaPattern.test(ia)) {
    showError("ia", "Invalid IA format. Expected format: 11 digits.");
    return false;
  }
  removeError("ia");
  return true;
}

function validateNIS(nis) {
  const nisPattern = /^[0-9]{12}$/;
  if (nis && !nisPattern.test(nis)) {
    showError("nis", "Invalid NIS format. Expected format: 12 digits.");
    return false;
  }
  removeError("nis");
  return true;
}

/** Error Display/Removal Functions */
function showError(fieldId, message) {
  const errorDiv = document.getElementById(`${fieldId}-error`);
  errorDiv.innerText = message;
  errorDiv.style.display = "block";
}

function removeError(fieldId) {
  const errorDiv = document.getElementById(`${fieldId}-error`);
  errorDiv.innerText = "";
  errorDiv.style.display = "none";
}

function showSummaryError(message) {
  const summaryErrorDiv = document.getElementById("summary-error");
  summaryErrorDiv.innerText = message;
  summaryErrorDiv.style.display = "block";
}

function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((errorDiv) => {
    errorDiv.innerText = "";
    errorDiv.style.display = "none";
  });
}

function resetForm() {
  document
    .querySelectorAll("input, select")
    .forEach((input) => (input.value = ""));
  clearAllErrors(); // Clear all error messages
}

function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage");
  successMessage.style.display = "block";

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
}

// document.addEventListener("DOMContentLoaded", function () {
//   const modal = document.getElementById("modal");

//   const modalForm = document.getElementById("party-form");
//   const successMessage = document.getElementById("successMessage");

//   const closeButton = document.querySelector(".close-button");
//   // const closeFooterButton = document.querySelector(".modal-close");

//   // Function to open modal
//   function openModal() {
//     modal.style.display = "flex";
//   }

//   // Function to close modal
//   function closeModal() {
//     modal.style.display = "none";
//   }

//   // Event listeners for closing the modal
//   closeButton.addEventListener("click", closeModal);
//   // closeFooterButton.addEventListener("click", closeModal);

//   // Close modal if clicking outside of content
//   window.addEventListener("click", function (event) {
//     if (event.target === modal) {
//       closeModal();
//     }
//   });

//   // Show error message
//   function showError(input, message) {
//     const errorMessage = input.nextElementSibling;
//     errorMessage.innerText = message;
//     errorMessage.style.display = "block";
//   }

//   // Hide error message
//   function hideError(input) {
//     const errorMessage = input.nextElementSibling;
//     errorMessage.style.display = "none";
//   }

//   // Validation functions
//   function validateAddress() {
//     const address = document.getElementById("address");
//     if (address.value.trim() === "") {
//       showError(address, "Address is required.");
//       return false;
//     }
//     hideError(address);
//     return true;
//   }

//   function validatePhone() {
//     const phone = document.getElementById("phone");
//     const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Example: 123-456-7890
//     if (!phoneRegex.test(phone.value.trim())) {
//       showError(phone, "Invalid phone format. Example: 123-456-7890");
//       return false;
//     }
//     hideError(phone);
//     return true;
//   }
// // Example Usage
//   document
//     .getElementById("open-modal-button")
//     .addEventListener("click", function () {
//       openModal();
//     });
//   // Handle form submission
//   modalForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     // Run validations
//     const isAddressValid = validateAddress();
//     const isPhoneValid = validatePhone();

//     // If any validation fails, stop submission
//     if (!isAddressValid || !isPhoneValid) {
//       return;
//     }

//     // Process form data (if needed), close the modal, and show success message
//     closeModal();
//     successMessage.style.display = "block";

//     // Hide success message after 3 seconds
//     setTimeout(() => {
//       successMessage.style.display = "none";
//     }, 3000);
//   });

//   // Example Usage
//   document
//     .getElementById("open-modal-button")
//     .addEventListener("click", function () {
//       openModal();
//     });
// });

// // Form functionalities
// document.addEventListener("DOMContentLoaded", () => {
//   const form1 = document.getElementById("form-1");
//   const form2 = document.getElementById("form-2");
//   const nextBtn = document.querySelector(".next-btn");
//   const prevBtn = document.querySelector(".prev-btn");
//   const clearBtns = document.querySelectorAll(".clear-btn");
//   const createBtn = document.querySelector(".create-btn");

//   // Helper function to check if we're on mobile view
//   const isMobileView = () => window.innerWidth < 768;

//   // Page switching logic (mobile only)
//   if (nextBtn && prevBtn) {
//     nextBtn.addEventListener("click", () => {
//       if (isMobileView()) {
//         form1.classList.add("hidden");
//         form2.classList.remove("hidden");
//       }
//     });

//     prevBtn.addEventListener("click", () => {
//       if (isMobileView()) {
//         form2.classList.add("hidden");
//         form1.classList.remove("hidden");
//       }
//     });
//   }

//   // Clear form functionality
//   clearBtns.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       // Find the closest parent form
//       const form = e.target.closest(".personal-info, .commerce-details");
//       if (form) {
//         const inputs = form.querySelectorAll("input, select");
//         inputs.forEach((input) => {
//           input.value = "";
//         });
//       }
//     });
//   });

//   // Handle form submission
//   if (createBtn) {
//     createBtn.addEventListener("click", () => {
//       // Collect data from both forms
//       const formData = {
//         personalInfo: {
//           fullName: document.getElementById("full-name").value,
//           address: document.getElementById("address").value,
//           phoneNumber: document.getElementById("phone").value,
//           type: document.getElementById("type").value,
//         },
//         commerceDetails: {
//           nrc: document.getElementById("nrc").value,
//           nif: document.getElementById("nif").value,
//           ia: document.getElementById("ia").value,
//           nis: document.getElementById("nis").value,
//         },
//       };

//       // Validate the forms
//       if (validateForms(formData)) {
//         // Handle the submission
//         console.log("Form data:", formData);
//         // You can add your API call or other submission logic here
//         alert("Form submitted successfully!");
//         closeModal();
//       }
//     });
//   }
//   // Close modal
//   function closeModal() {
//     document.getElementById("modal").style.display = "none";
//   }

//   // Form validation
//   function validateForms(data) {
//     // Check if required fields are filled
//     const required = [
//       { field: "fullName", label: "Full Name" },
//       { field: "address", label: "Address" },
//       { field: "phoneNumber", label: "Phone Number" },
//       { field: "nrc", label: "NRC" },
//       { field: "nif", label: "NIF" },
//     ];

//     for (const item of required) {
//       const value =
//         item.field in data.personalInfo
//           ? data.personalInfo[item.field]
//           : data.commerceDetails[item.field];

//       if (!value || value.trim() === "") {
//         alert(`${item.label} is required`);
//         return false;
//       }
//     }

//     return true;
//   }

//   // Handle resize events to manage visibility
//   window.addEventListener("resize", () => {
//     if (!isMobileView()) {
//       // Remove hidden class from both forms on desktop
//       form1.classList.remove("hidden");
//       form2.classList.remove("hidden");
//     } else {
//       // Reset to initial state on mobile
//       form1.classList.remove("hidden");
//       form2.classList.add("hidden");
//     }
//   });

//   // Initial setup
//   if (!isMobileView()) {
//     form1.classList.remove("hidden");
//     form2.classList.remove("hidden");
//   }
// });
