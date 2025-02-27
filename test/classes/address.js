const { describe, it } = require('mocha')
const { expect } = require('chai')
const nimble = require('../env/nimble')
const { PrivateKey, Address } = nimble
const { encodeBase58Check } = nimble.functions
const bsv = require('bsv')

describe('Address', () => {
  describe('constructor', () => {
    // TODO
  })

  describe('fromString', () => {
    it('decodes valid mainnet address', () => {
      const bsvAddress = new bsv.PrivateKey().toAddress()
      const address = Address.fromString(bsvAddress.toString())
      expect(address.testnet).to.equal(false)
      expect(Buffer.from(bsvAddress.hashBuffer).toString('hex')).to.equal(Buffer.from(address.pubkeyhash).toString('hex'))
    })

    it('decodes valid testnet address', () => {
      const bsvAddress = new bsv.PrivateKey(undefined, 'testnet').toAddress()
      const address = Address.fromString(bsvAddress.toString())
      expect(address.testnet).to.equal(true)
      expect(Buffer.from(bsvAddress.hashBuffer).toString('hex')).to.equal(Buffer.from(address.pubkeyhash).toString('hex'))
    })

    it('throws if invalid checksum', () => {
      expect(() => Address.fromString('1JMckZqEF3194i3TCe2eJrvLyL74RAJ36k')).to.throw('bad checksum')
    })

    it('throws if not a string', () => {
      expect(() => Address.fromString()).to.throw('not a string')
      expect(() => Address.fromString(null)).to.throw('not a string')
      expect(() => Address.fromString(Address.fromString(new bsv.PrivateKey().toAddress()))).to.throw('not a string')
    })

    it('throws if invalid chars', () => {
      expect(() => Address.fromString('!JMckZqEF3194i3TCe2eJrvLyL74RAJ36k')).to.throw('bad base58 chars')
    })

    it('throws if invalid length', () => {
      const invalidLengthAddress = encodeBase58Check(0, [])
      expect(() => Address.fromString(invalidLengthAddress)).to.throw('bad payload')
    })

    it('is immutable', () => {
      const address = Address.fromString(PrivateKey.fromRandom().toAddress().toString())
      expect(Object.isFrozen(address)).to.equal(true)
    })
  })

  describe('fromPublicKey', () => {
    it('computes address', () => {
      const bsvPrivateKey = new bsv.PrivateKey()
      const bsvAddress = bsvPrivateKey.toAddress()
      const privateKey = PrivateKey.fromString(bsvPrivateKey.toString())
      const address = privateKey.toAddress()
      expect(address.toString()).to.equal(bsvAddress.toString())
    })

    it('caches address', () => {
      const publicKey = PrivateKey.fromRandom().toPublicKey()
      const t0 = new Date()
      const address1 = Address.fromPublicKey(publicKey)
      const t1 = new Date()
      const address2 = Address.fromPublicKey(publicKey)
      const t2 = new Date()
      expect(t2 - t1).to.be.lessThanOrEqual(t1 - t0)
      expect(address1).to.equal(address2)
    })

    it('is immutable', () => {
      const address = Address.fromPublicKey(PrivateKey.fromRandom().toPublicKey())
      expect(Object.isFrozen(address)).to.equal(true)
    })
  })

  describe('toString', () => {
    it('mainnet', () => {
      const bsvAddress = new bsv.PrivateKey().toAddress()
      expect(Address.fromString(bsvAddress.toString()).toString()).to.equal(bsvAddress.toString())
    })

    it('testnet', () => {
      const bsvAddress = new bsv.PrivateKey(undefined, 'testnet').toAddress()
      expect(Address.fromString(bsvAddress.toString()).toString()).to.equal(bsvAddress.toString())
    })
  })
})
