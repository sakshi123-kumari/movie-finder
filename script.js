const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const historyList = document.getElementById("history");
const darkToggle = document.getElementById("darkToggle");

// Fetch Data (No API Key Required)
async function fetchShows(query) {
  results.innerHTML = "<div class='loader'></div>";

  try {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);

    if (!response.ok) {
      throw new Error("Network response failed");
    }

    const data = await response.json();

    if (data.length === 0) {
      showError("No results found.");
      return;
    }

    displayResults(data);

  } catch (error) {
    showError("Unable to fetch data. Please try again later.");
  }
}

// Display Results Dynamically
function displayResults(data) {
  results.innerHTML = "";

  data.forEach(item => {
    const show = item.show;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${show.image ? show.image.medium : 'https://via.placeholder.com/300x400'}">
      <h3>${show.name}</h3>
      <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
      <p><strong>Language:</strong> ${show.language}</p>
    `;

    results.appendChild(card);
  });
}

// Error Message
function showError(message) {
  results.innerHTML = `<p class="error">${message}</p>`;
}

// Save Search History
function saveHistory(query) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(query)) {
    history.push(query);
    localStorage.setItem("history", JSON.stringify(history));
  }

  renderHistory();
}

// Render History
function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      input.value = item;
      fetchShows(item);
    });

    historyList.appendChild(li);
  });
}

// Form Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) return;

  fetchShows(query);
  saveHistory(query);
  input.value = "";
});

// Dark Mode Toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Load Dark Mode + History
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
  renderHistory();
});
