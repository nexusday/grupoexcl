import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return

  let q = m.quoted ? m.quoted : m

  if (q.mtype !== 'imageMessage') {
    return m.reply('Responde a una imagen con /setpago.')
  }

  const caption = (q.caption || '').trim()

  const imageBuffer = await q.download()

  if (!imageBuffer) {
    return m.reply('❌ No pude descargar la imagen.')
  }

  try {
    await writeFile(path.join(ROOT, 'pago.jpg'), imageBuffer)
  } catch (e) {
    return m.reply('❌ Error al guardar la imagen: ' + e.message)
  }

  global.db.data.pago = { text: caption }

  await m.reply('✅ Método de pago actualizado correctamente.\nTexto guardado: ' + caption)
}

handler.help = ['/setpago (imagen con caption)']
handler.tags = ['owner']
handler.command = ['setpago']

export default handler
