/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as path from 'path';
import * as ts from 'typescript';

import {assertAbsolute} from '../src/cli_support';
import * as tsickle from '../src/tsickle';

import * as testSupport from './test_support';

describe('emitWithTsickle', () => {
  function emitWithTsickle(
      tsSources: {[fileName: string]: string}, tsConfigOverride: Partial<ts.CompilerOptions> = {},
      tsickleHostOverride: Partial<tsickle.TsickleHost> = {},
      customTransformers?: tsickle.EmitTransformers): {[fileName: string]: string} {
    const tsCompilerOptions:
        ts.CompilerOptions = {...testSupport.compilerOptions, ...tsConfigOverride};

    const sources = new Map<string, string>();
    for (const fileName of Object.keys(tsSources)) {
      sources.set(path.join(tsCompilerOptions.rootDir!, fileName), tsSources[fileName]);
    }
    const {program, host: tsHost} = testSupport.createProgramAndHost(sources, tsCompilerOptions);
    testSupport.expectDiagnosticsEmpty(ts.getPreEmitDiagnostics(program));
    const tsickleHost: tsickle.TsickleHost = {
      es5Mode: true,
      googmodule: false,
      convertIndexImportShorthand: true,
      transformDecorators: true,
      transformTypesToClosure: true,
      generateTsMigrationExportsShim: false,
      logWarning: (diag: ts.Diagnostic) => {},
      shouldSkipTsickleProcessing: (fileName) => {
        assertAbsolute(fileName);
        return !sources.has(fileName);
      },
      shouldIgnoreWarningsForPath: () => false,
      pathToModuleName: (context, importPath) => {
        importPath = importPath.replace(/(\.d)?\.[tj]s$/, '');
        if (importPath[0] === '.') {
          importPath = path.join(path.dirname(context), importPath);
        }
        return importPath.replace(/\/|\\/g, '.');
      },
      fileNameToModuleId: (fileName) => fileName.replace(/^\.\//, ''),
      ...tsickleHostOverride,
      options: tsCompilerOptions,
      moduleResolutionHost: tsHost,
      rootDirsRelative: testSupport.relativeToTsickleRoot,
    };
    const jsSources: {[fileName: string]: string} = {};
    tsickle.emit(
        program, tsickleHost,
        (fileName: string, data: string) => {
          jsSources[path.relative(tsCompilerOptions.rootDir!, fileName)] = data;
        },
        /* sourceFile */ undefined,
        /* cancellationToken */ undefined, /* emitOnlyDtsFiles */ undefined, customTransformers);
    return jsSources;
  }


  it('should run custom transformers for files with skipTsickleProcessing', () => {
    function transformValue(context: ts.TransformationContext) {
      return (sourceFile: ts.SourceFile): ts.SourceFile => {
        return visitNode(sourceFile) as ts.SourceFile;

        function visitNode(node: ts.Node): ts.Node {
          if (node.kind === ts.SyntaxKind.NumericLiteral) {
            return ts.factory.createNumericLiteral(2);
          }
          return ts.visitEachChild(node, visitNode, context);
        }
      };
    }

    const tsSources = {
      'a.ts': `export const x = 1;`,
    };
    const jsSources = emitWithTsickle(
        tsSources, undefined, {
          shouldSkipTsickleProcessing: () => true,
        },
        {beforeTs: [transformValue]});

    expect(jsSources['a.js']).toContain('exports.x = 2;');
  });

  it('should export const enums when preserveConstEnums is true', () => {
    const tsSources = {
      'a.ts': `export const enum Foo { Bar };`,
      'b.ts': `export * from './a';`,
    };

    const jsSources = emitWithTsickle(
        tsSources, {
          preserveConstEnums: true,
          module: ts.ModuleKind.ES2015,
        },
        {es5Mode: false, googmodule: false});

    expect(jsSources['b.js']).toContain(`export { Foo } from './a';`);
  });

  it('should not go into an infinite loop with a self-referential type', () => {
    const tsSources = {
      'a.ts': `export function f() : typeof f { return f; }`,
    };

    const jsSources = emitWithTsickle(tsSources, {
      module: ts.ModuleKind.ES2015,
    });

    expect(jsSources['a.js']).toContain(`
/**
 * @return {function(): ?}
 */
export function f() { return f; }
`);
  });

  describe('regressions', () => {
    it('should produce correct .d.ts files when expanding `export *` with es2015 module syntax',
       () => {
         const tsSources = {
           'a.ts': `export const x = 1;`,
           'b.ts': `export * from './a';\n`,
         };
         const jsSources = emitWithTsickle(
             tsSources, {
               declaration: true,
               module: ts.ModuleKind.ES2015,
             },
             {es5Mode: false, googmodule: false});

         expect(jsSources['b.d.ts']).toEqual(`export * from './a';\n`);
       });
  });
});
