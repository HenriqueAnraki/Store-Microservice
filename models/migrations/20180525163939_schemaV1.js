
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('categories', t => {
      t.increments('id').unsigned().primary()
      t.string('name').notNull()
    })
    .createTable('products', t => {
      t.increments('id').unsigned().primary()
      t.integer('idCategory').unsigned().references('categories.id').onDelete('SET NULL')
      t.string('name').notNull()
      t.float('price', 8, 2)
    })
    .createTable('images', t => {
      t.increments('id').unsigned().primary()
      t.integer('idProduct').unsigned().notNull().references('id').inTable('products').onDelete('CASCADE')
      t.string('imgUrl').notNull()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('categories')
    .dropTableIfExists('products')
    .dropTableIfExists('images')
}
