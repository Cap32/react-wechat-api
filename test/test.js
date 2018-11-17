/* eslint-disable react/prop-types */
import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { WechatAPIProvider, WechatAPI } from '../src';
import delay from 'delay';
import { createWx } from './util';

configure({ adapter: new Adapter() });

describe('WechatAPIProvider', () => {
	test('should throw error if missing children prop', () => {
		expect(() => shallow(<WechatAPIProvider />)).toThrow();
	});

	test('should onGetConfigError work', async () => {
		const wx = createWx();
		const onGetConfigError = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => Promise.reject(new Error())}
				location="/"
				onGetConfigError={onGetConfigError}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onGetConfigError).toHaveBeenCalledTimes(1);
	});

	test('should children work', () => {
		const wx = createWx();
		const wrapper = mount(
			<WechatAPIProvider wx={wx} getConfig={() => {}} location="/">
				<div>foo</div>
			</WechatAPIProvider>,
		);
		expect(wrapper.find('div').text()).toBe('foo');
	});

	test('should jsApiList work', async () => {
		const wx = createWx();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['foo']}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(wx._jsApiList).toEqual(['foo']);
	});

	test('should onSetJsApiList work', async () => {
		const wx = createWx();
		const onSetJsApiList = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['onMenuShareTimeline']}
				onSetJsApiList={onSetJsApiList}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetJsApiList).toHaveBeenCalledTimes(1);
		expect(onSetJsApiList).toHaveBeenLastCalledWith(
			['onMenuShareTimeline'],
			wx,
		);
	});

	test('should not emit `onSetJsApiList` if getConfig error', async () => {
		const wx = createWx();
		const onSetJsApiList = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => Promise.reject(new Error())}
				location="/"
				onSetJsApiList={onSetJsApiList}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetJsApiList).toHaveBeenCalledTimes(0);
	});

	test('should not emit `onSetJsApiList` if not wechat', async () => {
		const wx = createWx();
		const onSetJsApiList = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				onSetJsApiList={onSetJsApiList}
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetJsApiList).toHaveBeenCalledTimes(0);
	});

	test('should emit `onSetJsApiList` if debug is `true`', async () => {
		const wx = createWx();
		const onSetJsApiList = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				onSetJsApiList={onSetJsApiList}
				debug
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetJsApiList).toHaveBeenCalledTimes(1);
	});

	test('should shareData work', async () => {
		const wx = createWx();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['onMenuShareTimeline']}
				shareData={{ foo: 'bar' }}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(wx._onMenuShareTimeline).toEqual({ foo: 'bar' });
	});

	test('should onSetShareData work', async () => {
		const wx = createWx();
		const onSetShareData = jest.fn();
		shallow(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['onMenuShareTimeline']}
				shareData={{ foo: 'bar' }}
				onSetShareData={onSetShareData}
				undocumented_isWechat
			>
				<div />
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetShareData).toHaveBeenCalledTimes(1);
		expect(onSetShareData).toHaveBeenLastCalledWith(
			{ foo: 'bar' },
			['onMenuShareTimeline'],
			wx,
		);
	});
});

describe('WechatAPI', () => {
	test('should onReady work', async () => {
		const wx = createWx();
		const onReady = jest.fn();
		mount(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				undocumented_isWechat
			>
				<WechatAPI onReady={onReady}>
					<div />
				</WechatAPI>
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onReady).toHaveBeenCalledTimes(1);
		expect(onReady).toHaveBeenLastCalledWith(wx);
	});

	test('should onError work', async () => {
		const err = new Error();
		const wx = createWx({
			ready: () => {},
			error: (cb) => cb(err),
		});
		const onError = jest.fn();
		mount(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				undocumented_isWechat
			>
				<WechatAPI onError={onError}>
					<div />
				</WechatAPI>
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenLastCalledWith(err);
	});

	test('should jsApiList work', async () => {
		const wx = createWx();
		const onSetJsApiList = jest.fn();
		mount(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['onMenuShareTimeline']}
				onSetJsApiList={onSetJsApiList}
				undocumented_isWechat
			>
				<WechatAPI jsApiList={['onMenuShareAppMessage']}>
					<div />
				</WechatAPI>
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetJsApiList).toHaveBeenLastCalledWith(
			['onMenuShareAppMessage'],
			wx,
		);
	});

	test('should shareData work', async () => {
		const wx = createWx();
		const onSetShareData = jest.fn();
		mount(
			<WechatAPIProvider
				wx={wx}
				getConfig={() => {}}
				location="/"
				jsApiList={['onMenuShareTimeline']}
				shareData={{ foo: 'foo', bar: 'bar' }}
				onSetShareData={onSetShareData}
				undocumented_isWechat
			>
				<WechatAPI shareData={{ foo: 'baz', qux: 'qux' }}>
					<div />
				</WechatAPI>
			</WechatAPIProvider>,
		);
		await delay(800);
		expect(onSetShareData).toHaveBeenLastCalledWith(
			{ foo: 'baz', bar: 'bar', qux: 'qux' },
			['onMenuShareTimeline'],
			wx,
		);
	});

	test('should reset shareData after children unmount', async () => {
		const wx = createWx();
		const onSetShareData = jest.fn();
		const App = function App({ location }) {
			return (
				<WechatAPIProvider
					wx={wx}
					getConfig={() => {}}
					location={location}
					jsApiList={['onMenuShareTimeline']}
					shareData={{ foo: 'foo', bar: 'bar' }}
					onSetShareData={onSetShareData}
					undocumented_isWechat
				>
					{location === 'foo' ? (
						<WechatAPI shareData={{ foo: 'baz', qux: 'qux' }}>
							<div />
						</WechatAPI>
					) : (
						<div />
					)}
				</WechatAPIProvider>
			);
		};
		const wrapper = mount(<App location="foo" />);
		await delay(800);
		wrapper.setProps({ location: 'bar' });
		await delay(800);
		expect(onSetShareData).toHaveBeenLastCalledWith(
			{ foo: 'foo', bar: 'bar' },
			['onMenuShareTimeline'],
			wx,
		);
	});

	test('should update shareData', async () => {
		const wx = createWx();
		const onSetShareData = jest.fn();
		const App = function App({ shareData }) {
			return (
				<WechatAPIProvider
					wx={wx}
					getConfig={() => {}}
					location="/"
					jsApiList={['onMenuShareTimeline']}
					onSetShareData={onSetShareData}
					undocumented_isWechat
				>
					<WechatAPI shareData={shareData}>
						<div />
					</WechatAPI>
				</WechatAPIProvider>
			);
		};
		const wrapper = mount(<App shareData={{ foo: 'foo', bar: 'bar' }} />);
		await delay(800);
		wrapper.setProps({ shareData: { foo: 'bar', baz: 'baz' } });
		await delay(800);
		expect(onSetShareData).toHaveBeenLastCalledWith(
			{ foo: 'bar', baz: 'baz' },
			['onMenuShareTimeline'],
			wx,
		);
	});
});
