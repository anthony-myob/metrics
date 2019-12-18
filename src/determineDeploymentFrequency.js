const moment = require('moment-timezone');

module.exports = function determineDeploymentFrequency(builds, branch, cutoffDateTimeString) {
  const VALID_STATE = 'PASSED';

  return builds
    .filter(build => build.branch === branch)
    .filter(build => build.state === VALID_STATE)
    .filter(build => moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)))
    .length;
}