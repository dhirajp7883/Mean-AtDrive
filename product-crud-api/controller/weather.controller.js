const asyncHandler = require("../middleware/asyncHandler");
const axios = require("axios");

// get weather data for a city
exports.getWeather = asyncHandler(async (req, res, next) => {
    const city = req.query.city || 'Mumbai';
    
    try {
        // Using Open-Meteo API (free, no API key required)
        // First get coordinates for the city using geocoding
        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            const error = new Error('City not found');
            error.statusCode = 404;
            return next(error);
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];

        // Get weather data using coordinates
        const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&timezone=auto`
        );

        const weatherData = weatherResponse.data;

        // Weather code descriptions
        const weatherDescriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };

        const weatherCode = weatherData.current.weather_code;
        const weatherDescription = weatherDescriptions[weatherCode] || 'Unknown';

        res.json({
            success: true,
            message: 'Weather data fetched successfully',
            data: {
                location: {
                    name: name,
                    country: country,
                    latitude: latitude,
                    longitude: longitude
                },
                current: {
                    temperature: weatherData.current.temperature_2m,
                    feels_like: weatherData.current.apparent_temperature,
                    humidity: weatherData.current.relative_humidity_2m,
                    wind_speed: weatherData.current.wind_speed_10m,
                    precipitation: weatherData.current.precipitation,
                    cloud_cover: weatherData.current.cloud_cover,
                    weather_code: weatherCode,
                    weather_description: weatherDescription,
                    is_day: weatherData.current.is_day === 1
                },
                units: weatherData.current_units
            }
        });

    } catch (error) {
        const err = new Error('Error connecting to weather API');
        err.statusCode = 503;
        return next(err);
    }
});
