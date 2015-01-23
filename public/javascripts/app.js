var Collection  = Espresso.Collection;
var Controller  = Espresso.Controller;
var Model       = Espresso.Model;
var Repos       = Espresso.List;
var Metrics     = Espresso.List;

// UTILS

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

var fetcher = function(path, cache, model) {
  var self = this;
  fetch(path).then(status).then(json)
    .then(function(json) {
      self[cache] = json;
      self[model].set(self[cache]);
    }).catch(function(ex) {
      console.log('parsing failed', ex);
    });
};

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


// APP

var RepoItem = Controller.extend({
  init: function() {
    this.modalCtrl = this.include(modalCtrl);
  },
  hasNoCode: function() {
    return !this.model.README || this.model.README === 'NOT DEFINED' || (this.model.README.infos && this.model.README.infos.codes.length===0);
  },
  clickCode: function(e) {
    if (!e || !e.srcElement) return;
    var code = generateCodes(this.model.README);
    this.modalCtrl.emit('modalCode', code);
  },
  clickImg: function(e) {
    if (!e || !e.srcElement) return;
    var imgSrc = e.srcElement.src;
    this.modalCtrl.emit('modalImg', imgSrc);
  },
  render: function() {
    return {
      view: { classList: { editing: this.model.editing, completed: this.model.done } },
      title: {text: this.model.full_name, href: this.model.html_url},
      date: {text: moment(this.model.created_at).fromNow()},
      description: {text: this.model.description, href: this.model.html_url, title: this.model.full_name},
      language: {text: this.model.language},
      user: {href: this.model.html_url, title: this.model.owner ? this.model.owner.login : ""},
      user_info: {href: this.model.owner ? this.model.owner.html_url : "", text: this.model.owner ? this.model.owner.login : ""},
      user_avatar: {src: this.model.owner ? this.model.owner.avatar_url : ""},
      images: { html: generateImgs(this.model.README), onclick: this.clickImg },
      codeTxt: { onclick: this.clickCode, classList:{"u-hide": this.hasNoCode()} },
      watchers: { text: " " + this.model.watchers },
      stars: { text: " " + this.model.stargazers_count },
      forks: { text: " " + this.model.forks_count },
      issues: { text: " " + this.model.open_issues }
    }
  }
});

var Metrics = Controller.extend({
  init: function() {
    this.model = new Model({ 
      nextInvocation: null,
      prevInvocation: null
    });
    this.metrics = {};
    
  },
  render: function() {
    return {
      next: {text: this.model.nextInvocation},
      prev: {text: this.model.prevInvocation}
    }
  }
});

var metricsCtrl = new Metrics({ view: 'metrics', name: 'metrics' });

var ModalCtrl = Controller.extend({
  init: function() {
    this.model.content='';
    this.addListener('modalCode', function(code) {
      this.set({ show: true, content:code });
      window.location.hash = '#modal';
    });
    this.addListener('modalImg', function(src) {
      this.set({ show: true, content:'<img src='+src+'>' });
      window.location.hash = '#modal';
    });
  },
  show: function() {
    this.set({ showCode: !this.model.showCode });
  },
  render: function() {
    return {
      view: { classList: { "modal--show": this.model.show } },
      content: { html: this.model.content }
    }
  }
});

var modalCtrl = new ModalCtrl({ view: 'modal', name: 'modalComponent' });

var App = Controller.extend({
  init: function() {
    this.items = [];
    var metrics = {};
    this.order = true;
    var self = this;
    
    function locationHashChanged(e) {
      var h = location.hash;
      if (h === "#stars"){
        self.sort("stargazers_count");
      }
      else if (h === "#watchers"){
        self.sort("watchers");
      }
      else if (h === "#forks"){
        self.sort("forks_count");
      }
      else if (h === "#issues"){
        self.sort("open_issues");
      }
      else if (h === "#watchers"){
        self.sort("watchers");
      }
    }

    window.onhashchange = locationHashChanged;
    

    this.repos = new Repos(RepoItem);
    this.modal = this.include(modalCtrl);
    this.metrics = this.include(metricsCtrl);
    
    fetcher.apply(this, ['/repositories', 'items', 'repos']);
    //fetcher.apply(this, ['/metrics', 'metrics', 'metrics']);
    
     fetch('/metrics').then(status).then(json)
      .then(function(json) {
        metrics = json;
        self.metrics.model.set(metrics);
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      });
    
  },
  sort: function(type) {
    this.items.sort(function (a, b) {
      return a[type] < b[type] ? 1 : -1;
    });
    
    this.order = !this.order;
    this.repos.set(this.items);
  },
  render: function() {
    return {
        repos: this.repos.set(this.todos),
        modal: this.modal,
        metrics: this.metrics
    }
  }
});


window.app = new App({ view: document.getElementById('repoapp') });