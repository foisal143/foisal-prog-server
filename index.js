const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
require('dotenv').config();
const mg = require('nodemailer-mailgun-transport');
const nodemailer = require('nodemailer');
app.use(cors());
app.use(express.json());

// nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'islammdfoisal54@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://foisalProgrammer:W4tzKIM4exqXYOzz@cluster0.mrvtr8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
    // mongodb collection here
    const projectsCollection = client
      .db('foisalProgrammer')
      .collection('projects');

    app.get('/projects', async (req, res) => {
      const data = await projectsCollection.find().toArray();
      res.send(data);
    });

    app.get('/projects/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectsCollection.findOne(query);
      res.send(result);
    });

    // send mail

    app.post('/send-mail', async (req, res) => {
      const { email, comments, name, subject, phone } = req.body;
      try {
        const info = await transporter.sendMail({
          from: email,
          to: 'islammdfoisal54@gmail.com',
          subject: subject,
          text: comments,
          html: `<div class="our-class"> 
                    <h1>Hello Developer I am ${name}</h1>
                        <p>Here are some information about me: </p>
                      <ul>
                        <li>Email: ${email} </li>
                        <li>Phone: ${phone} </li>
                      </ul>
                      <p> <strong> Details: </strong> ${comments} </p>
                 </div>`,
        });

        res.send({
          success: true,
          message: 'Message send successfull',
          data: info,
        });
      } catch (error) {
        res.send({
          success: false,
          message: 'Message send unsuccessfull',
          data: {},
        });
      }
    });

    app.post('/subscribe', async (req, res) => {
      const { email } = req.body;
      try {
        const info = await transporter.sendMail({
          from: email,
          to: 'islammdfoisal54@gmail.com',
          subject: 'Subscribed You',
          html: `<div class="our-class"> 
                    <h1>You are subscribed by ${email} </h1>
                      
                 </div>`,
        });
        res.send({
          success: true,
          message: 'Subscribed  successfull',
          data: info,
        });
      } catch (error) {
        res.send({
          success: false,
          message: 'Subscribed  unsuccessfull',
          data: info,
        });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('foisal programmer data is comming');
});

app.listen(port, () => {
  console.log('server is running');
});
