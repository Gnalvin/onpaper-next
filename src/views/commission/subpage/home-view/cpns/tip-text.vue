<template>
  <div class="should">
    <div class="title">请注意</div>
    <template v-if="!isCancel">
      <ul v-if="status === 0">
        <li>
          在您做出决定之前，请仔细阅读需求方的约稿方案，
          <strong>确保您能够满足需求方的要求。</strong>
        </li>
        <li>
          如果您对约稿方案<strong>感到满意</strong>，可以点击“与Ta联系”按钮将方案推进到下一步，您将会得到需求方的联系方式。
        </li>
        <li>
          如果您对约稿方案<strong>不满意</strong>，点击“关闭邀请”按钮拒绝邀请是一个明智的选择。可以节省您的时间和精力也避免不必要的麻烦，<strong
            >此操作不会对您的评分有任何影响。</strong
          >
        </li>
      </ul>
      <ul v-if="status === 1">
        <li>
          在您做出决定之前，请确认您和需求方已经就<strong
            >作品的要求、交付方式、版权问题、稿酬、截止日期等内容达成一致。</strong
          >
        </li>
        <li>
          如果您对沟通结果<strong>感到满意</strong>，可以点击“接受方案”按钮将方案推进到下一步，进入创作阶段。<strong
            >在创作阶段，无论是否完稿还是中途退出，都会进入评价环节，将对您的评分会有影响。</strong
          >
        </li>
        <li>
          如果您对沟通结果<strong>不满意</strong>，点击“关闭邀请”按钮拒绝邀请是一个明智的选择。<strong
            >此操作不会对您的评分有任何影响。</strong
          >
        </li>
      </ul>
      <ul v-if="status === 2">
        <li>
          在您做出决定之前，请确认您已经按照需求方的要求<strong>完成了作品。</strong>擅自点击“完成企划”，可能会带来不好的评价噢。
        </li>
        <li>
          如果您想<strong>终止约稿</strong>
          ，可以点击“退出合作”，结束这次约稿。如果您遇到了其他困难，请联系我们，我们会尽力为您提供帮助。
        </li>
        <li>
          无论完成还是退出，<strong>下一阶段将进行双方相互评价</strong>，请认真填写，这将对其他画师提供参考帮助。
        </li>
        <li>
          完成评价后此次约稿合作才能结束，
          <strong
            >双方都完成评价后，评价才会生效，任何一方完成评价，另一方需在14天内完成评价，否则系统将自动好评</strong
          >。
        </li>
      </ul>
    </template>
    <template v-else>
      <ul v-if="status === 0 || status === 1">
        <li>当前阶段关闭邀请，不会对评分造成影响</li>
        <li>您确定要关闭吗，<strong>此操作不可撤回</strong></li>
      </ul>
      <ul v-else>
        <li>
          当前阶段退出合作，<strong>下一阶段将进行双方相互评价</strong>，请认真填写，这将对其他用户提供参考帮助。
        </li>
        <li>
          完成评价后此次约稿合作才能结束，
          <strong
            >双方都完成评价后，评价才会生效，任何一方完成评价，另一方需在14天内完成评价，否则系统将自动好评</strong
          >。
        </li>
        <li>您确定要退出合作吗，<strong>此操作不可撤回。</strong></li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  status: {
    type: Number,
    required: true
  },
  isCancel: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
}
.should {
  margin: 15px 0 20px;
  padding: 0 10px;
  ul {
    margin-top: 10px;
    li {
      font-size: 15px;
      line-height: 1.8;
      margin-bottom: 10px;
      color: var(--color-text1);
      &::before {
        content: '•';
      }
    }
  }
}
strong {
  color: var(--color-text1);
  display: inline;
  font-weight: bold;
  box-shadow: rgba(252, 99, 140, 0.5) 0px -5px inset;
}
</style>
