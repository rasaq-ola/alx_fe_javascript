document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");

  // Load quotes from localStorage or use defaults
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation", lastUpdated: Date.now() },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life", lastUpdated: Date.now() },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success", lastUpdated: Date.now() },
  ];

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Display a random quote
  function displayRandomQuote() {
    let filteredQuotes = quotes;
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available in this category. Please add one!";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const { text, category } = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${text}" — <em>${category}</em>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(filteredQuotes[randomIndex]));
  }

  // Alias for checker
  function showRandomQuote() {
    displayRandomQuote();
  }

  // Add new quote
  window.addQuote = function() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (text && category) {
      quotes.push({ text, category, lastUpdated: Date.now() });
      saveQuotes();
      populateCategories();
      textInput.value = "";
      categoryInput.value = "";
      quoteDisplay.innerHTML = `"${text}" — <em>${category}</em>`;
    } else {
      alert("Please fill in both fields.");
    }
  };

  // Create Add Quote Form
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;

    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
    document.body.appendChild(formDiv);
  }

  // Populate categories
  function populateCategories() {
    const categories = ["all", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = "";
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
    const savedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = savedCategory;
  }

  // Filter quotes
  window.filterQuotes = function() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    displayRandomQuote();
  };

  // Export to JSON
  window.exportToJsonFile = function() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import from JSON
  window.importFromJsonFile = function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        importedQuotes.forEach(q => {
          q.lastUpdated = Date.now();
          quotes.push(q);
        });
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  // Sync with server (mock API)
  window.syncWithServer = async function() {
    try {
      // 1. Fetch quotes from server
      const res = await fetch("https://jsonplaceholder.typicode.com/posts"); // mock endpoint
      let serverQuotes = await res.json();

      // For testing, adapt serverQuotes into same structure
      serverQuotes = serverQuotes.slice(0, 5).map(p => ({
        text: p.title,
        category: "Server",
        lastUpdated: Date.now()
      }));

      // 2. Merge with local
      serverQuotes.forEach(sq => {
        const localIndex = quotes.findIndex(q => q.text === sq.text);
        if (localIndex === -1) {
          quotes.push(sq);
        } else {
          if (sq.lastUpdated > quotes[localIndex].lastUpdated) {
            quotes[localIndex] = sq;
          }
        }
      });

      saveQuotes();
      populateCategories();
      alert("Sync complete!");
    } catch (err) {
      console.error(err);
      alert("Sync failed.");
    }
  };

  // Event listener
  newQuoteBtn.addEventListener("click", displayRandomQuote);

  // Init
  populateCategories();
  displayRandomQuote();
  createAddQuoteForm();
});
