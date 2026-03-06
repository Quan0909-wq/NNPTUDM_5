var express = require('express');
var router = express.Router();

/* GET users listing. */
///api/v1/users
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
var express = require('express');
var router = express.Router();
const User = require('../schemas/users'); // Gọi Model User vào để thao tác với Database

// 1. GET: Lấy danh sách tất cả Users (chỉ lấy những user chưa bị xoá mềm)
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET: Lấy 1 User cụ thể theo ID
router.get('/:id', async function(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy User' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST: Tạo mới User
router.post('/', async function(req, res, next) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. PUT: Cập nhật thông tin User
router.put('/:id', async function(req, res, next) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy User' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. DELETE: Xoá mềm (Soft Delete) User
router.delete('/:id', async function(req, res, next) {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true }, // Chỉ đổi trạng thái thành true, không xoá mất data
      { new: true }
    );
    if (!deletedUser) return res.status(404).json({ message: 'Không tìm thấy User' });
    res.status(200).json({ message: 'Đã xoá mềm thành công', user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. POST /enable: Chuyển status về true nếu đúng email và username
router.post('/enable', async function(req, res, next) {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Thông tin không hợp lệ hoặc user không tồn tại' });
    res.status(200).json({ message: 'Enable thành công', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. POST /disable: Chuyển status về false nếu đúng email và username
router.post('/disable', async function(req, res, next) {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Thông tin không hợp lệ hoặc user không tồn tại' });
    res.status(200).json({ message: 'Disable thành công', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;