var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var indexRouter = require('./routes/index');

var app = express();

// Kết nối MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://ntk05102005_db_user:ntk05102005@cluster0.nvgcblz.mongodb.net/QLNH?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Đã kết nối MongoDB Atlas thành công'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/food-management.html'));
});

module.exports = app;