const { Model } = require('objection')

class Product extends Model {
  static get tableName () {
    return 'products'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'price'],

      properties: {
        id: {type: 'integer'},
        idCategory: {type: 'integer'},
        name: {type: 'string'},
        price: {type: 'float'},
        status: {type: 'integer'}
      }
    }
  }

  static get relationMappings () {
    const Category = require('./Category')
    const Image = require('./Image')

    return {
      categories: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'products.idCategory',
          to: 'categories.id'
        }
      },

      images: {
        relation: Model.HasManyRelation,
        modelClass: Image,
        join: {
          from: 'products.id',
          to: 'images.idProduct'
        }
      }
    }
  }
}

module.exports = Product
