angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.createdOnFrom) {
			params.entity.createdOnFrom = new Date(params.entity.createdOnFrom);
		}
		if (params?.entity?.createdOnTo) {
			params.entity.createdOnTo = new Date(params.entity.createdOnTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsaccountId = params.optionsaccountId;
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
		if (entity.accountId !== undefined) {
			const condition = { propertyName: 'accountId', operator: 'EQ', value: entity.accountId };
			filter.$filter.conditions.push(condition);
		}
		if (entity.reference) {
			const condition = { propertyName: 'reference', operator: 'LIKE', value: `%${entity.reference}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.amount !== undefined) {
			const condition = { propertyName: 'amount', operator: 'EQ', value: entity.amount };
			filter.$filter.conditions.push(condition);
		}
		if (entity.direction) {
			const condition = { propertyName: 'direction', operator: 'LIKE', value: `%${entity.direction}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.fee !== undefined) {
			const condition = { propertyName: 'fee', operator: 'EQ', value: entity.fee };
			filter.$filter.conditions.push(condition);
		}
		if (entity.exchangeRate !== undefined) {
			const condition = { propertyName: 'exchangeRate', operator: 'EQ', value: entity.exchangeRate };
			filter.$filter.conditions.push(condition);
		}
		if (entity.approved !== undefined && entity.isapprovedIndeterminate === false) {
			const condition = { propertyName: 'approved', operator: 'EQ', value: entity.approved };
			filter.$filter.conditions.push(condition);
		}
		if (entity.createdOnFrom) {
			const condition = { propertyName: 'createdOn', operator: 'GE', value: entity.createdOnFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.createdOnTo) {
			const condition = { propertyName: 'createdOn', operator: 'LE', value: entity.createdOnTo };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-sample-bank-core-edm.accounts.Transaction.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Transaction-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});