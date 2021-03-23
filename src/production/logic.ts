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
                if (arg.match(/^[0-9]+$/)) {
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
    const matchingCommand = commandPool.find((cmd) => cmd.path === commandPath);
    if (matchingCommand !== undefined) {
        // Flag handling
        let props: Props = {};
        args.flags.forEach((pFlag) => { // pFlag as in providedFlag
            const matchingCmdFlag = matchingCommand.getFlags().find((cf) => cf.name === pFlag.name || cf.name === "*");
            if(matchingCmdFlag !== undefined) {
                // Type checking
                let valid = true;
                if(matchingCmdFlag.type !== "any") {
                    if(pFlag.values.length === 0) {
                        valid = false;
                        cli.log($.RED + "Expected value:", $.CLEAR + pFlag.name, "expects a", matchingCmdFlag.type + "!");
                    } else {
                        pFlag.values.forEach((value) => {
                            if(typeof value !== matchingCmdFlag.type) {
                                valid = false;
                                cli.log($.RED + "Incorrect type:", $.CLEAR + pFlag.name, "must be a", matchingCmdFlag.type + "!");
                            }
                        })   
                    }
                }
                if(valid) {
                    if(props[pFlag.name] !== undefined) {
                        props[pFlag.name].push(...pFlag.values);
                    } else {
                        props[pFlag.name] = pFlag.values;
                    }
                }
            } else {
                cli.log($.RED + "Unexpected flag:", $.CLEAR + pFlag.name);
            }
        })

        // Check if all the required command flags were provided.
        let hasMissingFlags = false;
        matchingCommand.getFlags().forEach((cFlag) => { // cFlag as in commandFlag
            if(cFlag.required) {
                if(cFlag.name === "*") {
                    if(Object.keys(props).length === 0) {
                        cli.log($.RED + "At least one flag is required!");
                    }
                } else {
                    const matchingProp = Object.keys(props).find((p) => p === cFlag.name);
                    if(matchingProp === undefined) {
                        hasMissingFlags = true;
                        cli.log($.RED + "Missing required flag:", $.CLEAR + cFlag.name);
                    }
                }
            }
        })

        if(!hasMissingFlags) {
            matchingCommand.callback(props);
        }
    } else {
        if(commandPath !== "") {
            cli.log($.RED + "Unknown command:", $.CLEAR + args.commands.join(" -> "));
        }
    }
}
