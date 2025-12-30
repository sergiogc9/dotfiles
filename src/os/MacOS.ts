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

		// Remove all apps from dock and put permanent apps in dock
		if (!Config.get('already_executed')) {
			await CommandLine.execute('brew install dockutil');
			await CommandLine.executeFile(path.join(__dirname, '/scripts/set_dock_apps.sh'));
		}

		// Set bottom right hot corner to show/hide desktop
		await CommandLine.execute('defaults write com.apple.dock wvous-br-corner -int 4');
		await CommandLine.execute('defaults write com.apple.dock wvous-br-modifier -int 0');

		// Show Finder status bar
		await CommandLine.execute('defaults write com.apple.finder ShowStatusBar -bool true');

		// Show home folder in new Finder windows
		await CommandLine.execute(`defaults write com.apple.finder NewWindowTarget -string "PfLo"`);
		await CommandLine.execute(`defaults write com.apple.finder NewWindowTargetPath -string "file:///Users/sergio/"`);

		// Avoid creating .DS_Store files on network volumes
		await CommandLine.execute('defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true');

		// Disable the warning when changing a file extension
		await CommandLine.execute('defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false');

		// Store screenshots on Downloads folder
		await CommandLine.execute('defaults write com.apple.screencapture location ~/Downloads');

		// dark mode
		await CommandLine.execute(`osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to true'`);

		// Change dock icons size
		await CommandLine.execute('defaults write com.apple.dock tilesize -int 40');

		// Disable show recent application on Dock
		await CommandLine.execute('defaults write com.apple.dock show-recents -bool FALSE');

		// Restart services
		await CommandLine.execute('killall Dock Finder SystemUIServer');

		// Disable natural trackpad scroll
		await CommandLine.execute('defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false');

		// Set hot corners
		await CommandLine.execute('defaults write com.apple.dock wvous-tr-corner -int 12');
		await CommandLine.execute('defaults write com.apple.dock wvous-tl-corner -int 3');

	}

}

export default MacOS;
