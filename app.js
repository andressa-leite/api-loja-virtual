const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const userController = require("./controllers/user.controller");
const db = require("./config/db");
const routes = require("./config/routes");
require("dotenv").config();
/* const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(
  accountSid,
  authToken
); */
/* const resendLib = require('resend');

const resend = new resendLib.('re_LvetbvWt_JMDk8pHtfM5cdhA8krxfXwi1');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'dre_tl@hotmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
}); */

cloudinary.config({
  //cloud_name: variavel.global.CLOUD_NAME
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// console.log('uploading')
// cloudinary.uploader.upload("/australia.jpg").then(result=>console.log('img: ' + result));
//userController.uploadAvatar();

//app.use(cors());

app.use(
  cors(
    /*origin: ["https://app.andressaportfolio.com"],*/
  )
);

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1000, // 1 segundo
  max: 5, // Limite de 5 solicitações por segundo
});

// Aplica o limitador a todas as solicitações
app.use(limiter);
db.on("connected", function () {
  console.log("connected to Mongo DB");
});

db.on("disconnected", function () {
  console.log("disconnected!");
});

db.on("error", function (error) {
  console.log("Connection error: " + error);
});

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

routes(app);

const port = process.env.PORT || 4200;
app.listen(port, function () {
  console.log("Server is on fire.");
  // process.exit(1)
});

/* client.messages
    .create({
      body: "You have received a message from Twilio",
      from: "+14056520232",
      to: "+5519997986433",
    })
    .then((message) => console.log(message.body))
   

  client.messages
    .create({
      body: "You have received a message from Twilio",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+5519997986433",
    })
    .then((message) => console.log(message.sid)) */
//to: "whatsapp:+15485775657",
//.done();

/* client.verify.v2.services('MGcabb2a7f825727792b5945318772e589')
                .verifications
                .create({to: 'dre_tl@hotmail.com', channel: 'email'})
                .then(verification => console.log(verification.sid)); */

/* *************************************** */
/*
const products  = []

app.get('/products', (req, res) => {
  if(req.query.name) {
     const data = products.filter((product)=>{
      if(product.name == req.query.name){
        return true
      }
     })
     return res.send(data);
  }
   res.send(products)
})

app.get('/products/:id', (req, res) => {
  const id = req.params.id
  const indexPosition = products.findIndex(product => product.id == id)
  console.log(indexPosition)
  if(indexPosition < 0){
    return res.status(404).send({message: "Product not found"})
  }
  return res.send({message:"string", data: products[indexPosition]})
})



app.post('/products', (req, res) => {
  const product = req.body;
  const {name, price, id} = product;
  if(!name || !price || !id) {
    res.send({message: "Please submit all fields!"})
  } else{
    products.push(product)
    res.send({message: "product created", data:  product})
  }
})

app.put('/products/:id', (req, res) => {
  const productUpdated = req.body;
  const id = req.params.id
  const indexPosition = products.findIndex(product => product.id == id)
    if(indexPosition >= 0){
      products[indexPosition] = productUpdated
      return res.json(products[indexPosition])
    }
    return res.send({message: 'Product not found'})

})

app.patch('/products/:id', (req, res) => {
  const newItemModified = req.body;
  const id = req.params.id
  const indexPosition = products.findIndex(product => product.id == id)
    if(indexPosition >= 0){
      //const productToBeModified = products[indexPosition]
      products[indexPosition] = {...products[indexPosition], newItemModified}
      //Object.assign(productToBeModified, newItemModified) //mesma coisa da linha de cima
    return res.send(products[indexPosition])
    }
    return res.send({message: 'Product not found'})
})

app.delete('/products/:id', (req, res) => {
  const id = req.params.id
  const indexPosition = products.findIndex(product => product.id == id)
  if(indexPosition >= 0){
    products.splice(indexPosition, 1);
    res.json({message: "Product deleted successfully"})
  } else {
    res.status(404).send({message: "Product not found"})
  }

})

/* *************************************** */
