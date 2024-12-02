import type { IBaseArtwork } from '@/service/artwork/type'
import { formatPicUrl } from '@/utils/data-format'

export function formatArtUrl(payload: IBaseArtwork[]) {
  payload.forEach((item) => {
    // 拼接 图像地址
    item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
    item.userAvatar = formatPicUrl(item.userAvatar, item.userId, 'avatars', 's')
  })
  return payload
}
