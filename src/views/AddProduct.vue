<template>
  <el-dialog
    title="添加商品信息"
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
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "AddProduct",
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
      coverImg: [
        { required: true, message: "请上传商品主图", trigger: "blur" },
      ],
      goodsDetail: [
        { required: true, message: "请输入商品详情", trigger: "blur" },
      ]
    };
    const closeDialog = () => {
      emit('closeDialog')
    }
    const submitConfirm = () => {

    }
    // 上传成功回掉
    const handleAvatarSuccess = () => {}
    // 上传前回调
    const handleBeforeUpload = () => {}
    return {
      ...toRefs(state),
      rules,
      validateForm,
      editor,
      closeDialog,
      submitConfirm,
      handleAvatarSuccess,
      handleBeforeUpload
    }
  }
}
</script>

<style scoped>

</style>