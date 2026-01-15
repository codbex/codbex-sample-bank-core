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
		if (params?.entity?.uploadedAtFrom) {
			params.entity.uploadedAtFrom = new Date(params.entity.uploadedAtFrom);
		}
		if (params?.entity?.uploadedAtTo) {
			params.entity.uploadedAtTo = new Date(params.entity.uploadedAtTo);
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
		if (entity.customerId !== undefined) {
			const condition = { propertyName: 'customerId', operator: 'EQ', value: entity.customerId };
			filter.$filter.conditions.push(condition);
		}
		if (entity.documentType) {
			const condition = { propertyName: 'documentType', operator: 'LIKE', value: `%${entity.documentType}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.fileName) {
			const condition = { propertyName: 'fileName', operator: 'LIKE', value: `%${entity.fileName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.checksum) {
			const condition = { propertyName: 'checksum', operator: 'LIKE', value: `%${entity.checksum}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.uploadedAtFrom) {
			const condition = { propertyName: 'uploadedAt', operator: 'GE', value: entity.uploadedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.uploadedAtTo) {
			const condition = { propertyName: 'uploadedAt', operator: 'LE', value: entity.uploadedAtTo };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-sample-edm-bank-core.documents.Document.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'Document-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});