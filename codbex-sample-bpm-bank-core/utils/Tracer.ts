import { Process } from '@aerokit/sdk/bpm';

export class Tracer {
    private readonly startTime: Date;

    constructor() {
        this.startTime = new Date();
        this.log('Started');
    }

    public log(message: string) {
        console.log(`${this.getId()} - ${message ?? ''}`);
    }

    public warn(message: string) {
        console.warn(`${this.getId()} - ${message ?? ''}`);
    }

    public error(message: string) {
        console.error(`${this.getId()} - ${message ?? ''}`);
    }

    public complete(message?: string) {
        const endTime = new Date();
        const seconds = Math.ceil((endTime.getTime() - this.startTime.getTime()) / 1000);
        console.log(`${this.getId()} - Completed after ${seconds} seconds. ${message ?? ''}`);
    }

    public fail(message?: string) {
        const endTime = new Date();
        const seconds = Math.ceil((endTime.getTime() - this.startTime.getTime()) / 1000);
        console.error(`${this.getId()} - Failed after ${seconds} seconds. ${message ?? ''}`);
    }

    private getId(): string {
        const executionContext = Process.getExecutionContext();
        const processDefinitionId = executionContext.getProcessDefinitionId();
        const processInstanceId = executionContext.getProcessInstanceId();
        const businessKey = executionContext.getProcessInstanceBusinessKey();
        const activityId = executionContext.getCurrentActivityId();

        return `[${processDefinitionId}][${processInstanceId}][${businessKey}][${activityId}]`;
    }
}