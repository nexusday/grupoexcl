import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*Ejemplo:* ${usedPrefix + command} What is the weather like today?`)

  try {
    const apiUrl = `https://api.delirius.store/ia/chatgpt?q=${encodeURIComponent(text)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status) return m.reply('*[❗] Error en la API de ChatGPT.*')

    m.reply(data.data)

  } catch (e) {
    console.error('Error en chatgpt:', e)
    m.reply('*[❗] Ocurrió un error al consultar ChatGPT.*')
  }
}

handler.help = ['#chatgpt <consulta>']
handler.tags = ['ai']
handler.command = ['chatgpt', 'gpt']
export default handler
