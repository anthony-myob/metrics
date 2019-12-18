const moment = require('moment-timezone');

module.exports = function determineTotalBuilds(builds, branch, cutoffDateTimeString) {
  return builds
    .filter(build => build.branch === branch)
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .length;
}