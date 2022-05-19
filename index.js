const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo-list-cluster.mw1od.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const taskCollection = client.db('todo-list-db').collection('tasks');
        app.get('/task',async(req,res)=>{
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks =await cursor.toArray();
            res.send(tasks);
        })
        app.get('/tasks',async(req,res)=>{
            const email = req.query.email;
            const query = {email:email};
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })
        app.delete('/tasks/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result);
            })
        app.post('/task', async (req, res) => {
            const addItem = req.body;
            const result = await taskCollection.insertOne(addItem);
            res.send(result);
        });
    }
    finally{}
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})