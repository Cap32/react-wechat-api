# react-wechat-api

[![Build Status](https://travis-ci.org/Cap32/react-wechat-api.svg?branch=master)](https://travis-ci.org/Cap32/react-wechat-api)
[![Coverage Status](https://coveralls.io/repos/github/Cap32/react-wechat-api/badge.svg?branch=master)](https://coveralls.io/github/Cap32/react-wechat-api?branch=master)
[![License](https://img.shields.io/badge/license-MIT_License-brightgreen.svg?style=flat)](https://github.com/Cap32/react-wechat-api/blob/master/LICENSE.md)

[WIP] React Wechat JSSDK component for SPA

## Installation

```config
$ yarn add react-wechat-api
```

## Usage

##### Example with react-router v4

**Wechat.js**

```jsx
import React from "react";
import { withRouter } from "react-router-dom";
import { WechatAPIProvider } from "recat-wechat-api";
import wx from "weixin-js-sdk";

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

export default withRouter(function Wechat(props) {
  return (
    <WechatAPIProvider
      wx={wx}
      getConfig={getConfig}
      jsApiList={defaultJsApiList}
      shareData={defaultShareData}
      {...props}
    />
  );
});
```

**App.js**

```jsx
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Wechat from "./Wechat";
import HomePage from "./containers/HomePage";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Wechat>
          <Route path="/" component={HomePage} />
          {/* other routes... */}
        </Wechat>
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
