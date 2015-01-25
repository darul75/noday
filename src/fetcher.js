var schedule = require('node-schedule');
var git = require('./git');
var fs = require('fs');
var jf = require('jsonfile');
var mkpath = require('./mkpath');
var moment = require('moment');
var path = require('path');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;

// https://help.github.com/articles/searching-repositories/

var cachedFields = [
  'name', 
  'full_name', 
  'owner', 
  'html_url', 
  'description',
  'created_at',
  'language',
  'watchers',
  'README',
  'stargazers_count',
  'forks_count',
  'open_issues'];

function Fetcher() {
  this.git = git;
  this.repos = {};
  this.cached = false;
  this.nextInvocation = null;
  var self = this;
  // mongo : mongodb://darul:darul@ds037451.mongolab.com:37451/heroku_app33476082
  MongoClient.connect('mongodb://darul:darul@ds037451.mongolab.com:37451/heroku_app33476082', function(err, db) {
    console.log("Connected correctly to server");
    self.mongoRepos = db.collection('repositories');
    //db.close();
    self.init();
  });
  
}

Fetcher.prototype.init = function() {
  this.cron = '* * * * *';
  //this.cron = '*/5 * * * *';
  // '* * * * *' every minutes
  //this.cron.hour = 1;
  
  // Load today repo
  var filepath = this.GetFilePath();
  var currentDayPath = filepath+'repos.json';
  if (fs.existsSync(currentDayPath) && fs.statSync(currentDayPath)) {
    var storedOne = filter(jf.readFileSync(currentDayPath, {throws: false}), cachedFields);
    this.repos[filepath] = storedOne;
    if (storedOne == null || storedOne.length == 0) {
      this.repos[filepath] = this.client.get(filepath) || [];  
    }
    this.cached = true;
  }
  
  this.mongoRepos.find({date: filepath}, function(err, repos) {
    if (err) console.log(err);
    this.repos[filepath] = repos || [];
    console.log(repos);
    console.log(this.repos[filepath].length);
  });
  
  this.scheduleStart();
};

Fetcher.prototype.scheduleStart = function() {
  var fetchFn = this.fetch.bind(this);
  this.scheduler = schedule.scheduleJob("git", this.cron, fetchFn);
  this.nextInvocation = this.scheduler.nextInvocation();
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
    
    self.repos[filepath] = filter(merge, cachedFields);
    // Insert some documents
    var doc = { date: filepath, repos: self.repos[filepath] };
    self.mongoRepos.insert(doc, function(err, result) {
      if (err) console.log(err);        
      console.log('inserted');
    });
    
    fs.writeFile(filepath+'repos.json', JSON.stringify(merge, null, 4), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
      self.cached = true;
      self.prevInvocation = new Date();
      self.nextInvocation = self.scheduler.nextInvocation();
    });
    
  });
  
};

Fetcher.prototype.GetFilePath = function() {
  var d = new Date();
  return './data/'+d.getUTCFullYear()+'/'+d.getUTCMonth()+'/'+d.getUTCDate()+'/';
}

Fetcher.prototype.ReadCurrent = function() {
  return jf.readFileSync(this.GetFilePath()+'repos.json', {throws: false});
}

Fetcher.prototype.Metrics = function() {
  return {
    nextInvocation: moment(this.nextInvocation).fromNow(),
    prevInvocation: moment(this.prevInvocation).fromNow()
  };
}

Fetcher.prototype.TodayRepos = function() {
  if (this.cached) {
    return this.repos[this.GetFilePath()];
  }
  return [];
}

// UTILS

var filter = function(objects, fields) {
  console.log(fields);
  var newOne = _.map(objects, function(value, key, list){ 
    return _.pick(value, fields);
  });
  
  return newOne;
};

var merger = function(newOne, old) {
  return _.uniq(_.union(newOne, old), false, function(item, key, a){ return item.id; });
};

var fetcher = new Fetcher();
module.exports = fetcher;
