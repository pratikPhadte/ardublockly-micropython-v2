/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the Math blocks.
 *
 * TODO: Math on list needs lists to be implemented.
 *       math_constant and math_change needs to be tested in compiler.
 */
'use strict';

goog.provide('Blockly.Micropython.math');

goog.require('Blockly.Micropython');


// If any new block imports any library, add that library name here.
Blockly.Micropython.addReservedWords('math,random,Number');

Blockly.Micropython['math_number'] = function (block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    var order;
    if (code == Infinity) {
        code = 'float("inf")';
        order = Blockly.Micropython.ORDER_FUNCTION_CALL;
    } else if (code == -Infinity) {
        code = '-float("inf")';
        order = Blockly.Micropython.ORDER_UNARY_SIGN;
    } else {
        order = code < 0 ? Blockly.Micropython.ORDER_UNARY_SIGN :
            Blockly.Micropython.ORDER_ATOMIC;
    }
    return [code, order];
};

/**
 * Generator for a basic arithmetic operators (X and Y) and power function
 * (X ^ Y).
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Micropython['math_arithmetic'] = function (block) {
    // Basic arithmetic operators, and power.
    var OPERATORS = {
        ADD: [' + ', Blockly.Micropython.ORDER_ADDITIVE],
        MINUS: [' - ', Blockly.Micropython.ORDER_ADDITIVE],
        MULTIPLY: [' * ', Blockly.Micropython.ORDER_MULTIPLICATIVE],
        DIVIDE: [' / ', Blockly.Micropython.ORDER_MULTIPLICATIVE],
        POWER: [' ** ', Blockly.Micropython.ORDER_EXPONENTIATION]
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.Micropython.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.Micropython.valueToCode(block, 'B', order) || '0';
    var code = argument0 + operator + argument1;
    return [code, order];
    // In case of 'DIVIDE', division between integers returns different results
    // in Python 2 and 3. However, is not an issue since Blockly does not
    // guarantee identical results in all languages.  To do otherwise would
    // require every operator to be wrapped in a function call.  This would kill
    // legibility of the generated code.
};

/**
 * Generator for math operators that contain a single operand (X).
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Micropython['math_single'] = function (block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg;
    if (operator == 'NEG') {
        // Negation is a special case given its different operator precedence.
        var code = Blockly.Micropython.valueToCode(block, 'NUM',
            Blockly.Micropython.ORDER_UNARY_SIGN) || '0';
        return ['-' + code, Blockly.Micropython.ORDER_UNARY_SIGN];
    }
    Blockly.Micropython.addImport('import_math', 'import math');
    if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
        arg = Blockly.Micropython.valueToCode(block, 'NUM',
            Blockly.Micropython.ORDER_MULTIPLICATIVE) || '0';
    } else {
        arg = Blockly.Micropython.valueToCode(block, 'NUM',
            Blockly.Micropython.ORDER_NONE) || '0';
    }
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ABS':
            code = 'math.fabs(' + arg + ')';
            break;
        case 'ROOT':
            code = 'math.sqrt(' + arg + ')';
            break;
        case 'LN':
            code = 'math.log(' + arg + ')';
            break;
        case 'LOG10':
            code = 'math.log10(' + arg + ')';
            break;
        case 'EXP':
            code = 'math.exp(' + arg + ')';
            break;
        case 'POW10':
            code = 'math.pow(10,' + arg + ')';
            break;
        case 'ROUND':
            code = 'round(' + arg + ')';
            break;
        case 'ROUNDUP':
            code = 'math.ceil(' + arg + ')';
            break;
        case 'ROUNDDOWN':
            code = 'math.floor(' + arg + ')';
            break;
        case 'SIN':
            code = 'math.sin(' + arg + ' / 180.0 * math.pi)';
            break;
        case 'COS':
            code = 'math.cos(' + arg + ' / 180.0 * math.pi)';
            break;
        case 'TAN':
            code = 'math.tan(' + arg + ' / 180.0 * math.pi)';
            break;
    }
    if (code) {
        return [code, Blockly.Micropython.ORDER_FUNCTION_CALL];
    }
    // Second, handle cases which generate values that may need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ASIN':
            code = 'math.asin(' + arg + ') / math.pi * 180';
            break;
        case 'ACOS':
            code = 'math.acos(' + arg + ') / math.pi * 180';
            break;
        case 'ATAN':
            code = 'math.atan(' + arg + ') / math.pi * 180';
            break;
        default:
            throw Error('Unknown math operator: ' + operator);
    }
    return [code, Blockly.Micropython.ORDER_MULTIPLICATIVE];
};
/**
 * Generator for math constants (PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2),
 * INFINITY).
 * Arduino code: loop { constant }
 * TODO: Might need to include "#define _USE_MATH_DEFINES"
 *       The arduino header file already includes math.h
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Micropython['math_constant'] = function (block) {
    // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
    var CONSTANTS = {
        'PI': ['math.pi', Blockly.Micropython.ORDER_MEMBER],
        'E': ['math.e', Blockly.Micropython.ORDER_MEMBER],
        'GOLDEN_RATIO': ['(1 + math.sqrt(5)) / 2',
            Blockly.Micropython.ORDER_MULTIPLICATIVE],
        'SQRT2': ['math.sqrt(2)', Blockly.Micropython.ORDER_MEMBER],
        'SQRT1_2': ['math.sqrt(1.0 / 2)', Blockly.Micropython.ORDER_MEMBER],
        'INFINITY': ['float(\'inf\')', Blockly.Micropython.ORDER_ATOMIC]
    };
    var constant = block.getFieldValue('CONSTANT');
    if (constant != 'INFINITY') {
        Blockly.Micropython.addImport('import_math', 'import math');
    }
    return CONSTANTS[constant];
};

///**
// * Generator for math checks: if a number is even, odd, prime, whole, positive,
// * negative, or if it is divisible by certain number. Returns true or false.
// * Arduino code: complex code, can create external functions.
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['math_number_property'] = function(block) {
//  var number_to_check = Blockly.Micropython.valueToCode(block, 'NUMBER_TO_CHECK',
//      Blockly.Micropython.ORDER_MULTIPLICATIVE) || '0';
//  var dropdown_property = block.getFieldValue('PROPERTY');
//  var code;
//  if (dropdown_property == 'PRIME') {
//    var func = [
//        'boolean ' + Blockly.Micropython.DEF_FUNC_NAME + '(int n) {',
//        '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
//        '  if (n == 2 || n == 3) {',
//        '    return true;',
//        '  }',
//        '  // False if n is NaN, negative, is 1.',
//        '  // And false if n is divisible by 2 or 3.',
//        '  if (isnan(n) || (n <= 1) || (n == 1) || (n % 2 == 0) || ' +
//            '(n % 3 == 0)) {',
//        '    return false;',
//        '  }',
//        '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
//        '  for (int x = 6; x <= sqrt(n) + 1; x += 6) {',
//        '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
//        '      return false;',
//        '    }',
//        '  }',
//        '  return true;',
//        '}'];
//    var funcName = Blockly.Micropython.addFunction('mathIsPrime', func.join('\n'));
//    Blockly.Micropython.addInclude('math', '#include <math.h>');
//    code = funcName + '(' + number_to_check + ')';
//    return [code, Blockly.Micropython.ORDER_UNARY_POSTFIX];
//  }
//  switch (dropdown_property) {
//    case 'EVEN':
//      code = number_to_check + ' % 2 == 0';
//      break;
//    case 'ODD':
//      code = number_to_check + ' % 2 == 1';
//      break;
//    case 'WHOLE':
//      Blockly.Micropython.addInclude('math', '#include <math.h>');
//      code = '(floor(' + number_to_check + ') == ' + number_to_check + ')';
//      break;
//    case 'POSITIVE':
//      code = number_to_check + ' > 0';
//      break;
//    case 'NEGATIVE':
//      code = number_to_check + ' < 0';
//      break;
//    case 'DIVISIBLE_BY':
//      var divisor = Blockly.Micropython.valueToCode(block, 'DIVISOR',
//          Blockly.Micropython.ORDER_MULTIPLICATIVE) || '0';
//      code = number_to_check + ' % ' + divisor + ' == 0';
//      break;
//  }
//  return [code, Blockly.Micropython.ORDER_EQUALITY];
//};

///**
// * Generator to add (Y) to a variable (X).
// * If variable X has not been declared before this block it will be declared as
// * a (not initialised) global int, however globals are 0 initialised in C/C++.
// * Arduino code: loop { X += Y; }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['math_change'] = function(block) {
//  var argument0 = Blockly.Micropython.valueToCode(block, 'DELTA',
//      Blockly.Micropython.ORDER_ADDITIVE) || '0';
//  var varName = Blockly.Micropython.variableDB_.getName(
//      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
//  return varName + ' += ' + argument0 + ';\n';
//};

///** Rounding functions have a single operand. */
//Blockly.Micropython['math_round'] = Blockly.Micropython['math_single'];

