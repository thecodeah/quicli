var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// This is a self-executing function that returns an object with text decoration codes.
// The reason it's self executing is because this file is included globally and we don't
// want the create() function to be globally available.
var $ = (function () {
    var create = function (code) {
        // If none of this makes sense to you, check:
        // https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
        var bufferData = [
            0x1b,
            0x5b // [
        ];
        for (var i = 0; i < code.length; i++) {
            bufferData.push(code.charCodeAt(i));
        }
        // Pushing "m" which indicates the end of a style code sequence.
        bufferData.push(0x6d);
        return Buffer.from(bufferData).toString();
    };
    return {
        BOLD: create("1"),
        DIM: create("2"),
        UNDERSCORE: create("4"),
        BLINK: create("5"),
        INVERT: create("7"),
        HIDDEN: create("8"),
        CLEAR: create("0"),
        BLACK: create("30"),
        RED: create("31"),
        GREEN: create("32"),
        YELLOW: create("33"),
        BLUE: create("34"),
        MAGENTA: create("35"),
        CYAN: create("36"),
        WHITE: create("37"),
        BG_BLACK: create("40"),
        BG_RED: create("41"),
        BG_GREEN: create("42"),
        BG_YELLOW: create("43"),
        BG_BLUE: create("44"),
        BG_MAGENTA: create("45"),
        BG_CYAN: create("46"),
        BG_WHITE: create("47")
    };
}());
var cli = (function () {
    /**
     * An alternative to console.log() with color styling capabilities.
     * @memberof cli
     * @param args An array of strings to be written to stdout.
     */
    var log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        process.stdout.write(args.join(" ") + $.CLEAR + "\n");
    };
    /**
     * Represents a commands data and provides functions to manipulate said data.
     * @public
     */
    var Command = /** @class */ (function () {
        function Command(path, callback) {
            this.flags = [];
            this.path = path;
            this.callback = callback;
        }
        Command.prototype.getFlags = function () {
            return this.flags;
        };
        /**
         * Registers a flag to a command.
         * @param name The name of the flag.
         * @param type The type of value this flag will accept. Any by default.
         * @param required Is this flag required or optional?
         * @returns A command object for chaining.
         */
        Command.prototype.addFlag = function (name, type, required) {
            if (type === void 0) { type = "any"; }
            if (required === void 0) { required = false; }
            this.flags.push({
                name: name,
                type: type,
                required: required
            });
            return this;
        };
        return Command;
    }());
    var commandPool = [];
    /**
     * The addCommand function registers a new command to the command pool.
     * @memberof cli
     * @param path The command name. For nested commands, separate each name with a dot.
     * @param callback The function that will be called when the command is used.
     * @returns A Command object to set additional information, eg. flags.
     */
    var addCommand = function (path, callback) {
        var command = new Command(path, callback);
        commandPool.push(command);
        return command;
    };
    var parseArgs = function () {
        var args = process.argv.slice(2);
        var providedCommands = [];
        var providedFlags = [];
        args.forEach(function (arg) {
            if (arg.startsWith("-")) {
                if (arg.startsWith("--")) {
                    // It's a multi-character flag.
                    providedFlags.push({
                        name: arg.slice(2),
                        values: []
                    });
                }
                else {
                    // It's a single-character flag.
                    arg.slice(1).split("").forEach(function (singleCharFlag) {
                        providedFlags.push({
                            name: singleCharFlag,
                            values: []
                        });
                    });
                }
            }
            else {
                if (providedFlags.length > 0) {
                    // It's a flag value
                    var parsedValue = void 0;
                    if (arg.match(/^[0-9]+$/)) {
                        // It's a number
                        parsedValue = Number(arg);
                    }
                    else if (arg === "true" || arg === "false") {
                        // It's a boolean
                        parsedValue = Boolean(arg);
                    }
                    else {
                        // It's a string
                        parsedValue = arg;
                    }
                    providedFlags[providedFlags.length - 1].values.push(parsedValue);
                }
                else {
                    // It's a command
                    providedCommands.push(arg);
                }
            }
        });
        return {
            commands: providedCommands,
            flags: providedFlags
        };
    };
    var callCommand = function (args) {
        var commandPath = args.commands.join(".");
        var matchingCommand = commandPool.find(function (cmd) { return cmd.path === commandPath; });
        if (matchingCommand !== undefined) {
            // Flag handling
            var props_1 = {};
            args.flags.forEach(function (pFlag) {
                var _a;
                var matchingCmdFlag = matchingCommand.getFlags().find(function (cf) { return cf.name === pFlag.name || cf.name === "*"; });
                if (matchingCmdFlag !== undefined) {
                    // Type checking
                    var valid_1 = true;
                    if (matchingCmdFlag.type !== "any") {
                        if (pFlag.values.length === 0) {
                            valid_1 = false;
                            cli.log($.RED + "Expected value:", $.CLEAR + pFlag.name, "expects a", matchingCmdFlag.type + "!");
                        }
                        else {
                            pFlag.values.forEach(function (value) {
                                if (typeof value !== matchingCmdFlag.type) {
                                    valid_1 = false;
                                    cli.log($.RED + "Incorrect type:", $.CLEAR + pFlag.name, "must be a", matchingCmdFlag.type + "!");
                                }
                            });
                        }
                    }
                    if (valid_1) {
                        if (props_1[pFlag.name] !== undefined) {
                            (_a = props_1[pFlag.name]).push.apply(_a, pFlag.values);
                        }
                        else {
                            props_1[pFlag.name] = pFlag.values;
                        }
                    }
                }
                else {
                    cli.log($.RED + "Unexpected flag:", $.CLEAR + pFlag.name);
                }
            });
            // Check if all the required command flags were provided.
            var hasMissingFlags_1 = false;
            matchingCommand.getFlags().forEach(function (cFlag) {
                if (cFlag.required) {
                    if (cFlag.name === "*") {
                        if (Object.keys(props_1).length === 0) {
                            cli.log($.RED + "At least one flag is required!");
                        }
                    }
                    else {
                        var matchingProp = Object.keys(props_1).find(function (p) { return p === cFlag.name; });
                        if (matchingProp === undefined) {
                            hasMissingFlags_1 = true;
                            cli.log($.RED + "Missing required flag:", $.CLEAR + cFlag.name);
                        }
                    }
                }
            });
            if (!hasMissingFlags_1) {
                matchingCommand.callback(props_1);
            }
        }
        else {
            if (commandPath !== "") {
                cli.log($.RED + "Unknown command:", $.CLEAR + args.commands.join(" -> "));
            }
        }
    };
    var readline = require('readline');
    /**
     * Prompts the user for input. (stdin, stdout)
     * @memberof cli
     * @param message The message that comes before the user input.
     * @returns A promise containing the answer as a string.
     */
    function question(message) {
        return __awaiter(this, void 0, Promise, function () {
            var rl;
            return __generator(this, function (_a) {
                rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                return [2 /*return*/, new Promise(function (resolve) {
                        rl.question(((message === "") ? "" : message + " "), function (answer) {
                            rl.close();
                            resolve(answer);
                        });
                    })];
            });
        });
    }
    var executed = false;
    process.addListener("beforeExit", function (code) {
        if (executed === false) {
            executed = true;
            callCommand(parseArgs());
        }
    });
    return {
        log: log,
        addCommand: addCommand,
        question: question
    };
}());
;module.exports={$,cli};