import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import VcSteps from '../vc-steps';
import Icon from '../icon';
import Base from '../base';

var getStepsProps = function getStepsProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
    initial: PropTypes.number,
    labelPlacement: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
    size: PropTypes.oneOf(['default', 'small']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  };
  return initDefaultProps(props, defaultProps);
};

var Steps = {
  name: 'ASteps',
  props: getStepsProps({
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0
  }),
  Step: _extends({}, VcSteps.Step, { name: 'AStep' }),
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var prefixCls = props.prefixCls;

    var icons = {
      finish: h(Icon, {
        attrs: { type: 'check' },
        'class': prefixCls + '-finish-icon' }),
      error: h(Icon, {
        attrs: { type: 'close' },
        'class': prefixCls + '-error-icon' })
    };
    var stepsProps = {
      props: _extends({
        icons: icons
      }, props),
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    };
    return h(
      VcSteps,
      stepsProps,
      [this.$slots['default']]
    );
  }
};

/* istanbul ignore next */
Steps.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Steps.name, Steps);
  Vue.component(Steps.Step.name, Steps.Step);
};

export default Steps;