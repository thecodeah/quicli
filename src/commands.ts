interface Command {
    name: string;
    arguments: Array<string>;
    callback: (...args: any[]) => void;
}

var registeredCommands: Array<Command> = [];

const addCommand = (name: Command["name"], callback: Command["callback"]) => {
    // Get the arguments of the provided callback function.
    let callbackArguments: Array<string> = [];
    const argumentSections = callback.toString().match(/\((.*)\)/g);
    if (argumentSections !== null) {
        callbackArguments = argumentSections[0].slice(1, -1).replace(/ /g, '').split(",");
    }

    // Add the command to the registered command pool.
    registeredCommands.push({
        name: name,
        arguments: callbackArguments,
        callback: callback
    });
};
