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
var $ = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    BG_BLACK: "\x1b[40m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m",
    BG_YELLOW: "\x1b[43m",
    BG_BLUE: "\x1b[44m",
    BG_MAGENTA: "\x1b[45m",
    BG_CYAN: "\x1b[46m",
    BG_WHITE: "\x1b[47m",
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    UNDERSCORE: "\x1b[4m",
    BLINK: "\x1b[5m",
    INVERT: "\x1b[7m",
    HIDDEN: "\x1b[8m",
    // CLEAR has to come last. Whenever a run-time error occurs, it'll print all the
    // code of the line where the error occurred. In case of QuiCLI, all of the code
    // is minified into one line. Because of that, these text decoration values will
    // also be printed. We want to make sure that the last instruction it prints is
    // CLEAR in order to keep the error message and stack unaffected.
    CLEAR: "\x1b[0m"
};
var cli = (function () {
    var log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        process.stdout.write(args.join(" ") + $.CLEAR + "\n");
    };
    var Command = /** @class */ (function () {
        function Command(path, callback) {
            this.flags = [];
            this.path = path;
            this.callback = callback;
        }
        Command.prototype.getFlags = function () {
            return this.flags;
        };
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
        if (commandPath !== "") {
            var matchingCommand_1 = commandPool.find(function (cmd) { return cmd.path === commandPath; });
            if (matchingCommand_1 !== undefined) {
                // Flag handling
                var props_1 = {};
                args.flags.forEach(function (pFlag) {
                    var _a;
                    var matchingCmdFlag = matchingCommand_1.getFlags().find(function (cf) { return cf.name === pFlag.name || cf.name === "*"; });
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
                matchingCommand_1.getFlags().forEach(function (cFlag) {
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
                    matchingCommand_1.callback(props_1);
                }
            }
            else {
                cli.log($.RED + "Unknown command:", $.CLEAR + args.commands.join(" -> "));
            }
        }
    };
    var keyCodes = {
        exit: Buffer.from([0x03]),
        enter: Buffer.from([0x0d]),
        delete: Buffer.from([0x7F]),
        // The following key codes are escape sequences.
        arrowUp: Buffer.from([0x1b, "[".charCodeAt(0), "A".charCodeAt(0)]),
        arrowDown: Buffer.from([0x1b, "[".charCodeAt(0), "B".charCodeAt(0)]),
    };
    var InputPrompt = /** @class */ (function () {
        function InputPrompt(message, censored) {
            if (censored === void 0) { censored = false; }
            this.input = "";
            this.message = message;
            this.censored = censored;
        }
        InputPrompt.prototype.prompt = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.render();
                    process.stdin.resume();
                    process.stdin.setRawMode(true);
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handleData = function (data) {
                                var keyName = Object.keys(keyCodes).find(function (name) { return data.compare(keyCodes[name]) === 0; });
                                if (keyName !== undefined) {
                                    switch (keyName) {
                                        case "enter": {
                                            process.stdin.pause();
                                            process.stdin.setRawMode(false);
                                            process.stdin.removeListener("data", handleData);
                                            // Clear text decorations in case any of them were set in the provided message.
                                            process.stdout.write($.CLEAR + "\n");
                                            resolve(_this.input);
                                            return;
                                        }
                                        case "delete": {
                                            _this.input = _this.input.slice(0, -1);
                                            break;
                                        }
                                        case "exit": {
                                            process.stdout.write($.CLEAR + "\n");
                                            process.exit(1);
                                        }
                                    }
                                }
                                else {
                                    // This conditional might not make any sense at first sight. If we parse the input character by
                                    // character then the length will always be one! Right? Well, in case of a special instruction
                                    // the length is longer, for example: the instruction to move the cursor to the left by one is
                                    // '\x1B[D'. That's three characters.
                                    if (data.toString().length === 1) {
                                        _this.input += data.toString();
                                    }
                                }
                                _this.render();
                            };
                            return process.stdin.on("data", handleData);
                        })];
                });
            });
        };
        InputPrompt.prototype.render = function () {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write($.CLEAR + this.message + " ");
            if (this.censored) {
                process.stdout.write(this.input.replace(/./g, "*"));
            }
            else {
                process.stdout.write(this.input);
            }
        };
        return InputPrompt;
    }());
    function promptInput(message, censored) {
        if (censored === void 0) { censored = false; }
        return new InputPrompt(message, censored).prompt();
    }
    var MenuPrompt = /** @class */ (function () {
        function MenuPrompt(items) {
            this.items = [];
            this.cursor = 0;
            if (Array.isArray(items)) {
                if (items.length > 0) {
                    if (typeof items[0] === "string") {
                        // If an array of strings were provided, convert it to an array of MenuItem's
                        this.items = items.map(function (str, index) { return ({ text: str, value: index }); });
                    }
                    else {
                        var validItems = items.filter(function (item) { return "text" in item && "value" in item; });
                        if (validItems.length > 0) {
                            this.items = validItems;
                        }
                        else {
                            throw new Error("Menu items must either be an array of strings or an array of { text: string, value: any }");
                        }
                    }
                }
            }
            else {
                throw new Error("Menu constructor expects 'items' to be an array!");
            }
        }
        MenuPrompt.prototype.prompt = function () {
            return __awaiter(this, void 0, Promise, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.render(false);
                    process.stdin.resume();
                    // Process the input character-by-character.
                    process.stdin.setRawMode(true);
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handleData = function (data) {
                                var keyName = Object.keys(keyCodes).find(function (name) { return data.compare(keyCodes[name]) === 0; });
                                if (keyName !== undefined) {
                                    switch (keyName) {
                                        case "arrowUp": {
                                            _this.cursor = Math.max(0, _this.cursor - 1);
                                            break;
                                        }
                                        case "arrowDown": {
                                            _this.cursor = Math.min(_this.items.length - 1, _this.cursor + 1);
                                            break;
                                        }
                                        case "enter": {
                                            process.stdin.setRawMode(false);
                                            process.stdin.pause();
                                            process.stdin.removeListener("data", handleData);
                                            resolve(_this.items[_this.cursor].value);
                                            break;
                                        }
                                        case "exit": {
                                            process.exit(1);
                                        }
                                    }
                                    _this.render();
                                }
                            };
                            return process.stdin.on("data", handleData);
                        })];
                });
            });
        };
        MenuPrompt.prototype.render = function (clear) {
            if (clear === void 0) { clear = true; }
            if (clear) {
                process.stdout.moveCursor(0, this.items.length * -1);
                process.stdout.clearScreenDown();
            }
            for (var i = 0; i < this.items.length; i++) {
                var selected = (this.cursor === i);
                cli.log((selected ? $.CYAN : $.WHITE) + " ➔", this.items[i].text, $.DIM + $.WHITE + (selected ? "(selected)" : ""));
            }
        };
        return MenuPrompt;
    }());
    function promptMenu(items) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new MenuPrompt(items).prompt()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
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
        promptMenu: promptMenu,
        promptInput: promptInput
    };
}());
;module.exports={$,cli};