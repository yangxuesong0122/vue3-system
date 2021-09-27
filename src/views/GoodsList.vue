<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <img src="../assets/logo.png" style="width: 50px; height: 50px" />
        <span>商品列表</span>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入搜索商品名称"
          v-model="searchContent"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="addGoodsInfo">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="编号" width="180">
        <template #default="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top">
            <template #default>
              <p>商品名称: {{ scope.row.title }}</p>
              <p>单价: {{ scope.row.price }}</p>
            </template>
            <template #reference>
              <div class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title }}</el-tag>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="180">
        <template #default="scope">
        <span style="margin-left: 10px">
          <img :src="imgBaseUrl + scope.row.thumbnail" style="width: 100px;height: 100px"/>
        </span>
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <add-product :centerDialogVisible="centerDialogVisible" @closeDialog="closeDialog"/>
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue'
import axios from 'axios'
import AddProduct from './AddProduct.vue'

function loadData(state) {
  axios.get('/products').then(res => {
    state.tableData = res.data
  })
}

export default {
  name: "GoodsList",
  components: {
    AddProduct
  },
  setup() {
    const state = reactive({
      tableData: [],
      imgBaseUrl: import.meta.env.VITE_APP_URL,
      searchContent: '',
      centerDialogVisible: false
    })
    onMounted(() => {
      loadData(state)
    })
    // 搜索
    const handleSearch = () => {

    }
    // 打开添加页面
    const addGoodsInfo = () => {
      state.centerDialogVisible = true
    }
    // 关闭弹框
    const closeDialog = (data) => {
      loadData(state)
      state.centerDialogVisible = false
    }
    return {
      ...toRefs(state),
      handleSearch,
      addGoodsInfo,
      closeDialog
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
}
</style>