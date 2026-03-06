const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// Create
router.post('/', async (req, res) => {
    try {
        const newRole = await Role.create(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read All (Chỉ lấy role chưa bị xoá mềm)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Không tìm thấy Role' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete (Xoá mềm)
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true }, // Đổi trạng thái thành true thay vì xoá data
            { new: true }
        );
        res.status(200).json({ message: 'Đã xoá mềm thành công', role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;