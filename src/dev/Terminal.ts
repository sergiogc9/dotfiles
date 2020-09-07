import path from 'path';

import CommandLine from '../lib/CommandLine';

class Terminal {

	public run = async () => {
		await this.__downloadPowerlineFonts();
		await this.__installPrezto();
		await this.__downloadNerdFonts();
	};

	private __downloadPowerlineFonts = async () => {
		await CommandLine.executeFile(path.join(__dirname, '/scripts/download_powerline.sh'));
	};

	private __downloadNerdFonts = async () => {
		await CommandLine.execute('brew tap homebrew/cask-fonts');
		await CommandLine.execute('brew cask install font-hack-nerd-font');
	};

	private __installPrezto = async () => {
		await CommandLine.executeFile(path.join(__dirname, '/scripts/install_prezto.sh'));
	};
}

export default Terminal;
