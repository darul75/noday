var schedule = require('node-schedule');
var git = require('./git');
var fs = require('fs');
var jf = require('jsonfile');
var mkpath = require('./mkpath');
var path = require('path');
var _ = require('underscore');

// https://help.github.com/articles/searching-repositories/

function Fetcher() {
  this.git = git;
  this.init();
  this.repos = {};
}

Fetcher.prototype.init = function() {
  this.cron = '* * * * *';
  //this.cron.hour = 1;
};

Fetcher.prototype.scheduleStart = function() {
  var fetchFn = this.fetch.bind(this);
  this.scheduler = schedule.scheduleJob("git", this.cron, fetchFn);
};

Fetcher.prototype.fetch = function() {
  var self = this;
  var filepath = this.GetFilePath();
  
  
  // create folders
  mkpath.sync(filepath, 0777);
  
  // search and store
  this.git.search({}, function(err, repos) {
    var currentRepos = self.ReadCurrent() || [];
    var merge = merger(repos, currentRepos);
    console.log(currentRepos.length);
    console.log(repos.length);
    console.log(merge.length);
    
    self.repos[filepath] = merge;
    
    fs.writeFile(filepath+'repos.json', JSON.stringify(merge, null, 4), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });
  
};

Fetcher.prototype.GetFilePath = function() {
  var d = new Date();
  return './data'+path.sep+d.getUTCFullYear()+path.sep+d.getUTCMonth()+path.sep+d.getUTCDate()+path.sep;
}

Fetcher.prototype.ReadCurrent = function() {
  return jf.readFileSync(this.GetFilePath()+'repos.json', {throws: false});
}

Fetcher.prototype.TodayRepos = function() {
  if (this.repos[this.GetFilePath()]){
    return this.repos[this.GetFilePath()];
  }
  return [];
}

// UTILS
var merger = function(newOne, old) {
  return _.uniq(_.union(newOne, old), false, function(item, key, a){ return item.id; });
}

var fetcher = new Fetcher();
module.exports = fetcher;