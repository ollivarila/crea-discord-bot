/* eslint-disable no-undef */
const dotenv = require('dotenv')
const {
  createJob, removeJob, getJob, createCrontime,
} = require('../../controllers/jobController')

dotenv.config()

describe('Job tests', () => {
  let jobs

  afterEach(() => {
    jobs = removeJob('234234')
  })

  test('createJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      discordid: '234234',
    }
    jobs = createJob(data, async () => {
    })
    expect(jobs.length).toBe(1)
  })

  test('removeJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      discordid: '234234',
    }
    createJob(data, () => {
    })
    jobs = removeJob(data.discordid)
    expect(jobs.length).toBe(0)
  })

  test('getJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      discordid: '234234',
    }
    createJob(data, () => {
    })
    const job = getJob(data.discordid)
    expect(job.discordid).toBe(data.discordid)
  })

  test('createCrontime()', () => {
    const shouldBe = '0 0 8 * * *'
    const res = createCrontime('8:00')
    expect(res).toBe(shouldBe)
  })

  test('Invalid time format is handled correctly', () => {
    const shouldBe = false
    const timesToTest = [
      '0800',
      '8',
      '34:123',
      ':-0',
      ':',
      ' ',
      '-0:-0',
    ]
    timesToTest.forEach(time => {
      expect(createCrontime(time)).toBe(shouldBe)
    })
  })
})
