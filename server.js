const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



// Create an express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (replace with your MongoDB URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tryon:5QSEwIgAAUKREP5B@cluster.hlqtory.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
// const PORT = process.env.PORT || 4000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));



// Define a casual wear schema
const casualSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  offers: String
});

// Create a model for casual wear
const Casual = mongoose.model('Casual', casualSchema);

// Get all casual wear items
app.get('/casuals', async (req, res) => {
  try {
    const casuals = await Casual.find();
    res.json(casuals);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});

const partyWearSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    rating: Number,
    offers: String
  });

  const PartyWear = mongoose.model('PartyWear', partyWearSchema);

  app.get('/partywears', async (req, res) => {
    try {
      const partywears = await PartyWear.find();
      res.json(partywears);
    } catch (err) {
      res.status(500).send('Error fetching data for Party Wear');
    }
  });

  const formalWearSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    rating: Number,
    offers: String
});

// Create a model for formal wear
const FormalWear = mongoose.model('FormalWear', formalWearSchema, 'formalwears');

// Get all formal wear items
app.get('/formalwears', async (req, res) => {
    try {
        const formals = await FormalWear.find();
        res.json(formals);
    } catch (err) {
        res.status(500).send('Error fetching data for Formal Wear');
    }
});

const traditionalWearSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  offers: String
});

const TraditionalWear = mongoose.model('TraditionalWear', traditionalWearSchema);

app.get('/traditionalwears', async (req, res) => {
  try {
    const traditionalWears = await TraditionalWear.find();
    res.json(traditionalWears);
  } catch (err) {
    res.status(500).send('Error fetching traditional wear');
  }
});


// Define a dress schema (without comments)
const dressSchema = new mongoose.Schema({
  _id:{  type:String ,required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  offers: { type: String, default: "" },
  category: { type: String, required: true }
});

const Dress = mongoose.model('Dress', dressSchema);

// Define the comment schema
const commentSchema = new mongoose.Schema({
  dressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dress' }, 
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  user: { type: String, default: "Anonymous" }, // Set default value
  date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);


app.get('/dresses', async (req, res) => {
  try {
    const all = await Dress.find();
    res.json(all);
  } catch (err) {
    res.status(500).send('Error fetching all dresses');
  }
});

// Fetch a single dress
app.get('/dresses/:id', async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);  // Fetch by ID
    if (!dress) {
      return res.status(404).send('Dress not found');  // Return 404 if not found
    }
    res.json(dress);  // Return the dress details
  } catch (err) {
    console.error("Error fetching dress:", err);
    res.status(500).send('Error fetching dress details');
  }
});


// Fetch comments for a specific dress
app.get('/comments/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ dressId: req.params.id });
    res.json(comments);
  } catch (err) {
    res.status(500).send('Error fetching comments');
  }
});

// Add a new comment to a dress
app.post('/comments/:id', async (req, res) => {
  try {
    const { user, text, rating } = req.body;
    const newComment = new Comment({
      dressId: req.params.id,
      user,
      text,
      rating
    });

    await newComment.save();
    res.status(201).send('Comment added successfully');
  } catch (err) {
    res.status(500).send('Error adding comment');
  }
});
// Set the server to listen on a port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
