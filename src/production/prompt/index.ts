type KeyNames = 
    | "exit" 
    | "enter"
    | "delete"
    | "arrowUp"
    | "arrowDown";

const keyCodes: { [k in KeyNames]: Buffer }= {
    exit: Buffer.from([0x03]),
    enter: Buffer.from([ 0x0d ]),
    delete: Buffer.from([ 0x7F ]),
    // The following key codes are escape sequences.
    arrowUp: Buffer.from([ 0x1b, "[".charCodeAt(0), "A".charCodeAt(0)]),
    arrowDown: Buffer.from([ 0x1b, "[".charCodeAt(0), "B".charCodeAt(0)]),
}

include: "./prompt/input"
include: "./prompt/menu"
