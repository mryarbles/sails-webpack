'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marlinspike = require('marlinspike');

var _marlinspike2 = _interopRequireDefault(_marlinspike);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Webpack = function (_Marlinspike) {
  _inherits(Webpack, _Marlinspike);

  function Webpack(sails) {
    _classCallCheck(this, Webpack);

    return _possibleConstructorReturn(this, (Webpack.__proto__ || Object.getPrototypeOf(Webpack)).call(this, sails, module));
  }

  _createClass(Webpack, [{
    key: 'configure',
    value: function configure() {
      var config = this.sails.config;

      if (!config.webpack.options) {
        sails.log.warn('sails-webpack: no Webpack "options" are defined.');
        sails.log.warn('sails-webpack: Please configure config/webpack.js');
      }
    }
  }, {
    key: 'initialize',
    value: function initialize(next) {
      var _this2 = this;

      var config = this.sails.config;
      next();

      sails.after('lifted', function () {
        _this2.compiler = (0, _webpack2.default)(_lodash2.default.extend({}, _this2.sails.config.webpack.options), function (err, stats) {
          if (err) throw err;

          sails.log.info('sails-webpack: compiler loaded.');
          sails.log.silly('sails-webpack: ', stats.toString());

          if (process.env.NODE_ENV == 'development') {
            sails.log.info('sails-webpack: watching...');
            _this2.compiler.watch(_lodash2.default.extend({}, _this2.sails.config.webpack.watchOptions), _this2.afterBuild);
          } else {
            sails.log.info('sails-webpack: running...');
            _this2.compiler.run(_this2.afterBuild);
          }
        });
      });
    }
  }, {
    key: 'afterBuild',
    value: function afterBuild(err, rawStats) {
      if (err) return sails.log.error('sails-webpack: FATAL ERROR', err);

      var stats = rawStats.toJson();

      sails.log.debug('sails-webpack: Build Info\n' + rawStats.toString({
        colors: true,
        chunks: false
      }));

      if (stats.errors.length > 0) {
        sails.log.error('sails-webpack:', stats.errors);
      }
      if (stats.warnings.length > 0) {
        sails.log.warn('sails-webpack:', stats.warnings);
      }
    }
  }]);

  return Webpack;
}(_marlinspike2.default);

module.exports = _marlinspike2.default.createSailsHook(Webpack);