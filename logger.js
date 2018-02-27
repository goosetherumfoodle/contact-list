module.exports = (req, res, next) => {
  console.log(`request body: ${JSON.stringify(req.body)}`)
  next()
}
