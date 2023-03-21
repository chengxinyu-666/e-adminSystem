<template>
  <fragment v-if="type == 'no'">
    <div class="one_line">
      <el-tag size="mini" style="font-size: 10px" v-if="order.parentId" effect="dark" type="danger">
        续
      </el-tag>
      订单编号：
      <span data-clipboard-action="copy"
                       :data-clipboard-text="order.no" class="hand name-color" :class="order.no"
                       @click="copy(order.no)">{{ order.no}}
      </span>
    </div>
    <div >添加时间：{{ order.createTime}}</div>
  </fragment>
  <fragment v-else-if="type == 'userInfo'">
    <div v-if="order.isAuth == 1 && order.idAuth == 1">
      <el-popover
        placement="top-start"
        width="300"
        trigger="hover">
        <div>
          <div>定位地址：{{order.orderAddress}}</div>
          <div>收货地址：{{order.sendUserAddress}}</div>
        </div>
        <span class="hand" slot="reference" style="color: #1e9fff">{{ order.userName}} </span>
      </el-popover>
      {{ order.phone}}
      性别：{{order.idCard?getSex(order.idCard):"未认证"}}
      年龄：{{order.idCard?getAge(order.idCard):"未认证"}}
    </div>
    <div v-else>未认证</div>
    <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ order.idCardAddress }}</div>
  </fragment>
  <fragment v-else-if="type == 'goodsInfo'">
    <div class="one_line">
      <el-tag size="mini" style="margin-right: 5px" :effect="order.secondHand == 100?'dark':'warning'">{{ getSecondHandleTitle(order.secondHand)}}</el-tag>
      <el-popover
        placement="top-start"
        trigger="hover">
        <div>
          {{ order.goodsTitle}}
        </div>
        <span class="hand name-color" slot="reference" @click="goodsInfo">{{ order.goodsTitle}} </span>
      </el-popover>
    </div>
    <div class="one_line">{{ getCombinationTitle(order.goodsCombinationJson)}}</div>
  </fragment>
  <fragment v-else-if="type == 'rentInfo'">
    <div >
      <el-tag size="mini" style="margin-right: 5px" effect="dark" :type="order.rentType == 1?'':'success'">
        {{ getRentTypeTitle(order.goodsCombinationJson)}}
      </el-tag>
      <span>租期：</span><span style="margin-right: 5px">{{ order.lease+getLeaseTypeTitle(order.leaseType)}}</span>
      <span style="margin-right: 5px">总租金：{{ order.rentMoney}}</span>
      <span>每期租金：</span><span>{{ order.rentPerMoney}}</span>
    </div>
    <div >
      <span style="margin-right: 5px">到期买断价：{{calculateOrderBuyoutMoney(order)}}</span>
      <span style="margin-right: 5px">溢价金：{{ order.premiumMoney }}</span>
      <span style="margin-right: 5px">增值服务：{{ order.extraServiceMoney }}</span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'depositMoney'">
    <div >
      <span >冻结额度：{{ order.amount }} 评估额度：{{order.assessmentAmount}}</span>
    </div>
    <div >
      <span >免押额度：{{ order.depositMoneyFree }} 二次押金：{{ order.depositMoneySecond }}</span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'note'">
    <div class="hand">
      <el-popover
        placement="top-start"
        title="备注"
        width="200"
        trigger="click">
        <p>{{ order.note }}</p>
        <div style="text-align: center">
          <el-button type="primary" size="mini" @click="showNoteList(order)">查看更多</el-button>
        </div>
        <span slot="reference" >
               <el-link type="primary" class="note">{{ order.note }}</el-link>
            </span>
      </el-popover>
    </div>
  </fragment>
  <fragment v-else-if="type == 'danger'">
    <div >
      <span >风控：</span>
      <span :style="{ color: order.verifyRecomment != ''?(order.verifyRecomment=='拒绝'?'red':'green'):'#666'}">
            <span v-if="order.verifyRecomment != ''">
              {{ order.verifyRecomment }}
            </span>
            <span v-else>
              暂无
            </span>
            <el-popover
              v-if="order.verifyRecomment"
              placement="top-start"
              width="150"
              title="布尔风控建议"
              trigger="hover">
            <div>
              <div>分值：{{ order.scoreNormExplain }}</div>
              <div>审核建议：{{ order.verifyRecomment }}</div>
              <div>押金建议：{{ order.suggestCash }}</div>
            </div>
            <span class="hand" slot="reference"  :style="{ color: order.verifyRecomment=='拒绝'?'red':'green'}">
              <i class="el-icon-warning" style="font-size: 16px;margin-left: 2px;"></i>
            </span>
          </el-popover>
      </span>
      <span style="margin-left: 5px">征信：</span>
      <span :style="{ color: ruleStatus != 0?(ruleStatus==2?'red':'green'):'#666'}">
            <span v-if="ruleStatus != 0">
              建议{{ ruleStatus == 1?"通过":"拒绝"}}
            </span>
            <span v-else>
              暂无
            </span>
             <el-popover
               v-if="ruleStatus != 0"
               placement="top-start"
               width="300"
               title="征信建议"
               trigger="hover">
              <div>
                <div>分值：{{ order.score }}</div>
                <div>审核建议：{{ order.rules }}</div>
                <div>押金建议：{{ order.modelType }}</div>
              </div>
              <span class="hand" slot="reference" style="color: red">
                <i class="el-icon-warning" style="font-size: 16px;margin-left: 2px;"></i>
              </span>
            </el-popover>
          </span>
    </div>
    <div >
      <span >三址：</span>
      <span :style="{ color: checkAddress()?'green':'red' }">
          {{checkAddress()?'低风险':'高风险'}}
            <el-popover
              placement="top-start"
              width="400"
              v-if="!checkAddress()"
              title="三地风险"
              trigger="hover">
              <div>
                <div>认证地址：{{ order.idCardAddress }}</div>
                <div>定位地址：{{order.orderAddress}}</div>
                <div>收货地址：{{order.sendUserAddress}}</div>
              </div>
              <span class="hand" slot="reference" style="color: red">
                <i class="el-icon-warning" style="font-size: 16px;margin-left: 2px;"></i>
              </span>
            </el-popover>
          </span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'distribute'">
    <div >
      <el-tag size="mini" style="margin-right: 5px" effect="dark" :type="order.examineFirst == 2?'success':'danger'">
        {{ order.examineFirst == 2?'一审已分配':'一审未分配'}}
      </el-tag><span >{{ showexamines(order.examine,1) }}</span>
    </div>
    <div >
      <el-tag size="mini" style="margin-right: 5px" effect="dark" :type="order.examineSecond == 2?'success':'danger'">
        {{ order.examineSecond == 2?'二审已分配':'二审未分配'}}
      </el-tag><span >{{ showexamines(order.examine,2) }}</span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'sendUser'">
    <div >
      <span class="hand" style="color: #1e9fff">{{ order.sendUserName}} </span>
      <span>{{ order.sendUserPhone}} </span>
    </div>
    <div class="one_line">
      <span>收件地址：</span>
      <el-popover
        placement="top-start"
        trigger="hover">
        <div>
          {{ order.sendUserAddress}}
        </div>
        <span slot="reference" >
            <span  data-clipboard-action="copy"
                   :data-clipboard-text="order.sendUserAddress" class="hand name-color" :class="order.no+'class'"
                   @click="copy(order.no+'class')">{{ order.sendUserAddress}}
            </span>
        </span>
      </el-popover>
    </div>
  </fragment>
  <fragment v-else-if="type == 'sendStatus'">
    <div style="display: flex;flex-direction: column;">
      <div style="display: inline">
        <el-tag size="mini" style="margin-right: 5px" v-if="order.status == 6" type="danger">待发货</el-tag>
        <el-tag size="mini" style="margin-right: 5px" v-else-if="order.status == 7" type="warning">待收货</el-tag>
        <el-tag size="mini" style="margin-right: 5px" v-else >已收货</el-tag>
        <span v-if="order.status == 7"> 发货时间：{{order.sendTime}}</span>
        <span v-else-if="order.status > 7">签收时间：{{order.receivingTime}}</span>
      </div>
      <div style="display: inline">
        <span v-if="order.status > 6" style="margin-right: 5px">{{order.sendExpressCompany}}</span>
        <span v-if="order.status > 6" class="hand" style="color: #1e9fff" @click="express(order.id)">{{order.sendExpressNo}} (点击查看物流)</span>
      </div>
    </div>
  </fragment>
  <fragment v-else-if="type == 'goodsSn'">
    <div style="display: flex;flex-direction: column;">
      <span v-if="order.status >= 7">SN: {{order.goodsSn}}</span>
      <span v-if="order.status >= 7">IME: {{order.goodsIme}}</span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'remarks'">
    <el-popover
      placement="top-start"
      width="200"
      title="用户备注"
      trigger="hover">
      <div>
        {{order.remarks}}
      </div>
      <div slot="reference" class="hand" style="color: #1e9fff;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">
        {{order.remarks}}
      </div>
    </el-popover>

  </fragment>
  <fragment v-else-if="type == 'status'">
    <div>
      当前第<span>{{order.nowBillNumber}}</span>期<span v-if="order.statusOverdue == 1&&order.days > 0 && (order.billStatus == 1 || order.billStatus == 3)">(<span style="color: red">已逾期{{order.days}}天</span>)</span> 账期：{{ order.billStartTime }} ~ {{order.billEndTime}}
    </div>
    <div>
      <span>续租
          <el-tag size="mini" style="font-size: 10px" effect="dark" :type="order.openRenewal == 1?'':'info'">
            {{order.openRenewal == 1?"已打开":"未打开"}}
          </el-tag>
        </span>
      <span style="margin-left: 4px;">买断
          <el-tag size="mini" style="font-size: 10px" effect="dark" :type="order.openBuyout == 1?'':'info'">
            {{order.openBuyout == 1?"已打开":"未打开"}}
            <i class="el-icon-message-solid" style="color: white" v-if="order.statusBuyout == 2"></i>
          </el-tag>
        </span>
      <span style="margin-left: 4px;">归还
          <el-tag size="mini" style="font-size: 10px" effect="dark" :type="order.openReturn == 1?'':'info'">
            {{order.openReturn == 1?"已打开":"未打开"}}
            <i class="el-icon-message-solid" style="color: white" v-if="order.statusReturn == 2"></i>
          </el-tag>
        </span>
    </div>
  </fragment>
  <fragment v-else-if="type == 'balanceDue'">
    <div v-if="order.oldestOrderNumber">
      <span>最早第<span style="color: red">{{order.oldestOrderNumber}}</span>期(起始时间：{{order.oldestTime}} <span style="color: red">已逾期{{order.oldestDays}}天</span>)</span>
    </div>
    <div v-if="order.oldestOrderNumber">
      租金欠款：<span style="color: red">{{order.noPayRentMoney}}</span>  滞纳金欠款：<span style="color: red;margin-right: 2px">{{order.noPaLateFee}}</span>
      催收<span style="color: red">{{order.collN}}</span>次 <span v-if="order.lastTime">{{order.collN}}催过</span>
    </div>
    <div v-else>
      暂无欠费
    </div>
  </fragment>
  <fragment v-else-if="type == 'collectNote'">
    <div>
      {{order.lastNote}}
    </div>
    <div v-if="order.lastVoucher && order.lastVoucher != ''">
      <el-image-viewer
        v-if="showViewer"
        :on-close="() => {showViewer = false;}"
        :url-list="srcList">
      </el-image-viewer>
      <span style="color: #1e9fff;" class="hand"  @click="viewImage()">
        查看催收附件
      </span>
    </div>
  </fragment>

  <fragment v-else-if="type == 'returnUser'">
    <div >
      <span class="hand" style="color: #1e9fff">{{ order.userName}} </span>
      <span>{{ order.phone}} </span>
    </div>
    <div class="one_line">
      <span>地址：</span>
      <el-popover
        placement="top-start"
        trigger="hover">
        <div>
          {{ order.idCardAddress}}
        </div>
        <span slot="reference" >
            <span  data-clipboard-action="copy"
                   :data-clipboard-text="order.idCardAddress" class="hand name-color" :class="order.no+'class'"
                   @click="copy(order.no+'class')">{{ order.idCardAddress}}
            </span>
        </span>
      </el-popover>
    </div>
  </fragment>
  <fragment v-else-if="type == 'returnStatus'">
    <div style="display: flex;flex-direction: column;">
      <div style="display: inline">
        <el-tag size="mini" style="margin-right: 5px" v-if="order.receivedStatus == 4" effect="warning">待收货</el-tag>
        <el-tag size="mini" style="margin-right: 5px" v-else >已收货</el-tag>
        <span v-if="order.returnSendTime">发货时间：{{order.returnSendTime}}</span>
      </div>
      <div style="display: inline">
        <span v-if="order.status > 6" style="margin-right: 5px">{{order.receiveExpressCompany}}</span>
        <span v-if="order.status > 6" class="hand" style="color: #1e9fff" @click="express(order.id)">{{order.receiveExpressNo}} (点击查看物流)</span>
      </div>
    </div>
  </fragment>
  <fragment v-else-if="type == 'checkGoods'">
    <div style="display: flex;flex-direction: column;">
      <div style="display: inline">
        <el-tag size="mini" style="margin-right: 5px" v-if="order.receivedStatus == 4" type="warning" effect="dark">待收货</el-tag>
        <el-tag size="mini" style="margin-right: 5px" v-if="order.receivedStatus == 5" type="success" effect="dark">已收货</el-tag>
        <el-tag size="mini" style="margin-right: 5px" v-if="order.receivedStatus == 6" type="danger" effect="dark">拒收</el-tag>
        <span v-if="order.receivedStatus == 5">签收时间：{{order.receivedTime}}</span>
        <span v-if="order.receivedStatus == 6">拒收时间：{{order.receivedTime}}</span>
      </div>
      <div style="display: inline">
        <span v-if="(order.receiveSn != order.goodsSn || order.goodsIme != order.receiveIme)&&order.receivedStatus == 6" style="color: #dd6161"><i class="el-icon-warning"></i></span>
        <span v-if="order.receivedStatus == 5 || order.receivedStatus == 6">签收SN码：{{order.receiveSn}}/{{order.receiveIme}}</span>
      </div>
    </div>
  </fragment>
  <fragment v-else-if="type == 'receivedNo'">
    <div class="one_line" v-if="order.receivedStatus == 5 || order.receivedStatus == 6">
      <el-popover
        placement="top-start"
        trigger="hover">
        <div>
          <div>{{ order.receivedNo}}</div>
          <el-table
            :data="tableData"
            border
            style="width: 380px;margin-top: 10px">
            <el-table-column
              prop="where"
              label="受损部位"
              width="120">
            </el-table-column>
            <el-table-column
              prop="info"
              label="详细描述"
              width="120">
            </el-table-column>
            <el-table-column
              prop="image"
              width="100"
              label="查看图片">
              <template slot-scope="scope">
               <div>
                 <el-button size="mini"  type="primary" v-if="scope.row.image" style="margin-right: 5px;" icon="el-icon-view"  @click="viewImage2()">查看附件</el-button>
                 <el-image-viewer
                   class="imageview"
                   v-if="showViewer2"
                   :on-close="() => {showViewer2 = false;}"
                   :url-list="[scope.row.image]">
                 </el-image-viewer>
               </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="reference" style="color: #1e9fff;" class="hand" >
          {{ order.receivedNo}}
        </div>
      </el-popover>
    </div>
  </fragment>
