exports.afterPOST = function(order) {
	dw.order.OrderMgr.placeOrder(order);
	order.setExportStatus(dw.order.Order.EXPORT_STATUS_READY);
	order.setConfirmationStatus(dw.order.Order.CONFIRMATION_STATUS_CONFIRMED);
	return new dw.system.Status(dw.system.Status.OK);
};