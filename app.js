const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/mydb";
var jwt = require('jsonwebtoken')
const port = 8000;
var ReverseMd5 = require('reverse-md5')
var md5 = require('md5');
var config = require('./models/config');
// const { validateToken } = require('./auth');
require('./models/user_details');
let user = mongoose.model("user_details");
// var rev = ReverseMd5(opts)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.json())
app.listen(port, function () {
  console.log("Server started on" + port);
});

var rev = ReverseMd5({
  lettersUpper: false,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 12
})


app.post('/signup', async function (req, res) {
  let savedata = { user_name: req.body.user_name, password: md5(req.body.password), contact_no: req.body.contact_no }
  let userDetail = user(savedata);
  let result = await userDetail.save();
  res.send("Done")
})

app.get('/user', async function (req, res) {
  const alldata = await user.find().sort({ created_date: -1 })
  for (let i = 0; i < alldata.length; i++) {
    alldata[i].password = rev(alldata[i].password).str
  }
  res.send({ status:200,data: alldata});
  console.log("sucess")
})
app.post('/login', async function (req, res) {
  let isExist = await user.findOne({ user_name: req.body.user_name });
  let password = rev(isExist.password)
  if (isExist) {
    if (password.str == req.body.password) {
      let token = jwt.sign({ id: isExist._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.send({status:200, token:token,result:" Login Sucessfully"});
    } else {
      res.send({status:400,result:"Wrong password"});
    }
  } else {
    res.send({status:400,result:"Wrong user_name"});
  }
})

app.delete('/user', async function (req, res) {
  await user.remove()
  console.log("Delete")
})



// SQL Query TASK 4

// SELECT *
// FROM Customer
// INNER JOIN Salesman ON Customer.Salesman_Id=Salesman.Salesman_Id
// WHERE Salesman.Commission >0.12