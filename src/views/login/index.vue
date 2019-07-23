<template>
  <!-- 绘制外面整体大盒子 -->
  <div class="login-container">
    <!-- 绘制登录盒子 -->
    <div class="login-box">
      <div class="content">
        <img src="./logo_index.png" />
        <!-- 用element-UI绘制表单 -->
        <!-- 表单校验：：
          el-form标签设置属性:rules="任意命名"，
        el-form-item设置属性prop="表单对象成员mobile、code"， prop属性值必须与表单对象成员一致-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <!-- 表单项1：手机号 -->
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号">
              <!-- 加图标 -->
              <i slot="prefix" class="iconfont icon-mobile"></i>
            </el-input>
          </el-form-item>
          <!-- 表单项2：验证码 -->
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码">
              <!-- 加图标 -->
              <i slot="prefix" class="iconfont icon-yanzhengma"></i>
            </el-input>
          </el-form-item>
          <!-- 表单项3：协议 -->
          <el-form-item prop="xieyi">
            <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
            <span>我已阅读并同意用户协议和隐私条款</span>
          </el-form-item>
          <!-- 表单项4：登录按钮 -->
          <el-form-item>
            <!-- v-loading="btnLoading" 解决人机按钮等待,未显示人机验证时等待true，显示人机验证不用等待了false-->
            <el-button type="primary" v-loading="btnLoading" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 极验-导入git.js文件【该文件是从官网下载的】因为只有登录界面用极验，所以引入这里就可以，不用引入main.js文件中
import '@/assets/js/gt.js'
// 引入图标库文件
import '@/assets/font/iconfont.css'

export default {
  data () {
    // ####################################在data中生成校验方法##############################
    // 设置自定义校验规则：校验手机号的函数checkMobile
    var checkMobile = function (rule, value, callback) {
      // value：被校验数据，callback:无论校验成功，都调用
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确！'))
      } else {
        callback()
      }
    }
    // // 设置自定义校验规则：校验协议的函数checkXieyi
    var checkXieyi = function (rule, value, callback) {
      if (Number(value) === 0) {
        return callback(new Error('请遵守协议！'))
      } else {
        callback()
      }
    }
    // data中的数据
    return {
      // 设置创建好的人机验证窗口
      captchaObj: null,
      // 登录按钮，等待设置
      btnLoading: false,
      // 设置表单数据
      loginForm: {
        mobile: '',
        code: '',
        xieyi: false
      },
      // 设置校验
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 自定义校验规则在上面
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [{ required: true, message: '验证码必填', trigger: 'blur' }],
        // 自定义校验规则在上面
        xieyi: [{ validator: checkXieyi }]
      }
    }
  },
  methods: {
    // 设置点击按钮，校验成功才能跳转页面
    login () {
      // 判断是否存在已生成的人机验证窗口，有则直接显示验证窗口即可
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      // 注意：this.$refs.loginFormRef就获得了el-form表单对象了
      this.$refs.loginFormRef.validate(valid => {
        // valid：true，校验成功；false,校验失败
        if (valid) {
          // 用于解决人机按钮等待问题,在未显示人机验证时等待true
          this.btnLoading = true
          // 完成人机交互功能验证
          this.$http
            .get(`/captchas/${this.loginForm.mobile}`)
            .then(result => {
              let { data } = result.data
              // 显示人机窗口
              window.initGeetest(
                {
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind' // 隐藏人机按钮
                },
                captchaObj => {
                  captchaObj
                    .onReady(() => {
                      captchaObj.verify() // 显示验证码
                      // 用于解决人机按钮等待问题,显示人机验证了就不用等待了false
                      this.btnLoading = false
                      this.captchaObj = captchaObj
                    })
                    .onSuccess(() => {
                      // 人机验证成功，真正的登录动作
                      this.loginAct()
                    })
                    .onError(() => {
                      // 人机验证失败
                    })
                }
              )
            })
            .catch(err => {
              console.log(err)
              return this.$message.error('获得人机验证码失败')
            })
        }
      })
    },

    // 账号验证成功，则登录后台系统
    loginAct () {
      // 发送post请求请求数据库中的登录信息，进行验证
      this.$http
        .post('/authorizations', this.loginForm)
        .then(result => {
          // 存储登录的各种信息，然后浏览器就暂时记忆存储这些信息了
          var { name, token, photo } = result.data.data
          window.sessionStorage.setItem('name', name)
          window.sessionStorage.setItem('token', token)
          window.sessionStorage.setItem('photo', photo)
          // 登录信息与服务器数据库端信息验证成功，则跳转到后台首页
          this.$router.push({ path: '/home' })
        })
        .catch(err => {
          console.log(err)
          return this.$message.error('用户名或密码错误！')
        })
    }
  }
}
</script>

<style lang="less">
// 登录页面，整体大盒子
.login-container {
  height: 100%;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  // 设置登录盒子居中显示
  display: flex;
  justify-content: center;
  align-items: center;
  // 登录盒子
  .login-box {
    width: 410px;
    height: 345px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    .content {
      width: 80%;
      text-align: center;
      // 其中图片设置
      img {
        width: 60%;
        margin: 20px 0;
      }
      //   设置登录按钮样式
      .el-form .el-button {
        width: 100%;
      }
    }
  }
}
</style>
