import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { AuditLogEntity } from './AuditLogEntity'

@Component('AuditLogRepository')
export class AuditLogRepository extends Repository<AuditLogEntity> {

    constructor() {
        super((AuditLogEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): AuditLogEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.createdAt = entity.createdAt ? new Date(entity.createdAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): AuditLogEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.createdAt = entity.createdAt ? new Date(entity.createdAt) : undefined;
        });
        return entities;
    }

    public override create(entity: AuditLogEntity): string | number {
        entity.createdAt = new Date();
        return super.create(entity);
    }

    public override upsert(entity: AuditLogEntity): string | number {
        entity.createdAt = new Date();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<AuditLogEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-sample-bank-core-edm-auditLogs-AuditLog', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-sample-bank-core-edm-auditLogs-AuditLog').send(JSON.stringify(data));
    }
}
