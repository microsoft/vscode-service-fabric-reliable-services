export let _isWindows = false;
export let _isMacintosh = false;
export let _isLinux = false;

export interface IProcessEnvironment {
	[key: string]: string;
}
interface INodeProcess {
	platform: string;
	env: IProcessEnvironment;
	getuid(): number;
	nextTick: Function;
}
declare let process :INodeProcess;

    _isWindows = (process.platform === 'win32');
	_isMacintosh = (process.platform === 'darwin');
    _isLinux = (process.platform === 'linux');