import {
  Project,
  ClassDeclaration,
  StructureKind,
  ModuleDeclarationKind,
  FunctionDeclarationStructure,
} from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

for (const sourceFile of project
  .getSourceFiles()
  .filter((sourceFile) => !sourceFile.getBaseName().endsWith(".derived.ts"))) {
  const classes = sourceFile.getClasses().filter(isDerivingEquals);
  if (classes.length > 0) {
    const derivedFile = sourceFile.getDirectory().createSourceFile(
      sourceFile.getBaseNameWithoutExtension() + ".derived.ts",
      {
        statements: [
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: classes.map((klass) => klass.getName() as string),
            moduleSpecifier: "./" + sourceFile.getBaseNameWithoutExtension(),
          },
          {
            kind: StructureKind.Module,
            declarationKind: ModuleDeclarationKind.Module,
            name: `"./${sourceFile.getBaseNameWithoutExtension()}"`,
            statements: classes.map((klass) => {
              return {
                kind: StructureKind.Interface,
                name: klass.getName() as string,
                methods: [
                  {
                    name: "equals",
                    returnType: "boolean",
                    parameters: [
                      {
                        name: "other",
                        type: klass.getName() as string,
                      },
                    ],
                  },
                ],
              };
            }),
          },
          ...classes.map(createEqualsImplementation),
        ],
      },
      { overwrite: true }
    );
  }
}

project.saveSync();

function isDerivingEquals(klass: ClassDeclaration) {
  return klass.isExported() && klass.getImplements().some((expression) => expression.getText() === "DeriveEquals");
}

function createEqualsImplementation(klass: ClassDeclaration): FunctionDeclarationStructure {
  return {
    kind: StructureKind.Function,
    name: "equals" + klass.getName(),
    returnType: "boolean",
    parameters: [
      { name: "this", type: klass.getName() as string },
      { name: "other", type: klass.getName() as string },
    ],
    statements: [
      "if (this === other) return true",
      ...klass.getInstanceProperties().flatMap((property) => {
        if (property.getType().isBoolean() || property.getType().isNumber() || property.getType().isString()) {
          return [`if (this.${property.getName()} !== other.${property.getName()}) return false;`];
        }
        if (property.getType().isClass()) {
          return [`if (!this.${property.getName()}.equals(other.${property.getName()})) return false;`];
        }
        return [];
      }),
      "return true",
    ],
  };
}
