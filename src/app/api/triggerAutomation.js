import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    // Fetch sensor data from Firestore (for irrigation)
    const sensorSnapshot = await getDocs(collection(db, "sensorData"));
    const sensorData = sensorSnapshot.docs.map((doc) => doc.data());

    // Fetch stock data from Firestore (for stock ordering)
    const stockSnapshot = await getDocs(collection(db, "inventory"));
    const stockData = stockSnapshot.docs.map((doc) => doc.data());

    // Automation logic: Check sensor data (for irrigation)
    sensorData.forEach((sensor) => {
      if (sensor.soilMoisture < 30) {
        console.log(`Irrigation triggered! Soil Moisture: ${sensor.soilMoisture}%`);
        // You can add your external IoT trigger logic here
      }
    });

    // Automation logic: Check stock levels (for stock ordering)
    stockData.forEach((item) => {
      if (item.quantity < item.threshold) {
        console.log(`Stock order triggered for ${item.itemName}. Current quantity: ${item.quantity}`);
        // You can add your stock order logic here (e.g., send notification or order)
      }
    });

    // Return success response
    res.status(200).json({ message: "Automation checks completed successfully." });
  } catch (error) {
    console.error("Error triggering automation:", error);
    res.status(500).json({ message: "Error triggering automation." });
  }
}
