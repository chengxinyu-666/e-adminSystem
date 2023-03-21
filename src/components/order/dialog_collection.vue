<!--
 设置一审
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="设置催款员"
      :visible.sync="isShow"
      width="400px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="催款角色" prop="roleAlias" >
          <el-select v-model="form.roleAlias" filterable placeholder="请选择催款员角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="催款人员" prop="userId" >
          <el-select v-model="form.userId" filterable placeholder="请选择催款人员">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.realName"
              :value="item.id">
            </el-option>
          </el-select>
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

  import {distribute} from "../../api/audit/ordercollection"
  import {getAuditorUserList} from "../../api/audit/orderexamine";

  export default {
    name: 'dialog',
    data () {
      return {
        form:{
          roleAlias:null,
          userId:null,
        },
        rules: {
          roleAlias: [
            { required: true, message: '请选择催款角色', trigger: 'change' }
          ],
          userId: [
            {  required: true, message: '请选择催款人员', trigger: 'change' }
          ],
        },
        param: {reset:false},
        isShow:false,
        options: [{
          value: 'collection_director',
          label: '催款主管'
        }, {
          value: 'collector',
          label: '催款员'
        }],
        users: [],
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      },
      'form.roleAlias': function (val) {
        const param = {roleAlias: this.form.roleAlias};
        this.form.userId = null;
        getAuditorUserList(param).then(res => {
          this.users = res.data.data
        })
      },
    },
    mounted() {
      console.log(this.param)

    },
    created () {
      console.log(this.param)
    },
    activated () { },
    methods: {
      confirm(){
        console.log(this.form)
        this.$refs.form.validate((valid) => {
          console.log(valid)
          if (!valid) {
            console.log('请选择参数');
            return false;
          }
          const  paras = {userId:this.form.userId,orderIds:this.param.orderIds,reset:false};
          distribute(paras).then(res => {
            console.log(res.data.data)
            this.$message("提交成功")
            this.isShow = false
          }).catch(res=>{
            console.log("失败")
          });
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
<style lang="scss" scoped="scoped">
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
