<template>
  <div style="height: 100%;">
    <el-dialog
      v-if="isShow"
      v-model="form"
      title="发货确认"
      :visible.sync="isShow"
      width="800px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <avue-form ref="form" class="bill_info" v-model="form" :option="option" @submit="submit" @reset-change="cancle">
        <template slot-scope="{disabled,size}" slot="sendExpressCompany">
          <el-select v-model="form.sendExpressCompany" filterable placeholder="请选择">
            <el-option
              v-for="item in expressList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </template>
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
  import {search} from "../../api/parameter/express";
  import {add} from "../../api/express/sendgoods";

  export default {
    name: "",
    data(){
      return {
        form:{
          sendExpressCompany: null,
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
              label:'快递公司',
              prop:'sendExpressCompany',
              span: 12,
              type:'select',
              rules: [{
                required: true,
                message: "请选择快递公司",
                trigger: "blur"
              }]
            },{
              label:'快递单号',
              prop:'sendExpressNo',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入快递单号",
                trigger: "blur"
              }]
            },{
              label:'实际快递费',
              prop:'expressMoney',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入快递费",
                trigger: "blur"
              }]
            },{
              label:'进货成本',
              prop:'buyingPrice',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入进货成本",
                trigger: "blur"
              }]
            },{
              label:'IME',
              prop:'goodsIme',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入IME",
                trigger: "blur"
              }]
            },{
              label:'SN',
              prop:'goodsSn',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入SM",
                trigger: "blur"
              }]
            },
            {
              label:'进货渠道',
              prop:'buyingChannel',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入进货渠道",
                trigger: "blur"
              }]
            },{
              label:'发货图片',
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
                required: true,
                message: "请上传发货图片",
                trigger: "blur"
              }]
            },{
              label:'发货说明',
              span: 24,
              type:'textarea',
              minRows:3,
              maxRows:5,
              prop:'note'
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
      this.option.column[7].propsHttp.home = this.param.domain
      search({}).then(res => {
        this.expressList = res.data.data;
        console.log(this.expressList)
      }).catch(res => {

      })
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
          params.images = this.form.images.join(",");
          console.log("---------",params,this.form.images)
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
