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
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage">
    </el-pagination>
  </el-card>
  <GoodsDialog ref="goodsDialog" :centerDialogVisible="centerDialogVisible" @closeDialog="closeDialog"/>
</template>

<script>
import {onMounted, reactive, ref, toRefs} from 'vue'
import axios from 'axios'
import GoodsDialog from './GoodsDialog.vue'
import {ElMessageBox, ElNotification} from "element-plus"

function loadData(state) {
  const params = {
    pageNumber: state.currentPage,
    pageSize: state.pageSize,
    search: state.searchContent,
  }
  axios.get('/goods', { params }).then(res => {
    state.tableData = res.data.list
    state.total = res.data.totalCount //总的记录数
  })
}

//删除商品数据
// function useDelete(state) {
//   const handleDelete = (index, row) => {
//     ElMessageBox.confirm("你确定要删除该记录吗?", "提示", {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       type: "warning",
//       callback: (action) => {
//         if (action === "confirm") {
//           axios
//               .delete("/goods/delete", { params: { id: row.id } })
//               .then((res) => {
//                 if (res.data.code === "ok") {
//                   ElNotification({
//                     title: "成功",
//                     message: "删除成功",
//                     type: "success",
//                     duration: 2000,
//                   });
//                   loadData(state);
//                 } else {
//                   ElNotification({
//                     title: "失败",
//                     message: "删除失败",
//                     type: "error",
//                     duration: 2000,
//                   });
//                 }
//               });
//         }
//       },
//     });
//   };
//   return {
//     handleDelete,
//   };
// }

export default {
  name: "GoodsList",
  components: {
    GoodsDialog
  },
  setup() {
    const goodsDialog = ref()
    const state = reactive({
      tableData: [],
      imgBaseUrl: import.meta.env.VITE_APP_URL,
      searchContent: '',
      centerDialogVisible: false,
      total: 0,
      pageSize: 3,
      currentPage: 1
    })
    onMounted(() => {
      loadData(state)
    })
    // 搜索
    const handleSearch = () => {
      loadData(state)
    }
    // 打开添加页面
    const addGoodsInfo = () => {
      state.centerDialogVisible = true
      let params = {
        dialogType: 'add',
        goodId: null,
        dialogTitle: '添加商品信息'
      }
      // 调用子组件方法
      goodsDialog.value.openDialog(params)
    }
    // 关闭弹框
    const closeDialog = () => {
      loadData(state)
      state.centerDialogVisible = false
    }
    // 删除
    const handleDelete = (index, row) => {
      ElMessageBox.confirm("你确定要删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            axios.delete("/goods/delete", { params: { id: row.id } })
              .then((res) => {
                if (res.data.code === "ok") {
                  ElNotification({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                  });
                  loadData(state)
                } else {
                  ElNotification({
                    title: "失败",
                    message: "删除失败",
                    type: "error",
                    duration: 2000
                  });
                }
              });
          }
        },
      });
    }
    // 页面改变
    const changePage = (page) => {
      state.currentPage = page
      loadData(state)
    }
    // 编辑
    const handleEdit = (id) => {
      state.centerDialogVisible = true
      let params = {
        dialogType: 'edit',
        goodId: id,
        dialogTitle: '编辑商品信息'
      }
      // 调用子组件方法
      goodsDialog.value.openDialog(params)
    }
    return {
      ...toRefs(state),
      // ...useDelete(state),
      goodsDialog,
      handleSearch,
      addGoodsInfo,
      closeDialog,
      handleDelete,
      changePage,
      handleEdit
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