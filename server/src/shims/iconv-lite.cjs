class TextDecoderWrapper {
  constructor(encoding) {
    try {
      this.decoder = new TextDecoder(encoding || 'utf-8');
    } catch {
      this.decoder = new TextDecoder('utf-8');
    }
  }
  write(chunk) {
    if (typeof chunk === 'string') return chunk;
    return this.decoder.decode(chunk, { stream: true });
  }
  end() {
    return this.decoder.decode();
  }
}

function getDecoder(encoding) {
  return new TextDecoderWrapper(encoding);
}

function getEncoder(encoding) {
  return {
    write(chunk) {
      return Buffer.from(chunk, encoding || 'utf-8');
    },
    end() {
      return Buffer.alloc(0);
    }
  };
}

function encodingExists(encoding) {
  return true;
}

function decode(buf, encoding) {
  if (typeof buf === 'string') return buf;
  try {
    return new TextDecoder(encoding || 'utf-8').decode(buf);
  } catch {
    return buf.toString();
  }
}

function encode(str, encoding) {
  if (Buffer.isBuffer(str)) return str;
  return Buffer.from(str, encoding || 'utf-8');
}

const iconv = {
  getDecoder,
  getEncoder,
  encodingExists,
  decode,
  encode,
  supportsStreams: false,
};

module.exports = iconv;
module.exports.default = iconv;
module.exports.getDecoder = getDecoder;
module.exports.getEncoder = getEncoder;
module.exports.encodingExists = encodingExists;
module.exports.decode = decode;
module.exports.encode = encode;
