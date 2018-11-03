import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'emit-lite';
import WechatAPIContext from './WechatAPIContext';
import { isWechat, debounce } from './utils';

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
		wx: PropTypes.object.isRequired,
		children: PropTypes.node.isRequired,
		location: PropTypes.any.isRequired,
		getConfig: PropTypes.func.isRequired,
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
		this.config(jsApiList, () => {
			this.updateShareData(shareData);
		});
	}

	config = debounce(async (jsApiList, callback) => {
		const {
			props: { debug, wx, getConfig },
			wechatAPIContext: { emitter },
		} = this;

		const done = () => {
			emitter.emit('ready', wx);
			if (typeof callback === 'function') callback();
		};

		if (!isWechat) {
			if (debug) {
				this._updateShareApiList(jsApiList);
				done();
			}
			return;
		}

		try {
			const config = await getConfig({
				url: window.location.href.replace(/#.*/, ''),
			});
			const apiList = [...jsApiList];
			this._updateShareApiList(apiList);
			wx.config({
				debug,
				jsApiList: apiList,
				...config,
			});
			wx.ready(done);
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
		const { debug, wx } = this.props;
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
