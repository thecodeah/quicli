import fs from "fs";
import path from "path";
import ts from "typescript";
import minify from "minify";
import { getVersion } from "./utils";

const config = {
    srcDir: "./src/production",
    outFile: {
        // The copy & paste version.
        minified: "./lib/quicli.min.js",
        // The version with exports.
        package: "./lib/quicli.exports.js"
    }
};

// The time at which the build has started, used to calculate the total build time.
const startingTime = Date.now();
// The buffer will contain all the parsed lines of code.
var buffer = "";
// Globals is a store of variable names from variable declarations that were prefixed with the global label.
// Used to generate the module.exports value.
var globals = [];

// Builds the project.
export const build = async () => {
    const version = getVersion();

    // We start with index.ts, this is the entry point. From there on out it'll also parse any
    // included files.
    parseFile("index.ts");

    // Transpile the buffer (Which contains Typescript code) to Javascript code.
    const transpileOutput = ts.transpileModule(buffer, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2017
        }
    });
    // Because the minify function expects a file path, we have to write our transpiled code to a file.
    fs.writeFileSync(config.outFile.minified, transpileOutput.outputText);
    
    // Minify the transpiled code.
    const minifiedCode = await minify(config.outFile.minified);
    
    const header = `/* Using QuiCLI v${version} ${" ".repeat(256)} */`;
    fs.writeFileSync(config.outFile.minified, header + minifiedCode);
    fs.writeFileSync(config.outFile.package, minifiedCode + `;module.exports={${globals.join(",")}};`);

    completeBuild();
}

// parseFile loops over the lines of the specified file and looks for require() functions.
// When it finds a require() function it doesn't append the line to the buffer, but instead starts
// parsing the file that's specified in the require() functions arguments, then when that's done it
// continues parsing the rest of the lines.
function parseFile(fileName: string) {
    const filePath = path.join(config.srcDir, fileName);
    if (fs.existsSync(filePath)) {
        try {
            var fileContent = fs.readFileSync(path.join(config.srcDir, fileName), { encoding: "utf-8" });
        } catch (error) {
            console.log(`Could not read included file: ${filePath}`);
            console.log(error);
            process.exit(1);
        }

        const lines = fileContent.split(/\r?\n/);

        lines.forEach((line) => {
            const trimmedLine = line.trimStart().toLowerCase();

            if (trimmedLine.startsWith("include:")) {
                let includeFile = trimmedLine
                    .slice("include:".length) // Get rid of the prefix.
                    .trimStart() // Remove any whitespace.
                    .replace(/["';]/g, ""); // Get rid of the apostrophes and trailing semicolon.

                if (includeFile.endsWith(".ts") === false) {
                    includeFile += ".ts";
                }

                // Parse the included file so that all of it's lines get added to the buffer.
                parseFile(includeFile);
            } else if (trimmedLine.startsWith("global:")) {
                // Store the variable name in order to add it to module.exports later on.
                // This regex grabs the variable/function name after the "var", "const" or "function" keyword.
                const variableNames = line.match(/(?<=var|const|function)\s+[\w$_]+/g);
                if (variableNames !== null) {
                    globals.push(variableNames[0].replace(/ /, ""));
                }

                // Add it to the buffer without the label.
                buffer += line.replace("global:", "") + "\n";
            } else {
                // Add it to the buffer normally.
                buffer += line + "\n";
            }
        });
    } else {
        console.log(`Included file ${fileName} does not exist...`);
        process.exit(1);
    }

}

const completeBuild = () => {
    const buildTime = (Date.now() - startingTime) / 1000;
    console.log("Build completed in " + buildTime + " seconds...");
}

// This code will only be executed if this script is being directly called (Eg. `node build`).
if (require.main === module) {
    build();
}
  