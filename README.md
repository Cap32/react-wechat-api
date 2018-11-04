# react-wechat-api

[WIP] React Wechat JSSDK component for SPA

## Installation

```config
$ yarn add react-wechat-api
```

## Usage

##### Example with react-router v4

**App.js**

```jsx
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { WechatAPIProvider } from "recat-wechat-api";
import wx from "weixin-js-sdk";
import HomePage from "./containers/HomePage";

const getConfig = ({ url }) =>
  fetch(`https://aweso.me/api/wx?url=${url}`).then(res => res.json());
/* should return an object like {
  appId: "wx05d8cb9deee3c05c",
  nonceStr: "nw0y6jnq1ie",
  signature: "e50d96cb73c09ba1e5848456d1ae90ec1b7ccf43",
  timestamp: 1541346529448
} */

const defaultShareData = {
  title: "Wechat API",
  desc: "Wechat API component for react",
  link: () => window.location.href,
  imgUrl: `${window.location.origin}/icon.png`
};

const defaultJsApiList = [
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "onMenuShareQQ",
  "onMenuShareQZone"
];

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route>
          {props => (
            <WechatAPIProvider
              {...props}
              wx={wx}
              getConfig={getConfig}
              jsApiList={defaultJsApiList}
              shareData={defaultShareData}
            >
              <Switch>
                <Route path="/" component={HomePage} />
                {/* other routes... */}
              </Switch>
            </WechatAPIProvider>
          )}
        </Route>
      </BrowserRouter>
    );
  }
}
```

**HomePage.js**

```jsx
import React, { Component } from "react";
import { WechatAPI } from "recat-wechat-api";

export default class HomePage extends Component {
  state = {
    shareData: {
      title: "Awesome!!!"
    }
  };

  render() {
    return (
      <WechatAPI shareData={this.state.shareData}>
        <div>
          <h1>Awesome</h1>
        </div>
      </WechatAPI>
    );
  }
}
```

## License

MIT
