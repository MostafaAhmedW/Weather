// TODAY VARIABELS

var todayName = document.querySelector("#today_date_day_name");
var todayNumber = document.querySelector("#today_date_day_number");
var todayMonth = document.querySelector("#today_date_day_month");
var todayLocation = document.querySelector("#today_location");
var todayTemp = document.querySelector("#today_temp");
var todayConditionImg = document.querySelector("#today_condation_img");
var todayConditionText = document.querySelector("#today_condation_text");
var humidity = document.querySelector("#humidity");
var wind = document.querySelector("#wind");
var wind_direction = document.querySelector("#wind_direction");

// ==========================================

// NEXT DATA

var nextDay = document.querySelectorAll(".next_day_name");
var nextMaxTemp = document.querySelectorAll(".net_max_temp");
var nextMinTemp = document.querySelectorAll(".next_min_temp");
var nextConditionImg = document.querySelectorAll(".next_condation_img");
var nextConditionText = document.querySelectorAll(".next_condition_text");

// ==========================================

// search input

var searchInput = document.getElementById("search");
// ==========================================

async function getweatherData(cityName) {
  var weatherResponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=80ae75839c874b6c985193552250207&q=${cityName}&days=3`
  );

  var weatherData = await weatherResponse.json();

  return weatherData;
}

function displayTodayData(data) {
  todayLocation.innerHTML = data.location.name;
  todayTemp.innerHTML = data.current.temp_c;
  todayConditionImg.setAttribute("src", `http:${data.current.condition.icon}`);
  todayConditionText.innerHTML = data.current.condition.text;
  humidity.innerHTML = data.current.humidity + "%";
  wind.innerHTML = data.current.wind_kph + "km/h";
  wind_direction.innerHTML = data.current.wind_dir;

  var todayDte = new Date();

  todayName.innerHTML = todayDte.toLocaleDateString("en-US", {
    weekday: "long",
  });
  todayNumber.innerHTML = todayDte.getDate();
  todayMonth.innerHTML = todayDte.toLocaleDateString("en-US", {
    month: "long",
  });
}

function dispalyNextDayData(data) {
  var forecast = data.forecast.forecastday;

  for (var i = 0; i < 2; i++) {
    nextMaxTemp[i].innerHTML = forecast[i + 1].day.maxtemp_c;

    nextMinTemp[i].innerHTML = forecast[i + 1].day.mintemp_c;

    nextConditionImg[i].setAttribute(
      "src",
      `https:${forecast[i + 1].day.condition.icon}`
    );

    nextConditionText[i].innerHTML = forecast[i + 1].day.condition.text;

    var nextDate = new Date(forecast[i + 1].date);

    nextDay[i].innerHTML = nextDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }
}

async function startApp(city = "cairo") {
  
  if (typeof city === "string") {
    weatherData = await getweatherData(city);
  } else if (typeof city === "object" && city.latitude && city.longitude) {
    weatherData = await getweatherData(`${city.latitude},${city.longitude}`);
  }

  if (!weatherData.error) {
    displayTodayData(weatherData);
    dispalyNextDayData(weatherData);
  }
}
startApp();

searchInput.addEventListener("input", function () {
  startApp(searchInput.value);
});

// =================== GEOLOCATION SUPPORT ===================

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      startApp(coords); 
    },
  );
} 
