import { Process } from '@aerokit/sdk/bpm';
import { Configurations } from '@aerokit/sdk/core';
import { TextractUtils } from '../utils/TextractUtils';
import { Tracer } from '../utils/Tracer';

const tracer = new Tracer();

try {
    const bucketName = Configurations.get('DIRIGIBLE_S3_BUCKET');

    if (!bucketName) {
        throw new Error(`Provide the 'DIRIGIBLE_S3_BUCKET' environment variable`);
    }

    const documentPath = Process.getExecutionContext().getVariable('documentPath');
    const result = TextractUtils.parseDocument(bucketName, `default-tenant/${documentPath}`);
    Process.getExecutionContext().setVariable('idCardData', result);

    tracer.complete('ID Card data extracted successfully.');
} catch (e: any) {
    tracer.fail(e.message);
    throw e;
}
