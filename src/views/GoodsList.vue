<template>
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
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue'
import axios from 'axios'

function loadData(state) {
  axios.get('http://localhost:3005/products').then(res => {
    state.tableData = res.data
  })
}

export default {
  name: "GoodsList",
  setup() {
    const state = reactive({
      tableData: []
    })
    onMounted(() => {
      loadData(state)
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>

</style>