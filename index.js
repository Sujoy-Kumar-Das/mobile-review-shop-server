const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config(); 
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())


// database config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Password}@cluster0.j1u8ft3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// db connect funtion
async function DBConnect(){
    try {
        await client.connect()
        console.log('Database conconnected')
    } catch (error) {
        console.log(error)
    }
}
DBConnect();






app.get('/',(req,res)=>{
    res.send('mobile dokan server is running')
})

app.listen(port,()=>console.log('server is running'));