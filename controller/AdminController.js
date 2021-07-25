const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Users = require('../models/Users');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
  viewSign: async (req, res) => {
    try {
      if (req.session.user == null || req.session.user == undefined) {
        req.flash(
          'alertMessage',
          'Session telah habis silahkan signin kembali!!'
        );
        req.flash('alertStatus', 'danger');
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {
          message: alertMessage,
          status: alertStatus,
        };
        res.render('index', {
          alert,
          title: 'Staycation | SignIn',
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (err) {
      res.redirect('/admin/signin');
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash('alertMessage', 'User yang anda masukan tidak ada!!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash('alertMessage', 'Password yang anda masukan tidak cocok!!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      };

      res.redirect('/admin/dashboard');
    } catch (error) {
      res.redirect('/admin/signin');
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy;
    req.redirect('/admin/signin');
  },

  viewDashboard: (req, res) => {
    res.render('admin/dashboard/view_dashboard', {
      title: 'Staycation | Dashboard',
      user: req.session.user,
    });
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      console.log(alert);
      res.render('admin/category/view_category', {
        category,
        alert,
        title: 'Staycation | Category',
        user: req.session.user,
      });
    } catch (err) {
      res.redirect('/admin/category');
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash('alertMessage', 'Success Add Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (err) {
      req.flash('alertMessage', `${err.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  ediCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash('alertMessage', 'Success Edit Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${err.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash('alertMessage', 'Success delete Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${err.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  viewBank: async (req, res) => {
    const bank = await Bank.find();
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus,
    };
    res.render('admin/bank/view_bank', {
      title: 'Staycation | Bank',
      alert,
      bank,
      user: req.session.user,
    });
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash('alertMessage', 'Success Add Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;

      let bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.name = name;
        bank.nomorRekening = nomorRekening;
        bank.nameBank = nameBank;
        await bank.save();
        req.flash('alertMessage', 'Success Edit Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nomorRekening = nomorRekening;
        bank.nameBank = nameBank;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash('alertMessage', 'Success Edit Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      let bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash('alertMessage', 'Success Delete Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  viewItem: async (req, res) => {
    try {
      let item = await Item.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      let category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: 'Staycation | Item',
        category,
        alert,
        item,
        action: 'view',
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
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
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash('alertMessage', 'Success Add Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  showImageItem: async (req, res) => {
    try {
      let { id } = req.params;
      let item = await Item.findOne({ _id: id }).populate({
        path: 'imageId',
        select: 'id imageUrl',
      });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: 'Staycation | Show Image Item',
        alert,
        item,
        action: 'show image',
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  showEditItem: async (req, res) => {
    try {
      let { id } = req.params;
      let item = await Item.findOne({ _id: id })
        .populate({
          path: 'imageId',
          select: 'id imageUrl',
        })
        .populate({ path: 'categoryId', select: 'id name' });
      let category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: 'Staycation | Show Image Item',
        alert,
        item,
        action: 'edit',
        category,
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  editItem: async (req, res) => {
    const { id } = req.params;
    const { categoryId, title, price, city, about } = req.body;
    let item = await Item.findOne({ _id: id });

    if (req.files.length > 0) {
      for (let i = 0; i < item.imageId.length; i++) {
        const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
        await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
        imageUpdate.imageUrl = `images/${req.files[i].filename}`;
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
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      console.log('test');
      const item = await Item.findOne({ _id: id }).populate('imageId');
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            console.log(image);
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            console.log(error);
            req.flash('alertMessage', `${error.status}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
          });
      }
      await item.remove();
      req.flash('alertMessage', 'Success delete Item');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item');
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    console.log(itemId);
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
        user: req.session.user,
      });
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${id}`);
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash('alertMessage', 'Success add feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      let feature = await Feature.findOne({ _id: id });

      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash('alertMessage', 'Success Edit feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash('alertMessage', 'Success Edit feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    try {
      const { id, itemId } = req.params;
      let feature = await Feature.findOne({ _id: id });
      let item = await Item.findOne({ _id: itemId }).populate('featureId');
      for (let i = 0; i < item.featureId.length; i++) {
        if (feature._id.toString() === item.featureId[i]._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash('alertMessage', 'Success Delete feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash('alertMessage', 'Success add activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      let activity = await Activity.findOne({ _id: id });

      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash('alertMessage', 'Success Edit activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash('alertMessage', 'Success Edit activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const { id, itemId } = req.params;
      let activity = await Activity.findOne({ _id: id });
      let item = await Item.findOne({ _id: itemId }).populate('activityId');
      for (let i = 0; i < item.activityId.length; i++) {
        if (activity._id.toString() === item.activityId[i]._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash('alertMessage', 'Success Delete activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.status}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  viewBooking: async (req, res) => {
    const booking = await Booking.find()
      .populate('bankId')
      .populate('memberId');
    console.log(booking);
    res.render('admin/booking/view_booking', {
      title: 'Staycation | Booking',
      user: req.session.user,
      booking,
    });
  },
};
