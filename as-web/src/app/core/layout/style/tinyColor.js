const tinycolor = require('./tinyColor2');

module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add('tinycolor', function (...args) {
      return tinycolor(...args.map(ref => ref.value));
    });
  }
};
