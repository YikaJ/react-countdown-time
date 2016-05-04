import React, {PropTypes, Component} from 'react'
import leftpad from './util-leftpad'

class CountDown extends Component {

  constructor(props) {
    super(props)

    const subTime = this.getNewRestTime(props.expireTime)
    const restTime = subTime < 0 ? 0 : subTime

    this.state = {
      restTime
    }

    this.updateTimer = setTimeout(()=>this.updateRestTime(), 1000)

    this.updateRestTime.bind(this)
  }

  getNewRestTime(expireTime) {
    return parseInt((expireTime - Date.now())/ 1000)
  }

  getFormateTime(time) {
    const d = leftpad(parseInt(time / (24 * 60 * 60)), 2, 0)
    const h = leftpad(parseInt(time / (60 * 60) % 24), 2, 0)
    const m = leftpad(parseInt(time / 60 % 60), 2, 0)
    const s = leftpad(parseInt(time % 60), 2, 0)

    return {d,h,m,s}
  }

  updateRestTime() {
    const {expireTime, onEnd} = this.props
    const newRestTime = this.getNewRestTime(expireTime)

    this.setState({restTime: newRestTime})
    // when CountDown is end
    if(newRestTime <= 0) {
      onEnd()
      return clearTimeout(this.updateTimer)
    }

    setTimeout(()=>this.updateRestTime(), 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimer)
  }

  componentWillReceiveProps(nextProps) {
    const {expireTime} = nextProps

    // if parent component update expireTime, CountDown will change restTime too
    if(expireTime.getTime() !== this.props.expireTime.getTime()) {
      const restTime = this.getNewRestTime(expireTime)
      this.setState({restTime})
    }
  }

  render() {
    const {restTime} = this.state
    const {overText, children} = this.props
    const isOver = restTime <= 0

    const date = !isOver && this.getFormateTime(restTime)

    return (
      <h5>
        {isOver ?
           overText :
           children(date)
        }
      </h5>
    )
  }
}

CountDown.defaultProps = {
  overText: '时间已过期'
}

CountDown.PropTypes = {
  expireTime: PropTypes.number.isRequired,
  overText: PropTypes.oneOf([PropTypes.string, PropTypes.element]),
  children: PropTypes.func.isRequired,
  onEnd: PropTypes.func
}

export default CountDown
