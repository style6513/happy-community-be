const nodemailer = require("nodemailer");

const sendMail = async options => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host : "smtp.mailtrap.io",
    port : 2525,
    auth : {
      user : process.env.EMAIL_USERNAME,
      pass : process.env.EMAIL_PASSWORD
    }
    // Activate in gmail "less secure app" option
  });

  // define the email options
  const mailOptions = {
    from : 'Jae Cho <test@test.com>',
    to : options.email,
    subject : options.subject,
    text : options.message,
    // html : 
  }
  
  // actually send the email
  await transporter.sendMail(mailOptions)
};
module.exports = sendMail;