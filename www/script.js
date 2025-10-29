// Enhanced Smart Budget Tracker - Complete Solution with AI Features
const SmartBudget = {
    // Existing data structures
    transactions: [],
    budgets: {},
    settings: {
        theme: 'light',
        currency: 'USD',
        aiInsights: true
    },
    user: {
        name: '',
        currency: 'USD',
        profileCompleted: false
    },
    currentEditingTransaction: null,
    currentEditingBudget: null,
    motivationMessages: [
        "Every penny saved is a penny earned!",
        "Financial freedom is a journey, not a destination.",
        "Small amounts saved daily add up to huge investments.",
        "Budgeting is the key to financial success.",
        "You're one step closer to your financial goals.",
        "Smart spending today means a secure tomorrow.",
        "Your financial discipline is inspiring!",
        "Keep going, your future self will thank you!"
    ],

    // NEW: Enhanced data structures for advanced features
    goals: [],
    notifications: [],
    spendingPatterns: {},
    financialInsights: [],
    forecastData: {},
    recurringTransactions: [],

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDate();
        this.renderDashboard();
        this.renderTransactions();
        this.renderAllTransactions();
        this.renderBudgets();
        this.renderGoals();
        this.renderCharts();
        this.applyTheme();
        this.checkUserOnboarding();
        this.generateFinancialInsights(); // NEW: Generate AI insights on init
        this.checkRecurringTransactions(); // NEW: Check for recurring transactions
    },

    loadData() {
        try {
            // Load transactions
            const storedTransactions = localStorage.getItem('smartBudget_transactions');
            if (storedTransactions) {
                this.transactions = JSON.parse(storedTransactions);
            }

            // Load budgets
            const storedBudgets = localStorage.getItem('smartBudget_budgets');
            if (storedBudgets) {
                this.budgets = JSON.parse(storedBudgets);
            }

            // Load settings
            const storedSettings = localStorage.getItem('smartBudget_settings');
            if (storedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
            }

            // Load user data
            const storedUser = localStorage.getItem('smartBudget_user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                this.user = { ...this.user, ...userData };

                // Ensure profileCompleted is properly set
                if (userData.name && userData.name.trim() !== '') {
                    this.user.profileCompleted = true;
                }
            }

            // NEW: Load goals
            const storedGoals = localStorage.getItem('smartBudget_goals');
            if (storedGoals) {
                this.goals = JSON.parse(storedGoals);
            }

            // NEW: Load notifications
            const storedNotifications = localStorage.getItem('smartBudget_notifications');
            if (storedNotifications) {
                this.notifications = JSON.parse(storedNotifications);
            }

            // NEW: Load recurring transactions
            const storedRecurring = localStorage.getItem('smartBudget_recurring');
            if (storedRecurring) {
                this.recurringTransactions = JSON.parse(storedRecurring);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.transactions = [];
            this.budgets = {};
            this.goals = [];
            this.notifications = [];
            this.recurringTransactions = [];
        }
    },

    saveData() {
        try {
            localStorage.setItem('smartBudget_transactions', JSON.stringify(this.transactions));
            localStorage.setItem('smartBudget_budgets', JSON.stringify(this.budgets));
            localStorage.setItem('smartBudget_settings', JSON.stringify(this.settings));
            localStorage.setItem('smartBudget_user', JSON.stringify(this.user));
            // NEW: Save enhanced data
            localStorage.setItem('smartBudget_goals', JSON.stringify(this.goals));
            localStorage.setItem('smartBudget_notifications', JSON.stringify(this.notifications));
            localStorage.setItem('smartBudget_recurring', JSON.stringify(this.recurringTransactions));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    setupEventListeners() {
        // User modal
        document.getElementById('save-user').addEventListener('click', () => this.saveUser());

        // Transaction modals
        document.getElementById('add-transaction-btn').addEventListener('click', () => this.openTransactionModal());
        document.getElementById('add-transaction-btn-2').addEventListener('click', () => this.openTransactionModal());
        document.getElementById('close-transaction-modal').addEventListener('click', () => this.closeTransactionModal());
        document.getElementById('save-transaction').addEventListener('click', () => this.saveTransaction());

        // Budget modals
        document.getElementById('add-budget-btn').addEventListener('click', () => this.openBudgetModal());
        document.getElementById('close-budget-modal').addEventListener('click', () => this.closeBudgetModal());
        document.getElementById('save-budget').addEventListener('click', () => this.saveBudget());

        // NEW: Goal modals
        document.getElementById('add-goal-btn').addEventListener('click', () => this.openGoalModal());
        document.getElementById('close-goal-modal').addEventListener('click', () => this.closeGoalModal());
        document.getElementById('save-goal').addEventListener('click', () => this.saveGoal());

        // NEW: Notification panel
        document.getElementById('notification-btn').addEventListener('click', () => this.openNotificationPanel());
        document.getElementById('close-notification-panel').addEventListener('click', () => this.closeNotificationPanel());

        // NEW: Transaction filters
        document.getElementById('transaction-filter-type').addEventListener('change', () => this.filterTransactions());
        document.getElementById('transaction-filter-category').addEventListener('change', () => this.filterTransactions());
        document.getElementById('transaction-search').addEventListener('input', () => this.filterTransactions());

        // NEW: Recurring transaction options
        document.getElementById('transaction-recurring').addEventListener('change', (e) => {
            const options = document.getElementById('recurring-options');
            if (e.target.checked) {
                options.classList.remove('hidden');
            } else {
                options.classList.add('hidden');
            }
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Settings
        document.getElementById('update-profile').addEventListener('click', () => this.updateProfile());
        document.getElementById('theme-select').addEventListener('change', (e) => this.changeTheme(e.target.value));
        document.getElementById('reset-data-btn').addEventListener('click', () => this.resetData());
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());

        // NEW: Import data
        document.getElementById('import-data-btn').addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));

        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Populate settings form
        this.populateSettingsForm();

        // NEW: Update notification badge
        this.updateNotificationBadge();
    },

    populateSettingsForm() {
        document.getElementById('user-name-display').value = this.user.name || '';
        document.getElementById('currency-select').value = this.user.currency || 'USD';
        document.getElementById('theme-select').value = this.settings.theme || 'light';
        document.getElementById('enable-ai-insights-display').checked = this.settings.aiInsights !== false;
    },

    checkUserOnboarding() {
        // Show modal only if user hasn't completed profile or doesn't have a name
        const shouldShowModal = !this.user.profileCompleted || !this.user.name || this.user.name.trim() === '';

        if (shouldShowModal) {
            document.getElementById('login-modal').classList.remove('hidden');
        } else {
            document.getElementById('login-modal').classList.add('hidden');
            this.updateGreeting();
        }
    },

    saveUser() {
        const name = document.getElementById('user-name').value.trim();
        const currency = document.getElementById('user-currency').value;
        const aiInsights = document.getElementById('enable-ai-insights').checked;

        if (name) {
            this.user.name = name;
            this.user.currency = currency;
            this.user.profileCompleted = true; // Mark profile as completed
            this.settings.aiInsights = aiInsights;

            this.saveData();
            document.getElementById('login-modal').classList.add('hidden');
            this.updateGreeting();
            this.updateCurrencyDisplay();
            this.populateSettingsForm();
            this.showToast(`Welcome to SmartBudget Pro, ${name}!`, 'success');

            // NEW: Generate initial insights for new users
            if (aiInsights) {
                setTimeout(() => {
                    this.generateFinancialInsights();
                }, 1000);
            }
        } else {
            this.showToast('Please enter your name', 'error');
        }
    },

    updateProfile() {
        const name = document.getElementById('user-name-display').value.trim();
        const currency = document.getElementById('currency-select').value;
        const theme = document.getElementById('theme-select').value;
        const aiInsights = document.getElementById('enable-ai-insights-display').checked;

        if (name) {
            this.user.name = name;
            this.user.currency = currency;
            this.settings.theme = theme;
            this.settings.aiInsights = aiInsights;

            this.saveData();
            this.updateGreeting();
            this.updateCurrencyDisplay();
            this.applyTheme();
            this.showToast('Profile updated successfully!', 'success');

            // NEW: Regenerate insights if AI insights were enabled
            if (aiInsights) {
                this.generateFinancialInsights();
            }
        } else {
            this.showToast('Please enter your name', 'error');
        }
    },

    updateGreeting() {
        const greetingElement = document.getElementById('greeting-text');
        const motivationElement = document.getElementById('motivation-text');

        if (this.user.name && this.user.name.trim() !== '') {
            const hour = new Date().getHours();
            let greeting = 'Welcome back!';

            if (hour < 12) greeting = `Good morning, ${this.user.name}!`;
            else if (hour < 18) greeting = `Good afternoon, ${this.user.name}!`;
            else greeting = `Good evening, ${this.user.name}!`;

            greetingElement.textContent = greeting;
        } else {
            greetingElement.textContent = 'Welcome to SmartBudget Pro!';
        }

        const randomMessage = this.motivationMessages[Math.floor(Math.random() * this.motivationMessages.length)];
        motivationElement.textContent = randomMessage;
    },

    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    },

    renderDashboard() {
        // Calculate totals
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((currentBalance / totalIncome) * 100) : 0;

        // Update dashboard values
        document.getElementById('total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('current-balance').textContent = this.formatCurrency(currentBalance);
        document.getElementById('savings-rate').textContent = `${savingsRate.toFixed(1)}%`;

        // Calculate progress values
        const maxAmount = Math.max(totalIncome, totalExpense, currentBalance, 1000) || 1000;
        const incomeProgress = totalIncome > 0 ? Math.min(100, (totalIncome / maxAmount) * 100) : 0;
        const expenseProgress = totalExpense > 0 ? Math.min(100, (totalExpense / maxAmount) * 100) : 0;
        const balanceProgress = Math.abs(currentBalance) > 0 ? Math.min(100, (Math.abs(currentBalance) / maxAmount) * 100) : 0;
        const savingsProgress = Math.min(100, Math.max(0, savingsRate));

        // Update progress rings
        this.updateProgressRing(0, incomeProgress, '#4CAF50');
        this.updateProgressRing(1, expenseProgress, '#FF6584');
        this.updateProgressRing(2, balanceProgress, '#6C63FF');
        this.updateProgressRing(3, savingsProgress, '#36D1DC');

        // Render recent transactions
        this.renderTransactions(5);

        // NEW: Render AI insights if enabled
        if (this.settings.aiInsights) {
            this.renderFinancialInsights();
        }
    },

    updateProgressRing(index, percent, color) {
        const progressRings = document.querySelectorAll('.progress-ring');
        if (index >= progressRings.length) return;

        const ring = progressRings[index];
        const circle = ring.querySelector('.progress-ring-circle');
        const progressValue = ring.querySelector('.progress-value');

        if (!circle || !progressValue) return;

        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        circle.style.stroke = color;
        const offset = circumference - (percent / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        progressValue.textContent = `${Math.round(percent)}%`;
    },

    renderTransactions(limit = null) {
        const container = document.getElementById('transactions-list');
        const transactionsToShow = limit ? [...this.transactions].reverse().slice(0, limit) : [...this.transactions].reverse();

        if (transactionsToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>No transactions yet</h3>
                    <p>Add your first transaction to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = transactionsToShow.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.category}</h4>
                        <p>${this.formatDate(transaction.date)} • ${transaction.note || 'No description'}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    },

    renderAllTransactions() {
        const container = document.getElementById('all-transactions-list');

        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>No transactions yet</h3>
                    <p>Add your first transaction to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.transactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.category}</h4>
                        <p>${this.formatDate(transaction.date)} • ${transaction.note || 'No description'}</p>
                    </div>
                </div>
                <div class="transaction-actions">
                    <button onclick="SmartBudget.editTransaction('${transaction.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="SmartBudget.deleteTransaction('${transaction.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).reverse().join('');
    },

    // NEW: Filter transactions based on user selection
    filterTransactions() {
        const typeFilter = document.getElementById('transaction-filter-type').value;
        const categoryFilter = document.getElementById('transaction-filter-category').value;
        const searchQuery = document.getElementById('transaction-search').value.toLowerCase();

        const container = document.getElementById('all-transactions-list');
        let filteredTransactions = [...this.transactions];

        // Apply type filter
        if (typeFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
        }

        // Apply search filter
        if (searchQuery) {
            filteredTransactions = filteredTransactions.filter(t =>
                t.note.toLowerCase().includes(searchQuery) ||
                t.category.toLowerCase().includes(searchQuery)
            );
        }

        if (filteredTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.category}</h4>
                        <p>${this.formatDate(transaction.date)} • ${transaction.note || 'No description'}</p>
                    </div>
                </div>
                <div class="transaction-actions">
                    <button onclick="SmartBudget.editTransaction('${transaction.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="SmartBudget.deleteTransaction('${transaction.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).reverse().join('');
    },

    renderBudgets() {
        const container = document.getElementById('budgets-list');
        const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];

        const hasBudgets = Object.values(this.budgets).some(budget => budget.amount > 0);

        if (!hasBudgets) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <h3>No budgets set</h3>
                    <p>Create your first budget to track spending limits</p>
                </div>
            `;
            return;
        }

        container.innerHTML = categories.map(category => {
            const budget = this.budgets[category];
            if (!budget || budget.amount === 0) return '';

            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === category)
                .reduce((sum, t) => sum + t.amount, 0);

            const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            const progressClass = progress > 100 ? 'over' : progress > 80 ? 'warning' : 'under';
            const remaining = budget.amount - spent;

            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <div class="budget-category">${category}</div>
                        <div class="budget-amount">${this.formatCurrency(spent)} / ${this.formatCurrency(budget.amount)}</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="budget-stats">
                        <span class="${progressClass}">${progress.toFixed(1)}% used</span>
                        <span class="${remaining < 0 ? 'over' : ''}">
                            ${remaining >= 0 ? this.formatCurrency(remaining) + ' remaining' : this.formatCurrency(Math.abs(remaining)) + ' over budget'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        // NEW: Render budget suggestions
        this.renderBudgetSuggestions();
    },

    // NEW: Render budget suggestions based on spending patterns
    renderBudgetSuggestions() {
        const container = document.getElementById('budget-suggestions');
        const suggestions = this.generateBudgetSuggestions();

        if (suggestions.length === 0) {
            container.innerHTML = '<p>No budget suggestions at this time. Keep tracking your expenses to get personalized recommendations.</p>';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item">
                <div class="suggestion-icon">
                    <i class="fas ${suggestion.icon}"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-desc">${suggestion.description}</div>
                </div>
                <div class="suggestion-action">
                    <button class="btn btn-primary btn-sm" onclick="SmartBudget.applyBudgetSuggestion('${suggestion.category}', ${suggestion.amount})">Apply</button>
                </div>
            </div>
        `).join('');
    },

    // NEW: Generate AI-powered budget suggestions
    generateBudgetSuggestions() {
        const suggestions = [];
        const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Education'];

        // Calculate average spending per category over the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        categories.forEach(category => {
            const categoryTransactions = this.transactions.filter(t =>
                t.type === 'expense' &&
                t.category === category &&
                new Date(t.date) >= threeMonthsAgo
            );

            if (categoryTransactions.length > 0) {
                const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                const averageSpent = totalSpent / 3; // Average over 3 months

                // If no budget is set for this category, suggest one
                if (!this.budgets[category] || this.budgets[category].amount === 0) {
                    const suggestedBudget = averageSpent * 1.1; // 10% buffer

                    suggestions.push({
                        category: category,
                        title: `Set budget for ${category}`,
                        description: `Based on your spending patterns, we suggest a budget of ${this.formatCurrency(suggestedBudget)} per month.`,
                        amount: suggestedBudget,
                        icon: 'fa-chart-pie'
                    });
                } else {
                    // If budget is set but consistently exceeded, suggest increase
                    const currentBudget = this.budgets[category].amount;
                    const budgetUsage = (averageSpent / currentBudget) * 100;

                    if (budgetUsage > 110) { // If spending exceeds budget by 10%
                        const suggestedBudget = averageSpent * 1.05; // 5% buffer

                        suggestions.push({
                            category: category,
                            title: `Increase ${category} budget`,
                            description: `You're consistently exceeding your ${category} budget. Consider increasing it to ${this.formatCurrency(suggestedBudget)}.`,
                            amount: suggestedBudget,
                            icon: 'fa-arrow-up'
                        });
                    } else if (budgetUsage < 60) { // If using less than 60% of budget
                        const suggestedBudget = averageSpent * 1.1; // 10% buffer

                        suggestions.push({
                            category: category,
                            title: `Optimize ${category} budget`,
                            description: `You're using only ${budgetUsage.toFixed(0)}% of your ${category} budget. Consider reducing it to ${this.formatCurrency(suggestedBudget)}.`,
                            amount: suggestedBudget,
                            icon: 'fa-arrow-down'
                        });
                    }
                }
            }
        });

        return suggestions;
    },

    // NEW: Apply budget suggestion
    applyBudgetSuggestion(category, amount) {
        this.budgets[category] = {
            amount: amount,
            period: 'monthly',
            createdAt: new Date().toISOString()
        };

        this.saveData();
        this.renderBudgets();
        this.showToast(`Budget for ${category} set to ${this.formatCurrency(amount)}`, 'success');
    },

    // NEW: Goals functionality
    openGoalModal(goal = null) {
        this.currentEditingGoal = goal;
        const modal = document.getElementById('goal-modal');
        const title = document.getElementById('goal-modal-title');

        if (goal) {
            title.textContent = 'Edit Goal';
            document.getElementById('goal-id').value = goal.id;
            document.getElementById('goal-name').value = goal.name;
            document.getElementById('goal-target').value = goal.targetAmount;
            document.getElementById('goal-current').value = goal.currentAmount;
            document.getElementById('goal-deadline').value = goal.deadline;
            document.getElementById('goal-category').value = goal.category;
        } else {
            title.textContent = 'Add Goal';
            document.getElementById('goal-form').reset();
            document.getElementById('goal-id').value = '';
            // Set default deadline to 3 months from now
            const defaultDeadline = new Date();
            defaultDeadline.setMonth(defaultDeadline.getMonth() + 3);
            document.getElementById('goal-deadline').value = defaultDeadline.toISOString().split('T')[0];
        }

        modal.classList.remove('hidden');
    },

    closeGoalModal() {
        document.getElementById('goal-modal').classList.add('hidden');
        this.currentEditingGoal = null;
    },

    saveGoal() {
        const id = document.getElementById('goal-id').value || 'GL-' + Date.now();
        const name = document.getElementById('goal-name').value;
        const targetAmount = parseFloat(document.getElementById('goal-target').value);
        const currentAmount = parseFloat(document.getElementById('goal-current').value) || 0;
        const deadline = document.getElementById('goal-deadline').value;
        const category = document.getElementById('goal-category').value;

        if (!name || !targetAmount || targetAmount <= 0) {
            this.showToast('Please fill in all required fields with valid values', 'error');
            return;
        }

        if (currentAmount > targetAmount) {
            this.showToast('Current amount cannot exceed target amount', 'error');
            return;
        }

        const goal = {
            id,
            name,
            targetAmount,
            currentAmount,
            deadline,
            category,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditingGoal) {
            const index = this.goals.findIndex(g => g.id === this.currentEditingGoal.id);
            if (index !== -1) {
                this.goals[index] = goal;
            }
        } else {
            this.goals.push(goal);
        }

        this.saveData();
        this.renderGoals();
        this.closeGoalModal();
        this.showToast('Goal saved successfully!', 'success');
    },

    renderGoals() {
        const container = document.getElementById('goals-list');

        if (this.goals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <h3>No goals set</h3>
                    <p>Create your first financial goal to track your progress</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            let deadlineText = '';
            if (daysRemaining > 0) {
                deadlineText = `${daysRemaining} days remaining`;
            } else if (daysRemaining === 0) {
                deadlineText = 'Due today';
            } else {
                deadlineText = `${Math.abs(daysRemaining)} days overdue`;
            }

            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <div class="goal-title">${goal.name}</div>
                        <div class="goal-amount">${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-progress-bar" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="goal-stats">
                        <span>${progress.toFixed(1)}% complete</span>
                        <span>${this.formatCurrency(goal.targetAmount - goal.currentAmount)} to go</span>
                    </div>
                    <div class="goal-deadline">
                        <i class="far fa-calendar"></i>
                        <span>${deadlineText}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    // NEW: AI-Powered Financial Insights - IMPROVED VERSION
    generateFinancialInsights() {
        if (!this.settings.aiInsights) return;

        this.financialInsights = [];

        // Calculate basic financial metrics
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? (currentBalance / totalIncome) * 100 : 0;

        // Insight 1: Savings rate analysis - FIXED LOGIC
        if (totalIncome === 0) {
            this.financialInsights.push({
                title: "Start Tracking Your Income",
                content: "Add your income transactions to get personalized financial insights and track your savings progress.",
                type: "warning",
                icon: "fa-chart-line"
            });
        } else if (savingsRate > 20) {
            this.financialInsights.push({
                title: "Excellent Savings Rate!",
                content: `You're saving ${savingsRate.toFixed(1)}% of your income. This is well above the recommended 20% savings rate. Keep up the great work!`,
                type: "positive",
                icon: "fa-piggy-bank"
            });
        } else if (savingsRate > 10) {
            this.financialInsights.push({
                title: "Good Savings Habits",
                content: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for better financial security.`,
                type: "positive",
                icon: "fa-thumbs-up"
            });
        } else if (savingsRate > 0) {
            this.financialInsights.push({
                title: "Room for Improvement",
                content: `You're saving ${savingsRate.toFixed(1)}% of your income. Try to increase your savings rate to at least 10% by reviewing your expenses.`,
                type: "warning",
                icon: "fa-exclamation-triangle"
            });
        } else if (savingsRate < 0) {
            this.financialInsights.push({
                title: "Spending Exceeds Income",
                content: `Your expenses are ${Math.abs(savingsRate).toFixed(1)}% higher than your income. Review your spending to identify areas to cut back.`,
                type: "negative",
                icon: "fa-exclamation-circle"
            });
        }

        // Insight 2: Expense category analysis - IMPROVED
        const expenseByCategory = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                expenseByCategory[transaction.category] = (expenseByCategory[transaction.category] || 0) + transaction.amount;
            });

        if (Object.keys(expenseByCategory).length > 0) {
            const largestExpenseCategory = Object.keys(expenseByCategory).reduce((a, b) =>
                expenseByCategory[a] > expenseByCategory[b] ? a : b, null);

            if (largestExpenseCategory && totalExpense > 0) {
                const categoryPercentage = (expenseByCategory[largestExpenseCategory] / totalExpense) * 100;

                if (categoryPercentage > 40) {
                    this.financialInsights.push({
                        title: "High Spending Concentration",
                        content: `Your ${largestExpenseCategory} expenses account for ${categoryPercentage.toFixed(1)}% of total spending. Consider diversifying or optimizing this category.`,
                        type: "warning",
                        icon: "fa-chart-pie"
                    });
                }
            }
        }

        // Insight 3: Monthly trend analysis - IMPROVED
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthExpenses = this.transactions
            .filter(t => t.type === 'expense' &&
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthExpenses = this.transactions
            .filter(t => t.type === 'expense' &&
                new Date(t.date).getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) &&
                new Date(t.date).getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear))
            .reduce((sum, t) => sum + t.amount, 0);

        if (lastMonthExpenses > 0 && currentMonthExpenses > 0) {
            const change = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

            if (change > 25) {
                this.financialInsights.push({
                    title: "Spending Increased Significantly",
                    content: `Your spending this month is ${change.toFixed(1)}% higher than last month. Review recent transactions to understand why.`,
                    type: "warning",
                    icon: "fa-arrow-up"
                });
            } else if (change < -20) {
                this.financialInsights.push({
                    title: "Great Job Reducing Expenses!",
                    content: `Your spending this month is ${Math.abs(change).toFixed(1)}% lower than last month. Keep up the good work!`,
                    type: "positive",
                    icon: "fa-arrow-down"
                });
            }
        }

        // Insight 4: Budget performance - IMPROVED
        const budgetCategories = Object.keys(this.budgets).filter(cat => this.budgets[cat] && this.budgets[cat].amount > 0);

        if (budgetCategories.length > 0) {
            let budgetsOnTrack = 0;
            let totalBudgets = 0;

            budgetCategories.forEach(category => {
                const spent = this.transactions
                    .filter(t => t.type === 'expense' && t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0);

                const budget = this.budgets[category].amount;
                const usage = (spent / budget) * 100;

                if (usage <= 85) {
                    budgetsOnTrack++;
                }
                totalBudgets++;
            });

            const budgetHealth = totalBudgets > 0 ? (budgetsOnTrack / totalBudgets) * 100 : 100;

            if (budgetHealth < 50) {
                this.financialInsights.push({
                    title: "Budget Attention Needed",
                    content: `Only ${budgetHealth.toFixed(0)}% of your budgets are on track. Review your spending to stay within limits.`,
                    type: "warning",
                    icon: "fa-wallet"
                });
            } else if (budgetHealth === 100 && budgetCategories.length > 0) {
                this.financialInsights.push({
                    title: "All Budgets On Track!",
                    content: "Great job! You're staying within all your budget limits. Consider setting more ambitious goals.",
                    type: "positive",
                    icon: "fa-check-circle"
                });
            }
        }

        // Insight 5: Goal progress - IMPROVED
        const activeGoals = this.goals.filter(goal =>
            goal.currentAmount < goal.targetAmount &&
            new Date(goal.deadline) > new Date()
        );

        if (activeGoals.length > 0) {
            const closestGoal = activeGoals.reduce((prev, current) =>
                (new Date(prev.deadline) < new Date(current.deadline)) ? prev : current
            );

            const goalProgress = (closestGoal.currentAmount / closestGoal.targetAmount) * 100;
            const daysRemaining = Math.ceil((new Date(closestGoal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            if (daysRemaining < 30 && goalProgress < 50) {
                this.financialInsights.push({
                    title: "Goal Deadline Approaching",
                    content: `Your "${closestGoal.name}" goal is ${goalProgress.toFixed(1)}% complete with only ${daysRemaining} days left. Consider adjusting your savings plan.`,
                    type: "warning",
                    icon: "fa-bullseye"
                });
            } else if (goalProgress > 75) {
                this.financialInsights.push({
                    title: "Goal Almost Achieved!",
                    content: `You're ${goalProgress.toFixed(1)}% towards your "${closestGoal.name}" goal. You're almost there!`,
                    type: "positive",
                    icon: "fa-trophy"
                });
            }
        }

        // Insight 6: Transaction frequency
        if (this.transactions.length === 0) {
            this.financialInsights.push({
                title: "Start Tracking Your Finances",
                content: "Add your first transaction to begin receiving personalized financial insights and recommendations.",
                type: "info",
                icon: "fa-plus-circle"
            });
        } else if (this.transactions.length < 5) {
            this.financialInsights.push({
                title: "Build Your Financial History",
                content: "Add more transactions to get more accurate insights and better financial recommendations.",
                type: "info",
                icon: "fa-history"
            });
        }
    },

    renderFinancialInsights() {
        const container = document.getElementById('insights-container');

        if (this.financialInsights.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-lightbulb"></i>
                    <h3>No insights yet</h3>
                    <p>Continue tracking your finances to receive personalized insights</p>
                </div>
            `;
            return;
        }

        // Show only the top 3 insights
        const topInsights = this.financialInsights.slice(0, 3);

        container.innerHTML = topInsights.map(insight => `
            <div class="insight-card">
                <div class="insight-header">
                    <div class="insight-icon ${insight.type}">
                        <i class="fas ${insight.icon}"></i>
                    </div>
                    <h3 class="insight-title">${insight.title}</h3>
                </div>
                <div class="insight-content">
                    ${insight.content}
                </div>
            </div>
        `).join('');
    },

    // NEW: Notification system
    addNotification(title, message, type = 'info', action = null) {
        const notification = {
            id: 'NT-' + Date.now(),
            title,
            message,
            type,
            action,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveData();
        this.updateNotificationBadge();

        // Show toast for important notifications
        if (type === 'warning' || type === 'alert') {
            this.showToast(`${title}: ${message}`, type);
        }
    },

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    openNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        const list = document.getElementById('notifications-list');

        // Mark all as read when opening
        this.notifications.forEach(n => n.read = true);
        this.saveData();
        this.updateNotificationBadge();

        if (this.notifications.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-bell"></i>
                    <h3>No notifications</h3>
                    <p>You're all caught up!</p>
                </div>
            `;
        } else {
            list.innerHTML = this.notifications.map(notification => `
                <div class="notification-item">
                    <div class="notification-header">
                        <h4>${notification.title}</h4>
                        <span class="notification-time">${this.formatDate(notification.timestamp)}</span>
                    </div>
                    <p>${notification.message}</p>
                </div>
            `).join('');
        }

        panel.classList.remove('hidden');
    },

    closeNotificationPanel() {
        document.getElementById('notification-panel').classList.add('hidden');
    },

    // NEW: Check for recurring transactions
    checkRecurringTransactions() {
        const today = new Date().toISOString().split('T')[0];
        let createdTransactions = false;

        this.recurringTransactions.forEach(rt => {
            if (rt.nextDate <= today) {
                // Create the transaction
                const newTransaction = {
                    id: 'TX-' + Date.now() + Math.random().toString(36).substr(2, 5),
                    type: rt.type,
                    category: rt.category,
                    amount: rt.amount,
                    date: rt.nextDate,
                    note: rt.note + ' (Recurring)',
                    recurring: true
                };

                this.transactions.push(newTransaction);
                createdTransactions = true;

                // Calculate next date
                const nextDate = new Date(rt.nextDate);
                switch (rt.frequency) {
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }

                rt.nextDate = nextDate.toISOString().split('T')[0];
            }
        });

        if (createdTransactions) {
            this.saveData();
            this.renderDashboard();
            this.renderAllTransactions();
            this.renderBudgets();
            this.renderCharts();
            this.showToast('Recurring transactions processed', 'success');
        }
    },

    // Existing methods with enhancements
    openTransactionModal(transaction = null) {
        this.currentEditingTransaction = transaction;
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('transaction-modal-title');

        if (transaction) {
            title.textContent = 'Edit Transaction';
            document.getElementById('transaction-id').value = transaction.id;
            document.getElementById('transaction-type').value = transaction.type;
            document.getElementById('transaction-category').value = transaction.category;
            document.getElementById('transaction-amount').value = transaction.amount;
            document.getElementById('transaction-date').value = transaction.date;
            document.getElementById('transaction-note').value = transaction.note || '';

            // NEW: Handle recurring transactions in edit mode
            if (transaction.recurring) {
                document.getElementById('transaction-recurring').checked = true;
                document.getElementById('recurring-options').classList.remove('hidden');
                document.getElementById('recurring-frequency').value = transaction.recurringFrequency || 'monthly';
            } else {
                document.getElementById('transaction-recurring').checked = false;
                document.getElementById('recurring-options').classList.add('hidden');
            }
        } else {
            title.textContent = 'Add Transaction';
            document.getElementById('transaction-form').reset();
            document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('transaction-id').value = '';
            document.getElementById('transaction-recurring').checked = false;
            document.getElementById('recurring-options').classList.add('hidden');
        }

        modal.classList.remove('hidden');
    },

    closeTransactionModal() {
        document.getElementById('transaction-modal').classList.add('hidden');
        this.currentEditingTransaction = null;
    },

    saveTransaction() {
        const id = document.getElementById('transaction-id').value || 'TX-' + Date.now();
        const type = document.getElementById('transaction-type').value;
        const category = document.getElementById('transaction-category').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const date = document.getElementById('transaction-date').value;
        const note = document.getElementById('transaction-note').value;
        const isRecurring = document.getElementById('transaction-recurring').checked;
        const frequency = isRecurring ? document.getElementById('recurring-frequency').value : null;

        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }

        if (!date) {
            this.showToast('Please select a date', 'error');
            return;
        }

        const transaction = {
            id,
            type,
            category,
            amount,
            date,
            note: note || 'No description'
        };

        // NEW: Handle recurring transactions
        if (isRecurring && frequency) {
            transaction.recurring = true;

            // Add to recurring transactions if new
            if (!this.currentEditingTransaction) {
                const nextDate = new Date(date);
                switch (frequency) {
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }

                this.recurringTransactions.push({
                    ...transaction,
                    frequency,
                    nextDate: nextDate.toISOString().split('T')[0]
                });
            }
        }

        if (this.currentEditingTransaction) {
            const index = this.transactions.findIndex(t => t.id === this.currentEditingTransaction.id);
            if (index !== -1) {
                this.transactions[index] = transaction;
            }
        } else {
            this.transactions.push(transaction);
        }

        this.saveData();
        this.renderDashboard();
        this.renderTransactions();
        this.renderAllTransactions();
        this.renderBudgets();
        this.renderCharts();

        // NEW: Generate insights after saving transaction
        if (this.settings.aiInsights) {
            this.generateFinancialInsights();
        }

        this.closeTransactionModal();
        this.showToast('Transaction saved successfully!', 'success');

        // NEW: Check for budget alerts
        this.checkBudgetAlerts();
    },

    // NEW: Check for budget alerts
    checkBudgetAlerts() {
        Object.keys(this.budgets).forEach(category => {
            const budget = this.budgets[category];
            if (budget && budget.amount > 0) {
                const spent = this.transactions
                    .filter(t => t.type === 'expense' && t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0);

                const usage = (spent / budget.amount) * 100;

                if (usage > 90 && usage <= 100) {
                    this.addNotification(
                        'Budget Alert',
                        `You've used ${usage.toFixed(1)}% of your ${category} budget.`,
                        'warning'
                    );
                } else if (usage > 100) {
                    this.addNotification(
                        'Budget Exceeded',
                        `You've exceeded your ${category} budget by ${this.formatCurrency(spent - budget.amount)}.`,
                        'alert'
                    );
                }
            }
        });
    },

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openTransactionModal(transaction);
        }
    },

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveData();
            this.renderDashboard();
            this.renderTransactions();
            this.renderAllTransactions();
            this.renderBudgets();
            this.renderCharts();

            // NEW: Regenerate insights after deletion
            if (this.settings.aiInsights) {
                this.generateFinancialInsights();
            }

            this.showToast('Transaction deleted successfully!', 'success');
        }
    },

    openBudgetModal(budget = null) {
        this.currentEditingBudget = budget;
        const modal = document.getElementById('budget-modal');
        const title = document.getElementById('budget-modal-title');

        if (budget) {
            title.textContent = 'Edit Budget';
            document.getElementById('budget-id').value = budget.category;
            document.getElementById('budget-category').value = budget.category;
            document.getElementById('budget-amount').value = budget.amount;
            document.getElementById('budget-period').value = budget.period || 'monthly';
        } else {
            title.textContent = 'Add Budget';
            document.getElementById('budget-form').reset();
            document.getElementById('budget-id').value = '';
            document.getElementById('budget-period').value = 'monthly';
        }

        modal.classList.remove('hidden');
    },

    closeBudgetModal() {
        document.getElementById('budget-modal').classList.add('hidden');
        this.currentEditingBudget = null;
    },

    saveBudget() {
        const category = document.getElementById('budget-category').value;
        const amount = parseFloat(document.getElementById('budget-amount').value);
        const period = document.getElementById('budget-period').value;

        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid budget amount', 'error');
            return;
        }

        this.budgets[category] = {
            amount,
            period,
            createdAt: new Date().toISOString()
        };

        this.saveData();
        this.renderDashboard();
        this.renderBudgets();
        this.renderCharts();

        // NEW: Regenerate insights after budget change
        if (this.settings.aiInsights) {
            this.generateFinancialInsights();
        }

        this.closeBudgetModal();
        this.showToast('Budget saved successfully!', 'success');
    },

    renderCharts() {
        this.renderIncomeExpenseChart();
        this.renderCategoryChart();
        this.renderTrendChart();
        this.renderForecastChart(); // NEW: Forecast chart
        this.updateAnalytics();
    },

    renderIncomeExpenseChart() {
        const ctx = document.getElementById('income-expense-chart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        // Get current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Filter transactions for the current year
        const currentYearTransactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getFullYear() === currentYear;
        });

        if (currentYearTransactions.length === 0) {
            ctx.innerHTML = '<div class="chart-empty-state"><p>No data available for the current year</p></div>';
            return;
        }

        // Group by month for current year
        const monthlyData = {};
        for (let month = 0; month <= currentMonth; month++) {
            const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = { income: 0, expense: 0 };
        }

        currentYearTransactions.forEach(transaction => {
            const month = transaction.date.substring(0, 7);
            if (monthlyData[month]) {
                if (transaction.type === 'income') {
                    monthlyData[month].income += transaction.amount;
                } else {
                    monthlyData[month].expense += transaction.amount;
                }
            }
        });

        const months = Object.keys(monthlyData);
        const monthNames = months.map(month => {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short' });
        });

        const incomeData = months.map(month => monthlyData[month].income);
        const expenseData = months.map(month => monthlyData[month].expense);

        ctx.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: '#FF6584',
                        borderColor: '#FF6584',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderCategoryChart() {
        const ctx = document.getElementById('category-chart');
        if (!ctx) return;

        if (ctx.chart) {
            ctx.chart.destroy();
        }

        const categoryData = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
            });

        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);

        if (categories.length === 0) {
            ctx.innerHTML = '<div class="chart-empty-state"><p>No expense data available</p></div>';
            return;
        }

        ctx.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = amounts.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderTrendChart() {
        const ctx = document.getElementById('trend-chart');
        if (!ctx) return;

        if (ctx.chart) {
            ctx.chart.destroy();
        }

        // Get transactions from the last 6 months including current month
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

        const monthlyBalance = {};

        // Initialize last 6 months with zero balance
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyBalance[monthKey] = 0;
        }

        // Calculate cumulative balance for each month
        this.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate >= sixMonthsAgo) {
                const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;

                if (monthlyBalance.hasOwnProperty(monthKey)) {
                    if (transaction.type === 'income') {
                        monthlyBalance[monthKey] += transaction.amount;
                    } else {
                        monthlyBalance[monthKey] -= transaction.amount;
                    }
                }
            }
        });

        // Calculate cumulative balance
        const months = Object.keys(monthlyBalance);
        let cumulativeBalance = 0;
        const balanceData = months.map(month => {
            cumulativeBalance += monthlyBalance[month];
            return cumulativeBalance;
        });

        const monthNames = months.map(month => {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short' });
        });

        if (this.transactions.length === 0) {
            ctx.innerHTML = '<div class="chart-empty-state"><p>No transaction data available</p></div>';
            return;
        }

        ctx.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Balance Trend',
                    data: balanceData,
                    borderColor: '#6C63FF',
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6C63FF',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Balance: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    },

    // NEW: Forecast chart
    renderForecastChart() {
        const ctx = document.getElementById('forecast-chart');
        if (!ctx) return;

        if (ctx.chart) {
            ctx.chart.destroy();
        }

        // Calculate average monthly income and expenses
        const monthlyData = {};
        this.transactions.forEach(transaction => {
            const month = transaction.date.substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expense += transaction.amount;
            }
        });

        const months = Object.keys(monthlyData).sort();
        if (months.length < 2) {
            ctx.innerHTML = '<div class="chart-empty-state"><p>Need more data for forecasting</p></div>';
            return;
        }

        // Calculate averages
        const totalIncome = Object.values(monthlyData).reduce((sum, month) => sum + month.income, 0);
        const totalExpense = Object.values(monthlyData).reduce((sum, month) => sum + month.expense, 0);

        const avgIncome = totalIncome / months.length;
        const avgExpense = totalExpense / months.length;

        // Generate forecast for next 3 months
        const lastMonth = months[months.length - 1];
        const forecastMonths = [];
        const forecastIncome = [];
        const forecastExpense = [];

        for (let i = 1; i <= 3; i++) {
            const date = new Date(lastMonth + '-01');
            date.setMonth(date.getMonth() + i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            forecastMonths.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

            // Simple forecast based on averages with slight random variation
            forecastIncome.push(avgIncome * (0.9 + Math.random() * 0.2));
            forecastExpense.push(avgExpense * (0.9 + Math.random() * 0.2));
        }

        // Combine historical and forecast data
        const allMonths = months.map(month => {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }).concat(forecastMonths);

        const allIncome = months.map(month => monthlyData[month].income).concat(forecastIncome);
        const allExpense = months.map(month => monthlyData[month].expense).concat(forecastExpense);

        ctx.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allMonths,
                datasets: [
                    {
                        label: 'Income',
                        data: allIncome,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderDash: months.map(() => null).concat(forecastMonths.map(() => [5, 5])), // Dashed for forecast
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: allExpense,
                        borderColor: '#FF6584',
                        backgroundColor: 'rgba(255, 101, 132, 0.1)',
                        borderDash: months.map(() => null).concat(forecastMonths.map(() => [5, 5])), // Dashed for forecast
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                xMin: months.length - 0.5,
                                xMax: months.length - 0.5,
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                borderWidth: 2,
                                label: {
                                    content: 'Forecast',
                                    display: true,
                                    position: 'end'
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    updateAnalytics() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Current month data
        const currentMonthTransactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear;
        });

        const currentMonthIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentMonthExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentMonthSavings = currentMonthIncome - currentMonthExpense;

        // Previous month data
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const prevMonthTransactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === prevMonth &&
                transactionDate.getFullYear() === prevYear;
        });

        const prevMonthIncome = prevMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const prevMonthExpense = prevMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate changes
        const incomeChange = prevMonthIncome > 0 ?
            ((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0;

        const expenseChange = prevMonthExpense > 0 ?
            ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100 : 0;

        // Update analytics cards
        document.getElementById('analytics-income').textContent = this.formatCurrency(currentMonthIncome);
        document.getElementById('analytics-expenses').textContent = this.formatCurrency(currentMonthExpense);
        document.getElementById('analytics-savings').textContent = this.formatCurrency(currentMonthSavings);

        // Update change indicators
        this.updateChangeIndicator('income-change', incomeChange, 'from last month');
        this.updateChangeIndicator('expense-change', expenseChange, 'from last month');

        // Budget health calculation
        const budgetHealth = this.calculateBudgetHealth();
        document.getElementById('analytics-budget-health').textContent = `${budgetHealth}%`;

        const budgetHealthElement = document.getElementById('budget-health-change');
        if (budgetHealth >= 80) {
            budgetHealthElement.innerHTML = '<i class="fas fa-check"></i> <span>All budgets on track</span>';
            budgetHealthElement.className = 'analytics-card-change positive';
        } else if (budgetHealth >= 50) {
            budgetHealthElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Some budgets close to limit</span>';
            budgetHealthElement.className = 'analytics-card-change warning';
        } else {
            budgetHealthElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Budgets need attention</span>';
            budgetHealthElement.className = 'analytics-card-change negative';
        }
    },

    calculateBudgetHealth() {
        const budgetCategories = Object.keys(this.budgets).filter(category => this.budgets[category] && this.budgets[category].amount > 0);

        if (budgetCategories.length === 0) return 100;

        let healthyBudgets = 0;

        budgetCategories.forEach(category => {
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === category)
                .reduce((sum, t) => sum + t.amount, 0);

            const budget = this.budgets[category].amount;
            const usage = (spent / budget) * 100;

            if (usage <= 80) {
                healthyBudgets++;
            }
        });

        return Math.round((healthyBudgets / budgetCategories.length) * 100);
    },

    updateChangeIndicator(elementId, change, text) {
        const element = document.getElementById(elementId);
        const absChange = Math.abs(change).toFixed(1);

        if (change > 0) {
            element.innerHTML = `<i class="fas fa-arrow-up"></i> <span>+${absChange}% ${text}</span>`;
            element.className = 'analytics-card-change positive';
        } else if (change < 0) {
            element.innerHTML = `<i class="fas fa-arrow-down"></i> <span>${absChange}% ${text}</span>`;
            element.className = 'analytics-card-change negative';
        } else {
            element.innerHTML = `<i class="fas fa-minus"></i> <span>No change ${text}</span>`;
            element.className = 'analytics-card-change neutral';
        }
    },

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Render specific content if needed
        if (section === 'analytics') {
            setTimeout(() => {
                this.renderCharts();
            }, 100);
        } else if (section === 'dashboard' && this.settings.aiInsights) {
            this.generateFinancialInsights();
        }
    },

    formatCurrency(amount) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'GHS': '₵',
            'NGN': '₦',
            'XOF': 'CFA'
        };
        const symbol = symbols[this.user.currency] || '$';
        return `${symbol}${amount.toFixed(2)}`;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    updateCurrencyDisplay() {
        this.renderDashboard();
        this.renderAllTransactions();
        this.renderBudgets();
        this.renderCharts();
    },

    applyTheme() {
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    },

    changeTheme(theme) {
        this.settings.theme = theme;
        this.saveData();
        this.applyTheme();
    },

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveData();
        this.applyTheme();
        this.showToast(`Theme changed to ${this.settings.theme} mode`, 'success');
    },

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
            this.transactions = [];
            this.budgets = {};
            this.goals = [];
            this.notifications = [];
            this.recurringTransactions = [];
            this.user.profileCompleted = false; // Reset profile completion
            this.saveData();
            location.reload();
        }
    },

    exportData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            settings: this.settings,
            user: this.user,
            recurringTransactions: this.recurringTransactions,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartbudget-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    },

    // NEW: Import data function
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('This will replace all your current data. Are you sure?')) {
                    this.transactions = data.transactions || [];
                    this.budgets = data.budgets || {};
                    this.goals = data.goals || [];
                    this.settings = { ...this.settings, ...data.settings };
                    this.user = { ...this.user, ...data.user };
                    this.recurringTransactions = data.recurringTransactions || [];

                    this.saveData();
                    location.reload();
                }
            } catch (error) {
                this.showToast('Error importing data. Please check the file format.', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SmartBudget.init();
});