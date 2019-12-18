const moment = require('moment-timezone');

const getAllPipelineBuilds = require('./getAllPipelineBuilds');
const determineAverageLeadTime = require('./determineAverageLeadTime');
const determineDeploymentFrequency = require('./determineDeploymentFrequency');

const PIPELINE = process.argv[2];
const GRAPHQL_URI = process.argv[3];
const BUILDKITE_API_KEY = process.argv[4];

(async () => {
  const builds = await getAllPipelineBuilds(GRAPHQL_URI, BUILDKITE_API_KEY, PIPELINE);
  console.log('Found', builds.length, builds.length > 1 ? 'builds' : 'build');

  const output = {
    deploymentFrequencies: {
      oneWeek: determineDeploymentFrequencyForOneWeek(builds),
      oneMonth: determineDeploymentFrequencyForOneMonth(builds),
      threeMonths: determineDeploymentFrequencyForThreeMonths(builds),
    },
    leadTimeInMinutes: determineLeadTimeInMinutes(builds),
  }

  console.log('Measurements:', JSON.stringify(output, null, 2));
})();

function determineLeadTimeInMinutes(builds) {
  const branch = 'master';
  const unit = 'Minutes';
  return determineAverageLeadTime(builds, branch, unit);
}

function determineDeploymentFrequencyForOneWeek(builds) {
  const branch = 'master';
  const cutoffDateTimeString = moment().subtract(1, 'Week').format();
  return determineDeploymentFrequency(builds, branch, cutoffDateTimeString);
}

function determineDeploymentFrequencyForOneMonth(builds) {
  const branch = 'master';
  const cutoffDateTimeString = moment().subtract(1, 'Month').format();
  return determineDeploymentFrequency(builds, branch, cutoffDateTimeString);
}

function determineDeploymentFrequencyForThreeMonths(builds) {
  const branch = 'master';
  const cutoffDateTimeString = moment().subtract(3, 'Months').format();
  return determineDeploymentFrequency(builds, branch, cutoffDateTimeString);
}
