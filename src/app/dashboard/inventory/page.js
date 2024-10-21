"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore instance
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemThreshold, setNewItemThreshold] = useState(0);

  // Fetch inventory items from Firestore
  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setInventoryItems(items);
    };

    fetchInventory();
  }, []);

  // Add new inventory item
  const addItem = async () => {
    const newItem = {
      itemName: newItemName,
      quantity: parseInt(newItemQuantity, 10),
      threshold: parseInt(newItemThreshold, 10),
      alert: parseInt(newItemQuantity, 10) < parseInt(newItemThreshold, 10),
    };

    await addDoc(collection(db, "inventory"), newItem);
    setInventoryItems([...inventoryItems, newItem]);
  };

  // Update inventory item
  const updateItem = async (id, quantity) => {
    const itemRef = doc(db, "inventory", id);
    const item = inventoryItems.find(item => item.id === id);
    const updatedItem = { ...item, quantity, alert: quantity < item.threshold };

    await updateDoc(itemRef, updatedItem);
    setInventoryItems(inventoryItems.map(item => (item.id === id ? updatedItem : item)));
  };

  // Delete inventory item
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Add New Item Form */}
      <div className="mb-4 max-w-md">
        <h2 className="text-xl font-bold">Add New Item</h2>
        <div className="mb-2">
          <Input
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <Input
            placeholder="Quantity"
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <Input
            placeholder="Threshold"
            type="number"
            value={newItemThreshold}
            onChange={(e) => setNewItemThreshold(e.target.value)}
          />
        </div>
        <Button onClick={addItem}>Add Item</Button>
      </div>

      {/* Inventory List */}
      <h2 className="text-xl font-bold mb-2">Current Inventory</h2>
      <div className =" grid grid-cols-3 gap-5">{inventoryItems.map((item) => (
        <Card key={item.id} className="mb-4">
          <CardHeader>
            <CardTitle>{item.itemName}</CardTitle>
            <CardDescription>
              Quantity: {item.quantity} | Threshold: {item.threshold}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`mb-2 ${item.alert ? "text-red-500" : ""}`}>
              {item.alert ? "⚠️ Low Stock" : "In Stock"}
            </div>
            <Input
              placeholder="Update Quantity"
              type="number"
              defaultValue={item.quantity}
              onBlur={(e) => updateItem(item.id, parseInt(e.target.value, 10))}
            />
            <Button onClick={() => deleteItem(item.id)} className="mt-2">
              Remove Item
            </Button>
          </CardContent>
        </Card>
      ))}</div>
      
    </div>
  );
}
