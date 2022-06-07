const { Client, VoiceChannel, GuildMember } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const ayarlar = require('./jesus.json')


function jesuslog(mesaj) {
console.log(`Jesus / Welcome's | ${mesaj} | Bot : ${client.user.tag} | Bot ID : ${client.user.id} | Bot Sırası : 1 | Tarih : [${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}]`);
};

function jesushata(hata) {
console.error(`Jesus / Welcome's | Botta Bir Hata Oluştu. | Bot Sırası : 1 | Tarih : [${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}]
Hata: ${hata}`);
};

const client = new Client();
const Voice = client
const seslikanal = VoiceChannel
const sunucuuye = GuildMember

Voice.staffJoined = false;
Voice.playingVoice = false;
Voice.voiceConnection = null;
Voice.channelID = null;

/** Sese katılma & Bot login */
client.on("ready", async() => {
    client.user.setPresence({activity:{name:ayarlar.footer, type:ayarlar.type}, status: ayarlar.status})

    const Channel = client.channels.cache.get(ayarlar.channel1)
    Channel.join().then(connection => {
        Voice.voiceConnection = connection
        Voice.channelID = Channel.id
        jesuslog('Ses girişimi başarılı')
        client.guilds.cache.get(ayarlar.guildid).members.cache.get(client.user.id).voice.setDeaf(true)
        
        if(!Channel.hasStaff()){
            playVoice(client)
        }else{
            Voice.staffJoined = true
        }
    }).catch(jess => {
        jesushata(`Ses kanalına bağlanırken bir hatayla karşılaştım! [HATA] : ${jess.message}`)
    })
})

/** Bot Login */
client.login(ayarlar.token).then(x => jesuslog(`Başarıyla canlandım `)).catch(jess => {
    jesushata(`[HATA] : ${jess.message}`)
})



/*** Login play */
Voice.on("voiceStateUpdate", async(oldState, newState) => {
    if(
        newState.channelID && (oldState.channelID !== newState.channelID) &&
        newState.member.isStaff() &&
        newState.channelID === Voice.channelID &&
        !newState.channel.hasStaff(newState.member)
    ) {
        Voice.staffJoined = true;
        return playVoice(Voice);
    }
    if( 
        oldState.channelID && 
        (oldState.channelID !== newState.channelID) && 
        newState.member.isStaff() && 
        oldState.channelID === Voice.channelID &&
        !oldState.channel.hasStaff()
    ) {
        Voice.staffJoined = false;
        return playVoice(Voice);
    }
});


/** Play Function */
function playVoice(Voice) {
    try {

        const Path = Voice.staffJoined === true ? ayarlar.welcome : ayarlar.hg;
        Voice.playingVoice = true;
        Voice.voiceConnection.play(Path, {
            volume: 1
        }).on("finish", async() => {
            Voice.playingVoice = false;
            if(Voice.staffJoined === true) return;
            playVoice(Voice);
        });

    } catch(jess) {

        return jesushata(`Şarkıyı oynatamadım kontrol et istersen.
        [Hata] : ${jess.message}`)
        
    }
};


/** Staff Function */

VoiceChannel.prototype.hasStaff = function(checkMember = false) {
    if(this.members.some(m => (checkMember !== false ? m.user.id !== checkMember.id : true) && !m.user.bot && m.roles.highest.position >= m.guild.roles.cache.get(ayarlar.staff).position)) return true; 
    return false;
}

VoiceChannel.prototype.getStaffs = function(checkMember = false) {
    return this.members.filter(m => (checkMember !== false ? m.user.id !== checkMember.id : true) && !m.user.bot && m.roles.highest.position >= m.guild.roles.cache.get(ayarlar.staff).position).size
}

GuildMember.prototype.isStaff = function() {
    if(
        !this.user.bot && 
        ([ayarlar.owner].includes(this.id) ||
        this.hasPermission("ADMINISTRATOR") ||
        this.roles.highest.position >= this.guild.roles.cache.get(ayarlar.staff).position
        )
    ) return true;
    return false;
}