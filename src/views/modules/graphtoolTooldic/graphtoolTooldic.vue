<template>
  <div class="graphtool-tooldic">
    <div class="graphtool-top">
      <div class="data-left" :class="leftHidden?'data-left-hidden':''">
        <div @click="getCanvas(),leftHidden=!leftHidden" class="data-left-tab inline-block"
             :class="!leftHidden?'data-left-tab-act':''">
          数据表
        </div>
        <div v-show="!leftHidden" class="data-tree inline-block">
          <el-tree
            class="sql-tree-self"
            :data="dataTreeData"
            ref="tree1"
            node-key="id"
            lazy
            :load="loadNode"
            :props="defaultProps"
            draggable
            @node-expand="handleNodeClick"
            :default-expanded-keys="treeExpandData"
            @node-drag-end="handleDragEnd"
            :allow-drop="returnFalse"
            :allow-drag="allowDrag">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>
                            <img v-if="node.data.dataType=='1'" class="tree-icon"
                                 src="../../../components/codemirror/icons/files.png" alt="">
                            <img v-if="node.data.dataType=='2'" class="tree-icon"
                                 src="../../../components/codemirror/icons/table_1.png" alt="">
                            <img v-if="node.data.dataType=='3'" class="tree-icon"
                                 src="../../../components/codemirror/icons/column.png" alt="">
                            {{ node.label }}
                        </span>
                    </span>
          </el-tree>
        </div>
      </div>
      <div :class="leftHidden&&rightHidden?'data-canvas-noLeftRight':leftHidden||rightHidden?'data-canvas-noLeft':''"
           class="data-canvas mar-l">
        <div class="mdd-placeHolder" v-if="join.length==0">请将表拖到此处</div>
        <div @dragover="allowDrop" id="myDiagramDiv" style="border: solid 1px #F3F3F3;height:100%;">

        </div>
        <!-- <img width="15" id="fd" height="15" title="画布放大" src="../assistSqlEdit/images/fangda.png" style="z-index:9999;position: absolute;right: 250px;top: 12px;"  onclick="assistSqlEdit.hb()"/>
        <img width="15" id="sx" height="15" title="画布缩小" src="../assistSqlEdit/images/fangda.png" style="z-index:9999;position: absolute;right: 10px;top: 12px;"  onclick="assistSqlEdit.hbsx()"/> -->
      </div>
      <div v-show="!rightHidden" class="run-btn"><el-button type="primary" @click="getwsData(sqlMsg)">立即运行</el-button></div>
      <div class="data-right mar-l" :class="rightHidden?'data-right-hidden':''">
        <div v-show="!rightHidden" id="joins" class="data-option-box inline-block">
          <div class="tstext">表连接</div>
          <div id="form" class="box-bg"></div>
        </div>
        <div v-show="!rightHidden" id="tjHidden" class="data-option-box  inline-block">
          <div class="tstext">连接条件</div>
          <div id="linkDiv" class="box-bg">
            <div class="form-group" id="join2" style="display:none;">
              <div class="col-sm-12">
                <input name="MainPort" type="text" class="form-control" id="MainPort" disabled="disabled"></input>
              </div>
            </div>
            <div class="form-group" id="select" style="display:none;">

              <div class="col-sm-8">
                <select id="comper" @change="changeCopare()">
                  <option value="=">等于</option>
                  <option value="!=">不等于</option>
                  <option value="&gt;">大于</option>
                  <option value="&gt;=">大于等于</option>
                  <option value="&lt;">小于</option>
                  <option value="&lt;=">小于等于</option>
                </select>
              </div>
            </div>
            <div class="form-group" id="join1" style="display:none;">
              <div class="col-sm-12">
                <input name="toPort" type="text" class="form-control" id="toPort" disabled="disabled"></input>
                <input name="from" type="hidden" class="form-control" id="from"></input>
                <input name="to" type="hidden" class="form-control" id="to"></input>
              </div>
            </div>
          </div>
        </div>
        <div @click="getCanvas(),rightHidden=!rightHidden" class="data-right-tab inline-block"
             :class="!rightHidden?'data-right-tab-act':''">
          表关系
        </div>

      </div>
    </div>
    <div class="graphtool-bottom">
      <div class="data-sort" id="ordera">
        <div class="tstext">排序</div>
        <div id="order" class="box-bg form-group" style="overflow: auto;"></div>
      </div>
      <div class="data-list mar-l" id="sqlHidden">
        <div id="attr" class="data-list-table" style="margin-top:34px;margin-bottom:10px">
          <!--<div id="attr" class="data-list-item" style="margin-top:34px;margin-bottom:10px">-->
          <div class="table-view">
            <!-- <table class="table table-striped" id="gridTable"></table> -->
            <el-table
              ref="gridTable"
              :data="tableData"
              tooltip-effect="dark"
              :height="tableHeight-130"
              style="width: 100%;"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center">
              </el-table-column>
              <el-table-column
                prop="tableName"
                header-align="center"
                align="center"
                label="来源"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="英文字段名"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="中文字段名"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="别名"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.alias" @change="changeAlisa(scope.row.id,scope.row.table)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="聚合函数"
                width="150"
              >
                <template slot-scope="scope">
                  <el-select :id="'fun'+scope.row.id" v-if="scope.row.group" v-model="scope.row.fun"
                             @change="changeGruop(scope.row.id,scope.row.table,scope.row.name)">
                    <el-option value="jh" label="聚合函数"></el-option>
                    <el-option value="count" label="总行数"></el-option>
                    <el-option value="max" label="最大"></el-option>
                    <el-option value="min" label="最小"></el-option>
                    <el-option value="sum" label="求和"></el-option>
                    <el-option value="avg" label="平均值"></el-option>
                    <el-option value="variance" label="方差"></el-option>
                    <el-option value="variance" label="样本方差"></el-option>
                    <el-option value="stddev_pop" label="标准偏差"></el-option>
                    <el-option value="stddev_pop" label="样本标准偏差"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="排序"
                width="100"
              >
                <template slot-scope="scope">
                  <i class="el-icon-sort-up table-sort-btn"
                     @click="clickOrderASC(scope.row.id,scope.row.table,scope.row.name)"></i>
                  <i class="el-icon-sort-down table-sort-btn"
                     @click="clickOrderDESC(scope.row.id,scope.row.table,scope.row.name)"></i>
                  <i class="el-icon-s-fold table-sort-btn"
                     @click="clickOrderWX(scope.row.id,scope.row.table,scope.row.name)"></i>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                label="筛选"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="screen(scope.row)">筛选</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="分组"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="clickGroup(scope.row.id,scope.row.table,scope.row.name,true),scope.row.group=true"
                             v-if="!scope.row.group">加入分组
                  </el-button>
                  <el-button type="primary" @click="clickGroup(scope.row.id,scope.row.table,scope.row.name,false),scope.row.group=false"
                             v-if="scope.row.group">取消分组
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div id="sql" class="box-bg1 sql-box">
          {{sqlMsg}}
        </div>
        <!--<div id="sql" class="box-bg"></div>-->
      </div>
    </div>
    <el-dialog :modal-append-to-body="true" width="75%" title="筛选" :visible.sync="dialogFormVisible">
      <div class="screen-body">
        <queryBuilder :key="screenKey" ref="queryBuilder" v-model="queryJson" :rules="queryRules"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,cleanQueryRules()">取 消</el-button>
        <el-button type="primary" @click="saveScreen()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body="true" top="2vh" width="95%" title="执行结果" :visible.sync="wsVisiable">
      <el-tabs @tab-click="tabClick" v-if="resultTableTabs.length>0" v-model="resultTableTabsValue" type="border-card">
        <el-tab-pane
          :key="String(index)"
          v-for="(item, index) in resultTableTabs"
          v-if="item"
          :label="'结果'+(index+1)"
          :name="String(index)"
        >
          <div v-if="item.list==''">
            <div v-if="!item.columnList">{{item.msg}}</div>
            <el-table height="52vh" v-if="item.columnList" border :data="[]" stripe style="width: 100%" class="box-table">
              <el-table-column v-if="item.columnListSelf[0]" v-for="(vtem,key,index) in item.columnListSelf[0]" prop="key" :key="index" :label="key">

              </el-table-column>
            </el-table>
          </div>
          <!--<el-table :height="fullScreen?'80vh':boxHeight*0.35" v-if="item.list!=''" border :data="item.list" stripe style="width: 100%" class="box-table">-->
          <!--<el-table :height="fullScreen?'70vh':boxHeight*0.35" v-if="item.list!=''" border :data="item.dataPageList" stripe style="width: 100%" class="box-table">-->
          <el-table height="52vh" v-if="item.list!=''" border :data="item.dataPageList" stripe style="width: 100%" class="box-table">
            <el-table-column v-if="item.columnListSelf[0]" v-for="(vtem,key,index) in item.columnListSelf[0]" :key="index" :label="key">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row[key]}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="(val)=>{sizeChangeTable(val,item,index)}"
            @current-change="(val)=>{currentChangeTable(val,item,index)}"
            :current-page="item.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="item.pageSize"
            :total="item.totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>
