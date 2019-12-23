const moment = require('moment-timezone');

const getAllPipelineBuilds = require('./getAllPipelineBuilds');
const determineAverageLeadTime = require('./determineAverageLeadTime');
const determineDeploymentFrequency = require('./determineDeploymentFrequency');
const determineTotalBuilds = require('./determineTotalBuilds');

const PIPELINE = process.argv[2];
const GRAPHQL_URI = process.argv[3];
const BUILDKITE_API_KEY = process.argv[4];

(async () => {
  const builds = await getAllPipelineBuilds(GRAPHQL_URI, BUILDKITE_API_KEY, PIPELINE);
  console.log('Found', builds.length, builds.length > 1 ? 'builds' : 'build');

  const output = {
    sevenDays: {
      buildConversionRate: determineBuildConversionRate(builds, 7, 'Days'),
      frequency: determineDeploymentFrequencyFor(builds, 7, 'Days'),
    },
    thirtyDays: {
      buildConversionRate: determineBuildConversionRate(builds, 30 , 'Days'),
      frequency: determineDeploymentFrequencyFor(builds, 30, 'Days'),
    },
    ninetyDays: {
      buildConversionRate: determineBuildConversionRate(builds, 90, 'Days'),
      frequency: determineDeploymentFrequencyFor(builds, 90, 'Days'),
    },
    allTime: {
      leadTimeInMinutes: determineLeadTimeInMinutes(builds),
    },
  }

  console.log('Measurements:', JSON.stringify(output, null, 2));
})();

function determineLeadTimeInMinutes(builds) {
  const branch = 'master';
  const unit = 'Minutes';
  return Math.round(determineAverageLeadTime(builds, branch, unit) * 100) / 100;
}

function determineDeploymentFrequencyFor(builds, amount, unit) {
  const branch = 'master';
  const cutoffDateTimeString = moment().subtract(amount, unit).format();
  return determineDeploymentFrequency(builds, branch, cutoffDateTimeString);
}

function determineBuildConversionRate(builds, amount, unit) {
  const branch = 'master';
  const cutoffDateTimeString = moment().subtract(amount, unit).format();
  return Math.round(determineDeploymentFrequency(builds, branch, cutoffDateTimeString) / determineTotalBuilds(builds, branch, cutoffDateTimeString) * 100 * 100) / 100;
}
