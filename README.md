![quicli-readme-header](https://user-images.githubusercontent.com/21268739/111079766-b566c100-84fb-11eb-9e49-2f5192741a06.png)
---
**DISCLAIMER: THIS PROJECT IS IN IT'S ALPHA/EXPLORATORY PHASE. UPDATES MAY INCLUDE DRASTIC API CHANGES.**
### Why QuiCLI?

What makes QuiCLI different from all the other CLI frameworks is that it was designed to be used without a package manager or external files. The built code has no dependencies and is entirely minified into a single line. Paste it on top of a new `.js` file and you're ready to go! No `package.json`, no `node_modules`, your colleagues don't have to install any global packages making it a great cross-platform alternative to shell/batch scripts.

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
    cli.log(`You are ${flags.name[0]} and you are ${flags.age[0]} years old!`);
})
.addFlag("name", "string", true) // name, type, required
.addFlag("age", "number", true)
```
`terminal`
```shell
> node myapp iam --name John --age 26
You are John and you are 26 years old!
```
### Example Nº2
`myapp.js`
```js
const dishes = [
    { name: "Hamburger", price: 6.00 },
    { name: "Soup", price: 4.50 },
    { name: "Noodles", price: 3.00 }
]

cli.addCommand("order", async (flags) => {
    cli.log("Pick a dish:")
    const dishIndex = await cli.promptMenu(dishes.map((dish) => `${dish.name} - $${dish.price}`));

    const confirmationResponse = await cli.promptInput("Are you sure? (yes/no)");
    if(confirmationResponse.toLowerCase() === "yes") {
        cli.log(
            $.BOLD + "Great!",
            $.GREEN + "$" + (dishes[dishIndex].price),
            $.CLEAR + "has been withdrawn from your card and your food is being prepared...",
        );
    } else {
        cli.log($.RED + "Order cancelled.");
    }
})
.addFlag("address", "string", true);
```
`terminal`
```shell
> node myapp order --address "1600 Pennsylvania Ave, Washington, DC"
Pick a dish:
 🡪 Hamburger - $6 
 🡪 Soup - $4.5 (selected)
 🡪 Noodles - $3 
Great! $4.5 has been withdrawn from your card and your food is being prepared...
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
