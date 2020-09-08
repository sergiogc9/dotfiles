import path from 'path';

import CommandLine from '@src/lib/CommandLine';
import Config from '@src/lib/Config';

class MacOS {

	public async run() {
		console.log('Configuring Mac OS');
		await this.__installBasePackages();
		await this.__configureSettings();
	}

	private async __installBasePackages() {
		console.log('Installing base packages...');
		console.log('Installing brew...');
		await CommandLine.executeFile(path.join(__dirname, '/scripts/install_brew.sh'));
	}

	private async __configureSettings() {
		console.log('Setting up Mac OS configs...');

		// Show full paths in Finder
		await CommandLine.execute('defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES');

		// Show all files in Finder
		await CommandLine.execute('defaults write com.apple.finder AppleShowAllFiles YES');

		// Show all file extensions on Finder
		await CommandLine.execute('defaults write -g AppleShowAllExtensions -bool true');

		// Set list view as preferred Finder view
		await CommandLine.execute("defaults write com.apple.finder FXPreferredViewStyle -string 'Nlsv'");

		// Search the current folder by default
		await CommandLine.execute("defaults write com.apple.finder FXDefaultSearchScope -string 'SCcf'");

		// Remove all apps from dock
		if (!Config.get('already_executed')) await CommandLine.execute('defaults write com.apple.dock persistent-apps -array');

		// Set bottom right hot corner to show/hide desktop
		await CommandLine.execute('defaults write com.apple.dock wvous-br-corner -int 4');
		await CommandLine.execute('defaults write com.apple.dock wvous-br-modifier -int 0');

		// Update clock to show current date and current day of the week and 24h format
		await CommandLine.execute("defaults write com.apple.menuextra.clock DateFormat 'EEE MMM d H:mm a'");

		// Show Finder status bar
		await CommandLine.execute('defaults write com.apple.finder ShowStatusBar -bool true');

		// Show home folder in new Finder windows
		await CommandLine.execute('defaults write com.apple.finder NewWindowTarget PfHm');

		// Avoid creating .DS_Store files on network volumes
		await CommandLine.execute('defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true');

		// Disable the warning when changing a file extension
		await CommandLine.execute('defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false');

		// Store screenshots on Downloads folder
		await CommandLine.execute('defaults write com.apple.screencapture location ~/Downloads');

		// dark mode
		await CommandLine.execute("defaults write 'Apple Global Domain' 'AppleInterfaceStyle' 'Dark'");

		// stop itunes to autorun when a device is connected
		await CommandLine.execute('defaults write com.apple.iTunesHelper ignore-devices 1');

		// Change dock icons size
		await CommandLine.execute('defaults write com.apple.dock tilesize -int 40');

		// Disable show recent application on Dock
		await CommandLine.execute('defaults write com.apple.dock show-recents -bool FALSE');

		// Restart services
		await CommandLine.execute('killall Dock Finder SystemUIServer');

		// Disable natural trackpad scroll
		await CommandLine.execute('defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false');

		// Show battery percentage
		await CommandLine.execute('defaults write com.apple.menuextra.battery ShowPercent YES');

	}

}

export default MacOS;
