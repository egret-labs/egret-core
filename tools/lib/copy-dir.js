var fs = require('fs');
var path = require('path');

var mkdir = function (dist, callback) {
  dist = path.resolve(dist);
  fs.exists(dist, function (exists) {
    if (!exists) {
      mkdir(path.dirname(dist), function () {
        fs.mkdir(dist, function (err) {
          callback && callback(err);
        });
      });
    } else {
      callback && callback(null);
    }
  });
};

mkdir.sync = function (dist) {
  dist = path.resolve(dist);
  if (!fs.existsSync(dist)) {
    mkdir.sync(path.dirname(dist));
    fs.mkdirSync(dist);
  }
};

function FileTools(from, to, filter) {
  this.from = from;
  this.to = to;
  this.filter = filter;
  return this;
}

FileTools.prototype.find =  function(callback) {
  var that = this;
  var filelist = {
    dirs: [],
    files: []
  };
  var getfiles = function(from, callback) {
    fs.readdir(from, function(err, files) {
      if (err) {
        callback && callback(err);
      } else {
        var index = 0;
        var filecount = files.length;
        var loop = function() {
          var filename = files[index];
          var filepath = path.join(from, filename);
          fs.lstat(filepath, function(err, stats) {
            if (err) {
              callback(err);
            } else {
              if (stats.isDirectory()) {
                if (that.filter('directory', filepath, filename)) {
                  filelist.dirs.push(filepath);
                  getfiles(filepath, function(err) {
                    checker(err);
                  });
                } else {
                  checker();
                }
              } else if (stats.isFile()) {
                if (that.filter('file', filepath, filename)) {
                  filelist.files.push(filepath);
                }
                checker();
              } else {
                checker();
              }
            }
          });
        };
        var checker = function(err) {
          if(err) {
            callback(err);
          } else {
            index++;
            if(index === filecount) {
              callback(null, filelist);
            } else {
              loop();
            }
          }
        };
        if(filecount > 0) {
          loop();
        } else {
          callback(null, filelist);
        }
      }
    });
  };
  getfiles(this.from, callback);
};

FileTools.prototype.findSync =  function() {
  var that = this;
  var filelist = {
    dirs: [],
    files: []
  };
  var getfiles = function(from) {
    var files = fs.readdirSync(from);
    var index = 0;
    var filecount = files.length;
    var loop = function() {
      var filename = files[index];
      var filepath = path.join(from, filename);
      var stats = fs.lstatSync(filepath);
      if (stats.isDirectory()) {
        if (that.filter('directory', filepath, filename)) {
          filelist.dirs.push(filepath);
          getfiles(filepath);
        }
      } else if (stats.isFile()) {
        if (that.filter('file', filepath, filename)) {
          filelist.files.push(filepath);
        }
      }
      return checker();
    };
    var checker = function() {
      index++;
      if(index === filecount) {
        return filelist;
      } else {
        return loop();
      }
    };
    if(filecount > 0) {
      return loop();
    } else {
      return filelist;
    }
  };
  return getfiles(this.from);
};

FileTools.prototype.mkdir = function(list, callback) {
  var index = 0;
  var filecount = list.length;
  var loop = function() {
    mkdir(list[index], function(err) {
      if(err) {
        callback(err);
      } else {
        index++;
        if(index === filecount) {
          callback(null);
        } else {
          loop();
        }
      }
    });
  };
  if(list.length > 0) {
    loop();
  } else {
    callback(null);
  }
};

FileTools.prototype.mkdirSync = function(list) {
  var index = 0;
  var filecount = list.length;
  var loop = function() {
    mkdir.sync(list[index]);
    index++;
    if(index === filecount) {
      return true;
    } else {
      return loop();
    }
  };
  if(filecount > 0) {
    return loop();
  } else {
    return true;
  }
};

FileTools.prototype.copyfile = function(list, callback) {
  var that = this;
  var index = 0;
  var filecount = list.length;
  var loop = function() {
    var filepath = list[index];
    var rs = fs.createReadStream(filepath);
    var ws = fs.createWriteStream(path.join(that.to, path.relative(that.from, filepath)));
    rs.on('end', function() {
      index++;
      if(index === filecount) {
        callback(null);
      } else {
        loop();
      }
    });
    rs.pipe(ws);
  };
  if(filecount > 0) {
    loop();
  } else {
    callback(null);
  }
};

FileTools.prototype.copyfileSync = function(list) {
  var that = this;
  var index = 0;
  var filecount = list.length;
  var loop = function() {
    var filepath = list[index];
    var distpath = path.join(that.to, path.relative(that.from, filepath));
    fs.writeFileSync(distpath, fs.readFileSync(filepath, 'binary'), 'binary');
    index++;
    if(index === filecount) {
      return true;
    } else {
      return loop();
    }
  };
  if(filecount > 0) {
    return loop();
  } else {
    return true;
  }
};

function copy(from, to, filter, callback) {
  if (typeof filter === 'function' && !callback) {
    callback = filter;
    filter = null;
  }
  filter = filter || function(state, filepath, filename) {
    return true;
  };
  var tools = new FileTools(from, to, filter);
  tools.find(function(err, list) {
    var dirs = list.dirs.map(function(v) {
      return path.join(tools.to, path.relative(tools.from, v));
    }).concat([tools.to]);
    tools.mkdir(dirs, function(err) {
      tools.copyfile(list.files, callback);
    });
  });
}

copy.sync = function(from, to, filter) {
  filter = filter || function(state, filepath, filename) {
    return true;
  };
  var tools = new FileTools(from, to, filter);
  var list = tools.findSync();
  var dirs = list.dirs.map(function(v) {
    return path.join(tools.to, path.relative(tools.from, v));
  });
  tools.mkdirSync(dirs);
  tools.copyfileSync(list.files);
};

module.exports = copy;