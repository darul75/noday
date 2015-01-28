var GitHubApi = require("github");
var queue = require("queue-async");
var Parser = require('markdown-parser');
var moment = require('moment');

function Git() {
  this.init();
  this.github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
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
  
  this.parser = new Parser();
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
        repo.README = result;
        
        if (err || !repo.README || repo.README.content.length===0) {
          repo.README = "NOT DEFINED";
          return cb(null, {});
        }
      
        var readme = "";
        //repo.README_UTF8 = new Buffer(repos[0].README.content, 'base64').toString();
        // FETCH LINKS
        try {
          readme = new Buffer(repo.README.content, 'base64').toString();
          self.parser.options = {html_url: repo.html_url};
          self.parser.parse(readme, function(err, results) {
            if (!err)
              repo.README.infos = results;
            return cb(null, result);
          });
        }
        catch(e) {
          console.log(e);
          console.log(readme);
          console.log(repo.full_name);
          
          return cb(null, result);
        }
      });
    }
  }
  
  var d = new Date();
  var queryDate = moment(d).format('YYYY-MM-DD');
  
  this.github.search.repos(
    {
      q: ['node', 'in:readme,description,name', 'created:>'+queryDate].join('+'),
      order:'desc',
      sort:'stars',
      per_page: 100
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
        return next(err, repos);
      });
      
    }
  );
  // 'language:JavaScript', 
};

var git = new Git();
module.exports = git;