type KeyNames = 
    | "exit" 
    | "enter"
    | "delete"
    | "arrowUp"
    | "arrowDown";

const keyCodes: { [k in KeyNames]: Buffer }= {
    exit: Buffer.from([0x03]),
    enter: Buffer.from([ 0x0d ]),
    delete: Buffer.from([ 0x7F ]),
    // The following key codes are escape sequences.
    arrowUp: Buffer.from([ 0x1b, "[".charCodeAt(0), "A".charCodeAt(0)]),
    arrowDown: Buffer.from([ 0x1b, "[".charCodeAt(0), "B".charCodeAt(0)]),
}

interface MenuItem {
    text: string;
    value: any;
}

type MenuParams = MenuItem[] | string[];

class MenuPrompt {
    items: MenuItem[] = [];
    cursor: number = 0;

    constructor(items: MenuParams) {
        if(Array.isArray(items)) {
            if(items.length > 0) {
                if(typeof items[0] === "string") {
                    // If an array of strings were provided, convert it to an array of MenuItem's
                    this.items = (items as string[]).map((str, index) => <MenuItem>{ text: str, value: index });
                } else {
                    const validItems = (items as []).filter((item) => "text" in item && "value" in item)
                    if(validItems.length > 0) {
                        this.items = validItems as MenuItem[];
                    } else {
                        throw new Error("Menu items must either be an array of strings or an array of { text: string, value: any }");
                    }
                }
            }
        } else {
            throw new Error("Menu constructor expects 'items' to be an array!");
        }
    }

    public async prompt(): Promise<MenuItem["value"]> {
        this.render(false);

        process.stdin.resume();
        // Process the input character-by-character.
        process.stdin.setRawMode(true);

        return new Promise((resolve) => {
            const handleData = (data: Buffer) => {
                const keyName = <KeyNames>Object.keys(keyCodes).find((name) => data.compare(keyCodes[name]) === 0);
                if(keyName !== undefined) {
                    switch(keyName) {
                        case "arrowUp": {
                            this.cursor = Math.max(0, this.cursor - 1);
                            break;
                        }
                        case "arrowDown": {
                            this.cursor = Math.min(this.items.length - 1, this.cursor + 1);
                            break;
                        }
                        case "enter": {
                            process.stdin.setRawMode(false);
                            process.stdin.pause();
                            process.stdin.removeListener("data", handleData);
                            resolve(this.items[this.cursor].value);
                            break;
                        }
                        case "exit": {
                            process.exit(1);
                        }
                    }
    
                    this.render();
                }
            }
            return process.stdin.on("data", handleData);
        })
    }

    private render(clear: boolean = true) {
        if(clear) {
            process.stdout.moveCursor(0, this.items.length * -1);
            process.stdout.clearScreenDown();
        }

        for(let i = 0; i < this.items.length; i++) {
            const selected = (this.cursor === i);
            cli.log((selected ? $.CYAN : $.WHITE) + " ➔", this.items[i].text, $.DIM + $.WHITE + (selected ? "(selected)" : ""));
        }
    }
}

async function promptMenu(items: MenuParams) {
    return await new MenuPrompt(items).prompt();
}

class InputPrompt {
    message: string;
    censored: boolean;

    input: string = "";

    constructor(message: string, censored: boolean = false) {
        this.message = message;
        this.censored = censored;
    }

    public async prompt() {
        this.render();

        process.stdin.resume();
        process.stdin.setRawMode(true);

        return new Promise((resolve) => {
            const handleData = (data: Buffer) => {
                const keyName = <KeyNames>Object.keys(keyCodes).find((name) => data.compare(keyCodes[name]) === 0);
                if(keyName !== undefined) {
                    switch(keyName) {
                        case "enter": {
                            process.stdin.pause();
                            process.stdin.setRawMode(false);

                            process.stdin.removeListener("data", handleData);

                            // Clear text decorations in case any of them were set in the provided message.
                            process.stdout.write($.CLEAR + "\n");

                            resolve(this.input);
                            return;
                        }
                        case "delete": {
                            this.input = this.input.slice(0, -1);
                            break;
                        }
                        case "exit": {
                            process.stdout.write($.CLEAR + "\n");
                            process.exit(1);
                        }
                    }
                } else {
                    // This conditional might not make any sense at first sight. If we parse the input character by
                    // character then the length will always be one! Right? Well, in case of a special instruction
                    // the length is longer, for example: the instruction to move the cursor to the left by one is
                    // '\x1B[D'. That's three characters.
                    if(data.toString().length === 1) {
                        this.input += data.toString();
                    }
                }

                this.render();
            }
            return process.stdin.on("data", handleData);
        })
    }

    render() {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        process.stdout.write($.CLEAR + this.message + " ");
        if(this.censored) {
            process.stdout.write(this.input.replace(/./g, "*"));
        } else {
            process.stdout.write(this.input);
        }
    }
}

function promptInput(message: string, censored: boolean = false) {
    return new InputPrompt(message, censored).prompt();
}