///** Trigonometry functions have a single operand. */
//Blockly.Micropython['math_trig'] = Blockly.Micropython['math_single'];

///**
// * Generator for the math function to a list.
// * Arduino code: ???
// * TODO: List have to be implemented first. Removed from toolbox for now.
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['math_on_list'] = Blockly.Micropython.noGeneratorCodeInline;

///**
// * Generator for the math modulo function (calculates remainder of X/Y).
// * Arduino code: loop { X % Y }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['math_modulo'] = function(block) {
//  var argument0 = Blockly.Micropython.valueToCode(block, 'DIVIDEND',
//      Blockly.Micropython.ORDER_MULTIPLICATIVE) || '0';
//  var argument1 = Blockly.Micropython.valueToCode(block, 'DIVISOR',
//      Blockly.Micropython.ORDER_MULTIPLICATIVE) || '0';
//  var code = argument0 + ' % ' + argument1;
//  return [code, Blockly.Micropython.ORDER_MULTIPLICATIVE];
//};

/**
 * Generator for clipping a number(X) between two limits (Y and Z).
 * Arduino code: loop { (X < Y ? Y : ( X > Z ? Z : X)) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Micropython['math_constrain'] = function (block) {
    // Constrain a number between two limits.
    var argument0 = Blockly.Micropython.valueToCode(block, 'VALUE',
        Blockly.Micropython.ORDER_NONE) || '0';
    var argument1 = Blockly.Micropython.valueToCode(block, 'LOW',
        Blockly.Micropython.ORDER_NONE) || '0';
    var argument2 = Blockly.Micropython.valueToCode(block, 'HIGH',
        Blockly.Micropython.ORDER_NONE) || 'float(\'inf\')';
    var code = 'min(max(' + argument0 + ', ' + argument1 + '), ' +
        argument2 + ')';
    return [code, Blockly.Micropython.ORDER_FUNCTION_CALL];
};

///**
// * Generator for a random integer between two numbers (X and Y).
// * Arduino code: loop { math_random_int(X, Y); }
// *               and an aditional math_random_int function
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {array} Completed code with order of operation.
// */
//Blockly.Micropython['math_random_int'] = function(block) {
//  var argument0 = Blockly.Micropython.valueToCode(block, 'FROM',
//      Blockly.Micropython.ORDER_NONE) || '0';
//  var argument1 = Blockly.Micropython.valueToCode(block, 'TO',
//      Blockly.Micropython.ORDER_NONE) || '0';
//  var functionName = Blockly.Micropython.variableDB_.getDistinctName(
//      'math_random_int', Blockly.Generator.NAME_TYPE);
//  Blockly.Micropython.math_random_int.random_function = functionName;
//  var func = [
//      'int ' + Blockly.Micropython.DEF_FUNC_NAME + '(int min, int max) {',
//      '  if (min > max) {',
//      '    // Swap min and max to ensure min is smaller.',
//      '    int temp = min;',
//      '    min = max;',
//      '    max = temp;',
//      '  }',
//      '  return min + (rand() % (max - min + 1));',
//      '}'];
//  var funcName = Blockly.Micropython.addFunction('mathRandomInt', func.join('\n'));
//  var code = funcName + '(' + argument0 + ', ' + argument1 + ')';
//  return [code, Blockly.Micropython.ORDER_UNARY_POSTFIX];
//};

///**
// * Generator for a random float from 0 to 1.
// * Arduino code: loop { (rand() / RAND_MAX) }
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['math_random_float'] = function(block) {
//  return ['(rand() / RAND_MAX)', Blockly.Micropython.ORDER_UNARY_POSTFIX];
//};
