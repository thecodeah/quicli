// This is a self-executing function that returns an object with text decoration codes.
// The reason it's self executing is because this file is included globally and we don't
// want the create() function to be globally available.
global: const $ = (function () {
    const create = (code: string) => {
        // If none of this makes sense to you, check:
        // https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
    
        let bufferData = [
            0x1b, // Escape
            0x5b // [
        ];
        for(let i = 0; i < code.length; i++) {
            bufferData.push(code.charCodeAt(i));
        }
        // Pushing "m" which indicates the end of a style code sequence.
        bufferData.push(0x6d);
    
        return Buffer.from(bufferData).toString();
    }

    return {
        BOLD: create("1"),
        DIM: create("2"),
        UNDERSCORE: create("4"),
        BLINK: create("5"),
        INVERT: create("7"),
        HIDDEN: create("8"),
        CLEAR: create("0"),
    
        BLACK: create("30"),
        RED: create("31"),
        GREEN: create("32"),
        YELLOW: create("33"),
        BLUE: create("34"),
        MAGENTA: create("35"),
        CYAN: create("36"),
        WHITE: create("37"),
    
        BG_BLACK: create("40"),
        BG_RED: create("41"),
        BG_GREEN: create("42"),
        BG_YELLOW: create("43"),
        BG_BLUE: create("44"),
        BG_MAGENTA: create("45"),
        BG_CYAN: create("46"),
        BG_WHITE: create("47")
    }
}());
