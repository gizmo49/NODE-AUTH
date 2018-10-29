const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const validate = require('express-validation');
const Regvalidation = require('./tests/validation/register.js');
const PORT = 3000; 

//connect to database
mongoose.connect('mongodb://localhost:27017/auth', {
  useMongoClient: true
  }, (err, db) => {
    if (err) {
      console.log("Couldn't connect to database");
    } else {
      console.log(`Connected To Database`);
    }
  }
);

const User = require('./models/User'); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');




app.get('/', (req, res) => {
    res.render('index');
 });

app.get('/protected', (req, res) => {
  res.send('This page is protected. It requires authentication');
});

app.post('/signup', validate(Regvalidation), (req, res) => {
  let {firstname,lastname, email, password} = req.body;      
  let userData = { _id: new mongoose.Types.ObjectId(), password: bcrypt.hashSync(password), firstname, lastname, email };
  let newUser = new User(userData);
  newUser.save().then(error => {
      if(error){
          return res.status(400).json('something went wrong');
      }
      return res.status(201).json('signup successful');
  });

});

app.listen(PORT, () => {
  console.log(`app running port ${PORT}`)
})