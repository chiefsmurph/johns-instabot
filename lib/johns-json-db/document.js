const fs = require('mz/fs');
const mergeObjects = require('./utils/mergeObjects');

class Document {
  constructor(path, data) {
    this.path = path;
    this.data = data || {};
    this.hasInitd = false;
  }
  async init() {
    const exists = await fs.exists(this.path);
    if (!exists) return this.data;
    const contents = await fs.readFile(this.path);
    const obj = JSON.parse(contents);
    this.data = obj;
    return obj;
  }
  get() {
    return this.data;
  }
  async mergeAndSave(data, overwriteprops) {
    if (!this.hasInitd) {
      await this.init();
    }
    const mergedData = mergeObjects(this.data, data, overwriteprops);
    await fs.writeFile(this.path, JSON.stringify(mergedData, null, 2), { flag: 'w' });
    this.data = mergedData;
    return mergedData;
  }
  async pushToArray(key, val) {
    if (this.data[key] && !Array.isArray(this.data[key])) {
      throw new Error(key + ' is not an array');
    }
    const data = {
      ...this.data,
      [key]: [
        ...(this.data[key] ? this.data[key] : []),
        val
      ]
    };
    return await this.mergeAndSave(data);
  }
}

module.exports = Document;
