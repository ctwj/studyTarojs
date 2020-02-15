import Taro, { Component, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.less';

@connect(({ index, loading }) => ({ ...index, ...loading }))
class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  config = {
    "navigationBarTitleText": "Tarojs Demo",
    "backgroundColor": "#160F2E",
    "navigationBarBackgroundColor": "#160F2E",
    "navigationBarTextStyle": "white",
    "disableScroll": true
  }

  componentDidMount () {

  }

  navigationInfo () {
    Taro.navigateTo({
      url: '/pages/info/index'
    })
  }

  navigationCommunication () {
    Taro.navigateTo({
      url: '/pages/communication/index1'
    })
  }

  navigationCommunication1 () {
    Taro.navigateTo({
      url: '/pages/communication/index2'
    })
  }

  render (props) {
    // const { loading } = props

    useEffect(() => {
      console.log(props)
    }, [])

    return (
      <View className='my-page'>
        <View className=''>
          <Text className='hello' onClick={this.navigationInfo}>dva-loading</Text>
        </View>
        <View className=''>
          <Text className='hello' onClick={this.navigationCommunication}>父子组件通信1</Text>
        </View>
        <View className=''>
          <Text className='hello' onClick={this.navigationCommunication1}>父子组件通信2（redux）</Text>
        </View>
      </View>
    )
  }
}

export default Index;
