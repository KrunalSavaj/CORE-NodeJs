const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require('./util/database');
const errorController = require("./controllers/error");

const Cart = require("./models/cart");
const User = require('./models/user');
const Order = require("./models/order");
const Product = require('./models/product');
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  }).catch(err => {
    console.log(err);
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({force: true})
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    user.createCart();
  }).then(cart => {
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  });
