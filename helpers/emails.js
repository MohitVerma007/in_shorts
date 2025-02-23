const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require("path");

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD
    }
});

const sendSignUpMail = async(name, email, content, url)=>{

    try {

        ejs.renderFile(path.join(__dirname, '../views/templates/signup.ejs'), { name, content, url }, (err, data) => {
            if (err) {
                console.log(err);
            } 
            else {
                var mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: email,
                    subject: 'SignUp Mail',
                    html: data
                };
            
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                    return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                });
            }
        });

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    sendSignUpMail
}