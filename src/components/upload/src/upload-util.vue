<template>
  <div class="util">
    <input
      ref="fileInput"
      type="file"
      class="input"
      title=""
      :multiple="multiple"
      @change="handleFileChange"
      accept="image/jpeg,image/png"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    fileSize: {
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: false
    },
    uploadKey: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 1
    }
  },
  emits: ['fileData'],
  setup(props, { emit }) {
    // 点击上传文件后 @change 调用这个函数 拿到文件
    const handleFileChange = (even: Event) => {
      const target = even.target as HTMLInputElement
      // 返回文件数组
      const fileList = Array.from(target.files!)
      let isImage = true
      const imgTypeList = ['image/jpeg', 'image/png']
      // 因为直接获取得到的 fileLIst 不能更改 所以把他复制出来
      const files: File[] = []
      for (const i of fileList) {
        files.push(i)
      }

      // 判断文件类型
      for (let i = 0; i < files.length; i++) {
        if (!imgTypeList.includes(files[i].type)) {
          // 把不是图片的 剔除
          files.splice(i, 1)
        }
      }

      if (files.length == 0) isImage = false

      // 判断个数
      if (files.length > props.maxCount) {
        // 同一文件不能再次调用 @change 需要重置
        target.value = ''
        return emit('fileData', { tooMuch: true })
      }
      //判断文件大小
      for (const file of files) {
        if (file.size > props.fileSize * 1024 * 1024) {
          // 同一文件不能再次调用 @change 需要重置
          target.value = ''
          return emit('fileData', { isLarge: true })
        }
      }
      const urlList: string[] = []
      const fileDataList: File[] = []
      const formDataList: FormData[] = []
      for (const file of files) {
        // 创建一个 本地url 链接
        const url = URL.createObjectURL(file)
        urlList.push(url)
        //文件类型的数据
        fileDataList.push(file)
        // 把文件变成可以 axios 发送的数据
        const formData = new FormData()
        // 第一个参数为 key 后端处理的 key
        formData.append(props.uploadKey, file)
        formDataList.push(formData)
      }
      // 如果是单文件上传
      if (!props.multiple) {
        // 发出url 和 base64 给 父组件展示上传
        emit('fileData', {
          url: urlList[0],
          formData: formDataList[0],
          fileData: fileDataList[0],
          isImage: isImage,
          isLarge: false
        })
      } else {
        //多文件上传
        emit('fileData', {
          urlList,
          formDataList,
          fileDataList,
          isImage: true,
          isLarge: false,
          tooMuch: false
        })
      }

      // 同一文件不能再次调用 @change 需要重置
      target.value = ''
    }
    // 暴露一个方法 直接调用文件点击
    const fileInput = ref<HTMLInputElement>()
    const upload = (multiple?: boolean) => {
      // true 多选
      if (multiple) {
        fileInput.value?.setAttribute('multiple', '')
      } else {
        fileInput.value?.removeAttribute('multiple')
      }
      fileInput.value?.click()
    }

    return {
      fileInput,
      handleFileChange,
      upload
    }
  }
})
</script>

<style scoped lang="less">
.util {
  height: 100%;
  width: 100%;
}
.input {
  height: 100%;
  width: 100%;
  cursor: pointer;
  caret-color: transparent;
  opacity: 0;
  background-color: black;
}
</style>
