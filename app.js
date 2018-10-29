const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const validate = require('express-validation');
const Regvalidation = require('./tests/validation/register.js');
const PORT = 3000; 

//connect to database
mongoose.connect('mongodb://node-shop:node-shop@cluster0-shard-00-00-vdcp8.mongodb.net:27017,cluster0-shard-00-01-vdcp8.mongodb.net:27017,cluster0-shard-00-02-vdcp8.mongodb.net:27017/auth?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true' + {  useMongoClient: true }, (err, db) => {
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

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/protected', (req, res) => {
  res.send('This page is protected. It requires authentication');
});

app.post('/login', (req,res) => {

  let {email, password} = req.body;
  User.findOne({email: email} , 'email password', (err, userData) => { 
    if(!err){
      let passwordCheck = bcrypt.compareSync(password, userData.password);
      if (passwordCheck) { 
           
            res.status(200).send('You are logged in, Welcome!');
        } else {
          res.status(401).send('incorrect password');
        }
    }else {
      res.status(400).json({err});
    }

  });


});
app.post('/signup', validate(Regvalidation), (req, res) => {
  let {firstname,lastname, email, password} = req.body;      
  let userData = { _id: new mongoose.Types.ObjectId(), password: bcrypt.hashSync(password), firstname, lastname, email };
  let newUser = new User(userData);
  newUser.save().then(error => {
    if (!error) {
      return res.status(201).json('signup successful')
    } else {
      if (error.code ===  11000) { // this error gets thrown only if similar user record already exist.
          return res.status(409).send('user already exist!')
      } else {
          console.log(JSON.stringigy(error, null, 2)); // you might want to do this to examine and trace where the problem is emanating from
          return res.status(500).send('error signing up user')
      }
    }
  
  });

});

app.listen(PORT, () => {
  console.log(`app running port ${PORT}`)
})