module.exports = function(req, res, next) {
  if (req.path === '/timeseries') {
    res.redirect(`${req.path}/${req.query.locationCode}/${req.query.datasetId}`)
  } else if (req.path === '/locations') {
    res.redirect(`${req.path}/${req.query.datasetId}`)
  } else {
    next()
  }
}
