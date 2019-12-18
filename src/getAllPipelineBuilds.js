const fetch = require('node-fetch');
const get = require('lodash.get');

const buildQuery = require('./buildQuery');

module.exports = async function getAllPipelineBuilds(uri, token, pipeline) {
  const NO_CURSOR = '';
  const builds = await recursivelyGetBuilds(uri, token, pipeline, NO_CURSOR);
  return builds.map(build => build.node);
}

async function recursivelyGetBuilds(uri, token, pipeline, cursor) {
  const PAGE_SIZE = 500;
  const body = buildQuery(pipeline, PAGE_SIZE, cursor);
  const config = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(uri, config);

  if (!response.ok) {
    console.error(await response.json())
    throw new Error('Response not OK')
  }

  const jsonResponse = await response.json();

  if (jsonResponse.errors) {
    jsonResponse.errors.map(error => console.error(error.message));
    throw new Error('Errors returned')
  }
  const builds = extractBuilds(jsonResponse);

  if (builds.length < PAGE_SIZE) {
    return builds;
  }

  const lastCursor = builds[builds.length - 1].cursor;
  const nextBuilds = await recursivelyGetBuilds(uri, token, pipeline, lastCursor);
  return [...builds, ...nextBuilds];

}

function extractBuilds(jsonResponse) {
  return get(jsonResponse, 'data.organization.pipelines.edges[0].node.builds.edges', []);
}