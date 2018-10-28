import React, { PureComponent } from 'react';
import WechatAPIContext from './WechatAPIContext';

export default function withWechatAPI(WrappedComponent) {
	return class WechatAPIConsumer extends PureComponent {
		renderChildren = (wechatAPI) => {
			return <WrappedComponent {...this.props} wechatAPI={wechatAPI} />;
		};

		render() {
			return (
				<WechatAPIContext.Consumer>
					{this.renderChildren}
				</WechatAPIContext.Consumer>
			);
		}
	};
}
