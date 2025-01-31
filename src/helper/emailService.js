const {Resend }= require('resend');
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpbyEmail = async (receiverMailId, otp) => {
    try {
      const result =   await resend.emails.send({
            from: 'DevBlog <onboarding@resend.dev>',
            to: receiverMailId,
            subject: 'verify otp',
            html: `<p>your otp :  ${otp}</p>`,
        });
        console.log(result);
        
    } catch (error) {
        throw new Error("Error occurred: " + error.message);
    }
}


module.exports = { sendOtpbyEmail }