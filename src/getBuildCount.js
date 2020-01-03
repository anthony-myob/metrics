const moment = require('moment-timezone');

module.exports = function getBuildCount(builds, branch, state, cutoffDateTimeString) {

  return builds
    .filter(build => build.branch === branch)
    .filter(build => build.state === state)
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .length;
}