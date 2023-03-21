<!--
 上传凭证
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="发货凭证"
      :visible.sync="isShow"
      width="600px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <div>
        <el-image-viewer
          class="imageview"
          v-if="showViewer2"
          style="z-index:9999 !important;"
          :on-close="() => {showViewer2 = false;}"
          :url-list="imageslist">
        </el-image-viewer>
        <img style="height: 300px;margin-right: 10px" @click="show" :src="item" v-for="item of imageslist">
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";
  import vue from "../../main";
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";

  export default {
    name: 'dialog',
    components: {
      ElImageViewer,
    },
    data () {
      return {
        param:null,
        showViewer2:false,
        imageslist:[],
        isShow:false,
        imageUrl: ''
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end();
          })
        }
      }
    },
    created () {
      console.log(this.param)
    },
    mounted() {
      console.log(this.param)
      var Lists = this.param.images.split(",")
      var list = [];
      for (const item of Lists) {
        list.push(vue.$store.state.common.cloudDomain+item);
      }
      this.imageslist = list;
    },
    activated () { },
    methods: {
      headers(){
        return headers()
      },
      closeFn () {
      },
      show(){
        console.log("----------")
        this.showViewer2 = true
      }
    },
  };
</script>
<style lang="scss" scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
