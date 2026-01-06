import { Command } from '@aerokit/sdk/platform';
import { Configurations } from '@aerokit/sdk/core';

export class TextractUtils {

    public static parseDocument(bucketName: string, documentPath: string): Record<string, string> {
        const commandResult = Command.execute('node parseDocument.js', {
            workingDirectory: '/target/dirigible/repository/root/registry/public/codbex-sample-bpm-bank-core/ext'
        }, {
            AWS_ACCESS_KEY_ID: TextractUtils.getEnvironmentVariable('AWS_ACCESS_KEY_ID'),
            AWS_SECRET_ACCESS_KEY: TextractUtils.getEnvironmentVariable('AWS_SECRET_ACCESS_KEY'),
            AWS_REGION: TextractUtils.getEnvironmentVariable('AWS_REGION'),
            S3_BUCKET_NAME: bucketName,
            S3_DOCUMENT_PATH: documentPath,
        });

        return JSON.parse(commandResult.standardOutput);
    }

    private static getEnvironmentVariable(name: string, defaultValue?: string): string {
        const value = Configurations.get(name, defaultValue);
        if (value === undefined && defaultValue === undefined) {
            throw new Error(`Provide the '${name}' environment variable`);
        } else if (value === undefined) {
            return defaultValue as string;
        }
        return value;
    }

}