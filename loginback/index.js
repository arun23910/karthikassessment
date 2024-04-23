const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { UserModel,Userimage } = require("./task");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./otpgenerator");
const emailjs = require("./email.js")
const uploadImage = require("./uploadImage.js");
const multer = require('multer');
const fs = require('fs');
const xlsx = require('xlsx');
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://arundanabalan94:rNu9QUsNcjkBTaaM@karthik.dkvplhe.mongodb.net/?retryWrites=true&w=majority&appName=karthik",
  )

  .then(() => {
    let url='http://localhost:5000'
    console.log(url,"connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });


  app.post("/forgetpassword",  expressAsyncHandler(async (req, res) => {
    console.log(req);
    const { email } = req.body;
    console.log(email);
  
    const otp = generateOTP();
    const response=emailjs(otp,email)
    res.send({message:response})
  
    
  }))

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});

app.post("/register", (req, res) => {
    UserModel.create(req.body)
    .then((students) => {res.json(students); console.log('ddd')} )
    .catch((err) => res.json(err,"register error"));
});

app.post("/uploadImage", (req, res) => {
  
  
  uploadImage(req.body.image)
    .then((url) => 
    {
      if(url){
        
        const payload={
          name: String(req.body.name),
        url: String(url),
        size: String(req.body.size)
        }
        try {
          Userimage.create(payload)
        } catch (error) {
          console.log(error)
        }
       
      }else{
        try {
          Userimage.create(payload)
        } catch (error) {
          console.log(error)
        }
      }
    
    
    res.send(url)})
    .catch((err) => res.status(500).send(err));


});

app.post("/uploadMultipleImages", (req, res) => {
  uploadImage
    .uploadMultipleImages(req.body.images)
    .then((urls) => res.send(urls))
    .catch((err) => res.status(500).send(err));
});
const upload = multer({ dest: 'uploads/' });

app.post("/uploadfile", upload.single('file'), async (req, res) => {
  try {
    // Access uploaded file details
    const file = req.file;

    // Read the content of the uploaded Excel file
    const filePath = file.path;
    const workbook = xlsx.readFile(filePath);

    // Assuming there's only one sheet, you can access it by index (0)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format, skipping headers
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Filter out empty rows and flatten the array
    const flattenedData = jsonData.filter(row => row.length > 0).flat();
    const text='hi how are you'
    // Log or use the flattened data as needed
    emailjs(text,flattenedData)
    console.log('Content of the uploaded Excel file:', flattenedData);

    // Send a response indicating successful file upload
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Internal server error');
  }
})


app.get("/", (req, res) => {
  res.send({ message: "Hello" });
});



app.listen(5000, () => {
  console.log("server is running");
});
