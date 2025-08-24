document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");

  // Load quotes from localStorage or use defaults
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
  ];

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Display random quote (with category filter)
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
  window.addQuote = async function() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
      const newQuote = { text, category };

      // Add locally
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      quoteDisplay.innerHTML = `"${text}" — <em>${category}</em>`;
      textInput.value = "";
      categoryInput.value = "";

      // Try sending to server (mock)
      try {
        await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newQuote),
        });
      } catch (err) {
        console.warn("Server unavailable, quote saved locally");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  // Create Add Quote Form dynamically
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

  // Populate categories dynamically
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

  // Filter quotes when category changes
  window.filterQuotes = function() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    displayRandomQuote();
  };

  // Export quotes as JSON
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

  // Import quotes from JSON
  window.importFromJsonFile = function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);

        importedQuotes.forEach(iq => {
          if (!quotes.some(q => q.text === iq.text && q.category === iq.category)) {
            quotes.push(iq);
          }
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

  // Fetch quotes from server (mock)
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      return data.slice(0, 5).map(item => ({ text: item.title, category: "Server" }));
    } catch (err) {
      console.error("Error fetching quotes from server", err);
      return [];
    }
  }

  // Sync quotes with server
  async function syncQuotes() {
    try {
      const serverQuotes = await fetchQuotesFromServer();
      let newQuotesAdded = false;

      serverQuotes.forEach(sq => {
        if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
          quotes.push(sq);
          newQuotesAdded = true;
        }
      });

      if (newQuotesAdded) {
        saveQuotes();
        populateCategories();
        alert("Quotes synced with server!"); //
      }
    } catch (err) {
      console.warn("Failed to sync with server", err);
    }
  }

  // Event listener
  newQuoteBtn.addEventListener("click", displayRandomQuote);

  // Initialize app
  populateCategories();
  displayRandomQuote();
  createAddQuoteForm();

  // Auto-sync every 30 seconds
  syncQuotes();
  setInterval(syncQuotes, 30000);
});
