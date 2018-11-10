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

Blockly.Micropython.addReservedWords(
    // import keyword
    // print(','.join(sorted(keyword.kwlist)))
    // https://docs.python.org/3/reference/lexical_analysis.html#keywords
    // https://docs.python.org/2/reference/lexical_analysis.html#keywords
    'False,None,True,and,as,assert,break,class,continue,def,del,elif,else,' +
    'except,exec,finally,for,from,global,if,import,in,is,lambda,nonlocal,not,' +
    'or,pass,print,raise,return,try,while,with,yield,' +
    // https://docs.python.org/3/library/constants.html
    // https://docs.python.org/2/library/constants.html
    'NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
    // >>> print(','.join(sorted(dir(__builtins__))))
    // https://docs.python.org/3/library/functions.html
    // https://docs.python.org/2/library/functions.html
    'ArithmeticError,AssertionError,AttributeError,BaseException,' +
    'BlockingIOError,BrokenPipeError,BufferError,BytesWarning,' +
    'ChildProcessError,ConnectionAbortedError,ConnectionError,' +
    'ConnectionRefusedError,ConnectionResetError,DeprecationWarning,EOFError,' +
    'Ellipsis,EnvironmentError,Exception,FileExistsError,FileNotFoundError,' +
    'FloatingPointError,FutureWarning,GeneratorExit,IOError,ImportError,' +
    'ImportWarning,IndentationError,IndexError,InterruptedError,' +
    'IsADirectoryError,KeyError,KeyboardInterrupt,LookupError,MemoryError,' +
    'ModuleNotFoundError,NameError,NotADirectoryError,NotImplemented,' +
    'NotImplementedError,OSError,OverflowError,PendingDeprecationWarning,' +
    'PermissionError,ProcessLookupError,RecursionError,ReferenceError,' +
    'ResourceWarning,RuntimeError,RuntimeWarning,StandardError,' +
    'StopAsyncIteration,StopIteration,SyntaxError,SyntaxWarning,SystemError,' +
    'SystemExit,TabError,TimeoutError,TypeError,UnboundLocalError,' +
    'UnicodeDecodeError,UnicodeEncodeError,UnicodeError,' +
    'UnicodeTranslateError,UnicodeWarning,UserWarning,ValueError,Warning,' +
    'ZeroDivisionError,_,__build_class__,__debug__,__doc__,__import__,' +
    '__loader__,__name__,__package__,__spec__,abs,all,any,apply,ascii,' +
    'basestring,bin,bool,buffer,bytearray,bytes,callable,chr,classmethod,cmp,' +
    'coerce,compile,complex,copyright,credits,delattr,dict,dir,divmod,' +
    'enumerate,eval,exec,execfile,exit,file,filter,float,format,frozenset,' +
    'getattr,globals,hasattr,hash,help,hex,id,input,int,intern,isinstance,' +
    'issubclass,iter,len,license,list,locals,long,map,max,memoryview,min,' +
    'next,object,oct,open,ord,pow,print,property,quit,range,raw_input,reduce,' +
    'reload,repr,reversed,round,set,setattr,slice,sorted,staticmethod,str,' +
    'sum,super,tuple,type,unichr,unicode,vars,xrange,zip'
);


/**
 * Order of operation ENUMs.
 * http://docs.python.org/reference/expressions.html#summary
 */

Blockly.Micropython.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.Micropython.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.Micropython.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.Micropython.ORDER_MEMBER = 2.1;          // . []
Blockly.Micropython.ORDER_FUNCTION_CALL = 2.2;   // ()
Blockly.Micropython.ORDER_EXPONENTIATION = 3;    // **
Blockly.Micropython.ORDER_UNARY_SIGN = 4;        // + -
Blockly.Micropython.ORDER_BITWISE_NOT = 4;       // ~
Blockly.Micropython.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.Micropython.ORDER_ADDITIVE = 6;          // + -
Blockly.Micropython.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.Micropython.ORDER_BITWISE_AND = 8;       // &
Blockly.Micropython.ORDER_BITWISE_XOR = 9;       // ^
Blockly.Micropython.ORDER_BITWISE_OR = 10;       // |
Blockly.Micropython.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
//     <, <=, >, >=, <>, !=, ==
Blockly.Micropython.ORDER_LOGICAL_NOT = 12;      // not
Blockly.Micropython.ORDER_LOGICAL_AND = 13;      // and
Blockly.Micropython.ORDER_LOGICAL_OR = 14;       // or
Blockly.Micropython.ORDER_CONDITIONAL = 15;      // if else
Blockly.Micropython.ORDER_LAMBDA = 16;           // lambda
Blockly.Micropython.ORDER_NONE = 99;             // (...)


///**
// * List of outer-inner pairings that do NOT require parentheses.
// * @type {!Array.<!Array.<number>>}
// */
//Blockly.Micropython.ORDER_OVERRIDES = [
//    // (foo()).bar -> foo().bar
//    // (foo())[0] -> foo()[0]
//    [Blockly.Micropython.ORDER_FUNCTION_CALL, Blockly.Micropython.ORDER_MEMBER],
//    // (foo())() -> foo()()
//    [Blockly.Micropython.ORDER_FUNCTION_CALL, Blockly.Micropython.ORDER_FUNCTION_CALL],
//    // (foo.bar).baz -> foo.bar.baz
//    // (foo.bar)[0] -> foo.bar[0]
//    // (foo[0]).bar -> foo[0].bar
//    // (foo[0])[1] -> foo[0][1]
//    [Blockly.Micropython.ORDER_MEMBER, Blockly.Micropython.ORDER_MEMBER],
//    // (foo.bar)() -> foo.bar()
//    // (foo[0])() -> foo[0]()
//    [Blockly.Micropython.ORDER_MEMBER, Blockly.Micropython.ORDER_FUNCTION_CALL],

