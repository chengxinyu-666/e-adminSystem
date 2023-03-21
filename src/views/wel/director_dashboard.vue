<template>
  <basic-container>
    <div class="wel">
      <div style="width: 50%">
        <avue-data-tabs :option="option"></avue-data-tabs>
      </div>
      <div style="width: 50%;padding-top: 10px">
        <div>
          <div class="el-row" span="24">
            <div class="el-col el-col-24 el-col-xs-24 el-col-sm-12 el-col-md-12" style="margin-bottom: 0px !important;">
              <div class="item" style="background-color: rgb(49, 180, 141);">
                <div class="item-box" style="display: block;">
                  <div style="display: inline">
                    <span  class="item-title2">总发货数：</span>
                    <span class="item-count">{{ statistics.sendCount }}</span>
                  </div>
                  <div class="item-title">昨日:{{ statistics.yesterdaySendCount?statistics.yesterdaySendCount:0 }} 今日:{{ statistics.todaySendCount?statistics.todaySendCount:0 }}</div>
                  <i class="item-icon el-icon-s-goods"></i></div>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-24 el-col-sm-12 el-col-md-12" style="margin-bottom: 0px !important;">
              <div class="item" style="background-color: rgb(0, 166, 90);">
                <div class="item-box">
                  <div style="display: inline">
                    <span class="item-title2">在租单数：</span>
                    <span class="item-count">{{ statistics.rentRount }}</span>
                  </div>
                  <div class="item-title">昨日:{{ statistics.yesterdayRentCount?statistics.yesterdayRentCount:0 }} 今日:{{ statistics.todayRentCount?statistics.todayRentCount:0 }}</div>
                  <i class="item-icon el-icon-set-up"></i></div>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-24 el-col-sm-12 el-col-md-12" style="margin-bottom: 0px !important;">
              <div class="item" style="background-color: rgb(243, 156, 18);">
                <div class="item-box">
                  <div style="display: inline">
                    <span class="item-title2">待发货单数：</span>
                    <span class="item-count">{{ statistics.waitSend }}</span>
                  </div>
                  <div class="item-title">昨日:{{ statistics.yesterdayWaitSend }} 今日:{{ statistics.todayWaitSend }}</div>
                  <i class="item-icon el-icon-shopping-cart-full"></i>
                </div>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-24 el-col-sm-12 el-col-md-12" style="margin-bottom: 0px !important;">
              <div class="item" style="background-color: rgb(255,0,0);">
                <div class="item-box">
                  <div style="display: inline">
                    <span class="item-title2">逾期单数：</span>
                    <span class="item-count">{{ statistics.overdueNum }}</span>
                  </div>
                  <div class="item-title">昨日:{{ statistics.yesterdayOverdueNum }} 今日:{{ statistics.todayOverdueNum }}</div>
                  <i class="item-icon el-icon-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-row  :gutter="20" >
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" style="padding-top: 10px;padding-bottom: 10px">
            <span>待处理事务</span>
          </div>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic title="待支付打单">
                  <template slot="formatter"> {{ statistics.waitPayOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="租用中订单">
                  <template slot="formatter">  {{ statistics.rentOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="."  title="初始化订单">
                  <template slot="formatter">  {{ statistics.initOrder }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" title="待审核订单">
                  <template slot="formatter">  {{ statistics.waitExamineOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="待收货订单">
                  <template slot="formatter">  {{ statistics.waitReciveOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="." title="己完结订单">
                  <template slot="formatter">  {{ statistics.endOrder }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2"  title="待发货订单">
                  <template slot="formatter">  {{ statistics.waitSendOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="已逾期订单">
                  <template slot="formatter">  {{ statistics.overdueOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="." title="已取消订单">
                  <template slot="formatter">  {{ statistics.cancleSend_order }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" >
          <div slot="header" class="clearfix" style="padding-top: 10px;padding-bottom: 10px">
            <span>财务数据</span>
          </div>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" title="己签收订单总数">
                  <template slot="formatter">  {{ statistics.receivedOrder }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="累计订单逾期率">
                  <template slot="formatter">  {{ toFixed(Number.parseFloat(statistics.overdueScale?statistics.overdueScale:"0")*100 )}} %</template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="."  title="实际投入资金">
                  <template slot="formatter">  {{ statistics.inMoney }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2"  title="己货收订单总租金">
                  <template slot="formatter">  {{ statistics.receivedMoney }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="实际资金逾期率">
                  <template slot="formatter">  {{ toFixed(Number.parseFloat(statistics.overdue_money)/(Number.parseFloat(statistics.backAllMoney)+Number.parseFloat(statistics.waitBackMoney))*100 ) }}%  </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="." title="己收回总资金">
                  <template slot="formatter">  {{ statistics.backAllMoney }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" title="待回收逾期资金">
                  <template slot="formatter">  {{ statistics.overdueNoBackMoney }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="待收回未逾期总资金">
                  <template slot="formatter">  {{ statistics.noOverdueNoBackMoney }} </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic group-separator="," :precision="2" decimal-separator="." title="待收回总资金">
                  <template slot="formatter">  {{ statistics.waitBackMoney }} </template>
<!--                  <template slot="prefix">-->
<!--                    <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                  </template>-->
<!--                  <template slot="suffix">-->
<!--                    <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                  </template>-->
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>


    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <div>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix" style="padding-top: 10px;padding-bottom: 10px">
              <span>商品总览</span>
            </div>
            <div>

              <el-row :gutter="20" style="margin-top: 10px;">
                <el-col :span="8">
                  <div>
                    <el-statistic group-separator="," :precision="2" title="未上架">
                      <template slot="formatter">  {{ statistics.noShelves }} </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-statistic title="已上架">
                      <template slot="formatter">  {{ statistics.shelves }} </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-statistic group-separator="," :precision="2" decimal-separator="." title="总商品">
                      <template slot="formatter">  {{ (statistics.shelves?Number.parseInt(statistics.shelves):0)+(statistics.noShelves?Number.parseInt(statistics.noShelves):0) }} </template>
<!--                      <template slot="prefix">-->
<!--                        <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                      </template>-->
<!--                      <template slot="suffix">-->
<!--                        <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                      </template>-->
                    </el-statistic>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix" style="padding-top: 10px;padding-bottom: 10px">
              <span>用户总览</span>
            </div>
            <div>

              <el-row :gutter="20" style="margin-top: 10px;">
                <el-col :span="8">
                  <div>
                    <el-statistic group-separator="," :precision="2" title="今日新增用户">
                      <template slot="formatter">  {{ statistics.todayUser }} </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-statistic title="总交易用户">
                      <template slot="formatter">  {{ statistics.allRentUser }} </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-statistic group-separator="," :precision="2" decimal-separator="." title="总用户数">
                      <template slot="formatter">  {{ statistics.allUser }} </template>
<!--                      <template slot="prefix">-->
<!--                        <i class="el-icon-s-flag" style="color: red"></i>-->
<!--                      </template>-->
<!--                      <template slot="suffix">-->
<!--                        <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--                      </template>-->
                    </el-statistic>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </basic-container>
</template>

<script>
  import {homeStatistics} from "../../api/order/order";
  import {toFixed} from "../../constant/goods/constant";

  export default {
    name: "director_dashboard",
    data() {
      return {
        like: true,
        value1: 4154.564,
        value2: 2222,
        title: '今年的增长',
        statistics:{},
        option: {
          span: 12,
          data: [
            {
              click: function (item) {
                // alert(JSON.stringify(item));
              },
              title: '总订单数',
              subtitle: '实时',
              count: 0,
              allcount: "昨日：0",
              text: '今日：0',
              color: 'rgb(27, 201, 142)',
              key: '单'
            },
            {
              click: function (item) {
                // alert(JSON.stringify(item));
              },
              title: '总销售额',
              subtitle: '实时',
              count: 0,
              allcount: "昨日：0",
              text: '今日：0',
              color: 'rgb(230, 71, 88)',
              key: '额'
            }
          ]
        },
      }
    },
    mounted() {
      homeStatistics().then(res => {
        const data = res.data.data;
        this.statistics = data;
        this.option.data[0].count = data.allOrder
        this.option.data[0].allcount = "昨日："+data.yesterdayOrder
        this.option.data[0].text = "今日："+data.todayOrder

        this.option.data[1].count = data.allMoney
        this.option.data[1].allcount = "昨日："+(data.yesterdayMoney?data.yesterdayMoney:0)
        this.option.data[1].text = "今日："+(data.todayMoney?data.todayMoney:0)
      }).catch(res => {

      })

    },
    methods:{
      toFixed(value){
        return toFixed(value,2)
      },
    }
  }
</script>

<style scoped>
  .wel {
    display: flex;
    width: 100%;
  }

  :deep .avue-data-rotate .item-more {
    display: none !important;
  }

  :deep .avue-data-rotate .item-icon {
    font-size: 35px;
  }

  :deep .avue-data-rotate .item-count {
    margin-bottom: 0px;
    font-size: 24px;
    font-weight: 240;
  }

  :deep .avue-data-rotate .item {
    margin-bottom: 0px
  }

  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }

  .item {
    margin: 5px 10px;
    box-sizing: border-box;
    position: relative;
    color: #fff;
    border-radius: 3px;
  }

  .item-box {
    padding: 10px 20px;
    display: block;
  }

  .item-count {
    margin-bottom: 5px;
    font-size: 21px;
    white-space: nowrap;
    font-weight: 300;
  }

  .item-title {
    font-size: 13px;
    margin-top: 9px;
  }

  .item-title2 {
    font-size: 16px;
  }

  .item-icon {
    transition: all .3s linear;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 35px;
    color: rgba(0,0,0,.15);
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
