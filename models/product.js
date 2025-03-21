const db = require('../util/database')
module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    db.execute('INSERT INTO products (title, price, imageUrl, description) VALUSE (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    )
  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
