# Definitions
 - Production - refers to any code in the `./src/*` directory, this code will eventually be compiled and provided to the end-user.
 - Development - refers to files that are not provided to the end-user (Eg. files that are used to assist the development process.)

# Rules
 1. Before committing modified production code, make sure you build the project!
 2. When adding new functions, keep them in the `cli` namespace.
 3. When modifying production code you can only import libraries that are provided by NodeJS by default (Such as `fs`, `path`).
 4. Either disable your formatter or make sure it's configured in a way that it won't modify all the lines in the file that you're working on. Any pull requests full of removed/added whitespace and restructured syntax will be declined.

# Commit Message Format
This project uses `generate-changelog` to generate a `CHANGELOG.md` file. Because of this, commit messages need to follow a specific format:
```
type: description
```
 - type:
   - `breaking` - A change that breaks backwards-compatability **(Production)**
   - `feat` - New feature **(Production)**
   - `fix` - Bug fix **(Production)**
   - `refactor` - Refactoring code, eg. renaming a variable **(Production)**
   - `docs` - Documentation changes - Both in-code and out-of-code (Like `README.md`) **(All files)**
   - `chore` - Changes related to: the build system (involving scripts, configurations or tools) and dev dependencies **(Development)**
   - `test` - Adding new tests, changes to tests **(Development)**
   - `other` - Anything else...

If a commit does not follow this format, then it won't get added to the change log.

# Versioning
This project follows the Semantic Versioning Specification (Semver). A quick overview of Semver is:
 - Syntax: `MAJOR.MINOR.PATCH` (With the possibility of tags Ex. `-alpha`)
 - Major version MUST be incremented if any backwards incompatible changes are introduced to the public API.
 - Minor version MUST be incremented if new, backwards compatible functionality is introduced to the public API.
 - Patch version MUST be incremented if only backwards compatible bug fixes are introduced.
 - When incrementing the major version: the minor and patch are reset to 0.
 - When incrementing the minor version: the patch is reset to 0.
 - Anything >= 1.0.0 is ready for production.

About Alpha and Beta:
 - Alpha means that the project is still in its exploratory phase. May include drastic API changes.
 - Beta means the project is close to being ready-to-use in production. Features are being polished and ensured to work as expected.
 - Beta's and Alpha's always stay below 1.0.0. Even when introducing backwards incompatible changes, you increment the minor version.

# Labels
When going through the source code, you'll stumble across some unique syntax. Because this project uses a custom build-tool, it can interpret these labels and manipulate the code before handing it over to the Typescript transpiler.

 * **Include**
   * **Syntax:** `include: "./file";`
   * **Description:** Similar to `#include` in the C language. Copies and pastes code from the specified file into the current line during the pre-transpilation phase.
 * **Global**
   * **Syntax:** `global: const foo = "bar";`
   * **Description:** Similar to ES6 `export`. The build tool generates two files, one meant for copying & pasting into your .js file, and one meant to be imported. We don't want any `module.exports` in the copy & paste version because this will cause incompatability when used in `.mjs` files, but we do in the other version. When using this label, the build tool will remember the variable name on that line and add it to a `module.export` at the end of the to-be-imported version.

# Building

**Requirements:**
 - Recent stable version of NodeJS
 - NPM

**Steps:**
1. Run `npm install`
2. Run `node build`
