module.exports = function(req, res, next) {
  if (req.path === '/timeseries') {
    res.redirect(`${req.path}/${req.query.locationCode}/${req.query.datasetId}`)
  } else if (req.path === '/locations') {
    // Not all datasetId have  a seperate locations file. Reuse wl file
    const dId = req.query.datasetId === 'wd' ? 'wd' : 'wl'
    res.redirect(`${req.path}/${dId}`)
  } else {
    next()
  }
}
