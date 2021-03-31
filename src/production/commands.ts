// FlagTypes is a union of flag value types.
type FlagTypes = string | boolean | number;
type FlagTypeNames = "any" | "string" | "boolean" | "number";

// CommandFlags contain details about a flag that belongs to a command.
interface CommandFlag {
    name: string;
    type: FlagTypeNames;
    required: boolean;
}

// ProvidedFlag is a flag provided by the user.
interface ProvidedFlag {
    name: string;
    values: Array<FlagTypes>;
}

// Props are passed to a commands callback function as a parameter.
type Props = { [key: string]: ProvidedFlag["values"] };

/**
 * Represents a commands data and provides functions to manipulate said data.
 * @public
 */
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

    /**
     * Registers a flag to a command.
     * @param name The name of the flag.
     * @param type The type of value this flag will accept. Any by default.
     * @param required Is this flag required or optional?
     * @returns A command object for chaining.
     */
    public addFlag(name: string, type: FlagTypeNames = "any", required: boolean = false): this {
        this.flags.push({
            name: name,
            type: type,
            required: required
        })
        return this;
    }
}

var commandPool: Array<Command> = [];

/**
 * The addCommand function registers a new command to the command pool.
 * @memberof cli
 * @param path The command name. For nested commands, separate each name with a dot.
 * @param callback The function that will be called when the command is used.
 * @returns A Command object to set additional information, eg. flags.
 */
const addCommand = (path: Command["path"], callback: Command["callback"]): Command => {
    const command = new Command(path, callback);
    commandPool.push(command);
    return command;
};
