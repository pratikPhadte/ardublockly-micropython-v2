/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the Time blocks.
 *     Arduino built-in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Micropython.time');

goog.require('Blockly.Micropython');

/**
 * Code generator for the delay Arduino block.
 * Arduino code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['time_delay'] = function (block) {
    var delayTime = Blockly.Micropython.valueToCode(
        block, 'DELAY_TIME_MILI', Blockly.Micropython.ORDER_ATOMIC) || '0';

    var pinImportFromCode = 'import time';
    Blockly.Micropython.addImport('sleep', pinImportFromCode);

    var code = 'time.sleep_ms(' + delayTime + ')\n';
    return code;
};

///**
// * Code generator for the delayMicroseconds block.
// * Arduino code: loop { delayMicroseconds(X); }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['time_delaymicros'] = function (block) {
//    var delayTimeMs = Blockly.Micropython.valueToCode(
//        block, 'DELAY_TIME_MICRO', Blockly.Micropython.ORDER_ATOMIC) || '0';
//    var code = 'delayMicroseconds(' + delayTimeMs + ');\n';
//    return code;
//};

///**
// * Code generator for the elapsed time in milliseconds block.
// * Arduino code: loop { millis() }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['time_millis'] = function (block) {
//    var code = 'millis()';
//    return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

///**
// * Code generator for the elapsed time in microseconds block.
// * Arduino code: loop { micros() }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['time_micros'] = function (block) {
//    var code = 'micros()';
//    return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

///**
// * Code generator for the wait forever (end of program) block
// * Arduino code: loop { while(true); }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['infinite_loop'] = function (block) {
//    return 'while(true);\n';
//};
