<template>
  <basic-container>
    <div>管理员看到的</div>
    <avue-crud
      :option="option"
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
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          v-if="permission.customer_delete"
          @click="handleDelete"
          >删 除
        </el-button>
      </template>
      <template slot-scope="{ row, index }" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="small"
          @click="changeamountDialog(row)"
          >充值余额</el-button
        >
      </template>
    </avue-crud>

    <el-dialog title="充值金额" :visible.sync="dialogFormVisible">
      <el-form :model="newFrom"    :inline="true">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input
            v-model="newFrom.id"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="充值金额"
          placeholder="请输入金额"
          :rules="[
            { required: true, message: '金额不能为空' },
            { type: 'number', message: '金额必须为数字值' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newFrom.balance"
            autocomplete="off"
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0{1,}/g,'')"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeamountFun()">修 改</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  recharge,
} from "@/api/customer/customer";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      newFrom: {
        balance: "",
        id: "",
      },
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      dialogFormVisible: false,
      option: {
        height: "auto",
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        column: [
          {
            label: "ID",
            prop: "id",
            display: false,
            search: true,
            rules: [
              {
                required: true,
                message: "请输入主键",
                trigger: "blur",
              },
            ],
          },
          {
            label: "客户名称",
            prop: "name",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入客户名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "AppKey",
            prop: "appKey",
            display: false,
            rules: [
              {
                required: true,
                message: "请输入AppKey",
                trigger: "blur",
              },
            ],
          },
          {
            label: "余额",
            prop: "balance",
            display: false,
            rules: [
              {
                required: true,
                message: "请输入余额",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.customer_add, false),
        viewBtn: this.vaildData(this.permission.customer_view, false),
        delBtn: this.vaildData(this.permission.customer_delete, false),
        editBtn: this.vaildData(this.permission.customer_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    changeamountDialog(row) {
      this.dialogFormVisible = true;
      this.newFrom.balance = row.balance;
      this.newFrom.id = row.id;
    },
    changeamountFun( ) { 
      if (this.newFrom.balance=='') {
        return this.$message('金额为必填项')
      }
      
      recharge({id:this.newFrom.id,amount:this.newFrom.balance}).then(
        (res) => {  
          if(res.data.code==200){
            this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.dialogFormVisible=false;
          this.onLoad(this.page);
          }
        
        },
        (error) => {
          window.console.log(error); 
        }
      );

    },
    
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
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
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then((res) => {
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => { 
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
  },
};
</script>

<style></style>
