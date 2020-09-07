import fs from 'fs/promises';
import inquirer from 'inquirer';
import { isUndefined } from 'lodash';

class Config {

	private __config: Record<string, any>;

	public load = async () => {
		try {
			const data: any = await fs.readFile('./config.json');
			this.__config = JSON.parse(data);
		} catch (e) {
			this.__config = {};
		}
	};

	public save = async () => {
		await fs.writeFile('./config.json', JSON.stringify(this.__config));
	};

	public get = (key: string) => this.__config[key];

	public set = (key: string, value: any) => {
		this.__config[key] = value;
	};

	public askForInstallation = async (key: string, message: string) => {
		if (isUndefined(this.get(key))) {
			const { response } = await inquirer.prompt([{ type: 'confirm', name: 'response', message }]);
			this.set(key, response);
		}
	};

}

export default new Config();
