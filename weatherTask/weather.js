import express, { json } from "express";
import { config } from "dotenv";
// import "../src/config/connectDb.js";
import axios from "axios";
import { schedule } from "node-cron";
import { Schema, model, connect } from "mongoose";

const app = express();
config();

connect("mongodb://localhost:27017/Weather-DB")

app.use(json());

const weatherDataSchema = new Schema({
    city: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    windSpeed: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
});

const WeatherData = model("WeatherData", weatherDataSchema);

const fetchWeatherData = async () => {
    try {
        const openWeatherMapApiKey = "5cee29486b4b9f70919db5b6861a69e6";
        const latitude = 31.558;
        const longitude = 74.3507;
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}`;

        const weatherApiResponse = await axios.get(weatherApiUrl);

        if (weatherApiResponse.data.main && weatherApiResponse.data.wind && weatherApiResponse.data.name) {
            const temperature = weatherApiResponse.data.main.temp - 273.15;
            const humidity = weatherApiResponse.data.main.humidity;
            const windSpeed = weatherApiResponse.data.wind.speed;
            const cityName = weatherApiResponse.data.name;

            console.log(`City: ${cityName}`);
            console.log(`Temperature: ${temperature.toFixed(2)} Celsius`);
            console.log(`Humidity: ${humidity}%`);
            console.log(`Wind Speed: ${windSpeed} m/s`);

            const currentDate = new Date();
            const timestampOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            };
            const timestamp = currentDate.toLocaleString('en-US', timestampOptions);

            const weatherDataRecord = new WeatherData({
                city: cityName,
                temperature: temperature.toFixed(2),
                humidity,
                windSpeed,
                timestamp,
            });

            await weatherDataRecord.save();
            console.log("Weather data saved to MongoDB.");
        } else {
            console.error("Unexpected API response structure. Unable to retrieve current weather data.");
        }
    } catch (error) {
        console.error('Error fetching or saving weather data:', error.message);
    }
};

schedule('*/1 * * * *', fetchWeatherData);


