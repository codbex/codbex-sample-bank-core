import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { AccountEntity } from './AccountEntity'

@Component('AccountRepository')
export class AccountRepository extends Repository<AccountEntity> {

    constructor() {
        super((AccountEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): AccountEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.openedOn = entity.openedOn ? new Date(entity.openedOn) : undefined;
            entity.createdAt = entity.createdAt ? new Date(entity.createdAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): AccountEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.openedOn = entity.openedOn ? new Date(entity.openedOn) : undefined;
            entity.createdAt = entity.createdAt ? new Date(entity.createdAt) : undefined;
        });
        return entities;
    }

    public override create(entity: AccountEntity): string | number {
        entity.createdAt = new Date();
        return super.create(entity);
    }

    public override update(entity: AccountEntity): void {
        entity.updatedAt = new Date();
        super.update(entity);
    }

    public override upsert(entity: AccountEntity): string | number {
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<AccountEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-sample-bank-core-edm-accounts-Account', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-sample-bank-core-edm-accounts-Account').send(JSON.stringify(data));
    }
}
