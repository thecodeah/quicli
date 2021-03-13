# Rules
 1. When adding new functions, keep them in the `cli` namespace.
 2. When modifying non-development code (`./src/*`) you can only import libraries that are provided by NodeJS by default. (Such as `fs`, `path`).
 3. Either disable your formatter or make sure it's configured in a way that it won't modify all the lines in the file that you're working on. Any pull requests full of removed/added whitespace and restructured syntax will be declined.

# Versioning
This project follows the Semantic Versioning Specification (Semver). A quick overview of Semver is:
 - Syntax: `MAJOR.MINOR.PATCH` (With the possibility of tags Ex. `-alpha`)
 - Major version MUST be incremented if any backwards incompatible changes are introduced to the public API.
 - Minor version MUST be incremented if new, backwards compatible functionality is introduced to the public API.
 - Patch version MUST be incremented if only backwards compatible bug fixes are introduced.
 - When incrementing the major, the minor and patch are reset to 0.
 - When incrementing the minor, the patch is reset to 0.
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
