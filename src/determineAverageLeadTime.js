const moment = require('moment-timezone');

module.exports = function determineAverageLeadTime(builds, branch, unit, cutoffDateTimeString) {
  const VALID_STATE = 'PASSED';
  const buildDurations = builds
    .filter(build => build.branch === branch)
    .filter(build => build.state === VALID_STATE)
    .filter(build => typeof cutoffDateTimeString !== 'undefined' ? moment(build.finishedAt).isSameOrAfter(moment(cutoffDateTimeString)) : true)
    .map(build => {
      const createdAt = moment(build.createdAt);
      const finishedAt = moment(build.finishedAt);
      return finishedAt.diff(createdAt, unit);
    })

    const result = buildDurations.reduce((sum, buildDuration) => sum += buildDuration, 0) / buildDurations.length;
    return isNaN(result) ? 0 : result;
}