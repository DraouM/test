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

  /* Form Validation */
  const sellingForm = document.getElementById("selling-form");
  const shoppingList = document
    .getElementById("shopping-list")
    .querySelector("tbody");

  // Clear form fields
  document.getElementById("clear-form").addEventListener("click", function () {
    sellingForm.reset();
  });

  // Handle form submission
  sellingForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload on form submission

  });
});

