// ==========================================
// WEATHERNOW - PROFESSIONAL WEATHER APP
// ==========================================

const API_KEY = "YOUR_API_KEY_HERE";


// ==========================================
// DOM ELEMENTS
// ==========================================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherContainer =
    document.getElementById("weatherContainer");

const welcome =
    document.getElementById("welcome");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const weatherCondition =
    document.getElementById("weatherCondition");

const weatherIcon =
    document.getElementById("weatherIcon");

const dateTime =
    document.getElementById("dateTime");


// ==========================================
// EVENTS
// ==========================================

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// ==========================================
// MAIN WEATHER FUNCTION
// ==========================================

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    clearError();
    showLoading();

    try {

        // --------------------------------------
        // STEP 1: GEOCODING
        // Convert city name → latitude/longitude
        // --------------------------------------

        const geoURL =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;

        const geoResponse = await fetch(geoURL);

        const locations = await geoResponse.json();

        if (!geoResponse.ok) {
            throw new Error(
                locations.message || "Unable to find location."
            );
        }

        if (locations.length === 0) {
            throw new Error(
                "City not found. Please check the spelling."
            );
        }


        // --------------------------------------
        // Select first matching location
        // --------------------------------------

        const location = locations[0];

        const latitude = location.lat;
        const longitude = location.lon;


        // --------------------------------------
        // STEP 2: CURRENT WEATHER
        // --------------------------------------

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error(
                weatherData.message ||
                "Unable to fetch weather data."
            );
        }


        // --------------------------------------
        // STEP 3: DISPLAY DATA
        // --------------------------------------

        displayWeather(
            weatherData,
            location
        );


    } catch (error) {

        console.error("Weather Error:", error);

        showError(error.message);

        weatherContainer.classList.add("hidden");

        welcome.classList.remove("hidden");

    } finally {

        hideLoading();

    }
}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(data, location) {

    // City
    cityName.textContent =
        location.name;


    // Country
    countryName.textContent =
        location.country;


    // Temperature
    temperature.textContent =
        Math.round(data.main.temp);


    // Feels like
    feelsLike.textContent =
        Math.round(data.main.feels_like);


    // Humidity
    humidity.textContent =
        data.main.humidity;


    // Wind speed
    windSpeed.textContent =
        data.wind.speed;


    // Pressure
    pressure.textContent =
        data.main.pressure;


    // Visibility
    visibility.textContent =
        (data.visibility / 1000).toFixed(1);


    // Weather condition
    weatherCondition.textContent =
        data.weather[0].description;


    // Weather icon
    const iconCode =
        data.weather[0].icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    weatherIcon.alt =
        data.weather[0].description;


    // Sunrise
    sunrise.textContent =
        formatTime(data.sys.sunrise);


    // Sunset
    sunset.textContent =
        formatTime(data.sys.sunset);


    // Current date and time
    dateTime.textContent =
        new Date().toLocaleString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // Show weather dashboard
    weatherContainer.classList.remove("hidden");

    welcome.classList.add("hidden");
}


// ==========================================
// UNIX TIMESTAMP → TIME
// ==========================================

function formatTime(timestamp) {

    return new Date(timestamp * 1000)
        .toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherContainer.classList.add("hidden");

    welcome.classList.add("hidden");

}


function hideLoading() {

    loading.classList.add("hidden");

}


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(message) {

    errorMessage.textContent = message;

}


function clearError() {

    errorMessage.textContent = "";

}