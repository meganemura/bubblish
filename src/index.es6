var BubblesComponent = {
  view: () => {
    return m('div', {class: 'row'}, [
      vm.questions.map( (i) => {
        return [
          m('div', i),
          m('div', {class: 'col-xs-12'}, [
            '| ',
            vm.choices.map( (choice) => { return [
              m('input', {
                type: 'radio',
                name: `${i}`,
                value: `${choice}`,
                onclick: (event) => {
                  vm.select(event.target.name, event.target.value)
                },
                checked: (vm.answers[i - 1] === choice),
              }),
              ` ${choice} | `,
            ]}),
          ]),
        ]
      }),
    ])
  }
}


var vm = {
  default: {
    question_size: 5,
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
    if (!vm.answers) {
      vm.answers = [];
      for(var i = 1; i <= vm.question_size; i++) {
        vm.answers.push(0);
      }
    }
  },

  select: (name, value) => {
    var index = Number(name) - 1;
    vm.answers[index] = value;

    console.log(vm.answers);
    console.log(vm.querystring());
    console.log(m.route());
    //m.startComputation();
    m.route('/?' + vm.querystring());
    //m.redraw.strategy('none');
    //m.endComputation();
  },

  add_question: () => {
    vm.question_size += 1;
    for (var i = vm.questions.length; i < vm.question_size; i++) {
      vm.questions.push(i + 1);
    }
    for (var i = vm.answers.length; i < vm.question_size; i++) {
      vm.answers.push(0);
    };
  },
  remove_last_question: () => {
    vm.question_size -= 1;
    for (var i = vm.questions.length; i > vm.question_size; i--) {
      vm.questions.pop();
    }
    for (var i = vm.answers.length; i > vm.question_size; i--) {
      vm.answers.pop();
    };
  },

  querystring: () => {
    var parameters = {
      size: vm.question_size,
      choices: vm.choices.join(''),
      answers: vm.answers.join(''),
    };
    return m.route.buildQueryString(parameters);
  },
  save: () => {
    m.route('/?' + vm.querystring());
  },
  load: () => {
    console.log('vm.load()');
    vm.question_size = Number((m.route.param("size") || vm.default.question_size ));
    vm.answers       = (m.route.param("answers") || "00000").split("");
    vm.choices       = (m.route.param("choices") || "abcd").split("");
    vm.init();
  },
  // for dev
  top: () => {
    m.route('/');
  },
};

var obj = {};

var MenuComponent = {
  view: () => {
    return m('div', [
      m('span', {class: 'mega-octicon octicon-repo-push', style: 'padding: 8px', onclick: () => { vm.save() }}),
      m('span', {class: 'mega-octicon octicon-browser', style: 'padding: 8px', onclick: () => { vm.top() }}),
    ])
  }
}

var SettingsComponent = {
  view: () => {
    return m('div', [
      m('span', {class: 'mega-octicon octicon-plus', style: 'padding: 8px', onclick: () => { vm.add_question() }}),
      m('span', {class: 'mega-octicon octicon-dash', style: 'padding: 8px', onclick: () => { vm.remove_last_question() }}),
      m('h4', vm.question_size + ' questions'),
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
      m.component(MenuComponent),
      m.component(SettingsComponent),
      m.component(BubblesComponent),
    ];
  },
}

vm.init();

// m.mount(document.getElementById('root'), RootComponent);
m.route.mode = 'hash';
m.route(document.getElementById('root'), '/', {
  '/': RootComponent,
});
