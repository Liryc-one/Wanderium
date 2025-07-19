const countries = {
  france: {
    places: [
      { name: "Eiffel Tower", lat: 48.8584, lon: 2.2945 },
      { name: "Louvre Museum", lat: 48.8606, lon: 2.3376 },
      { name: "Mont Saint-Michel", lat: 48.636, lon: -1.5115 },
      { name: "Palace of Versailles", lat: 48.8049, lon: 2.1204 },
      { name: "Côte d'Azur", lat: 43.7034, lon: 7.2663 },
      { name: "Provence", lat: 43.9493, lon: 6.0649 },
      { name: "Alsace", lat: 48.317, lon: 7.4416 },
      { name: "Loire Valley", lat: 47.3495, lon: 0.6848 },
      { name: "Chamonix", lat: 45.9237, lon: 6.8694 },
      { name: "Normandy Beaches", lat: 49.3389, lon: -0.5721 }
    ]
  },
  japan: {
    places: [
      { name: "Mount Fuji", lat: 35.3606, lon: 138.7274 },
      { name: "Tokyo Tower", lat: 35.6586, lon: 139.7454 },
      { name: "Fushimi Inari Shrine", lat: 34.9671, lon: 135.7727 },
      { name: "Kinkaku-ji (Golden Pavilion)", lat: 35.0394, lon: 135.7292 },
      { name: "Himeji Castle", lat: 34.8394, lon: 134.6939 },
      { name: "Osaka Castle", lat: 34.6873, lon: 135.5262 },
      { name: "Shibuya Crossing", lat: 35.6595, lon: 139.7005 },
      { name: "Nara Park", lat: 34.6851, lon: 135.8048 },
      { name: "Arashiyama Bamboo Grove", lat: 35.0094, lon: 135.6675 },
      { name: "Itsukushima Shrine", lat: 34.2956, lon: 132.3199 }
    ]
  },
  italy: {
    places: [
      { name: "Colosseum", lat: 41.8902, lon: 12.4922 },
      { name: "Venice Canals", lat: 45.4408, lon: 12.3155 },
      { name: "Leaning Tower of Pisa", lat: 43.7229, lon: 10.3966 },
      { name: "Vatican City", lat: 41.9029, lon: 12.4534 },
      { name: "Amalfi Coast", lat: 40.6346, lon: 14.6029 },
      { name: "Florence Cathedral", lat: 43.7731, lon: 11.256 },
      { name: "Pompeii Ruins", lat: 40.7484, lon: 14.4866 },
      { name: "Milan Cathedral", lat: 45.4642, lon: 9.1916 },
      { name: "Lake Como", lat: 46.0167, lon: 9.2667 },
      { name: "Cinque Terre", lat: 44.1341, lon: 9.6544 }
    ]
  },
  usa: {
    places: [
      { name: "Statue of Liberty", lat: 40.6892, lon: -74.0445 },
      { name: "Grand Canyon", lat: 36.0544, lon: -112.1401 },
      { name: "Yellowstone National Park", lat: 44.428, lon: -110.5885 },
      { name: "Times Square", lat: 40.758, lon: -73.9855 },
      { name: "Golden Gate Bridge", lat: 37.8199, lon: -122.4783 },
      { name: "Las Vegas Strip", lat: 36.1147, lon: -115.1728 },
      { name: "Hollywood Sign", lat: 34.1341, lon: -118.3215 },
      { name: "Walt Disney World", lat: 28.3852, lon: -81.5639 },
      { name: "White House", lat: 38.8977, lon: -77.0365 },
      { name: "Niagara Falls", lat: 43.0962, lon: -79.0377 }
    ]
  },
  nigeria: {
    places: [
      { name: "Zuma Rock", lat: 9.1213, lon: 7.2431 },
      { name: "Olumo Rock", lat: 7.1608, lon: 3.3515 },
      { name: "Erin Ijesha Waterfall", lat: 7.5922, lon: 4.9248 },
      { name: "Aso Rock", lat: 9.0579, lon: 7.4958 },
      { name: "Lekki Conservation Centre", lat: 6.4414, lon: 3.5311 },
      { name: "Obudu Mountain Resort", lat: 6.3862, lon: 9.3768 },
      { name: "Yankari National Park", lat: 9.7992, lon: 10.5015 },
      { name: "Ikogosi Warm Springs", lat: 7.6294, lon: 5.0006 },
      { name: "Ogbunike Caves", lat: 6.1969, lon: 6.9182 },
      { name: "National Theatre Lagos", lat: 6.4854, lon: 3.3833 }
    ]
  }
};

let map;

function searchCountry() {
  const input = document.getElementById("countryInput").value.toLowerCase().trim();
  const country = countries[input];
  if (!country) {
    alert("Country not available yet.");
    return;
  }

  // Fetch Wikipedia summary for the country history
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${input}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("history").innerHTML = `
        <h2>History of ${input.charAt(0).toUpperCase() + input.slice(1)}</h2>
        <p>${data.extract}</p>
      `;
    })
    .catch(() => {
      document.getElementById("history").innerHTML = `<h2>History of ${input.charAt(0).toUpperCase() + input.slice(1)}</h2><p>History info unavailable.</p>`;
    });

  // Show places list
  const placesHTML = country.places.map(p => `<li>${p.name}</li>`).join("");
  document.getElementById("places").innerHTML = `
    <h2>Top 10 Places to Visit</h2>
    <ol>${placesHTML}</ol>
  `;

  // Show map with markers
  if (map) map.remove();
  map = L.map('map').setView([country.places[0].lat, country.places[0].lon], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  country.places.forEach(place => {
    L.marker([place.lat, place.lon]).addTo(map).bindPopup(place.name);
  });
}

// Dark mode toggle button
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
