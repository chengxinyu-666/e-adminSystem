<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="getTab(item)" :name="item.keyName" v-for="(item,index) of tabs"></el-tab-pane>
    </el-tabs>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :key="table_key"
               :permission="permissionList"
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
                   icon="el-icon-plus"
                   v-if="permission.goods_add"
                   @click="handleAdd">新增
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.goods_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template #menu="{row,index,size}">
        <el-button type="text" icon="el-icon-view" @click="rowView(row,index)">查看</el-button>
        <el-button type="text" icon="el-icon-edit"  @click="rowEdit(row,index)">编辑</el-button>
        <el-button type="text" icon="el-icon-delete" @click="$refs.crud.rowDel(row,index)">删除</el-button>
      </template>
      <template slot="title" slot-scope="scope">
        <div style="display: inline-flex;" v-if="scope.row.photoCover">
          <img :src="photo(scope.row.photoCover)" style="width: 100px;height: auto"/>
          <span style="margin-left: 10px">{{ scope.label }}</span>
        </div>
      </template>
      <template slot="plansName" slot-scope="{row,index}">
        <div v-for="tag in row.plansName.split(',')" >
          <el-tag v-if="row.plansName.length>0" style="margin-top: 5px;margin-bottom: 5px">{{tag}}</el-tag>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getDetail, add, update, remove,getList} from "@/api/goods/goods";
  import {mapGetters} from "vuex";
  import Layout from "../../router/views";
  import {dictionary} from "../../api/system/dict";
  import {tabs} from "../../api/goods/goods";

  export default {
    data() {
      return {
        table_key:0,
        form: {},
        query: {},
        loading: true,
        activeName:"全部",
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        tabs: {},
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          addBtn:false,
          tip: false,
          border: true,
          index: false,
          viewBtn: false,
          editBtn:false,
          delBtn:false,
          selection: true,
          column: [
            {
              label: "商品编号",
              slot: true,
              prop: "id",
              width: 160,
            },
            {
              label: "商品名称",
              slot: true,
              prop: "title",
              width: 300,
            },
            {
              label: "商品类目",
              prop: "categoryName",
            },
            {
              label: "租赁方案",
              prop: "plansName",
              width: 160,
            },
            {
              label: "总价系数",
              prop: "totalPricesRate",
            },
            {
              label: "上架状态",
              prop: "shelves",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=goods_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            }
          ]
        },
        data: []
      };
    },
    created() {
      tabs().then(res => {
        this.tabs = res.data.data
        console.log(this.tabs)
      })
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.goods_add, false),
          viewBtn: this.vaildData(this.permission.goods_view, false),
          delBtn: this.vaildData(this.permission.goods_delete, false),
          editBtn: this.vaildData(this.permission.goods_edit, false)
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
      getTab(item){
        return " "+item.keyName+"（"+item.count+"）"
        // return key+"（"+item[key].count+"）"
      },
      photo(url){
        return this.$store.state.common.cloudDomain+url;
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
      handleAdd(){
        this.$router.push({
          path: "/goods/add/index",
          query: {
            add:null
          },
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
      rowView(row,index){
        console.log(row,index)
        this.$router.push({
          path: "/goods/view/index",
          query: {
            goodsId : row.id,
          },
        });
      },
      rowEdit(row,index){
        this.$router.push({
          path: "/goods/add/index",
          query: {
            goodsId : row.id,
            edit:null
          },
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
      handleClick(tab, event) {
        this.page.currentPage = 1
        if (this.tabs[tab.index].shelves){
          this.query = {shelves:this.tabs[tab.index].shelves};
        }else{
          this.query = {};
        }

        this.table_key = new Date().getTime();
      },
      onLoad(page, params = {}) {
        this.loading = true;
        console.log(this.query)
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

<style scoped="scoped">

</style>
