module.exports = function(req, res, next) {
  if (req.path === '/timeseries') {
    res.redirect(`${req.path}/${req.query.locationCode}/${req.query.datasetId}`)
  } else if (req.path === '/locations') {
    const paginated = req.query.page ? `-${req.query.page}` : ''
    res.redirect(`${req.path}/${req.query.datasetId}${paginated}`)
  } else {
    next()
  }
}
