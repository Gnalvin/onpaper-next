<template>
  <div class="suggest">
    <div class="temp">
      <div class="title">要怎样制定方案？</div>
      <span>
        接稿方案是展示自己风格和技能的机会，也是吸引客户的重要途径。完善的接稿方案还可以节省沟通时间。
      </span>
      <div class="should">
        <span class="title"
          >建议这样填写
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z"
              fill="#3aa901"
              stroke="#3aa901"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <ul>
          <li>清晰地描述你<strong>擅长的作品类型</strong></li>
          <li>根据自己的实力<strong>制定合理的价格</strong></li>
          <li>明确的<strong>交稿时间和修改次数</strong></li>
          <li>明确约稿者的<strong>用途和公开权限</strong></li>
          <li>创作过程何时会<strong>征求意见和反馈</strong></li>
          <li>填写准确的<strong>联系方式</strong></li>
        </ul>
      </div>
      <div class="notice">
        <div class="title">
          支付方式 (重点)
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
              fill="#ff1765"
              stroke="#ff1765"
              stroke-width="4"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24 37C25.3807 37 26.5 35.8807 26.5 34.5C26.5 33.1193 25.3807 32 24 32C22.6193 32 21.5 33.1193 21.5 34.5C21.5 35.8807 22.6193 37 24 37Z"
              fill="#FFF"
            />
            <path
              d="M24 12V28"
              stroke="#FFF"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          目前社区不支持在线支付，因此你需要
          <strong>选择安全可靠的支付平台，如咸鱼、米画师，画加，B站工房</strong
          >等， 避免被骗或产生纠纷。
        </div>
        <br />
        <div>
          如果不使用交易平台，在创作过程中要学会维护自身权利，采取分段式付款，例如草图、线稿、上色、终稿等
          <strong>不同创作阶段要求预付部分稿酬</strong>
        </div>
        <br />
        <div>
          <strong>任何要求画师转账的请拉黑并向社区举报</strong>
        </div>
        <br />
        <div>
          这是方便画师的功能，任何人被骗我们都会伤心的，
          <strong>创作过程中如感到任何不适你应该终止此次约稿</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.suggest {
  position: relative;
  flex: 1;
  line-height: 1.7;
  .temp {
    min-width: 240px;
    border-radius: 16px;
    padding: 20px 25px 30px;
    position: sticky;
    top: 65px;
    background-color: var(--surface-color4);
  }
  .title {
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 24px;
    svg {
      margin-left: 5px;
    }
  }
  .should {
    margin-top: 15px;
    ul {
      margin-top: 10px;
      li {
        font-size: 14px;
        line-height: 1.8;
        color: var(--color-text3);
        &::before {
          content: '・';
        }
      }
    }
  }
  .notice {
    margin-top: 15px;
  }
  strong {
    color: var(--color-text1);
    display: inline;
    font-weight: bold;
    box-shadow: rgba(252, 99, 140, 0.5) 0px -5px inset;
  }
}
</style>
