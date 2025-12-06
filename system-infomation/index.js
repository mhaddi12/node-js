const express = require("express");
const si = require("systeminformation");
const find = require("local-devices");
const os = require("os");

const app = express();

// --- Cache setup ---
const cache = {};
const CACHE_TTL = 5000; // 5 seconds

// Get cached data or refresh
const getCached = async (key, fn) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_TTL) {
    return cache[key].data;
  }
  const data = await fn();
  cache[key] = { data, timestamp: now };
  return data;
};

// --- Helper: get local IP ---
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
};

// --- Endpoint: connected devices ---
app.get("/connected-devices", async (req, res) => {
  try {
    const devices = await find();
    res.json({ success: true, count: devices.length, devices });
  } catch (err) {
    console.error("Error scanning network:", err);
    res.status(500).json({ success: false, message: "Failed to fetch devices" });
  }
});

// --- Endpoint: system info ---
app.get("/system-info", async (req, res) => {
  try {
    const system = await getCached("system", si.system);
    const osInfo = await getCached("os", si.osInfo);
    const memory = await getCached("memory", si.mem);
    const battery = await getCached("battery", si.battery);

    const cpuLoad = await getCached("cpuLoad", si.currentLoad);
    const cpuTemp = await getCached("cpuTemp", si.cpuTemperature);
    const cpu = await getCached("cpu", si.cpu);
    const gpu = await getCached("gpu", si.graphics);
    const disks = await getCached("disks", si.fsSize);
    const networkStats = await getCached("network", si.networkStats);

    res.json({
      timestamp: Date.now(),
      system: {
        manufacturer: system.manufacturer,
        model: system.model,
        pcName: osInfo.hostname,
        platform: osInfo.platform,
        distro: osInfo.distro,
        uptime: osInfo.uptime,
      },
      cpu: {
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        speed: cpu.speed,
        temp: cpuTemp.main,
        maxTemp: cpuTemp.max,
        load: cpuLoad.currentLoad,
        perCoreLoad: cpuLoad.cpus,
      },
      memory: {
        total: memory.total,
        used: memory.used,
        free: memory.free,
        active: memory.active,
        available: memory.available,
        swapTotal: memory.swaptotal,
        swapUsed: memory.swapused,
      },
      battery: {
        hasBattery: battery.hasBattery,
        percent: battery.percent,
        charging: battery.isCharging,
        temp: battery.temperature,
      },
      gpu: gpu.controllers.map((g) => ({
        model: g.model,
        vram: g.vram,
        bus: g.bus,
        temp: g.temperatureGpu,
      })),
      disks: disks.map((d) => ({
        mount: d.mount,
        type: d.type,
        size: d.size,
        used: d.used,
      })),
      network: networkStats.map((n) => ({
        iface: n.iface,
        rx: n.rx_bytes,
        tx: n.tx_bytes,
        rxSpeed: n.rx_sec,
        txSpeed: n.tx_sec,
        operstate: n.operstate,
      })),
    });
  } catch (err) {
    console.error("Error fetching system info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start server on local IP ---
const PORT = 3000;
const IP = getLocalIP();
app.listen(PORT, IP, () =>
  console.log(`System Monitor API running at http://${IP}:${PORT}`)
);
