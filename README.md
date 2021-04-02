![Logo](https://user-images.githubusercontent.com/21268739/112211973-bb0b8780-8c1c-11eb-8b5b-7d3db878cff2.png)

## Why QuiCLI?
QuiCLI is a lightweight CLI framework that was intentionally designed to be used without a package manager or any external files. The built code has no dependencies and is entirely minified into a single line. Paste it on top of a new `.js` file and you're ready to go! No `package.json`, no `node_modules` and your colleagues don't have to install any global packages making it a great cross-platform alternative to shell scripts in development environments.

When creating CLI's with QuiCLI, the goal of the program should be to assist development. It's not meant to be used to create CLI's that will eventually be provided to end-users. There are better, and more feature-rich CLI frameworks that help you achieve that goal.

## Getting started

1. Simply copy and paste the contents of the `lib/quicli.min.js` file in this repository to a new `.js` file.
2. On a new line below the pasted contents, add some commands (Check the examples below).
3. Run your CLI with `node myapp mycommand`.

## Features
### Nested commands
```js
cli.addCommand("foo.bar", (flags) => {
    cli.log("Hello world!");
})
```
```
> node myapp foo bar
Hello world!
```
### Typed flags
```js
cli.addCommand("foo", (flags) => {
    cli.log("Hello world!");
})
.addFlag("foo", "number", true) // Name, Type, Required
```
```
> node myapp foo
Missing flag: foo
> node myapp foo --foo hello
Incorrect type: foo must be a number!
> node myapp foo --foo 24
Hello world!
```
### Input handling
```js
cli.addCommand("foo", async (flags) => {
    const answer = await cli.promptInput("What's up?");
    cli.log("Your answer: " + answer);
})
```
```
node myapp foo
What's up? Nothing much...
Your answer: Nothing much...
```
### Styled output
```js
cli.addCommand("ping", (flags) => {
    cli.log(
        $.BOLD +
        $.RED + "P" +
        $.YELLOW + "O" +
        $.GREEN + "N" +
        $.BLUE + "G" +
        $.MAGENTA + "!"
    );
})
```

## Documentation

Documentation can be found on [the projects website](http://quicli.js.org).
