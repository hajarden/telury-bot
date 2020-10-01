// Run dotenv
const { prefix, token } = require('./config.json');

const Discord = require('discord.js');
const axios = require('axios');
const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const smtp = require('nodemailer');
const ytdl = require('ytdl-core');
const Yt = require("discord-youtube-api");



const client = new Discord.Client();
const pastebin = new PastebinAPI('#');
const youtube = new Yt("#");
const queue = new Map();



const maintenance = 0;

function getCsrfToken() {
	var get = axios.get('https://accounts.spotify.com/', { withCredentials: true }, {
		header: {
			'Accept-Language:':'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
			'Upgrade-Insecure-Requests:': '1',
			'Content-Type:':'application/x-www-form-urlencoded',
			'Accept:':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Cache-Control:':'max-age=0',
			'Connection:':'keep-alive',
			'User-Agent:':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
		}
	})
	.then(res => {
		hasil = JSON.stringify(res.headers);
		data = JSON.parse(hasil);
		re1 = data["set-cookie"][2].split(";");
		re2 = re1[0].split("=");
		csrf = re2[1];
		return console.log(csrf);
	}).catch(function(e) {
		console.log(e);
	});
}
function spotifyLogin() {
	var token = getCsrfToken();
}

client.on('ready', () => {
	client.user.setActivity('egg help | @eggy4prlnt', { type: 'STREAMING' });
    console.log(`Logged in as ${client.user.tag}!`);
});

// KALO ADA MEMBER JOIN
client.on('guildMemberAdd', async (member) => {  
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
	// Do nothing if the channel wasn't found on this server
	if (!channel) console.log('');
	// Send the message, mentioning the member
	await channel.send(`Haii ${member}, Selamat bergabung.. semoga betah ^^`);
  });


