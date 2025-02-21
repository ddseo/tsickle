/**
 *
 * @fileoverview Declares the symbols used in union types in type_alias_exporter. These symbols
 * must ultimately be imported by type_alias_imported.
 *
 * Generated from: test_files/type_alias_imported/type_alias_declare.ts
 * @suppress {checkTypes,const,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('test_files.type_alias_imported.type_alias_declare');
var module = module || { id: 'test_files/type_alias_imported/type_alias_declare.ts' };
goog.require('tslib');
/**
 * @record
 */
function X() { }
exports.X = X;
/* istanbul ignore if */
if (false) {
    /**
     * @type {string}
     * @public
     */
    X.prototype.x;
}
