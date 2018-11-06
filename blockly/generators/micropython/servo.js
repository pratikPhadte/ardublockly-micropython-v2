/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the Servo library blocks.
 *     The Arduino Servo library docs: http://arduino.cc/en/reference/servo
 *
 * TODO: If angle selector added to blocks edit code here.
 */
'use strict';

goog.provide('Blockly.Micropython.servo');

goog.require('Blockly.Micropython');


///**
// * Code generator to set an angle (Y) value to a servo pin (X).
// * Arduino code: #include <Servo.h>
// *               Servo myServoX;
// *               setup { myServoX.attach(X); }
// *               loop  { myServoX.write(Y);  }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['servo_write'] = function(block) {
//  var pinKey = block.getFieldValue('SERVO_PIN');
//  var servoAngle = Blockly.Micropython.valueToCode(
//      block, 'SERVO_ANGLE', Blockly.Micropython.ORDER_ATOMIC) || '90';
//  var servoName = 'myServo' + pinKey;

//  Blockly.Micropython.reservePin(
//      block, pinKey, Blockly.Micropython.PinTypes.SERVO, 'Servo Write');

//  Blockly.Micropython.addInclude('servo', '#include <Servo.h>');
//  Blockly.Micropython.addDeclaration('servo_' + pinKey, 'Servo ' + servoName + ';');

//  var setupCode = servoName + '.attach(' + pinKey + ');';
//  Blockly.Micropython.addSetup('servo_' + pinKey, setupCode, true);

//  var code = servoName + '.write(' + servoAngle + ');\n';
//  return code;
//};

///**
// * Code generator to read an angle value from a servo pin (X).
// * Arduino code: #include <Servo.h>
// *               Servo myServoX;
// *               setup { myServoX.attach(X); }
// *               loop  { myServoX.read();    }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['servo_read'] = function(block) {
//  var pinKey = block.getFieldValue('SERVO_PIN');
//  var servoName = 'myServo' + pinKey;

//  Blockly.Micropython.reservePin(
//      block, pinKey, Blockly.Micropython.PinTypes.SERVO, 'Servo Read');

//  Blockly.Micropython.addInclude('servo', '#include <Servo.h>');
//  Blockly.Micropython.addDeclaration('servo_' + pinKey, 'Servo ' + servoName + ';');

//  var setupCode = servoName + '.attach(' + pinKey + ');';
//  Blockly.Micropython.addSetup('servo_' + pinKey, setupCode, true);

//  var code = servoName + '.read()';
//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//};
