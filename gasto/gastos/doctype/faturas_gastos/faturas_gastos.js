frappe.ui.form.on('faturas_gastos', {
	refresh: function (frm) {
		//console.log("facturagastos")

		frm.fields_dict['gastos'].grid.get_field('cuenta').get_query = function (doc, cdt, cdn) {
			var child = locals[cdt][cdn];
			//console.log(child); 
			return {
				"filters": [
					["Account", "account_type", 'in', ["Chargeable", "Income Account", "Expenses Included In Valuation", "Expenses Included In Asset Valuation"]]
				]
			}
		}


	},
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
	validate_company: (frm) => {
		if (!frm.doc.company) {
			frappe.throw({ message: __("Por favor, seleccione primero una empresa."), title: __("Mandatory") });
		}
	},
	valor: function (frm) {
		console.log("valor")
	},
	set_total_allocated_amount: function (frm) {
		var total = 0.0;

		$.each(frm.doc.gastos || [], function (i, row) {
			if (row.valor) {
				total += flt(row.valor);

			}
		});
		frm.set_value("total", Math.abs(total));
	},
});

frappe.ui.form.on('detalle_gastos', {

	valor: function (frm) {
		console.log("valor")
		frm.events.set_total_allocated_amount(frm);
	},
	gastos_remove: function (frm) {
		frm.events.set_total_allocated_amount(frm);
	},
});

