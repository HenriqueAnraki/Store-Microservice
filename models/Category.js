const { Model } = require('objection')

class Category extends Model {
  static get tableName () {
    return 'categories'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        status: {type: 'integer'}
      }
    }
  }

  static get relationMappings () {
    const Product = require('./Product')

    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'categories.id',
          to: 'products.idCategory'
        }
      }
    }
  }
}

module.exports = Category
