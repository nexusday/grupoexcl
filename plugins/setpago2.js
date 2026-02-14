import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

let handler = async (m, { conn, isOwner, args }) => {
  if (!isOwner) return

  const text = m.text.replace(/^\/setpago2\s*/i, '').trim() || (m.quoted ? m.quoted.text : '')

  if (!text) {
    return m.reply('Envía /setpago2 seguido del texto o responde a un mensaje con /setpago2.')
  }

  global.db.data.pago2 = { text }

  await m.reply('✅ Método de pago 2 actualizado: ' + text)
}

handler.help = ['/setpago2 (imagen con caption)']
handler.tags = ['owner']
handler.command = ['setpago2']

export default handler
