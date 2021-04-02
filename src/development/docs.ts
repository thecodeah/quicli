import * as fs from "fs";
import path from "path";
import * as typedoc from "typedoc"
import { Reflection, ReflectionKind } from "typedoc";
import handlebars from "handlebars";

const config = {
    // Where Typedoc will look for documented code.
    productionCodeDir: "src/production",
    // The assets directory contains assets such as images, css,
    // scripts and most importantly the template.handlebars file.
    assetsDir: "docs/assets",
    // Where the generated html files will be written to.
    outputDir: "docs"
}

interface RenderProps {
    sections: RenderPropsSection[];
}

interface RenderPropsSection {
    name: string;
    slug: string;
    doclets: SimpleReflection[];
}

interface SimpleReflection {
    name: string;
    slug: string;
    kind: string;
    parent: string;
    comment?: string;
    returns?: string;
    parameters?: SimpleParameter[];
}

interface SimpleParameter {
    name: string;
    type: string;
    description: string;
}

/**
 * Uses the Typedoc dependency to parse TSDoc documentation within the Typescript codebase (Production code).
 * More about Typedoc reflections: https://typedoc.org/api/classes/reflection.html
 * @returns The root reflection (ProjectReflection), undefined if parsing failed.
 */
async function getReflections(): Promise<typedoc.ProjectReflection> {
    const app = new typedoc.Application();
    app.options.addReader(new typedoc.TSConfigReader()); // Required to load tsconfig files.
    app.bootstrap({
        entryPoints: [ config.productionCodeDir ],
        tsconfig: path.join(config.productionCodeDir, "tsconfig.json"),
        excludeNotDocumented: true
    });

    return app.convert();
}

/**
 * Iterates over the children of the provided reflection (And it's children if possible) and finds all
 * documented methods, functions or variables a.k.a doclets.
 * @param reflection The reflection to parse.
 * @returns An array of doclet reflections.
 */
function getDoclets(reflection: typedoc.ContainerReflection): Array<typedoc.DeclarationReflection> {
    let doclets: Array<typedoc.DeclarationReflection> = [];
    reflection.children.forEach((child) => {
        // Register all the valid children in this reflection.
        doclets.push(...child.getChildrenByKind(ReflectionKind.FunctionOrMethod))
        doclets.push(...child.getChildrenByKind(ReflectionKind.Variable))
        // If this reflection has children, look for doclets in there as well.
        if("children" in child) {
            doclets.push(...getDoclets(child));
        }
    });
    return doclets;
}

/**
 * Constructs data that will be provided to a handlebar template.
 * @param doclets Reflections of type function, method or variable.
 * @returns RenderProps
 */
function constructRenderProps(doclets: typedoc.DeclarationReflection[]): RenderProps {
    let renderProps: RenderProps = {
        sections: []
    };

    // Populate the sections
    doclets.forEach((doclet) => {
        const simpleReflection = simplifyReflection(doclet);

        let section = renderProps.sections.find((section) => section.name === simpleReflection.parent);
        if(section === undefined) {
            renderProps.sections.push({
                name: simpleReflection.parent,
                slug: `${simpleReflection.parent}-section`.toLowerCase(),
                doclets: [ simpleReflection ]
            })
        } else {
            section.doclets.push(simpleReflection);
        }
    })

    return renderProps;
}

/**
 * Takes a normal reflection and creates a simplified reflection.
 * Simplified reflections are convenient to use within handlebar templates. 
 * @param reflection The reflection to simplify.
 * @returns The simplified reflection.
 */
 function simplifyReflection(reflection: typedoc.DeclarationReflection) {
    // Figure out what the parent of this reflection is.
    let parentName = "global";
    if("parent" in reflection) {
        if(reflection.parent.kindOf(ReflectionKind.Module) === false) {
            parentName = reflection.parent.name;
        }
    }

    let simpleReflection: SimpleReflection = {
        name: reflection.name,
        slug: `${parentName}-${reflection.name}`.toLowerCase(),
        kind: reflection.kindString,
        parent: parentName,
    };

    if(reflection.kindOf(ReflectionKind.FunctionOrMethod)) {
        // In reflections of type function or method, the data we want is stored in the call signature.
        const callSignature = reflection.signatures.find((sig) => sig.kindOf(ReflectionKind.CallSignature));
        if(callSignature !== undefined) {
            extractGenericInfo(callSignature, simpleReflection);

            // Return value
            if(callSignature.comment.returns !== undefined) {
                // Slicing off the last character which is a newline.
                simpleReflection.returns = callSignature.comment.returns.slice(0, -1);
            }

            // Parameters
            simpleReflection.parameters = callSignature.parameters.map((param) => <SimpleParameter>{
                name: param.name,
                type: param.type.toString(),
                description: (param.comment !== undefined) ? param.comment.text : "No description."
            });
        }
    } else {
        extractGenericInfo(reflection, simpleReflection);
    }

    /**
     * Extracts information that's available on all kinds of reflections. 
     * @param source The source reflection.
     * @param target The target simplified reflection.
     */
    function extractGenericInfo(source: Reflection, target: SimpleReflection) {
        // Description
        if(source.hasComment()) {
            target.comment = source.comment.shortText + source.comment.text;
        } else {
            target.comment = "No description."
        }

        // If a @memberof tag was provided then it will overwrite the parent.
        if("comment" in source) {
            if(source.comment.hasTag("memberof")) {
                target.parent = source.comment.getTag("memberof").text;
                // Don't forget to update the slug as well.
                target.slug = `${target.parent}-${target.name}`.toLowerCase();
            }
        }
    }

    return simpleReflection;
}

export async function generate() {
    const reflections = await getReflections();
    const doclets = getDoclets(reflections);
    const renderProps = constructRenderProps(doclets);

    const templateString = fs.readFileSync(path.join(config.assetsDir, "template.handlebars"), { encoding: "utf-8" });
    const template = handlebars.compile(templateString);
    fs.writeFileSync(path.join(config.outputDir, "index.html"), template(renderProps));

    console.log("Documentation generation completed...");
}

if (require.main === module) {
    generate();
}
