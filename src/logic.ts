interface Arguments {
    commands: Array<string>;
    flags: Array<ProvidedFlag>;
}

const parseArgs = (): Arguments => {
    const args = process.argv.slice(2);

    let providedCommands: Arguments["commands"] = [];
    let providedFlags: Arguments["flags"] = [];

    args.forEach((arg) => {
        if (arg.startsWith("-")) {
            if (arg.startsWith("--")) {
                // It's a multi-character flag.
                providedFlags.push({
                    name: arg.slice(2),
                    values: []
                });
            } else {
                // It's a single-character flag.
                arg.slice(1).split("").forEach((singleCharFlag) => {
                    providedFlags.push({
                        name: singleCharFlag,
                        values: []
                    });
                });
            }
        } else {
            if (providedFlags.length > 0) {
                // It's a flag value
                let parsedValue: any;
                if (arg.match(/[0-9]+/)) {
                    // It's a number
                    parsedValue = Number(arg);
                } else if(arg === "true" || arg === "false") {
                    // It's a boolean
                    parsedValue = Boolean(arg);
                } else {
                    // It's a string
                    parsedValue = arg;
                }

                providedFlags[providedFlags.length - 1].values.push(parsedValue);
            } else {
                // It's a command
                providedCommands.push(arg);
            }
        }
    });

    return {
        commands: providedCommands,
        flags: providedFlags
    }
}

const callCommand = (args: Arguments) => {
    const commandPath = args.commands.join(".");
    if (commandPath !== "") {
        const matchingCommand = commandPool.find((cmd) => cmd.path === commandPath);
        if (matchingCommand !== undefined) {
            // Flag handling
            let flags: Props = {};
            args.flags.forEach((flag) => {
                const matchingFlag = matchingCommand.getFlags().find((f) => f.name === flag.name || f.name === "*");
                if(matchingFlag !== undefined) {
                    // Type checking
                    let valid = true;
                    if(matchingFlag.type !== undefined) {
                        if(flag.values.length === 0) {
                            valid = false;
                            cli.log($.RED, "Expected value: ", $.CLEAR, flag.name, " expects a ", matchingFlag.type, "!");
                        } else {
                            flag.values.forEach((value) => {
                                if(typeof value !== matchingFlag.type) {
                                    valid = false;
                                    cli.log($.RED, "Incorrect type: ", $.CLEAR, flag.name, " must be a ", matchingFlag.type, "!");
                                }
                            })   
                        }
                    }
                    if(valid) {
                        if(flags[flag.name] !== undefined) {
                            flags[flag.name].push(...flag.values);
                        } else {
                            flags[flag.name] = flag.values;
                        }
                    }
                } else {
                    cli.log($.RED, "Unexpected flag: ", $.CLEAR, flag.name);
                }
            })

            matchingCommand.callback(flags);
        } else {
            cli.log($.RED + "Unknown command: " + $.CLEAR + args.commands.join(" -> "));
        }
    }
}
