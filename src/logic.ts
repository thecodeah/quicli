interface ProvidedFlag {
    name: string;
    values: Array<string | number>;
}

const ready = () => {
    const args = process.argv.slice(2);

    // Collecting the commands and flags that were provided by the user.
    let commandsProvided: Array<string> = [];
    let flagsProvided: Array<ProvidedFlag> = [];
    args.forEach((arg) => {
        if (arg.startsWith("-")) {
            if (arg.startsWith("--")) {
                // It's a multi-character flag.
                flagsProvided.push({
                    name: arg.slice(2),
                    values: []
                });
            } else {
                // It's a single-character flag.
                arg.slice(1).split("").forEach((singleCharFlag) => {
                    flagsProvided.push({
                        name: singleCharFlag,
                        values: []
                    });
                });
            }
        } else {
            if (flagsProvided.length > 0) {
                // It's a flag value
                let parsedValue: any;
                if (arg.match(/[0-9]+/)) {
                    // It's a number
                    parsedValue = Number(arg);
                } else {
                    // It's a string
                    parsedValue = arg;
                }

                flagsProvided[flagsProvided.length - 1].values.push(parsedValue);
            } else {
                // It's a command
                commandsProvided.push(arg);
            }
        }
    });

    // Command handling
    const providedCommandName = commandsProvided.join(".");
    if (providedCommandName !== "") {
        const matchingCommand = registeredCommands.find((cmd) => cmd.name === providedCommandName);
        if (matchingCommand !== undefined) {
            // Flag handling
            if (matchingCommand.arguments[0].startsWith("...")) {
                matchingCommand.callback(...flagsProvided);
            } else {
                const callbackArgs = matchingCommand.arguments.map((commandArgument) => {
                    const matchingFlag = flagsProvided.find((f) => f.name === commandArgument);
                    if (matchingFlag !== undefined) {
                        return matchingFlag.values;
                    } else {
                        return undefined;
                    }
                });

                flagsProvided.forEach((f) => {
                    if (!matchingCommand.arguments.includes(f.name)) {
                        cli.log($.RED, "Unexpected flag: ", $.CLEAR, f.name);
                    }
                });

                matchingCommand.callback(...callbackArgs);
            }
        } else {
            cli.log($.RED + "Unknown command: " + $.CLEAR + commandsProvided.join(" -> "));
        }
    }
};