</template>

<script>
  import {getAge, getGenderByIdNumber} from "../../util/util";
  import {combinationTitle,packageName,leaseTypeTitle, secondHandTitle} from "../../util/order"
  import {order_express, order_note_list} from "./order_dialog";
  import {calculateOrderBuyoutMoney, checkThreeAddress, examines} from "../../util/order";
  import Clipboard from 'clipboard';
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";

  export default {
    name: "",
    props: {
      order: Object,
      type: String,
    },
    components: {
      ElImageViewer,
    },
    data () {
      return {
        tableData: [],
        ruleStatus:0,
        showViewer: false,
        srcList:null,
        showViewer2: false,
        srcList2:null
      };
    },
    mounted() {
      this.order.rules = this.order.rules?this.order.rules.replaceAll("REJECT","拒绝"):""
      this.ruleStatus = 0
      if (this.order.rules && this.order.rules.length>0){
        this.ruleStatus = 1
        if (this.order.rules.indexOf("拒绝")!=-1){
          this.ruleStatus = 2
        }
      }
      if (this.order.json){
        this.tableData = JSON.parse(this.order.json)
        console.log(this.tableData)
      }
    },
    methods:{
      viewImage(){
        var Lists = this.order.lastVoucher.split(",")
        var list = [];
        for (const item of Lists) {
          list.push(this.order.domain+item);
        }
        this.srcList = list;
        this.showViewer = true;
      },
      viewImage2(){
        var list = [];
        list.push(this.tableData.image);
        this.srcList2 = list;
        this.showViewer2 = true;
      },
      getSex(cardNo){
        return getGenderByIdNumber(cardNo)
      },
      getAge(cardNo){
        return getAge(cardNo);
      },
      getSecondHandleTitle(val){
        return secondHandTitle(val);
      },
      getCombinationTitle(val){
        return combinationTitle(val);
      },
      getRentTypeTitle(val){
        return packageName(val);
      },
      getLeaseTypeTitle(val){
        var ss = leaseTypeTitle(val)
        return ss;
      },
      calculateOrderBuyoutMoney(order){
        return calculateOrderBuyoutMoney(order)
      },
      showNoteList(order){
        var fn = {start:this.start,end:this.end}
        order_note_list({data:order,fn:fn})
      },
      checkAddress(){
        return checkThreeAddress(this.order);
      },
      /**
       * 查看物流
       * @param order
       */
      express(orderId){
        order_express({data:orderId,key:"orderExpress",fn:null})
      },
      showexamines(data,type){
        const examinesArray = examines(data);
        if (type == 1 && examinesArray.hasOwnProperty("1")){
          return "审核人:"+examinesArray["1"].userName+" "+examinesArray["1"].status;
        }
        if (type == 2 && examinesArray.hasOwnProperty("2")){
          return "审核人:"+examinesArray["2"].userName+" "+examinesArray["2"].status;
        }
        return "";
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
      goodsInfo(){
        this.$router.push({
          path: "/goods/view/index",
          query: {
            goodsId : this.order.goodsId,
          },
        });
      }
    },
  }
</script>

<style scoped>
.one_line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.note {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
