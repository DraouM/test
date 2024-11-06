

document.getElementById('display-model-btn').addEventListener("click", () => toggleModel());

window.addEventListener('click', (event) => {
    const model = document.querySelector('.model');
    const overlay = document.getElementById('overlay'); // or use querySelector
  
    if (event.target === overlay && overlay.classList.contains('active')) {
        toggleModel();
    } else if (event.target === model && model.classList.contains('active')) {
      //Prevent closing if click is inside model and model has active class.
      //this part depends on whether you chose to add `active` class to model in toggle functions
      event.stopPropagation(); // or event.preventDefault(); // or you can remove this completely depending on requirements
      return;
    }
  
  });
  
  
  
  function toggleModel() {
    const model = document.querySelector('.model');
    const overlay = document.getElementById('overlay');
    model.classList.toggle('active');
    overlay.classList.toggle('active');
  }
  
