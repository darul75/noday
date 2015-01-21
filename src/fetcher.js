var schedule = require('node-schedule');
var git = require('./git');
var fs = require('fs');
var mkpath = require('./mkpath');
var path = require('path');
var _ = require('underscore');

function Fetcher() {
  this.git = git;
  this.init();
}

Fetcher.prototype.init = function() {
  this.cron = new schedule.RecurrenceRule();
  this.cron.minute = 1;
  //this.cron.hour = 1;
};

Fetcher.prototype.scheduleStart = function() {
  var fetchFn = this.fetch.bind(this);
  this.scheduler = schedule.scheduleJob("git", this.cron, fetchFn);
};

Fetcher.prototype.fetch = function() {
  
  console.log("fetch called");
  
  // Directory path
  var d = new Date();
  var filepath = './data'+path.sep+d.getUTCFullYear()+path.sep+d.getUTCMonth()+path.sep+d.getUTCDate()+path.sep;
  
  mkpath.sync(filepath, 0777);
  
  this.git.search({}, function(err, repos) {
    
    fs.writeFile(filepath+'repos.json', JSON.stringify(repos, null, 4), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });
  
};

var merger = function(c1, c2) {
  _.uniq(_.union(c1, c2), false, function(item, key, a){ return item.a; });
  
}

var fetcher = new Fetcher();
module.exports = fetcher;