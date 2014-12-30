var Gpio = require('onoff').Gpio;
var led = new Gpio(4, 'out');
var button = new Gpio(17, 'in', 'falling', {persistentWatch: true, debounceTimeout: 300});
//var button = new Gpio(17, 'in', 'falling');


button.watch(function(err, value) {
    if (err) exit();
    led.writeSync(value);
    console.log('Button value: ' + JSON.stringify(value));
});

function exit() {
    led.unexport();
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);

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
