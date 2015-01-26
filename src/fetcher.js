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

var cachedFields = ['id','name', 'full_name', 'owner', 'html_url', 'description','created_at','language','watchers','README','stargazers_count','forks_count','open_issues'];

function Fetcher() {
  this.git = git;
  this.cached = false;
  this.nextInvocation = null;
  this.mongoUrl = 'mongodb://darul:darul@ds037451.mongolab.com:37451/heroku_app33476082';
  var self = this;
  MongoClient.connect(this.mongoUrl, function(err, db) {
    console.log("Connected correctly to server");
    // 2 Mo
    self.mongoRepos = db.createCollection('repositories', {capped:true, size:2097152},function(err, collection) {
      db.close();
      self.init();
    });
    
  });
}

Fetcher.prototype.init = function() {
  var self = this;
  this.cron = '*/30 * * * *';
  //this.cron = '*/5 * * * *';
  
  // 1) Stored in files (sync)
  var filepath = this.GetFilePath();
  this.repos = {filepath: []};
  var currentDayPath = filepath+'repos.json';
  if (fs.existsSync(currentDayPath) && fs.statSync(currentDayPath)) {
    var storedOne = jf.readFileSync(currentDayPath, {throws: false});
    this.repos[filepath] = storedOne;
  }
  // 2) Stored in mongo (async)
  this.GetStoredRepos({key: filepath}, function(err, doc) {
    if (err) {console.log(err);return;}
    if (doc == null) return;
    console.log(doc.repos.length);
    var merged = merger(doc.repos, self.repos[filepath]);
    self.repos[filepath] = filter(merged, cachedFields);
    console.log(self.repos[filepath].length);
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
    var doc = { key: filepath, repos: merge };
    self.storeRepos(doc, function(err, result) {
      if (err) {console.log(err);return;}
      console.log('inserted');
    });
    
    fs.writeFile(filepath+'repos.json', JSON.stringify(merge, null, 4), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
      self.prevInvocation = new Date();
      self.nextInvocation = self.scheduler.nextInvocation();
    });
    
  });
  
};

Fetcher.prototype.storeRepos = function(doc, cb) {
  MongoClient.connect(this.mongoUrl, function(err, db) {
    if (err) {cb(err);return;}
    var collection = db.collection('repositories');
    collection.insert(doc, function(err, result) {
      if (err) {cb(err);return;}
      cb(null, result);
      db.close();
    });
  });
}

Fetcher.prototype.GetStoredRepos = function(query, cb) {
  MongoClient.connect(this.mongoUrl, function(err, db) {
    if (err) {cb(err);return;}
    var collection = db.collection('repositories');
    collection.findOne(query, function(err, doc) {
      if (err) {cb(err);return;}
      cb(null, doc);
      db.close();
    });
  });
}

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
  return this.repos[this.GetFilePath()];
}

// UTILS

var filter = function(objects, fields) {
  var newOne = _.map(objects, function(value, key, list){ 
    return _.pick(value, fields);
  });
  
  return newOne;
};

var merger = function(newOne, old) {
  var union = _.union(newOne, old);
  var merge = _.uniq(union, false, function(item, key, a){ 
    return item.id;
  });
  return merge;
};

var fetcher = new Fetcher();
module.exports = fetcher;
