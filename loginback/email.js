const dotenv = require("dotenv");
const { models } = require("mongoose");
const nodemailer = require("nodemailer");
dotenv.config();


const emailjs=async(data,email)=>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      if(email.length>1){
      for (const recipient of email) {
        // Define the mail options for each recipient
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: recipient,
          subject: "OTP form Callback Coding",
          text: `Your OTP is: ${data}`,
        };
    
        try {
          // Send the email
          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent successfully to ${recipient}!`);
        } catch (error) {
          console.log(`Error sending email to ${recipient}:`, error);
        }
      }
    }
    else{  
    var mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "Have a Good day",
        text: ` ${data}`,
      };
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return error;
        } else {
        //   res.json('success')
        console.log("Email sent successfully!");

        return 'success';
          
        }
      });
    }
    return 'mail sent successfully'

}
module.exports=emailjs;
