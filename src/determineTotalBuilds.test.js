const moment = require('moment-timezone');

const determineTotalBuilds = require('./determineTotalBuilds');

describe('determineTotalBuilds', () => {

  it('includes builds for a specified branch after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }, {
      branch: 'master',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(2);
  });

  it('does not include builds for non-specified branches after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }, {
      branch: 'notMaster',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(1);
  });

  it('does not include builds prior to the specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'notMaster',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(0);
  });
});