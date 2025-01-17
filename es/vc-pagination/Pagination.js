import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import Pager from './Pager';
import Options from './Options';
import LOCALE from './locale/zh_CN';
import KEYCODE from './KeyCode';

function noop() {}

// 是否是正整数
function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function defaultItemRender(page, type, element) {
  return element;
}

function calculatePage(p, state, props) {
  var pageSize = p;
  if (typeof pageSize === 'undefined') {
    pageSize = state.statePageSize;
  }
  return Math.floor((props.total - 1) / pageSize) + 1;
}

export default {
  name: 'Pagination',
  mixins: [BaseMixin],
  model: {
    prop: 'current',
    event: 'change.current'
  },
  props: {
    prefixCls: PropTypes.string.def('rc-pagination'),
    selectPrefixCls: PropTypes.string.def('rc-select'),
    current: PropTypes.number,
    defaultCurrent: PropTypes.number.def(1),
    total: PropTypes.number.def(0),
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number.def(10),
    hideOnSinglePage: PropTypes.bool.def(false),
    showSizeChanger: PropTypes.bool.def(false),
    showLessItems: PropTypes.bool.def(false),
    // showSizeChange: PropTypes.func.def(noop),
    selectComponentClass: PropTypes.any,
    showPrevNextJumpers: PropTypes.bool.def(true),
    showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    showTitle: PropTypes.bool.def(true),
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    buildOptionText: PropTypes.func,
    showTotal: PropTypes.func,
    simple: PropTypes.bool,
    locale: PropTypes.object.def(LOCALE),
    itemRender: PropTypes.func.def(defaultItemRender),
    prevIcon: PropTypes.any,
    nextIcon: PropTypes.any,
    jumpPrevIcon: PropTypes.any,
    jumpNextIcon: PropTypes.any
  },
  data: function data() {
    var hasOnChange = this.onChange !== noop;
    var hasCurrent = hasProp(this, 'current');
    if (hasCurrent && !hasOnChange) {
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'); // eslint-disable-line
    }
    var current = this.defaultCurrent;
    if (hasCurrent) {
      current = this.current;
    }

    var pageSize = this.defaultPageSize;
    if (hasProp(this, 'pageSize')) {
      pageSize = this.pageSize;
    }

    return {
      stateCurrent: current,
      stateCurrentInputValue: current,
      statePageSize: pageSize
    };
  },

  watch: {
    current: function current(val) {
      this.setState({
        stateCurrent: val,
        stateCurrentInputValue: val
      });
    },
    pageSize: function pageSize(val) {
      var newState = {};
      var current = this.stateCurrent;
      var newCurrent = calculatePage(val, this.$data, this.$props);
      current = current > newCurrent ? newCurrent : current;
      if (!hasProp(this, 'current')) {
        newState.stateCurrent = current;
        newState.stateCurrentInputValue = current;
      }
      newState.statePageSize = val;
      this.setState(newState);
    },
    stateCurrent: function stateCurrent(val, oldValue) {
      var _this = this;

      // When current page change, fix focused style of prev item
      // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
      this.$nextTick(function () {
        if (_this.$refs.paginationNode) {
          var lastCurrentNode = _this.$refs.paginationNode.querySelector('.' + _this.prefixCls + '-item-' + oldValue);
          if (lastCurrentNode && document.activeElement === lastCurrentNode) {
            lastCurrentNode.blur();
          }
        }
      });
    }
  },
  methods: {
    getJumpPrevPage: function getJumpPrevPage() {
      return Math.max(1, this.stateCurrent - (this.showLessItems ? 3 : 5));
    },
    getJumpNextPage: function getJumpNextPage() {
      return Math.min(calculatePage(undefined, this.$data, this.$props), this.stateCurrent + (this.showLessItems ? 3 : 5));
    },
    getItemIcon: function getItemIcon(icon) {
      var h = this.$createElement;
      var prefixCls = this.$props.prefixCls;

      var iconNode = getComponentFromProp(this, icon, this.$props) || h('a', { 'class': prefixCls + '-item-link' });
      return iconNode;
    },
    isValid: function isValid(page) {
      return isInteger(page) && page >= 1 && page !== this.stateCurrent;
    },

    // calculatePage (p) {
    //   let pageSize = p
    //   if (typeof pageSize === 'undefined') {
    //     pageSize = this.statePageSize
    //   }
    //   return Math.floor((this.total - 1) / pageSize) + 1
    // },
    handleKeyDown: function handleKeyDown(event) {
      if (event.keyCode === KEYCODE.ARROW_UP || event.keyCode === KEYCODE.ARROW_DOWN) {
        event.preventDefault();
      }
    },
    handleKeyUp: function handleKeyUp(event) {
      var inputValue = event.target.value;
      var stateCurrentInputValue = this.stateCurrentInputValue;
      var value = void 0;

      if (inputValue === '') {
        value = inputValue;
      } else if (isNaN(Number(inputValue))) {
        value = stateCurrentInputValue;
      } else {
        value = Number(inputValue);
      }

      if (value !== stateCurrentInputValue) {
        this.setState({
          stateCurrentInputValue: value
        });
      }

      if (event.keyCode === KEYCODE.ENTER) {
        this.handleChange(value);
      } else if (event.keyCode === KEYCODE.ARROW_UP) {
        this.handleChange(value - 1);
      } else if (event.keyCode === KEYCODE.ARROW_DOWN) {
        this.handleChange(value + 1);
      }
    },
    changePageSize: function changePageSize(size) {
      var current = this.stateCurrent;
      var preCurrent = current;
      var newCurrent = calculatePage(size, this.$data, this.$props);
      current = current > newCurrent ? newCurrent : current;
      // fix the issue:
      // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.
      if (newCurrent === 0) {
        current = this.stateCurrent;
      }
      if (typeof size === 'number') {
        if (!hasProp(this, 'pageSize')) {
          this.setState({
            statePageSize: size
          });
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: current,
            stateCurrentInputValue: current
          });
        }
      }
      this.$emit('update:pageSize', size);
      this.$emit('showSizeChange', current, size);
      if (current !== preCurrent) {
        this.$emit('change.current', current, size);
      }
    },
    handleChange: function handleChange(p) {
      var page = p;
      if (this.isValid(page)) {
        var currentPage = calculatePage(undefined, this.$data, this.$props);
        if (page > currentPage) {
          page = currentPage;
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: page,
            stateCurrentInputValue: page
          });
        }
        // this.$emit('input', page)
        this.$emit('change', page, this.statePageSize);
        this.$emit('change.current', page, this.statePageSize);
        return page;
      }
      return this.stateCurrent;
    },
    prev: function prev() {
      if (this.hasPrev()) {
        this.handleChange(this.stateCurrent - 1);
      }
    },
    next: function next() {
      if (this.hasNext()) {
        this.handleChange(this.stateCurrent + 1);
      }
    },
    jumpPrev: function jumpPrev() {
      this.handleChange(this.getJumpPrevPage());
    },
    jumpNext: function jumpNext() {
      this.handleChange(this.getJumpNextPage());
    },
    hasPrev: function hasPrev() {
      return this.stateCurrent > 1;
    },
    hasNext: function hasNext() {
      return this.stateCurrent < calculatePage(undefined, this.$data, this.$props);
    },
    runIfEnter: function runIfEnter(event, callback) {
      if (event.key === 'Enter' || event.charCode === 13) {
        for (var _len = arguments.length, restParams = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          restParams[_key - 2] = arguments[_key];
        }

        callback.apply(undefined, _toConsumableArray(restParams));
      }
    },
    runIfEnterPrev: function runIfEnterPrev(event) {
      this.runIfEnter(event, this.prev);
    },
    runIfEnterNext: function runIfEnterNext(event) {
      this.runIfEnter(event, this.next);
    },
    runIfEnterJumpPrev: function runIfEnterJumpPrev(event) {
      this.runIfEnter(event, this.jumpPrev);
    },
    runIfEnterJumpNext: function runIfEnterJumpNext(event) {
      this.runIfEnter(event, this.jumpNext);
    },
    handleGoTO: function handleGoTO(event) {
      if (event.keyCode === KEYCODE.ENTER || event.type === 'click') {
        this.handleChange(this.stateCurrentInputValue);
      }
    }
  },
  render: function render() {
    var h = arguments[0];

    // When hideOnSinglePage is true and there is only 1 page, hide the pager
    if (this.hideOnSinglePage === true && this.total <= this.statePageSize) {
      return null;
    }
    var props = this.$props;
    var locale = this.locale;

    var prefixCls = this.prefixCls;
    var allPages = calculatePage(undefined, this.$data, this.$props);
    var pagerList = [];
    var jumpPrev = null;
    var jumpNext = null;
    var firstPager = null;
    var lastPager = null;
    var gotoButton = null;
    var goButton = this.showQuickJumper && this.showQuickJumper.goButton;
    var pageBufferSize = this.showLessItems ? 1 : 2;
    var stateCurrent = this.stateCurrent,
        statePageSize = this.statePageSize;

    var prevPage = stateCurrent - 1 > 0 ? stateCurrent - 1 : 0;
    var nextPage = stateCurrent + 1 < allPages ? stateCurrent + 1 : allPages;

    if (this.simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = h(
            'button',
            {
              attrs: { type: 'button' },
              on: {
                'click': this.handleGoTO,
                'keyup': this.handleGoTO
              }
            },
            [locale.jump_to_confirm]
          );
        } else {
          gotoButton = h(
            'span',
            {
              on: {
                'click': this.handleGoTO,
                'keyup': this.handleGoTO
              }
            },
            [goButton]
          );
        }
        gotoButton = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? '' + locale.jump_to + this.stateCurrent + '/' + allPages : null
            },
            'class': prefixCls + '-simple-pager'
          },
          [gotoButton]
        );
      }
      var hasPrev = this.hasPrev();
      var hasNext = this.hasNext();
      return h(
        'ul',
        { 'class': prefixCls + ' ' + prefixCls + '-simple' },
        [h(
          'li',
          {
            attrs: {
              title: this.showTitle ? locale.prev_page : null,

              tabIndex: hasPrev ? 0 : null,

              'aria-disabled': !this.hasPrev()
            },
            on: {
              'click': this.prev,
              'keypress': this.runIfEnterPrev
            },

            'class': (hasPrev ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev' },
          [this.itemRender(prevPage, 'prev', this.getItemIcon('prevIcon'))]
        ), h(
          'li',
          {
            attrs: {
              title: this.showTitle ? stateCurrent + '/' + allPages : null
            },
            'class': prefixCls + '-simple-pager'
          },
          [h('input', {
            attrs: {
              type: 'text',

              size: '3'
            },
            domProps: {
              'value': this.stateCurrentInputValue
            },
            on: {
              'keydown': this.handleKeyDown,
              'keyup': this.handleKeyUp,
              'input': this.handleKeyUp
            }
          }), h(
            'span',
            { 'class': prefixCls + '-slash' },
            ['\uFF0F']
          ), allPages]
        ), h(
          'li',
          {
            attrs: {
              title: this.showTitle ? locale.next_page : null,

              tabIndex: this.hasNext ? 0 : null,

              'aria-disabled': !this.hasNext()
            },
            on: {
              'click': this.next,
              'keypress': this.runIfEnterNext
            },

            'class': (hasNext ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next' },
          [this.itemRender(nextPage, 'next', this.getItemIcon('nextIcon'))]
        ), gotoButton]
      );
    }
    if (allPages <= 5 + pageBufferSize * 2) {
      var pagerProps = {
        props: {
          locale: locale,
          rootPrefixCls: prefixCls,
          showTitle: props.showTitle,
          itemRender: props.itemRender
        },
        on: {
          click: this.handleChange,
          keypress: this.runIfEnter
        }
      };
      if (!allPages) {
        pagerList.push(h(Pager, _mergeJSXProps([pagerProps, { key: 'noPager', attrs: { page: allPages },
          'class': prefixCls + '-disabled' }])));
      }
      for (var i = 1; i <= allPages; i++) {
        var active = stateCurrent === i;
        pagerList.push(h(Pager, _mergeJSXProps([pagerProps, { key: i, attrs: { page: i, active: active }
        }])));
      }
    } else {
      var prevItemTitle = this.showLessItems ? locale.prev_3 : locale.prev_5;
      var nextItemTitle = this.showLessItems ? locale.next_3 : locale.next_5;
      if (this.showPrevNextJumpers) {
        var jumpPrevClassString = prefixCls + '-jump-prev';
        if (props.jumpPrevIcon) {
          jumpPrevClassString += ' ' + prefixCls + '-jump-prev-custom-icon';
        }
        jumpPrev = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? prevItemTitle : null,

              tabIndex: '0'
            },
            key: 'prev',
            on: {
              'click': this.jumpPrev,
              'keypress': this.runIfEnterJumpPrev
            },

            'class': jumpPrevClassString
          },
          [this.itemRender(this.getJumpPrevPage(), 'jump-prev', this.getItemIcon('jumpPrevIcon'))]
        );
        var jumpNextClassString = prefixCls + '-jump-next';
        if (props.jumpNextIcon) {
          jumpNextClassString += ' ' + prefixCls + '-jump-next-custom-icon';
        }
        jumpNext = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? nextItemTitle : null,

              tabIndex: '0'
            },
            key: 'next', on: {
              'click': this.jumpNext,
              'keypress': this.runIfEnterJumpNext
            },

            'class': jumpNextClassString
          },
          [this.itemRender(this.getJumpNextPage(), 'jump-next', this.getItemIcon('jumpNextIcon'))]
        );
      }

      lastPager = h(Pager, {
        attrs: {
          locale: locale,
          last: true,
          rootPrefixCls: prefixCls,

          page: allPages,
          active: false,
          showTitle: this.showTitle,
          itemRender: this.itemRender
        },
        on: {
          'click': this.handleChange,
          'keypress': this.runIfEnter
        },

        key: allPages });
      firstPager = h(Pager, {
        attrs: {
          locale: locale,
          rootPrefixCls: prefixCls,

          page: 1,
          active: false,
          showTitle: this.showTitle,
          itemRender: this.itemRender
        },
        on: {
          'click': this.handleChange,
          'keypress': this.runIfEnter
        },

        key: 1 });

      var left = Math.max(1, stateCurrent - pageBufferSize);
      var right = Math.min(stateCurrent + pageBufferSize, allPages);

      if (stateCurrent - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2;
      }

      if (allPages - stateCurrent <= pageBufferSize) {
        left = allPages - pageBufferSize * 2;
      }

      for (var _i = left; _i <= right; _i++) {
        var _active = stateCurrent === _i;
        pagerList.push(h(Pager, {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: _i,
            active: _active,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: _i }));
      }

      if (stateCurrent - 1 >= pageBufferSize * 2 && stateCurrent !== 1 + 2) {
        pagerList[0] = h(Pager, {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: left,

            active: false,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: left, 'class': prefixCls + '-item-after-jump-prev' });
        pagerList.unshift(jumpPrev);
      }
      if (allPages - stateCurrent >= pageBufferSize * 2 && stateCurrent !== allPages - 2) {
        pagerList[pagerList.length - 1] = h(Pager, {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: right,

            active: false,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: right, 'class': prefixCls + '-item-before-jump-next' });
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    var totalText = null;

    if (this.showTotal) {
      totalText = h(
        'li',
        { 'class': prefixCls + '-total-text' },
        [this.showTotal(this.total, [(stateCurrent - 1) * statePageSize + 1, stateCurrent * statePageSize > this.total ? this.total : stateCurrent * statePageSize])]
      );
    }
    var prevDisabled = !this.hasPrev() || !allPages;
    var nextDisabled = !this.hasNext() || !allPages;
    var buildOptionText = this.buildOptionText || this.$scopedSlots.buildOptionText;
    return h(
      'ul',
      { 'class': '' + prefixCls, attrs: { unselectable: 'unselectable' },
        ref: 'paginationNode' },
      [totalText, h(
        'li',
        {
          attrs: {
            title: this.showTitle ? locale.prev_page : null,

            tabIndex: prevDisabled ? null : 0,

            'aria-disabled': prevDisabled
          },
          on: {
            'click': this.prev,
            'keypress': this.runIfEnterPrev
          },

          'class': (!prevDisabled ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev' },
        [this.itemRender(prevPage, 'prev', this.getItemIcon('prevIcon'))]
      ), pagerList, h(
        'li',
        {
          attrs: {
            title: this.showTitle ? locale.next_page : null,

            tabIndex: nextDisabled ? null : 0,

            'aria-disabled': nextDisabled
          },
          on: {
            'click': this.next,
            'keypress': this.runIfEnterNext
          },

          'class': (!nextDisabled ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next' },
        [this.itemRender(nextPage, 'next', this.getItemIcon('nextIcon'))]
      ), h(Options, {
        attrs: {
          locale: locale,
          rootPrefixCls: prefixCls,
          selectComponentClass: this.selectComponentClass,
          selectPrefixCls: this.selectPrefixCls,
          changeSize: this.showSizeChanger ? this.changePageSize : null,
          current: stateCurrent,
          pageSize: statePageSize,
          pageSizeOptions: this.pageSizeOptions,
          buildOptionText: buildOptionText || null,
          quickGo: this.showQuickJumper ? this.handleChange : null,
          goButton: goButton
        }
      })]
    );
  }
};