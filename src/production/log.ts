const log = (...args: string[]) => {
    args.forEach((arg) => {
        process.stdout.write(arg);
    });
    process.stdout.write($.CLEAR);
    process.stdout.write("\n");
};
