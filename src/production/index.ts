include: "./style";

global: const cli = (function () {
    include: "./log";
    include: "./commands";
    include: "./logic";

    process.addListener("beforeExit", () => {
        callCommand(parseArgs());
    });

    return {
        log: log,
        addCommand: addCommand
    };
}());
