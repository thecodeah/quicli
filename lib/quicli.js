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
                    if (arg.match(/[0-9]+/)) {
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
    var executed = false;
    process.addListener("beforeExit", function (code) {
        if (executed === false) {
            executed = true;
            callCommand(parseArgs());
        }
    });
    return {
        log: log,
        addCommand: addCommand
    };
}());
;module.exports={$,cli};