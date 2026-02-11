import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `*[❗] Ingresa un término de búsqueda.*\nEjemplo: ${usedPrefix + command} yahyaalmthr`,
    contextInfo: {
      ...rcanal.contextInfo
    }
  }, { quoted: m })

  try {

    const searchUrl = `https://api.vreden.my.id/api/v1/search/instagram/reels?query=${encodeURIComponent(text)}`
    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!data.status || !data.result || !data.result.search_data || data.result.search_data.length === 0) {
      return conn.sendMessage(m.chat, {
        text: '*[❗] No se encontraron resultados para tu búsqueda.*',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    const reel = data.result.search_data[0]

    const info = `
╭───「 ✦ 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢 𝗗𝗘 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 ✦ 」
│
│  *[+] Título:* ${reel.caption || 'Sin título'}
│  *[+] Autor:* ${reel.profile.full_name} (@${reel.profile.username})
│  *[+] Verificado:* ${reel.profile.is_verified ? 'Sí' : 'No'}
│
│  *[•] Estadísticas*
│  *├─* Vistas: ${reel.statistics.play_count ? reel.statistics.play_count.toLocaleString() : 'N/A'}
│  *├─* Me gusta: ${reel.statistics.like_count ? reel.statistics.like_count.toLocaleString() : 'N/A'}
│  *├─* Comentarios: ${reel.statistics.comment_count ? reel.statistics.comment_count.toLocaleString() : 'N/A'}
│  *├─* Compartidos: ${reel.statistics.share_count ? reel.statistics.share_count.toLocaleString() : 'N/A'}
│  *└─* Duración: ${reel.duration ? reel.duration.toFixed(1) + 's' : 'N/A'}
│
│  *[•] Enlaces*
│  *├─* Reel: ${reel.links}
│  *└─* Fecha: ${reel.created_at ? new Date(reel.created_at * 1000).toLocaleDateString() : 'N/A'}
│
╰───「 ✦ ${global.packname} ✦ 」`

    await conn.sendMessage(m.chat, {
      video: { url: reel.reels.url },
      caption: info,
      mentions: [m.sender],
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })

  } catch (e) {
    console.error('Error en igsearch:', e)
    conn.sendMessage(m.chat, {
      text: '*[❗] Ocurrió un error al buscar en Instagram. Por favor, inténtalo de nuevo más tarde.*',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['#igsearch <búsqueda>']
handler.tags = ['busqueda']
handler.command = ['igsearch', 'ig']
export default handler
