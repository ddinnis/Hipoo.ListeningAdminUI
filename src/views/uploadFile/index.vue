<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="中文标题">
      <el-input v-model="episode.name.chinese"></el-input>
    </el-form-item>
    <el-form-item label="英文标题">
      <el-input v-model="episode.name.english"></el-input>
    </el-form-item>
    <el-form-item label="音频路径">
      <audio
        id="player"
        @durationchange="playerDurationChange"
        :src="episode.audioUrl"
        controls
        style="display: none"
      ></audio>
      <Uploader @audioUrl="getAudioUrl"></Uploader>
    </el-form-item>
    <el-form-item label="音频秒数">
      <el-input v-model="episode.durationInSecond"></el-input>
    </el-form-item>
    <el-form-item label="字幕类型">
      <el-select v-model="episode.subtitleType" placeholder="请选择字幕类型">
        <el-option label="srt" value="srt"></el-option>
        <el-option label="vtt" value="vtt"></el-option>
        <el-option label="lrc" value="lrc"></el-option>
        <el-option label="json" value="json"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字幕">
      <el-input type="textarea" v-model="episode.subtitle" rows="5"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addEposide">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addEposide } from "@/api/episode.js";
import Uploader from "@/components/Uploader/index.vue";
export default {
  name: "EpisodeAdd",
  components: { Uploader },
  data() {
    return {
      url: "",
      episode: {
        name: { chinese: "", english: "" },
        audioUrl: "",
        subtitleType: "srt",
        subtitle: "",
        durationInSecond: "",
        albumId: "",
      },
    };
  },
  mounted() {
    this.episode.albumId = this.$route.query.albumId;
  },
  methods: {
    addEposide() {
      addEposide(this.episode).then((res) => {
        history.back();
      });
    },
    getAudioUrl(val) {
      this.episode.audioUrl = val;
    },
    playerDurationChange() {
      const player = document.getElementById("player");
      this.episode.durationInSecond = player.duration;
    },
  },
};
</script>
<style scoped></style>
