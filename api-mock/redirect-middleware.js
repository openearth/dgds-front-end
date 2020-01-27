const path = require('path')

module.exports = function (req, res, next) {
  if (req.path === '/timeseries') {
    res.redirect(`${req.path}/${req.query.locationCode}/${req.query.datasetId}`)
  } else if (req.path === '/locations') {
    const paginated = req.query.page ? `-page=${req.query.page}` : '-page=1'
    res.sendFile(
      path.join(
        __dirname,
        `${req.path}/${req.query.datasetId}${paginated}.json`
      )
    )
  } else {
    next()
  }
}
