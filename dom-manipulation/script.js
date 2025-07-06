let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }  
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }
  
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
    saveQuotes();
    postQuoteToServer(newQuote);
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${newQuote.text}</p>
      <p><strong>Category:</strong> ${newQuote.category}</p>
      <p><em>(You just added this!)</em></p>
    `;
  }
  
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
  
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";
  
    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";
  
    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;
  
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  
    document.body.appendChild(formContainer);
  }
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  createAddQuoteForm();

  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
  
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON format.");
        }
      } catch (e) {
        alert("Failed to import: " + e.message);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function populateCategories() {
  const filterSelect = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  filterSelect.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filterSelect.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
  
    let filtered = quotes;
  
    if (selectedCategory !== "all") {
      filtered = quotes.filter(q => q.category === selectedCategory);
    }
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
  
    if (filtered.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
      return;
    }
  
    filtered.forEach(q => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>Quote:</strong> ${q.text}<br><strong>Category:</strong> ${q.category}`;
      quoteDisplay.appendChild(p);
    });
  }
  populateCategories();

  async function syncQuotes() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
      const serverData = await response.json();
  
      const serverQuotes = serverData.map(post => ({
        text: post.title,
        category: "Server"
      }));
  
      handleQuoteConflicts(serverQuotes);
    } catch (error) {
      console.error("Failed to sync with server:", error);
    }
  }  

  function handleQuoteConflicts(serverQuotes) {
    let hasConflict = false;
  
    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(q => q.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        hasConflict = true;
      }
    });
  
    if (hasConflict) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser("Quotes synced with server!");
    }
  }  

  function notifyUser(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
  
    setTimeout(() => {
      notification.textContent = "";
    }, 5000);
  }  
  async function fetchQuotesFromServer() {
    await syncQuotes();
  }  
// Fetch every 10 seconds (for demo)
setInterval(syncQuotes, 10000);

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Simulated POST successful:", result);
  } catch (error) {
    console.error("Simulated POST failed:", error);
  }
}


  