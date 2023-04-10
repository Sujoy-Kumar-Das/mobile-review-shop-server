const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// database config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Password}@cluster0.j1u8ft3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// db connect funtion
async function DBConnect() {
  try {
    await client.connect();
    console.log("Database conconnected");
  } catch (error) {
    console.log(error);
  }
}
DBConnect();

// db collections
const servicesCollections = client.db("Mobiel-dokan").collection("services");
const userReviewCollections = client.db("Mobile-dokan").collection("reviews");

// get products for home

app.get("/home/products", async (req, res) => {
  try {
    const query = {};
    const currsor = servicesCollections.find(query).limit(3);
    const services = await currsor.toArray();
    res.send({
      success: true,
      data: services,
    });
  } catch (error) {
    res.send({
      success: false,
      data: [],
      error: error,
    });
    console.log(error);
  }
});
// products for product route
app.get("/products", async (req, res) => {
  try {
    const query = {};
    const currsor = servicesCollections.find(query);
    const services = await currsor.toArray();
    if (services) {
      res.send({
        success: true,
        data: services,
      });
    } else {
      res.send({
        success: false,
        data: [],
        message: "connection failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// find single item by name
app.get("/products/:key", async (req, res) => {
  try {
    const name = req.params.key;
    const query = { $or: [{ name: { $regex: name } }] };
    const currsor = servicesCollections.find(query);
    const product = await currsor.toArray();
    if (product) {
      res.send({
        success: true,
        data: product,
      });
    } else {
      res.send({
        success: false,
        data: [],
        message: "Product not found!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// product detail
app.get("/product/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const currsor = await servicesCollections.findOne(query);
    if (currsor) {
      res.send({
        success: true,
        data: currsor,
      });
    } else {
      res.send({
        success: false,
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get review

app.get("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { productId: id };
    const currsor = userReviewCollections.find(query);
    const reviews = await currsor.toArray();

    res.send({
      data: reviews,
    });
  } catch (error) {
    console.log(error);
  }
});
// post review

app.post("/review", async (req, res) => {
  try {
    const review = req.body;
    if (review) {
      res.send({
        success: true,
        message: "Review added",
      });
      await userReviewCollections.insertOne(review);
    } else {
      res.send({
        success: false,
        message: "Review not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("mobile dokan server is running");
});

// update review

// app.put('/updateReview/:id',async(req,res)=>{
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     console.log(data)
//   } catch (error) {
//     console.log(error)
//   }
// })


// delete review

app.delete('/deleteReview/:id',async(req,res)=>{
  try {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const currsor = await userReviewCollections.findOne(query)
    // console.log(currsor)
    if (!currsor?._id) {
      res.send({
        success: false,
        error: "Review not found",
      });
      return;
    }
    
    const result = await userReviewCollections.deleteOne(query)
    
    if(result.deletedCount){
      res.send({
        success:true,
        message:"Review deleted successfully"
      })
    }
    else{
      res.send({
        success:false,
        message:'Someting is goning wrong'
      })
    }
  } catch (error) {
    console.log(error)
  }
})
app.listen(port, () => console.log("server is running"));
