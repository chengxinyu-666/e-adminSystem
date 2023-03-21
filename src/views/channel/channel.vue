<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :search.sync="search"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               :page="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-refresh"
                   @click="handleReset">密码重置
        </el-button>
      </template>
      <template slot="inComeRate" slot-scope="scope">
        <div >
          {{orderExamineNum(scope.row)}}
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {
    getChannelList,
    getUser,
    remove,
    update,
    addChannel,
    resetPassword
  } from "@/api/system/user";
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import {getToken} from '@/util/auth';
  import moment from "moment";
  import {toFixed} from "../../constant/goods/constant";

  export default {
    data() {
      return {
        form: {},
        search:{},
        roleBox: false,
        excelBox: false,
        loading: true,
        selectionList: [],
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        init: {
          roleTree: [],
          deptTree: [],
        },
        props: {
          label: "title",
          value: "key"
        },
        roleGrantList: [],
        roleTreeObj: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          column: [
            {
              label: "渠道名称",
              prop: "realName",
              search: true,
              searchSpan:4,
              span: 12,
              rules: [{
                required: true,
                message: "请输入渠道名称",
                trigger: "blur"
              }]
            },
            {
              label: "登录账号",
              prop: "account",
              width:100,
              rules: [{
                required: true,
                message: "请输入登录账号",
                trigger: "blur"
              }],
              span: 12,
            },
            {
              label: "手机号码",
              width:120,
              prop: "phone",
              span: 12,
              rules: [{
                required: true,
                message: "请输入手机号",
                trigger: "blur"
              }],
              overHidden: true
            },
            {
              label: "所属资方",
              prop: "tenantId",
              type: "tree",
              dicUrl: "/api/blade-system/tenant/select",
              props: {
                label: "tenantName",
                value: "tenantId"
              },
              hide: !website.tenantMode,
              addDisplay: website.tenantMode,
              editDisplay: website.tenantMode,
              viewDisplay: website.tenantMode,
              searchSpan:6,
              search: true,
              rules: [{
                required: true,
                message: "请输入所属资方",
                trigger: "click"
              }]
            },
            {
              label: '时间',
              prop: 'createTime',
              type: 'daterange',
              searchSpan:8,
              addDisplay:false,
              editDisplay: false,
              searchRange:true,
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              hide:true,
              search:true,
            },
            {
              label: "渠道状态",
              prop: "status",
              type: "select",
              addDisplay:false,
              editDisplay: false,
              dicUrl: "/api/blade-system/dict/dictionary?code=channel_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "点击数量",
              addDisplay:false,
              editDisplay: false,
              prop: "clickNum",
            },
            {
              label: "注册数量",
              addDisplay:false,
              editDisplay: false,
              prop: "clientNum",
            },
            {
              label: "初始化订单",
              addDisplay:false,
              editDisplay: false,
              width:90,
              prop: "orderInitNum",
            },
            {
              label: "总订单",
              addDisplay:false,
              editDisplay: false,
              prop: "orderFreezeNum",
            },
            {
              label: "总签合同",
              width:90,
              addDisplay:false,
              editDisplay: false,
              prop: "orderSignNum",
            },
            {
              label: "总发货数",
              addDisplay:false,
              editDisplay: false,
              prop: "orderSendNum",
            },
            {
              label: "逾期数量",
              addDisplay:false,
              editDisplay: false,
              prop: "orderOverdueNum",
            },
            {
              label: "申请数",
              addDisplay:false,
              editDisplay: false,
              prop: "orderExamineNum",
            },
            {
              label: "通过率",
              addDisplay:false,
              editDisplay: false,
              prop: "orderExamineOkNum",
            },
            {
              label: "进件率",
              addDisplay:false,
              editDisplay: false,
              prop: "inComeRate",
              slot: true,
            }
          ]
        },
        data: [],
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.user_add, false),
          viewBtn: this.vaildData(this.permission.user_view, false),
          delBtn: this.vaildData(this.permission.user_delete, false),
          editBtn: this.vaildData(this.permission.user_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    methods: {
      orderExamineNum(row){
        var clickNum = row.clickNum==""?0:row.clickNum;
        return toFixed(Number.parseFloat(clickNum)<=0?0:(Number.parseFloat(row.orderExamineNum)/Number.parseFloat(clickNum)),2)+"%";
      },
      rowSave(row, done, loading) {
        delete row.createTime;
        addChannel(row).then(() => {
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
        delete row.createTime;
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
      handleReset() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择账号密码重置为123456?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return resetPassword(this.ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getUser(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
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
        getChannelList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          for(var item of this.data){
            item.clickNum = item.clickNum == ""?0:item.clickNum
          }
          this.loading = false;
        });
      }
    }
  };
</script>

<style scoped>

  :deep .avue-crud__pagination{
    padding: 0px 0 0px 10px !important;
  }

  :deep .el-col {
    margin-bottom: 0px !important;
  }

  :deep .avue-crud__right{
    display: none !important;
  }

  :deep .avue-crud__search .el-form-item--mini.el-form-item, .avue-crud__search .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
</style>

