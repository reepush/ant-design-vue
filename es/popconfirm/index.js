import _extends from 'babel-runtime/helpers/extends';
import omit from 'omit.js';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, hasProp, getComponentFromProp, mergeProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import Icon from '../icon';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import Base from '../base';

var tooltipProps = abstractTooltipProps();
var btnProps = buttonTypes();
var Popconfirm = {
  name: 'APopconfirm',
  props: _extends({}, tooltipProps, {
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    okText: PropTypes.any,
    cancelText: PropTypes.any,
    icon: PropTypes.any,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object
  }),
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  watch: {
    visible: function visible(val) {
      this.sVisible = val;
    }
  },
  data: function data() {
    var props = getOptionProps(this);
    var state = { sVisible: false };
    if ('visible' in props) {
      state.sVisible = props.visible;
    } else if ('defaultVisible' in props) {
      state.sVisible = props.defaultVisible;
    }
    return state;
  },

  methods: {
    onConfirm: function onConfirm(e) {
      this.setVisible(false, e);
      this.$emit('confirm', e);
    },
    onCancel: function onCancel(e) {
      this.setVisible(false, e);
      this.$emit('cancel', e);
    },
    onVisibleChange: function onVisibleChange(sVisible) {
      this.setVisible(sVisible);
    },
    setVisible: function setVisible(sVisible, e) {
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible: sVisible });
      }
      this.$emit('visibleChange', sVisible, e);
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay: function renderOverlay(popconfirmLocale) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          okType = this.okType,
          okButtonProps = this.okButtonProps,
          cancelButtonProps = this.cancelButtonProps;

      var icon = getComponentFromProp(this, 'icon') || h(Icon, {
        attrs: { type: 'exclamation-circle', theme: 'filled' }
      });
      var cancelBtnProps = mergeProps({
        props: {
          size: 'small'
        },
        on: {
          click: this.onCancel
        }
      }, cancelButtonProps);
      var okBtnProps = mergeProps({
        props: {
          type: okType,
          size: 'small'
        },
        on: {
          click: this.onConfirm
        }
      }, okButtonProps);
      return h(
        'div',
        { 'class': prefixCls + '-inner-content' },
        [h(
          'div',
          { 'class': prefixCls + '-message' },
          [icon, h(
            'div',
            { 'class': prefixCls + '-message-title' },
            [getComponentFromProp(this, 'title')]
          )]
        ), h(
          'div',
          { 'class': prefixCls + '-buttons' },
          [h(
            Button,
            cancelBtnProps,
            [getComponentFromProp(this, 'cancelText') || popconfirmLocale.cancelText]
          ), h(
            Button,
            okBtnProps,
            [getComponentFromProp(this, 'okText') || popconfirmLocale.okText]
          )]
        )]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var otherProps = omit(props, ['title', 'content', 'cancelText', 'okText']);
    var tooltipProps = {
      props: _extends({}, otherProps, {
        visible: this.sVisible
      }),
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    var overlay = h(LocaleReceiver, {
      attrs: {
        componentName: 'Popconfirm',
        defaultLocale: defaultLocale.Popconfirm
      },
      scopedSlots: { 'default': this.renderOverlay }
    });
    return h(
      Tooltip,
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [overlay]
      ), this.$slots['default']]
    );
  }
};

/* istanbul ignore next */
Popconfirm.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Popconfirm.name, Popconfirm);
};

export default Popconfirm;