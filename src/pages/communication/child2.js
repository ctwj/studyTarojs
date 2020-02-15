import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'

class Child2 extends Component {
  componentDidMount () {
    console.log(this.props, this.state)
  }
  render () {
    let { isShow } = this.props.communication
    let specialClass = isShow ? 'special' : 'special hide'
    return (
      <View className='component'>
        <View className='title'>
          <Text>子组件 Child1</Text>
        </View>

        <View className={specialClass}>
          <Text>我是子组件的隐藏区域</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let { communication } = state
  return {
    communication
  }
}

export default connect(mapStateToProps)(Child2)
