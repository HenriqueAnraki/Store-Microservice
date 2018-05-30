const { buffer } = require('micro')
const aws = require('aws-sdk')
const config = require('./config')

const { createError } = require('./error')

aws.config.update({
  'accessKeyId': config.ACCESS_KEY,
  'secretAccessKey': config.SECRET_KEY,
  'region': config.REGION,
  'bucketname': config.BUCKET_NAME
})

aws.config.setPromisesDependency(null)

const s3 = new aws.S3()

/**
 * Uploads a buffer to the AWS
 * @param  {Buffer} fileBuffer  File binary.
 * @param  {String} contentType Type of content, usually the header of http request.
 * @param  {String} s3key       File key to S3 bucket.
 * @return {Promise}            Promise to be resolved or rejected.
 */
const uploadBuffer = async (fileBuffer, contentType, s3key) => {
  return s3.putObject({
    ACL: 'private',
    Bucket: config.BUCKET_NAME,
    Key: s3key,
    Body: fileBuffer,
    ContentType: contentType
  }).promise()
}

/**
 * Get file binary and `content-type`.
 * Then uploads it to AWS.
 * @param  {Object} req
 * @param  {Object} res
 * @return {String}     filename
 */
const set = async (req, res) => {
  console.log('req params: ', req.params)
  console.log('req headers: ', req.headers)

  const buf = await buffer(req, {limit: '5mb'})
  const filename = req.params.name + '.' + req.params.type
  const contentType = req.headers['content-type']

  if (!req.params.name || !req.params.type) {
    throw createError(400, 'Bad Params')
  }

  await uploadBuffer(buf, contentType, filename)

  return filename
}

/**
 * Try to fetch a file from S3.
 * ES6 Proxy could be very useful here.
 * @param  {String} filename
 */
const fetch = async (filename) => {
  console.log('filename: ', filename)
  try {
    await s3.headObject({
      Bucket: config.BUCKET_NAME,
      Key: filename
    }).promise()

    const uri = s3.getSignedUrl('getObject', {
      Bucket: config.BUCKET_NAME,
      Key: filename
    })

    return uri
  } catch (err) {
    if (err.statusCode === 404) {
      throw createError(404, 'Not Found')
    } else throw err
  }
}

const remove = async (filename) => {
  console.log('filename: ', filename)

  try {
    await s3.deleteObject({
      Bucket: config.BUCKET_NAME,
      Key: filename
    }).promise()
  } catch (err) {
    if (err.statusCode === 404) {
      throw createError(404, 'Not Found')
    } else throw err
  }
}

module.exports = {
  set,
  fetch,
  remove
}
