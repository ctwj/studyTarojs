import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Child from './child1'
import './index.less'

class Commu1 extends Component {

  constructor(props) {
    super(props)
    this.children = null
    this.random = Math.random(0, 1)
  }

  bindRef (ref) {
    this.children = ref
  }
  showSubSpecial () {
    this.children.toggleSpeical()
  }

  parentFunction () {
    Taro.showModal({
      title: '我来自父组件'
    })
  }

  render () {
    return (
      <View className='my-page'>
        <View className='controller'>
          <View>
            <Text>父组件</Text>
          </View>
          <View>
            <Text>{this.random}</Text>
          </View>
          <View>
            <Text onClick={this.showSubSpecial}>调用子组件函数</Text>
          </View>
        </View>

        <Child random={this.random} onParentEvent={this.parentFunction} onTriggerRefs={this.bindRef.bind(this)}></Child>
      </View>
    )
  }
}

export default Commu1;
