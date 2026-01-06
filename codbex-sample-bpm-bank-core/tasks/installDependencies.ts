import { Command } from '@aerokit/sdk/platform';
import { Configurations } from '@aerokit/sdk/core';
import { Tracer } from '../utils/Tracer';

const tracer = new Tracer();

const BANK_CORE_DEPENDENCIES_INSTALLED = 'BANK_CORE_DEPENDENCIES_INSTALLED';

try {
    const installedDependencies = Configurations.get(BANK_CORE_DEPENDENCIES_INSTALLED, 'false');
    if (installedDependencies !== 'true') {
        installDependency('npm install', {
            workingDirectory: '/target/dirigible/repository/root/registry/public/codbex-sample-bpm-bank-core/ext',
        });

        Configurations.set(BANK_CORE_DEPENDENCIES_INSTALLED, 'true');

        tracer.complete('Dependencies successfully installed');
    } else {
        tracer.complete('Dependencies were previously installed');
    }
} catch (e: any) {
    tracer.fail(e.message);
    throw e;
}

function installDependency(cmd: string, env: any = {}): any {
    const result = Command.execute(cmd, env);
    verifyCommandResult(result);
}

function verifyCommandResult(commandResult: any) {
    if (commandResult.exitCode !== 0) {
        const errorMessage = `Error occurred during dependencies installation:\n  - Error: ${JSON.stringify(commandResult, null, 4)}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}