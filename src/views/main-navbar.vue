<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">人保管控平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">人保</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <!--<el-menu-item index="1" @click="$router.push({ name: 'theme' })">-->
          <!--<template slot="title">-->
            <!--<el-badge value="new">-->
              <!--<icon-svg name="shezhi" class="el-icon-setting"></icon-svg>-->
            <!--</el-badge>-->
          <!--</template>-->
        <!--</el-menu-item>-->
        <!--<el-menu-item index="2">-->
          <!--<el-badge value="hot">-->
            <!--<a href="https://www.renren.io/" target="_blank">官方社区</a>-->
          <!--</el-badge>-->
        <!--</el-menu-item>-->
        <!--<el-submenu index="3">-->
          <!--<template slot="title">Git源码</template>-->
          <!--<el-menu-item index="2-1"><a href="https://github.com/renrenio/renren-fast-vue" target="_blank">前端</a></el-menu-item>-->
          <!--<el-menu-item index="2-2"><a href="https://gitee.com/renrenio/renren-fast" target="_blank">后台</a></el-menu-item>-->
          <!--<el-menu-item index="2-3"><a href="https://gitee.com/renrenio/renren-generator" target="_blank">代码生成器</a></el-menu-item>-->
        <!--</el-submenu>-->
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img style="border-radius: 50%;border:1px solid #666" src="~@/assets/img/jindin.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
      <div class="project-box">
        <span>当前项目：</span>
        <el-select v-model="projectCode" placeholder="请选择" class="project-select" @change="selectProject">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </div>

    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        projectCode: '',
        userId:sessionStorage.getItem("userId"),//当前用户id
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      projectList: {
        get () { return this.$store.state.common.projectList }
      }
    },
    created () {
      // alert(11);
      this.$store.dispatch('common/changeProjectList',this.userId);
      this.$http({
        url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.projectCode=data.result.projectId;
          this.$store.commit('common/updateProjectId', this.projectCode)
          // this.$store.dispatch('common/changeProjectId', this.projectCode)
        }
      });
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 200) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      selectProject (val) {
       if(val){
         console.log(val, 'valvalvalvalval')
         this.$store.commit('common/updateProjectId', val)
         this.$http({
           isLoading:false,
           url: this.$http.adornUrl('/nowProject/saveOrUpdateByCreateUserId'),
           method: 'post',
           data:  this.$http.adornData({projectId: val,createUserId:this.userId})
         }).then(({data}) => {
           if (data.code == 200) {
           }
         })
       }

      }
    }
  }
</script>
<style scoped>
.project-box {
  height: 50px;
  line-height: 50px;
  float: right;

}

</style>
