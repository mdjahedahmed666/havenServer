const express = require("express");
const cors = require("cors");
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0jahed.ldqz6dp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("hotelDB").collection("users");
    const roomCollection = client.db("hotelDB").collection("rooms");
    const bookCollection = client.db("hotelDB").collection("bookings");
    const reviewCollection = client.db("hotelDB").collection("review");

    //auth api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      res.send(result);
    });

    //rooms api
    app.get("/rooms/:roomName", async (req, res) => {
      const roomName = req.params.roomName;
      const result = await roomCollection.findOne({ name: roomName });
      res.send(result);
    });
    app.get("/rooms", async (req, res) => {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.post("/review", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    app.post("/rooms/:roomName", async (req, res) => {
      const bookRoom = req.body;
      const result = await bookCollection.insertOne(bookRoom);
      res.send(result);
    });

    //update
    app.put("/rooms/:roomName", async (req, res) => {
      const roomName = req.params.roomName;
      const query = { name: roomName };
      const options = { upsert: true };
      const updatedRoom = req.body.availability;
      const room = {
        $set: {
          availability: updatedRoom,
        },
      };
      const result = await roomCollection.updateOne(query, room, options);
      res.send(result);
    });
    app.put("/bookings/:id", async (req, res) => {
      const bookingId = req.params.id;
  const { newDate } = req.body;
  const query = { _id: new ObjectId(bookingId) };
      const options = { upsert: true };
      const updatedDate = newDate;
      const upDate = {
        $set: {
          date: new Date(newDate),
        },
      };
      const result = await bookCollection.updateOne(query, upDate, options);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
