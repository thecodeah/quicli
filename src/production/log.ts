const log = (...args: string[]) => {
    process.stdout.write(args.join(" ") + $.CLEAR + "\n");
};
