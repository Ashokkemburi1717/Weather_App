const apiKey = ''; // Replace with your OpenWeatherMap API key

// Elements
const status = document.getElementById('status');
const weatherInfo = document.getElementById('weather-info');
const locationEl = document.getElementById('location');
const tempEl = document.getElementById('temp');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const minmaxEl = document.getElementById('minmax');
const cloudsEl = document.getElementById('clouds');
const visibilityEl = document.getElementById('visibility');
const pressureEl = document.getElementById('pressure');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');
const refreshBtn = document.getElementById('refresh-btn');
const unitBtn = document.getElementById('unit-btn');

let currentWeather = null; // store weather response
let isCelsius = true;      // default unit

// 🔹 Fetch Current Weather
function getWeather(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Weather data not found');
      return response.json();
    })
    .then(data => {
      currentWeather = data; // save weather for switching

      status.style.display = 'none';
      weatherInfo.classList.remove('hidden');

      locationEl.textContent = `${data.name}, ${data.sys.country}`;
      updateTemperature();
      descriptionEl.textContent = data.weather[0].description;

      // Extra info
      minmaxEl.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
      humidityEl.textContent = `${data.main.humidity}%`;
      windEl.textContent = `${data.wind.speed} m/s`;
      cloudsEl.textContent = `${data.clouds.all}%`;
      visibilityEl.textContent = `${data.visibility / 1000} km`;
      pressureEl.textContent = `${data.main.pressure} hPa`;

      // Sunrise & Sunset (convert from UNIX to local time)
      sunriseEl.textContent = formatTime(data.sys.sunrise, data.timezone);
      sunsetEl.textContent = formatTime(data.sys.sunset, data.timezone);
       //  Call background function
      setBackground(data.weather[0].main);
    })
    .catch(error => {
      status.textContent = 'Failed to get weather data.';
      weatherInfo.classList.add('hidden');
      console.error(error);
    });
}

// 🔹 Update Temperature Based on Unit
function updateTemperature() {
  if (!currentWeather) return;
  const tempC = currentWeather.main.temp;
  const temp = isCelsius
    ? `${Math.round(tempC)}°C`
    : `${Math.round((tempC * 9/5) + 32)}°F`;
  tempEl.textContent = temp;
}

// 🔹 Switch Unit
function toggleUnit() {
  isCelsius = !isCelsius;
  updateTemperature();
  unitBtn.textContent = isCelsius ? "🌡 Switch °F" : "🌡 Switch °C";
}

// 🔹 Format Unix Time → Local Time
function formatTime(unixTime, timezoneOffset) {
  const date = new Date((unixTime + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// 🔹 Geolocation
function getLocationAndWeather() {
  status.textContent = 'Getting your location...';
  weatherInfo.classList.add('hidden');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      },
      error => {
        status.textContent = 'Geolocation permission denied or not available.';
        weatherInfo.classList.add('hidden');
        console.error(error);
      }
    );
  } else {
    status.textContent = 'Geolocation is not supported by this browser.';
  }
}

// Events
refreshBtn.addEventListener('click', getLocationAndWeather);
unitBtn.addEventListener('click', toggleUnit);

// Initial call
getLocationAndWeather();


//  Set background image based on weather condition
function setBackground(weather) {
  const body = document.body;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.transition = "background 0.5s ease-in-out";

  switch (weather.toLowerCase()) {
    case "clear":
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "clouds":
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "rain":
    case "drizzle":
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "thunderstorm":
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "snow":
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1608889177853-45e6b6e94c66?auto=format&fit=crop&w=1600&q=80')";
      break;
    default:
      body.style.backgroundImage = "linear-gradient(to right, #4facfe, #00f2fe)";
  }
}
