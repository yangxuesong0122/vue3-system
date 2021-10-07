<template>
  <el-container class="el-container">
    <el-header>
      <div class="header-div">
        <img src="../../assets/logo.png" alt="logo" />
        <span><router-link to="/">后台管理系统</router-link></span>
        <el-button style="float: right;margin-top: 10px" type="info" @click="logOut">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="toggle-button" @click="openCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router>
          <!-- 一级菜单 -->
          <el-sub-menu v-for="item in menusData" :index="item.id" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template #title>
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavPath('/' + subItem.path)">
              {{ subItem.title }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue"
import axios from "axios"
import router from "../../router"
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  setup() {
    const state = reactive({
      menusData: [],
      isCollapse: false, // 菜单的展开与隐藏
      activePath: ""
    });
    onMounted(() => {
      getMenuData(state)
      state.activePath = window.sessionStorage.getItem("activePath")
    });
    const getMenuData = () => {
      axios.get("/menus").then(res => {
        state.menusData = res.data
      })
    }
    // 菜单的折叠与展示
    const openCollapse = () => {
      state.isCollapse = !state.isCollapse
    }
    // 保存链接的激活状态
    const saveNavPath = activePath => {
      window.sessionStorage.setItem("activePath", activePath);
      state.activePath = activePath
    }
    //用户退出登录
    const logOut = () => {
      ElMessageBox.confirm(
        '您确定要退出吗?',
        '提示',
        {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        ElMessage({
          type: 'success',
          message: '退出成功'
        })
        window.sessionStorage.clear()
        router.push("/login")
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '您已取消退出'
        })
      })
    }
    return {
      ...toRefs(state),
      openCollapse,
      logOut,
      saveNavPath
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.el-container {
  height: 1000px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
}
a {
  text-decoration: none;
  color: #fff;
}
.header-div img {
  vertical-align: middle;
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
