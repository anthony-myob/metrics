const moment = require('moment-timezone');

const getBuildCount = require('./getBuildCount');

describe('getBuildCount', () => {

  it('includes a build on master when the state matches', () => {
    const onMaster = true;
    const state = 'a state';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'a state',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = getBuildCount(builds, onMaster, state, cutoffDateTime.format());

    expect(result).toEqual(1);
  });

  it('includes a build not on master when the state matches', () => {
    const onMaster = false;
    const state = 'a state';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'not master',
      state: 'a state',
      finishedAt: cutoffDateTime.clone().add(1, 'Day').format(),
    }];

    const result = getBuildCount(builds, onMaster, state, cutoffDateTime.format());

    expect(result).toEqual(1);
  });

  it('does not include a build when the state does not match', () => {
    const onMaster = true;
    const state = 'a state';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'not the same state',
      finishedAt: cutoffDateTime.clone().add(1, 'Days').format(),
    }];

    const result = getBuildCount(builds, onMaster, state, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include a build not on master when the state does not match', () => {
    const onMaster = false;
    const state = 'a state'
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'not master',
      state: 'not the same state',
      finishedAt: cutoffDateTime.clone().add(1, 'Days').format(),
    }];

    const result = getBuildCount(builds, onMaster, state, cutoffDateTime.format());

    expect(result).toEqual(0);
  });

  it('does not include builds prior to the specified date', () => {
    const onMaster = true;
    const state = 'a state';
    const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');

    const builds = [{
      branch: 'master',
      state: 'a state',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'not master',
      state: 'a state',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'master',
      state: 'no the same state',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }, {
      branch: 'not master',
      state: 'not the same state',
      finishedAt: cutoffDateTime.clone().subtract(1, 'Day').format(),
    }];

    const result = getBuildCount(builds, onMaster, state, cutoffDateTime.format());

    expect(result).toEqual(0);
  });
});