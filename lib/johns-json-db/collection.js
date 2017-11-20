const fs = require('mz/fs');
const Document = require('./document');

class Collection {
  constructor(collectionName, path) {
    this.collectionName = collectionName;
    this.documents = {};
    this.dir = path + '/' + collectionName;
  }
  async init() {
    if (!await fs.exists(this.dir)){
        await fs.mkdir(this.dir);
    }
    let files = await fs.readdir(this.dir);
    files = files.filter(filename => filename.indexOf('.json') !== -1);
    console.log(files);
    files.forEach(async file => {
      const withoutExtension = file.split('.')[0];
      this.documents[withoutExtension] = new Document(this.dir + '/' + file);
      const obj = await this.documents[withoutExtension].init();
      console.log(withoutExtension, obj);
    }, this);
  }
  async mergeAndSaveDoc(docName, data) {
    if (!this.documents[docName]) {
      this.documents[withoutExtension] = new Document(this.dir + '/' + file);
    }
    const obj = await this.documents[withoutExtension].mergeAndSave(data);
    console.log('merged', obj);
    return obj;
  }
  getAll() {
    return Object.keys(this.documents).map(handle => {
      return this.documents[handle].get();
    }, this);
  }
}

module.exports = Collection;
