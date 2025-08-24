document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  // Quotes array
  let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
  ];

  // ✅ Function name updated & using innerHTML
  function displayRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available. Please add one!";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { text, category } = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${text}" — <em>${category}</em>`;
  }

  // ✅ addQuote function now updates DOM too
  window.addQuote = function() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      textInput.value = "";
      categoryInput.value = "";
      quoteDisplay.innerHTML = `"${text}" — <em>${category}</em>`; // show latest quote
    } else {
      alert("Please fill in both fields.");
    }
  };

  // ✅ Event listener calls displayRandomQuote
  newQuoteBtn.addEventListener("click", displayRandomQuote);

  // Show one quote on page load
  displayRandomQuote();
});

