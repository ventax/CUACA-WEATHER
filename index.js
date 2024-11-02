const apiKey = 'eadecff370d9fe222cda0d2dbfbe03c8';
const Locbutton = document.querySelector('.Loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// mapping of weather condition codes to icon class names (depending on openweather api response)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Fetch weather data from API
    fetch(apiUrl) 
        .then(response => response.json())
        .then(data => {
            // Update information for today
            const todayWeather = data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeatherIconCode = data.list[0].weather[0].icon; // Fixed typo 'weeather' to 'weather'

            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            todayTemp.textContent = todayTemperature;

            // Update location and weather description in left-info
            const LocationElement = document.querySelector('.today-info > div > span');
            LocationElement.textContent = `${data.city.name}, ${data.city.country}`; // Fixed typo 'className' to 'name'

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            // Update info in day-info
            const todayPrecipitation = `${data.list[0].pop}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
                <div>
                    <span class="title">PRECIPITATION</span>
                    <span class="Value">${todayPrecipitation}</span>
                </div>
                <div>
                    <span class="title">HUMIDITY</span>
                    <span class="Value">${todayHumidity}</span>
                </div>
                <div>
                    <span class="title">WIND SPEED</span>
                    <span class="Value">${todayWindSpeed}</span>
                </div>
            `;

            // Update for the next 4 days
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set(); 
            let count = 0;
            daysList.innerHTML = '';
            for (const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon; 

                if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                }

                // Stop after getting 4 days
                if (count === 4) break;
            }
        })
        .catch(error => {
            alert(`Error fetching weather data: ${error} (API Error)`);
        });
}

// Fetch weather data on document loaded for default location (Indonesia)
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Indonesia';
    fetchWeatherData(defaultLocation);
});

Locbutton.addEventListener('click', () => {
    const location = prompt('Enter a Location:');
    if (!location) return;

    fetchWeatherData(location);
});
