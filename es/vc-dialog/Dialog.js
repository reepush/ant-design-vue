import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import { getComponentFromProp } from '../_util/props-util';
import KeyCode from '../_util/KeyCode';
import contains from '../_util/Dom/contains';
import LazyRenderBox from './LazyRenderBox';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import getScrollBarSize from '../_util/getScrollBarSize';
import getDialogPropTypes from './IDialogPropTypes';
var IDialogPropTypes = getDialogPropTypes();

var uuid = 0;
var openCount = 0;

/* eslint react/no-is-mounted:0 */
function noop() {}
function getScroll(w, top) {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
}

function setTransformOrigin(node, value) {
  var style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
    style[prefix + 'TransformOrigin'] = value;
  });
  style['transformOrigin'] = value;
}

function offset(el) {
  var rect = el.getBoundingClientRect();
  var pos = {
    left: rect.left,
    top: rect.top
  };
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}
var initDefaultProps = function initDefaultProps(propTypes, defaultProps) {
  return Object.keys(defaultProps).map(function (k) {
    return propTypes[k].def(defaultProps[k]);
  });
};
export default {
  mixins: [BaseMixin],
  props: _extends({}, IDialogPropTypes, initDefaultProps(IDialogPropTypes, {
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog'
  })),
  data: function data() {
    return {
      destroyPopup: false
    };
  },


  watch: {
    visible: function visible(val) {
      var _this = this;

      if (val) {
        this.destroyPopup = false;
      }
      this.$nextTick(function () {
        _this.updatedCallback(!val);
      });
    }
  },

  // private inTransition: boolean;
  // private titleId: string;
  // private openTime: number;
  // private lastOutSideFocusNode: HTMLElement | null;
  // private wrap: HTMLElement;
  // private dialog: any;
  // private sentinel: HTMLElement;
  // private bodyIsOverflowing: boolean;
  // private scrollbarWidth: number;

  beforeMount: function beforeMount() {
    this.inTransition = false;
    this.titleId = 'rcDialogTitle' + uuid++;
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.updatedCallback(false);
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.visible || this.inTransition) {
      this.removeScrollingEffect();
    }
  },

  methods: {
    updatedCallback: function updatedCallback(visible) {
      var mousePosition = this.mousePosition;
      if (this.visible) {
        // first show
        if (!visible) {
          this.openTime = Date.now();
          // this.lastOutSideFocusNode = document.activeElement
          this.addScrollingEffect();
          // this.$refs.wrap.focus()
          this.tryFocus();
          var dialogNode = this.$refs.dialog.$el;
          if (mousePosition) {
            var elOffset = offset(dialogNode);
            setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
          } else {
            setTransformOrigin(dialogNode, '');
          }
        }
      } else if (visible) {
        this.inTransition = true;
        if (this.mask && this.lastOutSideFocusNode) {
          try {
            this.lastOutSideFocusNode.focus();
          } catch (e) {
            this.lastOutSideFocusNode = null;
          }
          this.lastOutSideFocusNode = null;
        }
      }
    },
    tryFocus: function tryFocus() {
      if (!contains(this.$refs.wrap, document.activeElement)) {
        this.lastOutSideFocusNode = document.activeElement;
        this.$refs.sentinelStart.focus();
      }
    },
    onAnimateLeave: function onAnimateLeave() {
      var afterClose = this.afterClose,
          destroyOnClose = this.destroyOnClose;
      // need demo?
      // https://github.com/react-component/dialog/pull/28

      if (this.$refs.wrap) {
        this.$refs.wrap.style.display = 'none';
      }
      if (destroyOnClose) {
        this.destroyPopup = true;
      }
      this.inTransition = false;
      this.removeScrollingEffect();
      if (afterClose) {
        afterClose();
      }
    },
    onMaskClick: function onMaskClick(e) {
      // android trigger click on open (fastclick??)
      if (Date.now() - this.openTime < 300) {
        return;
      }
      if (e.target === e.currentTarget) {
        this.close(e);
      }
    },
    onKeydown: function onKeydown(e) {
      var props = this.$props;
      if (props.keyboard && e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        this.close(e);
        return;
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === KeyCode.TAB) {
          var activeElement = document.activeElement;
          var sentinelStart = this.$refs.sentinelStart;
          if (e.shiftKey) {
            if (activeElement === sentinelStart) {
              this.$refs.sentinelEnd.focus();
            }
          } else if (activeElement === this.$refs.sentinelEnd) {
            sentinelStart.focus();
          }
        }
      }
    },
    getDialogElement: function getDialogElement() {
      var h = this.$createElement;
      var closable = this.closable,
          prefixCls = this.prefixCls,
          width = this.width,
          height = this.height,
          title = this.title,
          tempFooter = this.footer,
          bodyStyle = this.bodyStyle,
          visible = this.visible,
          bodyProps = this.bodyProps;

      var dest = {};
      if (width !== undefined) {
        dest.width = typeof width === 'number' ? width + 'px' : width;
      }
      if (height !== undefined) {
        dest.height = typeof height === 'number' ? height + 'px' : height;
      }

      var footer = void 0;
      if (tempFooter) {
        footer = h(
          'div',
          { key: 'footer', 'class': prefixCls + '-footer', ref: 'footer' },
          [tempFooter]
        );
      }

      var header = void 0;
      if (title) {
        header = h(
          'div',
          { key: 'header', 'class': prefixCls + '-header', ref: 'header' },
          [h(
            'div',
            { 'class': prefixCls + '-title', attrs: { id: this.titleId }
            },
            [title]
          )]
        );
      }

      var closer = void 0;
      if (closable) {
        var closeIcon = getComponentFromProp(this, 'closeIcon');
        closer = h(
          'button',
          {
            key: 'close',
            on: {
              'click': this.close || noop
            },
            attrs: {
              'aria-label': 'Close'
            },
            'class': prefixCls + '-close'
          },
          [closeIcon || h('span', { 'class': prefixCls + '-close-x' })]
        );
      }

      var style = _extends({}, this.dialogStyle, dest);
      var sentinelStyle = { width: 0, height: 0, overflow: 'hidden' };
      var cls = _extends(_defineProperty({}, prefixCls, true), this.dialogClass);
      var transitionName = this.getTransitionName();
      var dialogElement = h(
        LazyRenderBox,
        {
          directives: [{
            name: 'show',
            value: visible
          }],

          key: 'dialog-element',
          attrs: { role: 'document'
          },
          ref: 'dialog',
          style: style,
          'class': cls
        },
        [h(
          'div',
          {
            attrs: { tabIndex: 0 },
            ref: 'sentinelStart', style: sentinelStyle },
          ['sentinelStart']
        ), h(
          'div',
          { 'class': prefixCls + '-content' },
          [closer, header, h(
            'div',
            _mergeJSXProps([{ key: 'body', 'class': prefixCls + '-body', style: bodyStyle, ref: 'body' }, bodyProps]),
            [this.$slots['default']]
          ), footer]
        ), h(
          'div',
          {
            attrs: { tabIndex: 0 },
            ref: 'sentinelEnd', style: sentinelStyle },
          ['sentinelEnd']
        )]
      );
      var dialogTransitionProps = getTransitionProps(transitionName, {
        afterLeave: this.onAnimateLeave
      });
      return h(
        'transition',
        _mergeJSXProps([{ key: 'dialog' }, dialogTransitionProps]),
        [visible || !this.destroyPopup ? dialogElement : null]
      );
    },
    getZIndexStyle: function getZIndexStyle() {
      var style = {};
      var props = this.$props;
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex;
      }
      return style;
    },
    getWrapStyle: function getWrapStyle() {
      return _extends({}, this.getZIndexStyle(), this.wrapStyle);
    },
    getMaskStyle: function getMaskStyle() {
      return _extends({}, this.getZIndexStyle(), this.maskStyle);
    },
    getMaskElement: function getMaskElement() {
      var h = this.$createElement;

      var props = this.$props;
      var maskElement = void 0;
      if (props.mask) {
        var maskTransition = this.getMaskTransitionName();
        maskElement = h(LazyRenderBox, _mergeJSXProps([{
          directives: [{
            name: 'show',
            value: props.visible
          }],

          style: this.getMaskStyle(),
          key: 'mask',
          'class': props.prefixCls + '-mask'
        }, props.maskProps]));
        if (maskTransition) {
          var maskTransitionProps = getTransitionProps(maskTransition);
          maskElement = h(
            'transition',
            _mergeJSXProps([{ key: 'mask' }, maskTransitionProps]),
            [maskElement]
          );
        }
      }
      return maskElement;
    },
    getMaskTransitionName: function getMaskTransitionName() {
      var props = this.$props;
      var transitionName = props.maskTransitionName;
      var animation = props.maskAnimation;
      if (!transitionName && animation) {
        transitionName = props.prefixCls + '-' + animation;
      }
      return transitionName;
    },
    getTransitionName: function getTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      var animation = props.animation;
      if (!transitionName && animation) {
        transitionName = props.prefixCls + '-' + animation;
      }
      return transitionName;
    },
    setScrollbar: function setScrollbar() {
      if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
        document.body.style.paddingRight = this.scrollbarWidth + 'px';
      }
    },
    addScrollingEffect: function addScrollingEffect() {
      openCount++;
      if (openCount !== 1) {
        return;
      }
      this.checkScrollbar();
      this.setScrollbar();
      document.body.style.overflow = 'hidden';
      // this.adjustDialog();
    },
    removeScrollingEffect: function removeScrollingEffect() {
      openCount--;
      if (openCount !== 0) {
        return;
      }
      document.body.style.overflow = '';
      this.resetScrollbar();
      // this.resetAdjustments();
    },
    close: function close(e) {
      this.__emit('close', e);
    },
    checkScrollbar: function checkScrollbar() {
      var fullWindowWidth = window.innerWidth;
      if (!fullWindowWidth) {
        // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect();
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
      if (this.bodyIsOverflowing) {
        this.scrollbarWidth = getScrollBarSize();
      }
    },
    resetScrollbar: function resetScrollbar() {
      document.body.style.paddingRight = '';
    },
    adjustDialog: function adjustDialog() {
      if (this.$refs.wrap && this.scrollbarWidth !== undefined) {
        var modalIsOverflowing = this.$refs.wrap.scrollHeight > document.documentElement.clientHeight;
        this.$refs.wrap.style.paddingLeft = (!this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
        this.$refs.wrap.style.paddingRight = (this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
      }
    },
    resetAdjustments: function resetAdjustments() {
      if (this.$refs.wrap) {
        this.$refs.wrap.style.paddingLeft = this.$refs.wrap.style.paddingLeft = '';
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        maskClosable = this.maskClosable,
        visible = this.visible,
        wrapClassName = this.wrapClassName,
        title = this.title,
        wrapProps = this.wrapProps;

    var style = this.getWrapStyle();
    // clear hide display
    // and only set display after async anim, not here for hide
    if (visible) {
      style.display = null;
    }
    return h('div', [this.getMaskElement(), h(
      'div',
      _mergeJSXProps([{
        attrs: {
          tabIndex: -1,

          role: 'dialog',
          'aria-labelledby': title ? this.titleId : null
        },
        on: {
          'keydown': this.onKeydown,
          'click': maskClosable ? this.onMaskClick : noop
        },

        'class': prefixCls + '-wrap ' + (wrapClassName || ''),
        ref: 'wrap',
        style: style
      }, wrapProps]),
      [this.getDialogElement()]
    )]);
  }
};