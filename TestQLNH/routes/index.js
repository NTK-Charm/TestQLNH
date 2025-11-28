var express = require('express');
var router = express.Router();
var Food = require('../models/Food');
var Category = require('../models/Category');

// Lấy tất cả món ăn với đầy đủ thông tin
router.get('/api/foods', async function (req, res) {
    try {
        const foods = await Food.find()
            .populate('category', 'name')
            .select('_id name category price image status')
            .sort({ createdAt: -1 });

        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh mục
router.get('/api/categories', async function (req, res) {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm món ăn mới
router.post('/api/foods', async function (req, res) {
    try {
        const { name, category, price, image, status } = req.body;

        const food = new Food({
            name,
            category,
            price: Number(price),
            image: image || '',
            status: status || 'available'
        });

        await food.save();
        await food.populate('category', 'name');

        res.status(201).json(food);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Cập nhật món ăn
router.put('/api/foods/:id', async function (req, res) {
    try {
        const { name, category, price, image, status } = req.body;

        const food = await Food.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                price: Number(price),
                image,
                status
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('category', 'name');

        if (!food) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn' });
        }

        res.json(food);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa món ăn
router.delete('/api/foods/:id', async function (req, res) {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn' });
        }

        res.json({ message: 'Đã xóa món ăn thành công', deletedFood: food });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;