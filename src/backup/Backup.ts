import fs from 'fs';
import path from 'path';
import fsPromise from 'fs/promises';
import OS from 'os';
import inquirer from 'inquirer';
import moment from 'moment';

import CommandLine from '../lib/CommandLine';

const HOME_FOLDER = OS.homedir();
const HOME_DOTFILES_FOLDER = path.join(OS.homedir(), '.dotfiles/');
const HOME_MACKUP_FOLDER = path.join(OS.homedir(), '.dotfiles/Mackup/');
const DROPBOX_DOTFILES_FOLDER = path.join(OS.homedir(), '/Dropbox/.dotfiles/');
const DROPBOX_BACKUP_FOLDER = path.join(OS.homedir(), '/Dropbox/.dotfiles/backup/');

class Backup {

	public initMackup = async () => {
		console.log('Setting up Mackup (Applications Backup software)');
		await CommandLine.execute(`rm -f ${HOME_FOLDER}/.mackup.cfg`);
		await this.__copyFile(`${__dirname}/files/.mackup.cfg`, HOME_FOLDER);
		await CommandLine.execute(`mkdir -p ${HOME_MACKUP_FOLDER}`);
	};

	public startConfigManagement = async () => {
		console.log('Select an option:');
		console.log('1 - Restore config to your apps');
		console.log('2 - Backup your apps config');
		console.log('3 - Remove mackup config management');
		const { option } = await inquirer.prompt([{ type: 'input', name: 'option', filter: Number }]);
		if (option === 1) await this.__restoreConfig();
		else if (option === 2) await this.__backupConfig();
		else if (option === 3) await this.__removeMackup();
	};

	private __restoreConfig = async () => {
		// If config is not yet downloaded, pull it.
		if (!fs.existsSync(`${HOME_MACKUP_FOLDER}/Library`)) {
			const url = await this.__getConfigDropboxUrl();
			console.log('Downloading last config from Dropbox...');
			await CommandLine.execute(`wget -O backup.zip ${url}`, { cwd: HOME_DOTFILES_FOLDER });
			await CommandLine.execute('rm -rf ./Mackup', { cwd: HOME_DOTFILES_FOLDER });
			await CommandLine.execute('unzip backup.zip', { cwd: HOME_DOTFILES_FOLDER });
			await CommandLine.execute('rm backup.zip', { cwd: HOME_DOTFILES_FOLDER });
		}
		console.log(`Restoring application config from ${HOME_DOTFILES_FOLDER}`);
		await CommandLine.execute('mackup restore -v');
		await this.__copyFileIfExists(`${HOME_MACKUP_FOLDER}/.p10k.zsh`, HOME_FOLDER);
	};

	private __getConfigDropboxUrl = async () => {
		if (!fs.existsSync(path.join(__dirname, '/files/config_dropbox_url.txt'))) {
			const { pwd } = await inquirer.prompt([{ type: 'password', name: 'pwd', message: 'Enter the password to download the config from Facebook' }]);
			await CommandLine.execute(`unzip -P ${pwd} config_dropbox_url.zip`, { cwd: path.join(__dirname, '/files/') });
		}
		const url = await fsPromise.readFile(path.join(__dirname, '/files/config_dropbox_url.txt'), 'utf8');
		return url;
	};

	private __backupConfig = async () => {
		console.log(`Saving applications config backup in ${HOME_DOTFILES_FOLDER}`);
		await CommandLine.execute('mackup backup -fv');
		await this.__copyFileIfExists(`${HOME_FOLDER}/.p10k.zsh`, HOME_MACKUP_FOLDER);
		if (fs.existsSync(`${HOME_FOLDER}/Dropbox/`)) {
			console.log('Copying it to Dropbox');
			await CommandLine.execute(`rm -rf ${DROPBOX_BACKUP_FOLDER}`);
			await CommandLine.execute(`mkdir -p ${DROPBOX_BACKUP_FOLDER}`);
			await this.__copyFolder(HOME_MACKUP_FOLDER, DROPBOX_BACKUP_FOLDER);
			console.log('Pushing a zipped version to Dropbox');
			const zipFile = moment().format('YYYY-MM-DD_HH-mm-ss') + '.zip';
			await CommandLine.execute(`zip -r ${DROPBOX_DOTFILES_FOLDER}/${zipFile} ${HOME_MACKUP_FOLDER}`);
			await this.__copyFile(`${DROPBOX_DOTFILES_FOLDER}/${zipFile}`, `${DROPBOX_DOTFILES_FOLDER}/last-backup.zip`);
		} else console.log('Dropbox folder not found. Not pushing config backup.');
	};

	private __removeMackup = async () => {
		console.log('Removing mackup...');
		await CommandLine.execute('mackup uninstall');
	};

	private __copyFile = async (filePath: string, destination: string) => {
		await CommandLine.execute(`cp ${filePath} ${destination}`);
	};

	private __copyFileIfExists = async (filePath: string, destination: string) => {
		if (fs.existsSync(filePath)) await this.__copyFile(filePath, destination);
	};

	private __copyFolder = async (folderPath: string, destination: string) => {
		await CommandLine.execute(`cp -r ${folderPath} ${destination}`);
	};

}

export default Backup;
