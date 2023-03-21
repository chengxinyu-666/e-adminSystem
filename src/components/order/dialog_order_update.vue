<!--
 订单修改
 -->
<template>
  <div style="height: 100%;">
    <el-dialog
      v-if="isShow"
      v-model="form"
      title="订单修改"
      :visible.sync="isShow"
      width="800px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <div style="width: 100%;min-height:300px;height: 100%;position: relative;">
        <div v-loading="loading"  element-loading-text="拼命加载中" style="height:100%;width:100%;z-index: 100;position: absolute" v-if="loading"></div>
        <div style="height: 100%">
          <div style="width: 100%;text-align: center;margin-bottom: 10px" v-if="!matching">
            <el-alert
              :closable="false"
              title="该商品规格尺寸已改变，请重新选择规格尺寸"
              type="warning">
            </el-alert>
          </div>
          <avue-form ref="form" class="bill_info" v-model="form" :option="option" @submit="submit" @reset-change="cancle">
            <template slot-scope="{disabled,size}" slot="fistBill">
              <div style="width: 100%">
                <div class="bills myscollbar" ref="scoll">
                  <template v-for="(bill,index) in form.bills">
                    <div style="display: inline-flex;margin-bottom: 5px">
                      <div style="display: inline-flex;background-color: #eeeeee80;border-radius: 5px;padding: 0px 5px;flex: 1;justify-content: space-between">
                        <div style="margin-left: 10px">
                          <span style="width: 120px;text-align: right">{{ billTypeName(bill) }}：</span>
                          <span>
                            {{ bill.money }}
                            <span v-if="bill.status == 2 || bill.status == 3">（已付：{{bill.factPayMoney}}）</span>
                            <span v-if="bill.status == 2 || bill.status == 3" style="font-size: 14px;" >（已减免：{{bill.reductionMoney}}）</span>
                            <span style="font-size: 14px;" v-if="bill.couponMoney&&bill.couponMoney!=0">（优惠券：{{bill.couponMoney}}）</span>
                          </span>
                        </div>
                        <el-checkbox v-model="bill.first" @change="sort" :disabled="bill.status == 2 || bill.status == 3">首次支付</el-checkbox>
                      </div>
                      <div style="margin-left: 10px;width: 20px;cursor: pointer">
                        <template v-if="bill.type != 5 && bill.status == 1 ">
                          <el-popconfirm
                            title="确认删除该账单吗？"
                            @confirm='deleteBill(index)'>
                            <i class="el-icon-delete"  slot="reference" ></i>
                          </el-popconfirm>
                        </template>
                        <i class="el-icon-edit-outline"  @click="editBill(index)" v-if="bill.type == 5 && form.lease == 12 && enable('custom_rent')"></i>
                      </div>
                    </div>
                  </template>
                </div>
                <div style="display: inline-flex;width: 100%">
                  <div style="border-radius: 5px;padding: 0px 5px;flex: 1;border: 1px solid #eeeeee;text-align: center;cursor: pointer;margin-top: 5px" v-if="form.lease" @click="addBill">
                    添加收费项
                  </div>
                  <span v-else style="font-size: 13px;color: red">
                  暂无账单，请完整选择商品，规格，套餐，租期
                </span>

                </div>
              </div>
            </template>

            <template slot-scope="{disabled,size}" slot="rentMoney">
              <div style="width: 100%;display: inline-flex">
                <el-descriptions class="margin-top"  :column="4" style="flex: 1" border size="mini">
                  <el-descriptions-item label-class-name="title-class" >
                    <template slot="label">
                      {{ form.lease }}期租金
                    </template>
                    {{allRentBillMoney}}
                  </el-descriptions-item>
                  <el-descriptions-item label-class-name="title-class" >
                    <template slot="label">
                      已分配
                    </template>
                    {{rentBillMoney}}
                  </el-descriptions-item>
                  <el-descriptions-item label-class-name="title-class" >
                    <template slot="label">
                      可分配
                    </template>
                    <div style="color: #dd6161">{{enDistribution}}</div>
                  </el-descriptions-item>
                  <el-descriptions-item label-class-name="title-class" >
                    <template slot="label">
                      授信额度
                    </template>
                    <div style="color: #dd6161">{{param.amount}}</div>
                  </el-descriptions-item>
                </el-descriptions>
                <div style="display: inline-flex;margin-left: 5px" v-if="enable('custom_rent')">
                  <el-button size="mini" @click="resetBill">重置</el-button>
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">前6期是（合约价 * 0.838 / 6）<br/>后6期就是（合约价 - 前面6个月的总价）/6</div>
                    <el-button size="mini" style="margin-left: 5px" @click="autoBill">自动</el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>

            <template slot-scope="{disabled,size}" slot="goodsPrice">
              <el-descriptions class="margin-top"  :column="5" border size="mini">
                <el-descriptions-item label-class-name="title-class" >
                  <template slot="label">
                    官网价
                  </template>
                  {{goodsCombination?goodsCombination.websitePrice:""}}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="title-class" >
                  <template slot="label">
                    合约价
                  </template>
                  {{contractPrice}}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="title-class" >
                  <template slot="label">
                    租金系数
                  </template>
                  {{goodsCombination?goodsCombination.rentRate:""}}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="title-class" >
                  <template slot="label">
                    每期租金
                  </template>
                  {{goodsCombination?goodsCombination.rentPerMoney:""}}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="title-class" >
                  <template slot="label">
                    买断价
                    <el-tooltip class="item" effect="dark" placement="left">
                      <div slot="content">买断价：<br/>
                        增长幅度公式： A = （总价系数 - 1.255）/ 3<br/>
                        第4个月系数：1.25 + A<br/>
                        第5个月系数：1.25 + A * 2<br/>
                        第6个月系数：1.25 + A * 3<br/>
                        后面6到12个月买断系数都和第6个月一样</div>
                      <i class="el-icon-warning-outline" style="color: #dd6161"></i>
                    </el-tooltip>
                  </template>
                  {{buyoutMoney}}
                </el-descriptions-item>
              </el-descriptions>
            </template>
            <template slot-scope="{disabled,size}" slot="combinations">
              <el-select v-model="goodsCombinationTitle" placeholder="请选择规格尺寸" size="mini">
                <el-option
                  v-for="(item, index) in combinationsJsonTitles"
                  :key="index"
                  @click.native ="changeCombinations(item)"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="{disabled,size}" slot="packageType">
              <el-select v-model="packageNameTitle" placeholder="请选择租赁方案" size="mini">
                <el-option
                  v-for="(item, index) in goodsCombinations"
                  :key="index"
                  @click.native ="changePackage(item)"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>

            <template slot-scope="{disabled,size}" slot="lease">
              <el-select v-model="form.lease" placeholder="请选择期数" size="mini">
                <el-option
                  v-for="(item, index) in leases"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="{disabled,size}" slot="fistBillCount">
              <span style="font-weight: bold;font-size: 20px;">{{toFixed(form.firstMoney)}}</span>
            </template>

            <template slot-scope="{disabled,size}" slot="billCount">
              <span style="font-weight: bold;font-size: 20px;">{{toFixed(form.realMoney)}}</span>
              <span v-if="param.amount-form.realMoney>=0">
                (距离支付宝预授权额度：<span>{{param.amount}}的90%({{toFixed(parseFloat(param.amount)*0.9,2)}}
                    <el-tooltip class="item" effect="dark" content="账单总金额不能超过支付宝授信额度的90%" placement="top-start">
                          <i class="el-icon-warning-outline" style="color: #dd6161"></i>
                    </el-tooltip>
                )</span>，还有<span>{{toFixed(parseFloat(param.amount)*0.9-form.realMoney,2)}}</span>扣费额度)
              </span>
              <span v-else style="color: #dd6161">
                 (超过支付宝预授权额度：<span>{{param.amount}}的80%({{parseFloat(param.amount)*0.9}}
                  <el-tooltip class="item" effect="dark" content="账单总金额不能超过支付宝授信额度的90%" placement="top-start">
                          <i class="el-icon-warning-outline" style="color: #dd6161"></i>
                    </el-tooltip>
                )</span>，超出金额为<span>{{parseFloat(param.amount)*0.9-form.realMoney}}</span>)
              </span>
            </template>

            <template slot-scope="{disabled,size}" slot="payCount">
              <span style="font-weight: bold;font-size: 20px;color: #67c23a">{{toFixed(form.factPayMoney)}}<span v-if="form.reductionMoney && form.reductionMoney >0" style="font-size: 14px;">(实付<span>{{form.realPay}}</span><span style="color: #dd6161;margin-left: 4px">减免{{form.reductionMoney}}</span>)</span></span>
            </template>

            <template slot-scope="{disabled,size}" slot="noPay">
              <span style="font-weight: bold;font-size: 20px;color: red">{{calcNoPay()}}</span>
            </template>
            <template slot-scope="{size}" slot="menuForm">
              <div slot="footer" class="dialog-footer" style="text-align: end;">
                <el-button size="medium" @click="$refs.form.resetForm()">取 消</el-button>
                <el-button size="medium" type="primary"  @click="$refs.form.submit()">确 定</el-button>
              </div>
            </template>
          </avue-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="选择账单"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <div style="display: flex">
          <span>账单类型：</span>
          <el-select v-model="addItem.typeName" style="flex: 1" size="mini" placeholder="请选择">
            <el-option
              @click.native ="selectItem(item)"
              v-for="item in billOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div style="display: flex;margin-top: 10px">
          <span>账单金额：</span>
          <el-input v-model="addItem.money" size="mini" style="flex: 1" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItemConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑账单"
      :close-on-click-modal="false"
      :visible.sync="editItemVisible"
      width="30%">
      <div>
        <div style="display: flex">
          <span>可增加金额：</span>
          <span>{{enItemDistribution()}}</span>
        </div>
        <div style="display: flex;margin-top: 10px">
          <span>账单金额：</span>
          <el-input v-model="editItem.newMoney" size="mini" style="flex: 1" placeholder="请输入内容"></el-input>
        </div>
        <div> <span></span></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editItemVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";
  import {
    calculateMoneyStats, floatObj,
    newOrderBills, toFixed, calculateRentLimitMoney, newVipOrderBills, isVip, calculateRentMoney
  } from "../../constant/goods/constant";
  import {getList as getExtraserviceList} from "../../api/goods/extraservice";
  import {Message} from 'element-ui'
  import {getDetail} from "@/api/goods/goods";
  import {getDetail as getOrderDetail,update as updateOrder} from "../../api/order/order";
  import {calcUpdateOrderBuyoutMoney} from "../../util/order";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        loading:false,
        dialogVisible:false,
        editItemVisible:false,
        billOptions:[],
        extraServices:[],
        goodsInfo:null,
        addItem:{
          status:1,
          typeName:null,
          money:0,
          customId:null,
        },
        editIndex: 0,
        editItem: {},
        form:{
          bills:[],
          goodsId:null,
          packageType:null,
          lease:null,
          moneyInfo:null,
          money:0,
          factPayMoney:0,
          reductionMoney:0,
          couponMoney:0,
          depositMoney:0,
        },
        oldBills:[],
        packageType:null,
        goodsCombinationTitle:null,
        packageNameTitle:null,
        goodsCombination:null,
        matching:true,
        leases:[],
        combinationsJsonData:null,
        combinationsJsonTitles:[],
        goodsCombinations:[],
        imageUrl: '',
        textarea:'',
        option:{
          submitBtn:false,
          emptyBtn:false,
          labelWidth: 120,
          column: [
            {label: "选择商品",
              prop: "goodsId",
              hide: true,
              type: "select",
              dataType: "string",
              remote: true,
              dicUrl: "/api/blade-goods/goods/select?searchKey={{key}}",
              props: {
                label: "title",
                value: "id"
              },
              emitPath:false,
              multiple: false,
              rules: [{
                required: true,
                message: "请选择商品",
                trigger: "blur"
              }]
            },
            { size: 'mini',
              label: "规格尺寸",
              prop: "combinations",
              type: 'select',
              span: 12,
              dicData:[]
            },
            { size: 'mini',
              label: "租赁方案",
              prop: "packageType",
              type: 'select',
              span: 12,
              dicData:[]
            },
            { size: 'mini',
              label: "账单期数",
              prop: "lease",
              row: true,
              span: 12,
              type: 'select',
              dicData:[]
            },
            { size: 'mini',
              label: "商品价格",
              prop: "goodsPrice",
              row: true,
              span: 24,},
            { size: 'mini',
              label: "账单项",
              prop: "fistBill",
              row: true,
              span: 24,},
            { size: 'mini',
              label: "账单总金额",
              prop: "billCount",
              row: true,
              span: 24,},
            { size: 'mini',
              label: "首期账单总金额",
              prop: "fistBillCount",
              row: true,
              span: 24,},
            { size: 'mini',
              label: "首期已付总金额",
              prop: "payCount",
              row: true,
              span: 24,},
            { size: 'mini',
              label: "首期待付金额",
              prop: "noPay",
              row: true,
              span: 24,}
          ]
        },

      };
    },
    watch: {
      isShow(val, oldVal) {
      },
      'form.bills':{
        handler (newVal,old) {
          Object.assign(this.form,calculateMoneyStats(this.form.bills));
        },
        deep:true
      },
      'goodsCombinationTitle': function (newVal,old) {
        if (old){
          this.leases = [];
          this.form.lease = null;
          this.form.bills = this.form.bills.filter(item => {
            return item.status == 2 || item.status == 3;
          });
        }
      },
      'packageNameTitle': function (newVal,old) {
        if (!this.goodsCombinationTitle||!this.combinationsJsonData)
          return;
        if (old){
          this.leases = [];
          this.form.lease = null;
        }
        var title = newVal+","+this.goodsCombinationTitle
        for (const item of this.combinationsJsonData) {
          var key = item.packageName.name;
          if (newVal != key){
            continue;
          }
          for (let i = 1; i < 10; i++) {
            if (!item['specification'+i]){
              break;
            }
            if (key.length>0){
              key = key +","
            }
            key = key + item['specification'+i].name;
          }

          if (title == key){
            this.goodsCombination = item;
            this.changeRentLease(this.goodsCombination)
            return;
          }
        }
        this.form.bills = this.form.bills.filter(item => {
          return item.status == 2 || item.status == 3;
        });
      },
      'form.lease': function (newVal,old) {
        if (this.goodsInfo){
          this.form.bills = this.form.bills.filter(item => {
            return item.status == 2 || item.status == 3;
          });
          this.oldBills = this.oldBills.filter(item => {
            return item.status == 2 || item.status == 3;
          });
          this.oldBills.push(...newOrderBills(this.goodsInfo,this.goodsCombination,this.form.lease))
          this.form.bills.push(...newOrderBills(this.goodsInfo,this.goodsCombination,this.form.lease))
          if (this.form.goodsId == this.param.goodsId&&(this.combinationsJsonTitles.indexOf(this.goodsCombinationTitle) == -1||this.goodsCombinations.indexOf(this.packageNameTitle) == -1)){
            console.log("该商品规格尺寸已改变，请重新选择规格尺寸")
            this.matching = false;
          }else{
            this.matching = true;
          }
        }
      },
      'form.goodsId': function (newVal,old) {
        if (old){
          this.goodsCombinationTitle = null;
          this.leases = [];
          this.form.lease = null;
          this.packageNameTitle = null;
          this.combinationsJsonTitles = [];
          this.form.bills = this.form.bills.filter(item => {
            return item.status == 2 || item.status == 3;
          });
        }
        this.getGoodsDetail();
      },
    },
    created () {
    },
    computed: {
      //合约价
      contractPrice() {
        var money = 0;
        var maxRate = toFixed(Number.parseFloat(this.param.totalPricesRate),2);
        var websitePrice = toFixed(Number.parseFloat(this.param.websitePrice),2);
        money = parseFloat(toFixed(floatObj.multiply(maxRate,websitePrice),2))
        return money;
      },
      allRentBillMoney() {
        var money = 0;
        for (const bill of this.oldBills) {
          if (bill.type == 5){
            money = floatObj.add(money,Number.parseFloat(bill.money))
          }
        }
        return toFixed(money,2);
      },
      rentBillMoney() {
        var money = 0;
        for (const bill of this.form.bills) {
          if (bill.type == 5){
            money = floatObj.add(money,Number.parseFloat(bill.money))
          }
        }
        return toFixed(money,2);
      },
      enDistribution() {
        var money = this.allRentBillMoney;
        return parseFloat(toFixed(floatObj.subtract(money,this.rentBillMoney),2));
      },
      buyoutMoney() {
        console.log("计算买断价-------",this.form.lease,this.param)
        if (this.form.lease&&this.param){
          return calcUpdateOrderBuyoutMoney(this.param,this.form.bills,this.form.lease);
        }
        return "~"
      },
    },
    activated () { },
    mounted() {

      console.log(process.env)

      if (this.enable("custom_rent")){
        this.option.column.splice(5,0,{ size: 'mini',
          label: "租金分配",
          prop: "rentMoney",
          row: true,
          span: 24,}
        )
      }

      this.loading = true;
      getOrderDetail(this.param.id).then(res => {
        this.param = res.data.data.order;
        this.param.bills =res.data.data.bills;
        this.param.goodsCombinationJson = JSON.parse(this.param.goodsCombinationJson)

        for (const bill of this.param.bills) {
          bill.first = false;
          if (bill.firstBill == 2){
            bill.first = true
          }
          this.form.bills.push(bill);
        }
        this.sort()
        this.oldBills = JSON.parse(JSON.stringify(this.form.bills));

        var key = "";
        for (let i = 1; i < 10; i++) {
          if (!this.param.goodsCombinationJson['specification'+i]){
            break;
          }
          if (key.length>0){
            key = key +","
          }
          key = key + this.param.goodsCombinationJson['specification'+i].name;
        }
        this.goodsCombinationTitle = key;
        console.log(this.goodsCombinationTitle)
        this.form.goodsId = this.param.goodsId;
        this.packageNameTitle = this.param.goodsCombinationJson.packageName.name;

        this.form.packageType = this.param.goodsCombinationJson.packageName.type;
        this.packageType = this.param.goodsCombinationJson.packageName.type;
        this.form.lease = this.param.lease;
        this.init();

        this.param.goodsCombinationJson.id = this.param.goodsCombinationId

        this.goodsCombination = this.param.goodsCombinationJson;
        // this.goodsCombination.id =
        this.changeRentLease(this.goodsCombination)
        console.log("this.goodsCombination",this.goodsCombination);

        this.billOptions.unshift({label:"溢价金",typeName:"溢价金",type:4,value:4,money:this.param.goodsCombinationJson.premiumMoney})

        this.billOptions.unshift({label:"二次押金",typeName:"二次押金",type:3,value:3,money:0})

        getExtraserviceList(0, 100, {}).then(res => {
          this.extraServices = res.data.data.records
          for (const item of this.extraServices) {
            this.billOptions.unshift({label:item.name,typeName:item.name,type:1,value:item.id,money:item.price,customId:item.id})
          }
          this.$nextTick(() => {
            this.loading = false;
          })
        })
      }).catch(res => {
        this.$nextTick(() => {
          this.loading = false;
        })
      })
    },
    methods: {
      enItemDistribution() {
        var money = this.allRentBillMoney;
        var leave = toFixed(floatObj.subtract(money,this.rentBillMoney),2);
        var leave2 = floatObj.subtract(this.editItem.money,this.editItem.newMoney?this.editItem.newMoney:0);
        console.log(leave,leave2,parseFloat(leave)+parseFloat(leave2))
        return toFixed(parseFloat(leave)+parseFloat(leave2),2);
      },
      editItemConfirm(){
        if (this.enItemDistribution() < 0){
          Message({
            message: "金额超过可设置的最大值",
            type: 'error'
          })
          return;
        }
        this.form.bills[this.editIndex].money = this.editItem.newMoney;
        this.editItemVisible = false
      },
      autoBill() {
        this.form.bills = this.form.bills.filter(item => {
          return item.status == 2 || item.status == 3 || item.type != 5;
        });
        this.form.bills.push(...newVipOrderBills(this.goodsInfo,this.goodsCombination,this.form.lease))
      },
      resetBill() {
        this.form.bills = JSON.parse(JSON.stringify(this.oldBills));
        console.log(this.form.bills)
      },
      toFixed(value){
        return toFixed(value,2)
      },
      calcNoPay(){
       return toFixed(floatObj.subtract(floatObj.subtract(this.form.firstMoney,this.form.factPayMoney),this.form.couponMoney),2);
      },
      sort(){
        this.$nextTick(()=>{
          this.form.bills.sort(function(a, b){
            var orderNumber1 = a.orderNumber?a.orderNumber:0;
            var orderNumber2 = b.orderNumber?b.orderNumber:0;
            var check1 = a.first;
            var check2 = b.first;
            if (check1&&!check2){
              return -1;
            }
            if (!check1&&check2){
              return 1;
            }

            if (check1&&check2){
              if (orderNumber1>orderNumber2){
                return 1;
              }else if (orderNumber1<orderNumber2){
                return -1;
              }else {
                return 0;
              }
            }

            if (!check1&&!check2){
              if (orderNumber1>orderNumber2){
                return 1;
              }else if (orderNumber1<orderNumber2){
                return -1;
              }else {
                return 0;
              }
            }
            return 0;
          });
        })
        var _this = this;
        this.$nextTick(()=>{
          setTimeout(function (){
            _this.$refs.scoll.scrollTop = 0;
          },100)
        })
      },

      changePackage(title){
        console.log(title)
      },
      changeRentLease(item){
        var packageName = item.packageName;
        var mini = packageName.miniLease;
        var max = packageName.maxLease;
        var miniType = packageName.miniType;
        var leaseType = miniType == "2"?"个月":"周";
        this.leases = []
        if (mini == max){
          this.leases.push({label:mini+leaseType,value:mini})
        }
        if (mini != max){
          if(this.enable('custom_rent')){
            for (let i = mini; i <= max; i++) {
              this.leases.push({label:i+leaseType,value:i})
            }
          }else {
            this.leases.push({label:max+leaseType,value:max})
          }
        }
      },
      /**
       * 切换规格，当切换规格的时候，分为两种情况，
       * 第一种情况是默认的规格，这个时候resetPackageName需要为false，不重置选择的套餐
       * 第二种情况是手动选择规格，这个时候需要触发该方法为规格下拉的点击事件。重置套餐的默认值
       * @param title
       * @param resetPackageName
       */
      changeCombinations(title,resetPackageName = true){
        this.packageNameTitle = resetPackageName?null:this.packageNameTitle;
        this.goodsCombinations = [];
        for (const item of this.combinationsJsonData) {
          var key = "";
          for (let i = 1; i < 10; i++) {
            if (!item['specification'+i]){
              break;
            }
            if (key.length>0){
              key = key +","
            }
            key = key + item['specification'+i].name;
          }
          if (title == key)
            if (this.goodsCombinations.indexOf(item.packageName.name)==-1)
              this.goodsCombinations.push(item.packageName.name);
        }
      },
      getGoodsDetail(){
        if (!this.form.goodsId){
          return;
        }
        getDetail(this.form.goodsId).then(res => {
          this.goodsInfo = res.data.data
          this.combinationsJsonData = JSON.parse(res.data.data.combinationsJsonData);
          //加载套餐的下拉
          this.changeCombinations(this.goodsCombinationTitle,false)
          //加载规格的下拉
          var packageName = false;
          for (const item of this.combinationsJsonData) {
            var key = "";
            for (let i = 1; i < 10; i++) {
              if (!item['specification'+i]){
                break;
              }
              if (key.length>0){
                key = key +","
              }
              key = key + item['specification'+i].name;
            }
            if (this.combinationsJsonTitles.indexOf(key)==-1)
              this.combinationsJsonTitles.push(key);
            if (this.goodsCombinationTitle == key && this.packageNameTitle == item.packageName.name){
              packageName = true;
            }
          }
          //这里说明了当前订单中的商品，套餐和规格尺寸重新编辑过，导致该订单中的尺寸在商品信息中无法找到，需要重新设置
          if (this.form.goodsId == this.param.goodsId&&(this.combinationsJsonTitles.indexOf(this.goodsCombinationTitle) == -1||!packageName)){
            console.log("该商品规格尺寸已改变，请重新选择规格尺寸")
            this.matching = false;
          }else{
            this.matching = true;
          }
        })
      },
      addItemConfirm(){

        if (this.addItem.money == 0){
          Message({
            message: "请输入金额",
            type: 'error'
          })
          return;
        }


        if (!this.addItem.value){
          Message({
            message: "请选择账单类型",
            type: 'error'
          })
          return;
        }

        if (parseFloat(this.param.amount)*0.9-this.form.realMoney - parseFloat(this.addItem.money)<=0){
          var money = toFixed(parseFloat(this.param.amount)*0.9 -this.form.realMoney - parseFloat(this.addItem.money),2);
          Message({
            message: "账单总金额超出了90%预授权额度的"+(money*-1),
            type: 'error'
          })
          return;
        }

        for (const bill of this.form.bills) {
          if (bill.typeName == this.addItem.typeName&&this.addItem.type == bill.type&&bill.type == 5&&bill.orderNumber == this.addItem.orderNumber){
            Message({
              message: "该账单已存在",
              type: 'error'
            })
            return;
          }
          if (bill.typeName == this.addItem.typeName&&this.addItem.type == bill.type&&bill.type != 5){
            Message({
              message: "该账单已存在",
              type: 'error'
            })
            return;
          }
        }
        this.dialogVisible = false;
        this.addItem.first = false;
        this.form.bills.push(this.addItem)
        this.addItem = {
          status:1,
          typeName:null,
          money:0,
        }
        this.sort()
      },
      selectItem(item){
        Object.assign(this.addItem,item);
      },
      init(){
        this.option.column[1].dicData = this.$enum.selectOpion()
        var item = this.param.goodsCombinationJson.packageName;
        // var item = this.$enum.defaultPlanInfo['type_'+this.form.packageType];
        var mini = item.miniLease;
        var max = item.maxLease;
        var miniType = item.miniType;
        var leaseType = miniType == "2"?"个月":"周";
        if (mini == max){
          this.option.column[2].dicData.push({label:mini+leaseType,value:mini})
        }
        if (mini != max){
          for (let i = mini; i <= max; i++) {
            this.option.column[2].dicData.push({label:i+leaseType,value:i})
          }
        }
      },
      deleteBill(index){
        this.form.bills.splice(index,1);
      },
      addBill(){
        this.dialogVisible = true;
      },
      editBill(index){
        this.editItemVisible = true;
        this.editIndex = index;
        this.editItem = {...this.form.bills[index]};
      },
      /**
       * 提交编辑
       */
      submit(){
        //提交之前，先对订单进行整理
        const order = {};
        order.goodsCombination = JSON.stringify(this.goodsCombination)
        order.bills = this.form.bills;
        for (const bill of order.bills) {
          if (bill.first){
            bill.firstBill = 2;
          }else {
            bill.firstBill = 1;
          }
        }
        order.goodsCombinationId = this.goodsCombination.id;
        order.goodsId = this.form.goodsId;
        order.id = this.param.id;
        order.no = this.param.no;//订单编号
        order.goodsTitle = this.goodsInfo.title//商品名称
        order.secondHand = this.goodsInfo.secondHand;//折扣率
        order.lease = this.form.lease;//周期
        order.leaseType = this.goodsCombination.packageName.miniType;//周期类型
        order.rentType = this.goodsCombination.packageName.type;//套餐类型
        order.websitePrice = Number.parseFloat(this.goodsCombination.websitePrice);//官网价
        order.totalPricesRate = Number.parseFloat(this.goodsInfo.totalPricesRate);//总价系数
        order.rentPerMoney = Number.parseFloat(this.goodsCombination.rentPerMoney);//每一期租金
        order.depositMoneyFirst = Number.parseFloat(this.goodsCombination.depositMoney);//商品押金
        this.goodsCombination.totalPricesRate = order.totalPricesRate;
        if (order.rentType == 1||order.rentType==2){
          order.rentMoney = calculateRentMoney(this.goodsCombination)
        }else{
          order.rentMoney = calculateRentLimitMoney(this.goodsCombination,order.lease)
        }
        this.loading = true;
        updateOrder(order).then(res => {
          console.log(res)
          this.loading = false;
          this.isShow = false
          this.$nextTick(() => {
            this.end(true);
          })
        }).catch(res => {
          console.log(res)
          this.loading = false;
        });
      },
      cancle(){
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      headers(){
        return headers()
      },
      closeFn () {
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      billTypeName(bill){
        if (bill.type == 5){
          return "第"+bill.orderNumber+bill.typeName;
        }
        return bill.typeName;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
  };
</script>
<style >
  .title-class {
    padding: 5px 5px !important;
  }
</style>
<style lang="scss" scoped="scoped">

  .bills {
    display: flex;flex-direction: column;width: 100%;max-height: 240px;overflow: auto
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .bill_info {
    width: 80%;
  }
  .bill_info :deep .el-form-item {
    margin-bottom: 0px !important;
  }
  :deep .el-card__body {
    padding-top: 10px !important;
  }
  :deep .avue-dialog {
    margin-top: 15vh !important;

    :deep .el-dialog__wrapper {
      text-align: center;
      white-space: nowrap;
      overflow: auto;
      &:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      .el-dialog {
        margin: 30px auto !important;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        white-space: normal;
      }
    }
  }
</style>
