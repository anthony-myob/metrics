const moment = require('moment-timezone');

const getAllPipelineBuilds = require('./getAllPipelineBuilds');
const determineAverageLeadTime = require('./determineAverageLeadTime');
const getBuildCount = require('./getBuildCount');
const determineTotalBuilds = require('./determineTotalBuilds');

const PIPELINE = process.argv[2];
const GRAPHQL_URI = process.argv[3];
const BUILDKITE_API_KEY = process.argv[4];

(async () => {
  const builds = await getAllPipelineBuilds(GRAPHQL_URI, BUILDKITE_API_KEY, PIPELINE);
  console.log('Operating against pipeline:', PIPELINE);
  console.log('Found', builds.length, builds.length > 1 ? 'builds' : 'build');

  const now = moment();
  const sevenDaysAgo = now.clone().subtract(7, 'Days');
  const thirtyDaysAgo = now.clone().subtract(30, 'Days');
  const ninetyDaysAgo = now.clone().subtract(90, 'Days');
  const MASTER = 'master';
  const ON_MASTER_BRANCH = true;
  const ON_DEVELOPMENT_BRANCH = !ON_MASTER_BRANCH;
  const DEPLOYED_STATE = 'PASSED';
  const FAILED_STATE = 'FAILED';

  const output = {
    sevenDays: {
      buildConversionRate: determineRate(builds, ON_MASTER_BRANCH, DEPLOYED_STATE, sevenDaysAgo.format()),
      builds: determineTotalBuilds(builds, MASTER, sevenDaysAgo.format()),
      deployments: getBuildCount(builds, MASTER, DEPLOYED_STATE, sevenDaysAgo.format()),
      failures: {
        master: {
          failedBuilds: getBuildCount(builds, ON_MASTER_BRANCH, FAILED_STATE, sevenDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_MASTER_BRANCH, sevenDaysAgo.format()),
          rate: determineRate(builds, ON_MASTER_BRANCH, FAILED_STATE, sevenDaysAgo.format())
        },
        development: {
          failedBuilds: getBuildCount(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, sevenDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_DEVELOPMENT_BRANCH, sevenDaysAgo.format()),
          rate: determineRate(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, sevenDaysAgo.format())
        },
      },
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds, sevenDaysAgo.format()),
    },
    thirtyDays: {
      buildConversionRate: determineRate(builds, ON_MASTER_BRANCH, DEPLOYED_STATE, thirtyDaysAgo.format()),
      builds: determineTotalBuilds(builds, MASTER, thirtyDaysAgo.format()),
      deployments: getBuildCount(builds, MASTER, DEPLOYED_STATE, thirtyDaysAgo.format()),
      failures: {
        master: {
          failedBuilds: getBuildCount(builds, ON_MASTER_BRANCH, FAILED_STATE, thirtyDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_MASTER_BRANCH, thirtyDaysAgo.format()),
          rate: determineRate(builds, ON_MASTER_BRANCH, FAILED_STATE, thirtyDaysAgo.format())
        },
        development: {
          failedBuilds: getBuildCount(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, thirtyDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_DEVELOPMENT_BRANCH, thirtyDaysAgo.format()),
          rate: determineRate(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, thirtyDaysAgo.format())
        },
      },
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds, thirtyDaysAgo.format()),
    },
    ninetyDays: {
      buildConversionRate: determineRate(builds, ON_MASTER_BRANCH, DEPLOYED_STATE, ninetyDaysAgo.format()),
      builds: determineTotalBuilds(builds, MASTER, ninetyDaysAgo.format()),
      deployments: getBuildCount(builds, MASTER, DEPLOYED_STATE, ninetyDaysAgo.format()),
      failures: {
        master: {
          failedBuilds: getBuildCount(builds, ON_MASTER_BRANCH, FAILED_STATE, ninetyDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_MASTER_BRANCH, ninetyDaysAgo.format()),
          rate: determineRate(builds, ON_MASTER_BRANCH, FAILED_STATE, ninetyDaysAgo.format())
        },
        development: {
          failedBuilds: getBuildCount(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, ninetyDaysAgo.format()),
          builds: determineTotalBuilds(builds, ON_DEVELOPMENT_BRANCH, ninetyDaysAgo.format()),
          rate: determineRate(builds, ON_DEVELOPMENT_BRANCH, FAILED_STATE, ninetyDaysAgo.format())
        },
      },
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds, ninetyDaysAgo.format()),
    },
    allTime: {
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds),
    },
  }

  console.log('Measurements:', JSON.stringify(output, null, 2));
})();

function determineLeadTimeInMinutesFor(builds, cutoffDateTimeString) {
  const branch = 'master';
  const measurement = 'Minutes';
  return Math.round(determineAverageLeadTime(builds, branch, measurement, cutoffDateTimeString) * 100) / 100;
}

function determineRate(builds, onMaster, state, cutoffDateTimeString) {
  const result = Math.round(getBuildCount(builds, onMaster, state, cutoffDateTimeString) / determineTotalBuilds(builds, onMaster, cutoffDateTimeString) * 100 * 100) / 100;
  return isNaN(result) ? 0 : result;
}
