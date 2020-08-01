const Bank = require('../models/Bank');

const fs = require('fs-extra');
const path = require('path');

module.exports = {
     viewBank: async (req, res) => {
          try {
               const bank = await Bank.find();
               const alertMessage = req.flash('alertMessage');
               const alertStatus = req.flash('alertStatus');
               const alert = { message: alertMessage, status: alertStatus };
               res.render('admin/bank/view_bank', {
                    title: "Staycation | Bank",
                    alert,
                    bank,
                    user: req.session.user
               });
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/bank')
          }
     },

     addBank: async (req, res) => {
          try {
               const { name, nameBank, nomorRekening } = req.body;
               await Bank.create({
                    name,
                    nameBank,
                    nomorRekening,
                    imageUrl: `${req.file.filename}`
               });
               req.flash('alertMessage', 'Success Add Bank');
               req.flash('alertStatus', 'success');
               res.redirect('/admin/bank');
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/bank');
          }
     },

     editBank: async (req, res) => {
          try {
               const { id, name, nameBank, nomorRekening } = req.body;
               const bank = await Bank.findOne({ _id: id });
               if (req.file == undefined) {
                    bank.name = name;
                    bank.nameBank = nameBank;
                    bank.nomorRekening = nomorRekening;
                    await bank.save();
                    req.flash('alertMessage', 'Success Update Bank');
                    req.flash('alertStatus', 'success');
                    res.redirect('/admin/bank');
               } else {
                    await fs.unlink(path.join(`public/images/${bank.imageUrl}`));
                    bank.name = name;
                    bank.nameBank = nameBank;
                    bank.nomorRekening = nomorRekening;
                    bank.imageUrl = `${req.file.filename}`
                    await bank.save();
                    req.flash('alertMessage', 'Success Update Bank');
                    req.flash('alertStatus', 'success');
                    res.redirect('/admin/bank');
               }
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/bank');
          }
     },

     deleteBank: async (req, res) => {
          try {
               const { id } = req.params;
               const bank = await Bank.findOne({ _id: id });
               await fs.unlink(path.join(`public/images/${bank.imageUrl}`));
               await bank.remove();
               req.flash('alertMessage', 'Success Delete Bank');
               req.flash('alertStatus', 'success');
               res.redirect('/admin/bank');
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/bank');
          }
     },
}