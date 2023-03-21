<!--
 订单修改
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="归还结算"
      :visible.sync="isShow"
      width="900px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form1" label-width="120px" size="small">
        <div>
          订单基本信息
        </div>
        <div style="border-radius: 5px;padding: 0px 5px;border: 1px solid #eeeeee;padding-top: 10px;padding-bottom: 10px;margin-top: 10px">
          <el-row>
            <el-col :span="12" style="display: flex;flex-direction: column">
              <el-form-item label="订单编号：" class="bottom">
                <div style="display: flex">
                  <span >{{param.no}}</span>
                  <span style="flex: 1"></span>
                </div>
              </el-form-item>
              <el-form-item label="租赁方案：" class="bottom">
                  {{getPackageName(param.goodsCombinationJson)}}
              </el-form-item>
              <el-form-item label="押金：" class="bottom">
                  {{param.amount}}({{param.freeType == 1?"芝麻免押":(param.freeType == 2?"支付宝押金":"其他")}})
              </el-form-item>
              <el-form-item label="商品官网价：" class="bottom">
                  {{ param.websitePrice }}
              </el-form-item>
              <el-form-item label="每期租金：" class="bottom">
                  {{ param.rentPerMoney }}(第一期{{param.rentFirstMoney}})(总租金{{ param.rentMoney }})
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁商品：" class="bottom">
                <div style="display: flex">
                  <span >{{ param.goodsTitle }}</span>
                  <span style="color: #169BD5" @click="goodsInfo">点击查看商品详情</span>
                  <span style="flex: 1"></span>
                </div>
              </el-form-item>
              <el-form-item label="租期：" class="bottom">
                  {{param.lease}}个{{ getLeaseTypeTitle(param.leaseType) }}
              </el-form-item>
              <el-form-item label="二次押金：" class="bottom">
                  {{ getSecondDeposit() }}
              </el-form-item>
              <el-form-item label="买断价：" class="bottom">
                 当前买断价{{getNowBuyoutMoney()}}(总买断价：{{getBuyoutPrice(param.goodsCombinationJson)}})
              </el-form-item>
              <el-form-item label="买断尾款：" class="bottom">
                  {{getBuyoutBalancePayment() }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          损坏情况
        </div>
        <avue-crud  :key="table_key" ref="crud" :option="destroyInfo" :data="destroy" style="margin-top: 10px">
          <template #menu="{row,index,size}">
            <div style="display: flex">
              <el-button type="text" icon="el-icon-view"  @click="viewImage(row)">查看附件</el-button>
            </div>
          </template>
        </avue-crud>
        <div style="text-align: center;margin-top: 10px"><el-button icon="el-icon-plus" @click="dialogFormVisible = true">{{destoryBill.money>0?"编辑损坏账单":"添加损坏账单"}}</el-button></div>
        <div style="margin-top: 20px">
          订单支付记录
        </div>
        <avue-crud  :key="table_key" ref="crud" :option="option" :data="orderBills" style="margin-top: 10px">
          <template #menu="{row,index,size}">
            <div style="display: flex">
              <el-checkbox v-model="row.hasPay" v-if="row.cancel">需要支付</el-checkbox>
            </div>
          </template>
          <template slot="typeName" slot-scope="scope">
            <span>{{ getOrderNperNumber(scope) }}</span>
          </template>
          <template slot="due" slot-scope="scope">
            <span>{{ getDue(scope.row) }}</span>
          </template>
          <template slot="factPayMoney" slot-scope="scope">
              <span v-if="scope.row.factPayMoney">
                  实付({{scope.row.factPayMoney}})
              </span>
              <span v-if="scope.row.reductionMoney">
                  减免({{scope.row.reductionMoney}})
              </span>
              <span v-if="scope.row.couponMoney">
                  优惠({{scope.row.couponMoney}})
              </span>
              <span v-if="scope.row.depositMoney">
                  押金抵消({{scope.row.depositMoney}})
              </span>
              <span v-if="(Number.parseFloat(scope.row.factPayMoney)+Number.parseFloat(scope.row.reductionMoney)+Number.parseFloat(scope.row.couponMoney)+Number.parseFloat(scope.row.depositMoney)) === 0">0</span>
          </template>
          <template slot="allOverdueMoney" slot-scope="scope">
              <div v-if="scope.row.allOverdueMoney && Number.parseFloat(scope.row.allOverdueMoney)>0">{{ scope.row.allOverdueMoney }}
                  <span>{{scope.row.noPayOverdueMoney == 0?"(已结清)":("（欠款"+scope.row.noPayOverdueMoney+"）")}}</span>
              </div>
              <div v-else>0</div>
          </template>
        </avue-crud>
        <div style="margin-top: 5px">
          总减免：{{reduction}}
        </div>
        <div style="margin-top: 0px">
          已付款：{{paid}}
        </div>
        <div style="margin-top: 0px">
          总押金：{{firstDeposit>0?firstDeposit:allDeposit}}
        </div>
        <div style="margin-top: 0px">
          剩余押金：{{leaveDeposit}}
        </div>
        <div style="margin-top: 0px">
          欠款：{{allDue==0?0:-1*allDue}}
        </div>
        <div style="margin-top: 0px" v-if="depositType == 2">
          汇总：{{totleMoney}}
        </div>
        <div style="margin-top: 20px">
          客户结算方式（客户选择：<span style="color: blue">归还商品</span>，<span style="color: red">{{depositType ==2?"押金抵消":"退还押金"}}</span>）
        </div>
        <div style="margin-top: 10px" v-if="depositType==2">
          <span v-if="hasPay<0">需支付金额：<span style="color: red;font-size: 20px">{{ Math.abs(hasPay)}}</span></span>
          <span v-if="hasPay>0">需退回金额：<span style="color: red;font-size: 20px">{{ Math.abs(hasPay)}}</span></span>
        </div>
        <div style="margin-top: 10px" v-else>
          <span v-if="allDue>=0">需支付：<span style="color: red;font-size: 20px">{{ Math.abs(allDue)}}</span></span>
          <span v-if="leaveDeposit>=0" style="margin-left: 10px;">需退回押金：<span style="color: red;font-size: 20px">{{ leaveDeposit}}</span></span>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="isOfflineShow = true" v-if="param.status == 8">线下结算</el-button>
           <el-button type="primary" @click="onlineShow = true" v-if="param.status == 8">生成在线结算订单</el-button>
      </span>
    </el-dialog>
    <el-dialog title="赔偿账单" :visible.sync="dialogFormVisible"  style="z-index: 9999 !important;">
      <el-form ref="billForm" :model="destoryBill">
        <el-form-item label="赔偿金额" :label-width="140" prop="money"  :rules="[ { required: true, message: '金额不能为空'}]">
          <el-input v-model="destoryBill.money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBill">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="isOfflineShow"
      v-model="form"
      title="线下结算"
      :visible.sync="isOfflineShow"
      width="600px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <avue-form ref="form" class="bill_info" v-model="offlineForm" :option="offline" @submit="submit" @reset-change="cancle">
        <template slot-scope="{size}" slot="menuForm">
          <div slot="footer" class="dialog-footer" style="text-align: end;">
            <el-button size="medium" @click="isOfflineShow = false">取 消</el-button>
            <el-button size="medium" type="primary"  @click="submit(1)">确 定</el-button>
          </div>
        </template>
      </avue-form>
    </el-dialog>
    <el-dialog title="线上结算" :visible.sync="onlineShow"  style="z-index: 9999 !important;">
      <div>
        <div v-if="offlineForm.payMoney>0" style="padding-bottom: 10px">结算需支付金额：<span style="color: red;font-size: 20px">{{offlineForm.payMoney}}</span></div>
        <div v-if="offlineForm.returnMoney>0">结算退还金额：<span style="color: red;font-size: 20px">{{offlineForm.returnMoney}}</span>(在订单支付成功后原路退回)</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onlineShow = false">取 消</el-button>
        <el-button type="primary" @click="submit(2)">确 定</el-button>
      </div>
    </el-dialog>
    <el-image-viewer
      class="imageview"
      v-if="showViewer2"
      style="z-index:9999 !important;"
      :on-close="() => {showViewer2 = false;}"
      :url-list="imageslist">
    </el-image-viewer>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";
  import {
    leaseTypeTitle,
    buyoutBalancePayment,
    buyoutPrice,
    packageName,
    secondDeposit, indexNumber
  } from "../../util/order";
  import {calculateMoneyStats, floatObj, toFixed} from "../../constant/goods/constant";
  import moment from "moment";
  import vue from "../../main";
  import {changeBt, settlement} from "../../api/order/order";
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";

  export default {
    name: 'dialog',
    components: {
      ElImageViewer,
    },
    data () {
      return {
        param:null,
        order:null,
        destroy:null,
        isShow:false,
        showViewer2:false,
        imageUrl: '',
        dialogFormVisible:false,
        imageslist:[],
        onlineShow:false,
        table_key:0,
        textarea:'',
        depositType:null,
        destoryBill: {
          money:0,
          type: 8,
          factPayMoney : 0,
          reductionMoney: 0,
          couponMoney : 0,
          hasPay:true,
          cancel:true,
           depositMoney : 0,
          typeName :"损坏赔偿",
           startTime: moment().format('YYYY-MM-DD'),
        },
        offlineForm: {payMoney:0,returnMoney:0},
        isOfflineShow:false,
        offline:{
          submitBtn:false,
          emptyBtn:false,
          labelWidth: 160,
          column: [{
              label:'结算需支付金额',
              prop:'payMoney',
              span: 24,
              type:'title',
            },{
              label:'结算退还金额',
              prop:'returnMoney',
              span: 24,
              type:'title',
            },{
              label:'上传线下凭证',
              prop:'images',
              type: 'upload',
              span: 24,
              listType: 'picture-card',
              tip: '只能上传jpg/png文件，且不超过500kb',
              propsHttp: {
                home: vue.$store.state.common.cloudDomain,
                res: "data",
                url: 'name',
                name: 'originalName'
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              rules: [{
                required: true,
                message: "请上传发货图片",
                trigger: "blur"
              }]
            },
          ]
        },
        destroyLists:[],
        orderBills:[],
        allDue:0,//总欠款
        allRent : 0,//总租金
        reduction : 0,//减免
        allDeposit : 0,//总押金
        paid : 0,//已付
        leaveDeposit:0,//剩余押金
        totleMoney:0,//汇总
        firstDeposit : 0,//首次实付押金
        hasPay:0,//需支付金额
        destroyInfo: {
          searchShow: false,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          editBtn:false,
          addBtn:false,
          delBtn:false,
          index: false,
          viewBtn: false,
          selection: false,
          searchBtn: false,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menu: true,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "损坏部位",
              prop: "where",
              search:true,
              slot: true,
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            },
            {
              label: "问题说明",
              prop: "info",
              search:true,
              slot: true,
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            }
          ]
        },
        option: {
          searchShow: false,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          editBtn:false,
          addBtn:false,
          delBtn:false,
          index: false,
          viewBtn: false,
          selection: false,
          searchBtn: false,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menuWidth:100,
          menu: true,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "账单类型",
              prop: "typeName",
              search:true,
              slot: true,
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            },
            {
              label: "应付款日期",
              width: 120,
              prop: "startTime",
            },
            {
              label: "账单金额",
              prop: "money",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "付款情况",
              prop: "factPayMoney",
              slot: true,
              width: 140,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "滞纳金",
              prop: "allOverdueMoney",
              width: 140,
              slot: true,
              rules: [{
                required: true,
                message: "请输入租期结束日",
                trigger: "blur"
              }]
            },
            {
              label: "结余/欠款",
              width: 140,
              prop: "due",
              slot: true,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
          ]
        },
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      },
      orderBills:{
        handler (newVal,old) {
          this.$nextTick(() => {
            this.getAllDue()
          })
        },
        deep:true
      },
    },
    created () {

    },
    activated () { },
    mounted() {
      if (this.param.depositType){
        this.depositType = this.param.depositType;
      }
        if (this.param.destroyJson){
            this.destroy = JSON.parse(this.param.destroyJson)
            console.log(this.destroy)
        }
      this.orderBills = [];
      for (const item of this.param.bills) {
        item.hasPay = true;
        item.cancel = false;
        if (item.status == 1) {
          item.cancel = true
        }
        this.orderBills.push({...item})
      }

      console.log(this.offlineForm)
    },
    methods: {
      goodsInfo(){
        vue.$router.push({
          path: "/goods/view/index",
          query: {
            goodsId : this.param.goodsId,
          },
        });
        this.isShow = false;
      },
      viewImage(data){
        if (data.file){
          this.imageslist = [];
          this.imageslist.push(vue.$store.state.common.cloudDomain+data.file)
        }
        console.log(this.imageslist)
        this.showViewer2 = true;
      },
      addBill(){
        this.$refs["billForm"].validate((valid) => {
          if (valid) {
            // alert('submit!');
            if (!isNaN(parseFloat(this.destoryBill.money)) && isFinite(this.destoryBill.money)){
              if (this.orderBills[this.orderBills.length-1].type != 8){
                this.orderBills.push(this.destoryBill);
              }
              this.dialogFormVisible = false
            }else{
              this.$message.error('金额必须为数字');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
        getOrderNperNumber(val){
            console.log(val)
            if (val.row.type == 5){
                return "第"+val.row.orderNumber+"期租金"
            }else{
                return val.label;
            }
        },
      /**
       * 总欠款
       * @param val
       * @returns {string|*}
       */
      getAllDue(){
        this.allDue=0;//总欠款
          this.allRent= 0;//总租金
          this.reduction= 0;//减免
          this.allDeposit=0;//总押金
          this.paid= 0;//已付
          this.leaveDeposit=0;//剩余押金
          this.totleMoney=0;//汇总
          this.firstDeposit = 0;//首次实付押金
          this.hasPay=0;//需支付金额
        for (const bill of this.orderBills) {
          if (bill.type == 2&&Number.parseFloat(bill.factPayMoney)>0){//说明是首次押金，并且不是免押
            this.firstDeposit = floatObj.add(this.firstDeposit,Number.parseFloat(bill.factPayMoney))//
            continue;
          }
          if (bill.type == 3&&Number.parseFloat(bill.factPayMoney)>0){//说明是二次押金
            this.allDeposit = floatObj.add(this.allDeposit,Number.parseFloat(bill.factPayMoney))
            this.paid = floatObj.add(this.paid,Number.parseFloat(bill.factPayMoney))
            continue;
          }
          var money = Number.parseFloat(bill.money)-(Number.parseFloat(bill.factPayMoney)+Number.parseFloat(bill.reductionMoney)+Number.parseFloat(bill.couponMoney)+Number.parseFloat(bill.depositMoney))
          money = toFixed(money,2)
          if (bill.hasPay){
            this.allDue = floatObj.add(this.allDue,money);
          }
          this.paid = floatObj.add(this.paid,Number.parseFloat(bill.factPayMoney))
          if(Number.parseFloat(bill.hasOverduePayMoney)>0){
            this.paid = floatObj.add(this.paid,Number.parseFloat(bill.hasOverduePayMoney))
          }
          if (bill.type == 5){
            this.allRent = floatObj.add(this.allRent,Number.parseFloat(bill.money));
          }
          this.reduction = floatObj.add(this.reduction,Number.parseFloat(bill.reductionMoney))
        }

        if (this.firstDeposit>0){
          this.leaveDeposit = floatObj.subtract(this.firstDeposit,this.paid);
        }else{
          this.leaveDeposit = this.allDeposit;
        }
        var le = 0;
        if (this.firstDeposit>0){
          le = floatObj.subtract(this.firstDeposit,this.paid);
        }else{
          le = this.allDeposit;
        }
        console.log("allDue",this.allDue)
        var all = toFixed(floatObj.subtract(le,this.allDue),2);
        this.totleMoney = all>=0?(all+"(结余)"):(all+"(欠款)");
        this.hasPay = all;

        if (this.depositType==2){
          this.offlineForm.payMoney = 0
          if(this.hasPay<0){
            this.offlineForm.payMoney = Math.abs(all)
          }
          if(this.hasPay>0){
            this.offlineForm.returnMoney = this.hasPay
          }
        }
        if (this.depositType==1){
          this.offlineForm.payMoney = this.allDue
          this.offlineForm.returnMoney = this.leaveDeposit
        }
      },
      getDue(bill){
        var money = Number.parseFloat(bill.money)-(Number.parseFloat(bill.factPayMoney)+Number.parseFloat(bill.reductionMoney)+Number.parseFloat(bill.couponMoney)+Number.parseFloat(bill.depositMoney))
        money = toFixed(money,2)
        if (money<0){
          return "结余"+money;
        }else if (money == 0){
          return "结清"
        }else{
          return "欠款"+money;
        }
      },
        getLeaseTypeTitle(val){
            var ss = leaseTypeTitle(val)
            return ss;
        },
        getBuyoutPrice(val){
            return buyoutPrice(val,this.param.totalPricesRate)
        },
        getPackageName(val){
            return packageName(val);
        },
        getNperNumber(){
            return indexNumber(this.param,this.orderBills);
        },
        getNowBuyoutMoney(){
            return this.getBuyoutPrice(this.param.goodsCombinationJson)-this.getNperNumber()*this.param.rentPerMoney
        },
        getBuyoutBalancePayment(){
            return buyoutBalancePayment(this.param.goodsCombinationJson);
        },
        getSecondDeposit(){
            return secondDeposit(this.param.bills);
        },
      headers(){
        return headers()
      },
      closeFn () {
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
      },
      submit(payType){
        var data = {};
        data.payType = payType;
        data.orderId = this.param.id;
        data.type = 1;
        data.needPay = 0
        data.needReturn = 0
        data.depositType = this.depositType;
        if (this.depositType==2&&this.hasPay<0){
          data.needPay = Math.abs(this.hasPay)
        }else if (this.depositType==2&&this.hasPay>0){
          data.needReturn = Math.abs(this.hasPay)
        }else if (this.depositType==1){
          data.needPay = this.allDue>=0?this.allDue:0;
          data.needReturn = this.leaveDeposit>=0?this.leaveDeposit:0;
        }

        data.leaveDeposit = this.leaveDeposit;

        console.log(this.offlineForm.images)
       if (payType == 1 &&(!this.offlineForm.images||this.offlineForm.images.length == 0)){
         this.$message.error('请上传线下转账凭证');
         return;
       }
        console.log(this.offlineForm.images)
        if (this.offlineForm.images&&this.offlineForm.images.length > 0){
          data.image = this.offlineForm.images.join(",")
        }

        data.bills = this.orderBills;

        console.log(data)

        settlement(data).then(res => {
          vue.$message({
            type: 'success',
            message: '结算成功成功!'
          });
          this.isOfflineShow = false;
          this.onlineShow = false;
          this.isShow = false
          this.$nextTick(() => {
            this.end(true);
          })
        }).catch(res => {
          console.log(res)
        });
      }
    },
  };
</script>
<style scoped>
  .bottom{
    padding-bottom: 0px !important;
    margin-bottom: 0px !important;
  }
  :deep .avue-crud__menu {
    display: none;
  }
  :deep .el-empty {
    padding: 0px 0px !important;
  }
  :deep .avue-crud__empty {
    padding: 0px 0px !important;
  }
  :deep .el-empty__image {
    display: none;
  }
  :deep .el-table--small .el-table__cell {
      padding: 0px 0px !important;
  }
</style>
