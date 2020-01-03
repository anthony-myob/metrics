const moment = require('moment-timezone');

module.exports = function determineTotalBuilds(builds, onMaster, cutoffDateTimeString) {
  return builds
    .filter(build => onMaster ? build.branch === 'master' : build.branch !== 'master')
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .length;
}