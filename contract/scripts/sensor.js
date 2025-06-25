const { ethers } = require("hardhat");
const admin = require("firebase-admin");
const { setInterval } = require("timers/promises");

// Initialize Firebase
const serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

// Configuration
// const POLL_INTERVAL = 3600000; // 1 hour = 60 mins × 60 secs × 1000 ms
const POLL_INTERVAL = 10000; // 10 seconds
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const MAX_RETRIES = 1;

async function processDevice(contract, deviceId, deviceData, attempt = 1) {
  console.log(`\n📡 [Attempt ${attempt}] Processing ${deviceId}`);
  console.log('📊 Raw Data:', JSON.stringify({
    moisture: deviceData.moisture,
    temperature: deviceData.temperature,
    humidity: deviceData.humidity,
    status: deviceData.status,
    timestamp: new Date(deviceData.timestamp).toISOString()
  }, null, 2));

  try {
    const tx = await contract.recordSensorData(
      deviceId,
      Math.floor(deviceData.moisture),
      Math.floor(parseFloat(deviceData.temperature) * 100),
      Math.floor(parseFloat(deviceData.humidity) * 100),
      deviceData.status,
      deviceData.local_date,
      deviceData.local_time,
      deviceData.timestamp,
      { 
        gasLimit: 800000,
        nonce: await contract.runner.provider.getTransactionCount(contract.runner.address)
      }
    );

    console.log(`✅ Success! TX Hash: ${tx.hash}`);
    return true;
  } catch (error) {
    console.log(`❌ Attempt ${attempt} failed: ${error.reason || error.message}`);
    
    if (attempt < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      return processDevice(contract, deviceId, deviceData, attempt + 1);
    }
    return false;
  }
}

async function pollDevices() {
  const startTime = Date.now();
  console.log(`\n🔄 [${new Date().toISOString()}] Polling devices...`);

  try {
    const africropDAO = await ethers.getContractFactory("AfriCropDAO");
    const contract = await africropDAO.attach(CONTRACT_ADDRESS);
    const db = admin.database();

    const snapshot = await db.ref('sensor_data').once('value');
    if (!snapshot.exists()) {
      console.log("⚠️ No devices found in Firebase");
      return;
    }

    const processingResults = await Promise.all(
      Object.entries(snapshot.val()).map(([deviceId, data]) => 
        processDevice(contract, deviceId, data)
      )
    );

    const successCount = processingResults.filter(Boolean).length;
    console.log(`\n🏁 Completed in ${(Date.now() - startTime)/1000}s`);
    console.log(`   Success: ${successCount}, Failed: ${processingResults.length - successCount}`);
  } catch (error) {
    console.log(`⛔ Polling error: ${error.message}`);
  }
}

async function main() {
  console.log(`
  █████╗ ███████╗██╗  ██╗ ██████╗ ██████╗ 
 ██╔══██╗██╔════╝██║  ██║██╔═══██╗██╔══██╗
 ███████║█████╗  ███████║██║   ██║██████╔╝
 ██╔══██║██╔══╝  ██╔══██║██║   ██║██╔═══╝ 
 ██║  ██║██║     ██║  ██║╚██████╔╝██║     
 ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
  `);
  console.log('🚀 Starting Firebase-to-Blockchain Sync');
  console.log(`⏳ Polling every ${POLL_INTERVAL/1000} seconds (Press Ctrl+C to stop)\n`);

  try {
    await pollDevices();
    for await (const _ of setInterval(POLL_INTERVAL)) {
      await pollDevices();
    }
  } catch (err) {
    console.log(`⛔ Critical error: ${err.message}`);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log("\n🛑 Received shutdown signal");
  console.log('👋 Sync service stopped');
  process.exit(0);
});

main();