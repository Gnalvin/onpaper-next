<template>
  <div class="permission">
    <div class="item">
      <span class="title">公开范围</span>
      <el-radio-group v-model="artPermission.whoSee">
        <el-radio label="public">所有人</el-radio>
        <el-radio label="onlyFans">仅粉丝</el-radio>
        <el-radio label="privacy">不公开</el-radio>
      </el-radio-group>
    </div>
    <div class="item copyright">
      <span class="title">版权和许可</span>
      <el-radio-group v-model="artPermission.copyright">
        <template v-for="item in copyrightList" :key="item.label">
          <el-radio :label="item.label">
            <span class="text">{{ item.text }}</span>
            <el-tooltip placement="right">
              <span class="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24 28.6248V24.6248C27.3137 24.6248 30 21.9385 30 18.6248C30 15.3111 27.3137 12.6248 24 12.6248C20.6863 12.6248 18 15.3111 18 18.6248"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24 37.6248C25.3807 37.6248 26.5 36.5055 26.5 35.1248C26.5 33.7441 25.3807 32.6248 24 32.6248C22.6193 32.6248 21.5 33.7441 21.5 35.1248C21.5 36.5055 22.6193 37.6248 24 37.6248Z"
                  />
                </svg>
              </span>
              <template #content>
                <span class="el-tooltip-text">
                  {{ item.tipText }}
                </span>
              </template>
            </el-tooltip>
          </el-radio>
        </template>
      </el-radio-group>
    </div>
    <div class="item">
      <span class="title">作品评论</span>
      <el-radio-group v-model="artPermission.comment">
        <el-radio label="public">所有人</el-radio>
        <el-radio label="onlyFans">仅粉丝</el-radio>
        <el-radio label="close">关闭评论</el-radio>
      </el-radio-group>
    </div>
    <div class="item">
      <span class="title">
        <span class="title-text"> 包含未成年敏感内容 </span>
        <el-tooltip placement="right">
          <span class="icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M24 28.6248V24.6248C27.3137 24.6248 30 21.9385 30 18.6248C30 15.3111 27.3137 12.6248 24 12.6248C20.6863 12.6248 18 15.3111 18 18.6248"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24 37.6248C25.3807 37.6248 26.5 36.5055 26.5 35.1248C26.5 33.7441 25.3807 32.6248 24 32.6248C22.6193 32.6248 21.5 33.7441 21.5 35.1248C21.5 36.5055 22.6193 37.6248 24 37.6248Z"
              />
            </svg>
          </span>
          <template #content>
            <span class="el-tooltip-text">
              作品中包含:
              抽烟、喝酒、任何包括裸露、带有性暗示的部分裸露，甚至没有裸露但具有性暗示的内容
            </span>
          </template>
        </el-tooltip>
        <span class="warn">必填</span>
      </span>
      <el-radio-group v-model="artPermission.adult">
        <el-radio :label="true">有</el-radio>
        <el-radio :label="false">无</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
type settingType = {
  whoSee: string
  comment: string
  adult: boolean
  copyright: string
}

const props = defineProps({
  setting: {
    type: Object as PropType<settingType>,
    default: () => ({
      whoSee: 'public',
      comment: 'public',
      adult: null,
      copyright: 'OWNER'
    })
  }
})
const emits = defineEmits(['permission'])

const artPermission = ref({ ...props.setting })

watch(
  artPermission,
  (val) => {
    emits('permission', val)
  },
  {
    deep: true
  }
)
const copyrightList = [
  {
    text: '署名',
    label: 'BY',
    tipText:
      '其他人可以分发、混合和调整您的作品并在其基础上进行创作，甚至将其用作商业用途，前提是他们要将您标注为原作者。'
  },
  {
    text: '署名-禁止修改',
    label: 'BY-ND',
    tipText:
      '其他人可以重用您的作品，包括商业用途；但是，不能以改编的形式与他人共享，并且必须将所有权归属于您。'
  },
  {
    text: '署名-非商业性使用',
    label: 'BY-NC',
    tipText:
      '其他人可以非商业化地混搭、调整和利用您的作品，尽管他们的新作品也必须承认您并且是非商业性的，但他们不必以相同的条款许可其衍生作品。'
  },
  {
    text: '署名-非商业性使用-禁止修改',
    label: 'BY-NC-ND',
    tipText:
      '只要其他人将所有权归属于您，就可以下载您的作品并与他人共享，但他们不能以任何方式更改它们或将其用于商业用途。'
  },
  {
    text: '版权所有',
    label: 'OWNER',
    tipText: '在未经明确许可的情况下，他人不得使用您的作品，包括转载分享'
  }
]
</script>

<style scoped lang="less">
.permission {
  flex: 6;
  padding: 20px;
  background-color: var(--bgc);
}
.item {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebebeb;
  .title {
    display: flex;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--color-text1);
    .title-text {
      margin-right: 10px;
    }
  }
  &:last-child {
    border: none;
    margin: 0;
  }
}
.el-radio {
  font-weight: 400;
  font-size: 12px;
  :deep(.el-radio__label) {
    display: flex;
    align-items: center;
  }
}
.copyright {
  .el-radio-group {
    flex-direction: column !important;
    align-items: flex-start;
  }

  .text {
    line-height: 30px;
    margin-right: 10px;
  }
}
.icon {
  display: flex;
  svg {
    fill: var(--color-regular);
    stroke: var(--bgc);
    path {
      &:last-child {
        fill: var(--bgc);
      }
    }
  }
}
.warn {
  margin-left: 12px;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: #fff;
  padding: 1px 5px;
  background-color: tomato;
}
</style>
