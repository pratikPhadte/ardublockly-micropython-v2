/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Arduino Digital and Analogue input/output.
 *     Arduino built in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Micropython.tone');

goog.require('Blockly.Micropython');


///**
// * Function for turning the tone library on on a given pin (X).
// * Arduino code: setup { pinMode(X, OUTPUT) }
// *               loop  { tone(X, frequency) }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */

//Blockly.Micropython['io_tone'] = function(block) {
//  var pin = block.getFieldValue('TONEPIN');
//  var freq = Blockly.Micropython.valueToCode(block, 'FREQUENCY', Blockly.Micropython.ORDER_ATOMIC);
//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Tone Pin');

//  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'tone(' + pin + ',' + freq + ');\n';
//  return code;
//};

//Blockly.Micropython['io_notone'] = function(block) {
//  var pin = block.getFieldValue("TONEPIN");
//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Tone Pin');
  
//  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'noTone(' + pin + ');\n';
//  return code;
//};
