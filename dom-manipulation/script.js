let quotes = [
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (quoteText === "" || quoteCategory === "") {
      alert("Please fill in both the quote and the category.");
      return;
    }
  
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };
  
    quotes.push(newQuote);
  
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${newQuote.text}</p>
      <p><strong>Category:</strong> ${newQuote.category}</p>
      <p><em>(You just added this!)</em></p>
    `;
  }
  