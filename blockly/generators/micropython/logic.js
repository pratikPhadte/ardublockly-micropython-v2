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


/**
 * Code generator to create if/if else/else statement.
 * Arduino code: loop { if (X)/else if ()/else { X } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Micropython['controls_if'] = function (block) {
    // If/elseif/else condition.
    var n = 0;
    var code = '', branchCode, conditionCode;
    do {
        conditionCode = Blockly.Micropython.valueToCode(block, 'IF' + n,
            Blockly.Micropython.ORDER_NONE) || 'False';
        branchCode = Blockly.Micropython.statementToCode(block, 'DO' + n) ||
            Blockly.Micropython.PASS;
        code += (n == 0 ? 'if ' : 'elif ') + conditionCode + ':\n' + branchCode;

        ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        branchCode = Blockly.Micropython.statementToCode(block, 'ELSE') ||
            Blockly.Micropython.PASS;
        code += 'else:\n' + branchCode;
    }
    return code;
};

Blockly.Micropython['controls_ifelse'] = Blockly.Micropython['controls_if'];


/**
 * Code generator for the comparison operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Micropython['logic_compare'] = function (block) {
    // Comparison operator.
    var OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = Blockly.Micropython.ORDER_RELATIONAL;
    var argument0 = Blockly.Micropython.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.Micropython.valueToCode(block, 'B', order) || '0';
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};

/**
 * Code generator for the logic operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['logic_operation'] = function (block) {
    // Operations 'and', 'or'.
    var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
    var order = (operator == 'and') ? Blockly.Micropython.ORDER_LOGICAL_AND :
        Blockly.Micropython.ORDER_LOGICAL_OR;
    var argument0 = Blockly.Micropython.valueToCode(block, 'A', order);
    var argument1 = Blockly.Micropython.valueToCode(block, 'B', order);
    if (!argument0 && !argument1) {
        // If there are no arguments, then the return value is false.
        argument0 = 'False';
        argument1 = 'False';
    } else {
        // Single missing arguments have no effect on the return value.
        var defaultArgument = (operator == 'and') ? 'True' : 'False';
        if (!argument0) {
            argument0 = defaultArgument;
        }
        if (!argument1) {
            argument1 = defaultArgument;
        }
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};

/**
 * Code generator for the logic negate operator.
 * Arduino code: loop { !X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['logic_negate'] = function (block) {
    // Negation.
    var argument0 = Blockly.Micropython.valueToCode(block, 'BOOL',
        Blockly.Micropython.ORDER_LOGICAL_NOT) || 'True';
    var code = 'not ' + argument0;
    return [code, Blockly.Micropython.ORDER_LOGICAL_NOT];
};

/**
 * Code generator for the boolean values true and false.
 * Arduino code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['logic_boolean'] = function (block) {
    // Boolean values true and false.
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
    return [code, Blockly.Micropython.ORDER_ATOMIC];
};

/**
 * Code generator for the null value.
 * Arduino code: loop { X ? Y : Z }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['logic_null'] = function (block) {
    // Null data type.
    return ['None', Blockly.Micropython.ORDER_ATOMIC];
};

/**
 * Code generator for the ternary operator.
 * Arduino code: loop { NULL }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 *
 * TODO: Check types of THEN and ELSE blocks and add warning to this block if
 *       they are different from each other.
 */
Blockly.Micropython['logic_ternary'] = function (block) {
    // Ternary operator.
    var value_if = Blockly.Micropython.valueToCode(block, 'IF',
        Blockly.Micropython.ORDER_CONDITIONAL) || 'False';
    var value_then = Blockly.Micropython.valueToCode(block, 'THEN',
        Blockly.Micropython.ORDER_CONDITIONAL) || 'None';
    var value_else = Blockly.Micropython.valueToCode(block, 'ELSE',
        Blockly.Micropython.ORDER_CONDITIONAL) || 'None';
    var code = value_then + ' if ' + value_if + ' else ' + value_else;
    return [code, Blockly.Micropython.ORDER_CONDITIONAL];
};
