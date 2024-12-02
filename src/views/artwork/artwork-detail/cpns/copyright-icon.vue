<template>
  <div class="copyright" ref="copyrightEL" @click="isShowMore = true">
    <div class="icon">
      <svg
        v-if="copyrightList.findIndex((i) => i == 'BY') !== -1"
        width="18"
        height="18"
        viewBox="0 0 64 64"
        xml:space="preserve"
      >
        <g>
          <g>
            <path
              d="M31.9,0c9,0,16.6,3.1,22.7,9.3C60.9,15.5,64,23,64,32c0,9-3,16.5-9.1,22.5C48.4,60.8,40.7,64,31.9,64
			c-8.6,0-16.2-3.1-22.5-9.4C3.1,48.3,0,40.8,0,32c0-8.8,3.1-16.3,9.4-22.7C15.6,3.1,23.1,0,31.9,0z M32.1,5.8
			c-7.3,0-13.4,2.6-18.5,7.7C8.4,18.8,5.8,25,5.8,32c0,7.1,2.6,13.2,7.8,18.4c5.2,5.2,11.4,7.8,18.5,7.8c7.1,0,13.3-2.6,18.6-7.8
			c5-4.8,7.5-11,7.5-18.3c0-7.3-2.6-13.5-7.7-18.6C45.5,8.3,39.3,5.8,32.1,5.8z M40.6,24.1v13.1H37v15.5H27V37.1h-3.7V24.1
			c0-0.6,0.2-1.1,0.6-1.5c0.4-0.4,0.9-0.6,1.5-0.6h13.1c0.5,0,1,0.2,1.4,0.6C40.4,23,40.6,23.5,40.6,24.1z M27.5,15.8
			c0-3,1.5-4.5,4.5-4.5s4.5,1.5,4.5,4.5c0,3-1.5,4.5-4.5,4.5S27.5,18.8,27.5,15.8z"
            />
          </g>
        </g>
      </svg>
      <svg
        v-if="copyrightList.findIndex((i) => i == 'NC') !== -1"
        width="18"
        height="18"
        viewBox="0 0 64 64"
        xml:space="preserve"
      >
        <g>
          <path
            d="M31.9,0c9,0,16.6,3.1,22.7,9.3C60.9,15.4,64,23,64,32c0,9-3,16.5-9.1,22.5C48.4,60.8,40.7,64,31.9,64
		c-8.7,0-16.2-3.2-22.5-9.5C3.1,48.2,0,40.7,0,32c0-8.8,3.1-16.3,9.4-22.7C15.6,3.1,23.1,0,31.9,0z M7.2,23.4
		c-1,2.6-1.4,5.5-1.4,8.6c0,7.1,2.6,13.2,7.8,18.4c5.2,5.1,11.4,7.7,18.5,7.7c7.2,0,13.4-2.6,18.6-7.8c1.9-1.8,3.3-3.7,4.4-5.6
		L43,39.3c-0.4,2-1.4,3.7-3.1,4.9c-1.6,1.3-3.5,2-5.7,2.2v4.9h-3.7v-4.9c-3.5,0-6.8-1.3-9.7-3.8l4.4-4.5c2.1,1.9,4.5,2.9,7.1,2.9
		c1.1,0,2-0.2,2.8-0.7c0.8-0.5,1.2-1.3,1.2-2.5c0-0.8-0.3-1.4-0.9-1.9l-3.1-1.3l-3.8-1.7l-5.1-2.2L7.2,23.4z M32.1,5.7
		c-7.3,0-13.4,2.6-18.5,7.7c-1.3,1.3-2.4,2.7-3.5,4.3l12.2,5.5c0.5-1.7,1.5-3,3-4c1.5-1,3.2-1.6,5.2-1.7v-4.9h3.7v4.9
		c2.9,0.2,5.6,1.1,8,3l-4.2,4.3c-1.8-1.3-3.6-1.9-5.5-1.9c-1,0-1.9,0.2-2.7,0.6c-0.8,0.4-1.2,1-1.2,1.9c0,0.3,0.1,0.5,0.3,0.8
		l4.1,1.8l2.8,1.3l5.1,2.3l16.4,7.3c0.5-2.2,0.8-4.5,0.8-6.9c0-7.4-2.6-13.5-7.7-18.6C45.5,8.3,39.3,5.7,32.1,5.7z"
          />
        </g>
      </svg>
      <svg
        v-if="copyrightList.findIndex((i) => i == 'ND') !== -1"
        width="18"
        height="18"
        viewBox="0 0 64 64"
        xml:space="preserve"
      >
        <g>
          <g>
            <path
              d="M31.9,0c9,0,16.5,3.1,22.7,9.3C60.9,15.5,64,23,64,32s-3,16.5-9.1,22.5C48.4,60.8,40.8,64,31.9,64
			c-8.6,0-16.2-3.1-22.5-9.4C3.1,48.3,0,40.8,0,32c0-8.7,3.1-16.3,9.4-22.7C15.6,3.1,23.1,0,31.9,0z M32.1,5.8
			c-7.3,0-13.4,2.6-18.5,7.7C8.4,18.8,5.8,25,5.8,32c0,7.1,2.6,13.3,7.8,18.4c5.2,5.2,11.4,7.8,18.5,7.8c7.1,0,13.3-2.6,18.6-7.8
			c5-4.9,7.5-11,7.5-18.3c0-7.3-2.6-13.5-7.7-18.5C45.5,8.3,39.3,5.8,32.1,5.8z M44.1,24.5v5.5H20.9v-5.5H44.1z M44.1,34.7v5.5H20.9
			v-5.5H44.1z"
            />
          </g>
        </g>
      </svg>
      <svg
        v-if="copyrightList.findIndex((i) => i == 'OWNER') !== -1"
        height="18"
        viewBox="0 96 960 960"
        width="18"
      >
        <path
          d="M400 736h160q17 0 28.5-11.5T600 696v-80h-80v40h-80V496h80v40h80v-80q0-17-11.5-28.5T560 416H400q-17 0-28.5 11.5T360 456v240q0 17 11.5 28.5T400 736Zm80 240q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
        />
      </svg>
    </div>
    <span class="text" v-if="copyright == 'OWNER'"> 著作权归作者本人所有</span>
    <Transition appear>
      <div class="show-more" v-if="isShowMore">
        <div class="info">
          <div class="title">版权信息</div>
          <div class="tip">{{ text }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { clickOtherClose } from '@/hooks/click-close'
const props = defineProps({
  copyright: {
    type: String as PropType<'BY' | 'BY-ND' | 'BY-NC' | 'BY-NC-ND' | 'OWNER'>,
    required: true
  }
})

const copyrightList = computed(() => props.copyright.split('-'))
const text = computed(() => {
  switch (props.copyright) {
    case 'BY':
      return '使用作品需署名'
    case 'BY-NC':
      return '使用作品需署名、禁止商业性使用'
    case 'BY-ND':
      return '使用作品需署名、禁止修改'
    case 'BY-NC-ND':
      return '使用作品需署名、禁止商业性使用、禁止修改'
    default:
      return '在未经作者明确许可的情况下，他人不得使用此作品，包括转载分享'
  }
})

const isShowMore = ref(false)
const copyrightEL = ref<HTMLDivElement>()
clickOtherClose(copyrightEL, () => {
  isShowMore.value = false
})
</script>

<style scoped lang="less">
.copyright {
  position: relative;
}
.icon {
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    margin-right: 5px;
    fill: var(--color-regular);
  }
}
.text {
  cursor: pointer;
  color: var(--color-regular);
  font-size: 13px;
  font-weight: bold;
  padding-left: 5px;
}
.show-more {
  position: absolute;
  bottom: 30px;
  left: -25px;
  padding: 12px 10px;
  width: 280px;
  background-color: var(--surface-color1);
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 1px 5px;
  filter: drop-shadow(0 1px 2px var(--transparent-middle-hover));
  .info {
    .title {
      font-size: 13px;
      font-weight: bold;
      margin: 0 10px;
      text-transform: uppercase;
      color: var(--primary-middle-color);
    }
    .tip {
      color: var(--color-text1);
      font-size: 14px;
      line-height: 1.7;
      margin: 9px 10px 0;
      text-align: left;
    }
  }
  //箭头
  &::before {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 25px;
    height: 12px;
    width: 12px;
    transition: background-color 0.3s ease;
    background-color: var(--surface-color1);
    border-bottom: 1px solid var(--border-color1);
    border-right: 1px solid var(--border-color1);
    transform: rotate(45deg);
    z-index: 1;
  }
}
</style>
