const fs = require('mz/fs');
const mergeObjects = require('./utils/mergeObjects');

class Document {
  constructor(path, data) {
    this.path = path;
    this.data = data || {};
    this.hasInitd = false;
  }
  async init() {
    if (this.hasInitd) return this;
    const exists = await fs.exists(this.path);
    if (!exists) return this.data;
    let contents = await fs.readFile(this.path);
    if (!contents.length) return; // empty file
    const obj = JSON.parse(contents);
    // console.log('doc init', obj);
    this.data = obj;
    this.hasInitd = true;
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
    await this.save(mergedData);
    return mergedData;
  }
  async save(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), { flag: 'w' });
    this.data = data;
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
  async deleteKeys(keys) {
    keys.forEach(key => {
      delete this.data[key];
    });
    await this.save(this.data);
  }
}

module.exports = Document;
