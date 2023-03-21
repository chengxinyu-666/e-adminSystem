<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :key="table_key"
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
        <div>
          <span style="font-size: 15px;color: #dd6161">今日待发货订单{{toadyCount}}条</span>
        </div>
      </template>
      <template #menu="{row,index,size}">
        <div style="display: grid;grid-template-columns: repeat(2, auto);align-items: center;align-content: space-between;justify-items: end;justify-content: center;">
          <order_button v-bind:order="row" @start="start" @end="end" v-bind:type="'sendgoods'"></order_button>
        </div>
      </template>
      <template :slot="item" slot-scope="scope" v-for="item in orderLabels" >
        <order_list_item v-bind:order="scope.row" v-bind:type="item" :key="item"></order_list_item>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove ,todayCount} from "@/api/express/sendgoods";
  import {mapGetters} from "vuex";
  import order_list_item from "../../components/order/order_list_item";
  import order_button from "../../components/order/order_button";

  export default {
    components: {
      order_list_item,order_button
    },
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        table_key:111,
        toadyCount:0,
        domain:this.$store.state.common.cloudDomain,
        orderLabels:["no","sendUser","sendStatus","goodsInfo","rentInfo","depositMoney","note","danger","distribute","goodsSn","remarks"],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: false,
          editBtn:false,
          delBtn:false,
          addBtn: false,
          viewBtn: false,
          selection: false,
          menuWidth:200,
          column: [
            {
              label: "订单编号",
              prop: "no",
              width:200,
              slot: true,
            },
            {
              label: "商品信息",
              prop: "goodsInfo",
              width:240,
            },
            {
              label: "收件人信息",
              prop: "sendUser",
              width:240,
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            },
            {
              label: "发货状态",
              prop: "sendStatus",
              width:280,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "发货信息",
              prop: "goodsSn",
              width:160,
              rules: [{
                required: true,
                message: "请输入商品SN码",
                trigger: "blur"
              }]
            },
            {
              label: "用户备注",
              prop: "remarks",
              width:140,
              rules: [{
                required: true,
                message: "请输入商品SN码",
                trigger: "blur"
              }]
            },
            {
              label: "备注说明",
              prop: "note",
              rules: [{
                required: true,
                message: "请输入备注说明",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.sendgoods_add, false),
          viewBtn: this.vaildData(this.permission.sendgoods_view, false),
          delBtn: this.vaildData(this.permission.sendgoods_delete, false),
          editBtn: this.vaildData(this.permission.sendgoods_edit, false)
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
        this.table_key = new Date().getTime();
      },
      rowSave(row, done, loading) {
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          for (const item of data.records) {
            item.domain = this.domain;
          }
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
        todayCount().then(res => {
          this.toadyCount = res.data.data
        })
      }
    }
  };
</script>

<style>
</style>
