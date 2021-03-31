/**
 * An alternative to console.log() with color styling capabilities.
 * @memberof cli
 * @param args An array of strings to be written to stdout.
 */
const log = (...args: string[]) => {
    process.stdout.write(args.join(" ") + $.CLEAR + "\n");
};
