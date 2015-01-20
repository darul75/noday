var schedule = require('node-schedule');
var git = require('./git');
var fs = require('fs');
var mkpath = require('./mkpath');

console.log('git' + git);

function Fetcher() {
  this.git = git;
  this.init();
}

Fetcher.prototype.init = function() {
  this.cron = new schedule.RecurrenceRule();
  this.cron.minute = 1;

  var j = schedule.scheduleJob(this.cron, this.fetch());
};

Fetcher.prototype.fetch = function(options, next) {
  var path = require('path');
  
  // Directory path
  var d = new Date();
  var path = './../data'+path.sep+d.getUTCFullYear()+path.sep+d.getUTCMonth()+path.sep+d.getUTCDate()+path.sep;
  
  mkpath.sync(path, 0777);
  
  this.git.search({}, function(err, repos) {
    console.log(repos);
    fs.writeFile(path+'repos.json', JSON.stringify(repos, null, 4), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
    
  });
  
};

var fetcher = new Fetcher();
module.exports = fetcher;