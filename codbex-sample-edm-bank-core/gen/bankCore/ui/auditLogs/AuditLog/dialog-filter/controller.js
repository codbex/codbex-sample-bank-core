angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters, LocaleService) => {
	const Dialogs = new DialogHub();
	let description = 'Description';
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	LocaleService.onInit(() => {
		description = LocaleService.t('codbex-sample-edm-bank-core:bankCore-model.defaults.description');
	});

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.createdAtFrom) {
			params.entity.createdAtFrom = new Date(params.entity.createdAtFrom);
		}
		if (params?.entity?.createdAtTo) {
			params.entity.createdAtTo = new Date(params.entity.createdAtTo);
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
		if (entity.entityName) {
			const condition = { propertyName: 'entityName', operator: 'LIKE', value: `%${entity.entityName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.entityId !== undefined) {
			const condition = { propertyName: 'entityId', operator: 'EQ', value: entity.entityId };
			filter.$filter.conditions.push(condition);
		}
		if (entity.operation) {
			const condition = { propertyName: 'operation', operator: 'LIKE', value: `%${entity.operation}%` };
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
		Dialogs.postMessage({ topic: 'codbex-sample-edm-bank-core.auditLogs.AuditLog.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'AuditLog-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});