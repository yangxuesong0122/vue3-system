<template>
  <div class="login">
    <div class="login_box">
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoinForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue"
import axios from "axios"
import {useRouter} from "vue-router"
import { ElMessage } from "element-plus"

export default {
  setup() {
    const router = useRouter()
    const loginFormRef = ref();
    const state = reactive({
      loginForm: {
        username: "admin",
        password: "123456"
      },
    });
    const loginFormRules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 3,
          max: 10,
          message: "用户名的长度在3到10个字符之间",
          trigger: "blur"
        }
      ],
      password: [
        { required: true, message: "请输入用户密码", trigger: "blur" },
        {
          min: 6,
          max: 15,
          message: "用户密码的长度在6到15个字符之间",
          trigger: "blur"
        }
      ]
    }
    // 重置
    const resetLoinForm = () => {
      loginFormRef.value.resetFields()
    }
    // 登录
    const login = () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) return
        const params = {
          userName: state.loginForm.username,
          userPwd: state.loginForm.password
        };
        const res = await axios.post("/user/login", params)
        if (res.data.code === 0) {
          ElMessage.success("登录成功");
          window.sessionStorage.setItem("token", res.data.myToken)
          router.push("/")
        } else {
          ElMessage.error("登录失败")
        }
      })
    }
    return {
      ...toRefs(state),
      loginFormRules,
      loginFormRef,
      resetLoinForm,
      login
    }
  }
}
</script>

<style>
.login {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
}
.login_form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
