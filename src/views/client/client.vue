<template>
  <basic-container>
    <avue-crud :option="option"
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

      </template>
      <template slot-scope="{row,index}" slot="menu">
        <el-button type="text"
                   size="small"
                   v-if="permission.client_edit && row.isDisabled == 0"
                   @click="changeStatus(row,1)">拉黑
        </el-button>
        <el-button type="text"
                   size="small"
                   v-if="permission.client_edit && row.isDisabled == 1"
                   @click="changeStatus(row,0)">启用
        </el-button>
        <el-button type="text"
                   size="small"
                   v-if="permission.clientauth_view && row.isAuth == 1"
                   @click="showDialogPage(row,'clientAuth')">查看资料
        </el-button>
        <el-button type="text"
                   size="small"
                   v-if="permission.clientrisk_view && row.isAuth == 1"
                   @click="showDialogPage(row,'clientRisk')">风控报告
        </el-button>
<!--        <el-button type="text"-->
<!--                   size="small"-->
<!--                   v-if="permission.clientcredit_view && row.isAuth == 1"-->
<!--                   @click="showDialogPage(row,'clientCredit')">征信报告-->
<!--        </el-button>-->
      </template>
    </avue-crud>
    <template>
      <el-dialog :title="clientAuthPain.title"
                 :visible.sync="clientAuthPain.visible"
                 width="80%"
                 append-to-body="true"
                 :before-close="beforeCloseDialog">
        <client-auth :clientId="form.id"></client-auth>
      </el-dialog>
      <el-dialog :title="clientRiskPain.title"
                 :visible.sync="clientRiskPain.visible"
                 width="80%"
                 append-to-body="true"
                 :before-close="beforeCloseDialog">
        <client-risk :clientId="form.id"></client-risk>
      </el-dialog>
      <el-dialog :title="clientCreditPain.title"
                 :visible.sync="clientCreditPain.visible"
                 width="80%"
                 append-to-body="true"
                 :before-close="beforeCloseDialog">
        <client-credit :clientId="form.id"></client-credit>
      </el-dialog>
    </template>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/client/client";
  import ClientAuth from "./clientauth";
  import ClientRisk from "../order/clientrisk";
  import ClientCredit from "../order/clientcredit";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        clientAuthPain: {title: "", visible: false},
        clientRiskPain: {title: "", visible: false},
        clientCreditPain: {title: "", visible: false},
        loading: true,
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
          index: true,
          delBtn:false,
          addBtn: false,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "头像",
              span: 24,
              prop: "headImage",
              type: "img",
              fileType: "img",
              alone: true
            },
            {
              label: "昵称",
              prop: "nickname"
            },
            {
              label: "手机号码",
              prop: "phone",
              search: true,
              rules: [{
                required: true,
                message: "请输入手机号码",
                trigger: "blur"
              }]
            },
            {
              label: "通过时间",
              prop: "authTime",
              rules: [{
                required: true,
                message: "请输入审核通过时间",
                trigger: "blur"
              }]
            },
            {
              label: "实名认证",
              prop: "isAuth",
              type: "select",
              search: true,
              dicData: [
                {
                  label: "未认证",
                  value: 0
                },
                {
                  label: "已认证",
                  value: 1
                }
              ],
            },
            {
              label: "状态",
              prop: "isDisabled",
              type: "select",
              search: true,
              dicData: [
                {
                  label: "正常",
                  value: 0
                },
                {
                  label: "拉黑",
                  value: 1
                }
              ],
            },
            {
              label: "人脸认证",
              prop: "faceAuth",
              type: "select",
              search: true,
              dicData: [
                {
                  label: "未认证",
                  value: 0
                },
                {
                  label: "已认证",
                  value: 1
                }
              ],
            },
            // {
            //   label: "渠道",
            //   prop: "channel",
            // },
          ]
        },
        data: []
      };
    },
    components: {
      ClientAuth,
      ClientRisk,
      ClientCredit
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.client_add, false),
          viewBtn: this.vaildData(this.permission.client_view, false),
          delBtn: this.vaildData(this.permission.client_delete, false),
          editBtn: this.vaildData(this.permission.client_edit, false)
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
      changeStatus(row,status){
        this.$confirm(status==1?"您确定要拉黑该用户吗？":"您确定要将该用户移出黑名单吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.isDisabled = status;
            update(row).then(()=>{
              this.onLoad(this.page);
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
          });
      },
      beforeCloseDialog(done) {
        done();
      },
      showDialogPage(row, type) {
        this.form = row;
        if (type == 'clientAuth') {
          this.clientAuthPain.visible = true;
          this.clientAuthPain.title = row.nickname + " - 认证信息";
        }
        if (type == 'clientRisk') {
          this.clientRiskPain.visible = true;
          this.clientRiskPain.title = row.nickname + " - 风控报告";
        }
        if (type == 'clientCredit') {
          this.clientCreditPain.visible = true;
          this.clientCreditPain.title = row.nickname + " - 征信报告";
        }
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
 :deep .el-card__body {
    padding-top: 10px !important;
  }

</style>
