"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firestore instance
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Function to generate simulated weather data
const generateWeatherData = () => {
  return {
    date: new Date().toISOString(),
    temperature: Math.floor(Math.random() * (35 - 15 + 1)) + 15, // Temperature between 15-35°C
    rainfall: Math.floor(Math.random() * (200 - 50 + 1)) + 50, // Rainfall between 50-200 mm
    humidity: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Humidity between 50-100%
  };
};

// Function to generate detailed farm insights
const generateFarmInsights = (weather) => {
  let waterUsage = 100; // base water usage (liters per hectare per day)
  let cropHealth = 80; // base crop health (out of 100)

  // Adjust water usage based on temperature and rainfall
  if (weather.temperature > 30) {
    waterUsage += 30; // More water needed in higher temperature
  } else if (weather.temperature < 20) {
    waterUsage -= 20; // Less water needed in cooler temperature
  }

  if (weather.rainfall > 150) {
    waterUsage -= 50; // Less water needed due to rainfall
  }

  // Adjust crop health based on humidity and rainfall
  if (weather.humidity > 80) {
    cropHealth -= 20; // High humidity increases disease risk
  }

  if (weather.rainfall < 100) {
    cropHealth -= 10; // Low rainfall stresses crops
  } else if (weather.rainfall > 150) {
    cropHealth -= 10; // Too much rainfall may damage crops
  }

  return { waterUsage, cropHealth };
};

export default function Dashboard() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch historical weather data from Firestore
  const fetchWeatherData = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "weatherData"));
    const fetchedData = querySnapshot.docs.map((doc) => doc.data());
    setWeatherData(fetchedData);
    setLoading(false);
  };

  // Function to generate and save new weather data
  const saveNewWeatherData = async () => {
    const newWeather = generateWeatherData();
    try {
      await addDoc(collection(db, "weatherData"), newWeather);
      alert("New weather data saved!");
    } catch (error) {
      console.error("Error saving weather data:", error);
    }
  };

  useEffect(() => {
    // Fetch historical data from Firestore on component mount
    fetchWeatherData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard with Farm Insights</h1>

      {/* Save new weather data */}
      <Button onClick={saveNewWeatherData} className="mb-4">
        Generate & Save New Weather Data
      </Button>

      {loading ? (
        <p>Loading weather data...</p>
      ) : (
        <>
          {/* Weather Data Line Chart */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Historical Weather Data</CardTitle>
              <CardDescription>Temperature, Rainfall, and Humidity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="rainfall" stroke="#82ca9d" name="Rainfall (mm)" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Farm Insights based on the latest weather data */}
          {weatherData.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Farm Insights Based on Latest Weather</CardTitle>
                <CardDescription>
                  Based on weather patterns, we provide insights for water usage and crop health.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weatherData.slice(-1).map((weather) => {
                  const insights = generateFarmInsights(weather);
                  return (
                    <div key={weather.date}>
                      <p>
                        <strong>Date:</strong> {new Date(weather.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Temperature:</strong> {weather.temperature}°C
                      </p>
                      <p>
                        <strong>Rainfall:</strong> {weather.rainfall} mm
                      </p>
                      <p>
                        <strong>Humidity:</strong> {weather.humidity}%
                      </p>

                      <div className="mt-4">
                        <p><strong>Predicted Water Usage:</strong> {insights.waterUsage} liters per hectare per day</p>
                        <p><strong>Predicted Crop Health:</strong> {insights.cropHealth}/100</p>

                        {/* Recommendations */}
                        <div className="mt-4 font-semibold">
                          <p>Recommendations:</p>
                          {insights.waterUsage > 120 ? (
                            <p>- Ensure proper irrigation due to high temperature and low rainfall.</p>
                          ) : (
                            <p>- Moderate water usage due to sufficient rainfall.</p>
                          )}
                          {insights.cropHealth < 70 ? (
                            <p>- Monitor crops for disease due to high humidity or inconsistent rainfall.</p>
                          ) : (
                            <p>- Crop health looks stable under current conditions.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
