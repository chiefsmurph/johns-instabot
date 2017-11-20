const fs = require('mz/fs');

const HandleManager = (() => {
  const handleData = {};

  return {
    getHandle(handle) {
      return handleData[handle];
    },
    async newHandle(handle, data) {
      const filePath = `../data/handles/${handle}.json`;
      handleData[handle] = new Document(filePath);
      await handleData[handle].mergeAndSave(data);
    }
  };

})();


class Collection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }
}
