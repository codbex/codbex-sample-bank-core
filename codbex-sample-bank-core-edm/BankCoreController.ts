import { Controller, Get, Documentation } from '@aerokit/sdk/http'
import { UUID } from '@aerokit/sdk/utils';
import { Injected, Inject } from '@aerokit/sdk/component'
import { Operator, Direction } from '@aerokit/sdk/db';
import { CustomerRepository } from './gen/bankCore/data/customers/CustomerRepository';
import { CustomerEntity } from './gen/bankCore/data/customers/CustomerEntity';
import { AccountRepository } from './gen/bankCore/data/accounts/AccountRepository';
import { AccountEntity } from './gen/bankCore/data/accounts/AccountEntity'
import { TransactionRepository } from './gen/bankCore/data/accounts/TransactionRepository';
import { DocumentRepository } from './gen/bankCore/data/documents/DocumentRepository';

interface ResetData {
    customersCount: number;
    accountsCount: number;
    transactionsCount: number;
    documentsCount: number;
}

@Controller
@Documentation('codbex-sample-bank-core-edm - Bank Core Controller')
@Injected()
class BankCoreController {

    @Inject('CustomerRepository')
    private readonly customerRepository!: CustomerRepository;

    @Inject('AccountRepository')
    private readonly accountRepository!: AccountRepository;

    @Inject('TransactionRepository')
    private readonly transactionRepository!: TransactionRepository;

    @Inject('DocumentRepository')
    private readonly documentRepository!: DocumentRepository;

    @Get('/test/resetData')
    @Documentation('Test Customers CRUD')
    public testResetData(_: any, _ctx: any): ResetData {
        this.customerRepository.findAll().forEach(e => this.customerRepository.deleteById(e.id!));
        this.accountRepository.findAll().forEach(e => this.accountRepository.deleteById(e.id!));
        this.transactionRepository.findAll().forEach(e => this.transactionRepository.deleteById(e.id!));
        this.documentRepository.findAll().forEach(e => this.documentRepository.deleteById(e.id!));

        return {
            customersCount: this.customerRepository.count(),
            accountsCount: this.accountRepository.count(),
            transactionsCount: this.transactionRepository.count(),
            documentsCount: this.documentRepository.count(),
        }
    }

    @Get('/test/customers')
    @Documentation('Test Customers CRUD')
    public testCustomers(_: any, _ctx: any): CustomerEntity[] {
        this.testResetData(_, _ctx);
        // Create – minimal (defaults + calculated fields)
        const customerId = this.customerRepository.create({
            customerNumber: `CUST-${UUID.random().substring(0, 8).toUpperCase()}`,
            firstName: 'Ivan',
            lastName: 'Petrov',
            // type -> defaults to 'I'
            // isActive -> defaults to true
            // riskScore -> defaults to 0.0
            // createdAt -> calculated
        });

        // Create – full payload
        this.customerRepository.create({
            customerNumber: `VIP-${UUID.random().substring(0, 8).toUpperCase()}`,
            type: 'I',
            firstName: 'Maria',
            lastName: 'Ivanova',
            dateOfBirth: new Date('1988-03-13'),
            isActive: true,
            riskScore: 72.5,
            profileNotes: 'High-value customer with premium services'
        });

        // Read
        const customer = this.customerRepository.findById(customerId);
        if (!customer) {
            throw new Error(`Customer ${customerId} not found`);
        }

        // // Update – triggers OnUpdate
        // customer.riskScore = 15.2;
        // customer.profileNotes = 'Updated risk after AML review';
        // this.customerRepository.update(customer);

        // Query
        const activeCustomers = this.customerRepository.findAll({
            conditions: [
                { operator: Operator.EQ, propertyName: 'isActive', value: true },
                { operator: Operator.GE, propertyName: 'riskScore', value: 10 }
            ],
            sorts: [
                { direction: Direction.DESC, propertyName: 'riskScore' }
            ]
        });
        console.log(`Active Customers: ${JSON.stringify(activeCustomers, null, 4)}`);

        // List
        const allCustomers = this.customerRepository.findAll();

        return allCustomers;
    }

    @Get('/test/accounts')
    @Documentation('Test Accounts CRUD')
    public testAccounts(_: any, _ctx: any): AccountEntity[] {
        this.testResetData(_, _ctx);

        const customers = this.testCustomers(_, _ctx);

        // Create – default-heavy
        const accountId = this.accountRepository.create({
            customerId: customers[0].id!,
            iban: UUID.random().replace(/-/g, '').substring(0, 34),
            balance: 1000.00
            // currency -> defaults to EUR
            // status -> defaults to 1
            // overdraftLimit -> defaults to 0
        });

        // Create – full
        this.accountRepository.create({
            customerId: customers[1].id!,
            iban: UUID.random().replace(/-/g, '').substring(0, 34),
            currency: 'USD',
            balance: 50000.75,
            overdraftLimit: 10000.00,
            status: 1,
            lastAccessTime: new Date('14:35:00')
        });

        // Read
        const account = this.accountRepository.findById(accountId)!;
        if (!account) {
            throw new Error(`Account ${accountId} not found`);
        }

        // Update
        // account.balance! += 1234.56;
        // account.status = 0;
        // this.accountRepository.update(account);

        // Query
        const richAccounts = this.accountRepository.findAll({
            conditions: [
                { operator: Operator.GE, propertyName: 'balance', value: 10000 },
                { operator: Operator.IN, propertyName: 'currency', value: ['EUR', 'USD'] }
            ],
            sorts: [
                { direction: Direction.DESC, propertyName: 'balance' }
            ]
        });
        console.log(`Rich Accounts: ${JSON.stringify(richAccounts, null, 4)}`);

        // List
        const allAccounts = this.accountRepository.findAll();

        return allAccounts;
    }
}
