var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var nodemailer = require('nodemailer');
var settings = require("./settings.json");

var sp = new SerialPort("COM3", {
  parser: serialport.parsers.readline("\n")
});

sp.on('open', function(){
  console.log('Serial Port Open:');
 	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
  sp.on('data', function(data){
      console.log(data);
  });
});

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: settings.user,
        pass: settings.pass
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Ashton Eby ✔ <tylhandrias@gmail.com>', // sender address
    to: 'tylhandrias@gmail.com', // list of receivers
    subject: 'Hello from the Microview ✔', // Subject line
    text: 'Hello world ✔, this is plaintext body', // plaintext body
    html: '<b>Hello world, this is HTML body ✔</b>' // html body
};

