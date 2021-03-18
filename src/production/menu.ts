const keyCodes = {
    Exit: Buffer.from([0x03]),
    Enter: Buffer.from([ 0x0d ]),
    // ArrowUp and ArrowDown are escape sequences.
    ArrowUp: Buffer.from([ 0x1b, "[".charCodeAt(0), "A".charCodeAt(0)]),
    ArrowDown: Buffer.from([ 0x1b, "[".charCodeAt(0), "B".charCodeAt(0)]),
}

interface MenuItem {
    text: string;
    value: any;
}

type MenuParams = MenuItem[] | string[];

class Menu {
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

        return new Promise(resolve => process.stdin.on("data", (data) => {
            const keyName = Object.keys(keyCodes).find((name) => data.compare(keyCodes[name]) === 0);
            if(keyName !== undefined) {
                switch(keyName) {
                    case "ArrowUp": {
                        this.cursor = Math.max(0, this.cursor - 1);
                        break;
                    }
                    case "ArrowDown": {
                        this.cursor = Math.min(this.items.length - 1, this.cursor + 1);
                        break;
                    }
                    case "Enter": {
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        process.stdin.removeAllListeners("data"); // TODO Remove this listener specifically
                        resolve(this.items[this.cursor].value);
                        break;
                    }
                    case "Exit": {
                        process.exit(1);
                    }
                }

                this.render();
            }
        }))
    }

    private render(clear: boolean = true) {
        if(clear) {
            process.stdout.moveCursor(0, this.items.length * -1);
            process.stdout.clearScreenDown();
        }

        for(let i = 0; i < this.items.length; i++) {
            const selected = (this.cursor === i);
            cli.log((selected ? $.CYAN : $.WHITE) + " 🡪", this.items[i].text, $.DIM + $.WHITE + (selected ? "(selected)" : ""));
        }
    }
}

async function promptMenu(items: MenuParams) {
    return await new Menu(items).prompt();
}