<script>
  import {PxSocket,randomString} from '@/utils'
  import SelfLoading from '@/utils/selfLoading'
  import queryBuilder from "@/views/modules/dataAcquisition/VueQueryBuilder.vue";

  require("../../../utils/jquery/jquery-3.3.1");
  const make = go.GraphObject.make;
  export default {
    props:{
      modelName: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        from:'',
        myDiagramDivLeft:0,
        resultTableTabs: [],//sql执行返回的动态tab
        resultTableTabsValue: '2',//动态标签显示项
        wsVisiable:false,//websocket执行结果显示状态
        ws:{},//websoket对象
        userId:sessionStorage.getItem("userId")+"-"+(this.modelName!=null&&this.modelName!=''?this.modelName:'graphtool'),
        screenKey:0,
        screenRow: {},//筛选的当前行
        queryRules: [], // querybuilder的规则数据
        queryJson: {}, // queryBuilder上动态绑定的json数据
        dialogFormVisible: false,//筛选弹框状态
        sqlMsg: '',//sql语句
        //是否隐藏数据表
        leftHidden: false,
        //是否隐藏表关系
        rightHidden: false,

        filter: {},
        layeX: -1,
        layeY: -1,
        myDiagram: {},
        tableNames: [],
        keyNames: [],
        group: false,
        join: [],
        order: [],
        models: [],
        linkData: [],
        defaultProps: {
          children: 'children',
          label(data, node) {
            const config = data.__config__ || data
            return config.label || config.title
          },
          isLeaf: (data, node) => {
            if (node.level > 2) {// 根据需要进行条件判断添加is-leaf类名
              return true
            }
          }
        },
        loadTree: [],//左边树懒加载的数据
        dataTreeData: [],//左边树数据表初始的数据
        treeExpandData: [], // 通过接口获取的需要默认打开的节点
        tableData: []
      };
    },
    activated() {
      this.getSjbData()
    },
    mounted() {
      this.init();
      this.getGojsClientXY();
      window.changeType = this.changeType;
      var diagramDivw = document.getElementById("myDiagramDiv");
      diagramDivw.onmousemove = function (event) {
        this.layeX = event.layerX;
        this.layeY = event.layerY;
      };
      this.ws=new PxSocket({
        url:this.$http.wsUrl('websocket?'+this.userId),
        succ:this.getDataList
      });
      this.ws.connect();
      this.form='detail';
      var obj={"join":[{"key":"A","tableName":"医院住院结算主单","chineseName":"医院住院结算主单_A_A","type":",","loc":"-340.68047149019554 -118.67175531492083","fields":[{"tableName":"医院住院结算主单","tableId":"fc28c34a486749898e59f8735069e51b","name":"转科科室编码","info":"转科科室编码","alias":"转科科室编码","color":"#FFFFFF","hidden":true,"id":"Aid转科科室编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":488,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"19e73798921e4e2094d708ef484eff38","name":"转科科别名称","info":"转科科别名称","alias":"转科科别名称","color":"#FFFFFF","hidden":true,"id":"Aid转科科别名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":493,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"7c32eef02bb94292b8ce909042f89c69","name":"住院医疗类型","info":"住院医疗类型","alias":"住院医疗类型","color":"#707070","hidden":false,"id":"Aid住院医疗类型","fun":"sum","screen":[],"condition":"","more":"","key":"A","group":true,"__gohashid":498,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"d608901787a9435387ff3878f1776a2f","name":"住院天数","info":"住院天数","alias":"住院天数","color":"#707070","hidden":false,"id":"Aid住院天数","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":503,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"dfc8c15b6fe0411eb8b8a967ee6bfbcb","name":"住院号","info":"住院号","alias":"住院号","color":"#707070","hidden":false,"id":"Aid住院号","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":508,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"3c20d40cf19c4b4e9ec7bd2974f06741","name":"主诊医师姓名","info":"主诊医师姓名","alias":"主诊医师姓名","color":"#FFFFFF","hidden":true,"id":"Aid主诊医师姓名","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":513,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"7413a388f47645c499b51f63444d81a5","name":"主诊医师编码","info":"主诊医师编码","alias":"主诊医师编码","color":"#FFFFFF","hidden":true,"id":"Aid主诊医师编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":518,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"9439ac96ec4b4fbf9cca416decc22c37","name":"异地标志","info":"异地标志","alias":"异地标志","color":"#FFFFFF","hidden":true,"id":"Aid异地标志","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":523,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"cdfccc42fba640d599034755e8838e60","name":"医院级别","info":"医院级别","alias":"医院级别","color":"#FFFFFF","hidden":true,"id":"Aid医院级别","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":528,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"872cdf17bb434300a5c7a16678d57d5b","name":"医疗总发生费用","info":"医疗总发生费用","alias":"医疗总发生费用","color":"#FFFFFF","hidden":true,"id":"Aid医疗总发生费用","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":533,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"b7e4ecbcfe4049248968300da4d42abb","name":"医疗机构名称","info":"医疗机构名称","alias":"医疗机构名称","color":"#FFFFFF","hidden":true,"id":"Aid医疗机构名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":538,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"c6446c639f7640878659bb7ac80dcb60","name":"医疗机构编码","info":"医疗机构编码","alias":"医疗机构编码","color":"#FFFFFF","hidden":true,"id":"Aid医疗机构编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":543,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"f4e9d1c6ff324fa3b704111277997992","name":"医保支付方式","info":"医保支付方式","alias":"医保支付方式","color":"#FFFFFF","hidden":true,"id":"Aid医保支付方式","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":548,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"a4563fd914bc491b9c05a7d008b81ecf","name":"医保实际支付费用","info":"医保实际支付费用","alias":"医保实际支付费用","color":"#FFFFFF","hidden":true,"id":"Aid医保实际支付费用","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":553,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"f27bccf51e1e456fabf966cf08bb76db","name":"医保申请支付金额","info":"医保申请支付金额","alias":"医保申请支付金额","color":"#FFFFFF","hidden":true,"id":"Aid医保申请支付金额","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":558,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"ab7a2552b8d3436f93b398b2375559d4","name":"医保结算等级","info":"医保结算等级","alias":"医保结算等级","color":"#FFFFFF","hidden":true,"id":"Aid医保结算等级","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":563,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"9b87a7daf6ab4e848cb3cd7e4a6b73fa","name":"新生儿入院体重","info":"新生儿入院体重","alias":"新生儿入院体重","color":"#FFFFFF","hidden":true,"id":"Aid新生儿入院体重","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":568,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"5c5282ffd99a41f1b9d015fb8ff887c0","name":"新生儿入院类型","info":"新生儿入院类型","alias":"新生儿入院类型","color":"#FFFFFF","hidden":true,"id":"Aid新生儿入院类型","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":573,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"5e4476d6b6564882b988694e85fe5cba","name":"新生儿出生体重","info":"新生儿出生体重","alias":"新生儿出生体重","color":"#FFFFFF","hidden":true,"id":"Aid新生儿出生体重","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":578,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"e4227cf3a08b4957963b125c41e8e1f0","name":"险种类型","info":"险种类型","alias":"险种类型","color":"#FFFFFF","hidden":true,"id":"Aid险种类型","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":583,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"e0878b0178b049aea1084902e72f5901","name":"退费时间","info":"退费时间","alias":"退费时间","color":"#FFFFFF","hidden":true,"id":"Aid退费时间","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":588,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"bf0e6f2df0e8441c9f87be6a66a31950","name":"退费标识","info":"退费标识","alias":"退费标识","color":"#FFFFFF","hidden":true,"id":"Aid退费标识","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":593,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"f9983ca91ea146a3a86be0eb93a33e8b","name":"统筹区域名称","info":"统筹区域名称","alias":"统筹区域名称","color":"#FFFFFF","hidden":true,"id":"Aid统筹区域名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":598,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"932525b5f73d44cab81aef7b7feb3eb9","name":"统筹区域编码","info":"统筹区域编码","alias":"统筹区域编码","color":"#FFFFFF","hidden":true,"id":"Aid统筹区域编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":603,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"b88cf0e081cb4345962c2f259a94ee27","name":"是否有31天内再住院计划","info":"是否有31天内再住院计划","alias":"是否有31天内再住院计划","color":"#FFFFFF","hidden":true,"id":"Aid是否有31天内再住院计划","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":608,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"28cce237085b4bd0950d6a03f342eaaa","name":"上一次出院日期","info":"上一次出院日期","alias":"上一次出院日期","color":"#FFFFFF","hidden":true,"id":"Aid上一次出院日期","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":613,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"c47c1521642b463aa87c056ddaff06f4","name":"入院诊断名称","info":"入院诊断名称","alias":"入院诊断名称","color":"#FFFFFF","hidden":true,"id":"Aid入院诊断名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":618,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"035ca5a5381245f6a1a4483f048fea01","name":"入院诊断编码","info":"入院诊断编码","alias":"入院诊断编码","color":"#FFFFFF","hidden":true,"id":"Aid入院诊断编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":623,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"4bf10eaf557a43fbbadeae0a979c26ed","name":"入院日期","info":"入院日期","alias":"入院日期","color":"#FFFFFF","hidden":true,"id":"Aid入院日期","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":628,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"8dfdae2f479448cc84d5bfdfacb6affd","name":"入院科室名称","info":"入院科室名称","alias":"入院科室名称","color":"#FFFFFF","hidden":true,"id":"Aid入院科室名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":633,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"fccd0b763736427d998c2ed0b7b6bc0b","name":"入院科别编码","info":"入院科别编码","alias":"入院科别编码","color":"#FFFFFF","hidden":true,"id":"Aid入院科别编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":638,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"1ef0ec294eff4806b8ac9926f181a25f","name":"人员类型","info":"人员类型","alias":"人员类型","color":"#FFFFFF","hidden":true,"id":"Aid人员类型","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":643,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"6139b225acaf4c77a2ef28afa7e25d1f","name":"离院方式","info":"离院方式","alias":"离院方式","color":"#FFFFFF","hidden":true,"id":"Aid离院方式","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":648,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"06419fa8bce94021bd0e18f310c1f1da","name":"拒付金额","info":"拒付金额","alias":"拒付金额","color":"#FFFFFF","hidden":true,"id":"Aid拒付金额","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":653,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"fe8d74e2f2694a2ca3b2c16cb680fa62","name":"结算日期","info":"结算日期","alias":"结算日期","color":"#FFFFFF","hidden":true,"id":"Aid结算日期","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":658,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"c6faa86108514f1da4b615871a13e219","name":"结算类别","info":"结算类别","alias":"结算类别","color":"#FFFFFF","hidden":true,"id":"Aid结算类别","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":663,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"412e4f0bfd104db9b116ec33ab04b0cc","name":"结算单据号","info":"结算单据号","alias":"结算单据号","color":"#FFFFFF","hidden":true,"id":"Aid结算单据号","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":668,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"1c898a5bde084f869696f1fc9b7aabda","name":"患者姓名","info":"患者姓名","alias":"患者姓名","color":"#FFFFFF","hidden":true,"id":"Aid患者姓名","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":673,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"11d1e672a307423581258e056b7a9fed","name":"患者性别","info":"患者性别","alias":"患者性别","color":"#FFFFFF","hidden":true,"id":"Aid患者性别","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":678,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"a46399925c9a4f6e958d4a743f23f9e7","name":"患者社保卡号","info":"患者社保卡号","alias":"患者社保卡号","color":"#FFFFFF","hidden":true,"id":"Aid患者社保卡号","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":683,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"f4f1bcb01b9e48efb535ee64b28fa717","name":"患者年龄","info":"患者年龄","alias":"患者年龄","color":"#FFFFFF","hidden":true,"id":"Aid患者年龄","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":688,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"8a09688f742347cdb4ef9b10080f5d51","name":"患者出生日期","info":"患者出生日期","alias":"患者出生日期","color":"#FFFFFF","hidden":true,"id":"Aid患者出生日期","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":693,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"1841091472244a9c8154f9c0bbb55c4e","name":"个人编码","info":"个人编码","alias":"个人编码","color":"#FFFFFF","hidden":true,"id":"Aid个人编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":698,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"e3029f0483e1473986704de970162661","name":"出院诊断名称","info":"出院诊断名称","alias":"出院诊断名称","color":"#FFFFFF","hidden":true,"id":"Aid出院诊断名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":703,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"5c64140e41bf47baae2a5c25b672df92","name":"出院诊断编码","info":"出院诊断编码","alias":"出院诊断编码","color":"#FFFFFF","hidden":true,"id":"Aid出院诊断编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":708,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"f5765dc217074375950379b7097f0296","name":"出院日期","info":"出院日期","alias":"出院日期","color":"#FFFFFF","hidden":true,"id":"Aid出院日期","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":713,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"e5385fdcdd2743808a82a54308e06586","name":"出院科室名称","info":"出院科室名称","alias":"出院科室名称","color":"#FFFFFF","hidden":true,"id":"Aid出院科室名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":718,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"89a7ca1fbe854eaeaec80311cb37c8f0","name":"出院科室编码","info":"出院科室编码","alias":"出院科室编码","color":"#FFFFFF","hidden":true,"id":"Aid出院科室编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":723,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"12ae8680a5fb49308fed6f94ca2a55cb","name":"病组病种名称","info":"病组病种名称","alias":"病组病种名称","color":"#FFFFFF","hidden":true,"id":"Aid病组病种名称","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":728,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"087dc583565d4c75b6742bebf3d5e15e","name":"病组病种编码","info":"病组病种编码","alias":"病组病种编码","color":"#FFFFFF","hidden":true,"id":"Aid病组病种编码","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":733,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"644da29259d444efa9ead868799cab88","name":"病案号","info":"病案号","alias":"病案号","color":"#FFFFFF","hidden":true,"id":"Aid病案号","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":738,"table":"A","tables":"医院住院结算主单_A_A"},{"tableName":"医院住院结算主单","tableId":"30e87d4256cd4cf6a58f69147010bd97","name":"本地异地结算类型","info":"本地异地结算类型","alias":"本地异地结算类型","color":"#FFFFFF","hidden":true,"id":"Aid本地异地结算类型","fun":"","screen":[],"condition":"","more":"","key":"A","group":false,"__gohashid":743,"table":"A","tables":"医院住院结算主单_A_A"}],"__gohashid":454,"on":[]},{"key":"B","tableName":"医院住院结算明细","chineseName":"医院住院结算明细_A_A","type":"INNER JOIN","loc":"-113.1650205737929 -108.37265417196396","fields":[{"tableName":"医院住院结算明细","tableId":"31891c0b8ef4408dad7b9998b67adbff","name":"最小包装单位","info":"最小包装单位","alias":"最小包装单位","color":"#FFFFFF","hidden":true,"id":"Bid最小包装单位","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":932,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"50d2d239aec347f3b690c295c7e19ee0","name":"住院号","info":"住院号","alias":"住院号","color":"#FFFFFF","hidden":true,"id":"Bid住院号","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":937,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"0254ef4f6d9f493b933714409901cfd9","name":"执行科室名称","info":"执行科室名称","alias":"执行科室名称","color":"#707070","hidden":false,"id":"Bid执行科室名称","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":942,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"9262ffa0d46c43178a74596b44f65f41","name":"执行科室编码","info":"执行科室编码","alias":"执行科室编码","color":"#707070","hidden":false,"id":"Bid执行科室编码","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":947,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"97dae113dbc84123ac39efbebc84fd04","name":"医院项目名称","info":"医院项目名称","alias":"医院项目名称","color":"#FFFFFF","hidden":true,"id":"Bid医院项目名称","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":952,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"34be9f6483284f6e9097c3ea458158d0","name":"医院项目编码","info":"医院项目编码","alias":"医院项目编码","color":"#FFFFFF","hidden":true,"id":"Bid医院项目编码","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":957,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"e6f1d118b7684b6595a75da413a55ae8","name":"医疗机构名称","info":"医疗机构名称","alias":"医疗机构名称","color":"#FFFFFF","hidden":true,"id":"Bid医疗机构名称","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":962,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"3d4c6cb531ea4e939d769af830e28d83","name":"医疗机构编码","info":"医疗机构编码","alias":"医疗机构编码","color":"#FFFFFF","hidden":true,"id":"Bid医疗机构编码","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":967,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"75e16c9c1d3f4d5dbbebec187be4e518","name":"医保项目名称","info":"医保项目名称","alias":"医保项目名称","color":"#FFFFFF","hidden":true,"id":"Bid医保项目名称","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":972,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"548d3016bf874286a6082fb08dcf0d9c","name":"医保项目编码","info":"医保项目编码","alias":"医保项目编码","color":"#FFFFFF","hidden":true,"id":"Bid医保项目编码","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":977,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"79bec977b19c460d9fe5e127801ba0cc","name":"医保申请支付金额","info":"医保申请支付金额","alias":"医保申请支付金额","color":"#FFFFFF","hidden":true,"id":"Bid医保申请支付金额","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":982,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"650bb7bed02c4d8eaf342e0146e771f5","name":"项目总发生金额","info":"项目总发生金额","alias":"项目总发生金额","color":"#FFFFFF","hidden":true,"id":"Bid项目总发生金额","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":987,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"78450831b32a453fb3f11edef132b391","name":"项目使用时间","info":"项目使用时间","alias":"项目使用时间","color":"#FFFFFF","hidden":true,"id":"Bid项目使用时间","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":992,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"55e131a9ce754df89d4ae669188ab76d","name":"退费时间","info":"退费时间","alias":"退费时间","color":"#FFFFFF","hidden":true,"id":"Bid退费时间","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":997,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"1606d9942046425a8449da0d4009a5e1","name":"退费标识","info":"退费标识","alias":"退费标识","color":"#FFFFFF","hidden":true,"id":"Bid退费标识","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1002,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"cf1b6d81e6834e6396972c7784ded5af","name":"数量","info":"数量","alias":"数量","color":"#FFFFFF","hidden":true,"id":"Bid数量","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1007,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"4b4f960236b94f0bbe76e17bf0feefa5","name":"拒付理由","info":"拒付理由","alias":"拒付理由","color":"#FFFFFF","hidden":true,"id":"Bid拒付理由","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1012,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"a82ee290cf064dd39da7db5119c330a7","name":"拒付金额","info":"拒付金额","alias":"拒付金额","color":"#FFFFFF","hidden":true,"id":"Bid拒付金额","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1017,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"8a1b6d42925a41a9b1192ff5c8341c17","name":"结算单据号","info":"结算单据号","alias":"结算单据号","color":"#FFFFFF","hidden":true,"id":"Bid结算单据号","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1022,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"f8b39c443e324168888d474b835e41cc","name":"剂型","info":"剂型","alias":"剂型","color":"#FFFFFF","hidden":true,"id":"Bid剂型","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1027,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"486456b5c9e24aef8c16c82c535a9e70","name":"规格","info":"规格","alias":"规格","color":"#FFFFFF","hidden":true,"id":"Bid规格","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1032,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"daada6d628de4785a04ff22e89759008","name":"个人编码","info":"个人编码","alias":"个人编码","color":"#FFFFFF","hidden":true,"id":"Bid个人编码","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1037,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"4f300cb2c6454b71b706439159118d00","name":"费用类别","info":"费用类别","alias":"费用类别","color":"#FFFFFF","hidden":true,"id":"Bid费用类别","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1042,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"97af34a1147448beb679346df4423919","name":"单价","info":"单价","alias":"单价","color":"#FFFFFF","hidden":true,"id":"Bid单价","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1047,"table":"B","tables":"医院住院结算明细_A_A"},{"tableName":"医院住院结算明细","tableId":"21f401fcb61749f79ecc0659c8bbdd19","name":"出院带药标识","info":"出院带药标识","alias":"出院带药标识","color":"#FFFFFF","hidden":true,"id":"Bid出院带药标识","fun":"","screen":[],"condition":"","more":"","key":"B","group":false,"__gohashid":1052,"table":"B","tables":"医院住院结算明细_A_A"}],"__gohashid":912,"on":[{"from":"A","to":"B","fromPort":"住院号","toPort":"执行科室名称","compare":"="},{"from":"A","to":"B","fromPort":"主诊医师编码","toPort":"医院项目编码","compare":"="}]},{"key":"C","tableName":"医院住院检查检验结果","chineseName":"医院住院检查检验结果_A_A","type":"INNER JOIN","loc":"83.1953125 -125.5","fields":[{"tableName":"医院住院检查检验结果","tableId":"2e221912bffb48beb0328987216682e2","name":"住院号","info":"住院号","alias":"住院号","color":"#FFFFFF","hidden":true,"id":"Cid住院号","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1160,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"7aa9e0e4207d4f3d86d737b133c00aca","name":"医院项目名称","info":"医院项目名称","alias":"医院项目名称","color":"#FFFFFF","hidden":true,"id":"Cid医院项目名称","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1165,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"1d015f0e84a1455daac082c9295e9970","name":"医院项目编码","info":"医院项目编码","alias":"医院项目编码","color":"#FFFFFF","hidden":true,"id":"Cid医院项目编码","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1170,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"2bfc43fafaee42f1827354fb4c38835c","name":"医疗机构名称","info":"医疗机构名称","alias":"医疗机构名称","color":"#FFFFFF","hidden":true,"id":"Cid医疗机构名称","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1175,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"8f146721e2e74dd29b21f2b6d37ff015","name":"医疗机构编码","info":"医疗机构编码","alias":"医疗机构编码","color":"#707070","hidden":false,"id":"Cid医疗机构编码","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1180,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"b60c71cb5111415cbbb43b0d75788fdd","name":"医保项目名称","info":"医保项目名称","alias":"医保项目名称","color":"#FFFFFF","hidden":true,"id":"Cid医保项目名称","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1185,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"502548f35c7c4edfba09fc3babe69e6e","name":"医保项目编码","info":"医保项目编码","alias":"医保项目编码","color":"#FFFFFF","hidden":true,"id":"Cid医保项目编码","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1190,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"a8964df64e734888ac12408d7ab47741","name":"结算单据号","info":"结算单据号","alias":"结算单据号","color":"#FFFFFF","hidden":true,"id":"Cid结算单据号","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1195,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"f911d620789d41669902220981e8b198","name":"结果值","info":"结果值","alias":"结果值","color":"#FFFFFF","hidden":true,"id":"Cid结果值","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1200,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"3991367e5cf7411a8e9849d83170032b","name":"单位","info":"单位","alias":"单位","color":"#FFFFFF","hidden":true,"id":"Cid单位","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1205,"table":"C","tables":"医院住院检查检验结果_A_A"},{"tableName":"医院住院检查检验结果","tableId":"b667d875205d4453aa906cc0b95ec81f","name":"参考值","info":"参考值","alias":"参考值","color":"#FFFFFF","hidden":true,"id":"Cid参考值","fun":"","screen":[],"condition":"","more":"","key":"C","group":false,"__gohashid":1210,"table":"C","tables":"医院住院检查检验结果_A_A"}],"__gohashid":1140,"on":[{"from":"B","to":"C","fromPort":"医院项目名称","toPort":"医保项目编码","compare":"="}]}],"order":[{"column":"A.住院医疗类型","order":"ASC"},{"column":"A.住院号","order":"ASC"}]};
      console.log(obj.join)
      // obj.join.forEach(item=>{
      //   this.addNodeData(item);
      //   if(item.on&&item.on.length>0){
      //     item.on.forEach(vtem=>{
      //       this.myDiagram.model.addLinkData(vtem);
      //     })
      //   }
      // });
      // this.order=obj.order;
      // this.initOrder();
      // this.toSql();
    },
    destroyed(){
      this.ws.close();
    },
    methods: {
      //改变右上角表关联字段的选项
      changeCopare(){
        var fromtab = $("#from").val();
        var totab = $("#to").val();
        var fromPort = $("#MainPort").val();
        var toPort = $("#toPort").val();
        var copare = $("#comper").val();
        var i = this.indexOfJoin(fromtab);
        var j = this.indexOfJoin(totab);

        var idx = Math.max(i, j);

        var editIdx = -1;
        for (var i = 0; i < this.join[idx].on.length; i++) {
          if (this.join[idx].on[i].fromPort === fromPort && this.join[idx].on[i].toPort === toPort) {
            this.join[idx].on[i].compare = copare;
          }
        }
        this.showJoin();
        this.toSql();
      },
      //改变join的类型
      changeType(i){
        var slaverTable = $("#slaverTable"+i).val();
        var type = $("#type"+i).val();
        var idx = this.indexOfJoin(slaverTable);
        this.join[idx].type=type;
        this.showJoin();
        this.toSql();
      },
      //sql结果tab切换事件
      tabClick(e){
        var list=this.resultTableTabs[e.index].list;
        this.resultTabClick(list)
      },
      //执行结果页码点击
      currentChangeTable(val,item,index){
        item.pageIndex=val;
        item.dataPageList=item.list.slice((item.pageIndex-1)*item.pageSize,item.pageIndex*item.pageSize);
        this.$forceUpdate();
        this.$set(this.resultTableTabs,this.resultTableTabs);
      },
      //执行结果页数改变
      sizeChangeTable(val,item){
        item.pageSize=val;
        item.pageIndex = 1;
        item.dataPageList=item.list.slice((item.pageIndex-1)*item.pageSize,item.pageIndex*item.pageSize);
        this.$forceUpdate();
        this.$set(this.resultTableTabs,this.resultTableTabs);
      },
      //点击运行获取websoket数据
      getwsData(sql) {
        var obj={
          join:this.join,
          order:this.order
        };
        console.log(JSON.stringify( obj));
        if(sql!=''){
            this.resultTableTabs=[];
            var params={
              sqlScript:sql,
              loadOnce:false,
              dataSize:"500",
              webSocketId:this.userId,
            };
            SelfLoading.show({
              buttonClass:'el-button el-button--primary',
              buttonText:'取消执行',
              buttonFun:function(){SelfLoading.hide()}
            });
            this.$http({
              url: this.$http.adornUrl('/sqlScript/executeSQL_SqlEditor'),
              method: 'post',
              data: this.$http.adornData(params),
              isLoading:false
            }).then(({data}) => {
              SelfLoading.hide();
              if(data.code==200){

              }else{
                // this.$message.error(data.message);
                this.$alert(data.message, '注意', {
                  cancelButtonText: '关闭',
                  showConfirmButton: false,
                  showCancelButton: true,
                  type: 'error',
                });
              }
            })
        }else{
          this.$message.error("sql语句不能为空")
        }
      },
      //获取sql运行websocket返回的数据
      getDataList(datas){
        this.key+=1;
        if(datas&&datas!='ping'){
          datas=JSON.parse(datas);
          console.log(datas);
          var v={};
          if(datas.data&&datas.data.result){
            v={
              list:datas.data.result||[],
              columnList:datas.data.columnList,
              msg:datas.message,
              codeName:datas.codeName,
              isLast:datas.data.isLast
            };
          }else{
            v={
              list:[],
              columnList:datas.data.columnList,
              msg:datas.message,
              codeName:datas.codeName,
              isLast:datas.data.isLast
            };
          }
          this.resultTableTabs.push(v);
          console.log(this.resultTableTabs);
          this.wsVisiable=true;
        }
      },
      //筛选弹框确定点击
      saveScreen() {
        this.dialogFormVisible = false;
        var sql = this.queryToSql(this.queryJson);
        var idx =  this.indexOfJoin(this.screenRow.table);
        var datajoin =  this.join[idx];
        for(var i=0;i<datajoin.fields.length;i++){
          var field = datajoin.fields[i];
          if(field.id == this.screenRow.id){
            this.join[idx].fields[i].more=sql;
          }
        }
        this.initTableRow();
        this.toSql();
        this.$refs.queryBuilder.query.children=[];
        // console.log(this.$refs.queryBuilder);
      },
      //通过返显的Json字符串拼出返显的sql
      queryToSql(query) {
        const sql = [];
        const that = this;
        const logicalOperator = query.logicalOperator;
        const children = query.children;
        children.forEach((child) => {
          const type = child.type;
          if (type === "query-builder-rule") {
            var dataTypeObj ='';
            if (dataTypeObj=='') {
              if (child.query.operator == "like" || child.query.operator == "not like") {
                sql.push(child.query.operand);
                sql.push(child.query.operator);
                sql.push("'%" + child.query.value + "%'");
              } else if (child.query.operator == "is null" || child.query.operator == "is not null") {
                let arr = ''
                child.query.value = arr
                sql.push(child.query.operand);
                sql.push(child.query.operator);
                sql.push("" + child.query.value + "");
              } else {
                sql.push(child.query.operand);
                sql.push(child.query.operator);
                sql.push("'" + child.query.value + "'");
              }

            } else {
              sql.push(child.query.operand);
              sql.push(child.query.operator);
              sql.push(child.query.value);
            }
          } else {
            sql.push("(");
            sql.push(that.queryToSql(child.query));
            sql.push(")");
          }
          sql.push(logicalOperator);
        });
        sql.splice(sql.length - 1, sql.length);
        return sql.join(" ");
      },
      //重置querybuilder的规则数据
      cleanQueryRules() {
        this.queryRules = [];
      },
      //筛选按钮点击
      screen(row) {
        this.screenKey=Math.random();
        this.screenRow = row;
        this.queryRules = [];
        var v = {
          type: 'inputselect',
          label:row.key+"."+ row.info,
          value:row.key+"."+ row.info,
          operators: [{'id': "=", "label": "等于"}, {'id': "!=", "label": "不等于"}, {
            'id': "like",
            "label": "包含以下内容"
          }, {'id': "not like", "label": "不包含以下内容"}, {'id': "is null", "label": "为空值"}, {
            'id': "is not null",
            "label": "不为空值"
          },]
        };
        this.queryRules.push(v);
        this.dialogFormVisible = true;

      },
      getCanvas() {
        this.upDateDiagramAnimationFrame(0)
      },
      upDateDiagramAnimationFrame(count) {
        count++;
        requestAnimationFrame(() => {
          this.myDiagram.requestUpdate();
          if (count < 60) {
            this.upDateDiagramAnimationFrame(count);
          }
        });
      },
      init() {

        var that = this;
        that.myDiagram = make(
          go.Diagram,
          "myDiagramDiv",
          {
            allowMove: true, //允许拖动
            allowZoom: true,
            autoScale: go.Diagram.UniformToFill,
            validCycle: go.Diagram.CycleNotDirected,  // don't allow loops不允许循环
            // For this sample, automatically show the state of the diagram's model on the page
            "ModelChanged": function (e) {
              if (e.isTransactionFinished) {
                that.toSql();
              }
            },
            "undoManager.isEnabled": true
          }
        );
        // This template is a Panel that is used to represent each item in a Panel.itemArray.
        // 此模板是一个Panel，用于表示Panel.itemArray中的每个项目。
        // The Panel is data bound to the item object.
        // Panel是绑定到item对象的数据。
        var fieldTemplate = make(
          go.Panel,
          "TableRow", // this Panel is a row in the containing Table   此Panel是包含表中的一行
          new go.Binding("portId", "name"), // this Panel is a "port"  这个小组是一个“港口”
          {
            background: "transparent", // so this port's background can be picked by the mouse  所以这个港口的背景可以被鼠标选中
            fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side 链接只从右侧到左侧
            toSpot: go.Spot.LeftRightSides,
            // allow drawing links from or to this port:允许从此端口绘制链接：
            fromLinkable: true,
            toLinkable: true
          },
          {
            // allow the user to select items -- the background color indicates whether "selected"
            // 允许用户选择项目 - 背景颜色表示是否“选中”
            // maybe this should be more sophisticated than simple toggling of selection
            // 也许这应该比简单的选择切换更复杂
            click: function (e, item) {
              // assume "transparent" means not "selected", for items 对于项目，假设“透明”表示不“选择”
              var oldskips = item.diagram.skipsUndoManager;
              item.diagram.skipsUndoManager = true;
              if (item.data.color == "#FFFFFF") {
                item.data.color = "#707070";
                var obj = item.data;
                var key = obj.table;
                var idx = that.indexOfJoin(key);
                for (var i = 0; i < that.join[idx].fields.length; i++) {
                  var field = that.join[idx].fields[i];
                  if (field.name == obj.name) {
                    field.hidden = false;
                    break;
                  }
                }
                that.initTableRow();
                that.toSql();
              } else {
                item.data.color = "#FFFFFF";
                var obj = item.data;
                var key = obj.table;
                var idx = that.indexOfJoin(key);
                for (var i = 0; i < that.join[idx].fields.length; i++) {
                  var field = that.join[idx].fields[i];
                  if (field.name == obj.name) {
                    field.hidden = true;
                    field.more = [];
                  }
                }
                if (that.filter[item.data.id]) {
                  delete that.filter[item.data.id];
                }
                that.initTableRow(item.data.tableId);
                that.toSql();
              }
              that.myDiagram.model.updateTargetBindings(item.data);
              item.diagram.skipsUndoManager = oldskips;
            }
          },
          make(
            go.Shape,
            {
              width: 12,
              height: 12,
              column: 0,
              strokeWidth: 2,
              margin: 4,
              fromLinkable: false,
              toLinkable: false,
            },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color")
          ),
          make(
            go.TextBlock,
            {
              margin: new go.Margin(0, 2),
              column: 1,
              font: "bold 13px sans-serif",

            },
            new go.Binding("text", "name")
          ),
          //右边info
          //   make(
          //     go.TextBlock,
          //     {
          //       margin: new go.Margin(0, 2),
          //       column: 2,
          //       font: "13px sans-serif"
          //     },
          //     new go.Binding("text", "info")
          //   )
        );

        // This template represents a whole "record".此模板代表整个“记录”。
        that.myDiagram.nodeTemplate = make(
          go.Node,
          "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // this rectangular shape surrounds the content of the node:这个矩形形状围绕着节点的内容
          make(go.Shape, {fill: "#fff",stroke: "#C1C1C1"}),
          // the content consists of a header and a list of items  内容由标题和项目列表组成
          make(
            go.Panel,
            "Vertical",
            // this is the header for the whole node  这是整个节点的标题
            make(
              go.Panel,
              "Auto",
              {stretch: go.GraphObject.Horizontal}, // as wide as the whole node  和整个节点一样宽
              make(go.Shape, {fill: "#E8ECEF", stroke: null}),
              make(
                go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  margin: 3,
                  stroke: "#000",
                  textAlign: "center",
                  font: "bold 12pt sans-serif"
                },
                new go.Binding("text", "chineseName")
              )
            ),
            // this Panel holds a Panel for each item object in the itemArray;
            // each item Panel is defined by the itemTemplate to be a TableRow in this Table
            //此Panel为itemArray中的每个item对象保存一个Panel;
            //每个项目Panel由itemTemplate定义为此表中的TableRow
            make(
              go.Panel,
              "Table",
              {
                name: "TABLE",
                padding: 2,
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                itemTemplate: fieldTemplate
              },
              new go.Binding("itemArray", "fields")
            ) // end Table Panel of items
          ) // end Vertical Panel
        ); // end Node

        //结束表项目面板
        //结束垂直面板
        //结束节点
        that.myDiagram.linkTemplate = make(
          go.Link,
          {
            relinkableFrom: true,
            relinkableTo: true,
            toShortLength: 4
          },  // let user reconnect links让用户重新连接链接
          make(go.Shape, {strokeWidth: 1.5}),
          //make(go.Shape, {toArrow: "Standard", stroke: null}),
          {
            // allow the user to select items -- the background color indicates whether "selected"
            // 允许用户选择项目 - 背景颜色表示是否“选中”
            // maybe this should be more sophisticated than simple toggling of selection
            // 也许这应该比简单的选择切换更复杂
            click: function (e, item) {
              //线的点击事件
              try {
                var data = item.data;

                var from = data.from;
                var to = data.to;
                var i = that.indexOfJoin(from);
                var j = that.indexOfJoin(to);

                var idx = Math.max(i, j);
                var compare = "";
                for (var i = 0; i < that.join[idx].on.length; i++) {
                  var on = that.join[idx].on[i];
                  if ((data.fromPort == on.fromPort && data.toPort == on.toPort) || (data.fromPort == on.toPort && data.toPort == on.fromPort)) {
                    compare = on.compare;
                  }
                }
                $("#comper").val(compare);
                $("#MainPort").val(data.fromPort);
                $("#toPort").val(data.toPort);
                $("#from").val(data.from);
                $("#to").val(data.to);
                document.getElementById("join2").style.display = "";
                document.getElementById("select").style.display = "";
                document.getElementById("join1").style.display = "";
              } catch (e) {
              }
            }
          }
        );
        that.myDiagram.model = make(
          go.GraphLinksModel,
          {
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: that.models,
            linkDataArray: that.linkData
          }
        );

        // this is a bit inefficient, but should be OK for normal-sized graphs with reasonable numbers of items per node
        // 这有点效率低，但对于每个节点具有合理数量项目的正常大小的图表应该没问题
        function findAllSelectedItems() {
          var items = [];
          for (var nit = that.myDiagram.nodes; nit.next();) {
            var node = nit.value;
            var table = node.findObject("TABLE");
            if (table) {
              for (var iit = table.elements; iit.next();) {
                var itempanel = iit.value;
                if (itempanel.background !== "transparent") {
                  items.push(itempanel);
                }
              }
            }
          }
          return items;
        }

        //禁用键盘快捷键事件
        that.myDiagram.commandHandler.doKeyDown = function () {
          var e = that.myDiagram.lastInput;
          var control = e.control || e.meta;
          var key = e.key;
          // 取消Ctrl+X/C/V/Z/Y键的命令关联:
          if (control && (key === 'Z' || key === 'Y' || key === 'X' || key === 'C' || key === 'V')) return;
          go.CommandHandler.prototype.doKeyDown.call(this);
        };

        // Override the standard CommandHandler deleteSelection behavior.
        // If there are any selected items, delete them instead of deleting any selected nodes or links.
        //覆盖标准CommandHandler deleteSelection行为。
        //如果有任何选定的项目，请删除它们，而不是删除任何选定的节点或链接。
        that.myDiagram.commandHandler.canDeleteSelection = function () {
          // true if there are any selected deletable nodes or links,
          // or if there are any selected items within nodes
          //如果有任何选定的可删除节点或链接，则为true
          //或者节点中是否有任何选定的项目
          return go.CommandHandler.prototype.canDeleteSelection.call(that.myDiagram.commandHandler) || findAllSelectedItems().length > 0;
        };

        that.myDiagram.commandHandler.deleteSelection = function () {
          go.CommandHandler.prototype.deleteSelection.call(that.myDiagram.commandHandler);
          return;
        };

        that.myDiagram.addModelChangedListener(function (evt) {
          if (!evt.isTransactionFinished) {
            return;
          }
          var txn = evt.object;
          var count = 0;
          if (txn === null) {
            return;
          }
          txn.changes.each(function (e) {
            //连线修改
            if (e.change === go.ChangedEvent.Property) {
              if (e.modelChange === "linkFromKey" || e.modelChange === "linkToKey" || e.modelChange === "linkToPortId" || e.modelChange === "linkFromPortId") {

                var objold = e.object;

                if (e.modelChange === "linkFromKey") { //模型修改等于fromkey 就是换源节点
                  objold.from = e.oldValue
                }
                if (e.modelChange === "linkToKey") {//模型修改等于tokey 就是换目标节点
                  objold.to = e.oldValue
                }
                if (e.modelChange === "linkToPortId") {//模型修改等于portid 就是换线的目标列
                  objold.toPort = e.oldValue

                }
                if (e.modelChange === "linkFromPortId") {//模型修改等于portid 就是换线的源列
                  objold.fromPort = e.oldValue
                }

                var iold = that.indexOfJoin(objold.from);//源节点在join里的下标
                var jold = that.indexOfJoin(objold.to);//目标节点在join里的下标

                var idxold = Math.max(iold, jold); //求最大的

                var delIdxold = -1;
                for (var i = 0; i < that.join[idxold].on.length; i++) {
                  if (that.join[idxold].on[i].fromPort === objold.fromPort && that.join[idxold].on[i].toPort === objold.toPort) {
                    delIdxold = i;
                    break;
                  }
                }

                that.join[idxold].on.splice(delIdxold, 1);

                if (0 === that.join[idxold].on.length) {
                  that.join[idxold].type = ",";
                  delete that.join[idxold].on;
                }

                var obj = e.object;
                if (e.modelChange === "linkFromKey") {
                  obj.from = e.newValue
                }
                if (e.modelChange === "linkToKey") {
                  obj.to = e.newValue
                }
                if (e.modelChange === "linkToPortId") {
                  obj.toPort = e.newValue
                }
                if (e.modelChange === "linkFromPortId") {

                  obj.fromPort = e.newValue
                }

                var i = that.indexOfJoin(obj.from);
                var j = that.indexOfJoin(obj.to);

                var idx = Math.max(i, j);

                if ("," === that.join[idx].type) {
                  that.join[idx].type = "INNER JOIN";
                }
                if (!that.join[idx].on) {
                  that.join[idx].on = [];
                }

                that.join[idx].on.push({
                  from: obj.from,
                  to: obj.to,
                  fromPort: obj.fromPort,
                  toPort: obj.toPort,
                  compare: "="
                });

                $("#comper").val("=");
                $("#MainPort").val("");
                $("#toPort").val("");
                $("#from").val("");
                $("#to").val("");
                that.showJoin();
                that.toSql();
                document.getElementById("join2").style.display = "none";
                document.getElementById("select").style.display = "none";
                document.getElementById("join1").style.display = "none";
              }

            }
            //连线新增
            else if (e.change === go.ChangedEvent.Insert && e.modelChange === "linkDataArray") {
              try {
              } catch (e) {
              }

              var obj = e.newValue;
              var i = that.indexOfJoin(obj.from);
              var j = that.indexOfJoin(obj.to);
              var idx = Math.max(i, j);
              if ("," === that.join[idx].type) {
                that.join[idx].type = "INNER JOIN";
              }
              if (!that.join[idx].on) {
                that.join[idx].on = [];
              }
              that.join[idx].on.push({
                from: obj.from,
                to: obj.to,
                fromPort: obj.fromPort,
                toPort: obj.toPort,
                compare: "="
              });
              $("#comper").val("=");
              $("#MainPort").val(obj.fromPort);
              $("#toPort").val(obj.toPort);
              $("#from").val(obj.from);
              $("#to").val(obj.to);
              document.getElementById("join2").style.display = "";
              document.getElementById("select").style.display = "";
              document.getElementById("join1").style.display = "";
              that.toSql();
              that.showJoin();
            }
            //连线删除
            else if (e.change === go.ChangedEvent.Remove && e.modelChange === "linkDataArray") {
              try {
              } catch (e) {
              }
              var obj = e.oldValue;
              var i = that.indexOfJoin(obj.from);
              var j = that.indexOfJoin(obj.to);

              var idx = Math.max(i, j);

              var delIdx = -1;
              for (var i = 0; i < that.join[idx].on.length; i++) {
                if (that.join[idx].on[i].fromPort === obj.fromPort && that.join[idx].on[i].toPort === obj.toPort) {
                  delIdx = i;
                  break;
                }
              }

              that.join[idx].on.splice(delIdx, 1);
              try {
                if (0 === that.join[idx].on.length) {
                  that.join[idx].type = ",";
                  delete that.join[idxold].on;
                }
              } catch (e) {
              }


              that.showJoin();
              that.toSql();
              document.getElementById("join2").style.display = "none";
              document.getElementById("select").style.display = "none";
              document.getElementById("join1").style.display = "none";
            }

            //节点删除
            else if (e.change === go.ChangedEvent.Remove && e.modelChange === "nodeDataArray") {
              that.join.splice(that.join.indexOf(e.oldValue), 1);

              for (var i = 0; i < that.order.length; i++) {
                var data = that.order[i];
                var dataArr = data.column.split(".");
                var table = dataArr[0];
                if (table == e.oldValue.key) {
                  that.order.splice(i, 1);
                  i--;
                }
              }
              that.tableNames.splice(that.tableNames.indexOf(e.oldValue.chineseName), 1);
              that.keyNames.splice(that.keyNames.indexOf(e.oldValue.key), 1);
              that.initOrder();
              that.showJoin();
              that.toSql();
              that.initTableRow();
              document.getElementById("join2").style.display = "none";
              document.getElementById("select").style.display = "none";
              document.getElementById("join1").style.display = "none";
            }
            //节点新增
            else if (e.change === go.ChangedEvent.Insert && e.modelChange === "nodeDataArray") {
              // console.log(e.newValue)
              if(that.form=='detail'){
                e.newValue.on=[];
              }
              that.join.push(e.newValue);
              that.showJoin();
              that.toSql();
              that.initTableRow();
              document.getElementById("join2").style.display = "none";
              document.getElementById("select").style.display = "none";
              document.getElementById("join1").style.display = "none";
            }
          });
        });
      },
      //点击正序
      clickOrderASC(id, table, name) {
        var column = table + "." + name;
        for (var i = 0; i < this.order.length; i++) {
          var data = this.order[i];
          if (data.column == column) {
            this.order.splice(i, 1);
          }
        }
        var orderdata = {};
        orderdata.column = column;
        orderdata.order = "ASC";
        this.order.push(orderdata);
        this.initOrder();
        this.initTableRow();
        this.toSql();
        console.log(this.join)
      },
      //点击倒序
      clickOrderDESC(id, table, name) {
        var column = table + "." + name;
        for (var i = 0; i < this.order.length; i++) {
          var data = this.order[i];
          if (data.column == column) {
            this.order.splice(i, 1);
          }
        }
        var orderdata = {};
        orderdata.column = column;
        orderdata.order = "DESC";
        this.order.push(orderdata);
        this.initOrder();
        this.initTableRow();
        this.toSql();
      },
      //点击无续
      clickOrderWX(id, table, name) {
        var column = table + "." + name;
        for (var i = 0; i < this.order.length; i++) {
          var data = this.order[i];
          if (data.column == column) {
            this.order.splice(i, 1);
          }
        }
        this.initOrder();
        this.initTableRow();
        this.toSql();
      },
      //初始化聚合标记
      groupInit() {
        var state = false;
        for (var s = 0; s < this.join.length; s++) {
          var data = this.join[s];
          for (var i = 0; i < data.fields.length; i++) {
            var field = data.fields[i];
            if (field.group == true) {
              state = true;
            }
          }
        }
        if (state == true) {
          this.group = true;
        } else {
          this.group = false;
        }
      },
      //改变聚合函数
      changeGruop(id, table, name) {
        // var idx = this.indexOfJoin(table);
        // var data = this.join[idx];
        // // var selectData = $("#fun" + id).val();
        // var selectData = data.fun;
        // for (var i = 0; i < data.fields.length; i++) {
        //   var field = data.fields[i];
        //   if (field.id == id) {
        //     // this.join[idx].fields[i].fun = selectData;
        //     // this.join[idx].fields[i].group=true;
        //   }
        // }
        this.groupInit();
        this.initOrder();
        this.initTableRow();
        this.toSql();
      },
      //改变别名
      changeAlisa(id, table) {
        // var idx = this.indexOfJoin(table);
        // var data = this.join[idx];
        // var val = $("#" + id).val();
        // for (var i = 0; i < data.fields.length; i++) {
        //   var field = data.fields[i];
        //   if (field.id == id) {
        //     this.join[idx].fields[i].alias = val;
        //   }
        // }
        this.initTableRow();
        this.toSql();
      },
      //初始化分组
      initGroup(group) {
        if (this.group == true) {
          for (var i = 0; i < this.join.length; i++) {
            var joinData = this.join[i];
            for (var j = 0; j < joinData.fields.length; j++) {
              var field = joinData.fields[j];
              if (field.hidden == false) {
                // var _funEle = document.getElementById("#fun" + field.id);
                // // $("#fun" + field.id).val(field.fun);
                // _funEle.value = field.fun;
              }
              //by yw
              if (group) {
                field.fun = '';
              }
            }
          }
        }
      },
      createTableName() {
        var ii = 0;
        var db = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        while (-1 !== this.keyNames.indexOf(db[ii])) {
          if (ii >= 26) {
            return "ml**";
          }
          ii++;
        }

        return db[ii];

      },
      createNewAS(asname) {
        var i = 0;
        var idx = 0;
        var db = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        while (-1 !== this.tableNames.indexOf(asname + "_" + db[i])) {
          if (i >= 26) {
            return "ml**";
          }
          i++;
        }
        return asname + "_" + db[i];
      },
      addNodeData(node, ele) {
        node.key = this.createTableName();
        if (node.key == "ml**") {
          return false;
        }
        node.chineseName = this.createNewAS(node.chineseName);
        this.tableNames.push(node.chineseName);
        this.keyNames.push(node.key);
        for (var i = 0; i < node.fields.length; i++) {
          node.fields[i].id = node.key + "id" + node.fields[i].name;
          node.fields[i].alias = node.fields[i].name;
          node.fields[i].fun = "jh";
          node.fields[i].screen = "";
          node.fields[i].condition = "";
          node.fields[i].more = "";
          node.fields[i].key = node.key;
          node.fields[i].screen = [];
          node.fields[i].group = false;
        }
        this.myDiagram.model.addNodeData(node);
        // if(node.chineseName=='医院住院结算明细_A'){
        //   console.log(node.chineseName)
        //   // 添加线数据
        //   var link_obj= { "from": "A","fromPort": '主诊医师姓名',"to": "B", "toPort": '住院号' };
        //   this.myDiagram.model.addLinkData(link_obj);;//增加单个线
        // }
      },
      //生成sql
      toSql() {

        var sql = "";
        var fromState = false;
        var out = "";
        if (this.group == true) {
          for (var l = 0; l < this.join.length; l++) {
            for (var m = 0; m < this.join[l].fields.length; m++) {
              if (this.join[l].fields[m].hidden == false) {
                if (this.join[l].fields[m].fun == "jh" && this.join[l].fields[m].group == true) {
                  fromState = true;
                  out = out + this.join[l].key + "." + this.join[l].fields[m].name + " AS " + this.join[l].fields[m].alias + ", ";
                } else if (this.join[l].fields[m].fun != "jh" && this.join[l].fields[m].group == true) {
                  fromState = true;
                  var funs = this.join[l].fields[m].fun + " ( " + this.join[l].fields[m].key + "." + this.join[l].fields[m].name + " ) ";
                  out = out + funs + " AS " + this.join[l].fields[m].alias + ", ";
                }

              }
            }
          }
        } else {
          for (var l = 0; l < this.join.length; l++) {
            for (var m = 0; m < this.join[l].fields.length; m++) {
              if (this.join[l].fields[m].hidden == false) {
                fromState = true;
                out = out + this.join[l].key + "." + this.join[l].fields[m].name + " AS " + this.join[l].fields[m].alias + ", ";
              }
            }
          }
        }
        if (fromState) {
          sql = "SELECT " + out.substring(0, out.length - 2) + " FROM "
        } else {
          sql = "SELECT * FROM ";
        }

        for (var i = 0; i < this.join.length; i++) {
          var item = this.join[i];
          if (0 !== i) {
            sql += item.type + " ";
          }
          sql += item.tableName + "  " + item.key + "   ";

          if (item.on) {

            for (var j = 0; j < item.on.length; j++) {
              if (j == 0) {
                sql += "ON ";
              }
              var option = item.on[j];
              sql += (option.from + "." + option.fromPort + " " + option.compare + " " + option.to + "." + option.toPort + " ");
              if (j != item.on.length - 1) {
                sql += "AND "
              }
            }
          }
        }
        var whereSql = " WHERE ";

        for (var z = 0; z < this.join.length; z++) {
          for (var o = 0; o < this.join[z].fields.length; o++) {
            if (this.join[z].fields[o].hidden == false && this.join[z].fields[o].more.length != 0) {
              fromState = true;
              whereSql = whereSql + this.join[z].fields[o].more + " AND ";
            }
          }
        }
        if (whereSql != " WHERE ") {
          sql = sql + whereSql.substring(0, whereSql.length - 4)
        }
        var groupSql = " GROUP BY "
        if (this.group == true) {
          var sta = false;
          for (var i = 0; i < this.join.length; i++) {
            var joinData = this.join[i];
            for (var j = 0; j < joinData.fields.length; j++) {
              var field = joinData.fields[j];
              if (field.hidden == false && field.group == true) {
                groupSql = groupSql + " " + field.key + "." + field.name + ", ";
                sta = true;
              }
            }
          }
          if (sta == true) {
            sql = sql + groupSql.substring(0, groupSql.length - 2);
          }

        }
        var orderSql = " ORDER BY  ";

        if (this.order.length > 0) {
          for (var ii = 0; ii < this.order.length; ii++) {
            var orderData = this.order[ii];

            if (ii == this.order.length - 1) {
              orderSql = orderSql + orderData.column + " " + orderData.order;
            } else {
              orderSql = orderSql + orderData.column + " " + orderData.order + ", ";
            }
          }
          sql = sql + orderSql;
        }
        if (this.join.length == 0) {
          this.sqlMsg = '';
          // document.getElementById("sql").innerHTML = "";
        } else {
          this.sqlMsg = sql;
          // document.getElementById("sql").innerHTML = sql;
        }
        return sql;
      },
      //生成每一行数据
      initTableRow(tableId, group) {
        this.tableData = [];
        for (var i = 0; i < this.join.length; i++) {
          var table = this.join[i];
          for (var j = 0; j < table.fields.length; j++) {
            var field = table.fields[j];
            field.table = table.key;
            field.tables = table.chineseName;
            if (!field.hidden) {
              this.tableData.push(field);
            }
          }

        }
        this.initGroup(group);
      },
      //查询join里对象的idx
      indexOfJoin(tableName) {
        var idx = -1;
        for (var i = 0; i < this.join.length; i++) {
          if (this.join[i].key === tableName || this.join[i].chineseName === tableName) {
            idx = i;
            break;
          }
        }
        return idx;
      },
      //显示表连接关系
      showJoin() {
        try {
          $("#form").html("");
          var mainHtml = '<div class="form-group" id="join"><div class="col-sm-12"><input name="MainTable" type="text" class="form-control" id="MainTable" disabled="disabled"></input></div></div>';
          $("#form").html(mainHtml);
          if (this.join.length > 0) {
            $("#MainTable").val(this.join[0].chineseName);
            for (var i = 1; i < this.join.length; i++) {
              var joinData = this.join[i];
              var joinHtml = '<div class="form-group"><label for="" class="col-sm-5 control-label">关联关系：</label><div class="col-sm-7"><select id="type' + i + '" onchange="changeType(' + i + ')"><option value=",">,</option><option value="LEFT JOIN">左连接</option><option value="RIGHT JOIN">右连接</option><option value="INNER JOIN">内连接</option><option value="FULL JOIN">外连接</option></select></div></div><div class="form-group"><div class="col-sm-12"><input name="slaverTable' + i + '" type="text" class="form-control" id="slaverTable' + i + '" disabled="disabled"></input></div></div>';
              $("#join").append(joinHtml);
              $("#type" + i).val(joinData.type);
              $("#slaverTable" + i).val(joinData.chineseName);
            }
          }
        } catch (e) {
        }
      },
      //点击分组
      clickGroup(id, table, name, group) {
        var idx = this.indexOfJoin(table);
        var data = this.join[idx];

        for (var i = 0; i < data.fields.length; i++) {
          var field = data.fields[i];
          if (field.id == id) {
            this.join[idx].fields[i].group = group;
            console.log(this.join[idx].fields[i].group)
          }
        }
        this.groupInit();
        this.initOrder();
        this.initTableRow(null, group);
        this.toSql();
      },
      //初始化order div
      initOrder() {

        document.getElementById("order").innerHTML = '';
        var orderString = "";
        for (var i = 0; i < this.order.length; i++) {
          var data = this.order[i];
          var index = i + 1;
          orderString = "<span>" + orderString + index + " 、 " + data.column + " 、 " + data.order + ", </span></br>";
        }

        $("#order").append(orderString);

      },
      //展开树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
      getLoadTree(datas, obj, node) {
        // console.log(datas,obj,node,222);
        if (datas.children.length == 0) {
          this.$http({
            url: this.$http.adornUrl('/sqlScript/getColumnList'),
            method: 'get',
            isLoading: false,
            params: this.$http.adornParams({
              id: datas.id,
              tableName: datas.title,
            })
          }).then(({data}) => {
            var _data = data.result;
            this.loadTree = _data || [];
          })
        }
      },
      //获取数据表数据
      getSjbData() {
        this.$http({
          url: this.$http.adornUrl('/sqlScript/listDBPTree'),
          method: 'get',
          isLoading: false,
          params: this.$http.adornParams()
        }).then(({data}) => {
          // 注意层级 dataType是必须要的,1:一级,2:表,3:列
          var datas = data.result;
          this.dataTreeData = datas ? [datas] : [];
          // this.treeExpandData = [this.dataTreeData[0].id] // 默认展开一级节点
        })
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.dataTreeData);
        }
        if (node.data.children && node.data.children != '') {
          return resolve(node.data.children);
        } else {
          setTimeout(() => {
            // if(this.loadTree.length>0){
            //   this.treeDataToHint.forEach((item,index)=>{
            //     if(item.id==this.loadTree[0].parentId){
            //       item.childrens=this.loadTree;
            //       item.childHints=[];
            //       this.loadTree.forEach(vtem=>{
            //         item.childHints.push(vtem[this.defaultProps.label])
            //       })
            //       this.$set(this.treeDataToHint,index,item)
            //     }

            //   });
            // }
            resolve(this.loadTree);
          }, 500);

        }
      },
      handleNodeClick(data, obj, node) {
        this.getLoadTree(data, obj, node)
      },
      allowDrag(draggingNode) {
        // return draggingNode.data.level>2||draggingNode.data.type=='funNode';
        return Number(draggingNode.data.dataType) > 1 || draggingNode.data.type == 'funNode' || draggingNode.data.type == 'params';
      },
      getGojsClientXY(){
        var resize = document.getElementById('myDiagramDiv');
        this.myDiagramDivLeft=resize.offsetLeft;
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        // console.log(ev)
        if (draggingNode.data.title == null /*|| treeNodes[0].isParent*/) {
          return;
        }
        var dom = document.getElementById("myDiagramDiv");
        var wight = dom.getBoundingClientRect().width;
        var height = dom.getBoundingClientRect().height;
        var offsetX = 0 - wight / 2;
        var offsetY = 0 - height / 2;
        var cordinateX = this.layeX + offsetX;
        var cordinateY = this.layeY + offsetY;
        var local = cordinateX + " " + cordinateY;
        var keys = draggingNode.data.title;
        var chineseName = draggingNode.data.title;
        var table = {
          key: keys,//表名
          tableName: keys,
          chineseName: chineseName,
          type: ",",
          loc: local//在画布上的位置
        };
        if (draggingNode.data.type == 'datasource' || draggingNode.data.type == 'table' || draggingNode.data.type == 'view') {
          var nodes = draggingNode.childNodes;
          var fieldArr = [];
          if (nodes && nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
              var field = {};
              field.tableName = chineseName;
              field.tableId = nodes[i].data.id;
              field.name = nodes[i].data.title;
              field.group = false;
              field.info = nodes[i].data.title;
              field.alias = nodes[i].data.title;
              field.color = "#FFFFFF";
              field.hidden = true;
              fieldArr.push(field);

            }
            table.fields = fieldArr;
            if(ev.offsetX>this.myDiagramDivLeft){
              this.addNodeData(table);
            }
          } else {
            this.$http({
              url: this.$http.adornUrl('/sqlScript/getColumnList'),
              method: 'get',
              isLoading: false,
              params: this.$http.adornParams({
                id: draggingNode.data.id,
                tableName: draggingNode.data.title,
              })
            }).then(({data}) => {
              var _nodes = data.result;
              for (var i = 0; i < _nodes.length; i++) {
                var field = {};
                field.tableName = chineseName;
                field.tableId = _nodes[i].id;
                field.name = _nodes[i].title;
                field.info = _nodes[i].title;
                field.alias = _nodes[i].title;
                field.color = "#FFFFFF";
                field.hidden = true;
                fieldArr.push(field);

              }
              table.fields = fieldArr;
              if(ev.offsetX>this.myDiagramDivLeft){
                this.addNodeData(table);
              }


            })

          }

        }

      },
      allowDrop(ev){
        ev.preventDefault();
      },
      // 树内不可拖拽
      returnFalse(draggingNode, dropNode, type) {
        return false;
      },
    },
    computed: {
      tableHeight: {
        get() {
          return this.$store.state.common.tableHeight
        }
      },
    },
    components: {
      queryBuilder
    },
    watch: {
      resultTableTabs: {
        // 实时监控数据变化
        deep: true,
        handler(val) {
          if (val != "") {
            if (val !== "") {
              this.resultTableTabsValue=this.resultTableTabs.length>0?String(this.resultTableTabs.length-1):'0';
              this.resultTableTabs=val;
              this.resultTableTabs.forEach(item=>{
                item.totalPage=item.list.length;
                item.pageIndex=1;
                item.pageSize=10;
                item.dataPageList=item.list.slice((item.pageIndex-1)*item.pageSize,item.pageIndex*item.pageSize);
                if(item.columnList){
                  var v={};
                  item.columnList.forEach(vtem=>{
                    v[vtem.columnName]='';
                  });
                  item.columnListSelf=[v];
                }
              })
              // console.log( this.resultTableTabsValue)
            }
          }
        },
      },
    }
  };
