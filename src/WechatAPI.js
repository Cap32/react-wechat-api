import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import withWechatAPI from './withWechatAPI';

@withWechatAPI
export default class WechatAPI extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		jsApiList: PropTypes.array,
		shareData: PropTypes.object,
		wechatAPI: PropTypes.object.isRequired,
		onReady: PropTypes.func,
		onError: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const { wechatAPI, jsApiList } = props;
		wechatAPI.emitter.on('ready', this.handleReady);
		wechatAPI.emitter.on('error', this.handleError);
		if (jsApiList) wechatAPI.config(jsApiList);
	}

	componentDidUpdate(prevProps) {
		const { shareData, wechatAPI } = this.props;
		if (prevProps.shareData !== shareData) {
			wechatAPI.updateShareData(shareData);
		}
	}

	componentWillUnmount() {
		const { wechatAPI, shareData } = this.props;
		wechatAPI.emitter.off('ready', this.handleReady);
		wechatAPI.emitter.off('error', this.handleError);
		if (shareData) wechatAPI.resetShareData();
	}

	handleReady = (wx) => {
		const { onReady, wechatAPI, shareData } = this.props;
		if (onReady) onReady(wx);
		if (shareData) wechatAPI.updateShareData(shareData);
	};

	handleError = (error) => {
		const { onError } = this.props;
		if (onError) onError(error);
	};

	render() {
		return Children.only(this.props.children);
	}
}
