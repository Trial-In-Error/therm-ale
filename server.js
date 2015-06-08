var settings = require('./settings.json');
var prompt = require('prompt');
var file = undefined;
var fileStream = undefined;

if(!process.argv[2]) {
	console.log('No file name specified for logging. Logging will be disabled.');
	settings.logging = false;
}

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var serial = new SerialPort("COM3", {
	parser: serialport.parsers.readline("\n")
}, false);

prompt.start();
var nodemailer = require('nodemailer');
var fs = require('fs');
if(settings.logging) {
	fs.open('./'+process.argv[2], 'wx', function(err, fd) {
		file = fd;
		if(err && err.code === 'EEXIST') {
			console.log('The file '+process.argv[2]+' already exists. Append to file?');
			prompt.get(['shouldAppend'], function(err, result) {
				if (err) { return onError(err); }
				if (result.shouldAppend.toLowerCase() === 'y' || result.shouldAppend.toLowerCase() === 'yes') {
					console.log('Will attempt to append.');
					serial.open(function (error) {
						if ( error ) {
							console.log('failed to open: '+error);
							process.exit(1);
						} else {
							console.log('open');
							// send mail with defined transport object
							// transporter.sendMail(mailOptions, function(error, info){
							// 	if(error){
							// 		console.log(error);
							// 	}else{
							// 		console.log('Message sent: ' + info.response);
							// 	}
							// });
							fileStream = fs.createWriteStream(process.argv[2], {fd: fd});
							serial.on('data', serialDataHandler);
							process.on('exit', function(code) {
								fileStream.end();
								console.log('About to exit with code:', code);
							});
						}
					});
				} else if (result.shouldAppend.toLowerCase() === 'n' || result.shouldAppend.toLowerCase() === 'no') {
					console.log('Will crash.');
					process.exit(0);
				} else {
					console.log('Invalid input; will retry.');
				}
			});
		} else if(err) {
			console.log('This error is NOT ok.');
			process.exit(1);
		}
	});
}

function serialDataHandler(data) {
		console.log(data);
		fileStream.write(data+"\n", function(err) {
			if(err) { onError(err); }
		});
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: settings.user,
		pass: settings.pass
	}
});

// setup e-mail data with unicode symbols
var mailOptions = {
	from: 'Ashton Eby ✔ <tylhandrias@gmail.com>', // sender address
	to: 'tylhandrias@gmail.com', // list of receivers
	subject: 'Hello from the Microview ✔', // Subject line
	text: 'Hello world ✔, this is plaintext body', // plaintext body
	html: '<b>Hello world, this is HTML body ✔</b>' // html body
};

function onError(err) {
	console.log(err);
	return 1;
}