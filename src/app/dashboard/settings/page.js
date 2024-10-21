"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore instance
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function Settings() {
  // Dummy settings state for general settings
  const [farmName, setFarmName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch settings from Firestore (if already stored)
  useEffect(() => {
    const fetchSettings = async () => {
      setLoadingSettings(true);
      try {
        const docRef = doc(db, "settings", "farmSettings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFarmName(data.farmName);
          setOwnerName(data.ownerName);
          setLocation(data.location);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
      setLoadingSettings(false);
    };

    fetchSettings();
  }, []);

  // Save settings to Firestore
  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const docRef = doc(db, "settings", "farmSettings");
      await setDoc(docRef, { farmName, ownerName, location });
      toast("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast("Failed to save settings.");
    }
    setSavingSettings(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Farm Settings</h1>

      {/* Farm Information Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Farm Information</CardTitle>
          <CardDescription>Set general information about your farm.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSettings ? (
            <p>Loading settings...</p>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="farmName" className="block mb-1">Farm Name</label>
                <Input
                  id="farmName"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="ownerName" className="block mb-1">Owner Name</label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block mb-1">Location</label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings} disabled={savingSettings} className="w-full">
            {savingSettings ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      {/* Additional Settings (e.g., notifications, automation rules) */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Manage automation rules for your farm tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here you can configure automation settings (e.g., irrigation, stock ordering).</p>
          {/* Placeholder content for automation settings */}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Inventory Settings</CardTitle>
          <CardDescription>Manage alerts and stock thresholds.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Configure stock alerts and threshold limits for low inventory levels.</p>
          {/* Placeholder content for inventory settings */}
        </CardContent>
      </Card>

      {/* Placeholder for future settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Set notification preferences for low stock alerts and task automation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Manage email or SMS notifications for critical events.</p>
          {/* Placeholder for notifications content */}
        </CardContent>
      </Card>
    </div>
  );
}
