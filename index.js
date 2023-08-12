const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())

require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmw0s1b.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db("E-Commerce").collection("products");
    const usersCollection = client.db("E-Commerce").collection("users");
    const cartsCollection = client.db("E-Commerce").collection("carts");

    app.get('/products/details', async(req, res) => {
      const id = req.query.id;
      const query = { _id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result)
    })
  
    app.get('/products', async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      console.log(category);
      const result = await productsCollection.find(query).toArray();
      res.send(result)
    })


    app.get("/eachUsers", async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    app.post("/users", async(req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.send(result)
    })

    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = { addedBy: email};
      const result = await cartsCollection.find(query).toArray();
      res.send(result)
    })


    app.post('/carts', async(req, res) => {
      const data = req.body;
      const result = await cartsCollection.insertOne(data);
      res.send(result)
    })


    app.delete('/deleteCart', async(req, res) => {
      const id = req.query.id;
      console.log(id);
      const query = { _id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result)
    })


    
    app.delete('/deleteProduct', async(req, res) => {
      const id = req.query.id;
      console.log(id);
      const query = { _id: new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/userRole', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await usersCollection.findOne(query);
      res.send(result?.role)
    })

    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    app.get('/allProducts', async(req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result)
    })

    app.patch('/changeUserRole/:email', async(req, res) => {
      const email = req.params.email;
      const {role} = req.body;
      const filter = {email: email}
      const updateDoc = {
        $set: {
          role: role
        }
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('E-Commerce is running!');
})



app.listen(port, () => {
  console.log(`E-commerce is running on ${port}`)
})