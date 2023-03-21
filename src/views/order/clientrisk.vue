<template>
  <basic-container>
    <el-button type="danger" @click="onLoad(true)">获取最新报告数据</el-button>
    <el-divider></el-divider>
    <avue-form :option="option"
               v-loading="loading"
               v-model="form"
               ref="form" v-if="Object.keys(dataForm).length>0">
    </avue-form>
    <div style="text-align: center;width: 100%;margin-top: 20px;" v-else>未获取风控数据，如需获取最新数据请点击左上角按钮</div>
    <el-divider></el-divider>
<!--    <avue-form :option="dataOption"-->
<!--               v-loading="loading"-->
<!--               v-model="dataForm"-->
<!--               ref="dataForm">-->
<!--    </avue-form>-->
      <template v-for="(value, key, index) in dataForm">
          <el-descriptions style="margin-bottom: 20px" :label-class-name="special[key]?special[key]:''" content-class-name="my-content"  :direction="direction[key]?direction[key]:'horizontal'"  :title="titles[key]" :column="column[key]?column[key]:2" :size="size" border v-if="Object.prototype.toString.call(value) !== '[object Number]' && titles[key]">
            <el-descriptions-item v-for="(value2, key2, index2) in value" v-if="Object.prototype.toString.call(value) === '[object Object]' && valueTitles[key2]">
                  <template slot="label">
                      {{valueTitles[key2]}}
                  </template>
                  <div >
                     <div v-if="Object.prototype.toString.call(value2) !== '[object Array]'">
                         {{valueTitles[value2]?valueTitles[value2]:(status[key2+"_"+value2]?status[key2+"_"+value2]:((value2!==''&&value2!='-1'?value2:'暂无')+((valueinfo[key2]&&valueinfo[key2].length>0)?valueinfo[key2]:"")))}}
                     </div>
                      <div v-else>
                          <el-descriptions direction="vertical" :column="4" border>
                              <template v-for="value3 of value2" >
                                  <template v-for="(value4, key4, index4) in value3" >
                                    <el-descriptions-item v-if="valueTitles[key4]" :label="valueTitles[key4]">
                                        {{valueTitles[value4]?valueTitles[value4]:(status[key4+"_"+value4]?status[key4+"_"+value4]:((value4!==''&&value4!='-1'?value4:'暂无')+((valueinfo[key4]&&valueinfo[key4].length>0)?valueinfo[key4]:"")))}}
                                    </el-descriptions-item>
                                  </template>
                              </template>
                          </el-descriptions>
                      </div>
                  </div>
              </el-descriptions-item>
              <template v-for="(value2,key2,index2) in value" v-if="Object.prototype.toString.call(value) === '[object Array]'">
                  <el-descriptions-item v-if="Object.prototype.toString.call(key2) === '[object Number]'">
                      <template slot="label">
                          {{titles[key]+(key2+1)}}
                      </template>
                      <div v-if="Object.prototype.toString.call(value2) === '[object Object]'">
                          <el-descriptions direction="vertical" :column="4" border>
                              <template v-for="(value3, key3, index3) in value2" >
                                  <el-descriptions-item v-if="valueTitles[key3]" :label="valueTitles[key3]">
                                      {{valueTitles[value3]?valueTitles[value3]:(status[key3+"_"+value3]?status[key3+"_"+value3]:((value3!==''&&value3!='-1'?value3:'暂无')+((valueinfo[key3]&&valueinfo[key3].length>0)?valueinfo[key3]:"")))}}
                                  </el-descriptions-item>
                              </template>
                          </el-descriptions>
                      </div>
                      <div v-else>
                          {{valueTitles[value2]?valueTitles[value2]:(status[key2+"_"+value2]?status[key2+"_"+value2]:((value2!==''&&value2!='-1'?value2:'暂无')+((valueinfo[key2]&&valueinfo[key2].length>0)?valueinfo[key2]:"")))}}
                      </div>
                  </el-descriptions-item>
              </template>
          </el-descriptions>
        <div v-if="JSON.stringify(value) =='[]'|| JSON.stringify(value) =='{}'|| value ==''" style="width: 100%;text-align: center;margin-bottom: 20px">
          暂无信息
        </div>
      </template>
  </basic-container>
</template>

