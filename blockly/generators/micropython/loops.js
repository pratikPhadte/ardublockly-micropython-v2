/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the loop blocks.
 *
 * TODO: 'For each' block needs to have lists implemented.
 */
'use strict';

goog.provide('Blockly.Micropython.loops');

goog.require('Blockly.Micropython');

/**
 * Generator for the repeat block (using external number block) using a
 * For loop statement.
 * Arduino code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['controls_repeat_ext'] = function (block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
        // Internal number.
        var repeats = String(parseInt(block.getFieldValue('TIMES'), 10));
    } else {
        // External number.
        var repeats = Blockly.Micropython.valueToCode(block, 'TIMES',
            Blockly.Micropython.ORDER_NONE) || '0';
    }
    if (Blockly.isNumber(repeats)) {
        repeats = parseInt(repeats, 10);
    } else {
        repeats = 'int(' + repeats + ')';
    }
    var branch = Blockly.Micropython.statementToCode(block, 'DO');
    branch = Blockly.Micropython.addLoopTrap(branch, block.id) ||
        Blockly.Micropython.PASS;
    var loopVar = Blockly.Micropython.variableDB_.getDistinctName(
        'count', Blockly.Variables.NAME_TYPE);
    var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
    return code;
};

/**
 * Generator for the repeat block (number in a drop down) using a For loop
 * statement.
 * Arduino code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['controls_repeat'] = Blockly.Micropython['controls_repeat_ext'];


/**
 * Generator for the repeat while block using a While statement.
 * Arduino code: loop { while (X) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Micropython['controls_repeat'] = Blockly.Micropython['controls_repeat_ext'];

Blockly.Micropython['controls_whileUntil'] = function (block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.Micropython.valueToCode(block, 'BOOL',
        until ? Blockly.Micropython.ORDER_LOGICAL_NOT :
            Blockly.Micropython.ORDER_NONE) || 'False';
    var branch = Blockly.Micropython.statementToCode(block, 'DO');
    branch = Blockly.Micropython.addLoopTrap(branch, block.id) ||
        Blockly.Micropython.PASS;
    if (until) {
        argument0 = 'not ' + argument0;
    }
    return 'while ' + argument0 + ':\n' + branch;
};

/**
 * Generator for the For loop statements.
 * Arduino code: loop { for (i = X; i <= Y; i+=Z) { } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['controls_for'] = function (block) {
    // For loop.
    var variable0 = Blockly.Micropython.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.Micropython.valueToCode(block, 'FROM',
        Blockly.Micropython.ORDER_NONE) || '0';
    var argument1 = Blockly.Micropython.valueToCode(block, 'TO',
        Blockly.Micropython.ORDER_NONE) || '0';
    var increment = Blockly.Micropython.valueToCode(block, 'BY',
        Blockly.Micropython.ORDER_NONE) || '1';
    var branch = Blockly.Micropython.statementToCode(block, 'DO');
    branch = Blockly.Micropython.addLoopTrap(branch, block.id) ||
        Blockly.Micropython.PASS;

    var code = '';
    var range;

    // Helper functions.
    var defineUpRange = function () {
        return Blockly.Micropython.provideFunction_(
            'upRange',
            ['def ' + Blockly.Micropython.FUNCTION_NAME_PLACEHOLDER_ +
                '(start, stop, step):',
                '  while start <= stop:',
                '    yield start',
                '    start += abs(step)']);
    };
    var defineDownRange = function () {
        return Blockly.Micropython.provideFunction_(
            'downRange',
            ['def ' + Blockly.Micropython.FUNCTION_NAME_PLACEHOLDER_ +
                '(start, stop, step):',
                '  while start >= stop:',
                '    yield start',
                '    start -= abs(step)']);
    };
    // Arguments are legal Python code (numbers or strings returned by scrub()).
    var generateUpDownRange = function (start, end, inc) {
        return '(' + start + ' <= ' + end + ') and ' +
            defineUpRange() + '(' + start + ', ' + end + ', ' + inc + ') or ' +
            defineDownRange() + '(' + start + ', ' + end + ', ' + inc + ')';
    };

    if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
        Blockly.isNumber(increment)) {
        // All parameters are simple numbers.
        argument0 = parseFloat(argument0);
        argument1 = parseFloat(argument1);
        increment = Math.abs(parseFloat(increment));
        if (argument0 % 1 === 0 && argument1 % 1 === 0 && increment % 1 === 0) {
            // All parameters are integers.
            if (argument0 <= argument1) {
                // Count up.
                argument1++;
                if (argument0 == 0 && increment == 1) {
                    // If starting index is 0, omit it.
                    range = argument1;
                } else {
                    range = argument0 + ', ' + argument1;
                }
                // If increment isn't 1, it must be explicit.
                if (increment != 1) {
                    range += ', ' + increment;
                }
            } else {
                // Count down.
                argument1--;
                range = argument0 + ', ' + argument1 + ', -' + increment;
            }
            range = 'range(' + range + ')';
        } else {
            // At least one of the parameters is not an integer.
            if (argument0 < argument1) {
                range = defineUpRange();
            } else {
                range = defineDownRange();
            }
            range += '(' + argument0 + ', ' + argument1 + ', ' + increment + ')';
        }
    } else {
        // Cache non-trivial values to variables to prevent repeated look-ups.
        var scrub = function (arg, suffix) {
            if (Blockly.isNumber(arg)) {
                // Simple number.
                arg = parseFloat(arg);
            } else if (arg.match(/^\w+$/)) {
                // Variable.
                arg = 'float(' + arg + ')';
            } else {
                // It's complicated.
                var varName = Blockly.Micropython.variableDB_.getDistinctName(
                    variable0 + suffix, Blockly.Variables.NAME_TYPE);
                code += varName + ' = float(' + arg + ')\n';
                arg = varName;
            }
            return arg;
        };
        var startVar = scrub(argument0, '_start');
        var endVar = scrub(argument1, '_end');
        var incVar = scrub(increment, '_inc');

        if (typeof startVar == 'number' && typeof endVar == 'number') {
            if (startVar < endVar) {
                range = defineUpRange(startVar, endVar, increment);
            } else {
                range = defineDownRange(startVar, endVar, increment);
            }
        } else {
            // We cannot determine direction statically.
            range = generateUpDownRange(startVar, endVar, increment);
        }
    }
    code += 'for ' + variable0 + ' in ' + range + ':\n' + branch;
    return code;
};

///**
// * A "for each" block.
// * TODO: Removed for now from toolbox as lists are not yet implemented.
// * @param {!Blockly.Block} block Block to generate the code from.
// * @return {string} Completed code.
// */
//Blockly.Micropython['controls_forEach'] = Blockly.Micropython.noGeneratorCodeLine;

/**
 * Generator for the loop flow control statements.
 * Arduino code: loop { break;/continue; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['controls_flow_statements'] = function (block) {
    // Flow statements: continue, break.
    switch (block.getFieldValue('FLOW')) {
        case 'BREAK':
            return 'break\n';
        case 'CONTINUE':
            return 'continue\n';
    }
    throw Error('Unknown flow statement.');
};
