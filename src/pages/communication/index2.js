import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import Child from './child2'
import './index.less'

@connect(({ communication, loading }) => ({ communication, ...loading }))
class Commu2 extends Component {

  showSubSpecial () {
    let { dispatch } = this.props
    let { isShow } = this.props.communication
    dispatch({
      type: 'communication/toggleShow',
      payload: {
        isShow: !isShow
      }
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

        <Child></Child>
      </View>
    )
  }
}

export default Commu2;
