require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY || "magomedalimkhanov123";

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

app.get("/topusers", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("game");
    const collection = database.collection("highscores");

    const topUsers = await collection.find().sort({ highscore: -1 }).limit(10).toArray();
    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ error: "Error fetching top users" });
  } finally {
    await client.close();
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    await client.connect();
    const database = client.db("game");
    const usersCollection = database.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: `User registered with id: ${result.insertedId}` });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  } finally {
    await client.close();
  }
});

app.post("/check-username", async (req, res) => {
  const { username } = req.body;
  const user = await database.findUserByUsername(username);
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request:", { username, password });

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    await client.connect();
    const database = client.db("game");
    const usersCollection = database.collection("users");
    const highscoresCollection = database.collection("highscores");

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: "1h" });

    const userHighscore = await highscoresCollection.findOne({ username });
    const highscore = userHighscore ? userHighscore.highscore : 0;

    res.status(200).json({ message: "Login successful", token, highscore });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Error logging in user" });
  } finally {
    await client.close();
  }
});

app.post("/gethighscore", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    await client.connect();
    const database = client.db("game");
    const collection = database.collection("highscores");

    const userHighscore = await collection.findOne({ username });
    if (userHighscore) {
      res.status(200).json({ highscore: userHighscore.highscore });
    } else {
      res.status(404).json({ error: "Highscore not found" });
    }
  } catch (error) {
    console.error("Error fetching highscore:", error);
    res.status(500).json({ error: "Error fetching highscore" });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
