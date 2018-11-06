/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Based on work of Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *
 * @fileoverview Helper functions for generating Micropython language (C++).
 */
'use strict';

goog.provide('Blockly.Micropython');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');


/**
 * Micropython code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Micropython = new Blockly.Generator('Micropython');
Blockly.Micropython.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * Micropython specific keywords defined in: http://arduino.cc/en/Reference/HomePage
 * @private
 */

//Blockly.Micropython.addReservedWords(
//    'Blockly,' +  // In case JS is evaled in the current window.
//    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
//    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
//    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
//    'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
//    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
//    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
//    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
//    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
//    'detachInterrupt,interrupts,noInterrupts');

Blockly.Micropython.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'from,import');

/** Order of operation ENUMs. */
Blockly.Micropython.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Micropython.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Micropython.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Micropython.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Micropython.ORDER_ADDITIVE = 4;       // + -
Blockly.Micropython.ORDER_SHIFT = 5;          // << >>
Blockly.Micropython.ORDER_RELATIONAL = 6;     // >= > <= <
Blockly.Micropython.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Micropython.ORDER_BITWISE_AND = 8;    // &
Blockly.Micropython.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Micropython.ORDER_BITWISE_OR = 10;    // |
Blockly.Micropython.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Micropython.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Micropython.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Micropython.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Micropython.ORDER_NONE = 99;          // (...)

/**
 * A list of types tasks that the pins can be assigned. Used to track usage and
 * warn if the same pin has been assigned to more than one task.
 */
Blockly.Micropython.PinTypes = {
    INPUT: 'INPUT',
    OUTPUT: 'OUTPUT',
    PWM: 'PWM',
    SERVO: 'SERVO',
    STEPPER: 'STEPPER',
    SERIAL: 'SERIAL',
    I2C: 'I2C/TWI',
    SPI: 'SPI'
};

