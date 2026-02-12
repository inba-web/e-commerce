const nodemailer = require("nodemailer")

async function sendVerificataionEmail(to, subject, body){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "inbafreakz@gmail.com",
            pass: "coge wolb dgst nmgm"
        }
    });

    const mailOptions = {
        from: "inbafreakz@gmail.com",
        to,
        subject,
        html: body
    };


    await transporter.sendMail(mailOptions)
}

module.exports = sendVerificataionEmail;