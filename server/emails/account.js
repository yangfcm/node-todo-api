const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.sendgridAPIKey);

const sendWelcomeEmail = ({ email, username }) => {
  sgMail.send({
    to: email,
    from: "yangfcm16@gmail.com",
    subject: "Welcome to Todo API",
    text: `
			Hi, ${username},
			Todo API is a project by me for studying and exploring Node.js.
			If you receive this email, it means you have successfully signed up.

			Regards, Fan.
		`,
  });
};

module.exports = {
  sendWelcomeEmail,
};
