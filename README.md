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


# 一 Tarojs 集成 DVA

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

微信<img src="https://github.com/ctwj/studyTarojs/blob/master/images/wechat.png?raw=true" width="375">抖音<img src="https://github.com/ctwj/studyTarojs/blob/master/images/bytedance.png?raw=true" width="375">

# 二 添加组件

本节通过添加一个加载页面来演示 组件的添加和使用

### 添加组件代码

在 `src` 目录下 添加 `components` 目录， 目录内新建一个组件目录 `Loading`
添加  `index.js` 和 `index.less`

`index.js`
```
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
```

由于，只适用于显示加载状态，所以组件中，并没有使用到 `model`， `接口`, 
主要的核心就是 render 函数渲染的部分。为节省篇幅， 不再帖 `index.less`,可以到项目中查看

### 使用组件

1. 引用组件 
2. 使用组件

在页面中， `pages/index/index.js`
```
......
+ import Loading from '../../components/Loading'
......

render (props) {
    // const { loading } = props

    useEffect(() => {
      console.log(props)
    }, [])

    return (
      <View className='my-page'>
        <Text className='hello'>Hello World</Text>
+       <Loading></Loading>
      </View>
    )
  }
```

到这里已经新加一个组件并使用到了我们的页面中， 不过还有几个问题
1. 如果需要在组件中发起动作 dispatch ，应该怎么处理

>需要在组件中引入`import { connect } from '@tarojs/redux';`
>并把 `state` 映射到 `props` 中， `connect` 一下，就能 `dispatch` 了

2. 在父类绑定一个事件在组件上，组件是否能够调用

>在父类上绑定时 onClick={this.ClickMe.bind(this)}， 组件就能直接调用了

# 三 dva-loading 使用

在前面，实现了一个简单的 `Loading` 组件， 这一节， 我们按需来使用 `Loading` 组件

请求接口： https://service-f9fjwngp-1252021671.bj.apigw.tencentcs.com/release/pneumonia
在接口处理期间， 显示加载组件， 加载完显示相应内容

这里新添加一个页面 `info` 来演示， 在 `pages` 目录下添加 `info` 目录
添加  `index.js` `index.less` `model.js` `service.js`
在 `app.js` 中的 `config.pages` 中， 添加页面定义

给 `index` 界面的 `hello world` 添加点击事件， 点击跳转到新加的`info`界面
```
......
  navigationInfo () {
    Taro.navigateTo({
      url: '/pages/info/index'
    })
  }

  render (props) {
    // const { loading } = props

    useEffect(() => {
      console.log(props)
    }, [])

    return (
      <View className='my-page'>
        <Text className='hello' onClick={this.navigationInfo}>Hello World</Text>
      </View>
    )
  }
......
```

下面，开始定义接口和使用接口，并使用`dva-loading`

index.js
```
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
```

这里的重点是进行接口请求的监听， 
>const isLoading = loading.effects['info/getData'];

在 `componentDidMount` 进行初始化， 时会调用到这个接口，
这个时候， 页面处于加载状态，会显示加载组件， 加载完成后，显示获取到的数据

model.js
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

service.js
```
import Request from '../../utils/request';

export const getData = () => {
  return Request({
    url: 'release/pneumonia',
    method: 'GET',
  });
};
```

更多代码详情请查看代码分支 `loading`
预览 <img src="https://github.com/ctwj/studyTarojs/blob/master/images/loading-tt.gif?raw=true" width="375">

# 四 父子组件之间的通信

`dva` 集成了 `redux` 用来做转态管理, 在不适用 `redux` 的情况，也可以进行父子组件之间的通信 

新建 `communication` 页作为父组件， `index.less` 公共样式
新建对应的文件  `index1.js`,`childone.js` 作为无转态管理的父子通信示例 `Child1`
新建 `index2.js`,`childtwo.js` 作为存在状态管理的父子通信示例 `Child2`

因为是否使用状态管理， 初始化代码并不完全相同， 所以写了两个实例页面。

### 1. 没有状态管理的情况下， 父子组件之间的通信

`index1.js`
```
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

        <Child random={this} onParentEvent={this.parentFunction} onTriggerRefs={this.bindRef.bind(this)}></Child>
      </View>
    )
  }
}

export default Commu1;
```

`child1.js`
```
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

        <View className='hidearea'>
          <Text>子组件下隐藏区域</Text>
        </View>
        <View className={specialClass}>
          <Text>我是子组件的隐藏区域</Text>
        </View>
      </View>
    )
  }
}

export default Child1;
```

子组件调用父组件的方法和变量， 还是很方便的， 只需要在调用子组件的时候， 传递一个事件既可以实现
`<Child random={this} onParentEvent={this.parentFunction} onTriggerRefs={this.bindRef.bind(this)}></Child>`

父组件获取子组件的变量， 只要向子组件传递一个函数接收就行了

但是， 父组件调用自己建的方法，就比较麻烦了， 

  1. 父组件向子组件传递一个方法  onTriggerRefs={this.bindRef.bind(this)
  2. 在子组件的 componentDidMount 方法中 this.props.onTriggerRefs(this) 将 this 传递出来
  3. 通过 bindRef 将子组件 this 复制给 this.children
  4. 通过 this.children 直接调用子组件函数

除了调用子组件函数， 其他还是比较容易，代码也不复杂， 但是，父组件调用子组件函数就很麻烦了。

### 2. 使用 `redux`

`index2.js`
```
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
```


`child2.js`
```
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
```

可以看到， 其实共享状态， 已经不分什么父组件子组件了， 状态都可以当做自己组件的一部分
组件可以根据需要，来加载自己组件需要的一些状态， 根据状态来决定页面的显示。

具体代码参考 分支 `communication`
