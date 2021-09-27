<template>
  <el-dialog
    :title="dialogTitle"
    v-model="centerDialogVisible"
    width="30%"
    center
    @close="closeDialog">
    <el-form
      :model="goodsForm"
      :rules="rules"
      ref="validateForm"
      label-width="100px">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="goodsForm.title"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="goodsForm.price"></el-input>
      </el-form-item>
      <el-form-item label="商品图片" prop="coverImg">
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="handleBeforeUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情" prop="goodsDetail">
        <QuillEditor theme="snow" ref="editor"></QuillEditor>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {reactive, ref, toRefs} from "vue"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import axios from "axios"
import { ElMessage } from "element-plus"

export default {
  name: "Dialog",
  emits: ["closeDialog"],
  props: {
    centerDialogVisible: {
      required: true,
      type: Boolean
    }
  },
  components: {
    QuillEditor
  },
  setup(props, { emit }) {
    const validateForm = ref()
    const editor = ref()
    let state = reactive({
      validateForm: '',
      imageUrl: "",
      uploadURL: import.meta.env.VITE_APP_URL + "/goods/fileUpload",
      content: '',
      dialogTitle: '添加商品信息',
      dialogType: 'add',
      goodId: '',
      goodsForm: {
        title: "",
        price: 0,
        coverImg: "",
        goodsDetail: "",
      }
    })
    const rules = {
      title: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
      price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
      // coverImg: [
      //   { required: true, message: "请上传商品主图", trigger: "blur" },
      // ],
      goodsDetail: [
        { required: true, message: "请输入商品详情", trigger: "blur" },
      ]
    };
    const openDialog = ({ dialogType, dialogTitle, goodId }) => {
      state.dialogTitle = dialogType
      state.dialogTitle = dialogTitle
      state.goodId = goodId
      if(goodId) {
        // 编辑，查询商品信息
        getGoodInfo(goodId)
      }
    }
    // 查询商品方法
    //根据商品编号，查询要编辑的数据
    const getGoodInfo = (id) => {
      axios.get("/goods/get", { params: { goodsId: id } })
        .then((res) => {
          state.goodsForm = res.data;
          state.imageUrl = import.meta.env.VITE_APP_URL + res.data.thumbnail;
          state.goodsForm.coverImg = res.data.thumbnail;
          editor.value.setHTML(res.data.goodsDetail);
        });
    }
    const closeDialog = () => {
      state.imageUrl = ''
      emit('closeDialog')
    }
    // 确定
    const submitConfirm = () => {
      state.goodsForm.goodsDetail = editor.value.getText().replace(/(\r\n|\n|\r)/gm, "<br />") !== "<br />" ? editor.value.getHTML() : ""
      validateForm.value.validate(valid => {
        if (valid) {
          const params = {
            title: state.goodsForm.title,
            price: state.goodsForm.price,
            // thumbnail: state.goodsForm.coverImg,
            goodsDetail: state.goodsForm.goodsDetail,
          };
          if(state.dialogType === 'add') {
            axios.post("/goods/add", params).then(res => {
              resetForm()
            });
          } else {
            params.goodsId = state.goodsId
            axios.post("/goods/edit", params).then((res) => {
              resetForm()
            });
          }
        }
      })
    }
    // 通用重置表单方法
    const resetForm = () => {
      validateForm.value.resetFields(); //重置表单
      editor.value.setText("")
      emit("closeDialog");
    }
    // 完成文件上传类型校验
    const handleBeforeUpload = (file) => {
      const arr = file.name.split(".")[1];
      if (!["jpg", "jpeg", "png"].includes(arr)) {
        ElMessage.error("请上传jpg,jpeg,png类型的图片文件");
        return false;
      }
    };
    // 上传成功回掉
    const handleAvatarSuccess = (res) => {
      state.imageUrl = import.meta.env.VITE_APP_URL + res.msg
      state.goodsForm.coverImg = res.msg
    }
    return {
      ...toRefs(state),
      rules,
      validateForm,
      editor,
      closeDialog,
      openDialog,
      submitConfirm,
      handleAvatarSuccess,
      handleBeforeUpload
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>