![quicli-readme-header](https://user-images.githubusercontent.com/21268739/110963507-6df10100-8352-11eb-8a66-b3370fc9ef07.png)
---
### Why QuiCLI?

 * **Quick:** Get a working CLI ready within seconds!
 * **Simple:** An incredibly easy-to-use API.
 * **Dependency-less:** Only requires NodeJS and nothing else.

## Getting started

### Without a package manager:
1. Simply copy and paste the contents of the `out/quicli.min.js` file in this repository to a `.js` file.
2. On a new line below the pasted contents, add some commands (Check the examples below).
3. Run your CLI with `node myapp mycommand`.

### With a package manager:
1. Run `npm install --save quicli`
2. Import QuiCLI:
```js
import { cli, $ } from "quicli";
// or
const { cli, $ } = require("quicli");
```
3. Add some commands (Check the examples below)
4. Run your CLI with `node myapp mycommand`

## Documentation

### cli.addCommand(name, callback)
* **Description:** Registers a new command.
* **Arguments:** name: string, callback: function
* **Return value:** void
* **Notes:**
   * The parameters in the callback function are also the flags that your command will be able to accept.
   * The provided arguments are either `undefined` (If the flag was not provided by the user) or an array containing strings and/or numbers.
   * In case of using a rest parameter, the provided arguments will be an array of `{ name: "flagName", values: [] }`. 
   * Flags are capable of accepting multiple values.
   * You can have nested commands by using the dot separator in the command name (Ex. `options.set`)

### cli.log(...args)
* **Description:** Alternative to `console.log()` with text styling capabilities.
* **Example:** `cli.log($.BOLD, $.GREEN, "It's a beautiful day!");`
* **Arguments:** ...args: string[]
* **Return value:** void

## Examples

### Simple example
`myapp.js`
```js
cli.addCommand("iam", (name, age) => {
    cli.log(`You are ${name[0]} and you are ${age[0]} years old!`);
});
```
`terminal`
```shell
> node myapp iam --name John --age 26
You are John and you are 26 years old!
```
### Advanced example
`myapp.js`
```js
const fs = require("fs");
const optionsFile = "./options.json";
const validOptions = ["option1", "option2", "option3"];

cli.addCommand("options.set", (...flags) => {
    let options = {};
    if (fs.existsSync(optionsFile)) {
        options = JSON.parse(fs.readFileSync(optionsFile));
    }

    flags.forEach((flag) => {
        if (validOptions.includes(flag.name)) {
            if (flag.values.length > 0) {
                options[flag.name] = flag.values[0];
            } else {
                cli.log($.RED, "Missing value at: ", $.CLEAR, flag.name);
            }
        } else {
            cli.log($.RED, "Invalid option: ", $.CLEAR, flag.name);
        }
    });

    fs.writeFileSync(optionsFile, JSON.stringify(options, null, 4));
});
```
`terminal`
```shell
> node myapp options set --option1 true
> node myapp options set --option2 512
```
`options.json`
```json
{
    "option1": "true",
    "option2": 512
}
```