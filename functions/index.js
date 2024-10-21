const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Cloud Function to trigger irrigation based on soil moisture level
exports.checkIrrigationTrigger = functions.firestore
    .document("sensorData/{sensorId}")
    .onUpdate(async (change, context) => {
      const sensorData = change.after.data();

      const automationDoc = await db
          .collection("automationRules")
          .doc("irrigationRule")
          .get();

      if (automationDoc.exists) {
        const automationRule = automationDoc.data();

        if (
          automationRule.enabled &&
                sensorData.soilMoisture < automationRule.threshold
        ) {
          console.log(
              `Irrigation triggered! Soil Moisture:
                     ${sensorData.soilMoisture}%`,
          );
        }
      }
    });

// Cloud Function to trigger stock ordering based on stock level
exports.checkStockOrderTrigger = functions.firestore
    .document("inventory/{itemId}")
    .onUpdate(async (change, context) => {
      const itemData = change.after.data();

      const automationDoc = await db
          .collection("automationRules")
          .doc("stockOrderRule")
          .get();

      if (automationDoc.exists) {
        const automationRule = automationDoc.data();

        if (
          automationRule.enabled &&
                itemData.quantity < itemData.threshold
        ) {
          console.log(
              `Stock order triggered for ${itemData.itemName}.
                     Current quantity: ${itemData.quantity}`,
          );
        }
      }
    });
