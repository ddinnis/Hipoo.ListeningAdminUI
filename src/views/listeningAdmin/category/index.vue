<template>
  <div class="main">
    <el-button type="primary" class="addCate" @click="addCategoryClick"
      >创建分类</el-button
    >
    <el-table :data="categories" style="width: 100%">
      <el-table-column label="中文标题" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name.chinese }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文标题" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name.english }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
          <el-button
            size="mini"
            type="info"
            @click="handleCate(scope.$index, scope.row)"
            >管理分类</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="editCate">
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <el-form v-model="formData" ref="form" label-width="80px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="中文标题">
                <el-input v-model="formData.name.chinese"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文标题">
                <el-input v-model="formData.name.english"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="封面图片">
            <el-input v-model="formData.coverUrl"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleComfirm">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "@/api/category.js";

export default {
  name: "Category",
  data() {
    return {
      categories: [],
      dialogVisible: false,
      selectedRow: {},
      title: "",
      formData: {
        name: {
          english: "",
          chinese: "",
        },
        coverUrl: "",
      },
    };
  },
  async mounted() {
    await getCategories().then((data) => {
      this.categories = data;
    });
  },
  methods: {
    async handleComfirm() {
      if (this.title === "Edit Category") {
        await updateCategory(this.formData).then((data) => {
          if (data.ok) {
            this.$message({ message: "更新成功", type: "success" });
          }
        });
      }
      if (this.title === "Add Category") {
        const category = await addCategory(this.formData).then((data) => {
          if (data.ok) {
            this.$message({ message: "创建成功", type: "success" });
          }
        });
      }
      getCategories().then((data) => {
        this.categories = data;
      });
      this.dialogVisible = false;
    },
    addCategoryClick() {
      this.title = "Add Category";
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      this.title = "Edit Category";
      this.selectedRow = row;
      this.formData = JSON.parse(JSON.stringify(this.selectedRow));
      this.dialogVisible = true;
    },

    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async handleDelete(index, row) {
      const id = row.id;
      const name = row.name.chinese;
      this.$confirm(`真的要删除${name}专辑吗?`, "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(async () => {
        await deleteCategory(id).then((res) => {
          if (res.ok) {
            this.$message({ message: "删除成功", type: "success" });
          }
        });
        this.categories = this.categories.filter((e) => e.id != id); //刷新表格
      });
    },
    handleCate(index, row) {
      this.$router.push({ name: "album", query: { categoryId: row.id } });
    },
  },
};
</script>
<style scoped>
.addCate {
  margin: 10px 0;
}
</style>
