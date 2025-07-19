const searchBtn = document.getElementById("search-btn");
const countryInput = document.getElementById("country-input");
const historySection = document.getElementById("history");
const placesSection = document.getElementById("places");
const darkToggle = document.getElementById("toggle-dark");
const recommendBtn = document.getElementById("recommend-btn");
const countryDropdown = document.getElementById("country-dropdown");
const wordOfDay = document.getElementById("word-of-the-day");

let map;
let markers = [];

// List of countries for dropdown and random
const countries = [
  "Japan", "Italy", "Morocco", "Brazil", "Canada", "Thailand", "Egypt", "Spain", "Kenya", "India",
  "Greece", "South Africa", "Norway", "Turkey", "Vietnam", "Mexico", "France", "Germany", "Australia", "Peru"
];

// Dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Search button
searchBtn.addEventListener("click", () => {
  const country = countryInput.value.trim();
  if (!country) return alert("Please enter a country name.");
  fetchCountryInfo(country);
});

// Random recommendation
recommendBtn.addEventListener("click", () => {
  const random = countries[Math.floor(Math.random() * countries.length)];
  countryInput.value = random;
  fetchCountryInfo(random);
});

// Dropdown change
countryDropdown.addEventListener("change", () => {
  const selected = countryDropdown.value;
  if (selected !== "") {
    countryInput.value = selected;
    fetchCountryInfo(selected);
  }
});

// Word of the Day
function loadWordOfDay() {
  const word = countries[Math.floor(Math.random() * countries.length)];
  wordOfDay.textContent = `🌍 Word of the Day: ${word}`;
  wordOfDay.addEventListener("click", () => {
    countryInput.value = word;
    fetchCountryInfo(word);
  });
}

// Fetch country info
async function fetchCountryInfo(country) {
  historySection.innerHTML = `<h2>Loading history for ${country}...</h2>`;
  placesSection.innerHTML = `<h2>Loading places in ${country}...</h2>`;
  if (map) {
    markers.forEach(marker => map.removeLayer(marker));
    map.setView([0, 0], 2);
  }

  try {
    await Promise.all([
      fetchWikipediaExtract(country),
      fetchTopCities(country)
    ]);
  } catch (err) {
    historySection.innerHTML = `<p>⚠️ Could not load info for "${country}".</p>`;
    placesSection.innerHTML = "";
    console.error(err);
  }
}

// Wikipedia summary
async function fetchWikipediaExtract(country) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(country)}`
  );
  const data = await response.json();
  if (data.extract) {
    historySection.innerHTML = `<h2>About ${country}</h2><p>${data.extract}</p>`;
  } else {
    historySection.innerHTML = `<p>No history found.</p>`;
  }
}

// OpenStreetMap API for places
async function fetchTopCities(country) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(
      country
    )}&format=json&limit=10&accept-language=en`
  );
  const results = await response.json();

  if (!results.length) {
    placesSection.innerHTML = `<p>No places found in ${country}.</p>`;
    return;
  }

  // Display list
  placesSection.innerHTML = `<h2>Top Places in ${country}</h2><ul>${results
    .map(place => `<li>${place.display_name}</li>`)
    .join("")}</ul>`;

  // Map view
  if (!map) {
    map = L.map("map").setView([results[0].lat, results[0].lon], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);
  } else {
    map.setView([results[0].lat, results[0].lon], 5);
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
  }

  // Add markers
  results.forEach(place => {
    const marker = L.marker([place.lat, place.lon])
      .addTo(map)
      .bindPopup(place.display_name);
    markers.push(marker);
  });
}

// Populate dropdown
function populateDropdown() {
  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
  });
}

// Init on page load
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown();
  loadWordOfDay();
});
