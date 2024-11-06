document.addEventListener('DOMContentLoaded', () => {
  const form1 = document.getElementById('form-1');
  const form2 = document.getElementById('form-2');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const clearBtns = document.querySelectorAll('.clear-btn');
  const createBtn = document.querySelector('.create-btn');

  // Helper function to check if we're on mobile view
  const isMobileView = () => window.innerWidth < 768;

  // Page switching logic (mobile only)
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      if (isMobileView()) {
        form1.classList.add('hidden');
        form2.classList.remove('hidden');
      }
    });

    prevBtn.addEventListener('click', () => {
      if (isMobileView()) {
        form2.classList.add('hidden');
        form1.classList.remove('hidden');
      }
    });
  }

  // Clear form functionality
  clearBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find the closest parent form
      const form = e.target.closest('.personal-info, .commerce-details');
      if (form) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.value = '';
        });
      }
    });
  });

  // Handle form submission
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      // Collect data from both forms
      const formData = {
        personalInfo: {
          fullName: document.getElementById('full-name').value,
          address: document.getElementById('address').value,
          phoneNumber: document.getElementById('phone-number').value,
          type: document.getElementById('type').value
        },
        commerceDetails: {
          nrc: document.getElementById('nrc').value,
          nif: document.getElementById('nif').value,
          ia: document.getElementById('ia').value,
          nis: document.getElementById('nis').value
        }
      };

      // Validate the forms
      if (validateForms(formData)) {
        // Handle the submission
        console.log('Form data:', formData);
        // You can add your API call or other submission logic here
        alert('Form submitted successfully!');
        closeModel();
      }
    });
  }
  // Close Model
  function closeModel () {
    const overlay = document.getElementById('overlay');
    const model = document.getElementById('model');
    overlay.classList.remove('active');
    model.classList.remove('active');
  }
  

  // Form validation
  function validateForms(data) {
    // Check if required fields are filled
    const required = [
      { field: 'fullName', label: 'Full Name' },
      { field: 'address', label: 'Address' },
      { field: 'phoneNumber', label: 'Phone Number' },
      { field: 'nrc', label: 'NRC' },
      { field: 'nif', label: 'NIF' }
    ];

    for (const item of required) {
      const value = item.field in data.personalInfo 
        ? data.personalInfo[item.field] 
        : data.commerceDetails[item.field];

      if (!value || value.trim() === '') {
        alert(`${item.label} is required`);
        return false;
      }
    }

    return true;
  }

  // Handle resize events to manage visibility
  window.addEventListener('resize', () => {
    if (!isMobileView()) {
      // Remove hidden class from both forms on desktop
      form1.classList.remove('hidden');
      form2.classList.remove('hidden');
    } else {
      // Reset to initial state on mobile
      form1.classList.remove('hidden');
      form2.classList.add('hidden');
    }
  });

  // Initial setup
  if (!isMobileView()) {
    form1.classList.remove('hidden');
    form2.classList.remove('hidden');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('.party-management');
  
  // Check if table is scrollable
  const checkScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = tableContainer;
    
    // Add/remove classes based on scroll position
    tableContainer.classList.toggle('scroll-start', scrollLeft > 0);
    tableContainer.classList.toggle('scroll-end', 
      scrollLeft < (scrollWidth - clientWidth - 1));
  };

  // Listen for scroll events
  tableContainer.addEventListener('scroll', checkScroll);
  
  // Check on load and resize
  checkScroll();
  window.addEventListener('resize', checkScroll);

  // Format balance numbers
  document.querySelectorAll('.balance').forEach(cell => {
    const value = parseFloat(cell.textContent.replace(/[^\d.-]/g, ''));
    cell.classList.toggle('positive', value >= 0);
    cell.classList.toggle('negative', value < 0);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Function to calculate and update summary
  function updateBalanceSummary() {
    const rows = document.querySelectorAll('.party-table tbody tr');
    let totalCredit = 0;
    let totalDebit = 0;
    let creditParties = 0;
    let debitParties = 0;

    rows.forEach(row => {
      const balanceCell = row.querySelector('.balance');
      const balance = parseFloat(balanceCell.textContent.replace(/[^\d.-]/g, ''));
      
      if (balance >= 0) {
        totalCredit += balance;
        creditParties++;
      } else {
        totalDebit += balance;
        debitParties++;
      }
    });

    // Update summary cards
    const totalBalance = totalCredit + totalDebit;
    
    // Format numbers with commas and 2 decimal places
    const formatCurrency = (number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(number);
    };

    // Update total balance
    document.querySelector('.total-balance .amount').textContent = 
      formatCurrency(totalBalance);

    // Update credit summary
    document.querySelector('.credit .amount').textContent = 
      formatCurrency(totalCredit);
    document.querySelector('.credit .count').textContent = 
      `${creditParties} ${creditParties === 1 ? 'party' : 'parties'}`;

    // Update debit summary
    document.querySelector('.debit .amount').textContent = 
      formatCurrency(totalDebit);
    document.querySelector('.debit .count').textContent = 
      `${debitParties} ${debitParties === 1 ? 'party' : 'parties'}`;
  }

  // Calculate trend (mock data - replace with actual calculation)
  function calculateTrend() {
    const lastMonthBalance = 12000; // Replace with actual previous month data
    const currentBalance = parseFloat(document.querySelector('.total-balance .amount')
      .textContent.replace(/[^\d.-]/g, ''));
    
    const percentChange = ((currentBalance - lastMonthBalance) / lastMonthBalance) * 100;
    const trendElement = document.querySelector('.trend');
    
    trendElement.className = `trend ${percentChange >= 0 ? 'positive' : 'negative'}`;
    trendElement.innerHTML = `
      <i class='bx bx-${percentChange >= 0 ? 'up' : 'down'}-arrow-alt'></i>
      ${Math.abs(percentChange).toFixed(1)}% from last month
    `;
  }

  // Initial update
  updateBalanceSummary();
  calculateTrend();

  // Update when table changes (add event listeners for your edit/delete operations)
  const observer = new MutationObserver(() => {
    updateBalanceSummary();
    calculateTrend();
  });

  observer.observe(document.querySelector('.party-table tbody'), {
    childList: true,
    subtree: true
  });
});