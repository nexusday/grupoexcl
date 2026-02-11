let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  const adminCheckMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await conn.groupMetadata(m.chat).catch(_ => null)) : {}) || {}  
  const groupParticipants = (m.isGroup ? adminCheckMetadata.participants : []) || []  
  const user = (m.isGroup ? groupParticipants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}  
  const isRAdmin = user?.admin == 'superadmin' || false  
  const isAdminManual = isRAdmin || user?.admin == 'admin' || false  

  const isOwnerManual = global.owner.some(([number]) => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === m.sender) || 
                  global.ownerLid?.some(([number]) => number.replace(/[^0-9]/g, '') + '@lid' === m.sender) ||
                  m.sender === conn.user.jid

  if (!isAdminManual && !isRAdmin && !isOwnerManual) {
    return conn.reply(m.chat, '[❗] Solo los administradores u owner pueden usar este comando.', m)
  }

  const mode = args[0]?.toLowerCase()
  if (mode === 'on') {
    global.db.data.settings.iaMode = true
    await global.db.write()
    m.reply('Modo IA activado. El bot responderá a mensajes normales como IA.')
  } else if (mode === 'off') {
    global.db.data.settings.iaMode = false
    await global.db.write()
    m.reply('Modo IA desactivado. El bot solo responderá a comandos.')
  } else {
    m.reply('Uso: .modoia on/off')
  }
}

handler.command = ['modoia']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
