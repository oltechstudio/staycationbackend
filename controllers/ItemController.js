const Category = require('../models/Category');
const Item = require('../models/Item');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Image = require('../models/Image');

const fs = require('fs-extra');
const path = require('path');

module.exports = {
     viewItem: async (req, res) => {
          try {
               const item = await Item.find()
                    .populate({ path: 'imageId', select: 'id imageUrl' })
                    .populate({ path: 'categoryId', select: 'id name' });

               const category = await Category.find();
               const alertMessage = req.flash('alertMessage');
               const alertStatus = req.flash('alertStatus');
               const alert = { message: alertMessage, status: alertStatus };
               res.render('admin/item/view_item', {
                    title: "Staycation | Item",
                    category,
                    alert,
                    item,
                    action: 'view',
                    user: req.session.user
               });
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     addItem: async (req, res) => {
          try {
               const { categoryId, title, price, city, about } = req.body;
               if (req.files.length > 0) {
                    const category = await Category.findOne({ _id: categoryId });
                    const newItem = {
                         categoryId,
                         title,
                         description: about,
                         price,
                         city
                    }
                    const item = await Item.create(newItem);
                    category.itemId.push({ _id: item._id });
                    await category.save();
                    for (let i = 0; i < req.files.length; i++) {
                         const imageSave = await Image.create({ imageUrl: `${req.files[i].filename}` });
                         item.imageId.push({ _id: imageSave._id });
                         await item.save();
                    }
                    req.flash('alertMessage', 'Success Add Item');
                    req.flash('alertStatus', 'success');
                    res.redirect('/admin/item');
               }
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     showImageItem: async (req, res) => {
          try {
               const { id } = req.params;
               const item = await Item.findOne({ _id: id })
                    .populate({ path: 'imageId', select: 'id imageUrl' });
               const alertMessage = req.flash('alertMessage');
               const alertStatus = req.flash('alertStatus');
               const alert = { message: alertMessage, status: alertStatus };
               res.render('admin/item/view_item', {
                    title: "Staycation | Show Image Item",
                    alert,
                    item,
                    action: 'show image',
                    user: req.session.user
               });
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     showEditItem: async (req, res) => {
          try {
               const { id } = req.params;
               const item = await Item.findOne({ _id: id })
                    .populate({ path: 'imageId', select: 'id imageUrl' })
                    .populate({ path: 'categoryId', select: 'id name' });
               const category = await Category.find();
               const alertMessage = req.flash('alertMessage');
               const alertStatus = req.flash('alertStatus');
               const alert = { message: alertMessage, status: alertStatus };
               res.render('admin/item/view_item', {
                    title: "Staycation | Edit Item",
                    alert,
                    item,
                    category,
                    action: 'edit',
                    user: req.session.user
               });
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     editItem: async (req, res) => {
          try {
               const { id } = req.params;
               const { categoryId, title, price, city, about } = req.body;
               const item = await Item.findOne({ _id: id })
                    .populate({ path: 'imageId', select: 'id imageUrl' })
                    .populate({ path: 'categoryId', select: 'id name' });

               if (req.files.length > 0) {
                    for (let i = 0; i < item.imageId.length; i++) {
                         const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
                         await fs.unlink(path.join(`public/images/${imageUpdate.imageUrl}`));
                         imageUpdate.imageUrl = `${req.files[i].filename}`;
                         await imageUpdate.save();
                    }
                    item.title = title;
                    item.price = price;
                    item.city = city;
                    item.description = about;
                    item.categoryId = categoryId;
                    await item.save();
                    req.flash('alertMessage', 'Success update Item');
                    req.flash('alertStatus', 'success');
                    res.redirect('/admin/item');
               } else {
                    item.title = title;
                    item.price = price;
                    item.city = city;
                    item.description = about;
                    item.categoryId = categoryId;
                    await item.save();
                    req.flash('alertMessage', 'Success update Item');
                    req.flash('alertStatus', 'success');
                    res.redirect('/admin/item');
               }
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     deleteItem: async (req, res) => {
          try {
               const { id } = req.params;
               const item = await Item.findOne({ _id: id }).populate('imageId');
               for (let i = 0; i < item.imageId.length; i++) {
                    Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
                         fs.unlink(path.join(`public/images/${image.imageUrl}`));
                         image.remove();
                    }).catch((error) => {
                         req.flash('alertMessage', `${error.message}`);
                         req.flash('alertStatus', 'danger');
                         res.redirect('/admin/item');
                    });
               }
               await item.remove();
               req.flash('alertMessage', 'Success delete Item');
               req.flash('alertStatus', 'success');
               res.redirect('/admin/item');
          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
          }
     },

     viewDetailItem: async (req, res) => {
          const { itemId } = req.params;
          try {
               const alertMessage = req.flash('alertMessage');
               const alertStatus = req.flash('alertStatus');
               const alert = { message: alertMessage, status: alertStatus };

               const feature = await Feature.find({ itemId: itemId });
               const activity = await Activity.find({ itemId: itemId });

               res.render('admin/item/detail_item/view_detail_item', {
                    title: 'Staycation | Detail Item',
                    alert,
                    itemId,
                    feature,
                    activity,
                    user: req.session.user
               })

          } catch (error) {
               req.flash('alertMessage', `${error.message}`);
               req.flash('alertStatus', 'danger');
               res.redirect(`/admin/item/show-detail-item/${itemId}`);
          }
     }
};