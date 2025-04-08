const express = require("express");
const axios = require("axios");
const app = express();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = process.env.TABLE_NAME;

app.get("/jobs.geojson", async (req, res) => {
  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });

    const features = response.data.records
      .filter(r => r.fields.Latitude && r.fields.Longitude)
      .map(record => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [record.fields.Longitude, record.fields.Latitude]
        },
        properties: record.fields
      }));

    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching from Airtable");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
