var apiKey = "80ae75839c874b6c985193552250207";

var searchInput = document.querySelector("#searchInput");
var cardsContainer = document.querySelector("#cardsContainer");

var myRequast = new XMLHttpRequest();
var data = [];

myRequast.open(
  "GET",
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=cairo&days=3`
);
myRequast.send();
myRequast.responseType = "json";

myRequast.addEventListener("load", function () {
  if (myRequast.status == 200) {
    console.log(myRequast.response);
    data = myRequast.response;
    displayPosts();
  }
});

function displayPosts() {
  var cartona = ``;

  for (var i = 0; i < data.forecast.forecastday.length; i++) {
    var dayData = data.forecast.forecastday[i];
    var dayName = new Date(dayData.date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    var date = dayData.date;
    var temp = dayData.day.avgtemp_c;
    var icon = "https:" + dayData.day.condition.icon;
    var condition = dayData.day.condition.text;
    var humidity = dayData.day.avghumidity;
    var wind = dayData.day.maxwind_kph;
    var dir = dayData.day.maxwind_dir;

    cartona += `
      <div class="col-md-4">
        <div class="weather-card text-center p-3 bg-dark text-white rounded">
          <div class="small day">${dayName}</div>
          <div class="small date">${date}</div>
          <h3 class="city">${data.location.name}</h3>
          <h2 class="temp">${temp}°C</h2>
          <div class="small min">${dayData.day.mintemp_c}°C</div>
          <img class="icon" src="${icon}" alt="${condition}">
          <div class="desc">${condition}</div>
          <div class="extras d-flex justify-content-between">
            <div class="humidity"> ${humidity}%</div>
            <div class="wind">🌬 ${wind} km/h</div>

          </div>
        </div>
      </div>
    `;
  }

  cardsContainer.innerHTML = cartona;
}

searchInput.addEventListener("input", function () {
  var city = searchInput.value.trim();
  if (city.length >= 3) {
    getWeather(city);
  }
});

function getWeather(city) {
  var request = new XMLHttpRequest();
  var url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

  request.open("GET", url);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    if (request.status === 200) {
      data = request.response;
      displayPosts();
    }
  };
}

getWeather("cairo");

searchInput.addEventListener("input", function () {
  var city = searchInput.value.trim();
  if (city.length >= 3) {
    getWeather(city);
  }
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var coords = lat + "," + lon;
    getWeather(coords);
  });
} else {
  console.warn("Geolocation not supported");
  getWeather("cairo");
}
