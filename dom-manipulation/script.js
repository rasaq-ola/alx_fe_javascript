document.addEventListener('DOMContentLoaded', function () {
  // Quotes array
  const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
  ];

  const quoteText = document.getElementById('quote-text');
  const quoteCategory = document.getElementById('quote-category');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const categorySelect = document.getElementById('category-select');

  // Populate categories dynamically
  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Display random quote (with filter)
  function displayRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
      quoteText.textContent = "No quotes available in this category.";
      quoteCategory.textContent = "";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteText.textContent = quote.text;
    quoteCategory.textContent = `Category: ${quote.category}`;
  }

  // Add new quote
  function addQuote(text, category) {
    quotes.push({ text, category });

    // Add category if new
    if (![...categorySelect.options].some(opt => opt.value === category)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    displayRandomQuote();
  }

  // Create Add Quote Form
  function createAddQuoteForm() {
    const formContainer = document.getElementById('add-quote-form');
    const form = document.createElement('form');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter quote text';
    textInput.required = true;

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter category';
    categoryInput.required = true;

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add Quote';

    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(addButton);
    formContainer.appendChild(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addQuote(textInput.value.trim(), categoryInput.value.trim());
      form.reset();
    });
  }

  // Event listeners
  newQuoteBtn.addEventListener('click', displayRandomQuote);
  categorySelect.addEventListener('change', displayRandomQuote);

  // Initialize
  populateCategories();
  displayRandomQuote();
  createAddQuoteForm();
});
