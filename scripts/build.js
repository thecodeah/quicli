const fs = require("fs");
const ts = require("typescript");
const path = require("path");
const minify = require('minify');

const startingTime = Date.now();
const config = {
    srcDir: "src",
    outFile: "out/quicli.min.js"
};

var packageJson = {};
var buffer = "";
var globals = [];

// Loading data from npm's package.json file and setting it to the global packageJson variable.
if (fs.existsSync("./package.json")) {
    packageJson = require("../package.json");

    const requiredKeys = ["version", "main"];
    let missingFields = [];
    requiredKeys.forEach((key) => {
        if (key in packageJson === false) {
            missingFields.push(key);
        }
    });
    if (missingFields.length > 0) {
        console.log(`package.json file is missing the following fields: ` + missingFields.join(", "));
        process.exit(1);
    }
} else {
    console.log(`Missing package.json file...`);
    process.exit(1);
}

// parseFile loops over the lines of the specified file and looks for require() functions.
// When it finds a require() function it doesn't append the line to the buffer, but instead starts
// parsing the file that's specified in the require() functions arguments, then when that's done it
// continues parsing the rest of the lines.
function parseFile(fileName) {
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

            if (trimmedLine.startsWith("global:")) {
                // Store the variable name in order to add it to module.exports later on.
                // This regex grabs anything after "var", "const" or "function".
                const variableNames = line.match(/(?<=var|const|function)\s+[\w$_]+/g);
                if (variableNames !== null) {
                    globals.push(variableNames[0].replace(/ /, ""));
                }
            }

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

// We start with index.ts, this is always the entry point.
parseFile("index.ts");

// Transpile the buffer (Which contains Typescript code) to Javascript code.
const transpileOutput = ts.transpileModule(buffer, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
// Because the minify function expects a file path, we have to write our transpiled code to a file.
fs.writeFileSync(config.outFile, transpileOutput.outputText);

// Minify the transpiled code.
minify(config.outFile).then((minifiedCode) => {
    // Add the header with whitespace to the beginning of the code.
    const header = `/* Using QuiCLI v${packageJson.version} ${" ".repeat(256)} */`;
    minifiedCode = header + minifiedCode;

    fs.writeFileSync(config.outFile, minifiedCode);
    fs.writeFileSync(packageJson.main, minifiedCode + `;module.exports={${globals.join(",")}};`);

    const buildTime = (Date.now() - startingTime) / 1000;
    console.log("Build completed in " + buildTime + " seconds...");
});
