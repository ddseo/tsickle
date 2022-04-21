/**
 *
 * @fileoverview Tests type only usage of symbols imported using import equals
 * syntax. TypeScript elides those imports, so type references have to use
 * tsickle's requireType symbols.
 *
 * Generated from: test_files/import_equals/import_equals_type_usage.ts
 * @suppress {checkTypes,const,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('test_files.import_equals.import_equals_type_usage');
var module = module || { id: 'test_files/import_equals/import_equals_type_usage.ts' };
goog.require('tslib');
const tsickle_exporter_1 = goog.requireType("test_files.import_equals.exporter");
/** @type {(undefined|!tsickle_exporter_1.Exported)} */
let exported;
/** @type {(undefined|!tsickle_exporter_1.Exported.Nested)} */
let nested;
/** @type {(undefined|!tsickle_exporter_1.Exported.Nested.Thing)} */
let thing;
console.log(exported, nested, thing);
