import React, { PureComponent } from 'react';
import WechatAPIContext from './WechatAPIContext';
import invariant from 'tiny-invariant';

export default function withWechatAPI(WrappedComponent) {
	return class WechatAPIConsumer extends PureComponent {
		renderChildren = (wechatAPI) => {
			invariant(
				wechatAPI,
				'You should not use <AppTitle> outside <WechatAPIProvider>',
			);
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
