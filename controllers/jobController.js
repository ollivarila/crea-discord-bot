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
  const jObject = jobs.find(j => j.discordid === discordid)

  if (!jObject) { return false }

  if (jObject.job.running) {
    jObject.job.stop()
  }
  jobs = jobs.filter(j => j.discordid !== discordid)
  return jobs
}

const createJob = (data, jobToRun) => {
  const { time, utcOffset, discordid } = data
  info('creating job')
  const crontime = createCrontime(time)
  if (!crontime) {
    throw new Error(`Invalid time: ${time}`)
  }

  const job = new CronJob(
    crontime,
    async () => {
      info(`running job ${discordid}`)
      return jobToRun(data)
        .catch(err => {
          error(err)
          job.stop()
        })
    },
    () => {
      info(`Stopped job ${discordid}`)
      removeJob(discordid)
    },
    true,
    null,
    null,
    null,
    utcOffset,
  )
  info(`created job ${discordid} running at ${time} / ${crontime} UTC offset: ${utcOffset}`)
  jobs.push({
    job,
    discordid,
  })
  return jobs
}

const getJob = discordid => jobs.find(job => job.discordid === discordid)

const stopAll = () => {
  jobs.forEach(j => {
    if (j.running) {
      j.stop()
    }
  })
  jobs = []
}

module.exports = {
  createJob,
  removeJob,
  getJob,
  createCrontime,
  stopAll,
}
