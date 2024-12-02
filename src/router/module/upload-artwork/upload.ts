const UploadPage = () => import('@/views/upload-artwork/upload-page.vue')
import { notification } from '@/components/notification'
import localCache from '@/utils/local-storage'

export default {
  path: '/upload',
  name: 'UploadPage',
  component: UploadPage,
  beforeEnter: () => {
    // 如果没有 token 就跳到登录
    const local_token = localCache.getCache('refreshToken')
    // 没有token
    if (!local_token) {
      notification({
        type: 'error',
        title: '上传作品',
        message: '请登录后再进行操作'
      })
      return '/login' // return 就是跳转到XXX
    }
  },
  meta: {
    // 验证登陆
    authLogin: true,
    title: '上传作品 - 纸上'
  }
}
