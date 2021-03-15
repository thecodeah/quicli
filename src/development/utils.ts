import { execSync } from 'child_process';
import fs from "fs";

export type SemverType = "major" | "minor" | "patch";

export function getVersion(): string {
    if(fs.existsSync("./package.json")) {
        const packageJson = JSON.parse(fs.readFileSync("./package.json", { encoding: "utf-8" }));
        return packageJson.version;
    } else {
        throw "Missing package.json file!";
    }
}

// Bumps the version in package.json and package-lock.json and returns the new version.
export function bumpVersion(type: SemverType): string {
    // By default, running `npm version` will create a new commit and a git tag.
    // by adding the --no-git-tag-version tag, we can prevent that from happening.
    execSync(`npm version ${type} --no-git-tag-version`);
    return getVersion();
}