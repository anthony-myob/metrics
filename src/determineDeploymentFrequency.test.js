const moment = require('moment-timezone');

const determineDeploymentFrequency = require('./determineDeploymentFrequency');

describe('determineDeploymentFrequency', () => {

  it('includes PASSED builds for a specified branch after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'PASSED',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }, {
      branch: 'master',
      state: 'PASSED',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = determineDeploymentFrequency(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(2);
  });

  it('does not include non PASSED builds for a specified branch after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'NOT_PASSED',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }];

    const result = determineDeploymentFrequency(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include non PASSED builds for a non specified branch after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'notMaster',
      state: 'NOT_PASSED',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }];

    const result = determineDeploymentFrequency(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include PASSED builds for a non-specified branch after a specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'notMaster',
      state: 'PASSED',
      finishedAt: cutoffDateTime.clone().add(2, 'Days').format(),
    }];

    const result = determineDeploymentFrequency(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include builds prior to the specified date', () => {
    const branch = 'master';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'PASSED',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'notMaster',
      state: 'PASSED',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'master',
      state: 'NOT_PASSED',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'notMaster',
      state: 'NOT_PASSED',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }];

    const result = determineDeploymentFrequency(builds, branch, cutoffDateTime.format());

    expect(result).toEqual(0);
  });
});