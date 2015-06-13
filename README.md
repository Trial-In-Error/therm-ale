# therm-ale
A set of tools for measuring and logging beer temperature during fermentation and alerting you via email when the temperature nears unsafe levels.

Components
==========
* [Raspberry Pi](http://www.adafruit.com/product/998). All testing has been conducted on a first generation model B+ running Raspbian . Unsure if the a la mode will fit on a second generation raspberry pi.
* [Raspberry Pi compatible wi-fi card](http://elinux.org/RPi_USB_Wi-Fi_Adapters#Working_USB_Wi-Fi_Adapters) or a wired internet connection.
* [MLX90614 distance IR sensor](https://www.sparkfun.com/products/9570).
* [A la mode](http://www.makershed.com/products/alamode-for-raspberry-pi). An equivalent solution can be made with a voltage divider or logic level converter and an arduino; see [this](http://blog.oscarliang.net/raspberry-pi-and-arduino-connected-serial-gpio/).
* Two 4.7k Ohm resistors.
* One .1 uF capacitor.

Raspberry Pi Setup
==================
1. Ensure that the raspberry pi is connected to the internet.
2. Connect the raspberry pi to the [a la mode](http://wyolum.com/projects/alamode/) or a [standard arduino using a voltage divider or a logic level converter](http://blog.oscarliang.net/raspberry-pi-and-arduino-connected-serial-gpio/).
3. Disable getty and prevent serial writes on boot by following the Raspberry Pi GPIO Configuration section of [this website](http://blog.oscarliang.net/raspberry-pi-and-arduino-connected-serial-gpio/).
4. Install node.js.
5. From the project directory, run `npm install`. If this fails with `failed to fetch from registry`, uninstall node.js (`sudo apt-get purge nodejs npm`), and then reinstall using the command line instructions available [here](http://node-arm.herokuapp.com/). Version 0.12.1 verified to work. Then run `npm install`.
6. Edit settings.json.
7. Start the serial listener with `node server.js`.

Arduino Setup
=============
1. Copy the included `I2CMaster` folder to `~/sketchbook/libraries`.
2. Wire the arduino to the MLX90614 sensor as specified [here](http://bildr.org/2011/02/mlx90614-arduino/). Note that your sensor may be 5V or 3.3V; the first letter of the code on the casing will tell you which. A for 5V, B for 3.3V. See the product spec sheet [here](https://www.sparkfun.com/datasheets/Sensors/Temperature/SEN-09570-datasheet-3901090614M005.pdf) for more details.
3. Upload `/MLX90614/MLX90614.ino` to the arduino.
