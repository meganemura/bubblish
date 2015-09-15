'use strict';

var BubblesComponent = {
  view: function view() {
    return m('div', [vm.questions.map(function (i) {
      return [m('div', { 'class': 'row choices' }, [m('span', { 'class': 'col-xs-2', style: 'font-weight: bold' }, i), vm.choices.map(function (choice) {
        return m('span', { 'class': 'col-xs-' + Math.floor(10 / vm.choices.length) }, [m('input', {
          type: 'radio',
          id: i + ':' + choice,
          name: '' + i,
          value: '' + choice,
          onclick: function onclick(event) {
            vm.select(event.target.name, event.target.value);
          },
          checked: vm.answers[i - 1] === choice
        }), m('br'), m('label', { 'for': i + ':' + choice }, '' + choice)]);
      })])];
    })]);
  }
};

var vm = {
  'default': {
    question_size: 5,
    choices: ['a', 'b', 'c', 'd']
  },

  init: function init() {
    console.log('vm.init');
    vm.question_size = vm.question_size || vm['default'].question_size;
    vm.choices = vm.choices || vm['default'].choices;

    vm.questions = [];
    for (var i = 1; i <= vm.question_size; i++) {
      vm.questions.push(i);
    }
    if (!vm.answers) {
      vm.answers = [];
      for (var i = 1; i <= vm.question_size; i++) {
        vm.answers.push(0);
      }
    }
  },

  select: function select(name, value) {
    var index = Number(name) - 1;
    vm.answers[index] = value;

    m.startComputation();
    m.route('/?' + vm.querystring());
    m.redraw.strategy('none');
    m.endComputation();
  },

  add_question: function add_question() {
    vm.question_size += 1;
    for (var i = vm.questions.length; i < vm.question_size; i++) {
      vm.questions.push(i + 1);
    }
    for (var i = vm.answers.length; i < vm.question_size; i++) {
      vm.answers.push(0);
    };
  },
  remove_last_question: function remove_last_question() {
    vm.question_size = Math.max(vm.question_size - 1, 0);
    for (var i = vm.questions.length; i > vm.question_size; i--) {
      vm.questions.pop();
    }
    for (var i = vm.answers.length; i > vm.question_size; i--) {
      vm.answers.pop();
    };
  },

  querystring: function querystring() {
    var parameters = {
      size: vm.question_size,
      choices: vm.choices.join(''),
      answers: vm.answers.join('')
    };
    return m.route.buildQueryString(parameters);
  },
  save: function save() {
    m.route('/?' + vm.querystring());
  },
  load: function load() {
    console.log('vm.load()');
    vm.question_size = Number(m.route.param("size") || vm['default'].question_size);
    vm.answers = (m.route.param("answers") || "00000").split("");
    vm.choices = (m.route.param("choices") || "abcd").split("");
    vm.init();
  },
  // for dev
  top: function top() {
    m.route('/');
  }
};

var HeaderComponent = {
  view: function view() {
    return m('h2', { 'class': 'title' }, 'Bubblish');
  }
};

var MenuComponent = {
  view: function view() {
    return m('div', [m('span', { 'class': 'octicon octicon-repo-push', style: 'padding: 8px', onclick: function onclick() {
        vm.save();
      } }, 'Save'), m('span', { 'class': 'octicon octicon-browser', style: 'padding: 8px', onclick: function onclick() {
        vm.top();
      } }, 'Clear')]);
  }
};

var SettingsComponent = {
  view: function view() {
    return m('div', [m('span', { 'class': 'octicon octicon-plus', style: 'padding: 8px', onclick: function onclick() {
        vm.add_question();
      } }, 'Add'), m('span', { 'class': 'octicon octicon-dash', style: 'padding: 8px', onclick: function onclick() {
        vm.remove_last_question();
      } }, 'Remove'), m('span', { 'class': 'text' }, vm.question_size + ' questions')]);
  }
};

var FooterComponent = {
  view: function view() {
    return m('div', [m('span', { 'class': 'octicon octicon-repo-push', style: 'padding: 8px', onclick: function onclick() {
        vm.save();
      } }, 'Save')]);
  }
};

var RootComponent = {
  controller: function controller() {
    console.log('RootComponent.controller');
    vm.load();
  },
  view: function view() {
    return [m.component(HeaderComponent), m.component(MenuComponent), m.component(SettingsComponent), m.component(BubblesComponent), m.component(FooterComponent)];
  }
};

vm.init();

// m.mount(document.getElementById('root'), RootComponent);
m.route.mode = 'hash';
m.route(document.getElementById('root'), '/', {
  '/': RootComponent
});