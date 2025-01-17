import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp, getPropsData, isEmptyElement, initDefaultProps } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import openAnimationFactory from './openAnimationFactory';
import { collapseProps } from './commonProps';

function _toArray(activeKey) {
  var currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey;
}

export default {
  name: 'Collapse',
  mixins: [BaseMixin],
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: initDefaultProps(collapseProps, {
    prefixCls: 'rc-collapse',
    accordion: false,
    destroyInactivePanel: false
  }),
  data: function data() {
    var _$props = this.$props,
        activeKey = _$props.activeKey,
        defaultActiveKey = _$props.defaultActiveKey,
        openAnimation = _$props.openAnimation,
        prefixCls = _$props.prefixCls;

    var currentActiveKey = defaultActiveKey;
    if (hasProp(this, 'activeKey')) {
      currentActiveKey = activeKey;
    }
    var currentOpenAnimations = openAnimation || openAnimationFactory(prefixCls);
    return {
      currentOpenAnimations: currentOpenAnimations,
      stateActiveKey: _toArray(currentActiveKey)
    };
  },

  watch: {
    activeKey: function activeKey(val) {
      this.setState({
        stateActiveKey: _toArray(val)
      });
    },
    openAnimation: function openAnimation(val) {
      this.setState({
        currentOpenAnimations: val
      });
    }
  },
  methods: {
    onClickItem: function onClickItem(key) {
      var activeKey = this.stateActiveKey;
      if (this.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [].concat(_toConsumableArray(activeKey));
        var index = activeKey.indexOf(key);
        var isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      this.setActiveKey(activeKey);
    },
    getItems: function getItems() {
      var _this = this;

      var activeKey = this.stateActiveKey;
      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          accordion = _$props2.accordion,
          destroyInactivePanel = _$props2.destroyInactivePanel,
          expandIcon = _$props2.expandIcon;

      var newChildren = [];
      if (this.$slots['default']) {
        this.$slots['default'].forEach(function (child, index) {
          if (isEmptyElement(child)) return;

          var _getPropsData = getPropsData(child),
              header = _getPropsData.header,
              headerClass = _getPropsData.headerClass,
              disabled = _getPropsData.disabled;

          var isActive = false;
          var key = child.key || String(index);
          if (accordion) {
            isActive = activeKey[0] === key;
          } else {
            isActive = activeKey.indexOf(key) > -1;
          }

          var panelEvents = {};
          if (!disabled && disabled !== '') {
            panelEvents = {
              itemClick: function itemClick() {
                _this.onClickItem(key);
              }
            };
          }

          var props = {
            props: {
              header: header,
              headerClass: headerClass,
              isActive: isActive,
              prefixCls: prefixCls,
              destroyInactivePanel: destroyInactivePanel,
              openAnimation: _this.currentOpenAnimations,
              accordion: accordion,
              expandIcon: expandIcon
            },
            on: _extends({}, panelEvents)
          };

          newChildren.push(cloneElement(child, props));
        });
      }
      return newChildren;
    },
    setActiveKey: function setActiveKey(activeKey) {
      this.setState({ stateActiveKey: activeKey });
      this.$emit('change', this.accordion ? activeKey[0] : activeKey);
    }
  },
  render: function render() {
    var h = arguments[0];
    var _$props3 = this.$props,
        prefixCls = _$props3.prefixCls,
        accordion = _$props3.accordion;

    var collapseClassName = _defineProperty({}, prefixCls, true);
    return h(
      'div',
      { 'class': collapseClassName, attrs: { role: accordion ? 'tablist' : null }
      },
      [this.getItems()]
    );
  }
};