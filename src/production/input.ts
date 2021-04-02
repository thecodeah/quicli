const readline = require('readline');

/**
 * Prompts the user for input. (stdin, stdout)
 * @memberof cli
 * @param message The message that comes before the user input.
 * @returns A promise containing the answer as a string.
 */
async function question(message: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(((message === "") ? "" : message + " "), (answer: string) => {
            rl.close();
            resolve(answer);
        });
    });
}
