const percentile = require('percentile');
const moment = require('moment-timezone');

module.exports = function determineDurationPercentilesInMinutes(percentiles, builds, onMaster, cutoffDateTimeString) {
  const unit = 'Minutes';
  const filteredDurations = builds
    .filter(build => onMaster ? build.branch === 'master' : build.branch !== 'master')
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .map(build => moment(build.finishedAt).diff(moment(build.createdAt), unit));

  return percentiles.reduce((result, p) => {
    return {...result, [`p${p}`]: percentile(p, filteredDurations)};
  }, {});
}