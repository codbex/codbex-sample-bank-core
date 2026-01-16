angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters, LocaleService) => {
	const Dialogs = new DialogHub();
	let description = 'Description';
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	LocaleService.onInit(() => {
		description = LocaleService.t('codbex-sample-bank-core-edm:bankCore-model.defaults.description');
	});

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.dateOfBirthFrom) {
			params.entity.dateOfBirthFrom = new Date(params.entity.dateOfBirthFrom);
		}
		if (params?.entity?.dateOfBirthTo) {
			params.entity.dateOfBirthTo = new Date(params.entity.dateOfBirthTo);
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
		if (entity.customerNumber) {
			const condition = { propertyName: 'customerNumber', operator: 'LIKE', value: `%${entity.customerNumber}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.type) {
			const condition = { propertyName: 'type', operator: 'LIKE', value: `%${entity.type}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.firstName) {
			const condition = { propertyName: 'firstName', operator: 'LIKE', value: `%${entity.firstName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.lastName) {
			const condition = { propertyName: 'lastName', operator: 'LIKE', value: `%${entity.lastName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.dateOfBirthFrom) {
			const condition = { propertyName: 'dateOfBirth', operator: 'GE', value: entity.dateOfBirthFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.dateOfBirthTo) {
			const condition = { propertyName: 'dateOfBirth', operator: 'LE', value: entity.dateOfBirthTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.isActive !== undefined && entity.isisActiveIndeterminate === false) {
			const condition = { propertyName: 'isActive', operator: 'EQ', value: entity.isActive };
			filter.$filter.conditions.push(condition);
		}
		if (entity.riskScore !== undefined) {
			const condition = { propertyName: 'riskScore', operator: 'EQ', value: entity.riskScore };
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
		Dialogs.postMessage({ topic: 'codbex-sample-bank-core-edm.customers.Customer.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.alert = (message) => {
		if (message) Dialogs.showAlert({
			title: description,
			message: message,
			type: AlertTypes.Information,
			preformatted: true,
		});
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Customer-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});