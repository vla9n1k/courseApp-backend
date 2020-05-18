const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./helpers/database');
const User = require('./models/user');
const Product = require('./models/product');
const Brand = require('./models/brand');
const Condition = require('./models/condition');
const Country = require('./models/country');
const Engine = require('./models/engine');
const Vehicle = require('./models/vehicle');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const UserStatus = require('./models/user-status');
const OrderStatus = require('./models/order-status');
const Transaction = require('./models/transactions');
const config = require('./config');

const shopRoutes = require('./routes/shop');
const optionsRoutes = require('./routes/options');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', shopRoutes);
app.use('/settings', optionsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

Product.belongsTo(User, {constraints:true, onDelete: 'CASCADE'});
Product.belongsTo(Brand);
Product.belongsTo(Condition);
Product.belongsTo(Vehicle);
Product.belongsTo(Country);
Product.belongsTo(Engine);
User.belongsTo(UserStatus);
Order.belongsTo(OrderStatus);
User.hasOne(Cart);
Product.belongsToMany(Cart, {through: CartItem});
Cart.hasMany(CartItem);
Order.hasMany(OrderItem);
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order, {through: OrderItem});

Transaction.belongsTo(User, {as: 'sender', foreignKey: 'senderId'});
Transaction.belongsTo(User, {as: 'receiver', foreignKey: 'receiverId'});

sequelize.sync()
    .then(result => {
        const server = app.listen(config.app.port);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            socket.on('getBalance', async (data) => {
                let user;
                let balance;
                if (data.id) {
                    user = await User.findOne({where: {id: data.id}});
                    balance = user.balance
                }
                socket.emit('balanceUpdate', {
                    balance: balance
                })
            });
            socket.on('getStatus', async (data) => {
                let user;
                let role;
                if (data) {
                    user = await User.findOne({where: {id: data}});
                    role = user.dataValues.userStatusId
                }
                socket.emit('sendStatus', {
                    statusId: role
                })
            })
        })
    })
    .catch(err => {
        throw new Error(err.message)
});

