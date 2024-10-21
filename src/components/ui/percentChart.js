"use client";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, getDocs } from "firebase/firestore";

// Initial simulated sensor data
const initialSensorData = {
  temperature: 25,
  soilMoisture: 70,
  cropHealth: 80,
};

// Firestore collection reference for storing sensor data
const sensorCollectionRef = collection(db, "sensorData");

// Define chart configuration for theming
const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  soilMoisture: {
    label: "Soil Moisture",
    color: "hsl(var(--chart-2))",
  },
  cropHealth: {
    label: "Crop Health",
    color: "hsl(var(--chart-3))",
  },
};

export function Chart() {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [historicalData, setHistoricalData] = useState([]);

  // Simulate real-time data change and save to Firestore
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newSensorData = {
        temperature: (Math.random() * 5 + 22).toFixed(1), // Random temp between 22-27
        soilMoisture: (Math.random() * 20 + 60).toFixed(1), // Moisture between 60-80
        cropHealth: (Math.random() * 10 + 75).toFixed(1), // Health between 75-85
        timestamp: new Date(),
      };

      setSensorData(newSensorData);
      addSensorDataToFirestore(newSensorData); // Store in Firestore
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Function to add data to Firestore
  const addSensorDataToFirestore = async (data) => {
    try {
      await addDoc(sensorCollectionRef, data);
    } catch (error) {
      console.error("Error saving sensor data: ", error);
    }
  };

  // Fetch historical data from Firestore (for monthly charts)
  useEffect(() => {
    const fetchHistoricalData = async () => {
      const q = query(sensorCollectionRef);
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      setHistoricalData(fetchedData);
    };

    fetchHistoricalData();
  }, []);

  // Process historical data to create monthlyData format
  const monthlyData = historicalData.slice(-6).map((data, index) => ({
    month: `Month ${index + 1}`,
    value: data.temperature, // Change this to match the required metric
    fill: `var(--color-${index % 6 + 1})`, // Add dynamic color
  }));

  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-2xl font-bold">Farm Monitoring Dashboard</h1>
      <p>Real-time sensor data and historical trends</p>

      {/* Real-Time Sensor Charts */}
      <div className="flex gap-8">
        <RealTimeCard title="Temperature" value={sensorData.temperature} unit="°C" />
        <RealTimeCard title="Soil Moisture" value={sensorData.soilMoisture} unit="%" />
        <RealTimeCard title="Crop Health" value={sensorData.cropHealth} unit="%" />
      </div>

      {/* Monthly Trend Charts */}
      <div className="flex gap-8">
        <TrendChart title="Temperature Trend" data={monthlyData} config={chartConfig.temperature} />
        <TrendChart title="Soil Moisture Trend" data={monthlyData} config={chartConfig.soilMoisture} />
        <TrendChart title="Crop Health Trend" data={monthlyData} config={chartConfig.cropHealth} />
      </div>
    </div>
  );
}

// Card to display real-time sensor data
export function RealTimeCard({ title, value, unit }) {
  return (
    <Card className="flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Real-Time Data</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="text-4xl font-bold">{value}{unit}</div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Data updated in real-time.
        </div>
      </CardFooter>
    </Card>
  );
}

// Trend chart for monthly data (Radial Chart)
export function TrendChart({ title, data, config }) {
  return (
    <Card className="flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Monthly Data</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            data={data}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {data[0]?.value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Value
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing monthly trends.
        </div>
      </CardFooter>
    </Card>
  );
}
