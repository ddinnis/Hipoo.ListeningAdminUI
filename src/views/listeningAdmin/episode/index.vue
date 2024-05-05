<template>
  <div>
    <div class="btn">
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addEposide"
          >创建音频</el-button
        >
      </el-button-group>
    </div>
    <div class="encodingEpisodes" v-if="encodingEpisodes.length > 0">
      <el-table row-key="id" :data="encodingEpisodes" style="width: 100%">
        <el-table-column
          prop="name.chinese"
          label="中文标题"
          width="220px"
        ></el-table-column>
        <el-table-column
          prop="name.english"
          label="英文标题"
          width="220px"
        ></el-table-column>
        <el-table-column prop="durationInSecond" width="100px" label="秒数">
        </el-table-column>
        <el-table-column label="转码状态" width="120px">
          <template #default="scope">
            <el-tag
              :type="renderEncodingStatusTag(scope.row.status)"
              style="margin-left: 10px"
            >
              {{ renderEncodingStatus(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <el-divider />
    </div>

    <div class="content">
      <el-table
        row-key="id"
        :data="episodes"
        :row-class-name="tableRowClassName"
        style="width: 100%"
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
        <el-table-column label="字幕类型" width="80">
          <template slot-scope="scope">
            <el-tag type="success" style="margin-left: 10px">{{
              scope.row.subtitleType
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.creationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="秒数" width="60">
          <template #default="scope">
            <span>{{ parseInt(scope.row.durationInSecond) }}</span>
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
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog
        title="Edit Episode"
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
          <el-form-item label="字幕类型">
            <el-select
              v-model="formData.subtitleType"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="subtitle">
            <el-input
              v-model="formData.subtitle"
              :rows="5"
              type="textarea"
              placeholder="请输入字幕文件"
              class="responsive-input"
            />
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
import * as signalR from "@microsoft/signalr";
import { Message, Tree } from "element-ui";
import {
  findEposideAlbumId,
  findEncodingEpisodesByAlbumId,
  showEpisode,
  hideEpisode,
  deleteEposide,
  updateEposide,
  addEposide,
} from "@/api/episode.js";
export default {
  name: "episode",
  data() {
    return {
      episodes: [],
      encodingEpisodes: [],
      albumId: "",
      isInSortMode: false,
      formData: {
        name: {
          english: "",
          chinese: "",
        },
        subtitleType: "",
        subtitle: "",
      },
      dialogVisible: false,
      selectedRow: {},
      options: [
        { value: "srt", label: "srt" },
        { value: "vtt", label: "vtt" },
        { value: "lrc", label: "lrc" },
        { value: "json", label: "json" },
      ],
    };
  },
  mounted() {
    this.reloadData();
    //禁用Negotiation，客户端一直连接初始的服务器，这样服务器搞负载均衡（不用Redis BackPlane等）也没问题
    const options = {
      skipNegotiation: true,
      transport: 1, // 强制WebSockets
    };
    const hub = new signalR.HubConnectionBuilder()
      .withUrl(
        `http://localhost:81/Listening.Admin/Hubs/EpisodeEncodingStatusHub`,
        options
      )
      .build();
    hub.start();
    hub.on("OnMediaEncodingStarted", (id) => {
      console.log("OnMediaEncodingStarted", id);

      let episode = state.encodingEpisodes.find((e) => e.id == id);
      episode.status = "Started";
    });
    hub.on("OnMediaEncodingFailed", (id) => {
      console.log("OnMediaEncodingFailed", id);
      let episode = state.encodingEpisodes.find((e) => e.id == id);
      episode.status = "Failed";
    });
    hub.on("OnMediaEncodingCompleted", (id) => {
      console.log("OnMediaEncodingCompleted", id);
      let episode = state.encodingEpisodes.find((e) => e.id == id);
      episode.status = "Completed";
      reloadData(); //遇到由完成任务的就刷新数据
    });
  },

  methods: {
    tableRowClassName({ row }) {
      return row?.isVisible ? "visibleEpisode" : "inVisibleEpisode";
    },

    async handleComfirm() {
      await updateEposide(this.formData).then((data) => {
        this.$message({ message: "更新成功", type: "success" });
      });
      this.dialogVisible = false;
      this.reloadData();
    },
    handleEdit(index, row) {
      this.selectedRow = row;

      this.formData = JSON.parse(JSON.stringify(this.selectedRow));
      this.dialogVisible = true;
      this.reloadData();
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
      this.$confirm(`真的要删除吗?`, "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(async () => {
        await deleteEposide(id).then((res) => {
          if (res.ok) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        });
        this.episodes = this.episodes.filter((e) => e.id != id); //刷新表格
      });
    },
    async reloadData() {
      const albumId = this.$route.query.albumId;

      this.albumId = albumId;
      findEposideAlbumId(albumId).then((res) => {
        this.episodes = res;
      });

      findEncodingEpisodesByAlbumId(albumId).then((res) => {
        this.encodingEpisodes = res;
      });
    },

    async showItem(index, episode) {
      const id = episode.id;
      await showEpisode(id).then(() => {
        episode.isVisible = true;
      });
    },
    async hideItem(index, episode) {
      const id = episode.id;
      await hideEpisode(id).then(() => {
        episode.isVisible = false;
      });
    },
    renderEncodingStatus(status) {
      const dict = {
        Created: "等待转码",
        Started: "转码中",
        Failed: "转码失败",
        Completed: "转码完成",
      };
      const value = dict[status];
      return value ? value : "未知";
    },
    renderEncodingStatusTag(status) {
      const dict = {
        Created: "warning",
        Started: "info",
        Failed: "danger",
        Completed: "success",
      };
      const value = dict[status];
      return value ? value : "";
    },
    addEposide() {
      this.$router.push({
        name: "uploadFile",
        query: { albumId: this.albumId },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .inVisibleEpisode {
  text-decoration: line-through;
}
::v-deep .visibleEpisode {
  text-decoration: inherit;
}
.addCate {
  margin: 10px 0;
}
</style>
