<template>
  <basic-container>
    <avue-crud :option="option"
               :key="table_key"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template #menu="{row,index,size}">
        <div style="display: grid;grid-template-columns: repeat(3, auto);align-items: center;align-content: space-between;justify-items: end;justify-content: center;">
          <order_button v-bind:order="row" @start="start" @end="end" v-bind:type="'collection'"></order_button>
        </div>
      </template>
      <template slot="menuLeft">
        <div>
          <span style="font-size: 13px;color: #dd6161">今日已催款数10</span>
        </div>
      </template>
      <template :slot="item" slot-scope="scope" v-for="item in orderLabels" >
        <order_list_item v-bind:order="scope.row" v-bind:type="item" :key="item"></order_list_item>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {
    order_first_trial,
  } from "../../components/order/order_dialog";
  import order_button from "../../components/order/order_button";
  import order_list_item from "../../components/order/order_list_item";
  import {getWaitingCollectionList} from "../../api/audit/ordercollectionrecord";
  import moment from "moment";

  export default {
    components: {
      order_button,order_list_item
    },
    data() {
      return {
        form: {},
        query: {},
        table_key:0,
        loading: true,
        orderLabels:["no","userInfo","status","balanceDue","rentInfo","depositMoney","note","collectNote","danger"],
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
          searchMenuSpan: 6,
          tip: false,
          border: true,
          delBtn:false,
          addBtn: false,
          index: false,
          viewBtn: false,
          editBtn:false,
          selection: false,
          menuWidth:230,
          column: [
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
              label: "用户信息",
              prop: "userInfo",
              width:240,
            },
            {
              label: "订单状态",
              prop: "status",
              width:320,
            },
            {
              label: "欠费详情",
              prop: "balanceDue",
              width:280,
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
              label: "渠道来源",
              prop: "channel",
              width:120,
            },
            {
              label: "风控/征信",
              width:240,
              prop: "danger",
            },
            {
              label: "最新催款备注",
              width:120,
              prop: "collectNote",
            },
            {
              label: "订单备注",
              width:120,
              prop: "note",
            },

          ]
        },
        data: [],
        fn:{start:this.start,end:this.end}
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.orderexamine_add, false),
          viewBtn: this.vaildData(this.permission.orderexamine_view, false),
          delBtn: this.vaildData(this.permission.orderexamine_delete, false),
          editBtn: this.vaildData(this.permission.orderexamine_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      start() {

      },
      end(key){
        console.log("--2---")
        this.table_key = new Date().getTime();
      },
      getTask(){
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        const data = {orderIds:this.ids,reset:false}
        order_first_trial({data:data,fn:this.fn})
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        // params.examineFirst = 1;
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
        var domain = this.$store.state.common.cloudDomain;
        getWaitingCollectionList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          for (const item of data.records) {
            item.domain = domain;
          }
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
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
