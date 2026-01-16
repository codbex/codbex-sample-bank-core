import { Controller, Get, Post } from '@aerokit/sdk/http';
import { Tasks } from '@aerokit/sdk/bpm';

@Controller
class CustomerDataService {

    @Get('/')
    public getCustomerData(_: any, ctx: any) {
        const taskId = ctx.queryParameters['taskId'];

        const idCardData = Tasks.getVariable(taskId, 'idCardData');
        const documentPath = Tasks.getVariable(taskId, 'documentPath');

        const firstName = this.getValue(idCardData, 'Име') ?? this.getValue(idCardData, 'Name');
        const lastName = this.getValue(idCardData, 'Фамилия') ?? this.getValue(idCardData, `Father's name`);
        const dateOfBirth = this.getValue(idCardData, 'Date of birth');
        const personalNo = this.getValue(idCardData, 'Personal No');
        const documentNumber = this.getValue(idCardData, 'Document number');
        const sex = this.getValue(idCardData, 'Пол') ?? this.getValue(idCardData, 'Sex');

        return {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth ? this.parseDDMMYYYY(dateOfBirth) : undefined,
            profileNotes: `Personal No: ${personalNo}\nDocument number: ${documentNumber}\nSex: ${sex}`,
            documentPath: documentPath
        };
    }

    private getValue(objectData: Record<string, string>, key: string): string | undefined {
        const keyFound = Object.keys(objectData).find(e => e.includes(key));
        return keyFound ? objectData[keyFound] : undefined;
    }

    private parseDDMMYYYY(dateStr: string): Date {
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    @Post('/')
    public submitCustomerData(customerData: any, ctx: any) {
        const taskId = ctx.queryParameters['taskId'];
        Tasks.complete(taskId, {
            customerData: customerData
        });
        return {
            status: 'Success'
        };
    }
}