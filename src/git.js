var GitHubApi = require("github");
var queue = require("queue-async");

function Git() {
  this.init();
  this.github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    /*host: "dd-darul75-1.c9.io",*/
    timeout: 5000,
    headers: {
      "user-agent": "node-news",
    }
  });
  
  this.github.authenticate({
    type: "oauth",
    key: "9d942e80649dd3821137",
    secret: "3d87d1742501421e62704301d3733dc4745c834d"
  });
  
}

Git.prototype.init = function() {
  
};

Git.prototype.search = function(options, next) {
  var self = this;
  
  var repos = [];
  
  function ignoreError(task, callback) {
    task(function(error, result) {
      return callback(null, result); // ignore error
    });
  }
  
  function taskThatSometimesFails(repo, params) {
    return function(cb) {
        self.github.repos.getReadme(params, function(err, result) {
        if (err) {
          repo.README = "NOT DEFINED";
          return cb(null, {});
        }
        
        repo.README = result;
        //repo.README_UTF8 = new Buffer(repos[0].README.content, 'base64').toString();
        
        return cb(null, result);
      });
    }
    
  }
  
  this.github.search.repos(
    {
      q: ['node', 'created:>2015-01-20'].join('+'),
      order:'desc',
      sort:'stars'
    },
    function(err, result) {
      var q = queue(1);
      repos = result.items;
      for (var i=0; i<repos.length; i++) {
        var repo = repos[i];
        
        var fn = taskThatSometimesFails(repo, {user:repo.owner.login, repo:repo.name});
        q.defer(ignoreError, fn);
      }
  
      q.awaitAll(function(error, results) { 
        console.log(repos[0]);
        return next(err, repos);
      });
      
    }
  );
  // 'language:JavaScript', 
};

var git = new Git();
module.exports = git;