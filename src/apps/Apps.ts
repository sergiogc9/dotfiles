/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import CommandLine from '@src/lib/CommandLine';
import Config from '@src/lib/Config';

class Apps {

	public run = async () => {
		console.log('Installing Applications');
		await this.__installDependencies();
		await this.__installCommonApps();
		await this.__installOptionalApps();
	};

	private __installDependencies = async () => {
		console.log('Installing dependencies before installing Apps');
		await this.__installMultipleBrewPackages([
			'mas',
			'mackup',
			'wget'
		]);
		await this.__installMultipleBrewCaskPackages([
			'gpg-suite'
		]);
	};

	private __installCommonApps = async () => {
		console.log('Installing common apps');
		// Brew
		await this.__installMultipleBrewCaskPackages([
			'google-chrome',
			'dropbox',
			'spectacle',
			'visual-studio-code',
			'alfred',
			'istat-menus',
			'iterm2',
			'spotify',
			'vlc'
		]);

		// AppStore
		await this.__installMultipleMacOSApps([
			{ name: '1Password', appId: '1333542190' },
			{ name: 'Spark', appId: '1176895641' },
			{ name: 'The unarchiver', appId: '425424353' },
			{ name: 'TickTick', appId: '966085870' }
		]);
	};

	private __installOptionalApps = async () => {
		console.log('Installing optional apps');

		const apps: { id: string, name: string, type: 'brew' | 'brew-cask' | 'app-store' }[] = [
			{ id: 'microsoft-office', name: 'Microsoft Office', type: 'brew-cask' },
			{ id: 'tunnelblick', name: 'Tunnelblick', type: 'brew-cask' },
			{ id: '1153157709', name: 'Speedtest by Ookla', type: 'app-store' },
			{ id: 'tripmode', name: 'Tripmode', type: 'brew-cask' },
			{ id: '1147396723', name: 'Whatsapp Desktop', type: 'app-store' },
			{ id: '1176074088', name: 'Termius', type: 'app-store' },
			{ id: 'copyclip', name: 'Copy Clip 2', type: 'brew-cask' },
			{ id: 'cyberduck', name: 'Cyberduck', type: 'brew-cask' },
			{ id: 'gitkraken', name: 'Gitkraken', type: 'brew-cask' },
			{ id: 'mongodb-compass', name: 'MongoDB Compass', type: 'brew-cask' },
			{ id: 'postman', name: 'Postman', type: 'brew-cask' },
			{ id: 'nucleo', name: 'Nucleo', type: 'brew-cask' },
			{ id: 'raindropio', name: 'Raindrop', type: 'brew-cask' }
		];

		for (const app of apps) {
			await Config.askForInstallation(`install-${app.id}`, `Do you want to install ${app.name}?`);
		}

		for (const app of apps) {
			const shouldInstall = await Config.get(`install-${app.id}`);
			if (shouldInstall) {
				if (app.type === 'brew') await this.__installBrewPackage(app.id);
				else if (app.type === 'brew-cask') await this.__installBrewCaskPackage(app.id);
				else if (app.type === 'app-store') await this.__installMacOSApp(app.name, app.id);
			}
		}
	};

	private __installBrewPackage = async (pkg: string) => {
		await CommandLine.logAndExecute(`brew install ${pkg}`);
	};

	private __installBrewCaskPackage = async (pkg: string) => {
		await CommandLine.logAndExecute(`brew cask install ${pkg}`);
	};

	private __installMacOSApp = async (name: string, appId: string) => {
		console.log(`Installing ${name}`);
		await CommandLine.logAndExecute(`mas purchase ${appId}`);
	};

	private __installMultipleBrewPackages = async (packages: string[]) => {
		for (const pkg of packages) {
			await this.__installBrewPackage(pkg);
		}
	};

	private __installMultipleBrewCaskPackages = async (packages: string[]) => {
		for (const pkg of packages) {
			await this.__installBrewCaskPackage(pkg);
		}
	};

	private __installMultipleMacOSApps = async (apps: { name: string, appId: string }[]) => {
		for (const app of apps) {
			await this.__installMacOSApp(app.name, app.appId);
		}
	};

}

export default Apps;
