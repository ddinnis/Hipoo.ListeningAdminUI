<template>
  <div class="main">
    <el-button type="primary" class="addCate" @click="addAlbumClick"
      >创建专辑</el-button
    >
    <el-table
      row-key="id"
      :data="Albums"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="中文标题" width="220">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name.chinese }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文标题" width="220">
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
            v-show="scope.row.isVisible"
            @click="hideItem(scope.$index, scope.row)"
          >
            Hide
          </el-button>
          <el-button
            size="mini"
            v-show="!scope.row.isVisible"
            @click="showItem(scope.$index, scope.row)"
          >
            Show
          </el-button>

          <el-button
            size="mini"
            type="info"
            @click="handleEpisode(scope.$index, scope.row)"
            >管理音频</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog">
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
          <el-input
            v-model="formData.categoryId"
            style="display: none"
          ></el-input>
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
  getAlbums,
  deleteAlbum,
  showAlbum,
  hideAlbum,
  updateAlbum,
  addAlbum,
} from "@/api/album.js";
import { Message } from "element-ui";

export default {
  name: "Album",
  data() {
    return {
      Albums: [],
      dialogVisible: false,
      selectedRow: {},
      title: "",
      formData: {
        name: {
          english: "",
          chinese: "",
        },
        categoryId: "",
      },
    };
  },
  mounted() {
    this.getAlbumsData();
  },
  methods: {
    tableRowClassName({ row }) {
      return row?.isVisible ? "visibleAlbum" : "inVisibleAlbum";
    },
    async getAlbumsData() {
      const id = this.$route.query.categoryId;
      this.categoryId = id;
      await getAlbums(id).then((data) => {
        this.Albums = data;
      });
    },

    async handleComfirm() {
      if (this.title === "Edit Album") {
        await updateAlbum(this.formData).then((data) => {
          if (data.ok) {
            this.$message({ message: "更新成功", type: "success" });
          }
        });
      }
      if (this.title === "Add Album") {
        this.formData.categoryId = this.categoryId;
        await addAlbum(this.formData).then((data) => {
          if (data.ok) {
            this.$message({ message: "更新成功", type: "success" });
          }
        });
      }

      this.dialogVisible = false;
      this.getAlbumsData();
    },

    addAlbumClick() {
      this.title = "Add Album";
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      this.selectedRow = row;
      this.title = "Edit Album";
      this.formData = JSON.parse(JSON.stringify(this.selectedRow));
      this.dialogVisible = true;
      this.getAlbumsData();
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
        await deleteAlbum(id).then((res) => {
          if (res.ok) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        });
        this.Albums = this.Albums.filter((e) => e.id != id); //刷新表格
      });
    },
    async hideItem(index, row) {
      console.log("first", row);

      await hideAlbum(row.id).then(() => {
        row.isVisible = false;
      });
    },
    async showItem(index, row) {
      await showAlbum(row.id).then(() => {
        row.isVisible = true;
      });
    },
    handleEpisode(index, row) {
      this.$router.push({ name: "episode", query: { albumId: row.id } });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .inVisibleAlbum {
  text-decoration: line-through;
}
::v-deep .visibleAlbum {
  text-decoration: none;
}
.addCate {
  margin: 10px 0;
}
</style>
