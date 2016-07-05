var expect = require('chai').expect

describe('Neural network ## ', function () {
  describe('', function () {

    var neuralNet = require('../src/neural.js')

    it('examine existence', function () {
      expect(neuralNet).to.be.defined
    })

    it('should have function calculateNeurons', function () {
      expect(neuralNet.calculateNeurons).to.not.be.undefined
    })
    // it('should have function generateRandomBrain', function () {
    //   expect(neuralNet.generateRandomBrain).to.not.be.undefined
    // })
    it('should have function totalError', function () {
      expect(neuralNet.totalError).to.not.be.undefined
    })
  })

  // describe('backpropagation', function () {
  //   var neuralNet = require('../src/neural.js')
  //   it('total error calculation function', function () {
  //     expect(neuralNet.totalError(10, 10)).to.equal(0)
  //   })
  // })
})