</script>
<style scoped lang="scss">
  .graphtool-tooldic {
    width: 100%;
    position: relative;
    /*height: 100vh;*/
    .graphtool-top {
      width: 100%;
      // height: ;
      display: flex;
      height: 50vh;
      .data-left {
        width: 30%;
        overflow: scroll;
      }
      .data-left-hidden {
        width: auto;
        overflow: hidden;
      }
      .data-canvas {
        /*flex: 1;*/
        position: relative;
        width: 40%;
        #myDiagramDiv {
          width: 100%;
        }
      }
      .data-canvas-noLeft {
        width: 70%;
      }
      .data-canvas-noLeftRight {
        width: 95%;
      }
      .data-right {
        margin-top: 4%;
        width: 30%;
        height: 88%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        position: relative;
        .data-option-box {

          flex: 1;
          display: flex;
          flex-direction: column;
          width: 90%;
          .box-bg {
            flex: 1;
          }

        }

        .data-right-tab {
          top: 10px;
          right: 0;
          position: absolute;
          cursor: pointer;
          width: 20px;
          word-break: break-all;
          vertical-align: middle;
          padding: 30px 0;
          color: #939DA6;
          text-align: center;
          background: #F0F0F2;
          border-top-left-radius: 20px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 5px;
          margin: 5px 0;
        }
        .data-right-tab-act {
          color: #333;
        }
      }
      .data-right-hidden {
        overflow: hidden;
        display: block;
        width: 30px;
      }
    }
    .tree-icon {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
    .graphtool-bottom {
      /*height: 50vh;*/
      height: auto;
      /*display: flex;*/
      .data-sort {
        display: inline-block;
        width: 30%;
        height: 50vh;
        /*display: flex;*/
        /*flex-direction: column;*/
        .box-bg {
          /*flex: 1;*/
          width: 100%;
          height: 90%;
        }
      }
      .data-list {
        /*flex: 1;*/
        width: 68%;
        vertical-align: top;
        height: 100%;
        display: inline-block;
        /*display: flex;*/
        flex-direction: column;
        .data-list-item {
          width: 100%;
          position: relative;
        }
        .data-list-table {
          /*flex: 1;*/
          width: 100%;
        }
        .sql-box {
          /*min-height: 100px;*/
          height: auto;
          overflow: auto;
          padding: 10px;
        }
        .table-view {
          /*position: absolute;*/
          /*height: 100%;*/
          width: 100%;
        }
      }
    }
    .box-bg {
      background: #F7F7F7;
      border: 1px solid #F3F3F3;
      overflow: auto;
    }
    .box-bg1 {
      background: #F7F7F7;
      border: 1px solid #F3F3F3;
      overflow: auto;
      width: 100%;
    }
    .tstext {
      height: 26px;
      /*color: #5887B3;*/
      margin-top: 5px;
      font-size: 14px;
    }
    .mar10 {
      margin: 0 10px;
    }
    .mar-r {
      margin-left: 10px;
    }
    .mar-l {
      margin-left: 10px;
    }
  }

  .table-sort-btn {
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }

  .data-left {
    .data-tree {
      vertical-align: top;
      width: 90%;
    }
    .data-left-tab {
      cursor: pointer;
      width: 20px;
      word-break: break-all;
      vertical-align: middle;
      padding: 30px 0;
      color: #939DA6;
      text-align: center;
      background: #F0F0F2;
      border-top-left-radius: 5px;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 20px;
      margin-top:60px;
    }
    .data-left-tab-act {
      color: #333;
    }
  }

  >>> .form-control {
    width: 150px !important;
  }

  .vqb-rule >>> .el-autocomplete {
    width: 150px !important;
  }
  #order{
    padding: 10px;
  }
  .run-btn{
    text-align: right;
    position: absolute;
    top:0;
    right:0;
  }
  .mdd-placeHolder{
    color:#999;
    position: absolute;
    top:10px;
    left: 10px;
  }
</style>
