const moment = require('moment-timezone');
const numWords = require('num-words');

const getAllPipelineBuilds = require('./getAllPipelineBuilds');
const determineAverageLeadTime = require('./determineAverageLeadTime');
const getBuildCount = require('./getBuildCount');
const determineTotalBuilds = require('./determineTotalBuilds');
const determineDurationPercentilesInMinutes = require('./determineDurationPercentilesInMinutes');

const PIPELINE = process.argv[2];
const GRAPHQL_URI = process.argv[3];
const BUILDKITE_API_KEY = process.argv[4];

(async () => {
  const builds = await getAllPipelineBuilds(GRAPHQL_URI, BUILDKITE_API_KEY, PIPELINE);
  console.log('Operating against pipeline:', PIPELINE);
  console.log('Found', builds.length, builds.length > 1 ? 'builds' : 'build');

  const now = moment();
  const MASTER = 'master';
  const ON_MASTER_BRANCH = true;
  const ON_DEVELOPMENT_BRANCH = !ON_MASTER_BRANCH;
  const DEPLOYED_STATE = 'PASSED';
  const FAILED_STATE = 'FAILED';

  const output = [7, 30, 90].reduce((result, days) => {
    const cutoffDateTimeString = now.clone().subtract(days, 'Days').format();
    const daysInWords = `${numWords(days)}Days`;
    const percentiles = [50, 75, 90, 99];

    return { ...result, [daysInWords]: {
      buildConversionRate: determineRate(builds, ON_MASTER_BRANCH, DEPLOYED_STATE, cutoffDateTimeString),
      builds: determineTotalBuilds(builds, MASTER, cutoffDateTimeString),
      deployments: getBuildCount(builds, MASTER, DEPLOYED_STATE, cutoffDateTimeString),
      failures: {
        master: {
          failedBuilds: getBuildCount(builds, ON_MASTER_BRANCH, FAILED_STATE, cutoffDateTimeString),
          builds: determineTotalBuilds(builds, ON_MASTER_BRANCH, cutoffDateTimeString),
          rate: determineRate(builds, ON_MASTER_BRANCH, FAILED_STATE, cutoffDateTimeString)
        },
        development: {
          failedBuilds: getBuildCount(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, cutoffDateTimeString),
          builds: determineTotalBuilds(builds, ON_DEVELOPMENT_BRANCH, cutoffDateTimeString),
          rate: determineRate(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, cutoffDateTimeString)
        },
      },
      duration: {
        percentiles: determineDurationPercentilesInMinutes(percentiles, builds, ON_MASTER_BRANCH, cutoffDateTimeString),
        average: determineAverageLeadTimeInMinutesFor(builds, cutoffDateTimeString),
      }
    }}

  }, {});

  console.log('Measurements:', JSON.stringify(output, null, 2));
})();

function determineAverageLeadTimeInMinutesFor(builds, cutoffDateTimeString) {
  const branch = 'master';
  const measurement = 'Minutes';
  return Math.round(determineAverageLeadTime(builds, branch, measurement, cutoffDateTimeString) * 100) / 100;
}

function determineRate(builds, onMaster, state, cutoffDateTimeString) {
  const result = Math.round(getBuildCount(builds, onMaster, state, cutoffDateTimeString) / determineTotalBuilds(builds, onMaster, cutoffDateTimeString) * 100 * 100) / 100;
  return isNaN(result) ? 0 : result;
}
