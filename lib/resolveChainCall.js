'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveChainCall;

var _babelTypes = require('babel-types');

var types = _interopRequireWildcard(_babelTypes);

var _importModule2 = require('./importModule');

var _importModule3 = _interopRequireDefault(_importModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** The error message used when unterminated chain sequences are detected. */
var UNTERMINATED_CHAIN_ERROR = ['Untermined Lodash chain sequences are not supported by babel-plugin-lodash.', 'Consider substituting chain sequences with composition patterns.', 'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'].join('\n');

function resolveChainCall(pkgStore, chainCallPath) {
  var nestedCallArgument = chainCallPath.node.arguments[0];
  var nextCallPath = chainCallPath;
  var nextMemberPath = void 0;
  var nextMemberName = void 0;

  while ((nextMemberPath = nextCallPath.parentPath).isMemberExpression() && (nextCallPath = nextMemberPath.parentPath).isCallExpression()) {
    nextMemberName = nextMemberPath.node.property.name;

    if (nextMemberName == 'value') {
      nextCallPath.replaceWith(nestedCallArgument);
      return;
    } else {
      var _importModule = (0, _importModule3.default)(pkgStore, nextMemberName, nextCallPath),
          name = _importModule.name;

      nestedCallArgument = types.callExpression(types.identifier(name), [nestedCallArgument].concat(_toConsumableArray(nextCallPath.node.arguments)));
      nextMemberPath.parentPath.replaceWith(nestedCallArgument);
    }
  }

  throw nextMemberPath.buildCodeFrameError(UNTERMINATED_CHAIN_ERROR);
}
module.exports = exports['default'];