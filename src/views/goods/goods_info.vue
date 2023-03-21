<template>
  <div style="height: 100%;">
    <div v-loading="loading" style="height:100%;width:100%;z-index: 100;position: absolute" v-if="loading"></div>
    <div>
      <el-form ref="form1" :model="sales" label-width="120px" size="small">
        <el-card class="basis-info" style="margin-top: 0px !important;">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
          </div>
          <div class="form-view" style="width: 1000px;">
            <el-row>
              <el-col :span="8">
                <img :src="photo(goodsInfo.photoCover)" style="width: 100%;height: auto;"/>
              </el-col>
              <el-col :span="16">
                <div class="goods_info" >
                  <el-form-item label="商品标题：" prop="userNameCn">
                    {{goodsInfo.title}}
                  </el-form-item>
                  <el-form-item label="状态：" prop="userNameCn">
                    {{goodsInfo.statusName}}
                  </el-form-item>
                  <el-form-item label="商品类目：" prop="userNameCn">
                    {{goodsInfo.tags}}
                  </el-form-item>
                  <el-form-item label="营销语句：" >
                    {{goodsInfo.marketing}}
                  </el-form-item>
                  <el-form-item label="商品成色：" prop="userNameCn">
                    {{goodsInfo.secondHand}}
                  </el-form-item>
                  <el-form-item label="类目标签：" >
                    {{goodsInfo.category}}
                  </el-form-item>
                  <el-form-item label="库存(件)：" >
                    {{goodsInfo.inventory==0?"暂无库存":goodsInfo.inventory}}
                  </el-form-item>
                  <el-form-item label="营销角标：" >
                    {{goodsInfo.marketingCornerMark}}
                  </el-form-item>
                  <el-form-item label="增值服务：" prop="userNameCn">
                    {{goodsInfo.extraServiceName}}
                  </el-form-item>
                  <el-form-item label="归还地址：" prop="userNameCn">
                    {{goodsInfo.address}}
                  </el-form-item>
                  <el-form-item label="租赁说明：" prop="userNameCn">
                    {{goodsInfo.rentInfo}}
                  </el-form-item>
                  <el-form-item label="售后维修说明：" prop="userNameCn">
                    {{goodsInfo.maintainInfo}}
                  </el-form-item>
                  <el-form-item label="添加时间：" >
                    {{goodsInfo.createTime}}
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="basis-info" style="margin-top: 10px !important;">
          <div slot="header" class="clearfix">
            <span>销售规格</span>
          </div>
          <div>
            <avue-crud :key="table_key"  ref="crud" :option="option" :data="plans"
                       :header-cell-class-name="headerClassName" :span-method="spanMethod" @row-update="addUpdate"
                       @row-save="rowSave" @row-click="handleRowClick" :cell-class-name="cellClassName">
              <template slot="packageName" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification1" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification2" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification3" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification4" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification5" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <!--        官网价-->
              <template slot="websitePrice" slot-scope="scope">
                <span>{{ scope.label }}</span>
              </template>
              <!--        最低租期-->
              <template slot="miniLease" slot-scope="scope">
                <span>{{ scope.label }}</span>
              </template>

              <!--        每一期租金-->
              <template slot="stockout" slot-scope="scope">
                <span>{{ scope.label?"是":"否"}}</span>
              </template>

              <!--        每一期租金-->
              <template slot="rentMoney" slot-scope="scope">
                <span>{{ calculateRentMoney(scope.row) }}</span>
              </template>
              <!--        买断尾款-->
              <template slot="buyoutMoney" slot-scope="scope">
                <span>{{ calculateBuyoutMoney(scope.row) }}</span>
              </template>
              <!--        滞纳金-->
              <template slot="lateFeeMoney" slot-scope="scope">
                <span>{{ calculateLateFeeMoney(scope.row) }}</span>
              </template>
              <template slot="inventory" slot-scope="scope">
           <span>
              {{scope.row.inventory==0?"暂无库存":scope.row.inventory}}
           </span>
              </template>
            </avue-crud>
          </div>
        </el-card>
        <el-card class="basis-info" style="margin-top: 10px !important;">
          <div slot="header" class="clearfix">
            <span>详情</span>
          </div>
          <div>
            <el-form-item label="轮播图片：" prop="userNameCn">
              <div style="display: inline" v-if="goodsInfo.photoSlideshow" v-for="item in goodsInfo.photoSlideshow.split(',')">
                <img :src="photo(item)" style="width: 200px;height: auto;"/>
              </div>
            </el-form-item>
            <el-form-item label="详情图片：" prop="userNameCn">
              <div style="display: inline" v-if="goodsInfo.photoDetails" v-for="item in goodsInfo.photoDetails.split(',')">
                <img :src="photo(item)" style="width: 200px;height: auto;"/>
              </div>
            </el-form-item>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getDetail} from "@/api/goods/goods";
  import {categoryTree, getList} from "../../api/goods/goodscategory";
  import {dictionary} from "../../api/system/dict";
  import {getList as getExtraserviceList} from "../../api/goods/extraservice";
  import {getList as getReturnAddressList} from "../../api/goods/returnaddress";
  import {getAllList as getMaintaininfoList} from "../../api/operation/maintaininfo";
  import {getAllList as getRentinfoList} from "../../api/operation/rentinfo";
  import {Base64} from 'js-base64';
  import {getToken} from '../../util/auth'
  import website from '../../config/website';
  import {
    defaultBuyout,
    defaultFlexible,
    defaultPlanInfo,
    defaultReturn,
    goodsPlanInfo
  } from "../../constant/goods/constant";
  import {saveOrUpdate} from "../../api/goods/goods";

  export default {
    name: "wel",
    data() {
      return {
        loading:false,
        goodsId:null,
        goodsInfo: {},
        plans: [],
        spanArr: [],
        usePlan:0,
        columns: ["packageName", "specification1", "specification2","specification3","specification4","specification5"],
        specifications:[],
      }
    },
    watch: {
    },
    methods: {
      photo(url){
        return this.$store.state.common.cloudDomain+url;
      },
      checkNumber(val){
        return parseFloat(val).toString() != "NaN";
      },
      calculateRentMoney(row){
        console.log(row)
        if (this.checkNumber(this.goodsInfo.totalPricesRate)&&this.checkNumber(row.websitePrice)&&this.checkNumber(row.rentRate)&&this.checkNumber(row.buyoutBalancePayment)){
          var totalPricesRate = parseFloat(this.goodsInfo.totalPricesRate)
          var websitePrice = parseFloat(row.websitePrice)
          var rentRate = parseFloat(row.rentRate)
          var buyoutBalancePayment = parseFloat(row.buyoutBalancePayment)
          if (row.packageName.type == 1){
            return (totalPricesRate*websitePrice*rentRate/12).toFixed(2)
          } else if (row.packageName.type == 2){
            return (totalPricesRate*websitePrice*rentRate/12).toFixed(2)
          } else if (row.packageName.type == 3){
            return ((totalPricesRate*websitePrice-buyoutBalancePayment)*rentRate/12).toFixed(2)
          }
        }
        return ""
      },
      calculateBuyoutMoney(row){
        console.log(row)
        if (this.checkNumber(this.goodsInfo.totalPricesRate)&&this.checkNumber(row.websitePrice)&&this.checkNumber(row.rentRate)&&this.checkNumber(row.miniLease)&&this.checkNumber(row.buyoutBalancePayment)){
          var totalPricesRate = parseFloat(this.goodsInfo.totalPricesRate)//总价系数
          var websitePrice = parseFloat(row.websitePrice)//官网价
          var rentRate = parseFloat(row.rentRate)//租金系数
          var miniLease = parseFloat(row.miniLease)//最低租期
          var buyoutBalancePayment = parseFloat(row.buyoutBalancePayment)
          if (row.packageName.type == 1){
            return (totalPricesRate*websitePrice - (totalPricesRate*websitePrice*rentRate)).toFixed(2)
          } else if (row.packageName.type == 2){
            return (totalPricesRate*websitePrice - (totalPricesRate*websitePrice*rentRate)).toFixed(2)
          } else if (row.packageName.type == 3){
            return (totalPricesRate*websitePrice-((totalPricesRate*websitePrice-buyoutBalancePayment)*rentRate/12*miniLease)+buyoutBalancePayment).toFixed(2)
          }
        }
        return ""
      },
      calculateLateFeeMoney(row){
        if (this.checkNumber(this.goodsInfo.totalPricesRate)&&this.checkNumber(row.websitePrice)&&this.checkNumber(row.rentRate)&&this.checkNumber(row.buyoutBalancePayment)&&this.checkNumber(row.lateFeeMoney)){
          var totalPricesRate = parseFloat(this.goodsInfo.totalPricesRate)
          var websitePrice = parseFloat(row.websitePrice)
          var rentRate = parseFloat(row.rentRate)
          var lateFeeMoney = parseFloat(row.lateFeeMoney)
          var buyoutBalancePayment = parseFloat(row.buyoutBalancePayment)
          if (row.packageName.type == 1){
            return (totalPricesRate*websitePrice/365*lateFeeMoney).toFixed(2)
          } else if (row.packageName.type == 2){
            return (totalPricesRate*websitePrice/365*lateFeeMoney).toFixed(2)
          } else if (row.packageName.type == 3){
            return (totalPricesRate*websitePrice/365*lateFeeMoney).toFixed(2)
          }
        }
      },
      headerClassName({row, column, rowIndex, columnIndex}) {
        return "head-class"
      },
      spanMethod({row, column, rowIndex, columnIndex}) {
        if (!this.spanArr||this.spanArr.length == 0){
          return {
            rowspan: 1,
            colspan: 1
          }
        }
        const _row = this.spanArr[Number.parseInt(rowIndex)][column.property];
        console.log(_row)
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      },
      rowspan() {
        // this.spanArr = [[3,2,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        this.spanArr.splice(0);
        var proKeys = "";
        this.plans.forEach((item, index) => {
          var data = {
            "packageName": 1,
            "stockout": 1,
            "inventory": 1,
            "websitePrice": 1,
            "premiumMoney": 1,
            "rentRate": 1,
            "depositMoney": 1,
            "miniLease": 1,
            "rentMoney": 1,
            "buyoutMoney": 1,
            "lateFeeMoney": 1
          };
          console.log("======",item)
          var items = [];
          for (let index  in  this.specifications){
            var  one = this.specifications[index]
            if (one.name&&one.name.length>0&&one.isGroup == true){
              items.push(one.attr)
            }
          }
          this.usePlan = items.length;
          for (let i = 0; i < this.usePlan; i++) {
            data['specification'+(i+1)] = 1
          }
          this.spanArr.push(data)

          Object.keys(item).forEach((second, index2) => {
            if (this.columns.indexOf(second) != -1)
              proKeys = proKeys + item[second].name;
          })
          if (index > 0) {
            var keys = "";
            Object.keys(item).forEach((second, index2) => {
              if (this.columns.indexOf(second) != -1) {
                keys = keys + item[second].name;
                if (this.plans[index][second].name === this.plans[index - 1][second].name && proKeys.startsWith(keys)) {
                  for (let i = index; i > 0; i--) {
                    if (this.spanArr[i - 1][second] != 0) {
                      this.spanArr[i - 1][second] += 1;
                      break;
                    }
                  }
                  this.spanArr[index][second] = 0;
                } else {
                  this.spanArr[index][second] = 1;
                }
              }
            })
            proKeys = keys;
          }
        })
        console.log("++",this.spanArr)
      },
    },
    mounted() {

    },
    computed: {
      option: function (){
        var option = {
          rowKey:'rowKey',
          addBtn: false,
          searchBtn: false,
          border: true,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          editBtn:false,
          addRowBtn:false,
          cellBtn:false,
          cancelBtn:false,
          headerAlign: 'center',
          align: 'center',
          menu:false,
          column: []
        }
        option.column.push( {width: 100,label: '套餐',prop: 'packageName',cell: true,slot: true,})
        var number = 0;
        for (let index in this.specifications) {
          var item = this.specifications[index]
          if (item.name&&item.name.length>0&&item.isGroup == true){
            option.column.push( { label: item.name, prop: 'specification'+(number+1), slot: true, cell: true })
            number = number+1;
          }
        }
        option.column.push( { label: '缺货', width: 60, prop: 'stockout', type: 'switch', slot: true, cell: true })
        option.column.push( { label: '库存(件)', width: 100, prop: 'inventory', cell: true, rules: [ { required: true, message: '请输入库存', trigger: 'blur' } ] })
        option.column.push( { label: '官网价', width: 60, prop: 'websitePrice', slot: true, })
        option.column.push( { label: '溢价金', prop: 'premiumMoney', cell: true, rules: [ { required: true, message: '请输入姓名', trigger: 'blur' } ] })
        option.column.push( { label: '租金系数', prop: 'rentRate', cell: true, rules: [ { required: true, message: '请输入姓名', trigger: 'blur' } ] })
//        option.column.push( { label: '押金', prop: 'depositMoney', cell: true, rules: [ { required: true, message: '请输入姓名', trigger: 'blur' } ] })
        option.column.push( { label: '最低月数', width: 70, prop: 'miniLease', slot: true, })
        option.column.push( { label: '单期租金', width: 70, prop: 'rentMoney', slot: true, })
        option.column.push( { label: '买断尾款', width: 70, prop: 'buyoutMoney', slot: true, })
        option.column.push( { label: '滞纳金(日租金%)', width: 120, prop: 'lateFeeMoney', slot: true, })
        option.column.push( { label: '操作', width: 100, prop: 'menu', slot: true, })
        return option
      },
    },

    created() {
      this.loading = true;
      this.goodsId=this.$route.query.goodsId;
      getDetail(this.goodsId).then(res => {
        this.goodsInfo = res.data.data;
        console.log(this.goodsInfo.combinationsJsonData)
        this.plans = JSON.parse(this.goodsInfo.combinationsJsonData)
        this.specifications = JSON.parse(this.goodsInfo.goodsSpecificationsJsonData)
        for (const item of this.plans) {
          item.$cellEdit=false
        }
        this.rowspan()
        this.table_key = new Date().getTime();
        console.log("-----")
        console.log(this.specifications)
        console.log(this.plans)
        console.log("=====")
        this.loading = false;
      });
    }
  };
