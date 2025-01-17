import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import classNames from 'classnames';
import * as allIcons from '@ant-design/icons/lib/dist';
import VueIcon from '@ant-design/icons-vue';
import PropTypes from '../_util/vue-types';
import createFromIconfontCN from './IconFont';
import { svgBaseProps, withThemeSuffix, removeTypeTheme, getThemeFromTypeName, alias } from './utils';
import warning from '../_util/warning';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import { filterEmpty, getClass } from '../_util/props-util';
import Base from '../base';

// Initial setting
VueIcon.add.apply(VueIcon, _toConsumableArray(Object.keys(allIcons).map(function (key) {
  return allIcons[key];
})));
setTwoToneColor('#1890ff');
var defaultTheme = 'outlined';
var dangerousTheme = void 0;

var Icon = {
  functional: true,
  name: 'AIcon',
  props: {
    type: PropTypes.string,
    component: PropTypes.any,
    viewBox: PropTypes.any,
    spin: PropTypes.bool.def(false),
    theme: PropTypes.oneOf(['filled', 'outlined', 'twoTone']),
    twoToneColor: PropTypes.string
  },
  render: function render(h, context) {
    var _extends2;

    var props = context.props,
        slots = context.slots,
        listeners = context.listeners,
        data = context.data;
    var type = props.type,
        Component = props.component,
        viewBox = props.viewBox,
        spin = props.spin,
        theme = props.theme,
        twoToneColor = props.twoToneColor;

    var slotsMap = slots();
    var children = filterEmpty(slotsMap['default']);
    children = children.length === 0 ? undefined : children;
    warning(Boolean(type || Component || children), 'Icon should have `type` prop or `component` prop or `children`.');

    var classString = classNames(_extends({}, getClass(context), (_extends2 = {}, _defineProperty(_extends2, 'anticon', true), _defineProperty(_extends2, 'anticon-' + type, !!type), _extends2)));

    var svgClassString = classNames(_defineProperty({}, 'anticon-spin', !!spin || type === 'loading'));

    var innerNode = void 0;

    // component > children > type
    if (Component) {
      var innerSvgProps = {
        attrs: _extends({}, svgBaseProps, {
          viewBox: viewBox
        }),
        'class': svgClassString
      };
      if (!viewBox) {
        delete innerSvgProps.attrs.viewBox;
      }

      innerNode = h(
        Component,
        innerSvgProps,
        [children]
      );
    }
    if (children) {
      warning(Boolean(viewBox) || children.length === 1 && children[0].tag === 'use', 'Make sure that you provide correct `viewBox`' + ' prop (default `0 0 1024 1024`) to the icon.');
      var _innerSvgProps = {
        attrs: _extends({}, svgBaseProps),
        'class': svgClassString
      };
      innerNode = h(
        'svg',
        _mergeJSXProps([_innerSvgProps, {
          attrs: { viewBox: viewBox }
        }]),
        [children]
      );
    }

    if (typeof type === 'string') {
      var computedType = type;
      if (theme) {
        var themeInName = getThemeFromTypeName(type);
        warning(!themeInName || theme === themeInName, 'The icon name \'' + type + '\' already specify a theme \'' + themeInName + '\',' + (' the \'theme\' prop \'' + theme + '\' will be ignored.'));
      }
      computedType = withThemeSuffix(removeTypeTheme(alias(computedType)), dangerousTheme || theme || defaultTheme);
      innerNode = h(VueIcon, {
        attrs: {
          focusable: 'false',

          type: computedType,
          primaryColor: twoToneColor
        },
        'class': svgClassString });
    }
    // functional component not support nativeOn，https://github.com/vuejs/vue/issues/7526
    var iProps = _extends({}, data, {
      on: _extends({}, listeners, data.nativeOn),
      'class': classString,
      staticClass: ''
    });
    return h(
      'i',
      iProps,
      [innerNode]
    );
  }
};

Icon.createFromIconfontCN = createFromIconfontCN;
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;

/* istanbul ignore next */
Icon.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Icon.name, Icon);
};

export default Icon;