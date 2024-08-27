const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const { name } = require("ejs");


const app = express();
let workList=[];
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

require('dotenv').config();


const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);


const itemSchema={
  name:String
};

const Item = mongoose.model('Item', itemSchema);

const item1=new Item({
  name:'Welcome to your todo-list'
});
const item2=new Item({
  name:'Hit the + button to add a new item'
});
const item3=new Item({
  name:'<--hit this to delete an item'
});

const defaultitems=[item1,item2,item3];


app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({});
    if(foundItems.length==0){
      Item.insertMany(defaultitems).then(function () {
        console.log("Data inserted") // Success 
      }).catch(function (error) {
        console.log(error)     // Failure 
      }); 
       res.redirect("/");      
    }
    else{
      res.render("list", { ListOfTitle: "Today", newitemlist: foundItems });

    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/delete",function(req,res){
  const itedId=req.body.checkbox;
  Item.findByIdAndDelete(itedId)
  .then(function () {
    res.redirect("/");
  }).catch(function (error) {
    console.log(error); // Failure
    res.status(500).send("Internal Server Error");
  });
});
app.get("/work",function(req,res){
  res.render("list",{ListOfTitle:"WorkBook",newitemlist:workList})
})
app.get("/about",function(req,res){
  res.render("about");
})
app.post("/",function(req,res){
  const itemName= req.body.newItem;
  const item=new Item({
    name:itemName
  });
  item.save();
  res.redirect("/")
});

//xvVlJw2rshfYn1GR

app.listen(PORT, function () {
  console.log(`server started`);
});
