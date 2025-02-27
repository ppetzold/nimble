const encodeHex = require('./encode-hex')
const encodeTx = require('./encode-tx')
const sha256d = require('./sha256d')

function calculateTxid (tx) {
  return encodeHex(sha256d(encodeTx(this)).reverse())
}

module.exports = calculateTxid
