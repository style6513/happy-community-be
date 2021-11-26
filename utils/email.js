const nodemailer = require("nodemailer");

const sendMail = options => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    service : "Gmail",
    auth : {
      user : process.env.EMAIL_USERNAME,
      pass : process.env.EMAIL_PASSWORD
    }
    // Activate in gmail "less secure app" option
  });

  // define the email options
  
  
  // actually send the email
}