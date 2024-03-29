const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

"use strict";

const apiArray = [];
module.exports = apiArray;

const nodemailer = require("nodemailer");

async function replyto_jsonSendConfirmEmail(req, res)
{
  console.log('You hit the replyto_jsonSendConfirmEmail API');

    // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "heatsquad4@gmail.com", // generated ethereal user
      pass: "fychaoznlihatpiy", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Heat Squad 👻" <heatsquad4@gmail.com>', // sender address
    to: "eugenetedkim@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonSendConfirmEmail,
        path: 'replyto_jsonSendConfirmEmail',
        options:
        {
            public: true,
            description: '',
            group: '',
            sampleParams:
            {
                "email": "thuch.nguyen@yahoo.com",
                "first_name": "Thuc",
                "last_name": "Nguyen",
            }
        }
    }
);