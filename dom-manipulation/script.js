document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
    { text: "Happiness depends upon ourselves.", category: "Philosophy" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("new-quote");
  const categorySelect = document.getElementById("category");

  function getRandomQuote(category = null) {
    let filteredQuotes = quotes;
    if (category && category !== "All") {
      filteredQuotes = quotes.filter(q => q.category === category);
    }
    return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  }

  function displayQuote(category = null) {
    const randomQuote = getRandomQuote(category);
    if (randomQuote) {
      quoteDisplay.textContent = randomQuote.text;
    } else {
      quoteDisplay.textContent = "No quotes available for this category.";
    }
  }

  function populateCategories() {
    const categories = ["All", ...new Set(quotes.map(q => q.category))];
    categorySelect.innerHTML = categories
      .map(cat => `<option value="${cat}">${cat}</option>`)
      .join("");

    // Restore last selected category from localStorage
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && categories.includes(savedCategory)) {
      categorySelect.value = savedCategory;
      displayQuote(savedCategory);
    } else {
      displayQuote();
    }
  }

  function filterQuote() {
    const selectedCategory = categorySelect.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    displayQuote(selectedCategory);
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", () => {
    filterQuote();
  });

  categorySelect.addEventListener("change", filterQuote);

  // Init
  populateCategories();
});