</script>

<style scoped="scoped" lang="scss">
  .goods_info :deep .el-form-item {
   margin-bottom: 0px;
   }
  .top-bar-title {
    height: 40px;
    background-color: white;
    padding: 15px 20px 15px 20px;
    margin-left: 6px;
    margin-right: 6px;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #F0F2F5;
  }

  .basis-info {
    margin-top: 10px;
    margin-left: 6px;
    margin-right: 6px;
  }

  .basis-info .text {
    font-size: 14px;
  }

  .basis-info .item {
    margin-bottom: 18px;
  }

  :deep .el-card__header {
    padding: 18px 20px !important;
  }

  .basis-info .clearfix:before,
  .basis-info .clearfix:after {
    display: table;
    content: "";
  }

  .basis-info .clearfix:after {
    clear: both
  }

  .form-view :deep .el-select {
    width: 100%;
  }

  .form-view .el-tag + .el-tag {
    margin-left: 10px;
  }

  .form-view .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .form-view .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .has-background {
    width: calc(100% - 20px);
    background-color: #F2F2F260;
  }

  .has-background-item {
    margin: 20px 10px 20px 10px;
    display: block;
  }

  .no-background {
    width: calc(100% - 20px);
    padding: 5px 10px 5px 10px;
  }

  .form-input-3 {
    width: 150px
  }

  .form-input-title {
    margin-left: 20px;
    margin-right: 10px
  }

  .form-select-2 {
    width: 330px !important;
  }

  .form-plan-notice {
    margin-left: 10px;
    color: #D9001B
  }

  :deep .avue-crud__menu {
    display: none;
  }

  :deep .head-class {
    background-color: white !important;
  }

</style>
