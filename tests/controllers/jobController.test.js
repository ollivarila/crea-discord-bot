/* eslint-disable no-undef */
const dotenv = require('dotenv')
const {
  createJob, removeJob, getJob, createCrontime,
} = require('../../controllers/jobController')
const { createConnection } = require('../../utils/misc')

dotenv.config()

describe('Job tests', () => {
  let jobs
  beforeAll(async () => createConnection())

  afterEach(() => {
    removeJob('234234')
    jobs = []
  })

  test('createJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      id: '234234',
    }
    jobs = createJob({ ...data, time: createCrontime(data.time) }, async () => {
    })
    expect(jobs.length).toBe(1)
  })

  test('removeJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      id: '234234',
    }
    jobs = createJob({ ...data, time: createCrontime(data.time) }, async () => {
    })
    jobs = removeJob(data.id)
    expect(jobs.length).toBe(0)
  })

  test('getJob()', () => {
    const data = {
      time: '8:00',
      utcOffset: '+2',
      id: '234234',
    }
    jobs = createJob({ ...data, time: createCrontime(data.time) }, async () => {
    })
    const job = getJob(data.id)
    expect(job.id).toBe(data.id)
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
