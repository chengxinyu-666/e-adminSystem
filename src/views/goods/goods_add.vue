<template>
  <div style="height: 100%;">
    <div v-loading="loading" style="height:100%;width:100%;z-index: 100;position: absolute" v-if="loading"></div>
    <div>
      <el-form ref="form1" :model="sales" label-width="120px" :rules="rules" size="small">
        <div class="top-bar-title top">
          <div style="line-height: 30px;text-align: center;">
            新增商品
          </div>
          <div>
            <el-button plain @click="saveGoods(-1)" size="mini">返回</el-button>
            <el-button type="primary" @click="saveGoods(0)" size="mini" plain>保存</el-button>
            <el-button type="warning" @click="saveGoods(1)" size="mini" plain>上架</el-button>
            <el-button type="info" @click="saveGoods(2)" size="mini" plain>下架</el-button>
            <el-button type="info" @click="saveGoods(3)" size="mini" plain>草稿</el-button>
          </div>
        </div>
        <div>
          <el-card class="basis-info" style="margin-top: 56px;">
            <div slot="header" class="clearfix">
              <span>基础信息</span>
            </div>
            <div class="form-view">
              <div style="width: 1000px;">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="一级类目：" prop="levelFirstCategoryId">
                      <el-select v-model="sales.levelFirstCategoryId" placeholder="请选择类目">
                        <el-option :label="category.name" v-for="category in this.levelFirstCategoryId" :value="category.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="二级类目：" prop="levelSecondCategoryId">
                      <el-select v-model="sales.levelSecondCategoryId" placeholder="请选择类目">
                        <el-option :label="category.name" v-for="category in this.levelSecondCategoryId" :value="category.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="商品标题：" prop="title">
                      <el-input v-model="sales.title"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="0">
                    <el-form-item label="网络类型：" prop="phonenumber">
                      <el-select v-model="sales.network" placeholder="请选择网络类型">
                        <el-option :label="network.dictValue" v-for="network in this.newWorks"
                                   :value="network.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="营销语句：">
                  <el-input v-model="sales.marketing"></el-input>
                </el-form-item>
                <el-form-item label="商品成色：">
                  <el-radio-group v-model="sales.oldNew">
                    <el-radio label="0">全新</el-radio>
                    <el-radio label="1">二手</el-radio>
                  </el-radio-group>
                  <span style="margin-left: 20px">成色</span>
                  <el-select v-model="sales.secondHand" placeholder="请选择成色" style="width: auto;margin-left: 10px"
                             :disabled="sales.oldNew=='0'">
                    <el-option :label="hand.dictValue" v-for="hand in this.hands" :value="hand.dictKey"></el-option>
                  </el-select>
                  <span style="margin-left: 20px">折扣率{{ sales.secondHand }}%</span>
                </el-form-item>

                <el-form-item label="类目标签：">
                  <el-tag
                    :key="tag"
                    v-for="tag in sales.tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="sales.inputVisible"
                    v-model="sales.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 自定义标签</el-button>
                </el-form-item>
                <el-form-item label="营销角标：">
                  <el-input v-model="sales.marketingCornerMark"></el-input>
                </el-form-item>
                <el-form-item label="增值服务：">
                  <el-select v-model="sales.extraService" multiple placeholder="请选择">
                    <el-option
                      v-for="item in extraServices"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="归还地址：" prop="returnAddressId">
                  <el-select v-model="sales.returnAddressId" placeholder="请选择归还地址">
                    <el-option :label="address.name+' '+address.phone+' '+address.address"
                               v-for="address in this.returnAddresses" :value="address.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="租赁说明：" prop="leaseExplainId">
                  <el-select v-model="sales.leaseExplainId" placeholder="请选择租赁说明">
                    <el-option :label="rentinfo.name" v-for="rentinfo in this.rentinfos" :value="rentinfo.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售后维修说明：" prop="afterSaleId">
                  <el-select v-model="sales.afterSaleId" placeholder="请选择售后维修说明">
                    <el-option :label="mainTinInfo.name" v-for="mainTinInfo in this.mainTainInfos"
                               :value="mainTinInfo.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否包邮：" prop="expressFree">
                      <el-select v-model="sales.expressFree" placeholder="请选择是否包邮">
                        <el-option :label="express.label" v-for="express in this.expressList"
                                   :value="express.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮费：" :span="12" prop="expressPrice">
                      <el-input v-model="sales.expressPrice"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="指定用户可见：">
                  <el-input v-model="sales.limitUser" placeholder="输入手机号（多个英文逗号隔开），即可指定该商品只有这个手机号可见"></el-input>
                </el-form-item>
              </div>
            </div>
          </el-card>
          <el-card class="basis-info">
            <div slot="header" class="clearfix">
              <span>销售信息</span>
            </div>
            <div class="form-view">
              <div style="width: 1000px;">
                <el-form-item label="期数单位：">
                  <div style="display: inline-block;" class="has-background">
                    <div class="has-background-item">
                      <el-radio-group v-model="sales.periodType">
                        <el-radio label="2">以月为单位</el-radio>
<!--                        <el-radio label="1">以日为单位</el-radio>-->
                      </el-radio-group>
<!--                      <span class="form-input-title" >账单周期:</span>-->
<!--                      <el-input v-model="sales.billingCycle" style="width: 200px" :disabled="sales.periodType == 2"  type="number"></el-input>-->
<!--                      <span class="form-input-title" >{{ sales.periodType == 1?"天":"月" }}</span>-->
                    </div>
                    <div>
                 <span style="margin-left: 20px">
                 当以月为周期，则账单扣款以及生成都以月为单位
