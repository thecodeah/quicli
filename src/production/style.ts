global: const $ = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",

    BG_BLACK: "\x1b[40m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m",
    BG_YELLOW: "\x1b[43m",
    BG_BLUE: "\x1b[44m",
    BG_MAGENTA: "\x1b[45m",
    BG_CYAN: "\x1b[46m",
    BG_WHITE: "\x1b[47m",

    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    UNDERSCORE: "\x1b[4m",
    BLINK: "\x1b[5m",
    INVERT: "\x1b[7m",
    HIDDEN: "\x1b[8m",

    // CLEAR has to come last. Whenever a run-time error occurs, it'll print all the
    // code of the line where the error occurred. In case of QuiCLI, all of the code
    // is minified into one line. Because of that, these text decoration values will
    // also be printed. We want to make sure that the last instruction it prints is
    // CLEAR in order to keep the error message and stack unaffected.
    CLEAR: "\x1b[0m"
};
