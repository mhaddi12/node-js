const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve assetlinks.json for Android App Links
app.get("/.well-known/assetlinks.json", (req, res) => {
  const filePath = path.join(
    __dirname,
    "public",
    ".well-known",
    "assetlinks.json"
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/", (req, res) => {
  res.redirect(
    "https://play.google.com/store/apps/details?id=com.netmarble.tog&pcampaignid=web_share"
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
