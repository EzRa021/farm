"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Automation() {
  // States for irrigation automation
  const [irrigationEnabled, setIrrigationEnabled] = useState(false);
  const [irrigationThreshold, setIrrigationThreshold] = useState(30); // Default soil moisture threshold
  const [loadingIrrigation, setLoadingIrrigation] = useState(true);
  const [savingIrrigation, setSavingIrrigation] = useState(false);

  // States for stock ordering automation
  const [stockEnabled, setStockEnabled] = useState(false);
  const [stockThreshold, setStockThreshold] = useState(10); // Default stock quantity threshold
  const [loadingStock, setLoadingStock] = useState(true);
  const [savingStock, setSavingStock] = useState(false);

  // States for fertilizer automation
  const [fertilizerEnabled, setFertilizerEnabled] = useState(false);
  const [fertilizerInterval, setFertilizerInterval] = useState(30); // Fertilize every X days
  const [loadingFertilizer, setLoadingFertilizer] = useState(true);
  const [savingFertilizer, setSavingFertilizer] = useState(false);

  // States for pest control automation
  const [pestControlEnabled, setPestControlEnabled] = useState(false);
  const [pestThreshold, setPestThreshold] = useState(50); // Default pest threshold
  const [loadingPestControl, setLoadingPestControl] = useState(true);
  const [savingPestControl, setSavingPestControl] = useState(false);

  // Fetch irrigation automation rule from Firestore
  useEffect(() => {
    const fetchIrrigationRule = async () => {
      setLoadingIrrigation(true);
      try {
        const docRef = doc(db, "automationRules", "irrigationRule");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ruleData = docSnap.data();
          setIrrigationEnabled(ruleData.enabled);
          setIrrigationThreshold(ruleData.threshold);
        }
      } catch (error) {
        console.error("Error fetching irrigation rule:", error);
      }
      setLoadingIrrigation(false);
    };

    fetchIrrigationRule();
  }, []);

  // Fetch stock ordering automation rule from Firestore
  useEffect(() => {
    const fetchStockRule = async () => {
      setLoadingStock(true);
      try {
        const docRef = doc(db, "automationRules", "stockOrderRule");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ruleData = docSnap.data();
          setStockEnabled(ruleData.enabled);
          setStockThreshold(ruleData.threshold);
        }
      } catch (error) {
        console.error("Error fetching stock rule:", error);
      }
      setLoadingStock(false);
    };

    fetchStockRule();
  }, []);

  // Fetch fertilizer automation rule from Firestore
  useEffect(() => {
    const fetchFertilizerRule = async () => {
      setLoadingFertilizer(true);
      try {
        const docRef = doc(db, "automationRules", "fertilizerRule");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ruleData = docSnap.data();
          setFertilizerEnabled(ruleData.enabled);
          setFertilizerInterval(ruleData.interval);
        }
      } catch (error) {
        console.error("Error fetching fertilizer rule:", error);
      }
      setLoadingFertilizer(false);
    };

    fetchFertilizerRule();
  }, []);

  // Fetch pest control automation rule from Firestore
  useEffect(() => {
    const fetchPestControlRule = async () => {
      setLoadingPestControl(true);
      try {
        const docRef = doc(db, "automationRules", "pestControlRule");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ruleData = docSnap.data();
          setPestControlEnabled(ruleData.enabled);
          setPestThreshold(ruleData.threshold);
        }
      } catch (error) {
        console.error("Error fetching pest control rule:", error);
      }
      setLoadingPestControl(false);
    };

    fetchPestControlRule();
  }, []);

  // Save irrigation automation rule to Firestore
  const saveIrrigationRule = async () => {
    setSavingIrrigation(true);
    try {
      const docRef = doc(db, "automationRules", "irrigationRule");
      await setDoc(docRef, {
        enabled: irrigationEnabled,
        threshold: irrigationThreshold,
        taskType: "irrigation",
      });
      toast("Irrigation automation rule saved!");
    } catch (error) {
      console.error("Error saving irrigation rule:", error);
      toast("Failed to save irrigation rule.");
    }
    setSavingIrrigation(false);
  };

  // Save stock ordering automation rule to Firestore
  const saveStockRule = async () => {
    setSavingStock(true);
    try {
      const docRef = doc(db, "automationRules", "stockOrderRule");
      await setDoc(docRef, {
        enabled: stockEnabled,
        threshold: stockThreshold,
        taskType: "stockOrder",
      });
      toast("Stock ordering automation rule saved!");
    } catch (error) {
      console.error("Error saving stock rule:", error);
      toast("Failed to save stock rule.");
    }
    setSavingStock(false);
  };

  // Save fertilizer automation rule to Firestore
  const saveFertilizerRule = async () => {
    setSavingFertilizer(true);
    try {
      const docRef = doc(db, "automationRules", "fertilizerRule");
      await setDoc(docRef, {
        enabled: fertilizerEnabled,
        interval: fertilizerInterval,
        taskType: "fertilizer",
      });
      toast("Fertilizer automation rule saved!");
    } catch (error) {
      console.error("Error saving fertilizer rule:", error);
      toast("Failed to save fertilizer rule.");
    }
    setSavingFertilizer(false);
  };

  // Save pest control automation rule to Firestore
  const savePestControlRule = async () => {
    setSavingPestControl(true);
    try {
      const docRef = doc(db, "automationRules", "pestControlRule");
      await setDoc(docRef, {
        enabled: pestControlEnabled,
        threshold: pestThreshold,
        taskType: "pestControl",
      });
      toast("Pest control automation rule saved!");
    } catch (error) {
      console.error("Error saving pest control rule:", error);
      toast("Failed to save pest control rule.");
    }
    setSavingPestControl(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Task Automation</h1>
      <p>Manage automation rules for tasks like irrigation, stock ordering, fertilizing, and pest control.</p>

<div className=" grid grid-cols-2 gap-10">
       {/* Irrigation Automation Section */}
      <Card className="mt-4 max-w-full">
        <CardHeader>
          <CardTitle>Irrigation Automation</CardTitle>
          <CardDescription>
            Automatically water the crops when soil moisture drops below a certain level.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingIrrigation ? (
            <p>Loading irrigation settings...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span>Enable Irrigation Automation</span>
                <Switch
                  checked={irrigationEnabled}
                  onCheckedChange={setIrrigationEnabled}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="irrigationThreshold" className="block mb-1">
                  Soil Moisture Threshold (%)
                </label>
                <Input
                  id="irrigationThreshold"
                  type="number"
                  value={irrigationThreshold}
                  onChange={(e) => setIrrigationThreshold(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={saveIrrigationRule} className="w-full" disabled={savingIrrigation}>
            {savingIrrigation ? "Saving..." : "Save Irrigation Rule"}
          </Button>
        </CardFooter>
      </Card>

      {/* Stock Ordering Automation Section */}
      <Card className="mt-4 max-w-full">
        <CardHeader>
          <CardTitle>Stock Ordering Automation</CardTitle>
          <CardDescription>
            Automatically reorder stock when inventory levels drop below a certain threshold.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingStock ? (
            <p>Loading stock settings...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span>Enable Stock Ordering Automation</span>
                <Switch checked={stockEnabled} onCheckedChange={setStockEnabled} />
              </div>

              <div className="mb-4">
                <label htmlFor="stockThreshold" className="block mb-1">
                  Stock Quantity Threshold
                </label>
                <Input
                  id="stockThreshold"
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={saveStockRule} className="w-full" disabled={savingStock}>
            {savingStock ? "Saving..." : "Save Stock Rule"}
          </Button>
        </CardFooter>
      </Card>

      {/* Fertilizer Automation Section */}
      <Card className="mt-4 max-w-full">
        <CardHeader>
          <CardTitle>Fertilizer Automation</CardTitle>
          <CardDescription>
            Automatically apply fertilizer every X days.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingFertilizer ? (
            <p>Loading fertilizer settings...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span>Enable Fertilizer Automation</span>
                <Switch
                  checked={fertilizerEnabled}
                  onCheckedChange={setFertilizerEnabled}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="fertilizerInterval" className="block mb-1">
                  Fertilization Interval (Days)
                </label>
                <Input
                  id="fertilizerInterval"
                  type="number"
                  value={fertilizerInterval}
                  onChange={(e) => setFertilizerInterval(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={saveFertilizerRule} className="w-full" disabled={savingFertilizer}>
            {savingFertilizer ? "Saving..." : "Save Fertilizer Rule"}
          </Button>
        </CardFooter>
      </Card>

      {/* Pest Control Automation Section */}
      <Card className="mt-4 max-w-full">
        <CardHeader>
          <CardTitle>Pest Control Automation</CardTitle>
          <CardDescription>
            Automatically trigger pest control when the pest threshold is exceeded.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingPestControl ? (
            <p>Loading pest control settings...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span>Enable Pest Control Automation</span>
                <Switch
                  checked={pestControlEnabled}
                  onCheckedChange={setPestControlEnabled}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pestThreshold" className="block mb-1">
                  Pest Threshold (%)
                </label>
                <Input
                  id="pestThreshold"
                  type="number"
                  value={pestThreshold}
                  onChange={(e) => setPestThreshold(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={savePestControlRule} className="w-full" disabled={savingPestControl}>
            {savingPestControl ? "Saving..." : "Save Pest Control Rule"}
          </Button>
        </CardFooter>
      </Card>
</div>
   
    </div>
  );
}
