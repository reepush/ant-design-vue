import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getComponentFromProp } from '../../../_util/props-util';
import moment from 'moment';
import { formatDate } from '../util';
import { isIE, isIE9 } from '../../../_util/env';

var DateInput = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
    clearIcon: PropTypes.any
  },

  data: function data() {
    var selectedValue = this.selectedValue;
    return {
      str: formatDate(selectedValue, this.format),
      invalid: false,
      hasFocus: false
    };
  },

  watch: {
    selectedValue: function selectedValue() {
      this.updateState();
    },
    format: function format() {
      this.updateState();
    }
  },

  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.$data.hasFocus && !_this.invalid && !(_this.cachedSelectionStart === 0 && _this.cachedSelectionEnd === 0)) {
        _this.$refs.dateInputInstance.setSelectionRange(_this.cachedSelectionStart, _this.cachedSelectionEnd);
      }
    });
  },

  methods: {
    updateState: function updateState() {
      this.cachedSelectionStart = this.$refs.dateInputInstance.selectionStart;
      this.cachedSelectionEnd = this.$refs.dateInputInstance.selectionEnd;
      // when popup show, click body will call this, bug!
      var selectedValue = this.selectedValue;
      if (!this.$data.hasFocus) {
        this.setState({
          str: formatDate(selectedValue, this.format),
          invalid: false
        });
      }
    },
    onInputChange: function onInputChange(event) {
      var str = event.target.value;
      // https://github.com/vueComponent/ant-design-vue/issues/92
      if (isIE && !isIE9 && this.str === str) {
        return;
      }
      var _$props = this.$props,
          disabledDate = _$props.disabledDate,
          format = _$props.format,
          selectedValue = _$props.selectedValue;

      // 没有内容，合法并直接退出

      if (!str) {
        this.__emit('change', null);
        this.setState({
          invalid: false,
          str: str
        });
        return;
      }

      var parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }
      var value = this.value.clone();
      value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

      if (!value || disabledDate && disabledDate(value)) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }

      if (selectedValue !== value || selectedValue && value && !selectedValue.isSame(value)) {
        this.setState({
          str: str
        });
        this.__emit('change', value);
      }
    },
    onClear: function onClear() {
      this.setState({
        str: ''
      });
      this.__emit('clear', null);
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    },
    focus: function focus() {
      if (this.$refs.dateInputInstance) {
        this.$refs.dateInputInstance.focus();
      }
    },
    onFocus: function onFocus() {
      this.setState({ hasFocus: true });
    },
    onBlur: function onBlur() {
      this.setState(function (prevState, prevProps) {
        return {
          hasFocus: false,
          str: formatDate(prevProps.value, prevProps.format)
        };
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var invalid = this.invalid,
        str = this.str,
        locale = this.locale,
        prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabled = this.disabled,
        showClear = this.showClear;

    var clearIcon = getComponentFromProp(this, 'clearIcon');
    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [h(
        'div',
        { 'class': prefixCls + '-date-input-wrap' },
        [h('input', {
          ref: 'dateInputInstance',
          'class': prefixCls + '-input ' + invalidClass,
          domProps: {
            'value': str
          },
          attrs: {
            disabled: disabled,
            placeholder: placeholder
          },
          on: {
            'input': this.onInputChange,
            'focus': this.onFocus,
            'blur': this.onBlur
          }
        })]
      ), showClear ? h(
        'a',
        {
          attrs: { role: 'button', title: locale.clear },
          on: {
            'click': this.onClear
          }
        },
        [clearIcon || h('span', { 'class': prefixCls + '-clear-btn' })]
      ) : null]
    );
  }
};

export default DateInput;