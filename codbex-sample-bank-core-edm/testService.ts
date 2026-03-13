import { Response } from '@aerokit/sdk/http';
import { Operator, Direction } from '@aerokit/sdk/db';
import { UUID } from '@aerokit/sdk/utils';
import { TransactionRepository } from './gen/bankCore/data/accounts/TransactionRepository';
import { DocumentRepository } from './gen/bankCore/data/documents/DocumentRepository';
import { Files } from '@aerokit/sdk/io';


const transactionRepo = new TransactionRepository();

/**
 * CREATE – debit
 */
const tx1 = transactionRepo.create({
    accountId,
    reference: `TX-${UUID.random().substring(0, 12)}`,
    amount: 250.00,
    direction: 'D',
    fee: 1.25,
    approved: true
});

/**
 * CREATE – credit (minimal)
 */
const tx2 = transactionRepo.create({
    accountId,
    reference: `TX-${UUID.random().substring(0, 12)}`,
    amount: 2000.00,
    direction: 'C',
    // fee defaults to 0
    // approved defaults to false
});

/**
 * QUERY
 */
const approvedTransactions = transactionRepo.findAll({
    conditions: [
        { operator: Operator.EQ, propertyName: 'approved', value: true }
    ],
    sorts: [
        { direction: Direction.DESC, propertyName: 'createdOn' }
    ]
});

// Response.println(`Approved transactions = ${approvedTransactions.length}`);

const documentRepo = new DocumentRepository();

/**
 * CREATE – KYC document
 */
const bytes = Files.readBytes('/target/dirigible/repository/root/registry/public/codbex-sample-bank-core-edm/dummy_statement.pdf');

const documentId = documentRepo.create({
    customerId,
    documentType: 'PASSPORT',
    fileName: 'passport.pdf',
    content: bytes,
    checksum: UUID.random()
});

/**
 * READ
 */
const document = documentRepo.findById(documentId)!;

/**
 * QUERY
 */
const customerDocs = documentRepo.findAll({
    conditions: [
        { operator: Operator.EQ, propertyName: 'customerId', value: customerId }
    ]
});

Response.setContentType('application/pdf');
Response.write(customerDocs[0].content as any[]);
