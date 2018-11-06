/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for list blocks.
 *
 * TODO: A lot of this can be converted to arrays code by creating functions to
 *       replicate this kind of behavior.
 */
'use strict';

goog.provide('Blockly.Micropython.lists');

goog.require('Blockly.Micropython');


Blockly.Micropython['lists_create_empty'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_create_with'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_repeat'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_length'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_isEmpty'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_indexOf'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_getIndex'] = Blockly.Micropython.noGeneratorCodeInline;

Blockly.Micropython['lists_setIndex'] = Blockly.Micropython.noGeneratorCodeLine;
