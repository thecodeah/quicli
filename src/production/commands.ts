// FlagTypes is a union of flag value types.
type FlagTypes = string | boolean | number;
type FlagTypeNames = "string" | "boolean" | "number";

// CommandFlags contain details about a flag that belongs to a command.
interface CommandFlag {
    name: string;
    type?: FlagTypeNames;
}

// ProvidedFlag is a flag provided by the user.
interface ProvidedFlag {
    name: string;
    values: Array<FlagTypes>;
}

// Props are passed to a commands callback function as a parameter.
type Props = { [key: string]: ProvidedFlag["values"] };

class Command {
    readonly path: string;
    readonly callback: (flags: Props) => void;
    private flags: Array<CommandFlag> = [];

    constructor(path: Command["path"], callback: Command["callback"]) {
        this.path = path;
        this.callback = callback;
    }

    getFlags() {
        return this.flags;
    }

    public addFlag(name: string, type?: FlagTypeNames): this {
        this.flags.push({
            name: name,
            type: type
        })
        return this;
    }
}

var commandPool: Array<Command> = [];

const addCommand = (path: Command["path"], callback: Command["callback"]): Command => {
    const command = new Command(path, callback);
    commandPool.push(command);
    return command;
};
