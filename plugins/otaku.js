let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who
  if (m.mentionedJid.length) {
    who = m.mentionedJid[0]
  } else if (m.quoted) {
    who = m.quoted.sender
  } else {
    return m.reply('Menciona o responde al mensaje de alguien para calcular su porcentaje otaku.')
  }

  const percentage = Math.floor(Math.random() * 101)
  let current = 0

  let msg = await conn.sendMessage(m.chat, {
    text: `Calculando porcentaje otaku de @${who.split('@')[0]}... ${current}%`,
    mentions: [who]
  }, { quoted: m })


  const steps = [25, 50, 75, percentage]
  for (let i of steps) {
    if (i > percentage) break
    await new Promise(resolve => setTimeout(resolve, 800))
    await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: msg.key,
        type: 14,
        editedMessage: {
          conversation: `Calculando porcentaje otaku de @${who.split('@')[0]}... ${i}%`
        }
      }
    }, {})
  }

  await new Promise(resolve => setTimeout(resolve, 1000))
  const editMessage = {
    protocolMessage: {
      key: msg.key,
      type: 14,
      editedMessage: {
        extendedTextMessage: {
          text: `@${who.split('@')[0]} es ${percentage}% otaku 👾`,
          contextInfo: {
            mentionedJid: [who]
          }
        }
      }
    }
  }
  await conn.relayMessage(m.chat, editMessage, {})
}

handler.command = ['otaku']
handler.tags = ['juegos']
handler.help = ['otaku @usuario']

export default handler
