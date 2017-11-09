const newHorseman = require('./newHorseman');

const executeHorseman = horsemanFn => {
  const horseman = newHorseman();
  horseman.catch(e => console.error('potatoes', e));
  try {
    horsemanFn(horseman.catch(e => {
      console.error('fff', e);
    }));
  } catch (e) {
    console.error('caught this', e);
  }
};

module.exports = executeHorseman;
