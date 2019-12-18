module.exports = function buildQuery(pipeline, pageSize, cursor='') {
  // return { query: 'query AllPipelinesQuery { organization(slug: "myob") { name }}'}
  return { query: `query AllPipelinesQuery {
    organization(slug: "myob") {
      name
      pipelines(first: 1, search:"${pipeline}") {
        edges {
          node {
            builds(first: ${pageSize}, after: "${cursor}") {
              edges {
                node {
                  uuid
                  number
                  state
                  canceledAt
                  createdAt
                  finishedAt
                  scheduledAt
                  startedAt
                  branch
                  pullRequest { id }
                }
                cursor
              }
            }
          }
        }
      }
    }
  }
  `};
};