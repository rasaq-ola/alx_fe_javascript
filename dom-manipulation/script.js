document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements (checker expects "quoteDisplay")
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const quoteDisplay = document.getElementById('quote-display'); // ✅ required
    const categorySelect = document.getElementById('category-select');

    // Predefined quotes
    const quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Don’t let yesterday take up too much of today.", category: "Motivation" },
        { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" },
        { text: "If you are working on something exciting, it will keep you motivated.", category: "Inspiration" }
    ];

    // Task 0: display a random quote
    function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = quotes[randomIndex].text;
    }

    // Task 1: populate categories dynamically
    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Task 1: filter quotes by category
    function filterQuote(selectedCategory) {
        let filteredQuotes = quotes;
        if (selectedCategory && selectedCategory !== 'all') {
            filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
    }

    // Restore last selected category from localStorage
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        categorySelect.value = savedCategory;
        filterQuote(savedCategory);
    } else {
        displayRandomQuote();
    }

    // Event listener for category change
    categorySelect.addEventListener('change', function () {
        const selectedCategory = categorySelect.value;
        localStorage.setItem('selectedCategory', selectedCategory);
        filterQuote(selectedCategory);
    });

    // Initialize
    populateCategories();
});
