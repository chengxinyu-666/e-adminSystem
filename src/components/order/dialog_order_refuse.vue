<!--
 审核拒绝
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="审核拒绝"
      :visible.sync="isShow"
      width="40%"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules" size="small">
        <el-form-item :model="form" label="拒绝理由" prop="note">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入拒绝理由"
            v-model="form.note">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {refused} from "../../api/order/order";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        form:{
          orderId:null,
          note:null
        },
        imageUrl: '',
        textarea:'',
        rules: {
          note: [
            { required: true, message: '请填写驳回理由', trigger: 'blur' },
          ]
        }
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
    },
    activated () { },
    methods: {
      confirm(){
        console.log(this.form)
        this.form.orderId = this.param.id
        this.$refs.form.validate((valid) => {
          console.log(valid)
          if (valid) {
            refused(this.form).then(res => {
              console.log(res.data.data)
              this.$message("驳回成功")
              this.isShow = false
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