/**
 * Micropython generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.Micropython.DEF_FUNC_NAME = Blockly.Micropython.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Micropython.init = function (workspace) {
    // Create a dictionary of definitions to be printed at the top of the sketch
    Blockly.Micropython.fromimports_ = Object.create(null);
    // Create a dictionary of global definitions to be printed after variables
    Blockly.Micropython.definitions_ = Object.create(null);
    // Create a dictionary of variables
    Blockly.Micropython.variables_ = Object.create(null);
    // Create a dictionary of functions from the code generator
    Blockly.Micropython.codeFunctions_ = Object.create(null);
    // Create a dictionary of functions created by the user
    Blockly.Micropython.userFunctions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions)
    Blockly.Micropython.functionNames_ = Object.create(null);
    // Create a dictionary of setups to be printed in the setup() function
    Blockly.Micropython.setups_ = Object.create(null);
    // Create a dictionary of pins to check if their use conflicts
    Blockly.Micropython.pins_ = Object.create(null);

    if (!Blockly.Micropython.variableDB_) {
        Blockly.Micropython.variableDB_ =
            new Blockly.Names(Blockly.Micropython.RESERVED_WORDS_);
    } else {
        Blockly.Micropython.variableDB_.reset();
    }

    // Iterate through to capture all blocks types and set the function arguments
    var varsWithTypes = Blockly.Micropython.StaticTyping.collectVarsWithTypes(workspace);
    Blockly.Micropython.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

    // Set variable declarations with their Micropython type in the defines dictionary
    for (var varName in varsWithTypes) {
        Blockly.Micropython.addVariable(varName,
            Blockly.Micropython.getMicropythonType_(varsWithTypes[varName]) + ' ' +
            Blockly.Micropython.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
    }
};

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.Micropython.finish = function (code) {
    // Convert the includes, definitions, and functions dictionaries into lists
    var fromimports = [];
    var definitions = [];
    var variables = [];
    var functions = [];

    for (var name in Blockly.Micropython.fromimports_) {
        fromimports.push(Blockly.Micropython.fromimports_[name]);
    }
    if (fromimports.length) {
        fromimports.push('\n');
    }
    for (var name in Blockly.Micropython.variables_) {
        variables.push(Blockly.Micropython.variables_[name]);
    }
    if (variables.length) {
        variables.push('\n');
    }
    for (var name in Blockly.Micropython.definitions_) {
        definitions.push(Blockly.Micropython.definitions_[name]);
    }
    if (definitions.length) {
        definitions.push('\n');
    }
    for (var name in Blockly.Micropython.codeFunctions_) {
        functions.push(Blockly.Micropython.codeFunctions_[name]);
    }
    for (var name in Blockly.Micropython.userFunctions_) {
        functions.push(Blockly.Micropython.userFunctions_[name]);
    }
    if (functions.length) {
        functions.push('\n');
    }

    // userSetupCode added at the end of the setup function without leading spaces
    var setups = [''], userSetupCode = '';
    if (Blockly.Micropython.setups_['userSetupCode'] !== undefined) {
        userSetupCode = '\n' + Blockly.Micropython.setups_['userSetupCode'];
        delete Blockly.Micropython.setups_['userSetupCode'];
    }
    for (var name in Blockly.Micropython.setups_) {
        setups.push(Blockly.Micropython.setups_[name]);
    }
    if (userSetupCode) {
        setups.push(userSetupCode);
    }

    // Clean up temporary data
    delete Blockly.Micropython.fromimports_;
    delete Blockly.Micropython.definitions_;
    delete Blockly.Micropython.codeFunctions_;
    delete Blockly.Micropython.userFunctions_;
    delete Blockly.Micropython.functionNames_;
    delete Blockly.Micropython.setups_;
    delete Blockly.Micropython.pins_;

    Blockly.Micropython.variableDB_.reset();

    var allDefs = fromimports.join('\n') + variables.join('\n') +
        definitions.join('\n') + functions.join('\n\n');
    var setup = setups.join('\n') + '\n\n';
    var loop = code.replace(/\n/g, '\n');
    return allDefs + setup + loop;
};

/**
 * Adds a string of "fromimport" code to be added to the sketch.
 * Once a fromimport is added it will not get overwritten with new code.
 * @param {!string} fromimportTag Identifier for this fromimport code.
 * @param {!string} code Code to be fromimportd at the very top of the sketch.
 */
