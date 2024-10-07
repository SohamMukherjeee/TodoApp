const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');  // Include path module
require('dotenv').config();

const app = express();
let workList = [];

// Set the view engine and the views directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));  // Specify the views directory

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Static files location

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// Define schema and model outside of connection
const itemSchema = {
  name: String
};

const Item = mongoose.model('Item', itemSchema);

// Default items
const item1 = new Item({
  name: 'Welcome to your todo-list'
});
const item2 = new Item({
  name: 'Hit the + button to add a new item'
});
const item3 = new Item({
  name: '<--hit this to delete an item'
});

const defaultItems = [item1, item2, item3];

// Function to establish the database connection
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);  // Exit the process if unable to connect to the database
  }
}

// Start the server only after a successful DB connection
async function startServer() {
  await connectToDatabase();

  // Routes
  app.get("/", async function (req, res) {
    try {
      const foundItems = await Item.find({});
      if (foundItems.length === 0) {
        await Item.insertMany(defaultItems);
        res.redirect("/");
      } else {
        res.render("list", { ListOfTitle: "Today", newitemlist: foundItems });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/delete", async function (req, res) {
    const itemId = req.body.checkbox;
    try {
      await Item.findByIdAndDelete(itemId);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/work", function (req, res) {
    res.render("list", { ListOfTitle: "WorkBook", newitemlist: workList });
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.post("/", async function (req, res) {
    const itemName = req.body.newItem;
    const item = new Item({ name: itemName });
    await item.save();
    res.redirect("/");
  });

  app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
  });
}

// Call the function to start the server
startServer();
