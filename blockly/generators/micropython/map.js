/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Arduino map functionality.
 *     Arduino built-in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Micropython.map');

goog.require('Blockly.Micropython');


///**
// * Code generator for the map block.
// * Arduino code: loop { map(x, 0, 1024, 0, y) }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['base_map'] = function(block) {
//  var valueNum = Blockly.Micropython.valueToCode(
//      block, 'NUM', Blockly.Micropython.ORDER_NONE) || '0';
//  var valueDmax = Blockly.Micropython.valueToCode(
//      block, 'DMAX', Blockly.Micropython.ORDER_ATOMIC) || '0';

//  var code = 'map(' + valueNum + ', 0, 1024, 0, ' + valueDmax + ')';
//  return [code, Blockly.Micropython.ORDER_NONE];
//};