Blockly.Micropython.addFromImport = function (fromimportTag, code) {
    if (Blockly.Micropython.fromimports_[fromimportTag] === undefined) {
        Blockly.Micropython.fromimports_[fromimportTag] = code;
    }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Micropython.addDeclaration = function (declarationTag, code) {
    if (Blockly.Micropython.definitions_[declarationTag] === undefined) {
        Blockly.Micropython.definitions_[declarationTag] = code;
    }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Micropython.addDefinition = function (definitionTag, code) {
    if (Blockly.Micropython.definitions_[definitionTag] === undefined) {
        Blockly.Micropython.definitions_[definitionTag] = code;
    }
};

/**
 * Adds a string of code to declare a variable globally to the sketch.
 * Only if overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} varName The name of the variable to declare.
 * @param {!string} code Code to be added for the declaration.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the declaration overwrote a previous one.
 */
Blockly.Micropython.addVariable = function (varName, code, overwrite) {
    var overwritten = false;
    if (overwrite || (Blockly.Micropython.variables_[varName] === undefined)) {
        Blockly.Micropython.variables_[varName] = code;
        overwritten = true;
    }
    return overwritten;
};

/**
 * Adds a string of code into the Micropython setup() function. It takes an
 * identifier to not repeat the same kind of initialisation code from several
 * blocks. If overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} setupTag Identifier for the type of set up code.
 * @param {!string} code Code to be included in the setup() function.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the new setup code overwrote a previous one.
 */
Blockly.Micropython.addSetup = function (setupTag, code, overwrite) {
    var overwritten = false;
    if (overwrite || (Blockly.Micropython.setups_[setupTag] === undefined)) {
        Blockly.Micropython.setups_[setupTag] = code;
        overwritten = true;
    }
    return overwritten;
};

/**
 * Adds a string of code as a function. It takes an identifier (meant to be the
 * function name) to only keep a single copy even if multiple blocks might
 * request this function to be created.
 * A function (and its code) will only be added on first request.
 * @param {!string} preferedName Identifier for the function.
 * @param {!string} code Code to be included in the setup() function.
 * @return {!string} A unique function name based on input name.
 */
Blockly.Micropython.addFunction = function (preferedName, code) {
    if (Blockly.Micropython.codeFunctions_[preferedName] === undefined) {
        var uniqueName = Blockly.Micropython.variableDB_.getDistinctName(
            preferedName, Blockly.Generator.NAME_TYPE);
        Blockly.Micropython.codeFunctions_[preferedName] =
            code.replace(Blockly.Micropython.DEF_FUNC_NAME, uniqueName);
        Blockly.Micropython.functionNames_[preferedName] = uniqueName;
    }
    return Blockly.Micropython.functionNames_[preferedName];
};

/**
 * Description.
 * @param {!Blockly.Block} block Description.
 * @param {!string} pin Description.
 * @param {!string} pinType Description.
 * @param {!string} warningTag Description.
 */
Blockly.Micropython.reservePin = function (block, pin, pinType, warningTag) {
    if (Blockly.Micropython.pins_[pin] !== undefined) {
        if (Blockly.Micropython.pins_[pin] != pinType) {
            block.setWarningText(Blockly.Msg.ARD_PIN_WARN1.replace('%1', pin)
                .replace('%2', warningTag).replace('%3', pinType)
                .replace('%4', Blockly.Micropython.pins_[pin]), warningTag);
        } else {
            block.setWarningText(null, warningTag);
        }
    } else {
        Blockly.Micropython.pins_[pin] = pinType;
        block.setWarningText(null, warningTag);
    }
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Micropython.scrubNakedValue = function (line) {
    return line + ';\n';
};

/**
 * Encode a string as a properly escaped Micropython string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Micropython string.
 * @private
 */
Blockly.Micropython.quote_ = function (string) {
    // TODO: This is a quick hack.  Replace with goog.string.quote
    string = string.replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\\n')
        .replace(/\$/g, '\\$')
        .replace(/'/g, '\\\'');
    return '\"' + string + '\"';
};

/**
 * Common tasks for generating Micropython from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Micropython code created for this block.
 * @return {string} Micropython code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Micropython.scrub_ = function (block, code) {
    if (code === null) { return ''; } // Block has handled code generation itself

    var commentCode = '';
    // Only collect comments for blocks that aren't inline
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            commentCode += this.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments
        // Don't collect comments for nested statements
        for (var x = 0; x < block.inputList.length; x++) {
            if (block.inputList[x].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[x].connection.targetBlock();
                if (childBlock) {
                    var comment = this.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += this.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};

/**
 * Generates Micropython Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} Micropython type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.Micropython.getMicropythonType_ = function (typeBlockly) {
    switch (typeBlockly.typeId) {
        case Blockly.Types.SHORT_NUMBER.typeId:
            return 'char';
        case Blockly.Types.NUMBER.typeId:
            return 'int';
        case Blockly.Types.LARGE_NUMBER.typeId:
            return 'long';
        case Blockly.Types.DECIMAL.typeId:
            return 'float';
        case Blockly.Types.TEXT.typeId:
            return 'String';
        case Blockly.Types.CHARACTER.typeId:
            return 'char';
        case Blockly.Types.BOOLEAN.typeId:
            return 'boolean';
        case Blockly.Types.NULL.typeId:
            return 'void';
        case Blockly.Types.UNDEF.typeId:
            return 'undefined';
        case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
            // If no block connected default to int, change for easier debugging
            //return 'ChildBlockMissing';
            return 'int';
        default:
            return 'Invalid Blockly Type';
    }
};

/** Used for not-yet-implemented block code generators */
Blockly.Micropython.noGeneratorCodeInline = function () {
    return ['', Blockly.Micropython.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.Micropython.noGeneratorCodeLine = function () {
    return '';
};
