'use strict';

var BubblesComponent = {
  view: function view() {
    return m('div', { 'class': vm.mode() }, [vm.questions.map(function (i) {
      return [m('div', { 'class': 'row choices' }, [m('span', { 'class': 'col-xs-2 ' + BubblesComponent.ratingClass(i), style: 'font-weight: bold' }, [i, (function () {
        if (vm.mode() === 'answers') {
          return [m('br'), m('span', { style: 'font-weight: normal; font-size: smaller' }, vm['selections'][i - 1])];
        }
      })()]), vm.choices.map(function (choice) {
        return m('label', { 'class': 'choice col-xs-' + Math.floor(10 / vm.choices.length), 'for': i + ':' + choice, align: 'center' }, [m('input', {
          type: 'radio',
          id: i + ':' + choice,
          name: '' + i,
          value: '' + choice,
          onclick: function onclick(event) {
            vm.select(event.target.name, event.target.value);
          },
          checked: vm[vm.mode()][i - 1] === choice
        }), m('br'), '' + choice]);
      })])];
    })]);
  },
  ratingClass: function ratingClass(i) {
    var selection = vm['selections'][i - 1];
    var answer = vm['answers'][i - 1];

    // console.log(`${i}: ${selection}:${answer}`);
    if (!selection && !answer) {
      return '';
    } else if (!selection && answer) {
      return 'rateReady';
    } else if (selection == answer) {
      return 'rateCorrect';
    } else {
      return 'rateIncorrect';
    }
  }
};

var vm = {
  'default': {
    question_size: 20,
    choices: ['a', 'b', 'c', 'd']
  },

  init: function init() {
    console.log('vm.init');
    vm.question_size = vm.question_size || vm['default'].question_size;
    vm.choices = vm.choices || vm['default'].choices;
    vm.mode = m.prop('selections');
    vm.ratingType = m.prop('immediately');
    vm.caption = m.prop('');

    vm.questions = [];
    for (var i = 1; i <= vm.question_size; i++) {
      vm.questions.push(i);
    }

    vm.selections = [];
    vm.answers = [];
  },

  select: function select(name, value) {
    var index = Number(name) - 1;

    vm[vm.mode()][index] = value;
    for (var i = 0; i < index; i++) {
      // Fill array
      vm[vm.mode()][i] = vm[vm.mode()][i] || '0';
    }

    // vm.save();

    if (vm.mode() === 'answers' && index == vm.question_size - 1) {
      vm.add_question();
    }
  },

  add_question: function add_question() {
    vm.question_size += 1;
    for (var i = vm.questions.length; i < vm.question_size; i++) {
      vm.questions.push(i + 1);
    }
    for (var i = vm.selections.length; i < vm.question_size; i++) {
      vm.selections.push(0);
    };
  },
  remove_last_question: function remove_last_question() {
    vm.question_size = Math.max(vm.question_size - 1, 0);
    for (var i = vm.questions.length; i > vm.question_size; i--) {
      vm.questions.pop();
    }
    for (var i = vm.selections.length; i > vm.question_size; i--) {
      vm.selections.pop();
    };
  },

  clear_selections: function clear_selections() {
    vm.selections = [];
  },

  querystring: function querystring() {
    console.log('Mode: ' + vm.mode());
    console.log(vm.selections);
    console.log(vm.answers);
    var parameters = {
      size: vm.question_size,
      choices: vm.choices.join(''),
      selections: vm.selections.join(''),
      answers: vm.answers.join(''),
      caption: vm.caption()
    };
    return m.route.buildQueryString(parameters);
  },
  save: function save() {
    // // https://github.com/lhorie/mithril.js/issues/790#issuecomment-139310226
    // m.startComputation();
    // m.route('/?' + vm.querystring());
    // m.redraw.strategy('none');
    // m.endComputation();
    m.route('/?' + vm.querystring());
  },
  load: function load() {
    console.log('vm.load()');
    vm.question_size = Number(m.route.param("size") || vm['default'].question_size);
    vm.selections = m.route.param('selections') && m.route.param('selections').split('') || [];
    vm.answers = m.route.param('answers') && m.route.param('answers').split('') || [];
    vm.choices = (m.route.param("choices") || "abcd").split("");
    vm.caption(m.route.param('caption') || '');
  },
  // for dev
  top: function top() {
    m.route('/');
  }
};

