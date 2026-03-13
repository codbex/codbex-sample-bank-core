import { Response } from '@aerokit/sdk/http';
import { Operator, Direction } from '@aerokit/sdk/db';
import { UUID } from '@aerokit/sdk/utils';
import { DocumentRepository } from './gen/bankCore/data/documents/DocumentRepository';


// Response.println(`Approved transactions = ${approvedTransactions.length}`);

const documentRepo = new DocumentRepository();



Response.setContentType('application/pdf');
Response.write(customerDocs[0].content as any[]);
