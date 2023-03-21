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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.banner_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList as getGoodsList} from "@/api/goods/goods";
  import {getList, getDetail, add, update, remove} from "@/api/operation/banner";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
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
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "图片",
              prop: "image",
              span: 24,
              type: 'upload',
              listType: 'picture-img',
              propsHttp: {
                home: this.$store.state.common.cloudDomain,
                res: "data",
                url: 'name',
                name: 'originalName'
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              rules: [{
                required: true,
                message: "请上传图片",
                trigger: "blur"
              }]
            },
            {
              label: "商品",
              prop: "goodsId",
              type: "table",
              span: 24,
              dicUrl: "/api/blade-goods/goods/select",
              children: {
                border: true,
                column: [{
                  label: '标题',
                  search:true,
                  prop: 'title'
                }, {
                  label: '上架状态',
                  prop: 'shelves',
                  type: 'select',
                  search:true,
                  dicUrl: "/api/blade-system/dict/dictionary?code=goods_status",
                  props: {
                    label: "dictValue",
                    value: "dictKey"
                  },
                }],
              },
              onLoad: ({ page, value, data }, callback) => {
                const param = {};
                console.info(param);
                if(page == null){
                  page = {
                    "currentPage" : 1,
                    "pageSize" : 10
                  };
                }
                if(value){
                  param.id = value;
                }
                getGoodsList(page.currentPage, page.pageSize, Object.assign(param,data)).then(res => {
                  const data = res.data.data;
                  if(value) {
                    const obj = data.records[0];
                    if(obj) {
                      callback(obj);
                    }else{
                      callback({
                        "title":"",
                        "id":""
                      });
                    }
                  }else{
                    callback({
                      "total": data.total,
                      "currentPage": page.currentPage,
                      "data": data.records
                    });
                  }
                });
              },
              props: {
                label: 'title',
                value: 'id'
              },
              rules: [{
                required: true,
                message: "请选择商品",
                trigger: "blur"
              }]
            },
            {
              label: "背景色",
              prop: "color",
              type: "color",
              colorFormat:"hex",
              showAlpha:false,
              rules: [{
                required: true,
                message: "请选择背景色",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              rules: [{
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              display: false
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
          addBtn: this.vaildData(this.permission.banner_add, false),
          viewBtn: this.vaildData(this.permission.banner_view, false),
          delBtn: this.vaildData(this.permission.banner_delete, false),
          editBtn: this.vaildData(this.permission.banner_edit, false)
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
        row.location = "index_top";
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
        params.location = "index_top";
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
