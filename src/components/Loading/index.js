import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.less'

export default class Loading extends Component {
  render () {
    return <View className='loadingWrap'>
      <View className='itemsWrap itemsAnimation'>
        <View className='item'></View>
        <View className='item itemleft'></View>
        <View className='item itemright'></View>
      </View>
      <View className='loadingText'>
        <Text>加载中</Text>
      </View>
    </View>
  }
}
