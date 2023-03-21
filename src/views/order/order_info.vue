<template>
  <div style="height: 100%;">
    <el-form ref="form1" label-width="120px" size="small" style="flex-direction: column;height: 100%;display: flex;">
      <div class="top-bar-title top">
        <div style="line-height: 40px;display: flex;justify-content: space-between;width: 100%">
          <div>
            <span style="font-weight: bold">单号：</span>
            <span style="color: #169BD5">{{order.no}} </span>
            <i class="el-icon-document-copy btn"
               data-clipboard-action="copy"
               :data-clipboard-text="order.no" @click="copy('.btn')"
               style="cursor: pointer;"></i>
            <el-tag  effect="dark" size="small" class="btn2" style="margin-left: 10px;cursor: pointer;"
                     data-clipboard-action="copy"
                     v-if="order.parentNo"
                     :data-clipboard-text="order.no" @click="copy('.btn2')">续租订单 <i class="el-icon-document-copy" ></i></el-tag>
            <el-tag  type="danger" effect="dark" size="small" style="margin-left: 10px">{{ order.statusName }}
            </el-tag>
            <el-tag v-if="order.status == 8 && order.statusBuyout&&order.openBuyout == 1" type="danger" effect="dark" size="small" style="margin-left: 10px">
                {{buyoutStatus()}}
            </el-tag>
            <el-tag v-if="order.status == 8 && order.statusReturn&&order.openReturn == 1" type="danger" effect="dark" size="small" style="margin-left: 10px">
                {{returnStatus()}}
            </el-tag>
          </div>
          <div style="flex: 1;text-align: end;">
            <el-button plain icon="el-icon-arrow-left" @click="goback()" size="mini">返回</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="refer()" size="mini">刷新</el-button>
            <order_button v-bind:order="order" @start="start" @end="end" v-bind:type="'orderInfo'"></order_button>
          </div>
        </div>
        <div class="top_contain" v-if="false">
          <div class="top_item">
            <span>
              申请人：
            </span>
            <span>
               {{clientAuth.name}}
            </span>
          </div>
          <div class="top_item">
            <span>
              下单时间：
            </span>
            <span>
               {{order.createTime}}
            </span>
          </div>
          <div class="top_item">
            <span>
              租用周期：
            </span>
            <span>
                {{order.startRentTime}}~{{order.endRentTime}}
            </span>
          </div>
          <div class="top_item">
            <span>
              租用商品：
            </span>
            <span>
              {{order.goodsTitle}}
            </span>
          </div>
        </div>
        <el-tabs v-model="activeName" >
          <el-tab-pane :label="item" v-for="(item,index) of tabs">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="min-height: 0;flex: 1;">
        <div v-loading="loading" style="height:100%;width:100%;z-index: 9999;position: absolute" v-if="loading"></div>
        <div style="height:100%;overflow-y: scroll;" class="myscollbar">
          <div style="width: 100%"  v-if="activeName == 0">
            <el-card class="info">
              <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
                <span style="font-weight: bold">用户认证信息(芝麻认证)</span>
                <div style="font-weight: bold">
                  <span v-if="clientAuth.idAuth == 1" style="color: #00a680">已认证</span>
                  <span v-if="clientAuth.idAuth != 1" style="color: red">未认证</span>
                </div>
              </div>
              <div class="user_info"  ref="basicInfo">
                <el-descriptions class="margin-top" :column="3" :size="size" border>
                  <template slot="extra" v-if="false">
                    <el-button type="primary" size="small">操作</el-button>
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      申请人
                    </template>
                    {{clientAuth.name}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-female" v-if="getSex(clientAuth.idCard) == '女'"></i>
                      <i class="el-icon-male" v-if="getSex(clientAuth.idCard) == '男'"></i>
                      性别
                    </template>
                    {{ getSex(clientAuth.idCard) }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-thumb" ></i>
                      年龄
                    </template>
                    {{ getAge(clientAuth.idCard) }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-postcard" ></i>
                      邮箱
                    </template>
                    {{client.email}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone"></i>
                      认证手机号码
                    </template>
                    {{order.clientPhone}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-bank-card"></i>
                      身份证号码
                    </template>
                    {{clientAuth.idCard}}
                  </el-descriptions-item>
                  <el-descriptions-item :span="3">
                    <template slot="label">
                      <i class="el-icon-takeaway-box"></i>
                      历史记录
                    </template>
                    申请1次,拒绝0次
                  </el-descriptions-item>
                  <el-descriptions-item :span="3">
                    <template slot="label">
                      <i class="el-icon-location-outline"></i>
                      定位地址
                    </template>
                    {{ orderInfo.country+orderInfo.province+orderInfo.city+orderInfo.district }}
                  </el-descriptions-item>

                  <el-descriptions-item :span="3">
                    <template slot="label">
                      <i class="el-icon-map-location"></i>
                      认证地址
                    </template>
                    {{ clientAuth.idCardAddress }}
                  </el-descriptions-item>

                  <el-descriptions-item :span="3">
                    <template slot="label">
                      <i class="el-icon-office-building"></i>
                      收货地址
                    </template>
                    {{ orderInfo.sendUserAddress }}
                  </el-descriptions-item>
                  <el-descriptions-item :span="3">
                    <template slot="label">
                      <i class="el-icon-picture"></i>
                      身份证/人脸照片
                    </template>
                    <div>
                      <img style="height: 100px;margin-right: 10px" @click="showViewer2 = true" :src="item" v-for="item of imageslist">
                    </div>
<!--                    <i  class="el-icon-view hand" style="color: #169BD5" @click="viewImage">查看照片</i>-->
                  </el-descriptions-item>
                </el-descriptions>
                <el-descriptions style="margin-top: 20px" title="紧急联系人" :column="3" :size="size" border>
                  <template slot="extra">
                    <el-button type="primary" size="small">编辑</el-button>
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      姓名
                    </template>
                    {{ clientLink?clientLink.oneLinkName:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-paperclip"></i>
                      关系
                    </template>
                    {{ clientLink?clientLink.oneLinkRelation:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone"></i>
                      手机号
                    </template>
                    {{ clientLink?clientLink.oneLinkPhone:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      姓名
                    </template>
                    {{ clientLink?clientLink.twoLinkName:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-paperclip"></i>
                      关系
                    </template>
                    {{ clientLink?clientLink.twoLinkRelation:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-mobile-phone"></i>
                      手机号
                    </template>
                    {{ clientLink?clientLink.twoLinkPhone:"暂无" }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>

            <el-card class="info">
              <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
                <span style="font-weight: bold">风控征信</span>
                <div style="font-weight: bold">
                  <span v-if="clientAuth.idAuth == 1" style="color: #00a680"></span>
                  <span v-if="clientAuth.idAuth != 1" style="color: red"></span>
                </div>
              </div>
              <div class="user_info">
                <el-descriptions class="margin-top" title="风控信息" :column="3" :size="size" border>
                  <template slot="extra">
                    <el-button type="primary" size="small" @click="showDialogPage(null,'clientRisk')">查看风控详情</el-button>
<!--                    <el-button type="danger" size="small">拉取最新风控</el-button>-->
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-warning-outline"></i>
                      审核建议
                    </template>
                    {{ clientRisk?clientRisk.verifyRecomment:""}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-s-order"></i>
                      风控分数
                    </template>
                    {{ clientRisk?clientRisk.scoreNormExplain:"" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-view"></i>
                      押金建议
                    </template>
                    {{ clientRisk?clientRisk.suggestCash:"" }}
                  </el-descriptions-item>
                </el-descriptions>

                <el-descriptions style="margin-top: 20px" title="征信信息" :column="3" :size="size" border>
                  <template slot="extra">
<!--                    <el-button type="primary" size="small" @click="showDialogPage(null,'clientCredit')">查看征信详情</el-button>-->
<!--                    <el-button type="danger" size="small">拉取最新征信</el-button>-->
                  </template>
                  <el-descriptions-item  >
                    <template slot="label">
                      <i class="el-icon-warning-outline"></i>
                      审核建议
                    </template>
                    <span class="item_w">{{ clientCredit&&clientCredit.rules?clientCredit.rules.replaceAll("REJECT","拒绝"):"暂无"}}</span>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-s-order"></i>
                      风控分数
                    </template>
                    {{ clientCredit?clientCredit.score:"暂无" }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-view"></i>
                      押金建议
                    </template>
                    {{ clientCredit?clientCredit.modelType:"暂无" }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>

            <el-card class="info">
              <div class="user_info">
                <el-descriptions class="margin-top" title="业务信息" :column="3" :size="size" border>
                  <template slot="extra">
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      商品名称
                    </template>
                    {{order.goodsTitle}}(<span style="color: #169BD5" class="hand" @click="goodsInfo">查看详情</span>）
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      商品分类
                    </template>
                    {{order.firstClass}}/{{order.secondClass}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      商品规格
                    </template>
                    {{getCombinationTitle(order.goodsCombinationJson)}}
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      租期
                    </template>
                    {{order.lease}}个{{ getLeaseTypeTitle(order.leaseType) }}({{getPackageName(order.goodsCombinationJson)}})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      每一期租金
                    </template>
                    {{ order.rentPerMoney }} (第{{order.rentFirstMoney}}期)(总租金{{ order.rentMoney }})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      已付租金
                    </template>
                    {{order.payRentMoney}}(未付租金：{{order.noPayRentMoney}})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      当前买断价
                    </template>
                    {{getNowBuyoutMoney()}}(总买断价：{{getBuyoutPrice(order.goodsCombinationJson)}})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      押金
                    </template>
                    免押额度{{order.amount}}/免押金额{{order.depositMoneyFree}}(实付金额{{order.depositMoneyPay}})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      免押方式
                    </template>
                    {{order.freeType == '1'?"芝麻信用免押":"其他"}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      订单支付
                    </template>
                    {{order.hasPayMoney}}(待支付{{order.noPayMoney}})
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      当前期数
                    </template>
                    第{{getNperNumber(order.startRentTime,order.endRentTime,order.lease,order.leaseType)}}期
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      已使用优惠券
                    </template>
                    0(首期减免)
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      待退还押金
                    </template>
                    {{order.depositMoneyPay}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      已退还押金
                    </template>
                    0.0
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      溢价金
                    </template>
                    {{getPremiumMoney(order.goodsCombinationJson)}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      设备SN
                    </template>
                    {{orderInfo.goodsSn}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      设备供货商
                    </template>
                    {{orderInfo.buyingChannel}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      增值服务
                    </template>
                    <span type="primary"  v-if="order.extraServiceList.length>0" v-for="tag in order.extraServiceList" style="margin-right: 10px;color: #169BD5">{{tag.name+'('+tag.price+')'}}</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>

            <el-card class="info">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">账单信息</span>
              </div>
              <div class="user_info">
                <avue-crud :key="table_key"  ref="crud" :option="option" :data="orderBills">
                  <template #menu="{row,index,size}">
                    <div style="display: flex">
                      <el-button type="text" size="mini" icon="el-icon-view" v-if="(row.factPayMoney && Number.parseFloat(row.factPayMoney)>0 )" @click="showDialogPage(row,'orderBillRecord')" >查看记录</el-button>
                      <el-button type="text" size="mini" icon="el-icon-edit" v-if="['1','3'].includes(row.status+'') && (new Date(row.paymentTime)).getTime()<=(new Date()).getTime()"  @click="deductMoney(row,'online')">线上扣款</el-button>
                      <el-button type="text" size="mini" icon="el-icon-delete" v-if="['1','3'].includes(row.status+'') && (new Date(row.paymentTime)).getTime()<=(new Date()).getTime()"  @click="deductMoney(row,'offline')">线下扣款</el-button>
                    </div>
                  </template>
                  <template slot="typeName" slot-scope="scope">
                    <span>{{ getOrderNperNumber(scope) }}</span>
                  </template>
                  <template slot="allOverdueMoney" slot-scope="scope">
                    <span v-if="scope.row.allOverdueMoney>0">{{ scope.row.allOverdueMoney }}(未付<span style="color: #dd6161">{{scope.row.noPayOverdueMoney}}</span>)</span>
                    <span v-else>~</span>
                  </template>
                </avue-crud>
              </div>
            </el-card>

            <el-card class="info" v-if="entryForm&&entryForm.length>0">
              <div slot="header" style="display: flex;justify-content: space-between">
                <span style="font-weight: bold">进件单</span>
                <el-button type="primary" @click="pdfDownload">下载<i class="el-icon-download el-icon--right"></i></el-button>
              </div>
              <div class="user_info" ref="enterForm">
                <div class="div_table">
                  <template v-for="entry in entryForm">
                    <el-descriptions direction="vertical" style="margin-top: 20px" :title="entry.title" :column="entry.value.length>=4?4:3" :size="size" border>
                      <template v-if="entry.value.length>0&&entry.value[0].constructor === Object">
                        <el-descriptions-item :span="1" label-class-name="my-label" content-class-name="my-content"  v-for="item in entry.value">
                          <template slot="label">
                            {{ item.title}}
                          </template>
                          {{ item.value }}
                        </el-descriptions-item>
                      </template>
                    </el-descriptions>

                  </template>
                </div>
              </div>
            </el-card>

            <el-card class="info">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">协议下载</span>
              </div>
              <div class="user_info">
                <table>
                  <tbody>
                  <tr>
                    <td style="text-align: center">
                      租赁合同
                      <span style="color: #1e9fff" class="hand" v-if="contracts&&contracts.contractRent" @click="contractDownload('contractRent')">下载</span>
                      <span style="color: #1e9fff;margin-left: 10px" class="hand" v-if="contracts&&contracts.contractRent" @click="preview('contractRent')">查看</span>
                      <span style="color: #1e9fff;margin-left: 10px" class="hand btn22" data-clipboard-action="copy" :data-clipboard-text="contracts.contractRent.signUrl" @click="copy('.btn22')" v-if="contracts&&contracts.contractRent.signUrl" >签约地址</span>
                      （<span style="color: #1e9fff">查看{{ client.contractRentNum }}次</span>）
                    </td>
                    <td style="text-align: center">
                      用户授权合同 <span style="color: #1e9fff" class="hand" v-if="contracts&&contracts.contractAuthorization" @click="contractDownload('contractAuthorization')">下载</span>（<span style="color: #1e9fff">查看{{ client.contractAuthorizationNum }}次</span>）
                    </td>
                    <td style="text-align: center">
                      个人信用信息查询及报送授权书 <span style="color: #1e9fff" class="hand" v-if="contracts&&contracts.contractPersonalCredit" @click="contractDownload('contractPersonalCredit')">下载</span>（<span style="color: #1e9fff">查看{{ client.contractPersonalCreditNum }}次</span>）
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center">
                    商品签收确认书 <span style="color: #1e9fff" class="hand" v-if="contracts&&contracts.contractGoodsReceived" @click="contractDownload('contractGoodsReceived')">下载</span>（<span style="color: #1e9fff">查看{{ client.contractGoodsReceivedNum }}次</span>）
                    </td>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      &nbsp;
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </el-card>

            <el-card class="info">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">物流信息</span>
              </div>
              <div class="user_info">
                <div class="logistics">物流公司：{{ orderInfo.sendExpressCompany?orderInfo.sendExpressCompany:"暂无"}}</div>
                <div class="logistics">物流单号：{{ orderInfo.sendExpressNo?orderInfo.sendExpressNo:"暂无"}} <i class="el-icon-document-copy" v-if="orderInfo.sendExpressNo"></i>
                  <el-button plain size="small" style="margin-left: 10px" @click="express(orderInfo.orderId)" v-if="orderInfo.sendExpressNo">查看物流信息</el-button>
                  <el-button plain size="small" v-if="contracts&&contracts.contractGoodsReceived" @click="contractDownload('contractGoodsReceived')">查看签收回执单</el-button>
                </div>
                <div class="logistics">收货地址：{{orderInfo.sendUserAddress}}</div>
                <div class="logistics">收货人姓名：{{orderInfo.sendUserName}}</div>
                <div class="logistics">收货人电话：{{orderInfo.sendUserPhone}}</div>
              </div>
            </el-card>

            <el-card class="info">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">归还信息</span>
              </div>
              <div class="user_info">
                <div class="logistics">物流公司：{{ orderInfo.receiveExpressCompany?orderInfo.receiveExpressCompany:"暂无"}}</div>
                <div class="logistics">物流单号：{{ orderInfo.receiveExpressNo?orderInfo.receiveExpressNo:"暂无"}} <i class="el-icon-document-copy" v-if="orderInfo.receiveExpressNo"></i>
                  <el-button plain size="small" style="margin-left: 10px" v-if="orderInfo.receiveExpressNo">查看物流信息</el-button>
                </div>
                <div class="logistics">归还地址：{{ orderInfo.receiveUserAddress }}</div>
                <div class="logistics">收货人姓名：{{ orderInfo.receiveUserName }}</div>
                <div class="logistics">收货人电话：{{orderInfo.receiveUserPhone}}</div>
              </div>
            </el-card>
          </div>
          <div style="width: 100%" v-if="activeName == 1">
            <el-card class="info" >
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">用户操作记录</span>
              </div>
              <div class="user_info">
                <avue-crud ref="crud1" :option="option2" :data="userOperatingRecord">
                </avue-crud>
              </div>
            </el-card>
            <el-card class="info">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">平台操作记录</span>
              </div>
              <div class="user_info">
                <avue-crud ref="crud" :option="option3" :data="serveOperatingRecord">
                </avue-crud>
              </div>
            </el-card>
          </div>
          <div style="width: 100%" v-if="activeName == 2">
            <el-card class="info" >
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">存证记录</span>
              </div>
              <div class="user_info">
                <avue-crud ref="crud2" :option="option4" :data="evidences">
                </avue-crud>
              </div>
            </el-card>
<!--            <el-card class="info">-->
<!--              <div slot="header" class="clearfix">-->
<!--                <span style="font-weight: bold">合同下载</span>-->
<!--              </div>-->
<!--              <div class="user_info">-->

<!--              </div>-->
<!--            </el-card>-->
          </div>
          <div style="width: 100%" v-if="activeName == 3">
            <el-card class="info" >
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">备注信息</span>
              </div>
              <div class="user_info">
                <avue-crud ref="crud3" :key="table_key" :option="option5" :data="orderNotes" :page="page.note" @on-load="onNotesLoad">
                </avue-crud>
              </div>
            </el-card>
          </div>
          <div style="width: 100%" v-if="activeName == 4">
            <el-card class="info" >
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">信息发送记录</span>
              </div>
              <div class="user_info">
                <avue-crud ref="crud4" :key="table_key"  :option="option6" :page="page.sms"
                           @current-change="currentChange"
                           @size-change="sizeChange"
                           @on-load="onLoad"
                           :data="smsList">
                  <template slot="statusCode" slot-scope="scope">
                    <span >{{ scope.label == 0?"成功":"失败" }}</span>
                  </template>
                </avue-crud>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog :title="orderBillRecordPain.title"
               :visible.sync="orderBillRecordPain.visible"
               width="80%"
               append-to-body="true"
               :before-close="beforeCloseDialog">
      <order-bill-record :billId="bill.id"></order-bill-record>
    </el-dialog>
    <el-dialog :title="clientRiskPain.title"
               :visible.sync="clientRiskPain.visible"
               width="80%"
               append-to-body="true"
               :before-close="beforeCloseDialog">
      <client-risk :clientId="client.id"></client-risk>
    </el-dialog>
    <el-dialog :title="clientCreditPain.title"
               :visible.sync="clientCreditPain.visible"
               width="80%"
               append-to-body="true"
               :before-close="beforeCloseDialog">
      <client-credit :clientId="client.id"></client-credit>
    </el-dialog>
    <el-dialog
      v-if="previewShow"
      title="预览"
      :visible.sync="previewShow"
      append-to-body
      width="90%"
    >
      <!-- PDF显示的地方 -->
      <iframe :src="pdfData" frameborder="0"
              style="left: 0;width: 100%;height: 500px;right: 0;top: 0;border: 0;"></iframe>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="previewShow = false"
        >关 闭</el-button
        >
      </span>
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
  import {getDetail} from "@/api/order/order";
  import {getList} from "@/api/order/operatingrecord";
  import {getList as getRecordList} from "@/api/finance/smsrecord";
  import {getList as getNoteList} from "@/api/order/ordernote";
  import {
    combinationTitle,
    packageName,
    indexNumber,
    buyoutPrice,
    leaseTypeTitle,
    calcBuyoutMoney
  } from "../../util/order";
  import Clipboard from 'clipboard';

  import {deduction,order_express,} from "../../components/order/order_dialog";
  import html2canvas from "html2canvas";
  import JsPDF from 'jspdf'
  import {getAge, getGenderByIdNumber} from "../../util/util";
  import order_button from "../../components/order/order_button";
  import OrderBillRecord from "./orderbillrecord";

  import ClientRisk from "../order/clientrisk";
  import ClientCredit from "../order/clientcredit";
  import {audit, download} from "../../api/order/order";
  import {checkBuyoutStatus, checkReturnStatus} from "../../util/order";
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";
  import vue from "../../main";
  import {toFixed} from "../../constant/goods/constant";
  export default {
    name: "",
    components: {
      order_button,
      OrderBillRecord,
      ClientRisk,
      ClientCredit,
      ElImageViewer
    },
    data() {
      return {
        orderBillRecordPain: {title: "", visible: false},
        orderId:null,
        bill: {},
        previewShow:false,
        pdfData:null,
        table_key:1111,
        loading:true,
        activeName:0,
        entryForm:[],
        tabs:["基本信息","操作记录","存证记录","备注信息","信息发送记录"],
        evidences:[],
        orderBills:[],
        orderNotes:[],
        smsList:[],
        order:{},
        imageslist:[],
        clientAuth:{},
        showViewer2:false,
        orderInfo:{},
        clientLink:{},
        clientRisk:{},
        clientCredit:{},
        contracts:{},
        client:{},
        receiveGoods:{},
        userOperatingRecord:[],
        serveOperatingRecord:[],
        clientRiskPain: {title: "", visible: false},
        clientCreditPain: {title: "", visible: false},
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
          menu: true,
          menuWidth:240,
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
              label: "实付金额",
              prop: "factPayMoney",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "减免金额",
              prop: "reductionMoney",
              slot: true,

            },
            {
              label: "优惠金额",
              prop: "couponMoney",
              slot: true,

            },
            {
              label: "滞纳金",
              slot: true,
              prop: "allOverdueMoney",
            },
            {
              label: "应付款日期",
              width: 110,
              prop: "startTime",
            },
            {
              label: "付款状态",
              prop: "status",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=money_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "付款笔数",
              prop: "payCount",
              rules: [{
                required: true,
                message: "请输入每一期租金",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              width: 140,
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入免押方式",
                trigger: "blur"
              }]
            }
          ]
        },
        option2: {
          searchShow: false,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          editBtn:false,
          addBtn:false,
          delBtn:false,
          index: true,
          viewBtn: false,
          selection: false,
          searchBtn: false,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "操作说明",
              prop: "title",
              slot: true
            },
            {
              label: "操作时间",
              prop: "createTime",
              slot: true
            }
          ]
        },
        option3: {
          searchShow: false,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          editBtn:false,
          addBtn:false,
          delBtn:false,
          index: true,
          viewBtn: false,
          selection: false,
          searchBtn: false,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "操作说明",
              prop: "title",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "操作人",
              prop: "title",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "操作时间",
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入租期结束日",
                trigger: "blur"
              }]
            }
          ]
        },option4: {
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
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "存证类型",
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
              label: "附件",
              prop: "money",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "factPayMoney",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            }
          ]
        },
        option5: {
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
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "阶段",
              width:100,
              prop: "orderStatus",
              type: "select",
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            },
            {
              label: "备注信息",
              prop: "note",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "备注人",
              prop: "userName",
              width:100,
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "备注时间",
              prop: "createTime",
              width:150,
              slot: true,
              rules: [{
                required: true,
                message: "请输入租期起始日",
                trigger: "blur"
              }]
            }
          ]
        },
        page: {
          sms:{pageSize: 10,
            currentPage: 1,
            total: 0},
          note:{pageSize: 10,
            currentPage: 1,
            total: 0},
        },
        option6: {
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
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "阶段",
              prop: "orderStatus",
              type: "select",
              width:100,
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "发送内容",
              prop: "params",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "发送人",
              prop: "userName",
              width:"100",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "发送结果",
              prop: "statusCode",
              width:"100",
              slot: true,
              rules: [{
                required: true,
                message: "请输入租期起始日",
                trigger: "blur"
              }]
            },
            {
              label: "发送时间",
              prop: "createTime",
              width:"160",
              rules: [{
                required: true,
                message: "请输入租期结束日",
                trigger: "blur"
              }]
            }
          ]
        }
      };
    },
    beforeDestroyed() {
    },
    mounted() {

    },
    created() {
      // this.loading = true;
      this.orderId=this.$route.query.orderId;
      this.getDetail()
      this.getRecord();
    },
    watch: {
      activeName: function (){
        console.log("option变化了")
        this.table_key = new Date().getTime();
      },
    },
    methods: {
      getPdfSrc(){

      },
      preview(key) {
        var name = this.contracts[key].contractName;
        download(this.contracts[key].contractNo).then(res => {
          var pdf = res.data.data.data;
          this.previewShow = true;
          this.pdfData ='data:application/pdf;base64,'+ pdf;
        }).catch(res => {
        });
      },
      viewImage(){
        this.imageslist = [];
        if (this.clientAuth.idCardFrontUrl){
          this.imageslist.push(this.clientAuth.idCardFrontUrl)
          this.imageslist.push(this.clientAuth.idCardBackUrl)
        }
        if (this.clientAuth.faceUrl){
          this.imageslist.push(this.$store.state.common.cloudDomain+this.clientAuth.faceUrl)
        }
        console.log(this.imageslist)
      },
      buyoutStatus(){
        return "买断"+checkBuyoutStatus(this.order)
      },
      returnStatus(){
        return "归还"+checkReturnStatus(this.order)
      },
      getSex(cardNo){
        return getGenderByIdNumber(cardNo)
      },
      getAge(cardNo){
        return getAge(cardNo);
      },
      getRecord(){
        var param = {orderId:this.orderId};
        getList(1,1000,param).then(res => {
          this.userOperatingRecord = []
          this.serveOperatingRecord = []
          console.log(res.data.data.records)
          for (const item of res.data.data.records) {
            if (item.clientId&&item.clientId != -1){
              this.userOperatingRecord.push(item)
            }else{
              this.serveOperatingRecord.push(item)
            }
          }
          // this.loading = false;
          this.$nextTick(() => {
            this.loading = false;
          })
        }).catch(res => {
          this.$nextTick(() => {
            this.loading = false;
          })
        })
      },
      getDetail(){
        // var loadinstance = Loading.service({fullscreen:true})
        this.loading = true;
        getDetail(this.orderId).then(res => {
          this.order = res.data.data.order;
          this.orderInfo = res.data.data.orderInfo;
          this.clientAuth = res.data.data.clientAuth;
          this.orderBills = res.data.data.bills;
          this.clientLink = res.data.data.detail;
          this.client = res.data.data.client;
          this.receiveGoods = res.data.data.receiveGoods;
          this.clientRisk = res.data.data.clientRisk;
          this.clientCredit = res.data.data.clientCredit;
          this.contracts = res.data.data.contracts;

          this.orderBills.sort(function(a, b){
            var orderNumber1 = a.orderNumber?a.orderNumber:0;
            var orderNumber2 = b.orderNumber?b.orderNumber:0;
            if (orderNumber1>orderNumber2){
              return 1;
            }else if (orderNumber1<orderNumber2){
              return -1;
            }else {
              return 0;
            }
            return 0;
          });

          this.order.payRentMoney = 0;
          this.order.noPayRentMoney = 0;
          this.order.hasPayMoney = 0;
          this.order.noPayMoney = 0;
          for (var  bill of this.orderBills) {
            if (bill.type == "2"){
              continue;
            }
            if (bill.type == '10'){
              continue;
            }
            var pay = Number.parseFloat(bill.factPayMoney)+Number.parseFloat(bill.reductionMoney)
              +Number.parseFloat(bill.couponMoney)+Number.parseFloat(bill.depositMoney);
            if (bill.type ==5){
              this.order.payRentMoney = this.order.payRentMoney + pay;
              this.order.noPayRentMoney = this.order.noPayRentMoney + Number.parseFloat(bill.money) -pay;
            }
            this.order.hasPayMoney = this.order.hasPayMoney + pay;
            var start = new Date(bill.paymentTime);
            var now = new Date().getTime();
            if (start.getTime()<=now){
              this.order.noPayMoney = this.order.noPayMoney + Number.parseFloat(bill.money) - pay;
            }
          }
          this.order.payRentMoney = toFixed(this.order.payRentMoney,2)
          this.order.noPayRentMoney = toFixed(this.order.noPayRentMoney,2)
          this.order.hasPayMoney = toFixed(this.order.hasPayMoney,2)
          this.order.noPayMoney = toFixed(this.order.noPayMoney,2)

          this.order.hasFreeze = 1;

          if (this.receiveGoods){
            this.order.sendVoucher = this.receiveGoods.sendVoucher
            this.order.sendNote = this.receiveGoods.sendNote
            this.order.depositType = this.receiveGoods.depositType
            this.order.destroyJson = this.receiveGoods.destroyJson
          }
          this.order.bills = this.orderBills;
          if (this.order.entryForm)
            this.entryForm = JSON.parse(this.order.entryForm)
          this.$nextTick(() => {
            this.loading = false;
          })
          this.viewImage()
        }).catch(res => {
          this.$nextTick(() => {
            this.loading = false;
          })
        })
      },
      copy(bt){
        let clipboard = new Clipboard(bt);
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
      onLoad(page, params = {}) {
        var param = {orderId:this.orderId};
        getRecordList(page.currentPage, page.pageSize,param).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.smsList = data.records;
        }).catch(res => {

        })
      },
      onNotesLoad(page, params = {}) {
        var param = {orderId:this.orderId};
        getNoteList(1, 1000,param).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.orderNotes = data.records;
        }).catch(res => {

        })
      },
      start() {

      },
      end(key){
        console.log("--2---",key)
        this.table_key = new Date().getTime();
        if (key == "entryForm" || key == "changeBt" || key == "deductMoney" || key ==  "buyout_check" || key == 'return_check' || key == "order_buyout"){
          this.getDetail()
          this.getRecord();
        }
        if (key == "edit"){
          this.getDetail()
          this.getRecord();
        }
        if (key == "cancle"){
          this.getDetail()
          this.getRecord();
        }
        if (key == "pass"){
          this.getDetail()
          this.getRecord();
        }
      },
      goback(){
        this.$EventBus.$emit('tag', {
          action:"remove",
          value:"/order/view/index",
          isOpenTag:true,
          isMatchAll:false
        })
      },
      goodsInfo(){
        this.$router.push({
          path: "/goods/view/index",
          query: {
            goodsId : this.order.goodsId,
          },
        });
      },
      refer(){
        this.getDetail();
        this.getRecord();
      },
      express(orderId){
        order_express({data:this.order.id,key:"orderExpress",fn:null})
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      getLeaseTypeTitle(val){
        var ss = leaseTypeTitle(val)
        return ss;
      },
      getCombinationTitle(val){
        return combinationTitle(val);
      },
      getPackageName(val){
        return packageName(val);
      },
      getNperNumber(){
        return indexNumber(this.order,this.orderBills);
      },
      getBuyoutPrice(val){
        return buyoutPrice(val,this.order.totalPricesRate)
      },
      getPremiumMoney(val){
        if (!val)
          return
        return JSON.parse(val).premiumMoney
      },
      getNowBuyoutMoney(){
        return toFixed(calcBuyoutMoney(this.order,this.orderBills),2)
      },
      getOrderNperNumber(val){
        console.log()
        if (val.row.type == 5){
          return "第"+val.row.orderNumber+"期租金"
        }else{
          return val.label;
        }
      },
      contractDownload(key){
        var name = this.contracts[key].contractName;
        download(this.contracts[key].contractNo).then(res => {
          var pdf = res.data.data.data;
          const linkSource = `data:application/pdf;base64,${pdf}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = name+".pdf";
          downloadLink.click();
        }).catch(res => {
        });
      },
      pdfDownload() {
        console.log("----------")
        let images = [];
        let _this = this
        let enterForm = this.$refs.enterForm; //获取ref里面的内容
        let basicInfo = this.$refs.basicInfo;
        let height = 0;
        let PDF = new JsPDF('', 'pt', 'a4')
        html2canvas(basicInfo, {
          useCORS: true, //是否尝试使用CORS从服务器加载图像
          allowTaint: true,
          dpi: 300, //解决生产图片模糊
          scale: 3, //清晰度--放大倍数
        }).then(function (canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89 // 一页pdf显示html页面生成的canvas高度;
          let leftHeight = contentHeight //未生成pdf的html页面高度
          let position = 0 //pdf页面偏移
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          // let imgWidth = 595.28
          let imgWidth = 560.28  //宽度
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          PDF.addImage(pageData, 'JPEG', 20, 20, imgWidth, imgHeight)
          height = height+imgHeight
          console.log("----------",enterForm)
          html2canvas(enterForm, {
            useCORS: true, //是否尝试使用CORS从服务器加载图像
            allowTaint: true,
            dpi: 300, //解决生产图片模糊
            scale: 3, //清晰度--放大倍数
          }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89 // 一页pdf显示html页面生成的canvas高度;
            let leftHeight = contentHeight //未生成pdf的html页面高度
            let position = 0 //pdf页面偏移
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            // let imgWidth = 595.28
            let imgWidth = 560.28  //宽度
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            let start = height;
            height = height+imgHeight;
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 20, start+50, imgWidth, imgHeight)
            } else {
                // while (leftHeight > 0) {
                //   PDF.addImage(pageData, 'JPEG', 20, height, imgWidth, imgHeight)
                //   leftHeight -= pageHeight
                //   position -= 841.89
                //   if (leftHeight > 0) {
                //     PDF.addPage()
                //   }
                // }
            }
            let title = _this.order.clientName+" "+_this.order.no+"进件单"
            PDF.save(_this.$t(title) + '.pdf')//下载标题
          })
        });
      },
      beforeCloseDialog(done) {
        done();
      },
      showDialogPage(row, type) {
        if (type == 'orderBillRecord') {
          this.bill = row;
          this.orderBillRecordPain.visible = true;
          this.orderBillRecordPain.title = row.typeName + " - 支付记录";
        }
        if (type == 'clientRisk') {
          this.clientRiskPain.visible = true;
          this.clientRiskPain.title = this.clientAuth.name + " - 风控报告";
        }
        if (type == 'clientCredit') {
          this.clientCreditPain.visible = true;
          this.clientCreditPain.title = this.clientAuth.name + " - 征信报告";
        }
      },
      deductMoney(row,type) {
        var fn = {start:this.start,end:this.end}
        var order = {...row}
        order.openType = type
        order.hasBill = true
        deduction({data:order,key:"deductMoney",fn:fn});
      },
    }
  }
</script>

<style scoped>
  .top-bar-title {
    height: auto;
    background-color: white;
    padding: 0px 10px 10px 20px;
    padding-bottom: 0px !important;
    margin-left: 6px;
    margin-right: 6px;
    display: block;
    justify-content: space-between;
    border-bottom: 2px solid #F0F2F5;
  }
  .top_item{
    margin-right: 20px;
  }
  :deep .el-tabs__header {
    margin: 0 0 0px !important;
  }
  .top_contain {
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  :deep .head-class {
    background-color: white !important;
  }
  .info {
    margin-top: 5px;
    margin-left: 6px;
    margin-right: 6px;
  }

  .info  :deep .clearfix:before {
    content: unset !important;
  }
  .info  :deep .clearfix:after{
    content: unset !important;
  }


  .info .text {
    font-size: 14px;
  }

  .info .item {
    margin-bottom: 18px;
  }

  :deep .el-card__header {
    padding: 18px 20px !important;
  }

  .info .clearfix:before,
  .info .clearfix:after {
    display: table;
    content: "";
  }

  .top :deep .el-form-item {
    margin-bottom: 0px;
  }

  .top :deep .el-col {
    margin-bottom: 0px;
  }

  .user_info :deep .el-form-item {
    margin-bottom: 0px;
  }

  .user_info .logistics {
    padding: 5px 10px;
    font-size: 14px;
  }

  .user_info :deep .el-col {
    margin-bottom: 0px;
  }

  .info .clearfix:after {
    clear: both
  }
  :deep .el-tabs__nav-wrap::after{
    background-color: #F0F2F5;
  }
  .user_info table{
    font-size: 14px;
    width: 100%;
    border-top: 1px solid #00000015;
    border-left: 1px solid #00000015;
    border-collapse: collapse; /*设置单元格的边框合并为1*/
  }
  .user_info td{
    width: 33%;
    border-bottom: 1px solid #00000015;
    border-right: 1px solid #00000015;
    padding: 10px 20px;
  }

  :deep .avue-crud__menu {
    display: none;
  }

  :deep .head-class {
    background-color: white !important;
  }
  .div_table {
    width: 100%;
  }

  .table_border{
    border-right: 1px solid #E9E9E9;
    border-bottom: 1px solid #E9E9E9;
  }

  .div_header {
    background-color: #FAFAFA;
    color: #108EE9;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    border-top: 1px solid #E9E9E9;
    border-left: 1px solid #E9E9E9;
  }
  .div_top {
    width: 100%;
    background-color: #169BD533;
  }
  .div_top .div_item {
    flex: 1;
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
    font-size: 14px;
  }

  .div_content {
    width: 100%;
    display: flex;
    flex-direction: row;
    border-left: 1px solid #E9E9E9;
  }

  .div_content .div_item {
    text-align: center;
    font-size: 14px;
  }
  :deep .el-empty {
    padding: 0px 0px !important;
  }
  :deep .avue-crud__empty {
    padding: 0px 0px !important;
  }
</style>
<style>
  .avue-dialog .el-dialog {
    display: flex;
    display: -ms-flex; /* 兼容IE */
    flex-direction: column;
    -ms-flex-direction: column; /* 兼容IE */
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
  .el-dialog .el-dialog__body{
    max-height: 100%;
    flex: 1;
    -ms-flex: 1 1 auto; /* 兼容IE */
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog__wrapper {
    /*隐藏ie和edge中遮罩的滚动条*/
    overflow: hidden;
  }

  :deep .el-card__body {
    padding-top: 10px !important;
  }

  .item_w {
   width: 200px;
  }

  .my-label {
    background: #169BD533 !important;
    text-align: center !important;
    color: #666 !important;
  }

  .my-content {
    text-align: center !important;
  }
</style>
