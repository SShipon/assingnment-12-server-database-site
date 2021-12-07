const express = require("express");
const { MongoClient } = require("mongodb");

const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Iam Shipon From Comilla");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgbqt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  const carsCollection = client.db("product").collection("car");
  const reviewCollection = client.db("customers").collection("review");
  const shipmentCollection = client.db("shipment").collection("shipment_details");
   const usersCollection = client.db("auto_users").collection("users");
  
  // add car
  app.post("/addCar", async (req, res) => {
    const result = await carsCollection.insertOne(req.body);
    res.send(result);
  });

  // get car
  app.get("/car", async (req, res) => {
    const result = await carsCollection.find({}).toArray();
    res.send(result);
  });

  // get car
  app.get("/car/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await carsCollection
      .find({
        _id: ObjectId(req.params.id),
      })
      .toArray();
    res.send(result);
  });

  // add review
  app.post("/reviews", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });

  // get review
  app.get("/reviews", async (req, res) => {
    const result = await reviewCollection.find({}).toArray();
    res.send(result);
  });

  // post order
  app.post("/shipment/:id", async (req, res) => {
    const result = await shipmentCollection.insertOne(req.body);
    res.send(result);
  });

  // get order
  app.get("/shipment", async (req, res) => {
    const result = await shipmentCollection.find({}).toArray();
    res.send(result);
  });

  //place order
  app.post("/shipment/:id", async (req, res) => {
    const id = req.params.id;
    const updatedName = req.body;
    const filter = { _id: ObjectId(id) };
    shipmentCollection
      .insertOne(filter, {
        $set: {
          name: updatedName.name,
        },
      })
      .then((result) => {
        res.send(result);
      });
  });

  //  my order
  app.get("/myOrder/:email", async (req, res) => {
    console.log(req.params.email);
    const result = await shipmentCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  app.get("/orders", async (req, res) => {
    const result = await shipmentCollection.find({}).toArray();
    res.send(result);
  });

  // delete data from my order
  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await shipmentCollection.deleteOne(query);
    res.json(result);
  });

  // delete data from explore
  app.delete("/car/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await carsCollection.deleteOne(query);
    res.json(result);
  });
 // post user
  app.post("/addUserInfo", async (req, res) => {
    console.log("req.body");
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
  });

  // make admin
  app.put("/makeAdmin", async (req, res) => {
    const filter = { email: req.body.email };
    const result = await usersCollection.find(filter).toArray();
    if (result) {
      const documents = await usersCollection.updateOne(filter, {
        $set: { role: "admin" },
      });
    }
  });

  // check admin or not
  app.get("/checkAdmin/:email", async (req, res) => {
    const result = await usersCollection
      .find({ email: req.params.email })
      .toArray();
    console.log(result);
    res.send(result);
  });

  // status update
  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(updatedStatus);
    shipmentCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });

// client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
