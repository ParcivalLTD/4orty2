require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.yzppio2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Fügen Sie diese Zeile hinzu, um CORS zu aktivieren

app.post("/savehighscores", async (req, res) => {
  const { username, highscore } = req.body;

  if (!username || !highscore) {
    return res.status(400).json({ error: "Username and highscore are required" });
  }

  try {
    await client.connect();
    const database = client.db("game");
    const collection = database.collection("highscores");

    const result = await collection.insertOne({ username: username, highscore: highscore });
    res.status(200).json({ message: `Highscore saved with id: ${result.insertedId}` });
  } catch (error) {
    console.error("Error saving highscore:", error);
    res.status(500).json({ error: "Error saving highscore" });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
