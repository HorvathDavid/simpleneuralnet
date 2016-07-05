import React from 'react'
import Neural from '../neural/Neural'

const colors = [
  '#000000'
  // '#FF7F00',
  // '#FFFF00',
  // '#00FF00',
  // '#0000FF',
  // '#4B0082',
  // '#8B00FF'
]

function getRainbowColor () {
  return colors[Math.floor(Math.random() * 7)]
}

function Neuron (props) {
  return (
    <div style={{color: getRainbowColor()}}>
      <strong style={{color: getRainbowColor()}}>Neuron </strong>
      <span> index of neuron: {props.neuron.index}</span>
      <span> is neuron bias: {JSON.stringify(props.neuron.bias)}</span>
      <span> value of neuron: {props.neuron.value}</span>
    </div>
  )
}
function Weight (props) {
  return (
    <div style={{color: getRainbowColor()}}>
      <strong style={{color: getRainbowColor()}}>Wieght </strong>
      <span> value of weight: {props.weight.value}</span>
      <span> weight from this neuron index: {props.weight.fromNeuron}</span>
      <span> weight to this neuron index: {props.weight.toNeuron}</span>
    </div>
  )
}

export default class Container extends React.Component {

  constructor (props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onClick = this._onClick.bind(this)

    this.neural = new Neural([2, 2, 2])
    // this.neural = new Neural({brain: 'backPropLearnBrain'})
    // this.neural.setExpectedOutNeurons({6: 0.5, 7: 0.8})

    this.state = {
      brain: this.neural.calculateNeurons(0.05, 0.1),
      error: this.neural.totalError()
    }
  }

  componentDidMount () {
  }

  _onChange (event) {
    this.setState({
      inputValue: event.target.value
    })
  }
  _onClick (event) {
    console.log(this.neural.learningRate)
    const learningData = [
      {
        in: {0: 0, 1: 1},
        out: {6: 0, 7: 1}
      },
      {
        in: {0: 1, 1: 0},
        out: {6: 0, 7: 1}
      },
      {
        in: {0: 0, 1: 0},
        out: {6: 0, 7: 0}
      },
      {
        in: {0: 1, 1: 1},
        out: {6: 0, 7: 0}
      }
    ]
    console.time('backprop')
    if (this.refs.repeat.value > 0) {
      for (var i = 0; i < this.refs.repeat.value; i++) {
        let options = learningData[Math.floor(Math.random() * 4)]
        this.neural.backProp(options)
      }
      console.timeEnd('backprop')
      this.neural.setExpectedOutNeurons({6: 0, 7: 0})
      this.setState({
        brain: this.neural.calculateNeurons(0, 0),
        error: this.neural.totalError(),
        expectedValues: this.neural.expectedOutPutNeurons
      })
    }
  }

  render () {
    let brain = this.state.brain

    return (
      <div>

        <label>repeat:</label><input value={this.state.inputValue} onChange={this._onChange} ref='repeat' />
        <input type='button' value='Teach brain' onClick={this._onClick} />

        {this.state.error &&
          <h2 style={{color: getRainbowColor()}}>
            Error: {this.state.error}
          </h2>
        }

        {this.state.expectedValues &&
          <div>{JSON.stringify(this.state.expectedValues)}</div>
        }

        <span>
          <div>
            <p>Weights:</p>
            {brain.weights.map((e, i) => {
              return <Weight key={i} weight={e} />
            })}
          </div>
          <div>
            <p>Neurons:</p>
            {brain.neurons.map((e, i) => {
              return <Neuron key={i} neuron={e} />
            })}
          </div>
        </span>

      </div>
    )
  }
}
