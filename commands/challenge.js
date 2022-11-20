const { EmbedBuilder } = require('discord.js')
const { request } = require('../utils/requests')

const challenge = {
  type: 1,
  name: 'challenge',
  description: 'Challenge a user to a chess match',
  options: [
    {
      type: 6,
      name: 'username',
      description: 'Username of the person you wish to challenge',
      required: true,
    },
  ],
}

const getChallengeUrl = async () => {
  const url = 'https://lichess.org/api/challenge/open'
  const res = await request(url, {
    method: 'post',
    data: {
      clock: {
        limit: 300,
        increment: 5,
      },
    },
  })

  return res ? res.data.challenge.url : null
}

const getChallengeEmbed = (props) => {
  const { player1, player2, url } = props
  const challengeEmbed = new EmbedBuilder()
    .setColor('#8a00c2')
    .setTitle('Match link')
    .setDescription(`${player1} vs. ${player2}`)
    .setURL(url)
    .setFooter({ text: 'CreaBot' })

  return challengeEmbed
}

module.exports = {
  challenge,
  getChallengeUrl,
  getChallengeEmbed,
}
