const { json } = require('micro')

const { createError } = require('./error')
const { getProductById } = require('./product')

const Image = require('./models/Image')

const getImage = async (req, res) => {
  // buscar imagens do produto no GET /product

  const { id, prod } = req.query

  const img = await Image
    .query()
    .skipUndefined()
    .where('id', id)
    .andWhere('idProduct', prod)

  if (img.length <= 0) throw createError(400, 'Image(s) not found.')

  return img
}

const saveImage = async (req, res) => {
  const data = await json(req)
  const { url, idProduct } = data

  // precisa ser alterado para integrar com S3
  if (!url || !idProduct) throw createError(401, 'Invalid request.')

  const img = await Image.query().where({ 'imgUrl': url })
  if (img.length > 0) throw createError(401, 'Image already exist.')

  const product = await getProductById(idProduct)
  if (!product) throw createError(402, 'Invalid product.')

  await Image.query().insert({ idProduct: idProduct, imgUrl: url })

  return { message: 'Create successful.' }
}

const deleteImage = async (req, res) => {
  // ?id=1 or ?cat=1
  const { id, prod } = req.query

  const img = await Image
    .query()
    .skipUndefined()
    .where('id', id)
    .andWhere('idProduct', prod)
    .delete()

  console.log(img)

  return { message: 'Delete successful.' }
}

module.exports = {
  getImage,
  saveImage,
  deleteImage
}
