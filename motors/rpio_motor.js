var ZeroRPC = require("zerorpc");

var zeroRPCClient = new ZeroRPC.Client();
zeroRPCClient.connect("tcp://127.0.0.1:4242");

var RPIO = {
  addChannelPulse: function(gpio, rate, callback) {
    if (!callback) callback = function() {};
    zeroRPCClient.invoke("addChannelPulse", gpio, rate, callback);
  }
};

/**
 * RPIO motor implementation using node-rpio.
 *
 */
var RPIOMotor = function (name, pin, minWidth, maxWidth) {
  // Defaults
  if (!name) name = "Unnamed Motor";
  if (!pin) pin = 12;
  if (!minWidth) minWidth = 1000;
  if (!maxWidth) maxWidth = 2000;

  this.name = name;
  this.pin = pin;
  this.minWidth = minWidth;
  this.maxWidth = maxWidth;
  this.W = 0;
};

module.exports = RPIOMotor;

RPIOMotor.prototype.setW = function(W, callback) {
  this.W = Math.min(100, Math.max(0, W));
  var pulse = this.minWidth + (this.maxWidth - this.minWidth) * (this.W / 100);
  RPIO.addChannelPulse(this.pin, !isNaN(pulse) ? Math.round(pulse) : 0, callback);
};

RPIOMotor.prototype.increaseW = function(step, callback) {
  if (!step) step = 1;
  this.setW(this.W + step, callback);
};

RPIOMotor.prototype.decreaseW = function(step, callback) {
  if (!step) step = 1;
  this.setW(this.W - step, callback);
};
