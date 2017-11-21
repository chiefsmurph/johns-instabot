const mergeObjects = (target, source) => {

  var returnObj = { ...target };

  for (var prop in source) {
    if (Array.isArray(source[prop]) && Array.isArray(target[prop])) {
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
