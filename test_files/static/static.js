/**
 * @fileoverview added by tsickle
 * Generated from: test_files/static/static.ts
 * @suppress {checkTypes,const,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
goog.module('test_files.static.static');
var module = module || { id: 'test_files/static/static.ts' };
goog.require('tslib');
class Static {
}
// This should not become a stub declaration.
Static.bar = 3;
// private statics also should work.
Static.baz = 3;
/* istanbul ignore if */
if (false) {
    /**
     * @type {number}
     * @public
     */
    Static.bar;
    /**
     * @type {number}
     * @private
     */
    Static.baz;
}
