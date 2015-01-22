// todomvc
// https://github.com/tastejs/todomvc

var Collection  = Espresso.Collection
var Controller  = Espresso.Controller
var List        = Espresso.List
var Repos       = Espresso.List
var ENTER_KEY   = 13;
var ESC_KEY     = 27;

var ToDoStore = Collection.extend({
    init: function() {
        this.clearCompleted = this.clearCompleted.bind(this);
        this.add = this.add.bind(this);
        this.reset(JSON.parse(localStorage.getItem('todo')));
        this.addListener('change', this.save.bind(this));
    },
    add: function(txt) {
        this.push({ done: false, id: this.count(), text: txt })
    },
    toggle: function(id, done) {
        this.set({ id: id, done: done })
    },
    toggleAll: function(done) {
        this.forEach(function(v, i) {
            if (v.done !== done) {
                this.set(i, { done: done, text: v.text, id: v.id })
            }
        }.bind(this))
    },
    clearCompleted: function() {
        this.set(this.active());
    },
    completed: function() {
        return this.filter(function(v) { return v.done });
    },
    active: function() {
        return this.filter(function(v) { return !v.done });
    },
    all: function() {
        return this.toArray();
    },
    save: function() {
        console.log(this.toArray())
        localStorage.setItem('todo', JSON.stringify(this.toArray()));
    }
});

var ToDoItem = Controller.extend({
    init: function() {
        this.listenTo(window, 'click', function(e) {
            if (this.model.editing && e.target !== this.ref.input) {
                this.set({ editing: false });
            }
        });
    },
    edit: function() {
        this.ref.input.focus();
        this.set({ editing: true });
    },
    destroy: function() {
        store.remove({ id: this.model.id });
    },
    key: function(e) {
        if (e.which === ENTER_KEY) {
            this.set({ editing: false });
            store.set({ id: this.model.id, text: e.target.value });
        }
        else if (e.which === ESC_KEY) {
            this.set({ editing: false });
            e.target.value = this.model.text;
        }
    },
    toggle: function(e) {
        store.toggle(this.model.id, e.target.checked);
    },
    render: function() {
        return {
            view: { classList: { editing: this.model.editing, completed: this.model.done } },
            label: { ondblclick: this.edit, text: this.model.text },
            destroy: { onclick: this.destroy },
            input: { value: this.model.text, onkeydown: this.key },
            toggle: { onclick: this.toggle, checked: this.model.done }
        }
    }
});

var wrongImg = function(img) {
  return img.href.indexOf('travis') >= 0 
  || img.href.indexOf('badge') >= 0;
}

var generateImgs = function(readme) {
  if (!readme || !readme.infos) return "";
  var s = "";
  var infos = readme.infos;
  for (var i = infos.references.length; i--; ) {
    var ref = infos.references[i];
    if (ref.image && !wrongImg(ref))
     s+= '<img src="' + ref.href + '" width="50">';
  }
  return s;
}

var generateCodes = function(readme) {
  if (!readme || !readme.infos) return "";
  var s = "";
  var infos = readme.infos;
  for (var i = infos.codes.length; i--; ) {
    var ref = infos.codes[i];
     s+= '<div>' + marked('```javascript\n'+ref.code+'```') + '"</div>';
  }
  return s;
}

var RepoItem = Controller.extend({
    init: function() {
    },
    code: function() {
      this.set({ showCode: !this.model.showCode });
    },
    hasNoCode: function() {
      return !this.model.README || (this.model.README.infos && this.model.README.infos.codes.length===0);
    },
    key: function(e) {
    },
    toggle: function(e) {
    },
    render: function() {
        return {
            view: { classList: { editing: this.model.editing, completed: this.model.done } },
            title: {text: this.model.full_name, href: this.model.html_url},
            date: {text: moment(this.model.created_at).fromNow()},
            description: {text: this.model.description, href: this.model.html_url, title: this.model.full_name},
            user: {href: this.model.html_url, title: this.model.owner ? this.model.owner.login : ""},
            user_info: {href: this.model.owner ? this.model.owner.html_url : "", text: this.model.owner ? this.model.owner.login : ""},
            user_avatar: {src: this.model.owner ? this.model.owner.avatar_url : ""},
            images: { html: generateImgs(this.model.README) },
            codes: { html: generateCodes(this.model.README), classList:{"u-hide": !this.model.showCode} },
            code: { onclick: this.code, classList:{"u-hide": this.hasNoCode()} },
            codeTxt: { onclick: this.code, classList:{"u-hide": this.hasNoCode()} },
            watchers: { text: " " + this.model.watchers },
            stars: { text: " " + this.model.stargazers_count },
            forks: { text: " " + this.model.forks_count },
            issues: { text: " " + this.model.open_issues }
        }
    }
});

var App = Controller.extend({
    init: function() {
        this.model.filter = window.location.hash.replace('#/', '') || 'all';
        if (this.model.filter === 'active') this.filter({ target: this.ref.active });
        if (this.model.filter === 'completed') this.filter({ target: this.ref.completed });
        
        this.todos = []
        var self = this;
        
        function status(response) {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
          } else {
            return Promise.reject(new Error(response.statusText))
          }
        }
        
        function json(response) {
          return response.json()
        }
        
        fetch('/today')
        .then(status)
        .then(json)
        .then(function(json) {
          self.repos.set(json);
        }).catch(function(ex) {
          console.log('parsing failed', ex);
        })

        this.list = new List(ToDoItem);
        this.repos = new Repos(RepoItem);
        this.listenTo(store, 'change', this.render);
    },
    filter: function(e) {
        if (e === undefined) return 
        if (e.target.nodeName === 'A') {
            document.querySelector('a.selected').classList.remove('selected');
            e.target.classList.add('selected')
            this.model.set({ filter: e.target.innerHTML.toLowerCase() })
        }
    },
    addItem: function(e) {
        if (e.which !== ENTER_KEY) return;
        store.add(this.ref.newItem.value)
        this.ref.newItem.value = '';
    },
    toggleAll: function(e) {
        store.toggleAll(e.target.checked);
    },
    clearText: function() {
        var x = store.completed().length;
        return 'Clear completed (' + x + ')'
    },
    render: function() {
        return {
            repos: this.repos.set(this.todos)
        }
    }
});

var store = new ToDoStore([
  // { id: 0, text: 'write todomvc', done: false }
]);

window.app = new App({ view: document.getElementById('repoapp') });