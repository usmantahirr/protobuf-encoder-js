'use strict';

const protobuf = require('protobufjs');
const debug = require('debug')('protobuf');

function loadFile(file, cb) {
  protobuf.load(file).then((root) => {
    cb(null, root);
  }).catch((err) => {
    cb(err, null);
  });
}

class ProtocolBuffer {

  /**
   * initialize protobuf file
   * @param name {String} - Name of proto file without extension. we know its .proto
   * @param path {String} - Path to proto file with slash in end. './drivers/
   */
  constructor(name, path, packageName, message) {
    let file = '';
    this.message = '';

    if (path) {
      file = path + name + '.proto';
    } else {
      file = `./drivers/${name}.proto`;
    }

    loadFile(file, (err, root) => {
      if (err) {
        debug('Error loading file => ', err);
      } else {
        debug('proto file loaded => ', root.name);
        this.message = root.lookup(`${packageName}.${message}`); 
      }
    });
  }

  encode(data) {
    let buffer = this.message.create(data);
    debug('data encoded to Protobuf ', buffer);
    return this.message.encode(buffer).finish();
  }

  decode(buffer) {
    const decoded = this.message.decode(buffer);
    debug(decoded);
    return decoded;
  }
}

module.exports = ProtocolBuffer;
