# Taro 跨端方案学习

支持：微信/百度/支付宝/字节跳动/QQ/京东小程序、快应用、H5、React-Native

## 简介
Taro 是一套遵循 React 语法规范的 多端开发 解决方案。

现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

使用 Taro，我们可以只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动/QQ/京东小程序、快应用、H5、React-Native 等）运行的代码。


## 前置知识

[Redux-React全局状态管理工具之一](https://cn.redux.js.org/)

[dva-让你的全局状态管理更简单](https://dvajs.com/)

[React-用于构建用户界面的 JavaScript 库](https://zh-hans.reactjs.org/)

[React Hooks-更优雅的React应用书写方式](https://zh-hans.reactjs.org/docs/hooks-intro.html)

[小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/)

[Taro-基于React的小程序框架](https://nervjs.github.io/taro/docs/README.html)


# Tarojs 集成 DVA

### 1. 安装 Taro脚手架 

```node
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli
```


### 2. 脚手架完成后使用脚手架初始化一个新项目

在你需要建立项目的文件夹打开 CMD

```node
taro init test
```

然后跟着流程走，不选择 `Typescript` 因为还不熟悉,css选择`less`,模版选择默认模版。

然后命令行在`test` 目录打开，安装我们需要用的扩展

```node
cnpm install --save @tarojs/async-await 
cnpm install --save redux @tarojs/redux @tarojs/redux-h5 redux-thunk redux-logger
cnpm install --save dva-core dva-loading
cnpm install --save taro-axios
```

这四个命令安装完之后，打开`./src` 目录 ，新建两个文件夹 ，一个叫  `utils`  一个叫 `models`
在 `utils` 文件夹下面新建文件 `dva.js` 写上下面的内容  注册dva

```js
import { create } from 'dva-core';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
let app;
let store;
let dispatch;

function createApp(opt) {
  app = create(opt);
  app.use(createLoading({}));

  if (!global.registered) opt.models.forEach(model => app.model(model));
  global.registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}
export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  }
}
```

在 `utils` 文件夹下面新建文件 `request.js` 写上下面的内容  封装一个简单的`axios`

```js
import axios from "taro-axios";
const baseURL = `https://test.cn`
const service = axios.create({
    baseURL: baseURL,
    withCredentials: true, 
    timeout: 300000
});
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error)
    })

export default service
```

在 `model` 文件夹下面新建文件 `model.js` 写上下面的内容, 连接你每个页面的仓库注册到全局

```js
import index from '../pages/index/model';

export default [index];
```

下一步 修改 `./src/app.jsx` 作用就是把我们所有的仓库连接进来 

```js
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
  componentDidMount() { }
  componentDidShow() { }
  componentDidHide() { }
  componentDidCatchError() { }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>

    )
  }
}
Taro.render(<App />, document.getElementById('app'))
```

删除 `pages/index` 下文件， 重写`index`页面

`index.js`
```
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

  render (props) {
    // const { loading } = props

    useEffect(() => {
      console.log(props)
    }, [])

    return (
      <View className='my-page'>
        <Text className='hello'>Hello World</Text>
      </View>
    )
  }
}

export default Index;
```

`index.less`
```
.my-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, grey, rgb(58, 44, 44));

  .hello {
    font-size: 64px;
    font-size: grey;
  }
}
```

`model.js`
```
import * as Api from './service';

export default {
  namespace: 'index',
  state: {
    my: '',
    test: 'test'
  },

  effects: {
    * effectsDemo (_, { call, put }) {
      const { status, data } = yield call(Api.demo, {});
      if (status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            topData: data,
          }
        });
      }
    },
  },

  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
```

`service.js`
```
import Request from '../../utils/request';

export const demo = (data) => {
  return Request({
    url: 'http://www.baidu.com',
    method: 'POST',
    data,
  });
};
```


###  3. 试试效果！

```node
npm run dev:weapp
npm run dev:tt
```
然后用对应的工具， 打开项目内的`dist`文件夹

