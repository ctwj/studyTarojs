import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.less'

class Child1 extends Component {

  constructor(props) {
    this.setState({
      isShow: false
    })
  }

  componentDidMount () {
    this.props.onTriggerRefs(this)
  }

  toggleSpeical () {
    Taro.showModal({
      'title': '我来自子组件Child1'
    })
    let { isShow } = this.state
    this.setState({
      isShow: !isShow
    })
  }

  parentEve () {
    this.props.onParentEvent()
  }

  render () {
    let { isShow } = this.state
    let specialClass = isShow ? 'special' : 'special hide'
    return (
      <View className='component'>
        <View className='title'>
          <Text>子组件 Child1</Text>
        </View>
        <View className='title'>
          <Text>来自父组件 {this.props.random}</Text>
        </View>
        <View onClick={this.parentEve} className='title'>
          <Text>子组件 Child1 调用父组件函数</Text>
        </View>

        <View className={specialClass}>
          <Text>我是子组件的隐藏区域</Text>
        </View>
      </View>
    )
  }
}

export default Child1;
