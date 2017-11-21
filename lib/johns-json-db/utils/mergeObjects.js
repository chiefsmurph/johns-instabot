const mergeObjects = (target, source, overwriteprops) => {

  var returnObj = { ...target };

  for (var prop in source) {
    if (Array.isArray(source[prop]) && Array.isArray(target[prop]) && !overwriteprops) {
      // merge arrays
      returnObj[prop] = [
        ...target[prop],
        ...source[prop],
      ];
    } else {
      // overwrite target
      returnObj[prop] = source[prop];
    }
  }

  return returnObj;

};

module.exports = mergeObjects;
