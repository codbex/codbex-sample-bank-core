import { Process } from '@aerokit/sdk/bpm';
import { UUID } from '@aerokit/sdk/utils';
import { CustomerRepository } from 'codbex-sample-edm-bank-core/gen/bankCore/data/customers/CustomerRepository';
import { Tracer } from '../utils/Tracer';


const tracer = new Tracer();

try {
    const idCardData: Record<string, string> = Process.getExecutionContext().getVariable('idCardData');

    const repository = new CustomerRepository();

    const customerId = repository.create({
        customerNumber: `CUST-${UUID.random().substring(0, 8)}`,
        firstName: idCardData['Име'] ?? idCardData['Name'],
        lastName: idCardData['Фамилия'] ?? idCardData[`Father's name`],
        dateOfBirth: idCardData['Дата Ha раждане/Date of birth'] ? new Date(idCardData['Дата Ha раждане/Date of birth']) : undefined,
        profileNotes: `
            Personal No: ${idCardData['ETH/Personal No']},
            Document number: ${idCardData['№ Ha документа / Document number']},
            Sex: ${idCardData['Пол/Sеx']},
        `
        // type defaults to 'I'
        // isActive defaults to true
        // riskScore defaults to 0.0
        // createdAt calculated
    });

    Process.getExecutionContext().setVariable('customerId', customerId);

    tracer.complete(`Customer created with id=[${customerId}].`);
} catch (e: any) {
    tracer.fail(e.message);
    throw e;
}
