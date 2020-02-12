import Taro, { Component, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.less';

import Loading from '../../components/Loading'

@connect(({ info, loading }) => ({ info, loading }))
class Info extends Component {

  componentDidMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'info/getData'
    })
  }

  config = {
    "navigationBarTitleText": "Tarojs Demo",
    "backgroundColor": "#160F2E",
    "navigationBarBackgroundColor": "#160F2E",
    "navigationBarTextStyle": "white",
    "disableScroll": true
  }

  static options = {
    addGlobalClass: true
  }



  render () {
    const { loading } = this.props
    const isLoading = loading.effects['info/getData'];
    console.log('isloading', isLoading);

    let { data } = this.props.info
    if (data === undefined) {
      data = {
        statistics: {
          imgUrl: ''
        }
      }
    }

    return (
      <View className='my-page'>
        {
          isLoading && <Loading></Loading>
        }
        {
          !isLoading &&
          <View className='data-wrap'>
            <Image
              className='img'
              src={data.statistics.imgUrl}
            ></Image>
          </View>
        }
      </View>
    )
  }
}

export default Info;
