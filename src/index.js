const getAllPipelineBuilds = require('./getAllPipelineBuilds');
const determineAverageLeadTime = require('./determineAverageLeadTime');

const PIPELINE = process.argv[2];
const GRAPHQL_URI = process.argv[3];
const BUILDKITE_API_KEY = process.argv[4];

(async () => {
  const builds = await getAllPipelineBuilds(GRAPHQL_URI, BUILDKITE_API_KEY, PIPELINE);
  console.log('Found', builds.length, builds.length > 1 ? 'builds' : 'build');

  const output = {
    leadTimeInMinutes: determineLeadTimeInMinutes(builds),
  }

  console.log(JSON.stringify(output, null, 2));
})();

function determineLeadTimeInMinutes(builds) {
  const branch = 'master';
  const unit = 'Minutes';
  return determineAverageLeadTime(builds, branch, unit);
}
