// Copyright (c) 2022, orlando and contributors
// For license information, please see license.txt

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


	onload: function (frm) {

		frm.doc.hora = frappe.datetime.now_time();


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
		//frm.events.set_total_allocated_amount(frm);
	},

	/* cuenta_de_pago: function(frm) {
		

		frm.events.set_account_currency_and_balance(frm, frm.doc.paid_from,
			"paid_from_account_currency", "paid_from_account_balance", function(frm) {
				
					frm.events.paid_amount(frm);
				
			}
		);
	}, */
	set_total_allocated_amount: function (frm) {
		var total = 0.0;

		$.each(frm.doc.gastos || [], function (i, row) {
			if (row.valor) {
				total += flt(row.valor);

			}
		});
		frm.set_value("total", Math.abs(total));


		//frm.events.set_unallocated_amount(frm);
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

