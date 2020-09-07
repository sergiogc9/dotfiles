import { spawn, execFile, SpawnOptions } from 'child_process';

class CommandLine {

	public static execute = (command: string, extraArgs: string[] = [], options: SpawnOptions = {}) => new Promise((resolve, reject) => {
		const cmdSplit = command.split(' ');
		const child = spawn(cmdSplit.shift(), [...cmdSplit, ...extraArgs], options);

		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		process.stdin.pipe(child.stdin);

		child.on('close', code => {
			child.stdout.unpipe(process.stdout);
			child.stderr.unpipe(process.stderr);
			process.stdin.unpipe(child.stdin);
			if (code === 0) resolve();
			else reject(new Error(`Failed with error code: ${code}`));
		});
	});

	public static logAndExecute = async (command: string, extraArgs: string[] = []) => {
		console.log(`Executing: ${command} ${extraArgs.join(' ')}`);
		await CommandLine.execute(command, extraArgs);
	};

	public static executeFile = (filePath: string) => new Promise((resolve, reject) => {
		const child = execFile(filePath, (error, stdout, stderr) => {
			resolve();
		});

		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		process.stdin.pipe(child.stdin);

		child.on('close', code => {
			child.stdout.unpipe(process.stdout);
			child.stderr.unpipe(process.stderr);
			process.stdin.unpipe(child.stdin);
			if (code === 0) resolve();
			else reject(new Error(`Failed with error code: ${code}`));
		});

	});

}

export default CommandLine;
