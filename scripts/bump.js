const { execSync } = require('child_process');
const simpleGit = require("simple-git");
const git = simpleGit();

const validArgs = ["major", "minor", "patch"];
const args = process.argv.slice(2);

if (args.length > 0) {
    if (validArgs.includes(args[0])) {
        bump(args[0]);
    }
} else {
    console.log("Pick one of the following: ", validArgs.join(", "));
}

function bump(version) {
    git.status().then((status) => {
        if (status.files.length === 0) {
            execSync(`npm version ${version}`); // Bumps the version in package.json
            execSync(`npx changelog`); // Generate the changelog
            execSync("npm run build"); // Rebuild the project to update the version in the header of quicli.min.js

            git.add(["CHANGELOG.md"]).commit("Updated CHANGELOG.md");

            // You might not want to commit/push/publish straight away, so provide the commands to do it.
            console.log("You might want to run these commands:");
            console.log(" > git push origin master && git push --tags");
            console.log(" > npm publish");
        } else {
            console.log("Commit your changes first!");
        }
    });
};
