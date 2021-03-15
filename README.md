![quicli-readme-header](https://user-images.githubusercontent.com/21268739/111079766-b566c100-84fb-11eb-9e49-2f5192741a06.png)
---
**DISCLAIMER: THIS PROJECT IS IN IT'S ALPHA/EXPLORATORY PHASE. UPDATES MAY INCLUDE DRASTIC API CHANGES.**
### Why QuiCLI?

 * **Quick:** Get a working CLI ready within seconds!
 * **Simple:** An incredibly easy-to-use API.
 * **Dependency-less:** Only requires NodeJS and nothing else.

## Getting started

### Without a package manager:
1. Simply copy and paste the contents of the `lib/quicli.min.js` file in this repository to a `.js` file.
2. On a new line below the pasted contents, add some commands (Check the examples below).
3. Run your CLI with `node myapp mycommand`.

### With a package manager:
1. Run `npm install --save quicli-js`
2. Import QuiCLI:
```js
import { cli, $ } from "quicli-js";
// or
const { cli, $ } = require("quicli-js");
```
3. Add some commands (Check the examples below)
4. Run your CLI with `node myapp mycommand`

## Documentation

Proper documentation coming soon...

## Examples

### Example Nº1
`myapp.js`
```js
cli.addCommand("iam", (flags) => {
    if(flags.name && flags.age) {
        cli.log(`You are ${flags.name[0]} and you are ${flags.age[0]} years old!`);
    } else {
        cli.log($.RED, "Missing flags: ", $.CLEAR, "name, age");
    }
})
.addFlag("name", "string")
.addFlag("age", "number")
```
`terminal`
```shell
> node myapp iam --name John --age 26
You are John and you are 26 years old!
```
### Example Nº2
`myapp.js`
```js
cli.addCommand("mkdir", (flags) => {
    if(flags.name) {
        flags.name.forEach((name) => {
            cli.log(`Creating ${name} directory`);
            fs.mkdirSync(name);
        })
    } else {
        cli.log($.RED, "No names were specified!");
    }
})
.addFlag("name", "string")
```
`terminal`
```shell
> node myapp mkdir --name foo --name bar --name 23
Incorrect type: name must be a string!
Creating bar directory
Creating foo directory
```
### Example Nº3
`myapp.js`
```js
const fs = require("fs");
const optionsFile = "./options.json";

cli.addCommand("options.set", (flags) => {
    let options = {};
    if (fs.existsSync(optionsFile)) {
        options = JSON.parse(fs.readFileSync(optionsFile));
    }

    for(let flagName in flags) {
        if (flags[flagName].length > 0) {
            options[flagName] = flags[flagName][0];
        }
    }

    fs.writeFileSync(optionsFile, JSON.stringify(options, null, 4));
})
.addFlag("*") // Accept any flags of any type
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
