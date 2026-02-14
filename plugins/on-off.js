let handler = async (m, { conn, isOwner }) => {
  if (m.isGroup) return

  if (!isOwner) return

  const lowerText = m.text.toLowerCase()
  if (lowerText === '/on') {
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.chats[m.chat].paymentSent = false
    await global.db.write()
    await m.reply('VOLVERE A RESPONDER EN ESTE CHAT.')
  } else if (lowerText === '/off') {
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.chats[m.chat].paymentSent = true
    await global.db.write()
    await m.reply('YA NO RESPONDERE EN ESTE CHAT.')
  }
}

handler.help = ['/on • /off\n→ Controlar respuestas de IA en chat privado']
handler.tags = ['owner']
handler.command = ['on', 'off']

export default handler
