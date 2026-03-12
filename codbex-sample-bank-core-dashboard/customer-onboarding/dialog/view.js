const viewData = {
    id: 'bank-core-customer-onboarding',
    label: 'Customer Onboarding',
    path: '/services/web/codbex-sample-bank-core-dashboard/customer-onboarding/dialog/index.html',
    maxWidth: '400px',
    maxHeight: '320px',
    hasHeader: false,
    closeButton: false,
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}