// pages/insights.js
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Define ideal growing conditions for different crops
// Define ideal growing conditions for a wider variety of crops
const cropConditions = {
    wheat: { minTemp: 10, maxTemp: 25, minRainfall: 200, maxRainfall: 450 },
    corn: { minTemp: 15, maxTemp: 35, minRainfall: 300, maxRainfall: 600 },
    rice: { minTemp: 20, maxTemp: 35, minRainfall: 1000, maxRainfall: 2000 },
    barley: { minTemp: 5, maxTemp: 20, minRainfall: 200, maxRainfall: 400 },
    soybeans: { minTemp: 15, maxTemp: 30, minRainfall: 450, maxRainfall: 900 },
    sugarcane: { minTemp: 18, maxTemp: 35, minRainfall: 1200, maxRainfall: 2500 },
  };
  

// Generate dummy data for weather, crop performance, and resource usage
const generateDummyData = () => {
  const data = [];

  for (let i = 1; i <= 12; i++) {
    data.push({
      month: `Month ${i}`,
      temperature: Math.floor(Math.random() * (35 - 15 + 1)) + 15, // Random temp between 15-35°C
      rainfall: Math.floor(Math.random() * (200 - 50 + 1)) + 50, // Random rainfall (mm)
      cropYield: Math.floor(Math.random() * (300 - 100 + 1)) + 100, // Crop yield
      cropHealth: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Crop health %
      waterUsage: Math.floor(Math.random() * (500 - 200 + 1)) + 200, // Water usage (liters)
      fertilizerUsage: Math.floor(Math.random() * (100 - 30 + 1)) + 30, // Fertilizer usage (kg)
    });
  }

  return data;
};

export default function Insights() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dummyData = generateDummyData();
    setData(dummyData);
  }, []);

  const insights = (data) => {
    const avgTemp = data.reduce((sum, entry) => sum + entry.temperature, 0) / data.length;
    const avgRainfall = data.reduce((sum, entry) => sum + entry.rainfall, 0) / data.length;

    // Determine the best crop to plant based on weather patterns
    const bestCropToPlant = Object.keys(cropConditions).reduce((bestCrop, crop) => {
      const conditions = cropConditions[crop];
      const matches = data.filter(
        (entry) =>
          entry.temperature >= conditions.minTemp &&
          entry.temperature <= conditions.maxTemp &&
          entry.rainfall >= conditions.minRainfall &&
          entry.rainfall <= conditions.maxRainfall
      );

      return matches.length > (bestCrop.matches?.length || 0) ? { crop, matches } : bestCrop;
    }, {});

    return {
      avgTemp,
      avgRainfall,
      bestCropToPlant: bestCropToPlant.crop || "None",
      plantingMonths: bestCropToPlant.matches?.map((entry) => entry.month) || [],
    };
  };

  const { avgTemp, avgRainfall, bestCropToPlant, plantingMonths } = insights(data);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detailed Crop Insights</h1>
      <p>Visualizations and recommendations based on weather, crop performance, and resource usage data.</p>

      {/* Weather Patterns Chart */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weather Patterns</CardTitle>
          <CardDescription>Temperature and Rainfall over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
              <Line type="monotone" dataKey="rainfall" stroke="#82ca9d" name="Rainfall (mm)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Crop Performance Chart */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Crop Performance</CardTitle>
          <CardDescription>Crop Yield and Health over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cropYield" fill="#8884d8" name="Crop Yield (kg)" />
              <Bar dataKey="cropHealth" fill="#82ca9d" name="Crop Health (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Usage Chart */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>Water and Fertilizer usage over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="waterUsage" stroke="#8884d8" name="Water Usage (L)" />
              <Line type="monotone" dataKey="fertilizerUsage" stroke="#82ca9d" name="Fertilizer Usage (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Insights and Recommendations</CardTitle>
          <CardDescription>Specific recommendations for planting based on weather patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Average Temperature: {avgTemp.toFixed(2)}°C</p>
          <p>Average Rainfall: {avgRainfall.toFixed(2)} mm</p>
          <p>
            <strong>Best Crop to Plant:</strong> {bestCropToPlant}
          </p>
          <p>
            <strong>Optimal Planting Months:</strong> {plantingMonths.length ? plantingMonths.join(", ") : "None"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
