<template>
  

    <basic-container>
      <div>用户看的页面</div>
      <avue-crud :option="option"
                 :table-loading="loading"
                 :data="data"
                 ref="crud"
                 v-model="form"
                 :permission="permissionList"
                 :search.sync="search" 
                
                 :before-open="beforeOpen"
                 :page="page"
                 @search-change="searchChange"
                 @search-reset="searchReset"
                 @selection-change="selectionChange"
                 @current-change="currentChange"
                 @size-change="sizeChange"
                 @refresh-change="refreshChange"
                 @on-load="onLoad">
                 <template slot-scope="scope" slot="menuLeft">
    <el-button type="primary" 
      size="small"
      @click="rechargeFun()">充值</el-button>
  </template>
      </avue-crud>

    </basic-container>
  </template>
  
  <script>
    import {
      getList,
      getUser,  
    } from "@/api/system/user";
    import {getDeptTree} from "@/api/system/dept";
    import {getRoleTree} from "@/api/system/role";
    import {getPostList} from "@/api/system/post";
 
    import website from '@/config/website'; 
  
    export default {
      data() {
       
       
        return {
          form: {},
          search:{},  
          loading: true,
          // selectionList: [],
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
            selection: false,
            viewBtn: true,
            addBtn:false,
            menu:false,
            column: [
              {
                label: "登录账号",
                prop: "account",
                search: true,
                rules: [{
                  required: true,
                  message: "请输入登录账号",
                  trigger: "blur"
                }],
                span: website.tenantMode ? 12 : 24,
              },
              
           
              {
                label: "用户昵称",
                prop: "name",
                rules: [{
                  required: true,
                  message: "请输入用户昵称",
                  trigger: "blur"
                }]
              }, 
              
             
              {
                label: "ID",
                prop: "code",
                hide: true,
              },
       
             
              {
                label: "日期",
                prop: "date",
                hide: true,
              },
       
              {
                label: "费用明细",
                prop: "expense", 
              },
              {
                label: "费用类型",
                prop: "expenseType", 
              },
              {
                label: "关联订单号",
                prop: "orderNumber", 
              },
             
              {
                label: "客户姓名",
                prop: "CustomerName",  
              },
              {
                label: "关联商品",
                prop: "aboutShop",  
              }
            ]
          },
          data: [], 
       
        };
      },
  
      methods: {
       
        rechargeFun(){
          this.$router.push('/account/recharge')
          //跳到充值页面
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
        
       
        beforeOpen(done, type) {
          if (["edit", "view"].includes(type)) {
            getUser(this.form.id).then(res => {
              this.form = res.data.data;
              if(this.form.hasOwnProperty("deptId")){
                this.form.deptId = this.form.deptId.split(",");
              }
              if(this.form.hasOwnProperty("roleId")){
                this.form.roleId = this.form.roleId.split(",");
              }
              if(this.form.hasOwnProperty("postId")){
                this.form.postId = this.form.postId.split(",");
              }
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
          getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
            const data = res.data.data;
            this.page.total = data.total;
            this.data = data.records;
            this.loading = false;
          });
          getDeptTree(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "deptId");
            column.dicData = res.data.data;
            if (column!=-1){
              this.$Log.primary(JSON.stringify(column))
              column.dicData = res.data.data;
            }
          });
          getRoleTree(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "roleId");
            column.dicData = res.data.data;
            if (column!=-1){
              this.$Log.primary(JSON.stringify(column))
              column.dicData = res.data.data;
            }
          });
          getPostList(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "postId");
            if (column!=-1){
              this.$Log.primary(JSON.stringify(column))
              column.dicData = res.data.data;
            }
          });
        }
      }
    };
  </script>
  
  <style>
  </style>
  