const { Model } = require('objection')

class Image extends Model {
  static get tableName () {
    return 'images'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['url'],

      properties: {
        id: {type: 'integer'},
        idProduct: {type: 'integer'},
        url: {type: 'string'}
      }
    }
  }

  static get relationMappings () {
    const Product = require('./Product')

    return {
      products: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'images.idProduct',
          to: 'products.id'
        }
      }
    }
  }
}

module.exports = Image
