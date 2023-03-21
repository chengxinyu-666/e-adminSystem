<!--
 审核拒绝
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="归还审核"
      :visible.sync="isShow"
      width="80%"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules" size="small">
        <el-form-item :model="form" label="请求附件" >
          <template v-for="image in imagesList">
            <el-image
              style="width: 100px; height: 100px;margin-left: 10px"
              :src="image"
              v-if="image.endsWith('jpg')"
              :preview-src-list="imagesList">
            </el-image>
            <video
              v-else
              :src="image"
              :controls="true"
              class="video-js vjs-big-play-centered vjs-fluid"
              webkit-playsinline="true"
              playsinline="true"
              x-webkit-airplay="allow"
              x5-playsinline
              style="max-width: 200px;max-height: 400px"
              :autoplay="false"
              ref="video">
            </video>
          </template>
        </el-form-item>
        <el-form-item :model="form" label="押金处理方式" >
          <span >{{depositType == 1?"原路退回":"押金抵消"}}</span>
        </el-form-item>
        <el-form-item :model="form" label="申请备注" >
          <span >{{sendNote}}</span>
        </el-form-item>
        <el-form-item :model="form" label="审批理由" prop="note">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入审批理由"
            v-model="form.note">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
         <el-button type="primary" @click="passConfirm">通 过</el-button>
        <el-button type="danger" @click="refuseConfirm">拒 绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {auditReturn, refused, returnRefused} from "../../api/order/order";
  import vue from "../../main";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        imagesList:[],
        depositType:null,
        sendNote:'',
        form:{
          orderId:null,
          note:null
        },
        imageUrl: '',
        textarea:'',
        rules: {
          note: [
            { required: false, message: '请填写理由', trigger: 'blur' },
          ]
        }
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      }
    },
    created () {
      console.log(this.param)
    },
    mounted() {
      if (this.param.sendVoucher){
        var images = this.param.sendVoucher.split(",");
        for (const image of images) {
          this.imagesList.push(vue.$store.state.common.cloudDomain+image);
        }
      }

      this.depositType = this.param.depositType;
      this.sendNote = this.param.sendNote;
      console.log(this.param)
    },
    activated () { },
    methods: {
      passConfirm(){
        auditReturn(this.param.id).then(res => {
          vue.$message({
            type: 'success',
            message: '审核成功!'
          });
          this.isShow = false
          this.$nextTick(() => {
            this.end(true);
          })
        }).catch(res => {

        });
      },
      refuseConfirm(){
        this.$refs.form.validate((valid) => {
          console.log(valid)
          if (valid) {
            returnRefused(this.param.id).then(res => {
              vue.$message({
                type: 'success',
                message: '拒绝成功!'
              });
              this.isShow = false
              this.$nextTick(() => {
                this.end(true);
              })
            }).catch(res => {
            });
          } else {
            return false;
          }
        });

      },
      closeFn () {
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
