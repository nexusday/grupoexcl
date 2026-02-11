export async function handleIA(m, conn, isAdmin) {
  
  await conn.sendPresenceUpdate('composing', m.chat)


  let groupInfo = ''
  let userIsAdmin = false
  if (m.isGroup) {
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (groupMetadata) {
      const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id.split('@')[0])
      groupInfo = `Nombre del grupo: ${groupMetadata.subject}, Miembros: ${groupMetadata.participants.length}, Admins: ${admins.join(', ')}`
     
      const user = groupMetadata.participants.find(p => p.id === m.sender)
      userIsAdmin = user && (user.admin === 'admin' || user.admin === 'superadmin')
    }
  }

  
  const chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  chat.iaHistory = chat.iaHistory || []

  
  chat.iaHistory.push(`${m.pushName || m.sender.split('@')[0]}: ${m.text}`)

  const history = chat.iaHistory.slice(-10) 

  
  const prompt = 'Eres una IA sin Nombre. Responde de manera seria, breve y poco humorística.'
  let fullText = `${prompt}\n\nHistoria de conversación:\n${history.join('\n')}\n\nInformación del grupo: ${groupInfo}\n\nUsuario actual: ${m.pushName || 'Usuario'}, Es admin: ${userIsAdmin ? 'sí' : 'no'}\n\nResponde a: ${m.text}`

  
  try {
    const url = `https://api.delirius.store/ia/gptprompt?text=${encodeURIComponent(fullText)}&prompt=${encodeURIComponent(prompt)}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.status && data.data) {
      await conn.sendMessage(m.chat, { text: data.data }, { quoted: m })
      
      chat.iaHistory.push(`Bot: ${data.data}`)
      
      if (chat.iaHistory.length > 20) chat.iaHistory = chat.iaHistory.slice(-20)
      await global.db.write()
    }
  } catch (e) {
    console.error('Error en IA:', e)
    await conn.sendMessage(m.chat, { text: 'Lo siento, hubo un error procesando tu mensaje.' }, { quoted: m })
  }

  
  await conn.sendPresenceUpdate('available', m.chat)
}
