const moment = require('moment-timezone');

const determineDurationPercentilesInMinutes = require('./determineDurationPercentilesInMinutes');

describe('determineDurationPercentilesInMinutes', () => {
  const cutoffDateTime = moment('2019-12-18T00:00:00.000Z');
  const builds = [{
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(1, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(2, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(3, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(4, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(5, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(6, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(7, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(8, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(9, 'Minute').format(),
  },
  {
    branch: 'master',
    createdAt: cutoffDateTime.clone().add(1, 'Day').format(),
    finishedAt: cutoffDateTime.clone().add(1, 'Day').add(10, 'Minute').format(),
  }];

  it('returns the 80th percentile', () => {
    const percentiles = [80];
    const onMaster = true;

    const result = determineDurationPercentilesInMinutes(percentiles, builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual({ p80: 8 });
  });

  it('returns the 90th percentile', () => {
    const percentiles = [90];
    const onMaster = true;

    const result = determineDurationPercentilesInMinutes(percentiles, builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual({ p90: 9 });
  });

  it('returns both the 80th and 90th percentile', () => {
    const percentiles = [80, 90];
    const onMaster = true;

    const result = determineDurationPercentilesInMinutes(percentiles, builds, onMaster, cutoffDateTime.format());

    expect(result).toEqual({ p80: 8, p90: 9 });
  });
});