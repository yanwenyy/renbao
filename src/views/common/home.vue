<template>
  <div class="mod-home">
    <!--<img class="home-bg" src="../../../static/img/home-bg.png" alt="">-->
    <div class="home-bg-div">
      <img class="home-bg-jd" src="../../../static/img/1.jpg" alt="">
      <div class="home-title">
        <div>欢迎使用</div>
        <div>人保管控平台</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style>
  .inline-block {
    display: inline-block;
  }

  .mod-home {
    text-align: center;
    height: 80vh;
  }

  .home-bg {
    width: 40%;
    height: auto;
  }

  .home-bg-div {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .home-bg-div:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    /*background: rgba(0,0,0,.3);*/
    top: 0;
    left: 0;
    box-shadow: 0 0 20px 10px #fff inset;
  }

  .home-bg-jd {
    width: 100%;
    height: auto;
    position: absolute;
    top: -10%;
    left: 0;
    opacity: 0.7;
  }

  .home-title {
    width: 100%;
    position: absolute;
    top: 20%;
    left: 0;
    /*color:#fff;*/
    font-size: 30px;
    font-weight: bold;
    line-height: 60px;
    text-shadow: 5px 2px 6px #fff;
  }

  .logo-home {
    width: 10%;
    height: auto;
  }
</style>

