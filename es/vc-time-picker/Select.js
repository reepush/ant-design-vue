import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import classnames from 'classnames';
function noop() {}
var scrollTo = function scrollTo(element, to, duration) {
  var requestAnimationFrame = window.requestAnimationFrame || function requestAnimationFrameTimeout() {
    return setTimeout(arguments[0], 10);
  };
  // jump to target if duration zero
  if (duration <= 0) {
    element.scrollTop = to;
    return;
  }
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  requestAnimationFrame(function () {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

var Select = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    type: PropTypes.string
    // onSelect: PropTypes.func,
    // onMouseEnter: PropTypes.func,
  },
  data: function data() {
    return {
      active: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      // jump to selected option
      _this.scrollToSelected(0);
    });
  },

  watch: {
    selectedIndex: function selectedIndex() {
      var _this2 = this;

      this.$nextTick(function () {
        // smooth scroll to selected option
        _this2.scrollToSelected(120);
      });
    }
  },
  methods: {
    onSelect: function onSelect(value) {
      var type = this.type;

      this.__emit('select', type, value);
    },
    getOptions: function getOptions() {
      var _this3 = this;

      var h = this.$createElement;
      var options = this.options,
          selectedIndex = this.selectedIndex,
          prefixCls = this.prefixCls;

      return options.map(function (item, index) {
        var _classnames;

        var cls = classnames((_classnames = {}, _defineProperty(_classnames, prefixCls + '-select-option-selected', selectedIndex === index), _defineProperty(_classnames, prefixCls + '-select-option-disabled', item.disabled), _classnames));
        var onClick = noop;
        if (!item.disabled) {
          onClick = _this3.onSelect.bind(_this3, item.value);
        }
        return h(
          'li',
          { 'class': cls, key: index, on: {
              'click': onClick
            },
            attrs: { disabled: item.disabled }
          },
          [item.value]
        );
      });
    },
    scrollToSelected: function scrollToSelected(duration) {
      // move to selected item
      var select = this.$el;
      var list = this.$refs.list;
      if (!list) {
        return;
      }
      var index = this.selectedIndex;
      if (index < 0) {
        index = 0;
      }
      var topOption = list.children[index];
      var to = topOption.offsetTop;
      scrollTo(select, to, duration);
    },
    handleMouseEnter: function handleMouseEnter(e) {
      this.setState({ active: true });
      this.__emit('mouseenter', e);
    },
    handleMouseLeave: function handleMouseLeave() {
      this.setState({ active: false });
    }
  },

  render: function render() {
    var _cls;

    var h = arguments[0];

    if (this.options.length === 0) {
      return null;
    }

    var prefixCls = this.prefixCls;

    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-select', 1), _defineProperty(_cls, prefixCls + '-select-active', this.active), _cls);

    return h(
      'div',
      { 'class': cls, on: {
          'mouseenter': this.handleMouseEnter,
          'mouseleave': this.handleMouseLeave
        }
      },
      [h(
        'ul',
        { ref: 'list' },
        [this.getOptions()]
      )]
    );
  }
};

export default Select;