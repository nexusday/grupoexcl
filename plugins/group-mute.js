let handler = async (m, { conn, text, isOwner, isAdmin, usedPrefix, command }) => {
  if (!isOwner && !isAdmin) return m.reply('*[❗] Solo administradores o dueños pueden usar este comando.*')

  let who
  if (m.isGroup) {
    if (!(m.mentionedJid.length || m.quoted)) return m.reply(`Etiqueta o responde al mensaje de la persona que quieres mutear.\n\nEjemplo: ${usedPrefix}${command} @usuario`)
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  } else {
    if (!(m.mentionedJid.length || m.quoted)) return m.reply(`Etiqueta o responde al mensaje de la persona que quieres mutear.\n\nEjemplo: ${usedPrefix}${command} @usuario`)
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  }

  global.db.data.muted ||= {}
  if (global.db.data.muted[who]) return m.reply('Este usuario ya está muteado.')

  global.db.data.muted[who] = true
  await global.db.write()

  m.reply(`Usuario @${who.split('@')[0]} muteado. Sus mensajes serán eliminados.`, null, { mentions: [who] })
}

handler.command = ['mute']
handler.tags = ['group', 'admin']
handler.help = ['mute @usuario']
handler.group = true

export default handler
