import PropTypes from '../_util/vue-types';
export default (function () {
  return {
    trigger: PropTypes.array.def(['hover']),
    overlay: PropTypes.any,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    align: PropTypes.object,
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    transitionName: PropTypes.string,
    placement: PropTypes.oneOf(['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight']),
    overlayClassName: PropTypes.string,
    overlayStyle: PropTypes.object,
    forceRender: PropTypes.bool,
    mouseEnterDelay: PropTypes.number,
    mouseLeaveDelay: PropTypes.number,
    minOverlayWidthMatchTrigger: PropTypes.bool
  };
});