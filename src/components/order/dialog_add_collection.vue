<template>
  <div style="height: 100%;">
    <el-dialog
      v-if="isShow"
      v-model="form"
      title="增加催收"
      :visible.sync="isShow"
      width="800px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <avue-form ref="form" class="bill_info" v-model="form" :option="option" @submit="submit" @reset-change="cancle">
        <template slot-scope="{size}" slot="menuForm">
          <div slot="footer" class="dialog-footer" style="text-align: end;">
            <el-button size="medium" @click="$refs.form.resetForm()">取 消</el-button>
            <el-button size="medium" type="primary"  @click="$refs.form.submit()">确 定</el-button>
          </div>
        </template>
      </avue-form>
    </el-dialog>
  </div>
</template>

<script>
  import {add} from "../../api/audit/ordercollectionrecord";

  export default {
    name: "",
    data(){
      return {
        form:{
        },
        param:null,
        isShow:false,
        expressList:[],
        loading:false,
        dialogVisible:false,
        option:{
          submitBtn:false,
          emptyBtn:false,
          labelWidth: 120,
          column: [
           {
              label:'催款凭证',
              prop:'images',
              type: 'upload',
              span: 24,
              listType: 'picture-card',
              tip: '只能上传jpg/png文件，且不超过500kb',
              propsHttp: {
                home: "",
                res: "data",
                url: 'name',
                name: 'originalName'
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              rules: [{
                required: false,
                message: "请上传催款凭证",
                trigger: "blur"
              }]
            },{
              label:'催款说明',
              span: 24,
              type:'textarea',
              minRows:3,
              maxRows:5,
              prop:'note',
              rules: [{
                required: true,
                message: "请添加催款说明",
                trigger: "blur"
              }]
            },
          ]
        }
      }
    },
    created () {
    },
    computed: {
    },
    activated () { },
    mounted() {
      this.option.column[0].propsHttp.home = this.param.domain
    },
    methods:{
      closeFn () {
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      cancle () {
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      submit(form,done){
          var params = {...form}
          params.orderId = this.param.id;
          params.voucher = this.form.images?this.form.images.join(","):null
          console.log("---------",params,)
          params.orderNo = this.param.no
          params.clientId = this.param.clientId
          params.collectionId = this.param.collectionId
          add(params).then(() => {
            done();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.loading = false;
            this.isShow = false
            this.$nextTick(() => {
              this.end(true);
            })
          }, error => {
            window.console.log(error);
          });
      },
    }
  }
</script>

<style scoped>
  ::v-deep .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px !important;
  }
  ::v-deep .el-upload-list--picture-card .el-upload-list__item{
    width: 100px !important;
    height: 100px !important;
  }
</style>
