import activation from '../util/activation'
import savedBrains from '../../savedBrains.js'

export default class Neural {
  constructor (props) {
    this.brain = this._generateBrain(props)
    this.input1 = null
    this.input2 = null
    this.expectedOutPutNeurons = null
    this.propError = 0
    this.learningRate = 0.8
  }

  _generateBrain (options) {
    if (options instanceof Array && options.length === 3) {
      return {
        weights: [
          [Math.random(), 0, 3],
          [Math.random(), 0, 4],
          [Math.random(), 1, 3],
          [Math.random(), 1, 4],
          [Math.random(), 2, 3],
          [Math.random(), 2, 4],
          [Math.random(), 3, 6],
          [Math.random(), 4, 6],
          [Math.random(), 5, 6],
          [Math.random(), 3, 7],
          [Math.random(), 4, 7],
          [Math.random(), 5, 7]
        ].map((el) => {
          return {value: el[0], fromNeuron: el[1], toNeuron: el[2]}
        }),
        neurons: ((props) => {
          let neurons = []
          for (let i = 0; i < props.numberOFNeurons; i++) {
            neurons.push({'index': i, 'bias': props.bias.indexOf(i) > -1, 'value': null})
          }

          return neurons
        })({numberOFNeurons: 8, bias: [2, 5]})
      }
    } else if (options.brain && savedBrains[options.brain]) {
      return savedBrains[options.brain]
    } else {
      console.error('Given options are wrong.')
    }
  }

  calculateNeurons (input1, input2) {
    if ((!input1 || !input2) && (input1 !== 0 && input2 !== 0)) {
      console.error('Error')
      return
    }

    if (this.input1 !== input1) {
      this.input1 = input1
    }

    if (this.input2 !== input2) {
      this.input2 = input2
    }

    // To clear the calcaulated neurons
    this.brain.neurons.forEach((neuron, indexOfNeuron, neurons) => {
      if (!neurons[indexOfNeuron].bias) {
        neurons[indexOfNeuron].value = null
      }
    })

    this.brain.neurons.forEach((neuron, indexOfNeuron, neurons) => {
      if (!neuron.value) {
        let weightXNeuronValueArray = this.brain.weights.filter((weight) => {
          return weight.toNeuron === indexOfNeuron
        }).map((weight) => {
          return weight.value * neurons[weight.fromNeuron].value
        })

        let sumValue

        if (!weightXNeuronValueArray.length && (neuron.index === 0 || neuron.index === 1)) {
          neuron.value = neuron.index === 0 ? input1 : input2
        } else {
          sumValue = weightXNeuronValueArray.reduce((preValue, nextValue) => {
            return preValue + nextValue
          }, 0)

          neurons[indexOfNeuron].value = activation.logistic.activate(sumValue)
        }
      }
    })

    return this.brain
  }

  totalError () {
    this.calculateNeurons(this.input1, this.input2)

    try {
      this.propError = Object.keys(this.expectedOutPutNeurons).reduce((prev, next) => {
        let errorByNeuron = ((this.expectedOutPutNeurons[next] - this.brain.neurons[next].value) * (this.expectedOutPutNeurons[next] - this.brain.neurons[next].value)) / 2
        this.brain.neurons[next].error = errorByNeuron
        return prev + errorByNeuron
      }, 0)
    } catch (err) {
      console.error(err)
    }

    return this.propError
  }

  backProp (options) {
    if (options.in) {
      this.input1 = options.in[0]
      this.input2 = options.in[1]
    }
    if (options.out) {
      this.expectedOutPutNeurons = options.out
    }
    this.calculateNeurons(this.input1, this.input2)
    this.brain.weights.forEach((weight, index, weightsArray) => {
      if ((weight.toNeuron === 3 || weight.toNeuron === 4)) {
        let weightsToOutPutLayer = this.brain.weights.filter((insideWeight) => {
          return (weight.toNeuron === insideWeight.fromNeuron) && !this.brain.neurons[insideWeight.fromNeuron].bias
        })

        let sumFirstPartOfEquation = weightsToOutPutLayer.reduce((prev, next) => {
          let outNeuron = this.brain.neurons[next.toNeuron].value
          let target = this.expectedOutPutNeurons[next.toNeuron]
          return prev + next.value * (target - outNeuron) * outNeuron * (1 - outNeuron)
        }, 0)

        let outNeuron = this.brain.neurons[weight.toNeuron].value
        let inputNeuronValue = this.brain.neurons[weight.fromNeuron].value
        weightsArray[index].value = weight.value + sumFirstPartOfEquation * outNeuron * (1 - outNeuron) * inputNeuronValue * this.learningRate
      }
    })

    //
    // This part is the second layer, first from back.
    //

    this.brain.weights.forEach((weight, index, weightsArray) => {
      if ((weight.toNeuron === 6 || weight.toNeuron === 7)) {
        let outNeuron = this.brain.neurons[weight.toNeuron].value
        let target = this.expectedOutPutNeurons[weight.toNeuron]
        let outHiddenNeuron = this.brain.neurons[weight.fromNeuron].value
        weightsArray[index].value = weight.value + (target - outNeuron) * outNeuron * (1 - outNeuron) * outHiddenNeuron * this.learningRate
      }
    })
  }

  setExpectedOutNeurons (value) {
    this.expectedOutPutNeurons = value
    return this.expectedOutPutNeurons
  }
}