var HeaderComponent = {
  view: function view() {
    return m('h2', { 'class': 'title' }, m('a', { href: '.', style: 'text-decoration: none; color: black' }, 'Bubblish'));
  }
};

var MenuComponent = {
  view: function view() {
    return m('div', [m('span', { 'class': 'octicon octicon-pencil', style: 'padding: 8px' }), m('input', {
      value: vm.caption(),
      onchange: m.withAttr('value', vm.caption),
      style: 'margin: 0px 0px 0px 4px; padding: 5px; width: 80%',
      placeholder: 'Memo'
    }), m('br'), m('span', { 'class': 'button octicon octicon-repo-push', style: 'padding: 8px', onclick: function onclick() {
        vm.save();
      } }, [m('span', { 'class': 'text', style: 'padding: 8px' }, 'Save')]), m('a', { style: 'text-decoration: none; color: black', onclick: function onclick() {
        vm.clear_selections();
      } }, [m('span', { 'class': 'button octicon octicon-browser', style: 'padding: 8px' }, [m('span', { 'class': 'text', style: 'padding: 8px' }, 'Clear Selection')])])]);
  }
};

var SettingsComponent = {
  view: function view() {
    return m('div', { 'class': 'text' }, [m('span', 'Questions:'), m('span', { 'class': 'button octicon octicon-plus', style: 'padding: 8px', onclick: function onclick() {
        vm.add_question();
      } }, m('span', { 'class': 'text', style: 'padding: 8px' }, 'Add')), m('span', { 'class': 'button octicon octicon-dash', style: 'padding: 8px', onclick: function onclick() {
        vm.remove_last_question();
      } }, m('span', { 'class': 'text', style: 'padding: 8px' }, 'Remove')), m('span', '(' + vm.question_size + ' questions)'), m('br'), m('span', 'View: '), m('span', { 'class': 'button octicon octicon-file-text', style: 'padding: 8px', onclick: function onclick() {
        vm.mode('selections');
      } }, [m('span', { 'class': 'text', style: SettingsComponent.styleFor('selections') }, 'Selection')]), m('span', { 'class': 'button octicon octicon-file-zip', style: 'padding: 8px', onclick: function onclick() {
        vm.mode('answers');
      } }, [m('span', { 'class': 'text', style: SettingsComponent.styleFor('answers') }, 'Answer')]), m('br'), m('span', 'Rating: '), m('span', { 'class': 'button octicon octicon-gist-secret', style: 'padding: 8px', onclick: function onclick() {
        vm.ratingType('immediately');vm.load();
      } }, [m('span', { 'class': 'text', style: 'padding: 8px' }, 'immediately')])]);
  },
  styleFor: function styleFor(mode) {
    var style = 'padding: 8px;';
    if (vm.mode() === mode) {
      style += 'text-decoration: underline; font-weight: bold';
    }
    return style;
  }
};

var FooterComponent = {
  view: function view() {
    return m('div', [m('span', { 'class': 'button octicon octicon-repo-push', style: 'padding: 8px', onclick: function onclick() {
        vm.save();
      } }, m('span', { 'class': 'text', style: 'padding: 8px' }, 'Save')), m('p', { align: 'right', 'class': 'button' }, [m('a', { href: 'https://github.com/meganemura/bubblish', style: 'text-decoration: none; color: black' }, [m('span', { 'class': 'octicon octicon-repo', style: 'padding: 8px' }), 'meganemura/bubblish'])])]);
  }
};

var RootComponent = {
  controller: function controller() {
    console.log('RootComponent.controller');
    vm.load();
  },
  view: function view() {
    return [m.component(HeaderComponent), m('hr'), m.component(MenuComponent), m.component(SettingsComponent), m('hr'), m.component(BubblesComponent), m('hr'), m.component(FooterComponent)];
  }
};

vm.init();

// m.mount(document.getElementById('root'), RootComponent);
m.route.mode = 'hash';
m.route(document.getElementById('root'), '/', {
  '/': RootComponent
});