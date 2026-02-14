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

  let history = []
  if (!m.isGroup) {
    const number = m.sender.split('@')[0]
    const filePath = `./storage/ia_${number}.json`
    try {
      const fs = await import('fs')
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8')
        history = JSON.parse(data)
      }
    } catch (e) {
      console.error('Error loading IA history:', e)
    }
  } else {
    const chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    chat.iaHistory = chat.iaHistory || []
    history = chat.iaHistory.slice(-10)
  }

  const lowerText = m.text.toLowerCase()
  const createOwnerIds = (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, '')
    return [
      cleanNumber + '@s.whatsapp.net',
      cleanNumber + '@lid'
    ]
  }
  const allOwnerIds = [
    ...global.owner.flatMap(([number]) => createOwnerIds(number)),
    ...global.ownerLid.flatMap(([number]) => createOwnerIds(number))
  ]
  const isOwner = allOwnerIds.includes(m.sender) || m.sender === conn.user.id
  if (!m.isGroup && isOwner && lowerText === 'on') {
    global.db.data.chats[m.chat].paymentSent = false
    await global.db.write()
    if (m.sender !== conn.user.id) {
      await conn.sendMessage(m.chat, { text: 'VOLVERE A RESPONDER EN ESTE CHAT.' }, { quoted: m })
    }
    return
  }
  if (!m.isGroup && isOwner && lowerText === 'off') {
    global.db.data.chats[m.chat].paymentSent = true
    await global.db.write()
    if (m.sender !== conn.user.id) {
      await conn.sendMessage(m.chat, { text: 'YA NO RESPONDERE EN ESTE CHAT.' }, { quoted: m })
    }
    return
  }

  if (!m.isGroup) {
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    if (global.db.data.chats[m.chat].paymentSent) {
      return
    }
  }

  const paymentKeywords = ['metodo de pago', 'a donde pago', 'como pago', 'pago', 'yape', 'plin']
  const isPaymentQuery = paymentKeywords.some(keyword => lowerText.includes(keyword))

  let isConfirmation = false
  if (!m.isGroup && (lowerText === 'si' || lowerText === 'yes' || lowerText === 'sí')) {
    if (history.length > 0 && history[history.length - 1].includes('datos de pago')) {
      isConfirmation = true
    }
  }

  let isScreenshot = false
  if (!m.isGroup && m.message && m.message.imageMessage && (lowerText.includes('ya esta') || lowerText.includes('ya está'))) {
    isScreenshot = true
  }

  if (!m.isGroup && lowerText.includes('ya esta') && !isScreenshot) {
    await conn.sendMessage(m.chat, { text: 'Por favor, envía una captura del pago con el mensaje "Ya está".' }, { quoted: m })
    await conn.sendPresenceUpdate('available', m.chat)
    return
  }

  if (isPaymentQuery || isConfirmation) {
    try {
      const fs = await import('fs')
      const pagoData = global.db.data.pago || JSON.parse(fs.readFileSync('./pago.json', 'utf-8'))
      const paymentText = pagoData.text

      await conn.sendMessage(m.chat, {
        image: { url: './pago.jpg' },
        caption: paymentText
      }, { quoted: m })

      if (global.db.data.pago2) {
        const pago2Data = global.db.data.pago2
        const payment2Text = pago2Data.text
        await conn.sendMessage(m.chat, { text: payment2Text }, { quoted: m })
      }

      await conn.sendMessage(m.chat, { text: 'Envía una captura del pago con el mensaje "Ya está".' }, { quoted: m })
    } catch (e) {
      console.error('Error sending payment info:', e)
      await conn.sendMessage(m.chat, { text: 'Lo siento, hubo un error procesando tu consulta de pago.' }, { quoted: m })
    }
    await conn.sendPresenceUpdate('available', m.chat)
    return
  }

  if (isScreenshot) {
    await conn.sendMessage(m.chat, { text: 'Un asesor le atenderá en unos momentos para verificar el pago.' }, { quoted: m })
    global.db.data.chats[m.chat].paymentSent = true
    await global.db.write()
    await conn.sendPresenceUpdate('available', m.chat)
    return
  }

  if (!m.isGroup) {
    history.push(`${m.pushName || m.sender.split('@')[0]}: ${m.text}`)
    history = history.slice(-10)
    try {
      const fs = await import('fs')
      fs.writeFileSync(`./storage/ia_${m.sender.split('@')[0]}.json`, JSON.stringify(history))
    } catch (e) {
      console.error('Error saving IA history:', e)
    }
  } else {
    const chat = global.db.data.chats[m.chat]
    chat.iaHistory.push(`${m.pushName || m.sender.split('@')[0]}: ${m.text}`)
  }

  const prompt = global.iaPrompt
  let text = `Historia de conversación:\n${history.join('\n')}\n\nInformación del grupo: ${groupInfo}\n\nUsuario actual: ${m.pushName || 'Usuario'}, Es admin: ${userIsAdmin ? 'sí' : 'no'}\n\nResponde a: ${m.text}`


  try {
    const url = `https://api.delirius.store/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.status && data.data) {
      await conn.sendMessage(m.chat, { text: data.data }, { quoted: m })

      if (m.isGroup) {
        const chat = global.db.data.chats[m.chat]
        chat.iaHistory.push(`Bot: ${data.data}`)
        if (chat.iaHistory.length > 20) chat.iaHistory = chat.iaHistory.slice(-20)
        await global.db.write()
      } else {
        history.push(`Bot: ${data.data}`)
        history = history.slice(-10)
        try {
          const fs = await import('fs')
          fs.writeFileSync(`./storage/ia_${m.sender.split('@')[0]}.json`, JSON.stringify(history))
        } catch (e) {
          console.error('Error saving IA history:', e)
        }
      }
    }
  } catch (e) {
    console.error('Error en IA:', e)
    await conn.sendMessage(m.chat, { text: 'Lo siento, hubo un error procesando tu mensaje.' }, { quoted: m })
  }


  await conn.sendPresenceUpdate('available', m.chat)
}
