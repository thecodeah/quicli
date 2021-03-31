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

/**
 * Prompts for input to stdout and stdin.
 * @memberof cli
 * @param message The message that comes before the input.
 * @param censored Whether the input should be censored or not. Useful for passwords.
 * @returns A promise with the input string.
 */
function promptInput(message: string, censored: boolean = false) {
    return new InputPrompt(message, censored).prompt();
}
