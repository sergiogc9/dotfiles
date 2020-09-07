import Config from '@src/lib/Config';
import MacOS from '@src/os/MacOS';
import Apps from './apps/Apps';
import Terminal from './dev/Terminal';
import Github from './dev/Github';
import Backup from './backup/Backup';

(async () => {
	const mode = process.argv[2];

	if (mode === 'run') {
		await Config.load();
		await new MacOS().run();
		await new Backup().initMackup();
		await new Apps().run();
		await new Terminal().run();
		await new Github().run();
		Config.set('already_executed', true);
		await Config.save();
	}

	if (mode === 'apps-config') {
		await new Backup().startConfigManagement();
	}

	console.log(`
Finished! More options:

- Run dotfiles: npm start
- Restore / backup your apps config: npm run apps-config
`);
})();
