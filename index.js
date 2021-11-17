const CONFIG = require('./config.json') // Bot token, bot Id
const Discord = require('discord.js')
const client = new Discord.Client()
require('discord-buttons')(client)
const { MessageButton, MessageActionRow, default: discordButtons } = require('discord-buttons')

const { hexCores } = require('./colors.json')
const { infoFrames } = require('./frames.json')
const prefix = '-'

let embedArray = []
let counter = 0


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return

	let args = message.content.slice(prefix.length).split(/ +/)
	let command = args.shift().toLowerCase()

	let empty = true
	let framesFound = []
	let embedColor = 0
	let prevCommand


	if (prevCommand != command) {
		embedArray = []
		framesFound = []
		counter = 0
	} else {
		prevCommand = command
	}

	for (index in infoFrames) {

		let wordFound = infoFrames[index].bits.some(bit => bit.toLowerCase() == command)
		if (wordFound) {
			empty = false
			framesFound.push(infoFrames[index])
		}
	}


	for (index in hexCores) {
		if (hexCores[index].material === command) {
			embedColor = hexCores[index].hexcolor
		}
	}


	if (empty) {
		message.channel.send('Nenhum frame encontrado')
		return
	}


	for (let i = 0; i < framesFound.length; i++) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${framesFound[i].number}. ${framesFound[i].name}`)
			.setDescription(`- 2,500 ${framesFound[i].bits[0]} bits\n
					- 2,500 ${framesFound[i].bits[1]} bits\n
					comando: kbuy ${framesFound[i].name.toLowerCase()} frame`)
			.setColor(embedColor)
			.setImage(framesFound[i].img)
			.setFooter(`${i + 1}/${framesFound.length}`)

		embedArray.push(embed)
	}


	const btnNext = new MessageButton()
		.setEmoji('▶️')
		.setStyle('grey')
		.setID('btnN')
	const btnPrev = new MessageButton()
		.setEmoji('◀️')
		.setStyle('grey')
		.setID('btnP')

	const buttons = new MessageActionRow().addComponents(
		btnPrev,
		btnNext,
	)


	message.channel.send(
		{
			content: embedArray[counter],
			embeds: embedArray,
			components: [buttons]
		}
	)
	

	// framesFound = []
	// counter = 0
	console.log(`embed array: ${embedArray.length}`)
	console.log(`framesfound: ${framesFound.length}`)
	
})

client.on('clickButton', async (data) => {
	await data.reply.defer()


	if (data.id === 'btnN') {
		if (counter < embedArray.length - 1) {
			counter++
			data.message.edit({ content: embedArray[counter] })
			console.log(counter)
		}
	}

	if (data.id === 'btnP') {
		if (counter > 0) {
			counter--
			data.message.edit({ content: embedArray[counter] })
		}
	}

})

client.login(CONFIG.token)