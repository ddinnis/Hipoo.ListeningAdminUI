<template>
  <div class="conatiner">
    <el-input
      id="input"
      placeholder="File path"
      :valve="fileInput"
      :disabled="true"
      style="width: 25%; margin-right: 20px"
      @select="handleSelect"
    >
    </el-input>
    <el-upload
      :limit="1"
      class="upload-demo"
      ref="upload"
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :http-request="startUpload"
      :on-change="handleChange"
    >
      <el-button size="small" type="primary">选择文件</el-button>
    </el-upload>
    <!-- <el-button
      class="uploadBtn"
      size="small"
      type="success"
      @click="handleUpload"
      >上传</el-button
    > -->
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { uploadFile, isFileExist } from "@/api/upload.js";
export default {
  name: "Uploader",
  props: {
    modelValue: String,
  },
  data() {
    return {
      completeProgress: 0,
      fileInput: "",
    };
  },
  methods: {
    handleSelect(value) {
      console.log(value);
    },
    handleChange(file) {
      let _this = this;

      console.log("file", file);

      if (file.size <= 0) {
        this.$message.error("请上传文件！");
        return;
      }

      let fileReads = new FileReader();
      //开始读取文件
      fileReads.readAsArrayBuffer(file.raw);
      fileReads.onload = async function () {
        const wordArray = CryptoJS.lib.WordArray.create(fileReads.result);
        const hash = CryptoJS.SHA256(wordArray).toString();
        const fileSize = file.size;
        //检查是否在服务器端有这个文件
        await isFileExist(fileSize, hash).then((res) => {
          console.log("res", res);

          const { isExists, url = "" } = res;
          if (isExists) {
            this.fileInput = url;
            document.getElementById("input").value = url;
            _this.$emit("audioUrl", url);
          } else {
            //如果不在服务端则上传
            _this.handleUpload(file);
          }
        });
      };
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    startUpload(file) {
      console.log("startUpload", file);
    },
    beginUpload() {
      console.log("beginUpload");
    },

    handleUpload(file) {
      let _this = this;
      console.log("file", file);
      const formData = new FormData();
      formData.append("file", file.raw);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      uploadFile(formData, config).then((url) => {
        _this.$emit("audioUrl", url);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.conatiner {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .uploadBtn {
    height: 100%;
    display: flex;
    margin-left: 10px;
  }
}
</style>
