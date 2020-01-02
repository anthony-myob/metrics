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

  const now = moment();
  const sevenDaysAgo = now.clone().subtract(7, 'Days');
  const thirtyDaysAgo = now.clone().subtract(30, 'Days');
  const ninetyDaysAgo = now.clone().subtract(90, 'Days');

  const output = {
    sevenDays: {
      buildConversionRate: determineBuildConversionRate(builds, sevenDaysAgo.format()),
      frequency: determineDeploymentFrequencyFor(builds, sevenDaysAgo.format()),
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds, sevenDaysAgo.format()),
    },
    thirtyDays: {
      buildConversionRate: determineBuildConversionRate(builds, thirtyDaysAgo.format()),
      frequency: determineDeploymentFrequencyFor(builds, thirtyDaysAgo.format()),
      leadTimeInMinutes: determineLeadTimeInMinutesFor(builds, thirtyDaysAgo.format()),
    },
    ninetyDays: {
      buildConversionRate: determineBuildConversionRate(builds, ninetyDaysAgo.format()),
      frequency: determineDeploymentFrequencyFor(builds, ninetyDaysAgo.format()),
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

function determineDeploymentFrequencyFor(builds, cutoffDateTimeString) {
  const branch = 'master';
  return determineDeploymentFrequency(builds, branch, cutoffDateTimeString);
}

function determineBuildConversionRate(builds, cutoffDateTimeString) {
  const branch = 'master';
  const result = Math.round(determineDeploymentFrequency(builds, branch, cutoffDateTimeString) / determineTotalBuilds(builds, branch, cutoffDateTimeString) * 100 * 100) / 100;
  return isNaN(result) ? 0 : result;
}
