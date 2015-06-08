# therm-ale
a set of tools for measuring and logging beer temperature through fermentation

Components
==========

Raspberry Pi Setup
==================
1. Connect a raspberry pi to an [a la mode](http://wyolum.com/projects/alamode/) or a [standard arduino using a voltage divider or a logic level converter](http://blog.oscarliang.net/raspberry-pi-and-arduino-connected-serial-gpio/).
2. Disable getty and prevent serial writes on boot by following the Raspberry Pi GPIO Configuration section of [this website](http://blog.oscarliang.net/raspberry-pi-and-arduino-connected-serial-gpio/).
3. Install node.js.
4. From the project directory, run `npm install`. If this fails with `failed to fetch from registry`, uninstall node.js (`sudo apt-get purge nodejs npm`), and then reinstall using the command line instructions available [here](http://node-arm.herokuapp.com/). Version 0.12.1 verified to work. Then run `npm install`.
5. Start the serial listener with `node server.js`.

Arduino Setup
=============
1. Copy the included `I2CMaster` folder to `DEFAULT LINUX PATH FOR ARDUINO LIBS`.
2. Wire the arduino to the MLX90614 sensor as specified [here](http://bildr.org/2011/02/mlx90614-arduino/). Note that your sensor may be 5V or 3.3V; the first letter of the code on the casing will tell you which. A for 5V, B for 3.3V. See the product spec sheet [here](https://www.sparkfun.com/datasheets/Sensors/Temperature/SEN-09570-datasheet-3901090614M005.pdf) for more details.
3. Upload `/MLX90614/MLX90614.ino` to the arduino.

To Do
=====
* Fill out components list.
* Include I2CMaster library.
