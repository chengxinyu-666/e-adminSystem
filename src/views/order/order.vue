<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="true">
      <el-tab-pane :label="item.dictValue" v-for="(item,index) of tabs">
      </el-tab-pane>
    </el-tabs>
    <avue-crud :option="options"
               :key="table_key"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   plain
                   v-if="permission.order_allot && allotBtn"
                   @click="allotTenant(row)">分配资金方
        </el-button>
      </template>
      <template #menu="{row,index,size}">
          <div style="display: grid;grid-template-columns: repeat(3, auto);align-items: center;align-content: space-between;justify-items: end;justify-content: center;">
              <order_button v-bind:order="row" v-bind:type="'orderList'"></order_button>
          </div>
      </template>
      <template :slot="item" slot-scope="scope" v-for="item in orderLabels" >
        <order_list_item v-bind:order="scope.row" v-bind:type="item" :key="item"></order_list_item>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, allotTenant, getDetail, add, update, remove} from "@/api/order/order";
  import {mapGetters} from "vuex";
  import {dictionary} from "../../api/system/dict";
  import order_button from "../../components/order/order_button";
  import order_list_item from "../../components/order/order_list_item";
  import moment from "moment";
  export default {
    components: {
      order_button,order_list_item
    },
    data() {
      return {
        activeName:0,
        table_key:111,
        allotBtn: false,
        tabs:[],
        form: {},
        query: {},
        loading: true,
        status: 0,
        orderLabels:["no","userInfo","goodsInfo","rentInfo","depositMoney","note","danger","distribute"],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 4,
          tip: false,
          border: true,
          editBtn:false,
          delBtn:false,
          addBtn: false,
          index: false,
          viewBtn: false,
          columnBtn: false,//列显隐按钮
          refreshBtn: false,//刷新按钮
          searchBtn: true,//搜索显隐按钮（当column中有搜索的属性，或则searchslot为true时自定义搜索启动起作用）
          selection: true,
          menuWidth:270,
          column: [
            {
              label: "资金方",
              prop: "tenantId",
              search: true,
              hide: true,
              type: "tree",
              searchSpan:4,
              dicUrl: "/api/blade-system/tenant/select",
              span: 24,
              props: {
                label: "tenantName",
                value: "tenantId"
              },
            },
            {
              label: "资金方名称",
              width:90,
              prop: "tenantName",
              search: false,
            },
            {
              label: "订单编号",
              prop: "no",
              width:200,
              slot: true,
              search:true,
              searchSpan:4,
              searchOrder:1,
            },
            {
              label: "用户姓名",
              prop: "userName",
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "手机号",
              prop: "phone",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "商品编号",
              prop: "goodsId",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "商品名称",
              prop: "goodsTitle",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: '下单时间',
              prop: 'createTime',
              type: 'daterange',
              searchSpan:8,
              searchRange:true,
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              hide:true,
              search:true,
            },
            {
              label: '租期开始',
              prop: 'rentTime',
              type: 'daterange',
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              searchSpan:8,
              searchRange:true,
              hide:true,
              search:true,
            },
            {
              label: "租赁方案",
              prop: "rentType",
              type: "select",
              searchSpan:4,
              search:false,
              hide: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "用户信息",
              prop: "userInfo",
              width:240,
            },
            {
              label: "商品信息",
              prop: "goodsInfo",
              width:160,
            },
            {
              label: "租赁方案",
              prop: "rentInfo",
              width:360,
            },
            {
              label: "押金",
              prop: "depositMoney",
              width:240,
            },
            {
              label: "订单状态",
              prop: "status",
              type: "select",
              searchSpan:4,
              search:false,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "是否分配",
              prop: "distribute",
              slot: true,
              width:230,
            },
            {
              label: "渠道来源",
              prop: "channel",
              rules: [{
                required: true,
                message: "请输入渠道来源",
                trigger: "blur"
              }]
            },
            {
              label: "风控/征信",
              width:240,
              prop: "danger",
            },
            {
              label: "备注",
              width:120,
              prop: "note",
            },

          ]
        },
        data: []
      };
    },
    watch: {
      activeName: function (){

      },
    },
    computed: {
      ...mapGetters(["userInfo","permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.order_add, false),
          viewBtn: this.vaildData(this.permission.order_view, false),
          delBtn: this.vaildData(this.permission.order_delete, false),
          editBtn: this.vaildData(this.permission.order_edit, false)
        };
      },
      options() {
        var options = {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 4,
          tip: false,
          border: true,
          editBtn:false,
          delBtn:false,
          addBtn: false,
          index: false,
          viewBtn: false,
          columnBtn: false,//列显隐按钮
          refreshBtn: false,//刷新按钮
          searchBtn: true,//搜索显隐按钮（当column中有搜索的属性，或则searchslot为true时自定义搜索启动起作用）
          selection: true,
          menuWidth:270,
          column: [
            {
              label: "资金方",
              prop: "tenantId",
              search: true,
              hide: true,
              type: "tree",
              searchSpan:4,
              dicUrl: "/api/blade-system/tenant/select",
              span: 24,
              props: {
                label: "tenantName",
                value: "tenantId"
              },
            },
            {
              label: "资金方名称",
              width:90,
              prop: "tenantName",
              search: false,
            },
            {
              label: "订单编号",
              prop: "no",
              width:200,
              slot: true,
              search:true,
              searchSpan:4,
              searchOrder:1,
            },
            {
              label: "用户姓名",
              prop: "userName",
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "手机号",
              prop: "phone",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "商品编号",
              prop: "goodsId",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: "商品名称",
              prop: "goodsTitle",
              width:230,
              searchSpan:4,
              slot: true,
              hide: true,
              search:true,
            },
            {
              label: '下单时间',
              prop: 'createTime',
              type: 'daterange',
              searchSpan:8,
              searchRange:true,
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              hide:true,
              search:true,
            },
            {
              label: '租期开始',
              prop: 'rentTime',
              type: 'daterange',
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              searchSpan:8,
              searchRange:true,
              hide:true,
              search:true,
            },
            {
              label: "租赁方案",
              prop: "rentType",
              type: "select",
              searchSpan:4,
              search:false,
              hide: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "用户信息",
              prop: "userInfo",
              width:240,
            },
            {
              label: "商品信息",
              prop: "goodsInfo",
              width:160,
            },
            {
              label: "租赁方案",
              prop: "rentInfo",
              width:360,
            },
            {
              label: "押金",
              prop: "depositMoney",
              width:240,
            },
            {
              label: "订单状态",
              prop: "status",
              type: "select",
              searchSpan:4,
              search:false,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "是否分配",
              prop: "distribute",
              slot: true,
              width:230,
            },
            {
              label: "渠道来源",
              prop: "channel",
              rules: [{
                required: true,
                message: "请输入渠道来源",
                trigger: "blur"
              }]
            },
            {
              label: "风控/征信",
              width:240,
              prop: "danger",
            },
            {
              label: "备注",
              width:120,
              prop: "note",
            },

          ]
        };
        if(!this.userInfo.tenantId.includes('000000')){
          options.column = options.column.filter(item => {
            if(item.prop == 'tenantId'){
              return false;
            }
            if(item.prop == 'tenantId'){
              return false;
            }
            return true;
          });
        }
        return options;
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    created() {
      dictionary("order_status").then(res => {
        this.tabs = res.data.data
        if(this.userInfo.tenantId.includes('000000')){
          this.tabs.unshift({dictValue:"资方未分配",dictKey:100})
        }else{

          this.option.column = this.option.column.filter(item => {
            if(item.prop == 'tenantId'){
                return false;
            }
            if(item.prop == 'tenantId'){
                return false;
            }
            return true;
          });
        }
        this.tabs.unshift({dictValue:"全部",dictKey:0})
        console.log(this.tabs)
      })
    },
    methods: {
      fn(){

      },
      handleClick(tab, event) {
        this.page.currentPage = 1
        this.status = this.tabs[tab.index].dictKey;
        if( this.status >= 100){
          this.query = {isTenant:1};
          this.allotBtn = true;
        }else{
          this.query = {status: this.status};
          this.allotBtn = false;
        }
        this.table_key = new Date().getTime();
      },
      searchReset() {
        this.query = {};
        console.log("---searchReset----",this.query)
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        if( this.status >= 100){
          this.query.isTenant = 1;
          this.allotBtn = true;
        }else{
          this.query.status = this.status;
          this.allotBtn = false;
        }
        console.log("---searchChange----",this.query)
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        if (this.$refs.crud)
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        if (this.query.createTime&&this.query.createTime.length == 2){
          this.query.beginCreateTime = moment(this.query.createTime[0]+" 00:00:00").format('YYYY-MM-DD HH:mm:ss');
          this.query.endCreateTime = moment(this.query.createTime[1]+" 23:59:59").format('YYYY-MM-DD HH:mm:ss');
          delete this.query.createTime;
        }

        if (this.query.rentTime&&this.query.rentTime.length == 2){
          this.query.beginRentTime = this.query.rentTime[0];
          this.query.endRentTime = this.query.rentTime[1];
          delete this.query.rentTime;
        }

        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          if (this.status == 3){
            for (const datum of  this.data) {
              datum.status = 3;
            }
          }
          this.loading = false;
          this.selectionClear();
        });
      },
      allotTenant(row) {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$DialogForm.show({
          title: '分配资金方',
          width: '30%',
          menuPosition: 'right',
          option: {
            submitText: '提交',
            span: 24,
            column: [
              {
                label: "资金方",
                prop: "tenantId",
                type: "tree",
                dicUrl: "/api/blade-system/tenant/select",
                span: 24,
                props: {
                  label: "tenantName",
                  value: "tenantId"
                },
                rules: [{
                  required: true,
                  message: "请选择资金方",
                  trigger: "blur"
                }],
              },
            ]
          },
          callback:(c)=>{
            allotTenant(this.ids,c.data.tenantId).then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "分配成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
              c.done()
              c.close()
              this.refreshChange();
            }, error => {
              window.console.log(error);
              c.done()
              c.close()
              this.refreshChange();
            })
          }
        })
      }
    }
  };
</script>


<style scoped>
  :deep .el-tabs__header {
    margin: 0 0 0px !important;
}
  :deep .avue-crud__pagination{
    padding: 0px 0 0px 10px !important;
  }

  :deep .el-col {
    margin-bottom: 0px !important;
  }

  :deep .avue-crud__search .el-form-item--mini.el-form-item, .avue-crud__search .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
</style>
