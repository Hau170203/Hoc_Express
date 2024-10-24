const nodemailer = require('nodemailer');

// email: email người nhận
// subject: tiêu đề
// html: nội dung
module.exports = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // cấu trúc lá thư
    const mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.log(error);
        } else{
            console.log("Send mail: "+ info.response);
        }
    })
}