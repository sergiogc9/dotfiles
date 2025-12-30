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

    public static executeFile = (filePath: string): Promise<string> => new Promise((resolve, reject) => {
        let output = '';
        const child = execFile(filePath);

        // Captura stdout
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                process.stdout.write(data); // muestra en terminal en tiempo real
                output += data.toString();
            });
        }

        // Captura stderr
        if (child.stderr) {
            child.stderr.on('data', (data) => {
                process.stderr.write(data); // muestra errores en tiempo real
                output += data.toString();
            });
        }

        // Pipe stdin
        if (child.stdin) {
            process.stdin.pipe(child.stdin);
        }

        // Detecta cierre del proceso
        child.on('close', (code) => {
            if (child.stdin) process.stdin.unpipe(child.stdin);
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });

        // Detecta errores al iniciar el proceso
        child.on('error', (err) => {
            reject(err);
        });
    });
}

export default CommandLine;
