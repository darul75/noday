var path = require('path');
var schedule = require('node-schedule');


function Fetcher() {
  this.init();
}

Fetcher.prototype.init = function() {
  this.cron = new schedule.RecurrenceRule();
  this.cron.minute = 1;

  var j = schedule.scheduleJob(this.cron, this.fetch());
};

Fetcher.prototype.fetch = function(options, next) {
  // Directory path
  var d = new Date();
  var path = 'data'+path.sep+d.getUTCFullYear()+path.sep+d.getUTCMonth()+path.sep+d.getUTCDay();
  
  //
  console.log(path);
  
};

var fetcher = new Fetcher();
module.exports = fetcher;