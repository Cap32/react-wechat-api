import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import WechatAPIContext from './WechatAPIContext';
import invariant from 'tiny-invariant';

export default class WechatAPI extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		jsApiList: PropTypes.array,
		shareData: PropTypes.object,
		onReady: PropTypes.func,
		onError: PropTypes.func,
	};

	componentDidUpdate(prevProps) {
		const { props: { shareData }, wechatAPI } = this;

		/* istanbul ignore else */
		if (prevProps.shareData !== shareData) {
			wechatAPI.updateShareData(shareData);
		}
	}

	componentWillUnmount() {
		const { wechatAPI } = this;
		wechatAPI.emitter.off('ready', this.handleReady);
		wechatAPI.emitter.off('error', this.handleError);
	}

	setup(wechatAPI) {
		const { jsApiList } = this.props;
		this.wechatAPI = wechatAPI;
		wechatAPI.emitter.on('ready', this.handleReady);
		wechatAPI.emitter.on('error', this.handleError);
		if (jsApiList) wechatAPI.config(jsApiList);
	}

	handleReady = (wx) => {
		const { onReady, shareData } = this.props;
		if (onReady) onReady(wx);
		if (shareData) this.wechatAPI.updateShareData(shareData);
	};

	handleError = (error) => {
		const { onError } = this.props;
		onError && onError(error);
	};

	renderChildren = (wechatAPI) => {
		invariant(
			wechatAPI,
			'You should not use <AppTitle> outside <WechatAPIProvider>',
		);
		if (!this.wechatAPI) this.setup(wechatAPI);
		return Children.only(this.props.children);
	};

	render() {
		return (
			<WechatAPIContext.Consumer>
				{this.renderChildren}
			</WechatAPIContext.Consumer>
		);
	}
}
