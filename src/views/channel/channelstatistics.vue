<template>
  <basic-container>
    <avue-crud :option="options"
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
                   v-if="false"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template #menu="{row,index,size}">
        <div style="width: 100%;display: flex;flex-wrap: wrap;align-items: center;flex-direction: row;justify-content: center;">
<!--          <el-button type="text" icon="el-icon-view" size="mini" @click="$refs.crud.rowView(row,index)">查看</el-button>-->
          <el-popover
            placement="top-start"
            title="渠道二维码"
            width="200"
            trigger="click">
            <div  style="width: 180px">
             <img style="width: 180px" :src="row.qrCodeUrl"/>
            </div>
            <el-button slot="reference" type="text" icon="el-icon-picture-outline" size="mini" >查看二维码</el-button>
          </el-popover>

          <el-button type="text" icon="el-icon-delete" size="mini" @click="$refs.crud.rowDel(row,index)">删除</el-button>
        </div>
      </template>
      <template slot="url" slot-scope="scope">
          <span data-clipboard-action="copy"
                :data-clipboard-text="scope.label" class="hand name-color one_line" :class="'cl'+scope.row.id"
                @click="copy('cl'+scope.row.id)">点击复制 {{ scope.label}}</span>
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
  import {getList, getDetail, add, update, remove} from "@/api/channel/channel";
  import {mapGetters} from "vuex";
  import Clipboard from 'clipboard';
  import moment from "moment";
  import {toFixed} from "../../constant/goods/constant";
  import {dictionary} from "../../api/system/dict";
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
        data: []
      };
    },
    created() {
     console.log(this.userInfo)
    },
    computed: {
      ...mapGetters(["userInfo","permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.channelstatistics_add, false),
          viewBtn: this.vaildData(this.permission.channelstatistics_view, false),
          delBtn: this.vaildData(this.permission.channelstatistics_delete, false),
          editBtn: this.vaildData(this.permission.channelstatistics_edit, false)
        };
      },
      options() {
        var options = {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          menuWidth:180,
          dialogWidth:40,
          tip: false,
          border: true,
          index: true,
          viewBtn: false,
          editBtn:false,
          delBtn:false,
          addBtn:this.userInfo.authority.includes('channel'),
          selection: true,
          column: [
            {
              label: "渠道商",
              prop: "realName",
              addDisplay:false,
              editDisplay: false,
              search: true,
              rules: [{
                required: true,
                message: "请输入渠道创建者",
                trigger: "blur"
              }]
            },
            {
              label: '时间',
              prop: 'createTime',
              type: 'daterange',
              searchSpan:8,
              searchRange:true,
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              addDisplay:false,
              editDisplay: false,
              hide:true,
              search:true,
            },
            {
              label: "链接名称",
              prop: "name",
              addDisplay:true,
              editDisplay: true,
              rules: [{
                required: true,
                message: "请输入渠道code",
                trigger: "blur"
              }]
            },
            {
              label: "渠道链接",
              prop: "url",
              width:200,
              addDisplay:false,
              editDisplay: false,

              rules: [{
                required: true,
                message: "请输入链接名称",
                trigger: "blur"
              }]
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
        };
        if(!this.userInfo.tenantId.includes('000000')){
          options.column = options.column.filter(item => {
            if(item.prop == 'realName'){
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
    methods: {
      orderExamineNum(row){
        var clickNum = row.clickNum==""?0:row.clickNum;
        return toFixed(Number.parseFloat(clickNum)<=0?0:(Number.parseFloat(row.orderExamineNum)/Number.parseFloat(clickNum)),2)+"%";
      },
      copy(bt){
        let clipboard = new Clipboard("."+bt);
        clipboard.on('success', e => {
          this.$message({
            type: "success",
            message: "复制成功!"
          });
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          this.$message({
            type: "success",
            message: "该浏览器不支持自动复制!"
          });
          clipboard.destroy()
        })
      },
      rowSave(row, done, loading) {
        delete row.createTime;
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
        if (this.query.createTime&&this.query.createTime.length == 2){
          this.query.beginCreateTime = moment(this.query.createTime[0]+" 00:00:00").format('YYYY-MM-DD HH:mm:ss');
          this.query.endCreateTime = moment(this.query.createTime[1]+" 23:59:59").format('YYYY-MM-DD HH:mm:ss');
          delete this.query.createTime;
        }
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          for(var item of this.data){
            item.clickNum = item.clickNum == ""?0:item.clickNum
          }
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style scoped>
  .one_line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
