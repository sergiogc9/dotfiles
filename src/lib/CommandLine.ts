import { spawn, execFile, SpawnOptions } from 'child_process';

class CommandLine {

	public static execute = (command: string, options: SpawnOptions = {}, hideOutput = false) => new Promise<string>((resolve, reject) => {
		let output = '';
		const child = spawn('/bin/sh', ['-c', command], options);

		if (!hideOutput) child.stdout.pipe(process.stdout);
		if (!hideOutput) child.stderr.pipe(process.stderr);
		process.stdin.pipe(child.stdin);

		child.stdout.on('data', data => {
			output += data;
		});

		child.on('close', code => {
			if (!hideOutput) child.stdout.unpipe(process.stdout);
			if (!hideOutput) child.stderr.unpipe(process.stderr);
			process.stdin.unpipe(child.stdin);
			if (code === 0) resolve(output);
			else reject(new Error(`Failed with error code: ${code}`));
		});
	});

	public static logAndExecute = async (command: string, options: SpawnOptions = {}) => {
		console.log(`Executing: ${command}`);
		return CommandLine.execute(command, options);
	};

	public static executeHidden = async (command: string, options: SpawnOptions = {}) => CommandLine.execute(command, options, true);

	public static executeFile = (filePath: string) => new Promise<string>((resolve, reject) => {
		let output = '';
		const child = execFile(filePath, (error, stdout, stderr) => {
			resolve(output);
		});

		child.stdout.on('data', data => {
			output += data;
		});

		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		process.stdin.pipe(child.stdin);

		child.on('close', code => {
			child.stdout.unpipe(process.stdout);
			child.stderr.unpipe(process.stderr);
			process.stdin.unpipe(child.stdin);
			if (code === 0) resolve(output);
			else reject(new Error(`Failed with error code: ${code}`));
		});

	});

}

export default CommandLine;
