const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5500;

// middleware
// app.use(cors());
app.use(cors({
    origin: ['https://tourista-24a6c.web.app','http://localhost:5173']
    }))
app.use(express.json());

const uri = `mongodb+srv://${process.env.TOURISTA_USER}:${process.env.TOURISTA_PASS}@cluster0.sirqfba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    const countriesCollection = client.db('spotDB').collection('countries');
    const countriesCollection2 = client.db('spotDB').collection('countries2');

    app.get('/spot',async(req,res)=>{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/spot/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await spotCollection.findOne(query);
        res.send(result);
    })
    
    app.post('/spot',async(req,res)=>{
        const newSpot = req.body;
        console.log(newSpot);
        const result = await spotCollection.insertOne(newSpot);
        res.send(result);
    })
    app.put('/spot/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedSpot = req.body;
        const spot = {
            $set:{
                 photo: updatedSpot.photo,
                 spot: updatedSpot.spot,
                  description: updatedSpot.description,
                  country: updatedSpot.country,
                  location: updatedSpot.location,
                  cost: updatedSpot.cost,
                  seasonality: updatedSpot.seasonality,
                  time: updatedSpot.time,
                  visitors: updatedSpot.visitors
            }
        }
        const result = await spotCollection.updateOne(filter,spot,options);
        res.send(result);
    })
    app.delete('/spot/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await spotCollection.deleteOne(query);
        res.send(result);
    })

    //-----------STATIC DATACOLLECTION
    //for countries Section------------------------------
    app.get('/countries',async(req,res)=>{
        const cursor = countriesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
     })
    app.get('/countries/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await countriesCollection.findOne(query);
        res.send(result);
    })

    //using fetch and useSTate
    //route for myList----Private Route By Email
    app.get("/myList/:email", async(req,res)=>{
        const query = {email: req.params.email }
        const result = await spotCollection.find(query).toArray();
        res.send(result);
    })
    //--------COLLECTION--2-------
    app.get('/countries2',async(req,res)=>{
        const cursor = countriesCollection2.find();
        const result = await cursor.toArray();
        res.send(result);
     })
    //----------------------------------------------------

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('tourista server is running')
})
app.listen(port, () =>{
    console.log(`tourista server is running on port : ${port} `)
})