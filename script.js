// DOM Elements
const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results");
const map = L.map("map").setView([20, 0], 2); // Default view

// Tile Layer for Map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Search Click Event
searchBtn.addEventListener("click", async () => {
  const country = countryInput.value.trim();
  if (!country) return;

  resultsContainer.innerHTML = "<p>Loading...</p>";
  const data = await fetchTouristSpots(country);

  if (data && data.length > 0) {
    resultsContainer.innerHTML = `<h2>Top Places to Visit in ${country}:</h2>`;
    map.setView([data[0].lat, data[0].lon], 5); // Center on first result

    data.forEach(place => {
      const placeCard = document.createElement("div");
      placeCard.className = "place-card";
      placeCard.innerHTML = `<h3>${place.name}</h3>`;
      resultsContainer.appendChild(placeCard);

      L.marker([place.lat, place.lon]).addTo(map).bindPopup(place.name);
    });
  } else {
    resultsContainer.innerHTML = "<p>No data found for this country.</p>";
  }
});

// Fetch Data from Wikipedia + OpenStreetMap
async function fetchTouristSpots(country) {
  const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=Tourist attractions in ${country}&prop=links&format=json&origin=*`;

  try {
    const response = await fetch(wikiApiUrl);
    const data = await response.json();
    const links = data.parse.links;

    const places = links
      .filter(link => link.ns === 0)
      .map(link => link["*"])
      .slice(0, 15);

    const geocodedPlaces = [];

    for (const place of places) {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place + ", " + country)}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length > 0) {
        geocodedPlaces.push({
          name: place,
          lat: parseFloat(geoData[0].lat),
          lon: parseFloat(geoData[0].lon)
        });
      }

      if (geocodedPlaces.length >= 10) break;
    }

    return geocodedPlaces;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
