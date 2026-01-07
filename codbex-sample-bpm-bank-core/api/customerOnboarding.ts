import { Controller, Post } from '@aerokit/sdk/http';
import { Process } from '@aerokit/sdk/bpm';
import { UUID } from '@aerokit/sdk/utils';

@Controller
class CustomerOnboardingService {

    @Post('/')
    public startOnboardingProcess(onboardingData: any, ctx: any) {
        const processId = Process.start('customer-onboarding', this.generateBusinessKey(), {
            documentPath: onboardingData.documentPath
        })
        return {
            status: `Customer onboarding process started with id = [${processId}]`
        };
    }

    private generateBusinessKey() {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `ONB-${date}-${UUID.random().slice(0, 6).replace(/-/g, '').toUpperCase()}`;
    }

}