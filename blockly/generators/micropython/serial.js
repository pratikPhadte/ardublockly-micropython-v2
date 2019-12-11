/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Arduino serial blocks.
 *     Arduino Serial library docs: https://www.arduino.cc/en/Reference/Serial
 *
 * TODO: There are more functions that can be added:
 *       http://arduino.cc/en/Reference/Serial
 */
'use strict';

goog.provide('Blockly.Micropython.serial');

goog.require('Blockly.Micropython');


/**
 * Code generator of block for writing to the serial com.
 * Arduino code: loop { Serial.print(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Micropython['serial_print'] = function (block) {
    //var serialId = block.getFieldValue('SERIAL_ID');
    
    var content = Blockly.Micropython.valueToCode(block, 'CONTENT', Blockly.Micropython.ORDER_ATOMIC) || '0';    
    var checkbox_newline = (block.getFieldValue('NEW_LINE') == 'TRUE');
    
    // var serialpins = blockly.micropython.boards.selected.serialpins[serialid];
    // for (var i = 0; i < serialpins.length; i++) {
        // blockly.micropython.reservepin(block, serialpins[i][1],
            // blockly.micropython.pintypes.serial, 'serial ' + serialpins[i][0]);
    // }
    

    var code = '';

     if (checkbox_newline) {
         code = 'print(' + content + ');\n';
     } else {
         code = 'print(' + content + ', end=\'\');\n';
     }
    
    return code;
    
};

/**
 * Code generator for block for setting the serial com speed.
 * Arduino code: setup{ Serial.begin(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code.
 */
Blockly.Micropython['serial_setup'] = function (block) {
    // var serialId = block.getFieldValue('SERIAL_ID');
    // var serialSpeed = block.getFieldValue('SPEED');
    // var serialSetupCode = serialId + '.begin(' + serialSpeed + ');';
    // Blockly.Micropython.addSetup('serial_' + serialId, serialSetupCode, true);
    var code = '';
    return code;
};
