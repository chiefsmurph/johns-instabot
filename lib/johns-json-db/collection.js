const fs = require('mz/fs');
const Document = require('./document');

class Collection {
  constructor(collectionName, path) {
    this.collectionName = collectionName;
    this.documents = {};
    this.dir = path + '/' + collectionName;
    this.hasInitd = false;
  }
  async init() {
    if (this.hasInitd) return this;
    if (!await fs.exists(this.dir)){
        await fs.mkdir(this.dir);
    }
    let files = await fs.readdir(this.dir);
    files = files.filter(filename => filename.indexOf('.json') !== -1);
    // console.log(files);
    for (let file in files) {
      file = files[file];
      const withoutExtension = file.split('.')[0];
      // console.log(withoutExtension);
      this.documents[withoutExtension] = new Document(this.dir + '/' + file);
      const obj = await this.documents[withoutExtension].init();
      // console.log(obj,' what');
    }
    console.log('initd ' + files.length + ' docs in ' + this.collectionName + ' collection');
    this.hasInitd = true;
    return this;
  }
  getDoc(docName) {
    return this.documents[docName] ? this.documents[docName].get() : null;
  }
  async mergeAndSaveDoc(docName, data) {
    if (!this.documents[docName]) {
      this.documents[docName] = new Document(this.dir + '/' + docName + '.json');
    }
    const obj = await this.documents[docName].mergeAndSave(data);
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
