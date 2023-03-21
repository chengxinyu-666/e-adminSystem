<!--
 订单修改
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="进件单"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      width="900px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form1" label-width="120px" size="small">
        <div>
          选择进件单模板
          <el-select v-model="name" placeholder="请选择进件单模板" style="margin-left: 10px">
              <el-option :label="item.title" v-for="item in this.formList"
                     @click.native="changeForm(item)"
                     :value="item.title"></el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px">
          <el-alert
            title="选择进件单会覆盖当前进件单，请注意谨慎选择"
            type="error">
          </el-alert>
        </div>
        <div style="margin-top: 10px" v-if="param.entryForm">
          填写进件单{{entryForm.length==0?"：请选择进件单":""}}
        </div>
        <div style="border-radius: 5px;padding: 0px 0px;padding-top: 10px;padding-bottom: 10px;">
          <div class="div_table">
            <template v-for="entry in entryForm">
              <div class="div_header table_border">
                {{ entry.title }}
              </div>
              <template v-if="entry.value.length>0&&entry.value[0].constructor === Object">
                <div class="div_content" style="flex-flow: row wrap;">
                  <template v-for="item in entry.value">
                  <div :style="(entry.value.length>=4?'width:24.8%':'flex:1')">
                    <div class="div_top">
                      <span class="div_item table_border" style="height: 30px">{{ item.title }}</span>
                    </div>
                    <div class="div_item table_border ">
                    <span class="item" style="width: 90%;margin-top: 5px;margin-bottom: 5px" v-if="item.type==0">
                      {{runStr(item.val)}}
                    </span>
                      <el-input class="item"  v-model="item.value" style="width: 90%;margin-top: 5px;margin-bottom: 5px" :placeholder="'请输入'+item.title" v-if="item.type==1"></el-input>
                      <el-select class="item" v-model="item.value" style="width: 90%;" v-if="item.type==2" placeholder="请选择">
                        <el-option
                          v-for="item in item.option"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input-number class="item" v-model="item.value" :min="1" style="width: 90%;" :label="'请输入'+item.title" v-if="item.type==3"></el-input-number>
                      <el-input class="item"  v-model="item.value" type="number" style="width: 90%;margin-top: 5px;margin-bottom: 5px" :placeholder="'请输入'+item.title" v-if="item.type==4"></el-input>
                      <el-select class="item" v-model="item.value" style="width: 90%;" v-if="item.type==5" multiple placeholder="请选择">
                        <el-option
                          v-for="item in item.option"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                      <!--                      <span v-if="item.type==0">{{ item.value }}</span>-->
                    </div>
                  </div>
                  </template>
                </div>
              </template>
              <template v-if="entry.value.length>0&&entry.value[0].constructor === Array" v-for="one in entry.value">
                <div class="div_top">
                  <span class="div_item table_border" v-for="item in one">{{ item.title }}</span>
                </div>
                <div class="div_content">
                  <template v-for="item in one">
                    <div class="div_item table_border " v-if="item.type!=0">
                      <el-input class="item"  v-model="item.value" style="width: 90%;margin-top: 5px;margin-bottom: 5px" :placeholder="'请输入'+item.title" v-if="item.type==1"></el-input>
                      <el-select class="item" v-model="item.value" style="width: 90%;" v-if="item.type==2" placeholder="请选择">
                        <el-option
                          v-for="item in item.option"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input-number class="item" v-model="item.value" :min="1" style="width: 90%;" :label="'请输入'+item.title" v-if="item.type==3"></el-input-number>
                      <el-input class="item"  v-model="item.value" type="number" style="width: 90%;margin-top: 5px;margin-bottom: 5px" :placeholder="'请输入'+item.title" v-if="item.type==4"></el-input>
                      <el-select class="item" v-model="item.value" style="width: 90%;" v-if="item.type==5" multiple placeholder="请选择">
                        <el-option
                          v-for="item in item.option"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                      <!--                      <span v-if="item.type==0">{{ item.value }}</span>-->
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">保存进件单</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";
  import {temps} from "@/api/parameter/entryformtemplate";
  import {entryForm, update as orderUpdate} from "../../api/order/order";



  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        name:null,
        formList:null,
        entryForm:[],
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
    mounted() {
      console.log(this.param)
      if (this.param.entryForm){
        this.entryForm = JSON.parse(this.param.entryForm)
      }
    },
    created () {
      temps().then(res => {
        this.formList = res.data.data;
        console.log( this.formList )
      });
    },
    activated () { },
    methods: {
      runStr(str){
        return eval("(function(){return "+str+";})()");
      },
      headers(){
        return headers()
      },
      closeFn () {
      },
      changeForm(item){
        this.entryForm = JSON.parse(item.content);
      },
      confirm(){
        for (const para of this.entryForm) {
          for (const item of para.value) {
            if (item.type == 0){
              item.value = this.runStr(item.val)
            }
          }
        }
        const  paras = {orderId:this.param.id,entryForm:JSON.stringify(this.entryForm)};
        entryForm(paras).then(res => {
          console.log(res.data.data)
          this.$message("提交成功")
          this.isShow = false
        });
      },
    },
  };
</script>
<style scoped>

  :deep .el-dialog__body::-webkit-scrollbar {
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 0px;
  }

  :deep .el-dialog__body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
    background: #aaaaaa;
  }

  :deep .el-dialog__body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.0);
  }

  .bottom{
    padding-bottom: 0px !important;
    margin-bottom: 0px !important;
  }
  :deep .avue-crud__menu {
    display: none;
  }
  :deep .el-empty {
    padding: 0px 0px !important;
  }
  :deep .avue-crud__empty {
    padding: 0px 0px !important;
  }
  .div_table {
    width: 100%;
  }

  .table_border{
    border-right: 1px solid #E9E9E9;
    border-bottom: 1px solid #E9E9E9;
  }
  .div_header {
    background-color: #FAFAFA;
    color: #108EE9;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    border-top: 1px solid #E9E9E9;
    border-left: 1px solid #E9E9E9;
  }
  .div_top {
    width: 100%;
    background-color: #169BD533;
    display: flex;
    flex-direction: row
  }
  .div_top .div_item {
    flex: 1;
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
    font-size: 14px;
  }

  .div_content {
    width: 100%;
    display: flex;
    flex-direction: row;
    border-left: 1px solid #E9E9E9;
    text-align: center;
  }

  .div_content .div_item {
    flex: 1;
    text-align: center;
    font-size: 14px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
  }

  .item {
    margin: 5px 10px;
  }
</style>
