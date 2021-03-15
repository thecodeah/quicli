import { execSync } from 'child_process';
import simpleGit, {SimpleGit} from 'simple-git';
import { bumpVersion, SemverType } from "./utils";
import { build } from "./build";

// Initialize a git client.
const git: SimpleGit = simpleGit();

// Arguments passed by user, first two are the NodeJS binary path and the script path.
const args = process.argv.slice(2);

// Sanity check on provided argument.
const semverTypes: SemverType[] = [ "major", "minor", "patch" ];
if (args.length > 0 && semverTypes.includes(args[0] as any)) {
    release(args[0] as SemverType);
} else {
    console.log("Pick one of the following: ", semverTypes.join(", "));
}

async function release (type: SemverType) {
    // Check for uncommited changes
    if((await git.status()).isClean()) {
        const newVersion = bumpVersion(type);
        
        // The project has to be rebuilt in order to update the version in the header of the minified build.
        console.log("Building project...");
        await build();

        // When using the -p flag, auto-changelog uses the version from package.json as the latest release,
        // so that all commits between the previous release and now become part of that version.
        console.log("Updating changelog...");
        execSync("npx auto-changelog -p --hide-credit");

        console.log("Committing changes...");
        await git.commit(newVersion + " release!", ["."]);

        console.log(`Creating ${newVersion} tag...`);
        await git.addTag(newVersion);

        console.log(`Version ${newVersion} is ready to be published!`);
    } else {
        console.log("Commit your changes first!");
    }
};
