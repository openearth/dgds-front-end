module.exports = function(req, res, next) {
  if (req.params['0'] === '/timeseries') {
    res.redirect(
      `${req.params['0']}/${req.query.locationCode}/${req.query.datasetId}`,
    )
  } else if (req.params['0'] === '/locations') {
    res.redirect(`${req.params['0']}/${req.query.datasetId}`)
  } else {
    next()
  }
}
