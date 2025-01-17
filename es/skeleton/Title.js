import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';

var skeletonTitleProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export var SkeletonTitleProps = PropTypes.shape(skeletonTitleProps);

var Title = {
  props: initDefaultProps(skeletonTitleProps, {
    prefixCls: 'ant-skeleton-title'
  }),
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        width = _$props.width;

    var zWidth = typeof width === 'number' ? width + 'px' : width;
    return h('h3', { 'class': prefixCls, style: { width: zWidth } });
  }
};

export default Title;