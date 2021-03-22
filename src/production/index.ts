include: "./style";

global: const cli = (function () {
    include: "./log";
    include: "./commands";
    include: "./logic";
    include: "./input";

    let executed = false;
    process.addListener("beforeExit", (code) => {
        if(executed === false) {
            executed = true;
            callCommand(parseArgs());
        }
    });

    return {
        log: log,
        addCommand: addCommand,
        promptMenu: promptMenu,
        promptInput: promptInput
    };
}());
