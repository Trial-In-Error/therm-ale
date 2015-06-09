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
	fs.open('./'+process.argv[2], 'ax', function(err, fd) {
		file = fd;
		fileStream = fs.createWriteStream(process.argv[2], {fd: file, flags: 'a'});
		serial.on('data', serialDataHandler);

		// THIS DOESN'T GET CALLED; WHY??
		process.on('exit', function(code) {
			if(fileStream) {
				console.log('Closed file stream.');
				fileStream.end();	
			}
			if(file) {
				console.log('Closed file.');
				fs.closeSync(file);	
			}
			console.log('Exiting with code:', code);
		});

		if(err && err.code === 'EEXIST') {
			console.log('The file '+process.argv[2]+' already exists. Append to file?');
			prompt.get(['shouldAppend'], function(err, result) {
				if (err) { return onError(err); }
				if (result.shouldAppend.toLowerCase() === 'y' || result.shouldAppend.toLowerCase() === 'yes') {
					console.log('Will attempt to append.');
					openSerialConnection();
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
		} else {
			openSerialConnection();
		}
	});
}

function serialDataHandler(data) {
	if(fileStream) {
		console.log(data);
		fileStream.write(data+"\n", function(err) {
			if(err) { onError(err); }
		});
	}
	if(parseInt(data.split(",").pop()) < settings.lowerThreshhold || parseInt(data.split(",").pop()) > settings.upperThreshhold) {
		debounce(sendEmailAlert(parseInt(data.split(",").pop())), settings.emailCooldown*60*1000);
	}
}

function sendEmailAlert(temperature) {
	//send mail with defined transport object
	transporter.sendMail(settings.mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function openSerialConnection() {
	serial.open(function (error) {
		if ( error ) {
			console.log('Failed to open serial connection: '+error);
			fs.closeSync(file);
			process.exit(1);
		} else {
			console.log('open');
		}
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


function onError(err) {
	console.log(err);
	return 1;
}