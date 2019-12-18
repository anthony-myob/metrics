const moment = require('moment-timezone');

module.exports = function determineAverageLeadTime(builds, branch, unit) {
  const VALID_STATE = 'PASSED';
  const buildDurations = builds
    .filter(build => build.branch === branch)
    .filter(build => build.state === VALID_STATE)
    .map(build => {
      const createdAt = moment(build.createdAt);
      const finishedAt = moment(build.finishedAt);
      return finishedAt.diff(createdAt, unit);
    })

    return buildDurations.reduce((sum, buildDuration) => sum += buildDuration, 0) / buildDurations.length
}