client.on('message', msg => {
	const args = msg.content.slice(prefix.length).split(' ');
	const commands = args.shift().toLowerCase();
	const Prefix = commands == 'gg';
	const command = args[0];

  	if (Prefix){
			if (maintenance == 1) {
				return msg.channel.send('`BOT MAINTENANCE`');
			}
	  		if (!args.length) {
				return msg.channel.send(`> You didn't provide any arguments, ${msg.author}!`);
			}
			else if (command == 'help') {
				const card = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setAuthor('Telur[y]', `${client.user.displayAvatarURL()}`, 'https://discord.js.org')
				.setDescription('Private bot yang mempunyai banyak tool yang sangat membantu.\n')
				.addFields({
					name: 'Information Gathering',
					value: '`egg revip <site>` [Reverse Ip]\n`egg revdns <site>` [Reverse DNS]\n`egg httpchk <site>` [HTTP Header Check]\n`egg whois <site>` [WhoIs Lookup]\n`egg zone <site>` [Zone Transfer]'
				},
			{
				name: 'Other Tools',
				value: '`egg smtp <email> <host:port> <username|password>` [SMTP Checker]\n`egg spotify <email|password>` [Spotify Account Creator]'
			});
				msg.channel.send(card);
			}
			// INFORMATION GATHERING TOOLS
			else if(command == 'revip') {
				if (args[1]) {
					axios.get(`https://api.hackertarget.com/reverseiplookup/?q=`+args[1])
				      .then(res => {
				     	const hasil = res.data;
				     	if (hasil == 'error check your search parameter') {
				     		const card = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.addFields({
								name: "Result:",
								value: '\n`error check your search parameter`',
							});
							msg.channel.send(card);
				     	} else {
				     		var paste = pastebin.createPaste({
						        text: hasil,
						        title: "Result from Telur[y]",
						        format: null,
						        privacy: 0,
						        expiration: 'N'
						    })
						      .then(function (data) {
							    console.log(data);
							    raw = data.replace('https://pastebin.com', 'https://pastebin.com/raw');
							    const card = new Discord.MessageEmbed()
								.setColor('#0099ff')
								.setAuthor(`T[y] - ReverseIP`, `${msg.author.displayAvatarURL()}`, 'https://discord.js.org')
								.addFields({
									name: "Result:",
									value: '\n`'+raw+'`',
								});
								msg.channel.send(card);
							  })
							  .fail(function (err) {
							    console.log(err);
							  });
				     	}
					});
				} else {
					const card = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addFields({
							name: "Result:",
							value: '\n`Usage: egg '+command+' <site>`',
						});
						msg.channel.send(card);
				}
			}
			else if(command == 'revdns') {
				if (args[1]) {
					axios.get(`https://api.hackertarget.com/reversedns/?q=`+args[1])
				      .then(res => {
				     	const hasil = res.data;
				     	if (hasil == 'error check your search parameter') {
				     		const card = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.addFields({
								name: "Result:",
								value: '\n`error check your search parameter`',
							});
							msg.channel.send(card);
				     	} else if(hasil == 'No PTR records found') {
				     		const card = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.addFields({
								name: "Result:",
								value: '\n`No PTR records found`',
							});
							msg.channel.send(card);
				     	} else {
				     		var paste = pastebin.createPaste({
						        text: hasil,
						        title: "Result from Telur[y]",
						        format: null,
						        privacy: 0,
						        expiration: 'N'
						    })
						      .then(function (data) {
							    console.log(data);
							    raw = data.replace('https://pastebin.com', 'https://pastebin.com/raw');
							    const card = new Discord.MessageEmbed()
								.setColor('#0099ff')
								.setAuthor(`T[y] - ReverseDNS`, `${msg.author.displayAvatarURL()}`, 'https://discord.js.org')
								.addFields({
									name: "Result:",
									value: '\n`'+raw+'`',
								});
								msg.channel.send(card);
							  })
							  .fail(function (err) {
							    console.log(err);
							  });
				     	}
					});
				} else {
					const card = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addFields({
							name: "Result:",
							value: '\n`Usage: egg '+command+' <site>`',
						});
						msg.channel.send(card);
				}
			}
			else if(command == 'httpchk') {
				if (args[1]) {
					axios.get(`https://api.hackertarget.com/httpheaders/?q=`+args[1])
				      .then(res => {
				     	const hasil = res.data;
				     	if (hasil == 'error check your search parameter') {
				     		const card = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.addFields({
								name: "Result:",
								value: '\n`error check your search parameter`',
							});
							msg.channel.send(card);
				     	} else {
						    const card = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.setAuthor(`T[y] - HTTP Header Check`, `${msg.author.displayAvatarURL()}`, 'https://discord.js.org')
							.addFields({
								name: "Result:",
								value: '\n`'+hasil+'`',
							});
							msg.channel.send(card);
				     	}
					});
				} else {
					const card = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addFields({
							name: "Result:",
							value: '\n`Usage: egg '+command+' <site>`',
						});
						msg.channel.send(card);
				}
			}

			// YOUTUBE TOOLS
			else if (command == 'smtp') {
				if (args[1]) {
					var email = args[1];
					var data = args[2]
					var host = data.split(":");
					var user = args[3];
					var str = user.split("|");
					var check = smtp.createTransport({
					    host: host[0],
					    port: host[1],
							requireTLS: true,
							tls: {
					        rejectUnauthorized:false
					    },
					    auth: {
					       user: str[0],
					       pass: str[1]
					    }
					});
					var message = {
					    from: str[0], // Sender address
					    to: args[1],         // List of recipients
					    subject: 'SMTP WORKED!', // Subject line
					    text: 'Host:'+host[0]+' Port:'+host[1]+' User:'+str[0]+' Pass:' +str[1], // Plain text body
					};
					check.sendMail(message, function(err, info) {
					    if (err) {
								console.log('Host:'+host[0]+' Port:'+host[1]+' User:'+str[0]+' Pass:' +str[1]);
								console.log(err);
								msg.channel.send('> Error! check your smtp data.');
					    } else {
								msg.channel.send('> Success! Check your email.');
					    }
					});
				}
			}
			else if (command == 'spotify') {
				if (args[1]) {
					var data = args[1];
					var user = data.split('|');
					var nama = Math.random().toString(36).substr(2, 99).split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');
					axios.post(`https://spclient.wg.spotify.com/signup/public/v1/account/`, "birth_month=3&email="+user[0]+"&key=142b583129b2df829de3656f9eb484e6&name="+nama+"&password="+user[1]+"&platform=Android-ARM&iagree=true&gender=male&password_repeat="+user[1]+"&creation_point=client_mobile&birth_year=1996&birth_day=3", {
						header: {
							'spotify-app-version:':'8.5.47',
							'x-client-id:':'9a8d2f0ce77a4e248bb71fefcb557637',
							'app-platform:':'Android',
							'content-type:':'application/x-www-form-urlencoded',
						},
						headers: {
							'User-Agent':'Spotify/8.5.47 Android/28 (vivo 1904)'
						}
					})
					.then(res => {
								hasil = JSON.stringify(res.data);
								datas = JSON.parse(hasil);
								if (datas.status == '1') {
									const card = new Discord.MessageEmbed()
										.setColor('#0099ff')
										.setAuthor(`T[y] - Spotify Account Creator`, `${msg.author.displayAvatarURL()}`, 'https://discord.js.org')
										.addFields({
											name: "Result:",
											value: '\nSuccess!\n`Email:'+user[0]+' Password:'+user[1]+'`',
										});
										msg.channel.send(card);
								} else {
									error = JSON.stringify(datas.errors);
									msg.channel.send('> Error! '+JSON.parse(error).email);
								}
						}).catch(function(e) {
				      console.log(e);
				    });
				} else {
					const card = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.addFields({
							name: "Result:",
							value: '\n`Usage: egg '+command+' <site>`',
						});
						msg.channel.send(card);
				}
			}
			else if (command == 'play') {
				spotifyLogin();
			}
  	}
});


client.login(token);
