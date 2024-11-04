document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('form-1');
    const form2 = document.getElementById('form-2');
    
    // Next button click
    document.querySelector('.next-btn').addEventListener('click', () => {
      form1.classList.add('hidden');
      form2.classList.remove('hidden');
    });
    
    // Previous button click
    document.querySelector('.prev-btn').addEventListener('click', () => {
      form2.classList.add('hidden');
      form1.classList.remove('hidden');
    });
    
    // Clear form functionality
    document.querySelector('.clear-form').addEventListener('click', () => {
      const inputs = form1.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.value = '';
      });
    });
  });