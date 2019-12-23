const moment = require('moment-timezone');

const determineAverageLeadTime = require('./determineAverageLeadTime');

describe('determineAverageLeadTime', () => {
  it('includes PASSED builds for a specified branch', () => {
    const branch = 'master';
    const unit = 'Minutes';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'PASSED',
      createdAt: cutoffDateTime.clone().add(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().add(2, 'Minutes').format(),
    }];

    const result = determineAverageLeadTime(builds, branch, unit);

    expect(result).toEqual(1);
  });

  it('returns the average', () => {
    const branch = 'master';
    const unit = 'Minutes';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'PASSED',
      createdAt: cutoffDateTime.clone().add(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().add(2, 'Minutes').format(),
    }, {
      branch: 'master',
      state: 'PASSED',
      createdAt: cutoffDateTime.clone().add(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().add(4, 'Minutes').format(),
    }];

    const result = determineAverageLeadTime(builds, branch, unit);

    expect(result).toEqual(2);
  });

  it('does not include builds that finished prior to the specified date', () => {
    const branch = 'master';
    const unit = 'Minutes';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'PASSED',
      createdAt: cutoffDateTime.clone().subtract(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().subtract(2, 'Minutes').format(),
    }
  ];

    const result = determineAverageLeadTime(builds, branch, unit, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include non-specified branches', () => {
    const branch = 'master';
    const unit = 'Minutes';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'notMaster',
      state: 'PASSED',
      createdAt: cutoffDateTime.clone().add(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().add(2, 'Minutes').format(),
    }
  ];

    const result = determineAverageLeadTime(builds, branch, unit);

    expect(result).toEqual(0);
  });

  it('does not include non-passing builds', () => {
    const branch = 'master';
    const unit = 'Minutes';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'notPASSED',
      createdAt: cutoffDateTime.clone().add(1, 'Minute').format(),
      finishedAt: cutoffDateTime.clone().add(2, 'Minutes').format(),
    }
  ];

    const result = determineAverageLeadTime(builds, branch, unit);

    expect(result).toEqual(0);
  });
});