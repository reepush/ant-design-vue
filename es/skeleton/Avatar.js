import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';

var skeletonAvatarProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  shape: PropTypes.oneOf(['circle', 'square'])
};

export var SkeletonAvatarProps = PropTypes.shape(skeletonAvatarProps).loose;

var Avatar = {
  props: initDefaultProps(skeletonAvatarProps, {
    prefixCls: 'ant-skeleton-avatar',
    size: 'large'
  }),
  render: function render() {
    var _classNames, _classNames2;

    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        size = _$props.size,
        shape = _$props.shape;


    var sizeCls = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-lg', size === 'large'), _defineProperty(_classNames, prefixCls + '-sm', size === 'small'), _classNames));

    var shapeCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-circle', shape === 'circle'), _defineProperty(_classNames2, prefixCls + '-square', shape === 'square'), _classNames2));

    return h('span', { 'class': classNames(prefixCls, sizeCls, shapeCls) });
  }
};

export default Avatar;