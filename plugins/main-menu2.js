let handler = async (m, { conn, usedPrefix }) => {
  const menu = `
=== MENÚ PRINCIPAL 2 ===

*${usedPrefix}chatgpt <texto>* 

*${usedPrefix}modoia on/off* 

*${usedPrefix}adivinanza* 

*${usedPrefix}burro @usuario*

*${usedPrefix}gay @usuario* 

*${usedPrefix}play <búsqueda>* 

*${usedPrefix}tiktok <nombre>*

*${usedPrefix}ig <búsqueda>* 

*${usedPrefix}youtube <nombre>*

_Usa los comandos con el prefijo correcto._
  `.trim()

  conn.sendMessage(m.chat, {
    text: menu,
    contextInfo: {
      mentionedJid: [],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '',
        newsletterName: '',
        serverMessageId: 143
      }
    }
  }, { quoted: m })
}

handler.command = ['main-menu2', 'menu2']
handler.tags = ['info']
handler.help = ['main-menu2 - Menú de comandos agregados']

export default handler