<script>
import {getDetail} from "@/api/order/clientrisk";

export default {
  props: ["clientId"],
  data() {
    return {
      form: {},
        titles:{
            "base_info":"基本信息",
            "court_risk_info_list":"法院风险信息",
            "hit_risk_tagging":"命中风险标注",
            "personal_loan_demand":"近期贷款需求",
            "personal_loan_f":"贷款放款信息 ",
            "personal_loan_s":"贷款申请信息",
            "personal_loan_h":"贷款付款信息",
            "personal_overdue_history":"历史逾期记录",
            "relevance_risk_check":"关联风险检测",
            "risk_list_check":"风险名单检测",
            "rent_history":"历史租赁印记",
            "ident_info_dict":"身份信息核验字段",
            "suggest_cash":"押金建议",
        },
        column:{
          "court_risk_info_list":1,
            "personal_overdue_history":1
        },
        special:{
            "court_risk_info_list":"hide-class",
        },
        direction:{
            "court_risk_info_list":"vertical",
            "personal_overdue_history":"horizontal"
        },
        valueinfo:{
            "time_online":"(月)",
        },
        status:{
        "time_online_1":"[0,3）个月",
          "time_online_2":"2:[3,6）个月",
          "time_online_3":"[6,12）个月",
          "time_online_4":"[12,24）个月",
          "time_online_5":"[24,+)个月",
            "time_online_0":"查无此号或已注销",
            "time_online_-1":"不支持该运营商",
            "time_online_999":"手机状态异常（注:1、销号6月以上；2、携号转网；3、未放出去的号码）；非本网手机号码",
            "identity_two_elements_01":"不一致",
            "identity_two_elements_02":"一致",
            "network_triple_elements_01":"不一致",
            "network_triple_elements_02":"一致",
            "census_register_high_risk_area_0": "未命中",
            "idcard_hit_clzlwy_0": "未命中",
            "idcard_hit_fztj_0": "未命中",
            "idcard_hit_gywzcc_0": "未命中",
            "phone_hit_txxh_0": "未命中",
            "phone_hit_xjhm_0": "未命中",
            "result_xd_0": "未命中",
            "credit_rent_0": "未命中",
            "census_register_high_risk_area_1": "命中",
            "idcard_hit_clzlwy_1": "命中",
            "idcard_hit_fztj_1": "命中",
            "idcard_hit_gywzcc_1": "命中",
            "phone_hit_txxh_1": "命中",
            "phone_hit_xjhm_1": "命中",
            "result_xd_1": "命中",
            "credit_rent_1": "命中",
        },
        valueTitles:{
            "name": "姓名",
            "age": "年龄",
            "ident_number": "身份证号码",
            "phone": "手机号码",
            "ident_number_address": "户籍",
            "phone_address": "号码归属地",
            "goods_type": "产品类别",
            "status": "新旧",
            "total_rent": "总租金",
            "total_periods": "总期数",
            "price": "官方价格",
            "gender": "性别",
            "identity_two_elements": "实名核验",
            "network_triple_elements": "运营商核验",
            "time_online": "运营商在网时长",

            "sort_time_string": "审结日期",
            "data_type": "类型",
            "summary": "摘要说明",
            "compatibility": "匹配度",

            "m3_apply_setup_time": "近90天机构查询总数",
            "m3_apply_setup_time_xyk": "近90天信用卡",
            "m3_apply_setup_time_p2pwd": "近90天P2P平台",
            "m3_apply_setup_time_other": "近90天其他类型公司",
            "m3_apply_setup_time_ybxffq": "近90天一般消费分期平台",
            "m3_apply_setup_time_dxxfjr": "近90天大型消费金融公司",
            "m3_apply_setup_time_xedkgs": "近90天小额贷款公司",
            "d7_apply_setup_time_ybxffq": "近7天一般消费分期平台",
            "d7_apply_setup_time": "近7天机构查询总数",
            "d7_apply_setup_time_xyk": "近7天信用卡",
            "d7_apply_setup_time_p2pwd": "近7天P2P平台",
            "d7_apply_setup_time_other": "近7天其他类型公司",
            "d7_apply_setup_time_dxxfjr": "近7天大型消费金融公司",
            "d7_apply_setup_time_xedkgs": "近7天小额贷款公司",
            "m1_apply_setup_time": "近30天机构查询总数",
            "m1_apply_setup_time_xyk": "近30天信用卡",
            "m1_apply_setup_time_p2pwd": "近30天P2P平台",
            "m1_apply_setup_time_other": "近30天其他类型公司",
            "m1_apply_setup_time_ybxffq": "近30天一般消费分期平台",
            "m1_apply_setup_time_dxxfjr": "近30天大型消费金融公司",
            "m1_apply_setup_time_xedkgs": "近30天小额贷款公司",

            "cflenders": "消费分期类放款机构数",
            "lend_time_distance": "距离最近一次放款日期已有(天)",
            "lend_number1": "近1个月放款次数",
            "lend_number3": "近3个月放款次数",
            "lend_number6": "近6个月放款次数",
            "lend_number12": "近12个月放款次数",
            "lend_number24": "近24个月放款次数",
            "lend_money1": "近1个月放款金额",
            "lend_money3": "近3个月放款金额",
            "lend_money6": "近6个月放款金额",
            "lend_money12": "近12个月放款金额",
            "lend_money24": "近24个月放款金额",
            "lend_time": "最近一次放款时间",
            "lenders": "近24个月放款机构总数",
            "nllenders": "网络贷款类放款机构数",

            "repay_fail1": "近1个月付款异常次数",
            "repay_fail3": "近3个月付款异常次数",
            "repay_fail6": "近6个月付款异常次数",
            "repay_fail12": "近12个月付款异常次数",
            "repay_fail24": "近24个月付款异常次数",
            "repay_succ1": "近1个月履约次数",
            "repay_succ3": "近3个月履约次数",
            "repay_succ6": "近6个月履约次数",
            "repay_succ12": "近12个月履约次数",
            "repay_succ24": "近24个月履约次数",
            "repay_money1": "近1个月履约金额",
            "repay_money3": "近3个月履约金额",
            "repay_money6": "近6个月履约金额",
            "repay_money12": "近12个月履约金额",
            "repay_money24": "近24个月履约金额",

            "apply_mechanism_number": "近12个月申请机构总数",
            "apply_time1": "近1个月申请次数",
            "apply_time3": "近3个月申请次数",
            "apply_time6": "近6个月申请次数",
            "apply_time12": "近12个月申请次数",
            "consumer_apply_mechanism_number": "消费分期类申请机构数",
            "last_apply_time_distance": "距离最近一次申请日期已有(天)",
            "last_apply_time": "最近一次申请日期",
            "network_loan_apply_mechanis_mnumber": "网络贷款类申请机构数",

            "datalist": "逾期详情",
            "counts": "近6个月逾期总次数",
            "overdue_mechanism_number": "近6个月逾期机构总数",
            "overdue_money": "近6个月逾期总金额（元）",
            "uncleared_counts": "近6个月逾期未结清次数	",
            "count": "逾期天数 (S:单期 M:多期)",
            "amount": "逾期金额区间（元）",
            "date": "逾期时间",
            "settlement": "是否结清，N否，Y是",

            "m3_idcard_to_phone_time": "3个月身份证关联手机号次数",
            "m3_phone_to_idcard_time": "3个月手机号关联身份证次数",

            "census_register_high_risk_area": "归属地位于高风险集中地区",
            "idcard_hit_clzlwy": "车辆租赁违约名单",
            "idcard_hit_fztj": "犯罪通缉名单",
            "idcard_hit_gywzcc": "故意违章乘车名单",
            "phone_hit_txxh": "通信小号库",
            "phone_hit_xjhm": "虚假号码库",
            "result_xd": "特殊关注名单",
            "credit_rent": "信用租赁风险名单",
            "d7_apply_time": "近7天申请租赁次数",
            "m1_apply_time": "近1个月申请租赁次数",
            "m3_apply_time": "近3个月申请租赁次数",
            "m6_apply_time": "近6个月申请租赁次数",
            "m12_apply_time": "近12个月申请租赁次数",
            "d7_apply_agency_time": "近7天申请租赁机构数",
            "m1_apply_agency_time": "近1个月申请租赁机构数",
            "m3_apply_agency_time": "近3个月申请租赁机构数",
            "m6_apply_agency_time": "近6个月申请租赁机构数",
            "m12_apply_agency_time": "近12个月申请租赁机构数",
            "cpws": "裁判文书",
            "ktgg": "开庭公告",
            "ajlc": "案件流程信息",
            "fygg": "法院公告",
            "shixin": "失信公告",
            "zxgg": "执行公告",
            "bgt": "曝光台",
        },
      dataForm: {},
      loading: true,
        time:0,
      option: {
        detail: true,
        height: 'auto',
        calcHeight: 210,
        tip: false,
        border: true,
        labelWidth: 120,
        column: [
          {
            label: "查询订单号",
            span: 24,
            prop: "respOrder"
          },
          {
            label: "返回代码",
            prop: "respCode"
          },
          {
            label: "返回信息",
            prop: "respMsg"
          },
          {
            label: "查询时间",
            prop: "updateTime"
          },
          {
            label: "审核建议",
            prop: "verifyRecomment"
          },
          {
            label: "风控分数",
            prop: "scoreNormExplain"
          },
          {
            label: "押金建议",
            prop: "suggestCash"
          },
        ]
      },
      dataOption: {
        detail: true,
        height: 'auto',
        calcHeight: 210,
        tip: false,
        border: true,
        labelWidth: 250,
        group:[
          {
            label: '基本信息',
            icon:'el-icon-info',
            collapse: true,
            prop: 'base_info',
            column: [
              {
                label: "姓名",
                prop: "name",
                bind: "base_info.name",
              },
              {
                label: "年龄",
                prop: "age",
                bind: "base_info.age",
              },
              {
                label: "性别",
                prop: "gender",
                bind: "base_info.gender",
              },
              {
                label: "身份证号码",
                prop: "ident_number",
                bind: "base_info.ident_number",
              },
              {
                label: "手机号码",
                prop: "phone",
                bind: "base_info.phone",
              },
              {
                label: "户籍",
                prop: "ident_number_address",
                bind: "base_info.ident_number_address",
              },
              {
                label: "号码归属地",
                prop: "phone_address",
                bind: "base_info.phone_address",
              },
              {
                label: "产品类别",
                prop: "goods_type",
                bind: "base_info.goods_type",
              },
              {
                label: "新旧",
                prop: "status",
                bind: "base_info.status",
              },
              {
                label: "总租金",
                prop: "total_rent",
                bind: "base_info.total_rent",
              },
              {
                label: "总期数",
                prop: "total_periods",
                bind: "base_info.total_periods",
              },
              {
                label: "官方价格",
                prop: "price",
                bind: "base_info.price",
              },
            ]
          },
          {
            label: '身份信息核验字段',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "实名核验",
                prop: "identity_two_elements",
                bind: "ident_info_dict.identity_two_elements",
                type: "select",
                dicData: [
                  {
                    label: "不一致",
                    value: "01"
                  },
                  {
                    label: "一致",
                    value: "02"
                  }
                ],
              },
              {
                label: "运营商核验",
                prop: "network_triple_elements",
                bind: "ident_info_dict.network_triple_elements",
                type: "select",
                dicData: [
                  {
                    label: "不一致",
                    value: "01"
                  },
                  {
                    label: "一致",
                    value: "02"
                  }
                ],
              },
              {
                label: "运营商核验",
                prop: "time_online",
                bind: "ident_info_dict.time_online",
                type: "select",
                dicData: [
                  {
                    label: "不支持该运营商",
                    value: "-1"
                  },
                  {
                    label: "查无此号或已注销",
                    value: "0"
                  },
                  {
                    label: "0-3年",
                    value: "1"
                  },
                  {
                    label: "3-6年",
                    value: "2"
                  },
                  {
                    label: "6-12年",
                    value: "3"
                  },
                  {
                    label: "12-24年",
                    value: "4"
                  },
                  {
                    label: "24+年",
                    value: "5"
                  },
                  {
                    label: "手机状态异常",
                    value: "999"
                  },
                ],
              },
            ]
          },
          {
            label: '命中风险标注',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                labelWidth: 0,
                type:'array',
                span: 24,
                prop: "hit_risk_tagging",
              },
            ]
          },
          {
            label: '法院风险信息',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                labelWidth: 0,
                type: 'dynamic',
                align: 'center',
                span: 24,
                prop: 'court_risk_info_list',
                headerAlign: 'center',
                children: {
                  column: [
                    {
                      label: "审结日期",
                      width: 180,
                      prop: "sort_time_string",
                      bind: "court_risk_info_list.sort_time_string"
                    },
                    {
                      label: "类型",
                      width: 150,
                      prop: "data_type",
                      bind: "court_risk_info_list.data_type",
                      type: "select",
                      dicData: [
                        {
                          label: "裁判文书",
                          value: "cpws"
                        },
                        {
                          label: "开庭公告",
                          value: "ktgg"
                        },
                        {
                          label: "案件流程信息",
                          value: "ajlc"
                        },
                        {
                          label: "法院公告",
                          value: "fygg"
                        },
                        {
                          label: "失信公告",
                          value: "shixin"
                        },
                        {
                          label: "执行公告",
                          value: "zxgg"
                        },
                        {
                          label: "曝光台",
                          value: "bgt"
                        }
                      ],
                    },
                    {
                      label: "摘要说明",
                      prop: "summary",
                      bind: "court_risk_info_list.summary"
                    },
                    {
                      label: "匹配度",
                      width: 100,
                      prop: "compatibility",
                      bind: "court_risk_info_list.compatibility"
                    },
                  ]
                }
              }
            ]
          },
          {
            label: '近期贷款需求',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "近7天一般消费分期平台",
                prop: "d7_apply_setup_time_ybxffq",
                bind: "personal_loan_demand.d7_apply_setup_time_ybxffq"
              },
              {
                label: "近7天机构查询总数",
                prop: "d7_apply_setup_time",
                bind: "personal_loan_demand.d7_apply_setup_time"
              },
              {
                label: "近7天信用卡",
                prop: "d7_apply_setup_time_xyk",
                bind: "personal_loan_demand.d7_apply_setup_time_xyk"
              },
              {
                label: "近7天P2P平台",
                prop: "d7_apply_setup_time_p2pwd",
                bind: "personal_loan_demand.d7_apply_setup_time_p2pwd"
              },
              {
                label: "近7天其他类型公司",
                prop: "d7_apply_setup_time_other",
                bind: "personal_loan_demand.d7_apply_setup_time_other"
              },
              {
                label: "近7天大型消费金融公司",
                prop: "d7_apply_setup_time_dxxfjr",
                bind: "personal_loan_demand.d7_apply_setup_time_dxxfjr"
              },
              {
                label: "近7天小额贷款公司",
                row: true,
                prop: "d7_apply_setup_time_xedkgs",
                bind: "personal_loan_demand.d7_apply_setup_time_xedkgs"
              },
              {
                label: "近30天机构查询总数",
                prop: "m1_apply_setup_time",
                bind: "personal_loan_demand.m1_apply_setup_time"
              },
              {
                label: "近30天信用卡",
                prop: "m1_apply_setup_time_xyk",
                bind: "personal_loan_demand.m1_apply_setup_time_xyk"
              },
              {
                label: "近30天P2P平台",
                prop: "m1_apply_setup_time_p2pwd",
                bind: "personal_loan_demand.m1_apply_setup_time_p2pwd"
              },
              {
                label: "近30天其他类型公司",
                prop: "m1_apply_setup_time_other",
                bind: "personal_loan_demand.m1_apply_setup_time_other"
              },
              {
                label: "近30天一般消费分期平台",
                prop: "m1_apply_setup_time_ybxffq",
                bind: "personal_loan_demand.m1_apply_setup_time_ybxffq"
              },
              {
                label: "近30天大型消费金融公司",
                prop: "m1_apply_setup_time_dxxfjr",
                bind: "personal_loan_demand.m1_apply_setup_time_dxxfjr"
              },
              {
                label: "近30天小额贷款公司",
                row: true,
                prop: "m1_apply_setup_time_xedkgs",
                bind: "personal_loan_demand.m1_apply_setup_time_xedkgs"
              },
              {
                label: "近90天机构查询总数",
                prop: "m3_apply_setup_time",
                bind: "personal_loan_demand.m3_apply_setup_time"
              },
              {
                label: "近90天信用卡",
                prop: "m3_apply_setup_time_xyk",
                bind: "personal_loan_demand.m3_apply_setup_time_xyk"
              },
              {
                label: "近90天P2P平台",
                prop: "m3_apply_setup_time_p2pwd",
                bind: "personal_loan_demand.m3_apply_setup_time_p2pwd"
              },
              {
                label: "近90天其他类型公司",
                prop: "m3_apply_setup_time_other",
                bind: "personal_loan_demand.m3_apply_setup_time_other"
              },
              {
                label: "近90天一般消费分期平台",
                prop: "m3_apply_setup_time_ybxffq",
                bind: "personal_loan_demand.m3_apply_setup_time_ybxffq"
              },
              {
                label: "近90天大型消费金融公司",
                prop: "m3_apply_setup_time_dxxfjr",
                bind: "personal_loan_demand.m3_apply_setup_time_dxxfjr"
              },
              {
                label: "近90天小额贷款公司",
                prop: "m3_apply_setup_time_xedkgs",
                bind: "personal_loan_demand.m3_apply_setup_time_xedkgs"
              },
            ]
          },
          {
            label: '贷款申请信息',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "近12个月申请机构总数",
                prop: "apply_mechanism_number",
                bind: "personal_loan_s.apply_mechanism_number"
              },
              {
                label: "近1个月申请次数",
                prop: "apply_time1",
                bind: "personal_loan_s.apply_time1"
              },
              {
                label: "近3个月申请次数",
                prop: "apply_time3",
                bind: "personal_loan_s.apply_time3"
              },
              {
                label: "近6个月申请次数",
                prop: "apply_time6",
                bind: "personal_loan_s.apply_time6"
              },
              {
                label: "近12个月申请次数",
                prop: "apply_time12",
                bind: "personal_loan_s.apply_time12"
              },
              {
                label: "消费分期类申请机构数",
                prop: "consumer_apply_mechanism_number",
                bind: "personal_loan_s.consumer_apply_mechanism_number"
              },
              {
                label: "距离最近一次申请日期已有(天)",
                prop: "last_apply_time_distance",
                bind: "personal_loan_s.last_apply_time_distance"
              },
              {
                label: "最近一次申请日期",
                prop: "last_apply_time",
                bind: "personal_loan_s.last_apply_time"
              },
              {
                label: "网络贷款类申请机构数",
                prop: "network_loan_apply_mechanis_mnumber",
                bind: "personal_loan_s.network_loan_apply_mechanis_mnumber"
              },
            ]
          },
          {
            label: '贷款放款信息',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "消费分期类放款机构数",
                prop: "cflenders",
                bind: "personal_loan_f.cflenders",
              },
              {
                label: "距离最近一次放款日期已有(天)",
                prop: "lend_time_distance",
                bind: "personal_loan_f.lend_time_distance",
              },
              {
                label: "近1个月放款次数",
                prop: "lend_number1",
                bind: "personal_loan_f.lend_number1",
              },
              {
                label: "近3个月放款次数",
                prop: "lend_number3",
                bind: "personal_loan_f.lend_number3",
              },
              {
                label: "近6个月放款次数",
                prop: "lend_number6",
                bind: "personal_loan_f.lend_number6",
              },
              {
                label: "近12个月放款次数",
                prop: "lend_number12",
                bind: "personal_loan_f.lend_number12",
              },
              {
                label: "近24个月放款次数",
                prop: "lend_number24",
                bind: "personal_loan_f.lend_number24",
              },
              {
                label: "近1个月放款金额",
                prop: "lend_money1",
                bind: "personal_loan_f.lend_money1",
              },
              {
                label: "近3个月放款金额",
                prop: "lend_money3",
                bind: "personal_loan_f.lend_money3",
              },
              {
                label: "近6个月放款金额",
                prop: "lend_money6",
                bind: "personal_loan_f.lend_money6",
              },
              {
                label: "近12个月放款金额",
                prop: "lend_money12",
                bind: "personal_loan_f.lend_money12",
              },
              {
                label: "近24个月放款金额",
                prop: "lend_money24",
                bind: "personal_loan_f.lend_money24",
              },
              {
                label: "最近一次放款时间",
                prop: "lend_time",
                bind: "personal_loan_f.lend_time",
              },
              {
                label: "近24个月放款机构总数",
                prop: "lenders",
                bind: "personal_loan_f.lenders",
              },
              {
                label: "网络贷款类放款机构数",
                prop: "nllenders",
                bind: "personal_loan_f.nllenders",
              },
            ]
          },
          {
            label: '贷款付款信息',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "近1个月付款异常次数",
                prop: "repay_fail1",
                bind: "personal_loan_h.repay_fail1"
              },
              {
                label: "近3个月付款异常次数",
                prop: "repay_fail3",
                bind: "personal_loan_h.repay_fail3"
              },
              {
                label: "近6个月付款异常次数",
                prop: "repay_fail6",
                bind: "personal_loan_h.repay_fail6"
              },
              {
                label: "近12个月付款异常次数",
                prop: "repay_fail12",
                bind: "personal_loan_h.repay_fail12"
              },
              {
                label: "近24个月付款异常次数",
                prop: "repay_fail24",
                bind: "personal_loan_h.repay_fail24"
              },
              {
                label: "近1个月履约次数",
                prop: "repay_succ1",
                bind: "personal_loan_h.repay_succ1"
              },
              {
                label: "近3个月履约次数",
                prop: "repay_succ3",
                bind: "personal_loan_h.repay_succ3"
              },
              {
                label: "近6个月履约次数",
                prop: "repay_succ6",
                bind: "personal_loan_h.repay_succ6"
              },
              {
                label: "近12个月履约次数",
                prop: "repay_succ12",
                bind: "personal_loan_h.repay_succ12"
              },
              {
                label: "近24个月履约次数",
                prop: "repay_succ24",
                bind: "personal_loan_h.repay_succ24"
              },
              {
                label: "近1个月履约金额",
                prop: "repay_money1",
                bind: "personal_loan_h.repay_money1"
              },
              {
                label: "近3个月履约金额",
                prop: "repay_money3",
                bind: "personal_loan_h.repay_money3"
              },
              {
                label: "近6个月履约金额",
                prop: "repay_money6",
                bind: "personal_loan_h.repay_money6"
              },
              {
                label: "近12个月履约金额",
                prop: "repay_money12",
                bind: "personal_loan_h.repay_money12"
              },
              {
                label: "近24个月履约金额",
                prop: "repay_money24",
                bind: "personal_loan_h.repay_money24"
              },
            ]
          },
          {
            label: '历史逾期记录',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "近6个月逾期总次数",
                prop: "counts",
                bind: "personal_overdue_history.counts"
              },
              {
                label: "近6个月逾期机构总数",
                prop: "overdue_mechanism_number",
                bind: "personal_overdue_history.overdue_mechanism_number"
              },
              {
                label: "近6个月逾期总金额（元）",
                prop: "overdue_money",
                bind: "personal_overdue_history.overdue_money"
              },
              {
                label: "近6个月逾期未结清次数",
                prop: "uncleared_counts",
                bind: "personal_overdue_history.uncleared_counts"
              },
              {
                labelWidth: 0,
                type: 'dynamic',
                align: 'center',
                span: 24,
                prop: 'datalist',
                bind: 'personal_overdue_history.datalist',
                headerAlign: 'center',
                children: {
                  column: [
                    {
                      label: "逾期天数",
                      prop: "count",
                      bind: "personal_overdue_history.datalist.count"
                    },
                    {
                      label: "逾期金额区间（元）",
                      prop: "amount",
                      bind: "personal_overdue_history.datalist.amount"
                    },
                    {
                      label: "逾期时间",
                      prop: "date",
                      bind: "personal_overdue_history.datalist.date"
                    },
                    {
                      label: "是否结清",
                      prop: "settlement",
                      bind: "personal_overdue_history.datalist.settlement",
                      type: "select",
                      dicData: [
                        {
                          label: "是",
                          value: "Y"
                        },
                        {
                          label: "否",
                          value: "N"
                        },
                      ]
                    },
                  ]
                }
              }
            ],
          },
          {
            label: '关联风险检测',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "3个月身份证关联手机号次数",
                prop: "m3_idcard_to_phone_time",
                bind: "relevance_risk_check.m3_idcard_to_phone_time"
              },
              {
                label: "3个月手机号关联身份证次数",
                prop: "m3_phone_to_idcard_time",
                bind: "relevance_risk_check.m3_phone_to_idcard_time"
              },
            ]
          },
          {
            label: '风险名单检测',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "归属地位于高风险集中地区",
                prop: "census_register_high_risk_area",
                bind: "risk_list_check.census_register_high_risk_area",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "车辆租赁违约名单",
                prop: "idcard_hit_clzlwy",
                bind: "risk_list_check.idcard_hit_clzlwy",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "犯罪通缉名单",
                prop: "idcard_hit_fztj",
                bind: "risk_list_check.idcard_hit_fztj",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "故意违章乘车名单",
                prop: "idcard_hit_gywzcc",
                bind: "risk_list_check.idcard_hit_gywzcc",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "通信小号库",
                prop: "phone_hit_txxh",
                bind: "risk_list_check.phone_hit_txxh",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "虚假号码库",
                prop: "phone_hit_xjhm",
                bind: "risk_list_check.phone_hit_xjhm",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "特殊关注名单",
                prop: "result_xd",
                bind: "risk_list_check.result_xd",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
              {
                label: "信用租赁风险名单",
                prop: "credit_rent",
                bind: "risk_list_check.credit_rent",
                type: "select",
                dicData: [
                  {
                    label: "未命中",
                    value: 0
                  },
                  {
                    label: "命中",
                    value: 1
                  },
                ]
              },
            ]
          },
          {
            label: '历史租赁印记',
            icon:'el-icon-info',
            collapse:true,
            column: [
              {
                label: "近7天申请租赁次数",
                prop: "d7_apply_time",
                bind: "rent_history.d7_apply_time",
              },
              {
                label: "近1个月申请租赁次数",
                prop: "m1_apply_time",
                bind: "rent_history.m1_apply_time",
              },
              {
                label: "近3个月申请租赁次数",
                prop: "m3_apply_time",
                bind: "rent_history.m3_apply_time",
              },
              {
                label: "近6个月申请租赁次数",
                prop: "m6_apply_time",
                bind: "rent_history.m6_apply_time",
              },
              {
                label: "近12个月申请租赁次数",
                prop: "m12_apply_time",
                bind: "rent_history.m12_apply_time",
              },
              {
                label: "近7天申请租赁机构数",
                prop: "d7_apply_agency_time",
                bind: "rent_history.d7_apply_agency_time",
              },
              {
                label: "近1个月申请租赁机构数",
                prop: "m1_apply_agency_time",
                bind: "rent_history.m1_apply_agency_time",
              },
              {
                label: "近3个月申请租赁机构数",
                prop: "m3_apply_agency_time",
                bind: "rent_history.m3_apply_agency_time",
              },
              {
                label: "近6个月申请租赁机构数",
                prop: "m6_apply_agency_time",
                bind: "rent_history.m6_apply_agency_time",
              },
              {
                label: "近12个月申请租赁机构数",
                prop: "m12_apply_agency_time",
                bind: "rent_history.m12_apply_agency_time",
              },
            ]
          },
        ]
      },
    };
  },
  mounted() {
    this.onLoad(false);
  },
  methods: {
    onLoad(isNew){
      this.loading = true;
      // this.$refs.form.resetForm();
      // this.$refs.dataForm.resetForm();
        this.time = new Date().getTime()
      getDetail(this.clientId,isNew).then(res => {
        this.form = res.data.data;
        if (this.form.respData){
          this.dataForm = JSON.parse(this.form.respData);
        }
        console.log(new Date().getTime() - this.time)
          this.time = new Date().getTime()
        if (this.dataForm&&this.dataForm.personal_overdue_history&&this.dataForm.personal_overdue_history.datalist){
          this.dataForm.personal_overdue_history.datalist.forEach((d, index) => {
            let num = d.count.replace(/[^\d]/g, " ");
            let type;
            let days;
            if(d.count.indexOf("S") > -1){
              days = 7;
              type = "现金贷";
            }else{
              days = 30;
              type = "消费分期";
            }

            let count = (num * days) + "-" + (num * days + days) + "天";
            d.count = type+count;

          });
        }
          console.log(new Date().getTime() - this.time)
          this.time = new Date().getTime()
        this.loading = false;
      });
    }
  },
  watch: {
    clientId: function () {
      this.onLoad(false);
    }
  }
};
</script>

<style>
.el-button el-button--primary el-button--mini is-disabled is-circle{
  display:none;
}
.hide-class{
    display: none;
}
</style>
