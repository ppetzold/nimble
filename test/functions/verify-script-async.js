const { describe, it } = require('mocha')
const { expect } = require('chai')
require('chai').use(require('chai-as-promised'))
const nimble = require('../env/nimble')
const { verifyScriptAsync, writePushData, decodeHex, decodeTx } = nimble.functions
const { BufferWriter } = nimble.classes
const { opcodes } = nimble.constants

describe('verifyScriptAsync', () => {
  it('valid', async () => {
    async function pass (script) {
      await verifyScriptAsync([], script)
    }

    function encodePushData (buffer) {
      return Array.from(writePushData(new BufferWriter(), buffer).toBuffer())
    }

    await pass([opcodes.OP_TRUE])
    await pass([opcodes.OP_16])
    await pass([1, 1])
    await pass([opcodes.OP_PUSHDATA1, 2, 0, 1])
    await pass([opcodes.OP_PUSHDATA2, 2, 0, 0, 1])
    await pass([opcodes.OP_PUSHDATA4, 2, 0, 0, 0, 0, 1])
    await pass([opcodes.OP_NOP, opcodes.OP_NOP, opcodes.OP_NOP, opcodes.OP_1])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_IF, opcodes.OP_IF, opcodes.OP_ENDIF, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_1, opcodes.OP_ELSE, opcodes.OP_0, opcodes.OP_ENDIF])
    await pass([opcodes.OP_0, opcodes.OP_IF, opcodes.OP_0, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_0, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_0, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_PUSHDATA1, 1, 0, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_ELSE, opcodes.OP_ELSE, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([opcodes.OP_1, opcodes.OP_VERIFY, opcodes.OP_1])
    await pass([opcodes.OP_1, opcodes.OP_RETURN])
    await pass([opcodes.OP_FALSE, opcodes.OP_TRUE, opcodes.OP_RETURN])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_TOALTSTACK])
    await pass([opcodes.OP_1, opcodes.OP_TOALTSTACK, opcodes.OP_FROMALTSTACK])
    await pass([opcodes.OP_1, opcodes.OP_IFDUP, opcodes.OP_DROP, opcodes.OP_DROP, opcodes.OP_1])
    await pass([opcodes.OP_DEPTH, opcodes.OP_1])
    await pass([opcodes.OP_0, opcodes.OP_DEPTH])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_DUP, opcodes.OP_DROP, opcodes.OP_DROP, opcodes.OP_1])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_NIP, opcodes.OP_DROP])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_OVER])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_PICK])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_4, opcodes.OP_PICK])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_ROLL])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_ROLL, opcodes.OP_DROP])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_4, opcodes.OP_ROLL])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_ROT])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_ROT, opcodes.OP_ROT])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_ROT, opcodes.OP_ROT, opcodes.OP_ROT])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_SWAP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_TUCK, opcodes.OP_DROP, opcodes.OP_DROP])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2DROP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_2DUP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_2DUP, opcodes.OP_DROP, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_3DUP])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_3DUP, opcodes.OP_DROP, opcodes.OP_DROP, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2OVER])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_2OVER, opcodes.OP_DROP, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2ROT])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2ROT, opcodes.OP_2ROT])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_2ROT, opcodes.OP_2ROT, opcodes.OP_2ROT])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2ROT, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2SWAP])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2SWAP, opcodes.OP_DROP])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_CAT])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_2, opcodes.OP_0, opcodes.OP_CAT, opcodes.OP_PICK])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_CAT, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([2, opcodes.OP_0, opcodes.OP_1, opcodes.OP_1, opcodes.OP_SPLIT])
    await pass([2, opcodes.OP_0, opcodes.OP_1, opcodes.OP_2, opcodes.OP_SPLIT, opcodes.OP_DROP])
    await pass([2, opcodes.OP_0, opcodes.OP_1, opcodes.OP_0, opcodes.OP_SPLIT])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_SPLIT, opcodes.OP_1])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_SPLIT, opcodes.OP_DROP])
    await pass([opcodes.OP_1, opcodes.OP_SIZE])
    await pass([opcodes.OP_1, opcodes.OP_SIZE, opcodes.OP_DROP])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_AND])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_OR])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_XOR, opcodes.OP_IF, opcodes.OP_ELSE, opcodes.OP_1, opcodes.OP_ENDIF])
    await pass([3, 0xFF, 0x01, 0x00, opcodes.OP_INVERT, 3, 0x00, 0xFE, 0xFF, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_LSHIFT, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_4, opcodes.OP_2, opcodes.OP_LSHIFT, opcodes.OP_16, opcodes.OP_EQUAL])
    await pass([2, 0x12, 0x34, opcodes.OP_4, opcodes.OP_LSHIFT, 2, 0x23, 0x40, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_RSHIFT, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_4, opcodes.OP_2, opcodes.OP_RSHIFT, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([2, 0x12, 0x34, opcodes.OP_4, opcodes.OP_RSHIFT, 2, 0x01, 0x23, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_EQUALVERIFY])
    await pass([opcodes.OP_0, opcodes.OP_1ADD])
    await pass([opcodes.OP_1, opcodes.OP_1ADD, opcodes.OP_2, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_1SUB])
    await pass([opcodes.OP_0, opcodes.OP_1SUB, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0x7F, opcodes.OP_1ADD, opcodes.OP_SIZE, opcodes.OP_5, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0xFF, opcodes.OP_1SUB, opcodes.OP_SIZE, opcodes.OP_5, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_NEGATE, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_NEGATE, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_ABS, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_ABS, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_NOT])
    await pass([opcodes.OP_1, opcodes.OP_NOT, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_NOT, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_NOT, opcodes.OP_NOT])
    await pass([opcodes.OP_1, opcodes.OP_0NOTEQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0NOTEQUAL, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_0NOTEQUAL])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_1ADD])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_1SUB])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_NEGATE, opcodes.OP_1])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_ABS, opcodes.OP_1])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_NOT])
    await pass([5, 0, 0, 0, 0, 0, opcodes.OP_0NOTEQUAL, opcodes.OP_1])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_ADD])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_ADD])
    await pass([opcodes.OP_1, opcodes.OP_2, opcodes.OP_ADD, opcodes.OP_3, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0xFF, 4, 0xFF, 0xFF, 0xFF, 0xFF, opcodes.OP_ADD, opcodes.OP_SIZE, opcodes.OP_5, opcodes.OP_EQUAL])
    await pass([5, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 5, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, opcodes.OP_ADD, opcodes.OP_SIZE, opcodes.OP_6, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0x7F, 4, 0xFF, 0xFF, 0xFF, 0xFF, opcodes.OP_ADD, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_1, opcodes.OP_SUB])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_SUB, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0xFF, 4, 0xFF, 0xFF, 0xFF, 0x7F, opcodes.OP_SUB, opcodes.OP_SIZE, opcodes.OP_5, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0x7F, 4, 0xFF, 0xFF, 0xFF, 0x7F, opcodes.OP_SUB, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_MUL, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_3, opcodes.OP_MUL, opcodes.OP_6, opcodes.OP_EQUAL])
    await pass([4, 0xFF, 0xFF, 0xFF, 0x7F, 4, 0xFF, 0xFF, 0xFF, 0x7F, opcodes.OP_MUL])
    await pass([opcodes.OP_1, opcodes.OP_1NEGATE, opcodes.OP_MUL, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_DIV, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_5, opcodes.OP_2, opcodes.OP_DIV, opcodes.OP_2, opcodes.OP_EQUAL])
    await pass([opcodes.OP_2, opcodes.OP_1NEGATE, opcodes.OP_DIV, 1, 130, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_MOD, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_5, opcodes.OP_2, opcodes.OP_MOD, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_5, 1, 0x82, opcodes.OP_MOD, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([1, 0x83, opcodes.OP_2, opcodes.OP_MOD, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_BOOLAND])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_BOOLAND, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_BOOLOR])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_BOOLOR, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_NUMEQUAL])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_NUMEQUAL, opcodes.OP_NOT])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_NUMEQUALVERIFY, opcodes.OP_1])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_NUMNOTEQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_NUMNOTEQUAL, opcodes.OP_NOT])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_LESSTHAN])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_LESSTHAN])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_LESSTHAN, opcodes.OP_NOT])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_GREATERTHAN])
    await pass([opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_GREATERTHAN])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_GREATERTHAN, opcodes.OP_NOT])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_LESSTHANOREQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_LESSTHANOREQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_LESSTHANOREQUAL])
    await pass([opcodes.OP_1, opcodes.OP_0, opcodes.OP_GREATERTHANOREQUAL])
    await pass([opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_GREATERTHANOREQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_GREATERTHANOREQUAL])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_MIN, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_MIN, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_MIN, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_1, opcodes.OP_MAX, opcodes.OP_1, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_MAX, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_MAX, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_WITHIN])
    await pass([opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_1, opcodes.OP_WITHIN])
    await pass([9, 0, 0, 0, 0, 0, 0, 0, 0, 1, opcodes.OP_BIN2NUM])
    await pass([4, 128, 0, 0, 1, opcodes.OP_BIN2NUM, opcodes.OP_1NEGATE, opcodes.OP_EQUAL])
    await pass([7, 0, 0, 0, 0, 0, 0, 0, opcodes.OP_BIN2NUM, opcodes.OP_0, opcodes.OP_EQUAL])
    await pass([5, 129, 0, 0, 0, 0, opcodes.OP_BIN2NUM])
    await pass([opcodes.OP_1, opcodes.OP_16, opcodes.OP_NUM2BIN])
    await pass([opcodes.OP_0, opcodes.OP_4, opcodes.OP_NUM2BIN, opcodes.OP_0, opcodes.OP_NUMEQUAL])
    await pass([opcodes.OP_1, opcodes.OP_1, opcodes.OP_16, opcodes.OP_NUM2BIN, opcodes.OP_BIN2NUM, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1NEGATE, opcodes.OP_DUP, opcodes.OP_16, opcodes.OP_NUM2BIN, opcodes.OP_BIN2NUM, opcodes.OP_EQUAL])
    await pass([opcodes.OP_1, 5, 129, 0, 0, 0, 0, opcodes.OP_NUM2BIN])
    await pass([opcodes.OP_1, opcodes.OP_RIPEMD160])
    await pass([opcodes.OP_0, opcodes.OP_RIPEMD160])
    await pass(encodePushData(decodeHex('cea1b21f1a739fba68d1d4290437d2c5609be1d3')).concat(
      encodePushData(decodeHex('0123456789abcdef'))).concat([opcodes.OP_RIPEMD160, opcodes.OP_EQUAL]))
    await pass([opcodes.OP_1, opcodes.OP_SHA1])
    await pass([opcodes.OP_0, opcodes.OP_SHA1])
    await pass(encodePushData(decodeHex('0ca2eadb529ac2e63abf9b4ae3df8ee121f10547')).concat(
      encodePushData(decodeHex('0123456789abcdef'))).concat([opcodes.OP_SHA1, opcodes.OP_EQUAL]))
    await pass([opcodes.OP_1, opcodes.OP_SHA256])
    await pass([opcodes.OP_0, opcodes.OP_SHA256])
    await pass(encodePushData(decodeHex('55c53f5d490297900cefa825d0c8e8e9532ee8a118abe7d8570762cd38be9818')).concat(
      encodePushData(decodeHex('0123456789abcdef'))).concat([opcodes.OP_SHA256, opcodes.OP_EQUAL]))
    await pass([opcodes.OP_1, opcodes.OP_HASH160])
    await pass([opcodes.OP_0, opcodes.OP_HASH160])
    await pass(encodePushData(decodeHex('a956ed79819901b1b2c7b3ec045081f749c588ed')).concat(
      encodePushData(decodeHex('0123456789abcdef'))).concat([opcodes.OP_HASH160, opcodes.OP_EQUAL]))
    await pass([opcodes.OP_1, opcodes.OP_HASH256])
    await pass([opcodes.OP_0, opcodes.OP_HASH256])
    await pass(encodePushData(decodeHex('137ad663f79da06e282ed0abbec4d70523ced5ff8e39d5c2e5641d978c5925aa')).concat(
      encodePushData(decodeHex('0123456789abcdef'))).concat([opcodes.OP_HASH256, opcodes.OP_EQUAL]))
  })

  it('checksig', async () => {
    const rawtx = '0100000001b207aba3f19358f3a58048d7647cff2ca25a57fe92a1c4324ba47fdde7d7eca4030000006a4730440220316f5707b0a872c67bebc10f15832389c96a6be58e803c992d6b4b3bc5864687022019cf6ab02706865b8507a4f56eeae155ac794a363d95dce8c8777c10f1f9fc01412103093313584be3ccd8777947c1b8f9cc945e9764296451aa29209f9ac56eb4e91affffffff03204e0000000000001976a91461ed573d90e9582689739e72d17624b2d8faa4c388ac204e0000000000001976a914fca1fe054916c043dc36d703a464cb6edce8e72e88ac5b0c6e01000000001976a91400937c46183f418f8eaac2af10db62c5c852ffe888ac00000000'
    const prevrawtx = '01000000014b71d4aa217e6e515f343c1b5f3e6294fd416e8fa782b089a412c6e32ad0ed07050000006a4730440220449b66c7ec56b6e6f4c133e3cce67cb74e97bbc924deb3f4dbf43e3de941d05e0220649510d81de69df1bbef6b627dab88e20fa272a811613f97503c45715146c929412103a8ff752878232a096647f90350851419daca06a498f382de8b89772930ad4727ffffffff0450c30000000000001976a914902bfe624e2620a4615e7bb6511abd2c2fc7ff7d88ac204e0000000000001976a9149e2f22092ab09053c8be4a662045c069205a511588ac10270000000000001976a914eec1eda286b8fd1a198b6f6ee103bd24d3cdbd5188ac37a96e01000000001976a9149595b9d204ca44fde3b4fb43eff8e8b9d74edd8a88ac00000000'
    const vin = 0
    const tx = decodeTx(decodeHex(rawtx))
    const prevtx = decodeTx(decodeHex(prevrawtx))
    const input = tx.inputs[vin]
    const vout = input.vout
    const unlockScript = input.script
    const prevout = prevtx.outputs[vout]
    const lockScript = prevout.script
    const parentSatoshis = prevout.satoshis
    await verifyScriptAsync(unlockScript, lockScript, tx, vin, parentSatoshis)
  })

  it.skip('checkmultisig', async () => {
    // TODO
  })

  it('invalid', async () => {
    async function fail (script) {
      await expect(verifyScriptAsync([], script)).to.be.rejected
    }

    await fail([])
    await fail([opcodes.OP_FALSE])
    await fail([1])
    await fail([3, 0, 1])
    await fail([opcodes.OP_PUSHDATA1, 0])
    await fail([opcodes.OP_PUSHDATA1, 1])
    await fail([opcodes.OP_PUSHDATA1, 10, 0])
    await fail([opcodes.OP_PUSHDATA2, 20, 0])
    await fail([opcodes.OP_PUSHDATA4, 30, 0])
    await fail([opcodes.OP_IF, opcodes.OP_ENDIF])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_IF])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_NOTIF])
    await fail([opcodes.OP_1, opcodes.OP_ELSE])
    await fail([opcodes.OP_1, opcodes.OP_ENDIF])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_IF, opcodes.OP_ELSE])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_IF, opcodes.OP_IF, opcodes.OP_ENDIF])
    await fail([opcodes.OP_0, opcodes.OP_IF, opcodes.OP_1, opcodes.OP_ELSE, opcodes.OP_0, opcodes.OP_ENDIF])
    await fail([opcodes.OP_0, opcodes.OP_IF, opcodes.OP_PUSHDATA1, 1, 1, opcodes.OP_1, opcodes.OP_ENDIF])
    await fail([opcodes.OP_VERIFY])
    await fail([opcodes.OP_0, opcodes.OP_VERIFY])
    await fail([opcodes.OP_RETURN])
    await fail([opcodes.OP_FALSE, opcodes.OP_RETURN])
    await fail([opcodes.OP_TOALTSTACK, opcodes.OP_1])
    await fail([opcodes.OP_FROMALTSTACK, opcodes.OP_1])
    await fail([opcodes.OP_0, opcodes.OP_TOALTSTACK, opcodes.OP_1, opcodes.OP_FROMALTSTACK])
    await fail([opcodes.OP_IFDUP])
    await fail([opcodes.OP_DROP])
    await fail([opcodes.OP_1, opcodes.OP_DROP, opcodes.OP_DROP])
    await fail([opcodes.OP_DUP])
    await fail([opcodes.OP_NIP])
    await fail([opcodes.OP_1, opcodes.OP_NIP])
    await fail([opcodes.OP_OVER])
    await fail([opcodes.OP_1, opcodes.OP_OVER])
    await fail([opcodes.OP_PICK])
    await fail([opcodes.OP_0, opcodes.OP_PICK])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_PICK])
    await fail([opcodes.OP_ROLL])
    await fail([opcodes.OP_0, opcodes.OP_ROLL])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_ROLL])
    await fail([opcodes.OP_ROT])
    await fail([opcodes.OP_1, opcodes.OP_ROT])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_ROT])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_1, opcodes.OP_ROT])
    await fail([opcodes.OP_SWAP])
    await fail([opcodes.OP_1, opcodes.OP_SWAP])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_SWAP])
    await fail([opcodes.OP_TUCK])
    await fail([opcodes.OP_1, opcodes.OP_TUCK])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_TUCK])
    await fail([opcodes.OP_2DROP])
    await fail([opcodes.OP_1, opcodes.OP_2DROP])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_2DROP])
    await fail([opcodes.OP_2DUP])
    await fail([opcodes.OP_1, opcodes.OP_2DUP])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_2DUP])
    await fail([opcodes.OP_3DUP])
    await fail([opcodes.OP_1, opcodes.OP_3DUP])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_3DUP])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_0, opcodes.OP_3DUP])
    await fail([opcodes.OP_2OVER])
    await fail([opcodes.OP_1, opcodes.OP_2OVER])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_2OVER])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2OVER])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2OVER])
    await fail([opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2ROT])
    await fail([opcodes.OP_2SWAP])
    await fail([opcodes.OP_1, opcodes.OP_2SWAP])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_2SWAP])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2SWAP])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_1, opcodes.OP_1, opcodes.OP_2SWAP])
    await fail([opcodes.OP_CAT])
    await fail([opcodes.OP_1, opcodes.OP_CAT])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_0, opcodes.OP_CAT])
    await fail([opcodes.OP_SPLIT])
    await fail([opcodes.OP_1, opcodes.OP_SPLIT])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_SPLIT])
    await fail([opcodes.OP_1, opcodes.OP_2, opcodes.OP_SPLIT])
    await fail([opcodes.OP_1, opcodes.OP_1NEGATE, opcodes.OP_SPLIT])
    await fail([opcodes.OP_0, opcodes.OP_SIZE])
    await fail([opcodes.OP_AND])
    await fail([opcodes.OP_0, opcodes.OP_AND])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_AND])
    await fail([opcodes.OP_OR])
    await fail([opcodes.OP_0, opcodes.OP_OR])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_OR])
    await fail([opcodes.OP_XOR])
    await fail([opcodes.OP_0, opcodes.OP_XOR])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_XOR])
    await fail([opcodes.OP_LSHIFT])
    await fail([opcodes.OP_1, opcodes.OP_LSHIFT])
    await fail([opcodes.OP_1, opcodes.OP_1NEGATE, opcodes.OP_LSHIFT])
    await fail([opcodes.OP_RSHIFT])
    await fail([opcodes.OP_1, opcodes.OP_RSHIFT])
    await fail([opcodes.OP_1, opcodes.OP_1NEGATE, opcodes.OP_RSHIFT])
    await fail([opcodes.OP_INVERT])
    await fail([opcodes.OP_EQUAL])
    await fail([opcodes.OP_0, opcodes.OP_EQUAL])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_EQUAL])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_EQUALVERIFY, opcodes.OP_1])
    await fail([opcodes.OP_1ADD])
    await fail([opcodes.OP_1SUB])
    await fail([opcodes.OP_NEGATE])
    await fail([opcodes.OP_ABS])
    await fail([opcodes.OP_NOT])
    await fail([opcodes.OP_0NOTEQUAL])
    await fail([opcodes.OP_ADD])
    await fail([opcodes.OP_1, opcodes.OP_ADD])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_ADD])
    await fail([opcodes.OP_SUB])
    await fail([opcodes.OP_1, opcodes.OP_SUB])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_SUB])
    await fail([opcodes.OP_MUL])
    await fail([opcodes.OP_1, opcodes.OP_MUL])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_MUL])
    await fail([2, 0, 0, 2, 0, 0, opcodes.OP_MUL])
    await fail([opcodes.OP_DIV])
    await fail([opcodes.OP_1, opcodes.OP_DIV])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_DIV])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_DIV])
    await fail([opcodes.OP_MOD])
    await fail([opcodes.OP_1, opcodes.OP_MOD])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_MOD])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_MOD])
    await fail([opcodes.OP_BOOLAND])
    await fail([opcodes.OP_1, opcodes.OP_BOOLAND])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_BOOLAND])
    await fail([opcodes.OP_BOOLOR])
    await fail([opcodes.OP_1, opcodes.OP_BOOLOR])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_BOOLOR])
    await fail([opcodes.OP_NUMEQUAL])
    await fail([opcodes.OP_1, opcodes.OP_NUMEQUAL])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_NUMEQUAL])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_NUMEQUAL])
    await fail([opcodes.OP_NUMEQUALVERIFY])
    await fail([opcodes.OP_1, opcodes.OP_NUMEQUALVERIFY])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_NUMEQUALVERIFY])
    await fail([opcodes.OP_1, opcodes.OP_2, opcodes.OP_NUMEQUALVERIFY])
    await fail([opcodes.OP_NUMNOTEQUAL])
    await fail([opcodes.OP_1, opcodes.OP_NUMNOTEQUAL])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_NUMNOTEQUAL])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_NUMNOTEQUAL])
    await fail([opcodes.OP_LESSTHAN])
    await fail([opcodes.OP_1, opcodes.OP_LESSTHAN])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_LESSTHAN])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_LESSTHAN])
    await fail([opcodes.OP_GREATERTHAN])
    await fail([opcodes.OP_1, opcodes.OP_GREATERTHAN])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_GREATERTHAN])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_GREATERTHAN])
    await fail([opcodes.OP_LESSTHANOREQUAL])
    await fail([opcodes.OP_1, opcodes.OP_LESSTHANOREQUAL])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_LESSTHANOREQUAL])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_LESSTHANOREQUAL])
    await fail([opcodes.OP_GREATERTHANOREQUAL])
    await fail([opcodes.OP_1, opcodes.OP_GREATERTHANOREQUAL])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_GREATERTHANOREQUAL])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_GREATERTHANOREQUAL])
    await fail([opcodes.OP_MIN])
    await fail([opcodes.OP_1, opcodes.OP_MIN])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_MIN])
    await fail([opcodes.OP_MAX])
    await fail([opcodes.OP_1, opcodes.OP_MAX])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_MAX])
    await fail([opcodes.OP_WITHIN])
    await fail([opcodes.OP_1, opcodes.OP_WITHIN])
    await fail([opcodes.OP_1, opcodes.OP_1, opcodes.OP_WITHIN])
    await fail([5, 0, 0, 0, 0, 0, opcodes.OP_WITHIN])
    await fail([opcodes.OP_0, opcodes.OP_1, opcodes.OP_2, opcodes.OP_WITHIN])
    await fail([opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_WITHIN])
    await fail([opcodes.OP_BIN2NUM])
    await fail([opcodes.OP_NUM2BIN])
    await fail([opcodes.OP_1, opcodes.OP_NUM2BIN])
    await fail([opcodes.OP_1, opcodes.OP_0, opcodes.OP_NUM2BIN])
    await fail([opcodes.OP_1, opcodes.OP_1NEGATE, opcodes.OP_NUM2BIN])
    await fail([5, 129, 0, 0, 0, 0, opcodes.OP_1, opcodes.OP_NUM2BIN])
    await fail([opcodes.OP_RIPEMD160])
    await fail([opcodes.OP_SHA1])
    await fail([opcodes.OP_SHA256])
    await fail([opcodes.OP_HASH160])
    await fail([opcodes.OP_HASH256])
    await fail([opcodes.OP_CHECKSIG])
    await fail([opcodes.OP_1, opcodes.OP_CHECKSIG])
    await fail([opcodes.OP_CHECKSIGVERIFY])
    await fail([opcodes.OP_1, opcodes.OP_CHECKSIGVERIFY])
    await fail([opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_1, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_0, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_1NEGATE, opcodes.OP_0, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_0, opcodes.OP_1, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_0, 1, 21, opcodes.OP_CHECKMULTISIG])
    await fail([opcodes.OP_0, opcodes.OP_9, opcodes.OP_9, opcodes.OP_2, opcodes.OP_9, opcodes.OP_1, opcodes.OP_CHECKMULTISIG])
  })
})
