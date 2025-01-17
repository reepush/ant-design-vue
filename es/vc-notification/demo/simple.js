import _extends from 'babel-runtime/helpers/extends';
/* eslint-disable no-console, no-unused-vars */
import '../assets/index.less';
import Notification from '../index';
var notification = null;
Notification.newInstance({
  maxCount: 10
}, function (n) {
  notification = n;
});

function simpleFn() {
  notification.notice({
    content: function content() {
      return h('span', ['simple show']);
    },
    onClose: function onClose() {
      console.log('simple close');
    }
  });
}

function durationFn() {
  notification.notice({
    content: function content(h) {
      return h('span', ['can not close...']);
    },
    duration: null
  });
}

function closableFn() {
  notification.notice({
    content: function content(h) {
      return h('span', ['closable']);
    },
    duration: null,
    onClose: function onClose() {
      console.log('closable close');
    },
    onClick: function onClick() {
      console.log('clicked!!!');
    },

    closable: true
  });
}

function close(key) {
  notification.removeNotice(key);
}

function manualClose() {
  var key = Date.now();
  notification.notice({
    content: function content(h) {
      return h('div', [h('p', ['click below button to close']), h(
        'button',
        {
          on: {
            'click': close.bind(null, key)
          }
        },
        ['close']
      )]);
    },
    key: key,
    duration: null
  });
}

var counter = 0;
var intervalKey = void 0;
function updatableFn() {
  if (counter !== 0) {
    return;
  }

  var key = 'updatable-notification';
  var initialProps = {
    content: 'Timer: ' + counter + 's',
    key: key,
    duration: null,
    closable: true,
    onClose: function onClose() {
      clearInterval(intervalKey);
      counter = 0;
    }
  };

  notification.notice(initialProps);
  intervalKey = setInterval(function () {
    notification.notice(_extends({}, initialProps, { content: 'Timer: ' + ++counter + 's' }));
  }, 1000);
}

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h(
      'button',
      {
        on: {
          'click': simpleFn
        }
      },
      ['simple show']
    ), h(
      'button',
      {
        on: {
          'click': durationFn
        }
      },
      ['duration=0']
    ), h(
      'button',
      {
        on: {
          'click': closableFn
        }
      },
      ['closable']
    ), h(
      'button',
      {
        on: {
          'click': manualClose
        }
      },
      ['controlled close']
    ), h(
      'button',
      {
        on: {
          'click': updatableFn
        }
      },
      ['updatable']
    )]);
  }
};