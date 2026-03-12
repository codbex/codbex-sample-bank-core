angular.module('customer-onboarding', ['blimpKit', 'platformView']).controller('customerOnboardingController', ($scope) => {
    const Dialogs = new DialogHub();

    $scope.openDialog = () => {
        if (viewData && viewData.dialogId) {
            Dialogs.showWindow({
                id: viewData.dialogId,
            });
        }
    };

});