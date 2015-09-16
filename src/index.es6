var BubblesComponent = {
  view: () => {
    return m('div', [
      vm.questions.map( (i) => {
        return [
          m('div', {class: 'row choices'}, [
            m('span', {class: 'col-xs-2', style: 'font-weight: bold'}, i),
            vm.choices.map( (choice) => {
              return m('label', {class: `choice col-xs-${Math.floor(10 / vm.choices.length)}`, for: `${i}:${choice}`, align: 'center'}, [
                m('input', {
                  type: 'radio',
                  id: `${i}:${choice}`,
                  name: `${i}`,
                  value: `${choice}`,
                  onclick: (event) => {
                    vm.select(event.target.name, event.target.value)
                  },
                  checked: (vm.selections[i - 1] === choice),
                }),
                m('br'),
                `${choice}`,
              ])
            }),
          ]),
        ]
      }),
    ])
  }
}


var vm = {
  default: {
    question_size: 20,
    choices: ['a', 'b', 'c', 'd'],
  },

  init: () => {
    console.log('vm.init');
    vm.question_size = vm.question_size || vm.default.question_size;
    vm.choices = vm.choices || vm.default.choices;

    vm.questions = [];
    for(var i = 1; i <= vm.question_size; i++) {
      vm.questions.push(i);
    }
    if (!vm.selections) {
      vm.selections = [];
      for(var i = 1; i <= vm.question_size; i++) {
        vm.selections.push(0);
      }
    }
  },

  select: (name, value) => {
    var index = Number(name) - 1;
    vm.selections[index] = value;

    m.startComputation();
    m.route('/?' + vm.querystring());
    m.redraw.strategy('none');
    m.endComputation();
  },

  add_question: () => {
    vm.question_size += 1;
    for (var i = vm.questions.length; i < vm.question_size; i++) {
      vm.questions.push(i + 1);
    }
    for (var i = vm.selections.length; i < vm.question_size; i++) {
      vm.selections.push(0);
    };
  },
  remove_last_question: () => {
    vm.question_size = Math.max(vm.question_size - 1, 0);
    for (var i = vm.questions.length; i > vm.question_size; i--) {
      vm.questions.pop();
    }
    for (var i = vm.selections.length; i > vm.question_size; i--) {
      vm.selections.pop();
    };
  },

  querystring: () => {
    var parameters = {
      size: vm.question_size,
      choices: vm.choices.join(''),
      selections: vm.selections.join(''),
    };
    return m.route.buildQueryString(parameters);
  },
  save: () => {
    m.route('/?' + vm.querystring());
  },
  load: () => {
    console.log('vm.load()');
    vm.question_size = Number((m.route.param("size") || vm.default.question_size ));
    vm.selections    = (m.route.param("selections") || "00000").split("");
    vm.choices       = (m.route.param("choices") || "abcd").split("");
    vm.init();
  },
  // for dev
  top: () => {
    m.route('/');
  },
};

var HeaderComponent = {
  view: () => {
    return m('h2', {class: 'title'},
             m('a', {href: '.', style: 'text-decoration: none; color: black' }, 'Bubblish'))
  }
}

var MenuComponent = {
  view: () => {
    return m('div', [
      m('span', {class: 'button octicon octicon-repo-push', style: 'padding: 8px', onclick: () => { vm.save() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Save')),
      m('a', {href: '.'}, [
        m('span', {class: 'button octicon octicon-browser', style: 'padding: 8px'},
        m('span', {class: 'text', style: 'padding: 8px'}, 'Clear')),
      ]),
    ])
  }
}

var SettingsComponent = {
  view: () => {
    return m('div', {class: 'text'}, [
      m('span', 'Questions:'),
      m('span', {class: 'button octicon octicon-plus', style: 'padding: 8px', onclick: () => { vm.add_question() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Add')),
      m('span', {class: 'button octicon octicon-dash', style: 'padding: 8px', onclick: () => { vm.remove_last_question() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Remove')),
      m('span', `(${vm.question_size} questions)`),
      m('br'),
      m('span', 'View:'),
      m('span', {class: 'button octicon octicon-file-text', style: 'padding: 8px', onclick: () => { vm.top() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Selection')),
      m('span', {class: 'button octicon octicon-file-zip', style: 'padding: 8px', onclick: () => { vm.top() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Answer')),
    ])
  }
}

var FooterComponent = {
  view: () => {
    return m('div', [
      m('span', {class: 'button octicon octicon-repo-push', style: 'padding: 8px', onclick: () => { vm.save() }}, m('span', {class: 'text', style: 'padding: 8px'}, 'Save')),
      m('p', {align: 'right', class: 'button'}, [
        m('a', {href: 'https://github.com/meganemura/bubblish', style: 'text-decoration: none; color: black'}, [
          m('span', { 'class': 'octicon octicon-repo', style: 'padding: 8px' }),
          'meganemura/bubblish',
        ]),
      ]),
    ])
  }
}

var RootComponent = {
  controller: () => {
    console.log('RootComponent.controller');
    vm.load();
  },
  view: () => {
    return [
      m.component(HeaderComponent),
      m('hr'),
      m.component(MenuComponent),
      m.component(SettingsComponent),
      m('hr'),
      m.component(BubblesComponent),
      m('hr'),
      m.component(FooterComponent),
    ];
  },
}

vm.init();

// m.mount(document.getElementById('root'), RootComponent);
m.route.mode = 'hash';
m.route(document.getElementById('root'), '/', {
  '/': RootComponent,
});