//    // not (not foo) -> not not foo
//    [Blockly.Micropython.ORDER_LOGICAL_NOT, Blockly.Micropython.ORDER_LOGICAL_NOT],
//    // a and (b and c) -> a and b and c
//    [Blockly.Micropython.ORDER_LOGICAL_AND, Blockly.Micropython.ORDER_LOGICAL_AND],
//    // a or (b or c) -> a or b or c
//    [Blockly.Micropython.ORDER_LOGICAL_OR, Blockly.Micropython.ORDER_LOGICAL_OR]
//];

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
    /**
    * Empty loops or conditionals are not allowed in Micropython.
    */
    Blockly.Micropython.PASS = this.INDENT + 'pass\n';
    // Create a dictionary of definitions to be printed at the top of the sketch
    Blockly.Micropython.imports_ = Object.create(null);
    // Create a dictionary of definitions to be printed at the top of the sketch
    Blockly.Micropython.setups_ = Object.create(null);
    // Create a dictionary of global definitions to be printed after variables
    Blockly.Micropython.definitions_ = Object.create(null);
    // Create a dictionary of global definitions to be printed after variables
    Blockly.Micropython.declarations_ = Object.create(null);
    // Create a dictionary of variables
    Blockly.Micropython.variables_ = Object.create(null);
    // Create a dictionary of functions from the code generator
    Blockly.Micropython.codeFunctions_ = Object.create(null);
    // Create a dictionary of functions created by the user
    Blockly.Micropython.userFunctions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions)
    Blockly.Micropython.functionNames_ = Object.create(null);
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
            Blockly.Micropython.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ' = None');
    }
};


/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.Micropython.finish = function (code) {
    // Convert the includes, definitions, and functions dictionaries into lists
    var imports = [];
    var definitions = [];
    var declarations = [];
    var setups = [];
    var variables = [];
    var functions = [];

    for (var name in Blockly.Micropython.imports_) {
        imports.push(Blockly.Micropython.imports_[name]);
    }
    if (imports.length) {
        imports.push('\n');
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
    for (var name in Blockly.Micropython.declarations_) {
        declarations.push(Blockly.Micropython.declarations_[name]);
    }
    if (declarations.length) {
        declarations.push('\n');
    }
    for (var name in Blockly.Micropython.setups_) {
        setups.push(Blockly.Micropython.setups_[name]);
    }
    if (setups.length) {
        setups.push('\n');
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

    //// userSetupCode added at the end of the setup function without leading spaces
    //var setups = [''], userSetupCode = '';
    //if (Blockly.Micropython.setups_['userSetupCode'] !== undefined) {
    //    userSetupCode = '\n' + Blockly.Micropython.setups_['userSetupCode'];
    //    delete Blockly.Micropython.setups_['userSetupCode'];
    //}
    //for (var name in Blockly.Micropython.setups_) {
    //    setups.push(Blockly.Micropython.setups_[name]);
    //}
    //if (userSetupCode) {
    //    setups.push(userSetupCode);
    //}

    // Clean up temporary data
    delete Blockly.Micropython.imports_;
    delete Blockly.Micropython.definitions_;
    delete Blockly.Micropython.declarations_;
    delete Blockly.Micropython.setups_;
    delete Blockly.Micropython.codeFunctions_;
    delete Blockly.Micropython.userFunctions_;
    delete Blockly.Micropython.functionNames_;
    delete Blockly.Micropython.pins_;

    Blockly.Micropython.variableDB_.reset();

    var defs = imports.join('\n') +
        definitions.join('\n') + declarations.join('\n') +
        variables.join('\n') + functions.join('\n\n');
    var setup = '\# Setup:\n' + setups.join('\n');
    var body = '\# Body:\n' + code.replace(/\n/g, '\n');
    return defs + setup + body;
};

/**
 * Adds a string of "import" code to be added to the sketch.
 * Once a import is added it will not get overwritten with new code.
 * @param {!string} importTag Identifier for this import code.
 * @param {!string} code Code to be importd at the very top of the sketch.
 */
Blockly.Micropython.addImport = function (importTag, code) {
    if (Blockly.Micropython.imports_[importTag] === undefined) {
        Blockly.Micropython.imports_[importTag] = code;
    }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Micropython.addDeclaration = function (declarationTag, code) {
    if (Blockly.Micropython.declarations_[declarationTag] === undefined) {
        Blockly.Micropython.declarations_[declarationTag] = code;
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
    return line + '\n';
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
Blockly.Micropython.getArduinoType_ = function (typeBlockly) {
    switch (typeBlockly.typeId) {
        case Blockly.Types.SHORT_NUMBER.typeId:
            return 'int';
        case Blockly.Types.NUMBER.typeId:
            return 'int';
        case Blockly.Types.LARGE_NUMBER.typeId:
            return 'int';
        case Blockly.Types.DECIMAL.typeId:
            return 'float';
        case Blockly.Types.TEXT.typeId:
            return 'str';
        case Blockly.Types.CHARACTER.typeId:
            return 'int';
        case Blockly.Types.BOOLEAN.typeId:
            return 'int';
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
