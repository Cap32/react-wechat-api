import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
// import routerStore from 'stores/routerStore';
import wx from 'weixin-js-sdk';
import { baseReq } from 'utils/requests';
import { isWechat } from 'utils/env';
import debounce from 'utils/debounce';
import EventEmitter from 'emit-lite';
import WechatAPIContext from './WechatAPIContext';

const url = 'https://wx.bitsdaily.net/api/wechat/jssdk';

const shareApiList = [
	'updateAppMessageShareData',
	'updateTimelineShareData',
	'onMenuShareTimeline',
	'onMenuShareAppMessage',
	'onMenuShareQQ',
	'onMenuShareQZone',
];

export default class WechatAPIProvider extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		location: PropTypes.any.isRequired,
		jsApiList: PropTypes.array,
		shareData: PropTypes.object,
		debug: PropTypes.bool,
	};

	static defaultProps = {
		jsApiList: [],
		shareData: {},
		debug: false,
	};

	constructor(props) {
		super(props);

		this.wechatAPIContext = {
			config: this.config,
			updateShareData: this.updateShareData,
			resetShareData: this.resetShareData,
			emitter: new EventEmitter(),
		};
		this.shareApiList = [];
		this.init();
	}

	componentDidUpdate(prevProps) {
		const { location, jsApiList } = this.props;
		if (prevProps.location !== location) this.config(jsApiList);
	}

	async init() {
		const { jsApiList, shareData } = this.props;
		await this.config(jsApiList);
		await this.updateShareData(shareData);
	}

	config = debounce(async (jsApiList) => {
		const {
			props: { debug },
			wechatAPIContext: { emitter },
		} = this;

		if (!isWechat) {
			if (debug) {
				this._updateShareApiList(jsApiList);
				emitter.emit('ready', wx);
			}
			return;
		}

		try {
			const config = await baseReq.fetch({
				url,
				query: { url: window.location.href.replace(/#.*/, '') },
			});
			const apiList = [...jsApiList];
			this._updateShareApiList(apiList);
			wx.config({
				debug,
				jsApiList: apiList,
				...config,
			});
			wx.ready(() => {
				emitter.emit('ready', wx);
			});
			wx.error((err) => {
				emitter.emit('error', err);
			});
		}
		catch (err) {
			console.error('INIT WECHAT ERROR', err);
		}
	}, 200);

	_updateShareApiList = (apiList) => {
		this.shareApiList = apiList.filter((api) => ~shareApiList.indexOf(api));
	};

	updateShareData = debounce((shareData) => {
		const { debug } = this.props;
		const data = { ...this.props.shareData, ...shareData };
		Object.keys(data).forEach((key) => {
			const val = data[key];
			if (typeof val === 'function') data[key] = val();
		});
		debug && console.log('wx jssdk share data', data, this.shareApiList);
		this.shareApiList.forEach((shareType) => wx[shareType](data));
	}, 200);

	resetShareData = () => {
		this.updateShareData();
	};

	render() {
		const { children, jsApiList, debug, ...other } = this.props;
		return (
			<WechatAPIContext.Provider value={this.wechatAPIContext}>
				{Children.only(cloneElement(children, other))}
			</WechatAPIContext.Provider>
		);
	}
}
