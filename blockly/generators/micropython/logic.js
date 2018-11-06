/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.Micropython.logic');

goog.require('Blockly.Micropython');


///**
// * Code generator to create if/if else/else statement.
// * Arduino code: loop { if (X)/else if ()/else { X } }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['controls_if'] = function (block) {
//    var n = 0;
//    var argument = Blockly.Micropython.valueToCode(block, 'IF' + n,
//        Blockly.Micropython.ORDER_NONE) || 'false';
//    var branch = Blockly.Micropython.statementToCode(block, 'DO' + n);
//    var code = 'if (' + argument + ') {\n' + branch + '}';
//    for (n = 1; n <= block.elseifCount_; n++) {
//        argument = Blockly.Micropython.valueToCode(block, 'IF' + n,
//            Blockly.Micropython.ORDER_NONE) || 'false';
//        branch = Blockly.Micropython.statementToCode(block, 'DO' + n);
//        code += ' else if (' + argument + ') {\n' + branch + '}';
//    }
//    if (block.elseCount_) {
//        branch = Blockly.Micropython.statementToCode(block, 'ELSE');
//        code += ' else {\n' + branch + '}';
//    }
//    return code + '\n';
//};

///**
// * Code generator for the comparison operator block.
// * Arduino code: loop { X operator Y }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['logic_compare'] = function (block) {
//    var OPERATORS = {
//        'EQ': '==',
//        'NEQ': '!=',
//        'LT': '<',
//        'LTE': '<=',
//        'GT': '>',
//        'GTE': '>='
//    };
//    var operator = OPERATORS[block.getFieldValue('OP')];
//    var order = (operator == '==' || operator == '!=') ?
//        Blockly.Micropython.ORDER_EQUALITY : Blockly.Micropython.ORDER_RELATIONAL;
//    var argument0 = Blockly.Micropython.valueToCode(block, 'A', order) || '0';
//    var argument1 = Blockly.Micropython.valueToCode(block, 'B', order) || '0';
//    var code = argument0 + ' ' + operator + ' ' + argument1;
//    return [code, order];
//};

///**
// * Code generator for the logic operator block.
// * Arduino code: loop { X operator Y }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['logic_operation'] = function (block) {
//    var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
//    var order = (operator == '&&') ? Blockly.Micropython.ORDER_LOGICAL_AND :
//        Blockly.Micropython.ORDER_LOGICAL_OR;
//    var argument0 = Blockly.Micropython.valueToCode(block, 'A', order) || 'false';
//    var argument1 = Blockly.Micropython.valueToCode(block, 'B', order) || 'false';
//    if (!argument0 && !argument1) {
//        // If there are no arguments, then the return value is false.
//        argument0 = 'false';
//        argument1 = 'false';
//    } else {
//        // Single missing arguments have no effect on the return value.
//        var defaultArgument = (operator == '&&') ? 'true' : 'false';
//        if (!argument0) {
//            argument0 = defaultArgument;
//        }
//        if (!argument1) {
//            argument1 = defaultArgument;
//        }
//    }
//    var code = argument0 + ' ' + operator + ' ' + argument1;
//    return [code, order];
//};

///**
// * Code generator for the logic negate operator.
// * Arduino code: loop { !X }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['logic_negate'] = function (block) {
//    var order = Blockly.Micropython.ORDER_UNARY_PREFIX;
//    var argument0 = Blockly.Micropython.valueToCode(block, 'BOOL', order) || 'false';
//    var code = '!' + argument0;
//    return [code, order];
//};

/**
 * Code generator for the boolean values true and false.
 * Arduino code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['logic_boolean'] = function (block) {
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
    return [code, Blockly.Micropython.ORDER_ATOMIC];
};

///**
// * Code generator for the null value.
// * Arduino code: loop { X ? Y : Z }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['logic_null'] = function (block) {
//    var code = 'NULL';
//    return [code, Blockly.Micropython.ORDER_ATOMIC];
//};

///**
// * Code generator for the ternary operator.
// * Arduino code: loop { NULL }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// *
// * TODO: Check types of THEN and ELSE blocks and add warning to this block if
// *       they are different from each other.
// */
//Blockly.Micropython['logic_ternary'] = function (block) {
//    var valueIf = Blockly.Micropython.valueToCode(block, 'IF',
//        Blockly.Micropython.ORDER_CONDITIONAL) || 'false';
//    var valueThen = Blockly.Micropython.valueToCode(block, 'THEN',
//        Blockly.Micropython.ORDER_CONDITIONAL) || 'null';
//    var valueElse = Blockly.Micropython.valueToCode(block, 'ELSE',
//        Blockly.Micropython.ORDER_CONDITIONAL) || 'null';
//    var code = valueIf + ' ? ' + valueThen + ' : ' + valueElse;
//    return [code, Blockly.Micropython.ORDER_CONDITIONAL];
//};
