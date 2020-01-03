const moment = require('moment-timezone');

module.exports = function getBuildCount(builds, onMaster, state, cutoffDateTimeString) {

  return builds
    .filter(build => onMaster ? build.branch === 'master' : build.branch !== 'master')
    .filter(build => build.state === state)
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .length;
}