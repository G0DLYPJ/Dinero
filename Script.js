// This event listener ensures the script runs
// only after the entire HTML document is loaded.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE ---
    // We'll use an array to store expenses.
    // In a real app, this would come from a database.
    let expenses = [];

    // --- DOM ELEMENTS ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const expenseForm = document.getElementById('expense-form');
    const totalExpenditureEl = document.getElementById('total-expenditure');
    const expenseListEl = document.getElementById('expense-list');
    const emptyStateEl = document.getElementById('empty-state');
    const messageBox = document.getElementById('message-box');
    const dateInput = document.getElementById('date');

    // --- FUNCTIONS ---

    /**
     * Shows a custom message box instead of alert()
     * @param {string} message The message to display
     */
    function showMessage(message) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 2000); // Hide after 2 seconds
    }

    /**
     * Sets the date input to today's date by default
     */
    function setDefaultDate() {
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
    }

    /**
     * Shows a specific page and hides others
     * @param {string} pageId The ID of the page to show
     */
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        // Update active state on nav links
        navLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('text-indigo-600', 'bg-indigo-50');
            } else {
                link.classList.remove('text-indigo-600', 'bg-indigo-50');
            }
        });
    }

    /**
     * Renders the entire UI based on the current state
     */
    function updateUI() {
        // 1. Calculate and display total expenditure
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalExpenditureEl.textContent = `$${total.toFixed(2)}`;

        // 2. Render the expense list
        expenseListEl.innerHTML = ''; // Clear existing list

        if (expenses.length === 0) {
            // Check if empty state is part of the DOM before appending
            if(emptyStateEl) {
                expenseListEl.appendChild(emptyStateEl); // Show empty state
            } else {
                // As a fallback, create it if it was somehow lost
                const p = document.createElement('p');
                p.id = "empty-state";
                p.className = "text-slate-500 text-center py-4";
                p.textContent = "You have no expenses logged yet.";
                expenseListEl.appendChild(p);
            }
        } else {
             // If empty state exists, make sure it's not displayed
             if (emptyStateEl && emptyStateEl.parentElement === expenseListEl) {
                expenseListEl.removeChild(emptyStateEl);
            }
            
            // Sort expenses by date, newest first
            const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedExpenses.forEach(expense => {
                const expenseEl = document.createElement('div');
                expenseEl.className = 'flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 rounded-lg';
                
                expenseEl.innerHTML = `
                    <div class="flex-1 mb-2 sm:mb-0">
                        <p class="font-semibold text-slate-800">${expense.description}</p>
                        <div class="flex items-center text-sm text-slate-500 mt-1">
                            <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">${expense.category}</span>
                            <span class="mx-2">|</span>
                            <span>${new Date(expense.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                        </div>
                    </div>
                    <div classFull="font-bold text-lg text-indigo-600 sm:text-right">
                        $${expense.amount.toFixed(2)}
                    </div>
                `;
                expenseListEl.appendChild(expenseEl);
            });
        }
    }

    /**
     * Handles the expense form submission
     * @param {Event} e The submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault(); // Prevent page reload

        // Get values from form
        const description = expenseForm.description.value;
        const amount = parseFloat(expenseForm.amount.value);
        const category = expenseForm.category.value;
        const date = expenseForm.date.value;

        // Simple validation
        if (!description || !amount || !date) {
            showMessage("Please fill in all fields.");
            messageBox.style.backgroundColor = '#ef4444'; // red-500
            return;
        }

        // Create new expense object
        const newExpense = {
            id: Date.now(),
            description,
            amount,
            category,
            date,
        };

        // Add to state
        expenses.push(newExpense);

        // Reset form
        expenseForm.reset();
        setDefaultDate();

        // Update UI
        updateUI();

        // Show success message and switch to dashboard
        messageBox.style.backgroundColor = '#22c55e'; // green-500
        showMessage("Expense added successfully!");
        showPage('dashboard-page');
    }

    // --- EVENT LISTENERS ---

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.closest('.nav-link').dataset.page;
            showPage(pageId);
        });
    });

    // Form submission
    if(expenseForm) {
        expenseForm.addEventListener('submit', handleFormSubmit);
    }

    // --- INITIALIZATION ---
    setDefaultDate(); // Set today's date on load
    showPage('logger-page'); // Show logger page by default
    updateUI(); // Render initial UI
});