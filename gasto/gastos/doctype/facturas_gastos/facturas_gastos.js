frappe.ui.form.on('faturas_gastos', {

	setup: function (frm) {
		frm.set_query("cuenta_de_pago", function () {
			frm.events.validate_company(frm);

			var account_types = ["Bank", "Cash"];
			return {
				filters: {
					"account_type": ["in", account_types],
					"is_group": 0,
					"company": frm.doc.company
				}
			}
		});
	},

});