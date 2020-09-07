import OS from 'os';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

import Config from '@src/lib/Config';
import CommandLine from '@src/lib/CommandLine';

class Github {

	public run = async () => {
		await this.__unzipKeys();
		await this.__setUpGithubSSH();
		await this.__setUpGithubGPG();

		Config.set('github_keys', true);
	};

	private __unzipKeys = async () => {
		if (!fs.existsSync(path.join(__dirname, '/files/github_id_rsa'))) {
			const { pwd } = await inquirer.prompt([{ type: 'password', name: 'pwd', message: 'Enter the password to unzip Github keys:' }]);
			await CommandLine.execute(`unzip -P ${pwd} github_keys.zip`, [], { cwd: path.join(__dirname, '/files/') });
		}
	};

	private __setUpGithubSSH = async () => {
		if (!Config.get('github_keys')) {
			await CommandLine.executeFile(path.join(__dirname, '/scripts/setup_github_ssh.sh'));
		}
	};

	private __setUpGithubGPG = async () => {
		if (!Config.get('github_keys')) {
			await CommandLine.execute('gpg --import github-gpg-private-key.asc', [], { cwd: path.join(__dirname, '/files') });
		}
	};
}

export default Github;
