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
      if (isMobileView()) {
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

  

});

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
//     const phone = document.getElementById("phone-number");
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
//           phoneNumber: document.getElementById("phone-number").value,
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
