/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for variables blocks.
 */
'use strict';

goog.provide('Blockly.Micropython.variables');

goog.require('Blockly.Micropython');


///**
// * Code generator for variable (X) getter.
// * Arduino code: loop { X }
// * @param {Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['variables_get'] = function(block) {
//  var code = Blockly.Micropython.variableDB_.getName(block.getFieldValue('VAR'),
//      Blockly.Variables.NAME_TYPE);
//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

///**
// * Code generator for variable (X) setter (Y).
// * Arduino code: type X;
// *               loop { X = Y; }
// * @param {Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['variables_set'] = function(block) {
//  var argument0 = Blockly.Micropython.valueToCode(block, 'VALUE',
//      Blockly.Micropython.ORDER_ASSIGNMENT) || '0';
//  var varName = Blockly.Micropython.variableDB_.getName(
//      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
//  return varName + ' = ' + argument0 + ';\n';
//};

///**
// * Code generator for variable (X) casting (Y).
// * Arduino code: loop { (Y)X }
// * @param {Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['variables_set_type'] = function(block) {
//  var argument0 = Blockly.Micropython.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
//      Blockly.Micropython.ORDER_ASSIGNMENT) || '0';
//  var varType = Blockly.Micropython.getArduinoType_(
//      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
//  var code = '(' + varType + ')(' + argument0 + ')';
//  return [code, Blockly.Micropython.ORDER_ATOMIC];
//};
