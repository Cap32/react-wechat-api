export const createWx = (customConfig) => ({
	_jsApiList: [],
	_onMenuShareTimeline: {},
	_onMenuShareAppMessage: {},
	_onMenuShareQQ: {},
	_onMenuShareQZone: {},
	ready(callback) {
		callback();
	},
	error() {},
	config(config = {}) {
		this._jsApiList = config.jsApiList;
	},
	onMenuShareTimeline(data) {
		this._onMenuShareTimeline = data;
	},
	onMenuShareAppMessage(data) {
		this._onMenuShareAppMessage = data;
	},
	onMenuShareQQ(data) {
		this._onMenuShareQQ = data;
	},
	onMenuShareQZone(data) {
		this._onMenuShareQZone = data;
	},
	...customConfig,
});
