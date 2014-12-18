var gpio = require("pi-gpio");

gpio.open(16, "output", function(err) {        // Open pin 16 for output
    gpio.write(16, 1, function() {            // Set pin 16 high (1)
        gpio.close(16);                        // Close pin 16
    });
});

gpio.open(15, "input");

gpio.read(15, function(err, value) {
    if(err) throw err;
    console.log(value);    // The current state of the pin
});


/*

P1 - 3.3v	1	2	5v
I2C SDA	3	4	--
I2C SCL	5	6	Ground
GPIO	7	8	TX
--	9	10	RX
GPIO	11	12	GPIO
GPIO	13	14	--
GPIO	15	16	GPIO
--	17	18	GPIO
SPI MOSI	19	20	--
SPI MISO	21	22	GPIO
SPI SCLK	23	24	SPI CE0
--	25	26	SPI CE1
Model B+ pins
ID_SD	27	28	ID_SC
GPIO	29	30	--
GPIO	31	32	GPIO
GPIO	33	34	--
GPIO	35	36	GPIO
GPIO	37	38	GPIO
GPIO	39	40	--

*/
