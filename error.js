const { send } = require('micro')

class CommonError extends Error {}

/**
 * Handle our error object. Works like a charm with Objection.
 * @param  {[type]} req
 * @param  {[type]} res
 * @param  {[type]} err Error Expected Class or Generic.
 */
const errorHandler = async (req, res, err) => {
  if (err instanceof CommonError) {
    return send(res, err.statusCode, err.json)
  } else {
    return send(res, err.statusCode || 500, { err: err.toString() })
  }
}

/**
 * Create our custom error class.
 * @param  {[type]} code    Code required.
 * @param  {String} message Developer friendly message.
 * @param  {[type]} data    Data to include in JSON response.
 * @return {[type]}         New CommonError instance.
 */
const createError = (code, message = 'Server Error', data) => {
  const newErr = new CommonError(message)

  newErr.statusCode = code
  newErr.json = { err: { message, data: data } }

  return newErr
}

/**
 * Try and handle errors if it fails.
 * @param  {Function} fn function to try.
 */
const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    console.error(err.stack)
    errorHandler(req, res, err)
  }
}

module.exports = {
  createError,
  handleErrors
}
