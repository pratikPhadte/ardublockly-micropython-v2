/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Arduino Digital and Analogue input/output.
 *     Arduino built in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Micropython.IO');

goog.require('Blockly.Micropython');

/**
 * Function for 'set pin' (X) to a state (Y).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 *
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['io_digitalwrite'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var stateOutput = Blockly.Micropython.valueToCode(
      block, 'STATE', Blockly.Micropython.ORDER_ATOMIC) || '0';

      Blockly.Micropython.reservePin(
        block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Set LED');
  
      var pinImportFromCode = 'from machine import Pin';
      Blockly.Micropython.addImport('io_' + pin, pinImportFromCode);

      //var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  
      var pinDefinitionCode = 'PIN = '+pin;
      Blockly.Micropython.addDefinition('io_' + pin, pinDefinitionCode);
  
      var pinDeclarationCode = 'led'+pin+' = Pin(PIN, Pin.OUT)';
      Blockly.Micropython.addDeclaration('io_' + pin, pinDeclarationCode, false);
  
      var code = 'led'+pin+'.value(' + stateOutput + ')\n';
    return code;
};

///**
// * Function for 'set pin' (X) to a state (Y).
// * Arduino code: setup { pinMode(X, OUTPUT); }
// *               loop  { digitalWrite(X, Y); }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['io_digitalwrite'] = function(block) {
//  var pin = block.getFieldValue('PIN');
//  var stateOutput = Blockly.Micropython.valueToCode(
//      block, 'STATE', Blockly.Micropython.ORDER_ATOMIC) || 'LOW';

//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Digital Write');

//  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
//  return code;
//};

/**
* Function for reading a digital pin (X).
* Arduino code: setup { pinMode(X, INPUT); }
*               loop  { digitalRead(X)     }
* @param {!Blockly.Block} block Block to generate the code from.
* @return {array} Completed code with order of operation.
*/
Blockly.Micropython['io_digitalread'] = function(block) {
 var pin = block.getFieldValue('PIN');
 Blockly.Micropython.reservePin(
     block, pin, Blockly.Micropython.PinTypes.INPUT, 'Digital Read');
  
  var pinImportFromCode = 'from machine import Pin';
  Blockly.Micropython.addImport('io_' + pin, pinImportFromCode);    

  var pinDeclarationCode = 'read'+pin+' = Pin('+pin+', Pin.IN)';
  Blockly.Micropython.addDeclaration('io_' + pin, pinDeclarationCode, false);

  var code = 'read'+pin+'.value('+')';
  return [code, Blockly.Micropython.ORDER_ATOMIC];
};

/**
 * Function for setting the state (Y) of a built-in LED (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['io_builtin_led'] = function(block) {
  var pin = block.getFieldValue('BUILT_IN_LED');
  var stateOutput = Blockly.Micropython.valueToCode(
      block, 'STATE', Blockly.Micropython.ORDER_ATOMIC) || '0';

  Blockly.Micropython.reservePin(
      block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Set LED');

    var pinImportFromCode = 'from machine import Pin';
    Blockly.Micropython.addImport('io_' + pin, pinImportFromCode);

    var pinDefinitionCode = 'BUILT_IN_LED = const(2)';
    Blockly.Micropython.addDefinition('io_' + pin, pinDefinitionCode);

    var pinDeclarationCode = 'led = Pin(BUILT_IN_LED, Pin.OUT)';
    Blockly.Micropython.addDeclaration('io_' + pin, pinDeclarationCode, false);

    var code = 'led.value(' + stateOutput + ')\n';
  return code;
};

///**
// * Function for setting the state (Y) of an analogue output (X).
// * Arduino code: setup { pinMode(X, OUTPUT); }
// *               loop  { analogWrite(X, Y);  }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['io_analogwrite'] = function(block) {
//  var pin = block.getFieldValue('PIN');
//  var stateOutput = Blockly.Micropython.valueToCode(
//      block, 'NUM', Blockly.Micropython.ORDER_ATOMIC) || '0';

//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.OUTPUT, 'Analogue Write');

//  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  // Warn if the input value is out of range
//  if ((stateOutput < 0) || (stateOutput > 255)) {
//    block.setWarningText('The analogue value set must be between 0 and 255',
//                         'pwm_value');
//  } else {
//    block.setWarningText(null, 'pwm_value');
//  }

//  var code = 'analogWrite(' + pin + ', ' + stateOutput + ');\n';
//  return code;
//};

///**
// * Function for reading an analogue pin value (X).
// * Arduino code: setup { pinMode(X, INPUT); }
// *               loop  { analogRead(X)      }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['io_analogread'] = function(block) {
//  var pin = block.getFieldValue('PIN');
//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.INPUT, 'Analogue Read');

//  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'analogRead(' + pin + ')';
//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

/**
 * Value for defining a digital pin state.
 * Arduino code: loop { HIGH / LOW }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['io_highlow'] = function (block) {

    var definitionCode = 'HIGH = const(1)\nLOW = const(0)';
    Blockly.Micropython.addDefinition('highlow', definitionCode);

    var code = block.getFieldValue('STATE');
  return [code, Blockly.Micropython.ORDER_ATOMIC];
};

//Blockly.Micropython['io_pulsein'] = function(block) {
//  var pin = block.getFieldValue("PULSEPIN");
//  var type = Blockly.Micropython.valueToCode(block, "PULSETYPE", Blockly.Micropython.ORDER_ATOMIC);

//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.INPUT, 'Pulse Pin');

//  var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'pulseIn(' + pin + ', ' + type + ')';

//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

//Blockly.Micropython['io_pulsetimeout'] = function(block) {
//  var pin = block.getFieldValue("PULSEPIN");
//  var type = Blockly.Micropython.valueToCode(block, "PULSETYPE", Blockly.Micropython.ORDER_ATOMIC);
//  var timeout = Blockly.Micropython.valueToCode(block, "TIMEOUT", Blockly.Micropython.ORDER_ATOMIC);

//  Blockly.Micropython.reservePin(
//      block, pin, Blockly.Micropython.PinTypes.INPUT, 'Pulse Pin');

//  var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
//  Blockly.Micropython.addSetup('io_' + pin, pinSetupCode, false);

//  var code = 'pulseIn(' + pin + ', ' + type + ', ' + timeout + ')';

//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//}; 
