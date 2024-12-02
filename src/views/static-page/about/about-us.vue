<template>
  <div class="about-us">
    <div class="container">
      <div class="title">关于我们</div>
      <div class="describe">
        <p>
          Onpaper是为绘画爱好者而生的社区，
          社区的使命是“为绘画梦想助力”，我们努力创造平等、包容、开放的环境，让每个人都能享受画画的乐趣。
        </p>
        <p>
          今后我们将继续致力于鼓励原创内容，保护用户的版权和利益，给画师提供更多的资源和机会。
          目前社区的用户数还在快速增长，我们期待更多合作，欢迎联系。
        </p>
      </div>
      <div class="contact">
        <p>公司名称：深圳市绘梦网络科技有限公司</p>
        <p>公司地址：深圳市南山区南头街道前海社区桃园路283号</p>
        <p>联系邮箱：ceo@onpaper.cn</p>
        <p>官方微博：@纸上绘画社区</p>
        <p>官方小红书：@onpaper</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.about-us {
  display: flex;
  justify-content: center;
  background-color: var(--bgc3);
  min-height: 100vh;
}
.container {
  border-radius: 10px;
  background-color: var(--surface-color4);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 1px 1px 10px;
  width: 900px;
  margin-top: 100px;
  height: calc(100vh - 500px);
  max-height: 1000px;
  min-height: 600px;
}
.title {
  margin-top: 30px;
  text-align: center;
  font-size: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color1);
}
.describe {
  padding: 10px 30px;
  p {
    margin: 18px 0;
    font-size: 15px;
    line-height: 2;
  }
}
.contact {
  padding: 30px;
}
</style>
