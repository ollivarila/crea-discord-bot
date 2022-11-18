const { CronJob } = require('cron')
const { error, info } = require('../utils/logger')

let jobs = []

// 8:00 => * 0 8 * * *
const createCrontime = time => {
  if (time.includes('+') || time.includes('-')) {
    return false
  }

  const parsed = time.split(/:/)
  if (parsed.length === 1) {
    return false
  }

  const hours = parseInt(parsed[0], 10)
  const minutes = parseInt(parsed[1], 10)

  if ((!hours && hours !== 0) || (!minutes && minutes !== 0)) {
    return false
  }

  if (hours > 23 || minutes > 59 || hours < 0 || minutes < 0) {
    return false
  }

  return `0 ${minutes} ${hours} * * *`
}

const removeJob = discordid => {
  const joblist = jobs.filter(j => j.discordid === discordid)

  if (joblist.length === 0) { return false }

  joblist.forEach(job => {
    if (job.running) {
      job.stop()
    }
  })
  jobs = jobs.filter(j => j.discordid !== discordid)
  return jobs
}
/**
 *
 // eslint-disable-next-line max-len
 * @param {{ time: String, utcOffset: number, discordid: String }} data
 * @param {Function} jobToRun Function that will be called onTick
 * @returns
 */

const createJob = (data, jobToRun) => {
  const { time, utcOffset, id } = data
  info('creating job')
  const crontime = createCrontime(time)
  if (!crontime) {
    throw new Error(`Invalid time: ${time}`)
  }

  const job = new CronJob(
    crontime,
    async () => {
      info(`running job ${id}`)
      return jobToRun(data)
        .catch(err => {
          error(err)
          job.stop()
        })
    },
    () => {
      info(`Stopped job ${id}`)
      removeJob(id)
    },
    true,
    null,
    null,
    null,
    utcOffset,
  )
  info(`created job ${id} running at ${time} / ${crontime} UTC offset: ${utcOffset}`)
  jobs.push({
    job,
    id,
  })
  return jobs
}

const getJob = id => jobs.find(job => job.id === id)

const stopAll = () => {
  jobs.forEach(j => {
    if (j.running) {
      j.stop()
    }
  })
  jobs = []
}

const getAll = () => jobs

module.exports = {
  createJob,
  removeJob,
  getJob,
  createCrontime,
  stopAll,
  getAll,
}
