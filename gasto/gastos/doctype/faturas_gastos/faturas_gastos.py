# Copyright (c) 2022, orlando and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class faturas_gastos(Document):
	def on_update(self):
		if self.docstatus == 1:
			doc = frappe.new_doc('Journal Entry')
			for cu in self.gastos:
				child = frappe._dict({ 'tittle': cu.cuenta,
				'account': cu.cuenta,
				'credit_in_account_currency': cu.valor,
				'against_account': cu.cuenta,
				'credit': cu.valor,
				'debit_in_account_currency': 0.00,
				'debit': 0.00 })
				doc.append("accounts",child)
			child = frappe._dict({ 'tittle': self.cuenta_de_pago,
			'account': self.cuenta_de_pago,
			'debit_in_account_currency': self.total,
			'against_account': self.cuenta_de_pago,
			'debit': self.total,
			'credit_in_account_currency': 0.00,
			'credit': 0.00 })
			doc.append("accounts",child)
			doc.bill_no = self.name
			doc.bill_date = self.fecha
			doc.posting_date = self.fecha
			doc.docstatus = 1
			doc.insert()


	def before_cancel(self):
		doc = frappe.new_doc('Journal Entry')
		for cu in self.gastos:
			child = frappe._dict({ 'tittle': cu.cuenta,
			'account': cu.cuenta,
			'credit_in_account_currency': 0.00,
			'against_account': cu.cuenta,
			'credit': 0.00,
			'debit_in_account_currency': cu.valor,
			'debit': cu.valor })
			doc.append("accounts",child)
		child = frappe._dict({ 'tittle': self.cuenta_de_pago,
		'account': self.cuenta_de_pago,
		'debit_in_account_currency': 0.00,
		'against_account': self.cuenta_de_pago,
		'debit': 0.00,
		'credit_in_account_currency': self.total,
		'credit': self.total })
		doc.append("accounts",child)
		doc.bill_no = self.name
		doc.bill_date = self.fecha
		doc.posting_date = self.fecha
		doc.docstatus = 1
		doc.insert()