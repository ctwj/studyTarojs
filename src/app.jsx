import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import dva from './utils/dva';
import models from './models/models';
import { Provider } from '@tarojs/redux';
import './app.less'

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
class App extends Component {

  componentDidMount () { }

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidShow () { }
  componentDidHide () { }
  componentDidCatchError () { }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>

    )
  }
}
Taro.render(<App />, document.getElementById('app'))
