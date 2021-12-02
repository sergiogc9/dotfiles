/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import CommandLine from '@src/lib/CommandLine';
import Config from '@src/lib/Config';

class Apps {

	public run = async () => {
		console.log('Installing Applications');
		await CommandLine.logAndExecute('brew update');
		await this.__installDependencies();
		await this.__installCommonApps();
		await this.__installOptionalApps();
		await this.__installNPMPackages();
		await CommandLine.logAndExecute('brew upgrade');
		await CommandLine.logAndExecute('brew upgrade --cask');
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
		await this.__installMultipleBrewPackages([
			'htop',
			'raycast'
		]);

		// Brew cask
		await this.__installMultipleBrewCaskPackages([
			'google-chrome',
			'dropbox',
			'spectacle',
			'visual-studio-code',
			// 'alfred',
			'istat-menus',
			'iterm2',
			'spotify',
			'vlc',
			'iina'
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
			{ id: 'cyberduck', name: 'Cyberduck', type: 'brew-cask' },
			{ id: 'sourcetree', name: 'Sourcetree', type: 'brew-cask' },
			{ id: 'mongodb-compass', name: 'MongoDB Compass', type: 'brew-cask' },
			{ id: 'postman', name: 'Postman', type: 'brew-cask' },
			{ id: 'nucleo', name: 'Nucleo', type: 'brew-cask' },
			{ id: 'raindropio', name: 'Raindrop', type: 'brew-cask' },
			{ id: '1431085284', name: 'Nimbus Note', type: 'app-store' },
			{ id: 'firefox', name: 'Firefox', type: 'brew-cask' },
			{ id: '1clipboard', name: '1Clipboard', type: 'brew-cask' },
			{ id: 'tunein', name: 'TuneIn', type: 'brew-cask' },
			{ id: 'beekeeper-studio', name: 'Beekeeper Studio', type: 'brew-cask' },
			{ id: 'openvpn-connect', name: 'OpenVPN Connect', type: 'brew-cask' }
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

	private __installNPMPackages = async () => {
		console.log('Installing NPM packages');

		const packages: string[] = [
			'fox-awesome-cli',
			'yarn'
		];

		for (const pkg of packages) {
			await this.__installNPMPackage(pkg);
		}
	};

	private __installNPMPackage = async (pkg: string) => {
		console.log(`Installing NPM package: ${pkg}`);
		await CommandLine.logAndExecute(`npm install -g ${pkg}`);
	};

	private __installBrewPackage = async (pkg: string) => {
		const checkInstalledOutput = await CommandLine.executeHidden(`brew list -1 | grep "${pkg}" || echo 'not_found'`);
		if (checkInstalledOutput.match(`^${pkg}`)) {
			const checkOutdated = await CommandLine.executeHidden(`brew outdated | grep "${pkg}" || echo 'up_to_date'`);
			if (checkOutdated.match(/^up_to_date/)) console.log(`${pkg} already installed with latest version.`);
			else {
				console.log(`${pkg} already installed. Update available.`);
				await CommandLine.logAndExecute(`brew upgrade ${pkg}`);
			}
		} else await CommandLine.logAndExecute(`brew install ${pkg}`);
	};

	private __installBrewCaskPackage = async (pkg: string) => {
		const checkInstalledOutput = await CommandLine.executeHidden(`brew list --cask -1 | grep "${pkg}" || echo 'not_found'`);
		if (checkInstalledOutput.match(`^${pkg}`)) {
			const checkOutdated = await CommandLine.executeHidden(`brew outdated --cask | grep "${pkg}" || echo 'up_to_date'`);
			if (checkOutdated.match(/^up_to_date/)) console.log(`${pkg} already installed with latest version.`);
			else {
				console.log(`${pkg} already installed. Update available.`);
				await CommandLine.logAndExecute(`brew upgrade --cask ${pkg}`);
			}
		} else await CommandLine.logAndExecute(`brew install --cask ${pkg}`);
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
