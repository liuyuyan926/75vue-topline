<template>
  <el-container>
    <!-- 左侧栏 -->
    <!-- 如果折叠，则宽是65px,如果展开，宽200px -->
    <el-aside :width="menuCollapse? '65px' : '200px'">
      <img src="../../assets/img/logo_admin.png" alt />
      <!-- 下面是导航菜单 -->
      <!-- el-menu设置背景颜色、文本颜色、动作颜色、绑定展开+折叠属性、绑定展开折叠时无动画效果 -->
      <el-menu
        background-color="#323745"
        text-color="#fff"
        active-text-color="#409EFC"
        :collapse="menuCollapse"
        :collapse-transition="false"
      >
        <!-- 菜单--首页 -->
        <el-menu-item index="/welcome">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- 菜单--内容管理 -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">发布文章</el-menu-item>
            <el-menu-item index="2-2">文章列表</el-menu-item>
            <el-menu-item index="2-3">评论列表</el-menu-item>
            <el-menu-item index="2-4">素材管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 菜单--粉丝管理 -->
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <!-- 菜单--账户信息 -->
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <div class="left">
          <!-- 设置左侧栏展开折叠 -->
          <!-- 在data中设置变量menuCollapse；在el-menu中设置成员collapse -->
          <i
            :class="menuCollapse? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            style="font-size: 25px; cursor: pointer;"
            @click="menuCollapse=!menuCollapse"
          ></i>
          江苏传智播客教育科技股份有限公司
        </div>
        <div class="right">
          <el-input placeholder="请输入搜索的文章"></el-input>
          <span>消息</span>
          <!-- 整体下拉列表 -->
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="photo" alt />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <!-- 退出方法一 -->
              <!-- <el-dropdown-item>
                <el-button @click="logout()">退出</el-button>
              </el-dropdown-item>-->
              <!-- 退出方法二 -->
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>

              <!-- 退出事件是注册给html标签的，不能注册给组件 -->
              <!-- <el-dropdown-item @click="logout()">退出</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 右侧栏主体 -->
      <el-main>
        <!-- 这里用各子组件路由填充 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuCollapse: false
    }
  },
  computed: {
    name () {
      return window.sessionStorage.getItem('name')
    },
    photo () {
      return window.sessionStorage.getItem('photo')
    }
  },
  methods: {
    //   退出系统方法
    logout () {
      this.$confirm('确定要退出系统吗？', '退出', {
        // confirmButtonText: '确定',
        // cancelButtonText: '取消'
        type: 'warning'
      })
        .then(() => {
          //  清除信息，并跳转到登录界面
          window.sessionStorage.clear()
          this.$router.push({ name: 'login' })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less">
.el-container {
  height: 100%;
  .el-aside {
    width: 200px;
    background-color: #323745;
    img {
      margin: 10px 20px;
    }
    .el-menu {
      width: 200px;
    }
  }
  .el-header {
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .left {
      float: left;
    }
    .right {
      float: right;
      .el-input {
        width: 250px;
      }
      span {
        width: 50px;
        text-align: center;
        margin: 0 10px;
      }
      .el-dropdown {
        width: 240px;
        img {
          width: 30px;
          height: 30px;
          vertical-align: middle;
        }
      }
    }
  }
  .el-main {
    background-color: #ddd;
  }
}
</style>
