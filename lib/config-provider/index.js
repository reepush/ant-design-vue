'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: _vueTypes2['default'].func
  },
  provide: function provide() {
    return {
      configProvider: this.$props
    };
  },
  render: function render() {
    return this.$slots['default'] ? this.$slots['default'][0] : null;
  }
};

/* istanbul ignore next */
ConfigProvider.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

exports['default'] = ConfigProvider;