include: "./style";

global: const cli = (function () {
    include: "./log";
    include: "./commands";
    include: "./logic";

    process.addListener("beforeExit", ready);

    return {
        log: log,
        addCommand: addCommand
    };
}());
