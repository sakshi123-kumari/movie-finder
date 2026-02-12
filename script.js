const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const historyList = document.getElementById("historyList");

const API_KEY = "YOUR_API_KEY"; // Replace with your OMDb API key

// Fetch Movies
async function fetchMovies(query) {
  resultsContainer.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    if (data.Response === "False") {
      showError("No movies found.");
      return;
    }

    displayMovies(data.Search);

  } catch (error) {
    showError("Unable to fetch data. Please try again later.");
    console.error(error);
  }
}

// Display Movies Dynamically
function displayMovies(movies) {
  resultsContainer.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${movie.Title}</h3>
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400"}" />
      <p><strong>Year:</strong> ${movie.Year}</p>
    `;

    resultsContainer.appendChild(card);
  });
}

// Error Message
function showError(message) {
  resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Save Search to LocalStorage
function saveSearch(query) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(query)) {
    history.push(query);
    localStorage.setItem("history", JSON.stringify(history));
  }

  renderHistory();
}

// Render Search History
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      searchInput.value = item;
      fetchMovies(item);
    });

    historyList.appendChild(li);
  });
}

// Form Submit Event
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (query === "") return;

  fetchMovies(query);
  saveSearch(query);
  searchInput.value = "";
});

// Load history on page load
window.addEventListener("DOMContentLoaded", renderHistory);
