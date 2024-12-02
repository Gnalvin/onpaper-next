import OSS from 'ali-oss'
import type { IStsToken } from '@/service/sts/type'

export function getOssClient(
  option: IStsToken,
  bucketName: 'temp' | 'preview' = 'temp'
) {
  let bucket = import.meta.env.VITE_OSS_TEMP_BUCKET
  if (bucketName == 'preview') bucket = import.meta.env.VITE_OSS_PREVIEW_BUCKET
  return new OSS({
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: option.token.accessKeyId,
    accessKeySecret: option.token.accessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: option.token.securityToken,
    // 填写Bucket名称。
    bucket: bucket,
    // 填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: import.meta.env.VITE_OSS_REGION
  })
}