<!--                   ，当以周为周期，账单的扣款和生成都以周为单位-->
                 </span>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="总价系数：">
                  <div style="display: inline-block" class="has-background">
                    <el-input v-model="sales.totalPricesRate"></el-input>
                    <span>
               总金额不能超过商品市场价格的150%
             </span>
                  </div>
                </el-form-item>
                <el-form-item label="方案：">
                  <div style="display: inline-block" class="has-background">
                    <div class="has-background-item"></div>
                    <div v-for="(value,key) in planInfos">
                      <div class="has-background-item" style="display: block">
                        <div style="display: inline;margin-top: 10px">
                          <el-checkbox v-model="sales.planInfo[key].rentType" label="type_1">{{ value.typeName}}</el-checkbox>
                          <span class="form-input-title">租金系数:</span>
                          <el-input class="form-input-3" v-model="sales.planInfo[key].rentRate"  type="number"></el-input>
                          <span class="form-input-title">日滞纳金系数:</span>
                          <el-input disabled="true" class="form-input-3" v-model="sales.planInfo[key].lateFeeRate"  type="number"></el-input>
                          <span class="form-input-title" v-if="value.type == 1">续租系数:</span>
                          <el-input class="form-input-3" v-model="sales.planInfo[key].renewalRate" type="number"
                                    v-if="value.type == 1"></el-input>
                          <span class="form-input-title" v-if="value.type == 3">买断尾款:</span>
                          <el-input class="form-input-3" v-model="sales.planInfo[key].buyoutBalancePayment"  type="number"
                                    v-if="value.type == 3"></el-input>
                        </div>
                        <div>
                  <span class="form-plan-notice">
               {{ value.typeInfo }}
                </span>
                          <div style="display: flex;margin-bottom: 10px;">
                            <span class="form-input-title">套餐说明:</span>
                            <el-input class="form-input-3" style="flex: 1" v-model="sales.planInfo[key].typeTitle"  ></el-input>
                            <span class="form-input-title">展示在手机端套餐的名称</span>
                          </div>
                          <div>
                            <span class="form-input-title">最低租期:</span>
                            <el-select v-model="sales.planInfo[key].miniLease" class="form-select-2" placeholder="请选择租期">
                              <el-option :label="(sales.periodType == 1?(item+'天'):(item<12?(item+'月'):(item/12+'年')))" :value="item" v-for="item in value.miniLeaseList[sales.periodType-1]"></el-option>
                            </el-select>
                            <span class="form-input-title">最高租期:</span>
                            <el-select v-model="sales.planInfo[key].maxLease" class="form-select-2" placeholder="请选择租期">
                              <el-option :label="(sales.periodType == 1?(item+'天'):(item<12?(item+'月'):(item/12+'年')))" :value="item" v-for="item in getMaxList(value,key)">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div style="height: 10px;width: 100%;background-color: #FFFFFF"></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="产品规格：" v-for="(item,index) in sales.specifications">
                  <div style="display: inline-block;padding-left: 0px !important;" class="no-background">
                    <div style="display: inline">
                      <el-input v-model="item.name" style="width: calc(100% - 198px);"></el-input>
                      <el-checkbox label="是否组合" style="width: 70px;margin-left: 10px;margin-right: 10px" v-model="item.isGroup"></el-checkbox>
                      <el-button  type="danger" icon="el-icon-delete" style="margin-left: 10px" v-if="index!=0" @click="deSpecification(sales.specifications,index)">删除规格</el-button>
                    </div>
                    <div>
                <span>
                 规格名称 例如：“颜色”、“尺寸”等。选中组合后，会自动在方案详情中生成组合项
               </span>
                    </div>
                    <!--                  <el-checkbox label="是否上传图片" v-model="item.isUploadPhoto"></el-checkbox>-->
                  </div>
                  <div>
                    <span>请添加自定义规格属性</span>
                  </div>
                  <div style="display: block;padding: 20px 10px 20px 10px;text-align: center" class="has-background" >
                    <div style="display: block;" v-for="(one,n) in item.attr">
                      <el-row>
                        <el-col :span="14" style="padding: 10px 5px">
                          <el-input placeholder="输入自定义规格" v-model="one.name"></el-input>
                        </el-col>
                        <el-col :span="4" style="padding: 10px 5px" v-if="index==0">
                          <el-input placeholder="输入官网价" v-model="one.websitePrice"  type="number"></el-input>
                        </el-col>
                        <el-col :span="4" style="padding: 10px 5px" v-if="index==0">
                          <el-input placeholder="输入续租价" v-model="one.renewalPrice"  type="number"></el-input>
                        </el-col>
                        <el-col :span="2" style="padding: 10px 5px" v-if="n!=0">
                          <el-button type="text" @click="deAttr(item.attr,n)">-移除属性</el-button>
                        </el-col>
                      </el-row>
                      <div v-if="item.isUploadPhoto == true">
                        <el-upload
                          :class="{disabled: uploadDisabled,small:true}"
                          style="text-align: left"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          list-type="picture-card"
                          :on-change="changePictureUpload"
                          :on-preview="handlePictureCardPreview"
                          :on-remove="handleRemove">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                          <img width="20%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                      </div>
                    </div>
                    <el-button type="primary" icon="el-icon-plus" @click="addAttr(item)">新增属性</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="" style="text-align: center">
                  <el-button type="primary" icon="el-icon-plus" @click="addCombination">新增产品规格</el-button>
                </el-form-item>
              </div>
            </div>
          </el-card>
          <el-card class="basis-info">
            <div slot="header" class="clearfix">
              <span>方案详情</span><span style="color: #D9001B">(说明：表格灰色部分为不可修改，数据自动生成，白色背景的单元格为可编辑单元格)</span>
            </div>
            <avue-crud :key="table_key" ref="crud" :option="option" :data="plans" :cell-style="cellStyle"
                       :header-cell-class-name="headerClassName" :span-method="spanMethod"
                       @row-click="handleRowClick" :cell-class-name="cellClassName">
              <template slot="packageName" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="packageNameForm" slot-scope="{row,disabled}">
                <el-select v-model="row.packageName.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(value,key) in sales.planInfo"
                    v-if="value.rentType"
                    @click.native="changePackageName(value,row)"
                    :key="value.name"
                    :label="value.name"
                    :value="value.name">
                  </el-option>
                </el-select>
                <el-tag :disabled="!row.add">{{ row.packageName.name }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification1" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="specification1Form" slot-scope="{row,disabled}">
                <!--              <span v-if="row.add">{{ sales.specifications[0]}}</span>-->
                <el-select v-model="row.specification1.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(item, index) in sales.specifications[0].attr"
                    @click.native ="changeSpecification(sales.specifications[0],sales.specifications[0].attr[index],row.specification1)"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-tag v-else>{{ row.specification1?row.specification1.name:""}}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification2" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="specification2Form" slot-scope="{row,disabled}">
                <!--              <span v-if="row.add">{{ sales.specifications[1].attr}}</span>-->
                <el-select v-model="row.specification2.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(item, index) in  specifications[1].attr"
                    :key="index"
                    @click.native ="changeSpecification(specifications[1],specifications[1].attr[index],row.specification2)"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-tag v-else>{{ row.specification2?row.specification2.name:"" }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification3" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="specification3Form" slot-scope="{row,disabled}">
                <el-select v-model="row.specification3.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(item, index) in  specifications[2].attr"
                    :key="index"
                    @click.native ="changeSpecification(specifications[2],specifications[2].attr[index],row.specification3)"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-tag v-else>{{ row.specification3?row.specification3.name:"" }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification4" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="specification4Form" slot-scope="{row,disabled}">
                <el-select v-model="row.specification4.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(item, index) in  specifications[3].attr"
                    :key="index"
                    @click.native ="changeSpecification(specifications[3],specifications[3].attr[index],row.specification4)"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-tag v-else>{{ row.specification4?row.specification4.name:"" }}</el-tag>
              </template>
              <!--        规格名称-->
              <template slot="specification5" slot-scope="scope">
                <el-tag>{{ scope.label.name }}</el-tag>
              </template>
              <template slot="specification5Form" slot-scope="{row,disabled}">
                <el-select v-model="row.specification5.name" placeholder="请选择" v-if="row.add" size="mini">
                  <el-option
                    v-for="(item, index) in  specifications[4].attr"
                    :key="index"
                    @click.native ="changeSpecification(specifications[4],specifications[4].attr[index],row.specification5)"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-tag v-else>{{ row.specification5?row.specification5.name:"" }}</el-tag>
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
              <template slot="stockout" slot-scope="scope">
                <el-switch
                  v-model="scope.label" v-if="scope.label" @change="changeStockout(scope)" class="orther">
                </el-switch>
              </template>
              <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-close" :size="size" :type="type" @click="deleteRow(index)">删除</el-button>
              </template>
            </avue-crud>
            <div style="text-align: center;margin-top: 10px">
              <el-button type="primary" icon="el-icon-save" @click="savePlan" v-if="isEdit">保存方案</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addPlan" v-if="!isEdit">增加一条方案</el-button>
            </div>
          </el-card>
          <el-card class="basis-info">
            <div slot="header" class="clearfix">
              <span>商品信息</span>
            </div>
            <div>
              <el-form-item label="上传封面图片：">
                <el-upload
                  action="/api/blade-resource/oss/endpoint/put-file"
                  list-type="picture-card"
                  :headers="headers"
                  :class="{ hide: photoCover.length>0 }"
                  :limit="1"
                  :file-list="photoCover"
                  :on-preview="function (file){return handlePictureCardPreview(file, 'photoCover')}"
                  :on-success="function (res, file){return onSuccessPhoto(res, file, 'photoCover')}"
                  :on-remove="function (file,fileList){return handleRemove(file,fileList, 'photoCover')}">
                  <i class="el-icon-plus" v-if="photoCover.length == 0"></i>
                </el-upload>
                <el-dialog :visible.sync="images.photoCover.isShow">
                  <img width="100%" :src="images.photoCover.url" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="上传轮播图片：">
                <el-upload
                  action="/api/blade-resource/oss/endpoint/put-file"
                  list-type="picture-card"
                  :headers="headers"
                  :class="{ hide: photoSlideshow>5 }"
                  :file-list="photoSlideshow"
                  :on-preview="function (file){return handlePictureCardPreview(file, 'photoSlideshow')}"
                  :on-success="function (res, file){return onSuccessPhoto(res, file, 'photoSlideshow')}"
                  :on-remove="function (file,fileList){return handleRemove(file,fileList, 'photoSlideshow')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="images.photoSlideshow.isShow">
                  <img width="100%" :src="images.photoSlideshow.url" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="上传详情图片：">
                <el-upload
                  action="/api/blade-resource/oss/endpoint/put-file"
                  list-type="picture-card"
                  :class="{ hide: photoDetails>0 }"
                  :headers="headers"
                  :file-list="photoDetails"
                  :on-preview="function (file){return handlePictureCardPreview(file, 'photoDetails')}"
                  :on-success="function (res, file){return onSuccessPhoto(res, file, 'photoDetails')}"
                  :on-remove="function (file,fileList){return handleRemove(file,fileList, 'photoDetails')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="images.photoDetails.isShow">
                  <img width="100%" :src="images.photoDetails.url" alt="">
                </el-dialog>
              </el-form-item>
            </div>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {categoryTree, getList} from "../../api/goods/goodscategory";
  import {getDetail} from "@/api/goods/goods";
  import {dictionary} from "../../api/system/dict";
  import {getList as getExtraserviceList} from "../../api/goods/extraservice";
  import {getList as getReturnAddressList} from "../../api/goods/returnaddress";
  import {getAllList as getMaintaininfoList} from "../../api/operation/maintaininfo";
  import {getAllList as getRentinfoList} from "../../api/operation/rentinfo";
  import {Base64} from 'js-base64';
  import {getToken, headers} from '../../util/auth'
  import website from '../../config/website';
  import {
    calculateBuyoutMoney, calculateLateFeeMoney,
    calculateRentMoney,
    calculatePerRentMoney, floatObj,
  } from "../../constant/goods/constant";
  import {saveOrUpdate} from "../../api/goods/goods";
  import func from "../../util/func";
  import {Message} from 'element-ui'

  export default {
    name: "wel",
    data() {
      return {
        table_key:0,
        loading:false,
        rules:{
          levelFirstCategoryId: [
            { required: true, message: '请请选择类目', trigger: 'blur' },
          ],
          levelSecondCategoryId: [
            { required: true, message: '请请选择类目', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入商品标题', trigger: 'blur' },
          ],
          returnAddressId: [
            { required: true, message: '请选择归还地址', trigger: 'blur' },
          ],
          leaseExplainId: [
            { required: true, message: '请选择租赁说明', trigger: 'blur' },
          ],
          afterSaleId: [
            { required: true, message: '请选择售后维修说明', trigger: 'blur' },
          ],
          totalPricesRate: [
            { required: true, message: '请输入总价系数', trigger: 'blur' },
          ],
          periodType: [
            { required: true, message: '请选择租期', trigger: 'blur' },
          ],
          expressFree: [
            { required: true, message: '请选择快递方式', trigger: 'blur' },
          ],
          expressPrice:[
            { required: true, message: '请输入邮费', trigger: 'blur' },
          ],
        },
        sales:{
          deleteCombination:[],
          deleteSpecification:[],
          photoCover:[],
          photoDetails:[],
          photoSlideshow:[],
          levelFirstCategoryId: '',
          levelSecondCategoryId: '',
          title: '',
          network: '',
          marketing: '',
          oldNew: '0',
          secondHand: '100',
          marketingCornerMark: '',
          extraService: [],
          returnAddressId: '',
          leaseExplainId: '',
          afterSaleId: '',
          expressFree:"1",
          expressPrice:null,
          limitUser:null,
          totalPricesRate: 0,
          tags: [],
          inputVisible: false,
          inputValue: '',
          value1: [],
          periodType: null,//期数单位
          billingCycle: 0,//账单周期
          specifications:[],
          planInfo: {
            type_1: {
              type:1,
              typeTitle: '月供低 年年焕新',
              rentType:false,
              rentRate: null,
              lateFeeRate: null,
              renewalRate: null,
              miniLease: null,
              name:null,
              miniType: null,
              maxLease: null,
              maxType: null,
              buyoutBalancePayment:null,
            },
            // type_2: {
            //   type:2,
            //   rentType:false,
            //   rentRate: null,
            //   lateFeeRate: null,
            //   renewalRate: null,
            //   miniLease: null,
            //   name:null,
            //   miniType: null,
            //   maxLease: null,
            //   maxType: null,
            //   buyoutBalancePayment:null,
            // },
            type_3: {
              type:3,
              typeTitle: '个月内随时续租/买断/归还/续满即送',
              rentType:false,
              rentRate: null,
              lateFeeRate: null,
              renewalRate: null,
              miniLease: null,
              name:null,
              miniType: null,
              maxLease: null,
              maxType: null,
              buyoutBalancePayment:100,
            },
          },
        },
        specifications:[],
        photoCover:[],
        photoDetails:[],
        photoSlideshow:[],
        uploadDisabled:false,
        id:null,
        levelFirstCategoryId: [],
        levelSecondCategoryId: [],
        newWorks: [],
        hands: [],
        usePlan:0,
        extraServices: [],
        returnAddresses: [],
        mainTainInfos: [],
        expressList: [{
          value: '1',
          label: '包邮'
        }, {
          value: '2',
          label: '不包邮'
        }],
        rentinfos: [],
        planInfos: {
          type_1:
            {
              type: 1,
              typeName: this.$enum.defaultReturn.typeName,
              typeInfo: this.$enum.defaultReturn.typeInfo,
              rentRate: this.$enum.defaultReturn.rentRate,
              lateFeeRate: this.$enum.defaultReturn.lateFeeRate,
              renewalRate: this.$enum.defaultReturn.renewalRate,
              miniLease: this.$enum.defaultReturn.miniLease,
              miniType: this.$enum.defaultReturn.miniType,
              maxLease: this.$enum.defaultReturn.maxLease,
              maxType: this.$enum.defaultReturn.maxType,
              miniLeaseList:this.$enum.defaultReturn.miniLeaseList,
              maxLeaseList:this.$enum.defaultReturn.maxLeaseList,
            },
          // type_2: {
          //   type: 2,
          //   typeName: this.$enum.defaultBuyout.typeName,
          //   typeInfo: this.$enum.defaultBuyout.typeInfo,
          //   rentRate: this.$enum.defaultBuyout.rentRate,
          //   lateFeeRate: this.$enum.defaultBuyout.lateFeeRate,
          //   renewalRate: this.$enum.defaultBuyout.renewalRate,
          //   miniLease: this.$enum.defaultBuyout.miniLease,
          //   miniType: this.$enum.defaultBuyout.miniType,
          //   maxLease: this.$enum.defaultBuyout.maxLease,
          //   maxType: this.$enum.defaultBuyout.maxType,
          //   miniLeaseList:this.$enum.defaultBuyout.miniLeaseList,
          //   maxLeaseList:this.$enum.defaultBuyout.maxLeaseList,
          // },
          type_3: {
            type: 3,
            typeName: this.$enum.defaultFlexible.typeName,
            typeInfo: this.$enum.defaultFlexible.typeInfo,
            rentRate: this.$enum.defaultFlexible.rentRate,
            lateFeeRate: this.$enum.defaultFlexible.lateFeeRate,
            renewalRate: this.$enum.defaultFlexible.renewalRate,
            miniLease: this.$enum.defaultFlexible.miniLease,
            miniType: this.$enum.defaultFlexible.miniType,
            maxLease: this.$enum.defaultFlexible.maxLease,
            maxType: this.$enum.defaultFlexible.maxType,
            miniLeaseList:this.$enum.defaultFlexible.miniLeaseList,
            maxLeaseList:this.$enum.defaultFlexible.maxLeaseList,
          }
        },
        images: {
            photoCover:{
              isShow:false,
              url: '',
            },
            photoDetails:{
              isShow:false,
              url: '',
            },
            photoSlideshow:{
              isShow:false,
              url: '',
            }
          },
        spanArr: [],
        plans: [],
        columns: ["packageName", "specification1", "specification2","specification3","specification4","specification5"],
      }
    },
    watch: {
      option: function (){
        console.log("option变化了")
        this.table_key = new Date().getTime();
      },
      'sales.levelFirstCategoryId': function (val) {
        this.getCategory(val)
      },
      'sales.levelSecondCategoryId': function (val) {
        this.sales.tags = []
        this.referTags(this.levelFirstCategoryId, this.sales.levelFirstCategoryId);
        this.referTags(this.levelSecondCategoryId, val);
        console.log(this.tags)
      },
      'sales.extraService': function (val) {

      },
      'sales.totalPricesRate': function (val, oldVal) {
        if (Number.parseFloat(val)>1.5){
          this.$message.error("总价系数不能超过1.5");
          this.sales.totalPricesRate = oldVal;
          return;
        }
      },
      'sales.periodType': function (val) {
        this.reset("type_1",val);
        // this.reset("type_2",val);
        this.reset("type_3",val);
      },
    },
    methods: {
      changePackageName(val,row){
        row.packageName = val;
        console.log(val,row)
      },
      getchangeSpecification(name,data,val,row){
        const newObj = Object.assign({},data)
        newObj.lableName = name;
        delete newObj.name
        console.log(this.plans,val,row)
        return Object.assign(newObj,val);
      },
      changeSpecification(data,val,row){
        // const newObj = Object.assign({},data)
        // newObj.lableName = newObj.name;
        // delete newObj.name
        // delete newObj.attr
        // Object.assign(row,Object.assign(newObj,val))
        // console.log(this.plans,val,row)
      },
      handler() {
        const items = {};
        const rentTypes = {}
        this.usePlan = 0;
        for (const type in this.sales.planInfo) {
          const planInfo = this.sales.planInfo[type];
          if (planInfo.rentType){
            const defaults = this.$enum.defaultPlanInfo[type];
            planInfo.name = defaults.typeName
            rentTypes[defaults.typeName] = planInfo
          }
        }
        this.specifications = []
        for (let index  in  this.sales.specifications){
          const  item = this.sales.specifications[index]
          if (item.name&&item.name.length>0&&item.isGroup == true){
            this.usePlan = this.usePlan+1;
            for (const it of item.attr) {
              items[it.name] = it
            }
            this.specifications.push(item)
          }
        }
        var keys = Object.keys(items);

        for (const plan of this.plans) {

          var  packageName = plan.packageName;
          packageName = this.sales.planInfo["type_"+packageName.type];
          if (rentTypes[packageName.name]){
            plan.packageName = rentTypes[packageName.name]
          }
          if (packageName.rentRate){
            plan.rentRate = packageName.rentRate
          }
          if (packageName.rentRate){
            plan.rentRate = packageName.rentRate
          }
          if (packageName.lateFeeRate){
            plan.lateFeeMoney = packageName.lateFeeRate
          }
          if (packageName.miniLease){
            plan.miniLease = packageName.miniLease
          }
          if (packageName.buyoutBalancePayment){
            plan.buyoutBalancePayment = packageName.buyoutBalancePayment
          }

          for (let i = 0; i < this.usePlan; i++) {
            var value = plan['specification'+(i+1)];
            if (value&&items[value.name]){
              if(items[value.name].websitePrice){
                plan.websitePrice = items[value.name].websitePrice
                plan.renewalPrice = items[value.name].renewalPrice
              }
            }
          }
        }
        console.log(this.sales.planInfo)
        for (const planKey in this.sales.planInfo) {
          console.log(this.sales.planInfo[planKey].rentRate)
          if (func.toFloat(this.sales.planInfo[planKey].rentRate,1)>1){
            this.sales.planInfo[planKey].rentRate = 1;
            this.$message.error("租金系数设置失败，租金系数最大能超过1")
          }
          if (func.toFloat(this.sales.planInfo[planKey].lateFeeRate,1)>1){
            this.sales.planInfo[planKey].lateFeeRate = 1;
            this.$message.error("日滞纳金系数设置失败，滞纳金系数最大能超过1")
          }
        }
        // console.log(JSON.stringify(this.sales))
        // console.log(JSON.stringify(this.plans))
        this.rowspan()
      },
      getMaxList(value,key){
        if (!this.sales.periodType){
          return [];
        }
        return value.maxLeaseList[this.sales.periodType-1][this.$enum.goodsPlanInfo.miniIndex(key,this.sales.periodType,this.sales.planInfo[key].miniLease)]
      },
      checkNumber(val){
        return parseFloat(val).toString() != "NaN";
      },
      //每一期租金
      calculateRentMoney(row){
        const  data = Object.assign({totalPricesRate:this.sales.totalPricesRate},row);
        var rentPerMoney = calculatePerRentMoney(data);
        row.rentMoney = calculateRentMoney(data);
        row.rentPerMoney = rentPerMoney;
        // console.log("行数据",row)
        return rentPerMoney;
      },
      calculateBuyoutMoney(row){
        const  data = Object.assign({totalPricesRate:this.sales.totalPricesRate},row);
        return calculateBuyoutMoney(data)
      },
      calculateLateFeeMoney(row){
        const  data = Object.assign({totalPricesRate:this.sales.totalPricesRate},row);
        return calculateLateFeeMoney(data);
      },
      changeStockout(data){
        var index = data.index
        this.plans[index].stockout = false;
        this.plans[index].$cellEdit = true;
        this.table_key = new Date().getTime();
      },
      deleteRow(index){
        var item = this.plans[index];
        if (item.id){
          this.sales.deleteCombination.push(item.id)
        }
        this.plans.splice(index, 1)
      },
      reset(key,val){
        this.sales.planInfo[key].rentType=false
        this.sales.planInfo[key].miniLease=null
        this.sales.planInfo[key].miniType=val
        this.sales.planInfo[key].maxLease=null
        this.sales.planInfo[key].maxType=val
      },
      doCombination(arr) {
        var count = arr.length - 1; //数组长度(从0开始)
        var tmp = [];
        var totalArr = [];// 总数组

        return doCombinationCallback(arr, 0);//从第一个开始
        //js 没有静态数据，为了避免和外部数据混淆，需要使用闭包的形式
        function doCombinationCallback(arr, curr_index) {
          for(const val of arr[curr_index]) {
            tmp[curr_index] = val;//以curr_index为索引，加入数组
            //当前循环下标小于数组总长度，则需要继续调用方法
            if(curr_index < count) {
              doCombinationCallback(arr, curr_index + 1);//继续调用
            }else{
              totalArr.push(tmp);//(直接给push进去，push进去的不是值，而是值的地址)
            }
            //js  对象都是 地址引用(引用关系)，每次都需要重新初始化，否则 totalArr的数据都会是最后一次的 tmp 数据；
           var oldTmp = tmp;
            tmp = [];
            for(const index of oldTmp) {
              tmp.push(index);
            }
          }
          return totalArr;
        }
      },
      addAttr(item){
        item.attr.push({
          name:null,
          websitePrice:null,
          renewalPrice:null,
        })
      },
      deAttr(items,index){
        this.$delete(items,index)
      },
      savePlan(){
        const keys = [];
        for (const plan of this.plans) {
          let key = plan.packageName.name;
          if (!plan.packageName.name||plan.packageName.name.length==0){
            this.$message("保存失败,请选择方案")
            return;
          }
          for (let i = 0; i < this.usePlan; i++) {
            const name = plan['specification'+(i+1)].name;
            key = key+name;
            if (!name||name.length==0){
              this.$message.error("保存失败,请选择规格")
              return;
            }
          }
          if (keys.indexOf(key) != -1){
            this.$message.error("保存失败,当前组合已存在")
            return;
          }
          keys.push(key)
        }

        for (const plan of this.plans) {
          plan.add = false;
        }
        this.$nextTick(_ => {
          this.rowspan()
          this.table_key = new Date().getTime();
          this.handler()
        });
      },
      addPlan(){
        var item = {};
        item.add = true;
        item.websitePrice = 0
        item.lateFeeMoney = 0
        item.miniLease = 0
        item.rentRate = 0
        item.$cellEdit=true
        item.buyoutBalancePayment = 0
        item.rowKey = new Date().getTime();
        item.packageName = {name:""}

        var number = 0;
        for (let index in this.sales.specifications) {
          var specification = this.sales.specifications[index]
          if (specification.name&&specification.name.length>0&&specification.isGroup == true){
            number = number+1;
            item['specification'+number] = {index:index}
          }
        }
        // for (let i = 0; i < this.usePlan; i++) {
        //   item['specification'+(i+1)] = {}
        // }
        item.stockout = false
        item.inventory = 0
        item.premiumMoney = 0
        item.depositMoney = 0
        item.rentMoney = 0
        item.buyoutMoney = 0
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
        for (let i = 0; i < this.usePlan; i++) {
          data['specification'+(i+1)] = 1
        }
        this.spanArr.push(data)
        console.log(item)
        this.plans.push(item)
      },
      addCombination(){
        this.sales.specifications.push({
          name:null,
          isGroup:false,
          isUploadPhoto:false,
          isSetPrice:false,
          attr:[{
            name:null,
            websitePrice:null,
            renewalPrice:null,
          }],
        })
      },
      deSpecification(items,index){
        var item = items[index];
        if (item.id){
          this.sales.deleteSpecification.push(item.id)
        }
        this.$delete(items,index)
      },
      onSubmit() {
        console.log('submit!');
      },
      handleClose(tag) {
        this.sales.tags.splice(this.sales.tags.indexOf(tag), 1);
      },

      showInput() {
        this.sales.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.sales.inputValue;
        if (inputValue) {
          this.sales.tags.push(inputValue);
        }
        this.sales.inputVisible = false;
        this.sales.inputValue = '';
      },
      rowSave(form, done) {
        this.$message.success(
          '新增数据' + JSON.stringify(form)
        )
        done()
      },
      handleRowClick(row, column,event) {
        if ((event.target&&event.target.className === 'el-switch__core')){
          row.$cellEdit = !row.$cellEdit;
          row.inventory = 0;
        }
      },
      addUpdate(form, index, done, loading) {
        this.$message.success('模拟网络请求')
        setTimeout(() => {
          this.$message.success('关闭按钮等待')
          loading()
        }, 1000)
        setTimeout(() => {
          this.$message.success(
            '编辑数据' + JSON.stringify(form) + '数据序号' + index
          )
          done()
        }, 2000)
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
          console.log("规格数量:",this.usePlan)
          for (let i = 0; i < this.usePlan; i++) {
            data['specification'+(i+1)] = 1
          }
          this.spanArr.push(data)
          Object.keys(item).forEach((second, index2) => {
            if (this.columns.indexOf(second) != -1){
              proKeys = proKeys + item[second].name;
              // console.log("添加key",proKeys)
            }
          })
          // console.log("上一次的索引:"+proKeys)
          if (index > 0&&!item.add) {
            var keys = "";
            Object.keys(item).forEach((second, index2) => {
              if (this.columns.indexOf(second) != -1) {
                keys = keys + item[second].name;
                // console.log("查看上一次的索引:",proKeys)
                // console.log("查看这一次的索引:",keys)
                // console.log(index,second,this.plans,this.plans[index - 1],this.plans[index][second])
                // console.log(index,second,this.plans,this.plans[index - 1],this.plans[index - 1][second])
                // console.log("匹配----------第"+index+"行,字段："+second+"","开头匹配"+proKeys.startsWith(keys),"是否合并"+(this.data[index][second]===this.data[index-1][second]))
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
            // console.log("更新索引:"+proKeys)
          }
        })
      },
      spanMethod({row, column, rowIndex, columnIndex}) {
        let _row = this.spanArr[Number.parseInt(rowIndex)][column.property];
        if (column.property == "menu"){
          _row = 1;
        }
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (column.property && (
          column.property.startsWith("packageName")
          || column.property.startsWith("specification")
          || column.property.startsWith("websitePrice")
          || column.property.startsWith("miniLease")
          || column.property.startsWith("rentMoney")
          || column.property.startsWith("buyoutMoney")
          || column.property.startsWith("lateFeeMoney")
          || !row.$cellEdit)) {
          return {
            backgroundColor: '#FaFaFa',
          }
        }
        if (column.property &&  column.property.startsWith("stockout")) {
          var txt = "clip";
          return {
            textOverflow:txt
          }
        }
      },
      headerClassName({row, column, rowIndex, columnIndex}) {
        return "head-class"
      },
      cellClassName({row, column, rowIndex, columnIndex}) {
        if (!row.$cellEdit&&column.property.startsWith("stockout")){
          return "table-cell-class"
        }
        return ""
      },
      handleRemove(file, fileList, type) {
        this.sales[type] = this.sales[type].filter(item => {
          console.log(item,file)
          return item != file.name;
        });
        console.log(file.name)
        console.log(JSON.stringify(this.photoCover),JSON.stringify(this.photoSlideshow))

        this.photoSlideshow = this.photoSlideshow.filter(item => {
          return item.name != file.name;
        });

        this.photoDetails = this.photoDetails.filter(item => {
          return item.name != file.name;
        });

        this.photoCover = this.photoCover.filter(item => {
          return item.name != file.name;
        });

        console.log(this.photoSlideshow,this.photoDetails,this.photoCover)
      },
      changePictureUpload(file,fileList){
        this.uploadDisabled = fileList.length >= 1;
      },
      changeUpload(file,fileList, type){
      },
      onSuccessPhoto(res, file, type){
        this.sales[type].push(res.data.name)
      },
      handlePictureCardPreview(file, type) {
        console.log(file, type)
        this.images[type].url = file.url;
        this.images[type].isShow = true;
      },
      getDictionary(key) {
        dictionary(key).then(res => {
          if (key == "network")
            this.newWorks = res.data.data
          if (key == "goods_hand")
            this.hands = res.data.data
        });
      },
      getExtraService(key) {
        dictionary(key).then(res => {
          if (key == "network")
            this.newWorks = res.data.data
          if (key == "goods_hand")
            this.hands = res.data.data
        });
      },
      //获取分类
      getCategory(parentId) {
        if (parentId == 0) {
          this.sales.levelFirstCategoryId = ''
          this.levelSecondCategoryId = ''
        } else {
          this.sales.levelSecondCategoryId = ''
        }
        getList(0, 100, {parentId: parentId}).then(res => {
          if (parentId == 0) {
            this.levelFirstCategoryId = res.data.data
          } else {
            this.levelSecondCategoryId = res.data.data
          }
        })
      },
      referTags(data, select) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].tags.length > 0 && data[i].id == select) {
            Array.prototype.push.apply(this.sales.tags, data[i].tags.split(","));
          }
        }
      },
      handlePreview(file) {
        console.log(file);
      },
      // 保存，上架，下架，草稿
      saveGoods(type){
        if (type == -1){
          this.$EventBus.$emit('tag', {
            action:"remove",
            value:"/goods/add/index",
            isOpenTag:true,
            isMatchAll:false
          })
          return;
        }
        // this.loading = true;
        console.log(this.sales)



        if (this.sales.planInfo.type_3&&Number.parseFloat(this.sales.planInfo.type_3.buyoutBalancePayment)<100){
          Message({
            message: "买断尾款最少为100元",
            type: 'error'
          })
          return;
        }

        var data = JSON.stringify(this.sales);
        console.log(data)
        data = data.replace(/\t|\n|\v|\r|\f/g,'').replace(/\r\n/g,'').replace(/\n/g,'');
        console.log(data)
        let obj2 = JSON.parse(data)
        var specifications = obj2.specifications;
        obj2.specifications = [];
        for (const specification of specifications) {
          obj2.specifications.push(JSON.stringify(specification))
        }
        obj2.plans = [];
        for (const plan of this.plans) {
          obj2.plans.push(JSON.stringify(plan))
        }
        obj2.status = type;

        console.log(obj2)

        saveOrUpdate(obj2).then(response => {
          this.loading = false;
          this.$EventBus.$emit('tag', {
            action:"remove",
            value:"/goods/add/index",
            isOpenTag:true,
            isMatchAll:false
          })
        });
      }
    },
    computed: {
      isEdit(){
        for (const plan of this.plans) {
          if (plan.add){
            return true;
          }
        }
        return false;
      },
      headers(){
        return headers()
      },
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
        for (let index in this.sales.specifications) {
          var item = this.sales.specifications[index]
          if (item.name&&item.name.length>0&&item.isGroup == true){
            option.column.push( { label: item.name, prop: 'specification'+(number+1), slot: true, cell: true })
            number = number+1;
          }
        }
        option.column.push( { label: '缺货', width: 60, prop: 'stockout', type: 'switch', cell: true })
        option.column.push( { label: '库存(件)', width: 100, prop: 'inventory', cell: true, rules: [ { required: true, message: '请输入库存', trigger: 'blur' } ] })
        option.column.push( { label: '官网价', width: 60, prop: 'websitePrice', slot: true, })
        option.column.push( { label: '溢价金', prop: 'premiumMoney', cell: true, rules: [ { required: true, message: '请输入姓名', trigger: 'blur' } ] })
        option.column.push( { label: '租金系数', prop: 'rentRate'})
//        option.column.push( { label: '押金', prop: 'depositMoney', cell: true, rules: [ { required: true, message: '请输入姓名', trigger: 'blur' } ] })
        option.column.push( { label: '最低月数', width: 70, prop: 'miniLease', slot: true, })
        option.column.push( { label: '单期租金', width: 70, prop: 'rentMoney', slot: true, })
        option.column.push( { label: '买断尾款', width: 70, prop: 'buyoutMoney', slot: true, })
        option.column.push( { label: '滞纳金(日租金%)', width: 120, prop: 'lateFeeMoney', slot: true, })
        option.column.push( { label: '操作', width: 100, prop: 'menu', slot: true, })
        return option
      },
      cycleTotal: function () {
        this.cycle01 = this.checkNum(this.cycle01, 1, 31)
        this.cycle02 = this.checkNum(this.cycle02, 1, 31)
        return this.cycle01 + '-' + this.cycle02;
      },
    },
    mounted() {
      const handler = ()=> this.handler()
      Object.keys(this.sales)
        .filter(_ => !["levelFirstCategoryId", "levelSecondCategoryId", "title", "marketing","secondHand","inputVisible","inputValue","photoDetails","photoSlideshow","photoCover",
          "tags","extraService","marketingCornerMark","returnAddressId","leaseExplainId","afterSaleId"].includes(_)) // 排除对属性的监听
        .forEach((_) => {
          this.$watch(vm => vm.sales[_], handler, {
            deep: true,
            immediate: false
          });
        });
      console.log("mounted-----")
    },
    created() {
      this.loading = true;
      this.id=this.$route.query.goodsId;
      this.getDictionary("network")
      this.getDictionary("goods_hand")
      this.$router.$avueRouter.setTitle("编辑商品")
      if (this.id == null){
        this.$router.$avueRouter.setTitle("新增商品")
        //说明是新增
        this.sales.periodType = this.$enum.goodsPlanInfo.defaultCycle
        this.sales.billingCycle = this.$enum.goodsPlanInfo.billing_cycle_month
        this.rowspan()
        this.planInfos.type_1 = this.$enum.defaultPlanInfo.type_1
        this.sales.planInfo.type_1.rentRate = this.planInfos.type_1.rentRate
        this.sales.planInfo.type_1.typeTitle = this.planInfos.type_1.typeTitle
        this.sales.planInfo.type_1.lateFeeRate = this.planInfos.type_1.lateFeeRate
        this.sales.planInfo.type_1.renewalRate = this.planInfos.type_1.renewalRate

        console.log("设置默认参数")
        // this.planInfos.type_2 = this.$enum.defaultPlanInfo.type_2
        // this.sales.planInfo.type_2.rentRate = this.planInfos.type_2.rentRate
        // this.sales.planInfo.type_2.lateFeeRate = this.planInfos.type_2.lateFeeRate

        this.planInfos.type_3 = this.$enum.defaultPlanInfo.type_3
        this.sales.planInfo.type_3.typeTitle = this.planInfos.type_3.typeTitle
        this.sales.planInfo.type_3.rentRate = this.planInfos.type_3.rentRate
        this.sales.planInfo.type_3.lateFeeRate = this.planInfos.type_3.lateFeeRate

        this.sales.totalPricesRate = this.$enum.goodsPlanInfo.defaultTotalPricesRate
      }
      this.getCategory(0)
      getExtraserviceList(0, 100, {}).then(res => {
        this.extraServices = res.data.data.records
      })
      getReturnAddressList(0, 100, {}).then(res => {
        this.returnAddresses = res.data.data.records
      })
      getMaintaininfoList().then(res => {
        this.mainTainInfos = res.data.data
      })
      getRentinfoList().then(res => {
        this.rentinfos = res.data.data
      })
      console.log(this.sales.planInfo)

      if (this.id != null){
        console.log("-----")
        //说明是新增
        getDetail(this.id).then(res => {
          this.loading = false;
          var goodsInfo = res.data.data;
          goodsInfo.specifications = [];
          try {
            var obj = JSON.parse(goodsInfo.goodsSpecificationsJsonData);
            if(typeof obj == 'object' && obj ){
              goodsInfo.specifications = obj
            }
          }catch (e) {

          }

          var tags = goodsInfo.tags;
          if (goodsInfo.photoCover)
            this.sales.photoCover = goodsInfo.photoCover.split(",");
          if (goodsInfo.photoDetails)
            this.sales.photoDetails = goodsInfo.photoDetails.split(",");
          if (goodsInfo.photoSlideshow)
            this.sales.photoSlideshow = goodsInfo.photoSlideshow.split(",");
          for (const photo of this.sales.photoCover) {
            this.photoCover.push({name: photo, url: this.$store.state.common.cloudDomain+photo})
          }
          for (const photo of this.sales.photoDetails) {
            this.photoDetails.push({name: photo, url: this.$store.state.common.cloudDomain+photo})
          }
          for (const photo of this.sales.photoSlideshow) {
            this.photoSlideshow.push({name: photo, url: this.$store.state.common.cloudDomain+photo})
          }

          this.sales.levelFirstCategoryId = goodsInfo.levelFirstCategoryId;
          this.getCategory(this.sales.levelFirstCategoryId)
          this.$nextTick(() => {
            // DOM更新了
            this.sales.levelSecondCategoryId = goodsInfo.levelSecondCategoryId;
            this.$nextTick(() => {
              this.sales.tags = []
              this.sales.tags = goodsInfo.category.split(",");
            })

          })
          this.sales.id = goodsInfo.id;
          this.sales.limitUser = goodsInfo.limitUser;
          this.sales.title = goodsInfo.title;
          this.sales.marketing = goodsInfo.marketing;
          this.sales.oldNew = goodsInfo.secondHand == 100?"0":"1";
          this.sales.secondHand = goodsInfo.secondHand;
          this.sales.marketingCornerMark = goodsInfo.marketingCornerMark;
          this.sales.extraService = goodsInfo.extraService.split(",")
          this.sales.returnAddressId = goodsInfo.returnAddressId;
          this.sales.expressFree = goodsInfo.expressFree;
          this.sales.expressPrice = goodsInfo.expressPrice
          this.sales.leaseExplainId = Number.parseInt(goodsInfo.leaseExplainId);
          this.sales.afterSaleId = Number.parseInt(goodsInfo.afterSaleId);
          this.sales.periodType = goodsInfo.periodType+"";
          this.sales.billingCycle = goodsInfo.billingCycle;
          this.sales.totalPricesRate = goodsInfo.totalPricesRate;
          this.sales.specifications = goodsInfo.specifications
          this.$nextTick(() => {
            if(goodsInfo.planInfo.type_1){
              goodsInfo.planInfo.type_1.rentType = true;
              Object.assign(this.sales.planInfo.type_1,goodsInfo.planInfo.type_1)
              this.sales.planInfo.type_1.rentType = true;
            }else{
              this.sales.planInfo.type_1.rentType = false;
            }
            this.sales.planInfo.type_1.lateFeeRate = 0.2;
            // if(goodsInfo.planInfo.type_2){
            //   Object.assign(this.sales.planInfo.type_2,goodsInfo.planInfo.type_2)
            //   this.sales.planInfo.type_2.rentType = true;
            // }else{
            //   this.sales.planInfo.type_2.rentType = false;
            // }
            if(goodsInfo.planInfo.type_3){
              Object.assign(this.sales.planInfo.type_3,goodsInfo.planInfo.type_3)
              this.sales.planInfo.type_3.rentType = true;
            }else{
              this.sales.planInfo.type_3.rentType = false;
            }
            this.sales.planInfo.type_3.lateFeeRate = 0.2;
            console.log("赋值",this.plans)
          })
          this.plans = JSON.parse(goodsInfo.combinationsJsonData)
          //更新下拉
          this.rowspan()
          this.table_key = new Date().getTime();
        });
      }else{
        this.loading = false;
      }
    }
  };
</script>

<style scoped="scoped" lang="scss">
  .top-bar-title {
    height: 30px;
    background-color: white;
    padding: 10px 20px 10px 20px;
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

  .top {
    position: fixed;
    top: 110px;
    z-index: 11;
    width: calc(100% - 293px);
  }

  .small :deep .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
   }
  .small :deep .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  .disabled {
    ::v-deep .el-upload--picture-card {
      display: none;
    }
  }

  :deep .el-empty {
    padding: 0px 0px !important;
  }
  :deep .avue-crud__empty {
    padding: 0px 0px !important;
  }

  ::v-deep .table-cell-class div {
    text-overflow: clip !important;
  }

  ::v-deep  .hide  .el-upload--picture-card {

      display: none !important;

    }


  //去掉过渡动画，不然删除操作的时候，布局会闪一下。

  ::v-deep .el-upload-list__item {

    transition: none !important

  }
</style>
