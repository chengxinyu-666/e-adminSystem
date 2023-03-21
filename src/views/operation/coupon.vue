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
                   v-if="permission.coupon_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="typeLimitDateForm" slot-scope="{type,disabled}">
        <el-input v-model="form.typeLimitDate" class="input-with-select">
          <el-select ref="selectInput" disabled="true" slot="append" v-model="form.typeLimitDateUnit" style="width: 60px!important">
            <el-option label="年" value="年"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="日" value="日"></el-option>
          </el-select>
        </el-input>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/operation/coupon";
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
          viewBtn: true,
          selection: true,
          labelWidth: 100,
          searchLabelWidth: 100,
          column: [
            {
              label: "id",
              prop: "id",
              display: false,
              rules: [{
                required: true,
                message: "请输入id",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券名称",
              prop: "name",
              span: 24,
              rules: [{
                required: true,
                message: "请输入优惠券名称",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券类别",
              prop: "type",
              type: "select",
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=coupon_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入优惠券类别",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券面额",
              prop: "money",
              rules: [{
                required: true,
                message: "请输入优惠券面额",
                trigger: "blur"
              }]
            },
            {
              label: "发放总量",
              prop: "count",
              rules: [{
                required: true,
                message: "请输入发放总量",
                trigger: "blur"
              }]
            },
            {
              label: "限领数量",
              prop: "countLimit",
              rules: [{
                required: true,
                message: "请输入限领数量",
                trigger: "blur"
              }]
            },
            {
              label: "金额限制",
              prop: "moneyLimit",
              placeholder: "请输入金额限制 0无限制",
              rules: [{
                required: true,
                message: "请输入金额限制 0无限制",
                trigger: "blur"
              }]
            },
            {
              label: "时间限制",
              prop: "dateLimit_none",
              display: false,
              formatter: function(row){
                if(row.dateLimit == 1){
                  return row.startDate + " - " + row.endDate;
                }else if(row.dateLimit == 2){
                  return "自领取"+row.dateLimitDays+"天内使用";
                }
              }
            },
            {
              label: "状态",
              prop: "status",
              type: "radio",
              value: 1,
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=coupon_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "优惠券说明",
              prop: "content",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: "请输入优惠券说明",
                trigger: "blur"
              }]
            },
            {
              label: "有效期限制",
              prop: "dateLimit",
              type: "radio",
              value: 1,
              dicData:[
                {
                  label: "固定时间",
                  value: 1
                },
                {
                  label: "领取时间按天数顺延",
                  value: 2
                }
              ],
              hide: true,
              control:(val)=> {
                if (val === 1) {
                  console.info(1)
                  return {
                    dateLimitDays: {
                      display: false
                    },
                    dateLimitRange: {
                      display: true
                    }
                  }
                } else {
                  console.info(2)
                  return {
                    dateLimitDays: {
                      display: true
                    },
                    dateLimitRange: {
                      display: false
                    }
                  }
                }
              }
            },
            {
              label: "有效期",
              prop: "dateLimitRange",
              type: "daterange",
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              startPlaceholder: '日期开始范围自定义',
              endPlaceholder: '日期结束范围自定义',
              hide: true,
              display: true,
              rules: [{
                required: true,
                message: "请选择有效期",
                trigger: "blur"
              }]
            },
            {
              label: "顺延天数",
              prop: "dateLimitDays",
              hide: true,
              display: false,
              rules: [{
                required: true,
                message: "请输入领取时间顺延天数",
                trigger: "blur"
              }]
            },
            {
              label: "生效条件",
              prop: "typeLimit",
              type:"radio",
              value: 0,
              hide: true,
              dicData:[
                {
                  label: "无限制",
                  value: 0
                },
                {
                  label: "租期未满期数不可使用",
                  value: 1
                },
                {
                  label: "提前付款天数可以使用",
                  value: 2
                }
              ],
              change: ({value,column,item,dic}) => {
                this.$nextTick(function(){
                  if(value == 2) {
                    this.$refs.selectInput.value = "日";
                  }else{
                    this.$refs.selectInput.value = "月";
                  }
                });
              },
              control:(val)=>{
                if(val===0){
                  return {
                    typeLimit:{
                      span: 24,
                    },
                    typeLimitDate : {
                      display: false
                    }
                  }
                }else{

                  return {
                    typeLimit:{
                      span: 12,
                    },
                    typeLimitDate : {
                      display: true
                    }
                  }
                }
              },
            },
            {
              label: "限制日期",
              prop: "typeLimitDate",
              formslot: "true",
              display: true,
              hide: true,
              rules: [{
                required: true,
                message: "请输入限制日期",
                trigger: "blur"
              }]
            },
            {
              label: "适用范围",
              prop: "rangeLimit",
              type:"radio",
              value: 0,
              hide: true,
              dicData:[
                {
                  label: "无限制",
                  value: 0
                },
                {
                  label: "分类限制",
                  value: 1
                },
                {
                  label: "商品限制",
                  value: 2
                }
              ],
              control:(val)=>{
                if(val===0){
                  return {
                    rangeLimit:{
                      span: 24,
                    },
                    categoryIds : {
                      display: false
                    },
                    goodsIds : {
                      display: false
                    }
                  }
                }else if(val===1){
                  return {
                    rangeLimit:{
                      span: 12,
                    },
                    categoryIds : {
                      display: true
                    },
                    goodsIds : {
                      display: false
                    }
                  }
                }else if(val===2){
                  return {
                    rangeLimit:{
                      span: 12,
                    },
                    categoryIds : {
                      display: false
                    },
                    goodsIds : {
                      display: true
                    }
                  }
                }
              },
            },
            {
              label: "选择分类",
              prop: "categoryIds",
              hide: true,
              type: "cascader",
              dataType: "string",
              dicUrl: "/api/blade-goods/goodscategory/tree",
              props: {
                label: "title",
                value: "id"
              },
              emitPath:false,
              multiple: true,
              display: false,
              rules: [{
                required: true,
                message: "请选择分类",
                trigger: "blur"
              }]
            },
            {
              label: "选择商品",
              prop: "goodsIds",
              hide: true,
              type: "select",
              dataType: "string",
              remote: true,
              dicUrl: "/api/blade-goods/goods/select?title={{key}}",
              props: {
                label: "title",
                value: "id"
              },
              emitPath:false,
              multiple: true,
              display: false,
              rules: [{
                required: true,
                message: "请选择商品",
                trigger: "blur"
              }]
            },
            {
              label: "适用人群",
              prop: "clientLimit",
              type: "radio",
              value: 0,
              span: 24,
              hide: true,
              dicData:[
                {
                  label: "所有人",
                  value: 0
                },
                {
                  label: "指定人群",
                  value: 1
                },
                {
                  label: "新用户",
                  value: 2
                },
                // {
                //   label: "自动赠送",
                //   value: 3
                // }
              ],
              control:(val)=>{
                if(val === 1){
                  return {
                    phoneLimit: {
                      display: true
                    }
                  }
                }else{
                  return {
                    phoneLimit: {
                      display: false
                    }
                  }
                }
              }
            },
            {
              label: "手机号码",
              prop: "phoneLimit",
              type: "textarea",
              placeholder: "请输入手机号码以英文逗号','分隔",
              span: 24,
              hide: true,
              display: false,
              rules: [{
                required: true,
                message: "请输入手机号码以英文逗号','分隔",
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
          addBtn: this.vaildData(this.permission.coupon_add, false),
          viewBtn: this.vaildData(this.permission.coupon_view, false),
          delBtn: this.vaildData(this.permission.coupon_delete, false),
          editBtn: this.vaildData(this.permission.coupon_edit, false)
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
        let ds = row.dateLimitRange;
        if(ds != null && ds.length > 0){
          row.startDate = ds[0];
          row.endDate = ds[1];
        }
        if(row.rangeLimit == 1){
          row.rangeIds = row.categoryIds;
        }else if(row.rangeLimit == 2){
          row.rangeIds = row.goodsIds;
        }
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
        let ds = row.dateLimitRange;
        if(ds != null && ds.length > 0){
          row.startDate = ds[0];
          row.endDate = ds[1];
        }
        if(row.rangeLimit == 1){
          row.rangeIds = row.categoryIds;
        }else if(row.rangeLimit == 2){
          row.rangeIds = row.goodsIds;
        }
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
            let data = res.data.data;
            data.dateLimitRange = [data.startDate,data.endDate];

            if(data.rangeLimit == 1){
              data.categoryIds = data.rangeIds;
            }else if(data.rangeLimit == 2){
              data.goodsIds = data.rangeIds;
            }

            this.form = data;
            console.info(this.form);
          });
        }
        if(this.form.typeLimitDateUnit == null){
          this.form.typeLimitDateUnit = "月";
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
