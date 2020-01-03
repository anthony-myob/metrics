const moment = require('moment-timezone');

const determineTotalBuilds = require('./determineTotalBuilds');

describe('determineTotalBuilds', () => {

  it('includes builds on master', () => {
    const onMaster = true;
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    },
    {
      branch: 'not master',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual(1);
  });

  it('includes builds not on master', () => {
    const onMaster = false;
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().add(1, 'Days').format(),
    }, {
      branch: 'not master',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual(1);
  });

  it('does not include builds prior to the specified date', () => {
    const onMaster = true;
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'notMaster',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }];

    const result = determineTotalBuilds(builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual(0);
  });
});