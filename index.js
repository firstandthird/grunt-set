var fs = require('fs');
var path = require('path');
var aug = require('aug');

module.exports = function(grunt, set, data) {

  var cwd = process.cwd();

  var configPath = path.join(cwd, 'node_modules', 'grunt-set-'+set);
  var overridePath = path.join(cwd, 'grunt');
  var bowerPath = path.join(cwd, 'bower.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(set + ' not installed');
  }

  if (!fs.existsSync(overridePath)) {
    overridePath = null;
  }

  var defaultsPath = path.join(configPath, 'defaults.json');
  var defaults = {};
  if (fs.existsSync(defaultsPath)) {
    defaults = require(defaultsPath);
  }

  data = aug({}, defaults, data);

  if (fs.existsSync(bowerPath)) {
    data.bowerpkg = require(bowerPath);
  }

  require('load-grunt-config')(grunt, {
    configPath: configPath,
    overridePath: overridePath,
    data: data,
    loadGruntTasks: {
      pattern: ['grunt-*', '!grunt-set'],
    },
    preMerge: function(config, data) {
      delete config.package;
      delete config.defaults;
      delete config.bowerpkg;
    }
  });
  grunt.loadNpmTasks('grunt-set-'+set);
};
