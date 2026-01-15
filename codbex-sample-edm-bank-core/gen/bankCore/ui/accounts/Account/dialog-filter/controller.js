angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.openedOnFrom) {
			params.entity.openedOnFrom = new Date(params.entity.openedOnFrom);
		}
		if (params?.entity?.openedOnTo) {
			params.entity.openedOnTo = new Date(params.entity.openedOnTo);
		}
		if (params?.entity?.lastAccessTimeFrom) {
			params.entity.lastAccessTimeFrom = new Date(params.entity.lastAccessTimeFrom);
		}
		if (params?.entity?.lastAccessTimeTo) {
			params.entity.lastAccessTimeTo = new Date(params.entity.lastAccessTimeTo);
		}
		if (params?.entity?.createdAtFrom) {
			params.entity.createdAtFrom = new Date(params.entity.createdAtFrom);
		}
		if (params?.entity?.createdAtTo) {
			params.entity.createdAtTo = new Date(params.entity.createdAtTo);
		}
		if (params?.entity?.updatedAtFrom) {
			params.entity.updatedAtFrom = new Date(params.entity.updatedAtFrom);
		}
		if (params?.entity?.updatedAtTo) {
			params.entity.updatedAtTo = new Date(params.entity.updatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionscustomerId = params.optionscustomerId;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.id !== undefined) {
			const condition = { propertyName: 'id', operator: 'EQ', value: entity.id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.iban) {
			const condition = { propertyName: 'iban', operator: 'LIKE', value: `%${entity.iban}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.customerId !== undefined) {
			const condition = { propertyName: 'customerId', operator: 'EQ', value: entity.customerId };
			filter.$filter.conditions.push(condition);
		}
		if (entity.currency) {
			const condition = { propertyName: 'currency', operator: 'LIKE', value: `%${entity.currency}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.balance !== undefined) {
			const condition = { propertyName: 'balance', operator: 'EQ', value: entity.balance };
			filter.$filter.conditions.push(condition);
		}
		if (entity.overdraftLimit !== undefined) {
			const condition = { propertyName: 'overdraftLimit', operator: 'EQ', value: entity.overdraftLimit };
			filter.$filter.conditions.push(condition);
		}
		if (entity.status !== undefined) {
			const condition = { propertyName: 'status', operator: 'EQ', value: entity.status };
			filter.$filter.conditions.push(condition);
		}
		if (entity.openedOnFrom) {
			const condition = { propertyName: 'openedOn', operator: 'GE', value: entity.openedOnFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.openedOnTo) {
			const condition = { propertyName: 'openedOn', operator: 'LE', value: entity.openedOnTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.lastAccessTimeFrom) {
			const condition = { propertyName: 'lastAccessTime', operator: 'GE', value: entity.lastAccessTimeFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.lastAccessTimeTo) {
			const condition = { propertyName: 'lastAccessTime', operator: 'LE', value: entity.lastAccessTimeTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.createdAtFrom) {
			const condition = { propertyName: 'createdAt', operator: 'GE', value: entity.createdAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.createdAtTo) {
			const condition = { propertyName: 'createdAt', operator: 'LE', value: entity.createdAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.updatedAtFrom) {
			const condition = { propertyName: 'updatedAt', operator: 'GE', value: entity.updatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.updatedAtTo) {
			const condition = { propertyName: 'updatedAt', operator: 'LE', value: entity.updatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-sample-edm-bank-core.accounts.Account.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-sample-edm-bank-core.accounts.Account.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Account-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});