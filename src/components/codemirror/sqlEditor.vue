<template>
  <div class="box-mirror box"  ref="box">
    <div id="code-mirror-tree_left" class="code-mirror-tree left" :class="hideLeftTree?'code-mirror-tree-hide':''"  v-show="!fullScreen">
      <div class="tree-left">
        <div class="tree-left-one" :class="treeType==='1'?'tree-left-active':''" @click="changeTree('1')">数据表</div>
        <div class="tree-left-three" :class="treeType==='3'?'tree-left-active':''" @click="changeTree('3')">参数</div>
        <div class="tree-left-two" :class="treeType==='2'?'tree-left-active':''" @click="changeTree('2')">函数表</div>
      </div>
      <div class="tree-right" v-show="!hideLeftTree">
        <div class="custom-tree-container">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="custom-tree-container"  v-show="treeType==='1'">
            <el-tree
              class="sql-tree-self"
              :data="treedata"
              :filter-node-method="filterNode"
              ref="tree1"
              :load="loadNode"
              lazy
              node-key="id"
              :props="defaultProps"
              :default-expand-all="false"
              @node-contextmenu="rightClick"
              @node-expand="handleNodeClick"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="returnFalse"
              :allow-drag="allowDrag">
               <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                         <img v-if="node.data.dataType=='1'" class="tree-icon" src="./icons/files.png" alt="">
                         <img v-if="node.data.dataType=='2'" class="tree-icon" src="./icons/table_1.png" alt="">
                         <img v-if="node.data.dataType=='3'" class="tree-icon" src="./icons/column.png" alt="">
                        {{ node.label }}
                    </span>

                </span>
            </el-tree>
          </div>
          <div class="custom-tree-container"  v-show="treeType==='2'">
            <el-tree
              class="sql-tree-self"
              :props="FundefaultProps"
              :data="funData"
              :filter-node-method="filterNode2"
              ref="tree2"
              node-key="id"
              :default-expand-all="false"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="returnFalse"
              :allow-drag="allowDrag">
               <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="node.data.displayName">
                         <img v-if="node.data.type=='funFolder'" class="tree-icon" src="./icons/files.png" alt="">
                         <img v-if="node.data.type=='funNode'" class="tree-icon" src="./icons/function.png" alt="">
                        {{ node.label }}
                    </span>
                </span>
            </el-tree>
          </div>
          <div class="custom-tree-container"  v-show="treeType==='3'">
            <el-tree
              class="sql-tree-self"
              :props="parmsDefaultProps"
              :data="paramsData"
              :filter-node-method="filterNode3"
              ref="tree3"
              node-key="id"
              :default-expand-all="false"
              :load="loadNodeParams"
              lazy
              @node-expand="handleNodeClickParams"
              @node-contextmenu="rightClick"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="returnFalse"
              :allow-drag="allowDrag">
               <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                         <img v-if="node.data.type=='funFolder'" class="tree-icon" src="./icons/files.png" alt="">
                         <img v-if="node.data.type=='params'" class="tree-icon" src="./icons/params.png" alt="">
                        {{ node.label }}
                    </span>
                </span>
            </el-tree>
          </div>
          <div class="dev-type-main-left">
            <!--鼠标右键菜单栏 -->
            <div v-show="showRightMenu">
              <ul v-if="treeType==='1'" id="menu"
                  class="right-menu">
                <li class="menu-item" @click="treeTableClick(treeTabelNode)">
                  生成select语句
                </li>
              </ul>
              <ul v-if="treeType==='3'" id="menu"
                  class="right-menu">
                <li class="menu-item" @click="addOrUpdateParmas(paramsTreeClickNode,'add')" v-if="paramsTreeClickNode.type=='funFolder'">添加参数</li>
                <li class="menu-item" @click="addOrUpdateParmasClass(paramsTreeClickNode,'add')" v-if="paramsTreeClickNode.ParamsType=='publicParam'||paramsTreeClickNode.ParamsType=='personalParam'">添加分类</li>
                <li class="menu-item" @click="addOrUpdateParmasClass(paramsTreeClickNode,'edit')" v-if="(paramsTreeClickNode.ParamsType=='publicParam'||paramsTreeClickNode.ParamsType=='personalParam')&&paramsTreeClickNode.level>2">修改分类</li>
                <li class="menu-item" @click="selDelParmasClass(paramsTreeClickNode,'add')" v-if="(paramsTreeClickNode.ParamsType=='publicParam'||paramsTreeClickNode.ParamsType=='personalParam')&&paramsTreeClickNode.level>2">删除分类</li>
                <li class="menu-item" @click="addOrUpdateParmas(paramsTreeClickNode,'edit')" v-if="paramsTreeClickNode.type=='params'">修改参数</li>
                <li class="menu-item" @click="selfDelParmas(paramsTreeClickNode)" v-if="paramsTreeClickNode.type=='params'">删除参数</li>
                <li class="menu-item" @click="addOrUpdateParmas(paramsTreeClickNode,'look')" v-if="paramsTreeClickNode.type=='params'">查看属性</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-if="!fullScreen" class="resize tree-resize" title="收缩侧边栏">
      <!--<div v-if="resultTableTabsList.length>0" class="resize-div" v-for="(item,index) in resultTableTabsList"></div>-->
    </div>
    <div id="code-mirror-div_right" class="code-mirror-div mid" :class="fullScreen?'mid-100':hideLeftTree?'mid-noLeft':''">
      <!--<div class="tool-bar">-->
        <!--<span>请选择主题</span>-->
        <!--<el-select v-model="cmTheme" placeholder="请选择" size="small" style="width:150px">-->
          <!--<el-option v-for="item in cmThemeOptions" :key="item" :label="item" :value="item"></el-option>-->
        <!--</el-select>-->
        <!--<span style="margin-left: 10px">请选择编辑模式</span>-->
        <!--<el-select-->
          <!--v-model="cmEditorMode"-->
          <!--placeholder="请选择"-->
          <!--size="small"-->
          <!--style="width:150px"-->
          <!--@change="onEditorModeChange"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in cmEditorModeOptions"-->
            <!--:key="item"-->
            <!--:label="item"-->
            <!--:value="item"-->
          <!--&gt;</el-option>-->
        <!--</el-select>-->
        <!--<el-button type="primary" size="small" style="margin-left:10x" @click="setStyle">修改样式</el-button>-->
        <!--<el-button type="primary" size="small" style="margin-left:10x" @click="getValue">获取内容</el-button>-->
        <!--<el-button type="primary" size="small" style="margin-left:10x" @click="setValue">修改内容</el-button>-->
      <!--</div>-->
      <code-mirror-editor
        :paramsData="paramsData"
        :resultTabClick="resultTabClick"
        :useChinese="useChinese"
        :getwsData="getwsData"
        :saveSql="saveSql"
        :resultTableTabs="resultTableTabs"
        ref="cmEditor"
        :cmTheme="cmTheme"
        :cmMode="cmMode"
        :treeLable="treeLable"
        :sqlListData="sqlListData"
        :sqlData="sqlData"
        :getSqlList="getSqlList"
        :deleteSql="deleteSql"
        :getSqlMsg="getSqlMsg"
        :formatContent="formatContent"
        :autoFormatJson="autoFormatJson"
        :jsonIndentation="jsonIndentation"
        :exportSql="exportSql"
        :paramsNode="paramsNode"
        @setFS="getFullScreen"
        :treeDataToHint="treeDataToHint"
        :hintShowName="defaultProps.label"
        :paramsList="paramsList"
        :paramsSub="paramsSub"
        :from="from"
      ></code-mirror-editor>

    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      :paramsType="paramsType"
      :paramsDetail="paramsDetail"
      :paramsClassDetail="paramsClassDetail"
      ref="addOrUpdate"
      :addParamsClick="addParamsClick"
      :addParamsClassClick="addParamsClassClick"
    ></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from "./addOrEditParams";
  // 使用时需要根据CodeMirrorEditor.vue的实际存放路径，调整from后面的组件路径，以便正确引用
  import CodeMirrorEditor from "./CodeMirrorEditor";
  export default {
    components: {
      CodeMirrorEditor,
      AddOrUpdate
    },
    props:{
      //添加分类点击确定事件
      addParamsClassClick:{
        type: Function,
        default: null,
      },
      //添加参数确定点击事件
      addParamsClick: {
        type: Function,
        default: null,
      },
      //删除参数
      delParams: {
        type: Function,
        default: null,
      },
      //删除分类
      delParamsClass: {
        type: Function,
        default: null,
      },
      //参数详情
      paramsDetail: {
        type: Object,
        default: null,
      },
      //获取参数详情
      getParamsDetail: {
        type: Function,
        default: null,
      },
      //分类详情
      paramsClassDetail: {
        type: Object,
        default: null,
      },
      //获取分类详情
      getParamsClassDetail: {
        type: Function,
        default: null,
      },
      //参数设置确定点击事件
      paramsSub: {
        type: Function,
        default: null,
      },
      //右侧数据树表点击
      treeTableClick: {
        type: Function,
        default: null,
      },
      //后台返回的参数列表
      paramsList: {
        type: Array,
        default: false,
      },
      formatContent: {
        type: Function,
        default: null,
      },
      exportSql: {
        type: Function,
        default: null,
      },
      getSqlMsg: {
        type: Function,
        default: null,
      },
      // changeTree: {
      //   type: Function,
      //   default: null,
      // },
      getLoadTree: {
        type: Function,
        default: null,
      },
      getLoadTreeParams: {
        type: Function,
        default: null,
      },
      deleteSql: {
        type: Function,
        default: null,
      },
      getwsData: {
        type: Function,
        default: null,
      },
      saveSql: {
        type: Function,
        default: null,
      },
      getSqlList: {
        type: Function,
        default: null,
      },
      treedata: {
        type: Array,
        default: null,
      },
      paramsData: {
        type: Array,
        default: null,
      },
      sqlListData: {
        type: Array,
        default: null,
      },
      loadTree: {
        type: Array,
        default: null,
      },
      resultTableTabs: {
        type: Array,
        default: null,
      },
      sqlData: {
        type: String,
        default: null,
      },
      useChinese: {
        type: Boolean,
        default: null,
      },
      treeDefaultProps: {
        type: Object,
        default: null,
      },
      parmsDefaultProps: {
        type: Object,
        default: null,
      },
      from: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        maps: new Map(),
        paramsType:'add',//参数弹框的类型
        paramsTreeClickNode:{},//右击参数列表的数据
        hideLeftTree:false,//是否隐左边的区域
        treeTabelNode:'',
        showRightMenu:false,//左侧数据表右击弹出框状态
        selfFrom:'',
        paramsNode:{},//参数数拖拽的节点
        treeDataToHint:[],//tree数据给sql编译器提示
        resultTableTabsList:[],//拖拽条显示高度判断
        funData:[
          {
            "id" : "function",
            "name" : "函数",
            "level" : 0,
            "type" : "funFolder",
            "isParent" : true,
            "children": [
              {
                "id" : "charFun",
                "pid" : "function",
                "name" : "字符函数",
                "displayName" : "字符函数",
                "level" : 1,
                "type" : "funFolder",
                "isParent" : true,
                "open" : false,
                "children": [
                  {
                    "id" : "ASCII",
                    "pid" : "charFun",
                    "name" : "ASCII(x)",
                    "displayName" : "返回字符“x”的ASCII码",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "CONCAT",
                    "pid" : "charFun",
                    "name" : "CONCAT(x,y)",
                    "displayName" : "连接字符串“x”和“y”",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "INSTR",
                    "pid" : "charFun",
                    "name" : "INSTR(x,str,start,n)",
                    "displayName" : "从“x”中查找“str”，可以设置从“start”位置开始，第“n”次出现",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "LENGTH",
                    "pid" : "charFun",
                    "name" : "LENGTH(x)",
                    "displayName" : "返回“x”的长度",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "LOWER",
                    "pid" : "charFun",
                    "name" : "LOWER(x)",
                    "displayName" : "“x”转换成小写",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "UPPER",
                    "pid" : "charFun",
                    "name" : "UPPER(x)",
                    "displayName" : "“x”转换成大写",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "LTRIM",
                    "pid" : "charFun",
                    "name" : "LTRIM(x,trimStr)",
                    "displayName" : "把“x”的左边截去trimStr字符串，缺省截去空格",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "RTRIM",
                    "pid" : "charFun",
                    "name" : "RTRIM(x,trimStr)",
                    "displayName" : "把“x”的右边截去trimStr字符串，缺省截去空格",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "TRIM",
                    "pid" : "charFun",
                    "name" : "TRIM(trimStr from x)",
                    "displayName" : "把“x”的两边截去trimStr字符串，缺省截去空格",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "REPLACE",
                    "pid" : "charFun",
                    "name" : "REPLACE(x,old,new)",
                    "displayName" : "在“x”中查找“old”，并替换成“new”",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "SUBSTR",
                    "pid" : "charFun",
                    "name" : "SUBSTR(x,start,length)",
                    "displayName" : "返回“x”的字符串，从“start”处开始，截取“length”个字符，缺省“length”，默认到结尾",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  }
                ]
              },
              {
                "id" : "numberFun",
                "pid" : "function",
                "name" : "数字函数",
                "displayName" : "数字函数",
                "level" : 1,
                "type" : "funFolder",
                "isParent" : true,
                "open" : false,
                "children": [
                  {
                    "id" : "ABS",
                    "pid" : "numberFun",
                    "name" : "ABS(x)",
                    "displayName" : "返回数字“x”的绝对值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "CEIL",
                    "pid" : "numberFun",
                    "name" : "CEIL(x)",
                    "displayName" : "返回大于等于“x”的最小整数",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "FLOOR",
                    "pid" : "numberFun",
                    "name" : "FLOOR(x)",
                    "displayName" : "返回小于等于“x”的最大整数",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "MOD",
                    "pid" : "numberFun",
                    "name" : "MOD(x,y)",
                    "displayName" : "返回“x”除以“y”的余数",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "EXTRACT",
                    "pid" : "numberFun",
                    "name" : "ROUND(x,y)",
                    "displayName" : "“x”在第“y”位的四舍五入，缺省“y”时，y=0",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "TRUNC",
                    "pid" : "numberFun",
                    "name" : "TRUNC(x,y)",
                    "displayName" : "“x”在第“y”位截断，缺省“y”时，y=0",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  }
                ]
              },
              {
                "id": "dateFun",
                "pid": "function",
                "name": "日期函数",
                "displayName": "日期函数",
                "level": 1,
                "type": "funFolder",
                "isParent": true,
                "open": false,
                "children": [
                  {
                    "id": "ADD_MONTHS",
                    "pid": "dateFun",
                    "name": "ADD_MONTHS(d,n)",
                    "displayName": "在某一个日期“d”上，加上指定的月数“n”，返回计算后的新日期",
                    "level": 2,
                    "type": "funNode",
                    "isParent": false,
                    "open": false,
                    "children": []
                  },
                  {
                    "id": "LAST_DAY",
                    "pid": "dateFun",
                    "name": "LAST_DAY(d)",
                    "displayName": "返回指定日期“d”当月的最后一天",
                    "level": 2,
                    "type": "funNode",
                    "isParent": false,
                    "open": false,
                    "children": []
                  },
                  {
                    "id": "EXTRACT",
                    "pid": "dateFun",
                    "name": "EXTRACT(fmt from d)",
                    "displayName": "提取日期“d”中的特定部分“fmt”",
                    "level": 2,
                    "type": "funNode",
                    "isParent": false,
                    "open": false,
                    "children": []
                  }
                ]
              },
              {
                "id": "changeFun",
                "pid": "function",
                "name": "转换函数",
                "displayName": "转换函数",
                "level": 1,
                "type": "funFolder",
                "isParent": true,
                "open": false,
                "children": [
                  {
                    "id" : "TO_CHAR",
                    "pid" : "changeFun",
                    "name" : "TO_CHAR(x,fmt)",
                    "displayName" : "把日期或数字“x”转换为指定格式“fmt”的字符串",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "TO_DATE",
                    "pid" : "changeFun",
                    "name" : "TO_DATE(x,fmt)",
                    "displayName" : "把一个字符串“x”以“fmt”格式转换成一个日期类型",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "TO_NUMBER",
                    "pid" : "changeFun",
                    "name" : "TO_NUMBER(x,fmt)",
                    "displayName" : "把一个字符串“x”以“fmt”格式转换成一个数字",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  }
                ]
              },
              {
                "id": "polymerizeFun",
                "pid": "function",
                "name": "聚合函数",
                "displayName": "聚合函数",
                "level": 1,
                "type": "funFolder",
                "isParent": true,
                "open": false,
                "children": [
                  {
                    "id" : "AVG",
                    "pid" : "polymerizeFun",
                    "name" : "AVG(x)",
                    "displayName" : "返回“x”的平均值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "SUM",
                    "pid" : "polymerizeFun",
                    "name" : "SUM(x)",
                    "displayName" : "返回“x”求和后的值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "MIN",
                    "pid" : "polymerizeFun",
                    "name" : "MIN(x)",
                    "displayName" : "返回“x”的最小值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "MAX",
                    "pid" : "polymerizeFun",
                    "name" : "MAX(x)",
                    "displayName" : "返回“x”的最大值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "COUNT",
                    "pid" : "polymerizeFun",
                    "name" : "COUNT(x)",
                    "displayName" : "返回“x”的统计值",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  }
                ]
              },
              {
                "id": "otherFun",
                "pid": "function",
                "name": "其他函数",
                "displayName": "其他函数",
                "level": 1,
                "type": "funFolder",
                "isParent": true,
                "open": false,
                "children": [
                  {
                    "id" : "NVL",
                    "pid" : "otherFun",
                    "name" : "NVL(x,value)",
                    "displayName" : "如果“x”为空，返回“value”，否则返回“x”",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "NVL2",
                    "pid" : "otherFun",
                    "name" : "NVL2(x,value1,value2)",
                    "displayName" : "如果“x”非空，返回“value1”，否则返回“value2”",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children": []
                  },
                  {
                    "id" : "FOR_LOOP",
                    "pid" : "otherFun",
                    "name" : "FOR_LOOP",
                    "displayName" : "符合基本语法的自定义规则的FOR-LOOP循环语句",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children" : [],
                    "content" : "#for_loop_content_start#\t\t\t/*本行不可删除*/\nDECLARE XXX……;\nBEGIN\nFOR i IN 1..1000 LOOP\n#for_loop_main_start#\t\t\t\t/*本行不可删除*/\n\t/*主循环体内的数据操作语言只支持INSERT、UPDATE、DELETE三种*/\n\tINSERT/UPDATE/DELETE XXX……;\n#for_loop_main_end#\t\t\t\t\t/*本行不可删除*/\nEND LOOP;\nEND;\n#for_loop_content_end#\t\t\t\t/*本行不可删除*/"
                  },
                  {
                    "id" : "FOR_LOOP",
                    "pid" : "otherFun",
                    "name" : "FOR_LOOP（多层嵌套）",
                    "displayName" : "符合基本语法的自定义规则的多层FOR-LOOP嵌套循环语句",
                    "level" : 2,
                    "type" : "funNode",
                    "isParent" : false,
                    "open" : false,
                    "children" : [],
                    "content" : "#for_loop_content_start#\t\t\t/*本行不可删除*/\nDECLARE XXX……;\nBEGIN\nFOR i IN 1..1000 LOOP\n#for_loop_main_start#\t\t\t\t/*本行不可删除*/\n\t/*主循环体内的数据操作语言只支持INSERT、UPDATE、DELETE三种*/\n\tINSERT/UPDATE/DELETE XXX……;\n\tFOR j IN 1..1000 LOOP\n\t#for_loop_main_start#\t\t\t/*本行不可删除*/\n\t\t/*主循环体内的数据操作语言只支持INSERT、UPDATE、DELETE三种*/\n\t\tINSERT/UPDATE/DELETE XXX……;\n\t#for_loop_main_end#\t\t\t\t/*本行不可删除*/\n\tEND LOOP;\n#for_loop_main_end#\t\t\t\t\t/*本行不可删除*/\nEND LOOP;\nEND;\n#for_loop_content_end#\t\t\t\t/*本行不可删除*/"
                  }
                ]
              }
            ]},
        ],
        treeType:'1',//树类型
        fullScreen:false,
        filterText: '',
        treeLable:'',
        data: [],
        FundefaultProps: {
          children: 'children',
          label: 'name',
          isLeaf:'isLeaf'
        },
        defaultProps: {
          children: 'children',
          label: this.treeDefaultProps.label?this.treeDefaultProps.label:'label',
          isLeaf:(data,node) => {
            if (node.level >2) {// 根据需要进行条件判断添加is-leaf类名
              return true
            }
          }
        },
        defaultPropsParams: {
          children: 'children',
          label: this.parmsDefaultProps.label?this.parmsDefaultProps.label:'label',
          isLeaf: this.parmsDefaultProps.isLeaf?this.parmsDefaultProps.isLeaf:'isLeaf',
          // isLeaf:(data,node) => {
          //   if (node.level >2) {// 根据需要进行条件判断添加is-leaf类名
          //     return true
          //   }
          // }
        },
        visible:true,
        cmTheme: "default", // codeMirror主题
        // codeMirror主题选项
        cmThemeOptions: [
          "default",
          "3024-day",
          "3024-night",
          "abcdef",
          "ambiance",
          "ayu-dark",
          "ayu-mirage",
          "base16-dark",
          "base16-light",
          "bespin",
          "blackboard",
          "cobalt",
          "colorforth",
          "darcula",
          "dracula",
          "duotone-dark",
          "duotone-light",
          "eclipse",
          "elegant",
          "erlang-dark",
          "gruvbox-dark",
          "hopscotch",
          "icecoder",
          "idea",
          "isotope",
          "lesser-dark",
          "liquibyte",
          "lucario",
          "material",
          "material-darker",
          "material-palenight",
          "material-ocean",
          "mbo",
          "mdn-like",
          "midnight",
          "monokai",
          "moxer",
          "neat",
          "neo",
          "night",
          "nord",
          "oceanic-next",
          "panda-syntax",
          "paraiso-dark",
          "paraiso-light",
          "pastel-on-dark",
          "railscasts",
          "rubyblue",
          "seti",
          "shadowfox",
          "solarized dark",
          "solarized light",
          "the-matrix",
          "tomorrow-night-bright",
          "tomorrow-night-eighties",
          "ttcn",
          "twilight",
          "vibrant-ink",
          "xq-dark",
          "xq-light",
          "yeti",
          "yonce",
          "zenburn"
        ],
        cmEditorMode: "default", // 编辑模式
        // 编辑模式选项
        cmEditorModeOptions: [
          "default",
          "json",
          "sql",
          "javascript",
          "css",
          "xml",
          "html",
          "yaml",
          "markdown",
          "python"
        ],
        cmMode: "application/json", //codeMirror模式
        jsonIndentation: 2, // json编辑模式下，json格式化缩进 支持字符或数字，最大不超过10，默认缩进2个空格
        autoFormatJson: true // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
      };
    },
    watch: {
      filterText(val) {
        if(this.treeType==='1'){
          this.$refs.tree1.filter(val);
        }else if(this.treeType==='2'){
          this.$refs.tree2.filter(val);
        }else if(this.treeType==='3'){
          this.$refs.tree3.filter(val);
        }
      },
      treedata: function (newValue, oldValue) {
       // console.log(newValue, oldValue)
        newValue.forEach(item=>{
          if(item.children){
            // item.children.forEach(vtem=>{
            //   vtem.childHints=[];
            //   vtem.childrens=[];
            // });
            this.treeDataToHint=this.treeDataToHint.concat(item.children);
          }
        });
      },
      loadTree:{
        deep: true,
        handler(val) {
          // console.log(val,3333)
        }
      },
      from:{
        deep: true,
        handler(val) {
          this.selfFrom=val;
        }
      },
      treeDataToHint:{
        deep: true,
        handler(val) {
          if(val){
            this.treeDataToHint=val;
          }
        }
      },
      resultTableTabs:{
        deep: true,
        handler(val) {
          if(val!=''){
            if(val!=''&&val.length>0){
              this.resultTableTabsList=this.resultTableTabs[this.resultTableTabs.length-1].list
            }
          }
        }
      },
    },
    mounted(){
      this.dragControllerDiv();
    },
    updated(){
      this.dragControllerDiv();
    },
    methods: {
      //删除参数
      selfDelParmas(data){
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.delParams(data);
        }).catch(() => {});

      },
      //删除分类
      selDelParmasClass(data){
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.delParamsClass(data);
        }).catch(() => {});

      },
      // 新增 / 修改参数
      addOrUpdateParmas(data,type) {
        this.paramsType=type+"@split@"+Math.random();
        if(type!='add'){
         this.getParamsDetail(data);
        }else{
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(data.id||'',type,this.paramsData);
          })
        }

      },
      //新增/修改分类
      addOrUpdateParmasClass(data,type) {
        this.paramsType=type+"@split@"+Math.random();
        if(type!='add'){
         this.getParamsClassDetail(data);
        }else{
          this.$nextTick(() => {
            this.$refs.addOrUpdate.initClass(data.id||'',type,data);
          })
        }

      },
      //数据表左侧右击事件
      rightClick(event, data, node, obj) {
        //只有表可以点击
        if(data.dataType==2||data.ParamsType=='publicParam'||data.ParamsType=='personalParam'||data.ParamsType=='paramNode'){
          this.paramsTreeClickNode=data;
          this.showRightMenu = false; // 先把模态框关死，目的是：第二次或者第n次右键鼠标的时候 它默认的是true
          this.showRightMenu = true;
          let menu = document.querySelector('#menu');
          menu.style.left = event.clientX + 'px';
          menu.style.top = event.clientY+5 + 'px';
          // 给整个document添加监听鼠标事件，点击任何位置执行closeRightMenu方法，及时将菜单关闭
          document.addEventListener('click', this.closeRightMenu);
          this.treeTabelNode=node;
        }
      },
      closeRightMenu() {
        this.showRightMenu = false;
        // 及时关掉鼠标监听事件
        document.removeEventListener('click', this.closeRightMenu);
      },
      //sql执行结果tab切换事件
      resultTabClick(list){
        this.resultTableTabsList=list;
      },
      //拖拽改变宽度
      dragControllerDiv: function () {
        var resize = document.getElementsByClassName('tree-resize');
        var left = document.getElementsByClassName('code-mirror-tree');
        var mid = document.getElementsByClassName('code-mirror-div');
        var box = document.getElementsByClassName('box-mirror');
        for (let i = 0; i < resize.length; i++) {
          // 鼠标按下事件
          resize[i].onmousedown = function (e) {

            //颜色改变提醒
            resize[i].style.background = '#818181';
            resize[i].style.cursor = 'w-resize';
            var startX = e.clientX;
            resize[i].left = resize[i].offsetLeft-(box[i].offsetLeft);

            // 鼠标拖动事件
            document.onmousemove = function (e) {
              var endX = e.clientX;
              var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
              var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
              // console.log(resize[i].left,endX,startX,moveLen);
              if (moveLen < 280) moveLen = 280; // 左边区域的最小宽度为32px
              if (moveLen > maxT - 280) moveLen = maxT - 280; //右边区域最小宽度为150px

              resize[i].style.left = moveLen; // 设置左侧区域的宽度
              for (let j = 0; j < left.length; j++) {
                left[j].style.width = moveLen + 'px';
                mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
              }
            };
            // 鼠标松开事件
            document.onmouseup = function (evt) {
              //颜色恢复
              resize[i].style.background = '#c0c5d4';
              document.onmousemove = null;
              document.onmouseup = null;
              resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            };
            resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false;
          };
        }
      },
      //切换树
      changeTree(type){
        if(this.treeType==type){
          this.hideLeftTree=!this.hideLeftTree
        }else{
          this.treeType=type;
        }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.treedata);
        }
        // if (node.level > 1) return resolve([]);
        if(node.data.children&&node.data.children!=''){
          return resolve(node.data.children);
        }else{
          setTimeout(() => {
            if(this.loadTree.length>0){
              this.treeDataToHint.forEach((item,index)=>{
                if(item.id==this.loadTree[0].parentId){
                  item.childrens=this.loadTree;
                  item.childHints=[];
                  this.loadTree.forEach(vtem=>{
                    item.childHints.push(vtem[this.defaultProps.label])
                  })
                  this.$set(this.treeDataToHint,index,item)
                }

              });
            }
            resolve(this.loadTree);
          }, 500);

        }

      },
      //参数树懒加载
      loadNodeParams(node, resolve) {
        this.maps.set(node.data.id, { node, resolve }) ;//储存数据
        if (node.level === 0) {
          return resolve(this.paramsData);
        }
        // if (node.level > 1) return resolve([]);
        if(node.data.children&&node.data.children!=''){
          return resolve(node.data.children);
        }else if(node.data.type!='params'){
          setTimeout(() => {
            resolve(this.loadTree);
          }, 500);

        }else{
          resolve([])
        }

      },
      refreshNodeBy(id){
        let node = this.$refs.tree3.getNode(id); // 通过节点id找到对应树节点对象
        node.loaded = false; // 设置节点为未加载状态
        node.data.children=[]; // 设置节点为未加载状态
        this.getLoadTreeParams(node.data)
        node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
      },
      // treeToHint(list){
      //   list.for
      // },
      handleNodeClick(data,obj,node){
        this.getLoadTree(data,obj,node)
      },
      handleNodeClickParams(data,obj,node){
        this.getLoadTreeParams(data,obj,node)
      },
      getFullScreen(data){
        this.fullScreen=data;
        let left = document.getElementById('code-mirror-tree_left');
        let mid = document.getElementById('code-mirror-div_right');
        if(data===false){
          if(mid.style.width!="68%"){
            left.style.width="calc(32% - 10px)";
            mid.style.width="68%";
          }
        }

      },
      filterNode(value, data) {
        if (!value) return true;
        return data[this.defaultProps.label].indexOf(value) !== -1;
      },
      filterNode2(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      filterNode3(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 树内不可拖拽
      returnFalse() {
        return false;
      },
      allowDrag(draggingNode) {
        // return draggingNode.data.level>2||draggingNode.data.type=='funNode';
        return Number(draggingNode.data.dataType)>1||draggingNode.data.type=='funNode'||draggingNode.data.type=='params';
      },
      handleDragStart(node, ev) {
        // console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        // console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        // console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        // console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        // console.log(draggingNode, dropNode, dropType, ev);
        // console.log(this.$refs.cmEditor)
        this.paramsNode={};
        if (draggingNode.childNodes.length == 0 ) {
          this.treeLable = this.treeDefaultProps.label?draggingNode.data[this.treeDefaultProps.label]:draggingNode.data.label;
        }
        //除了第一层都可以拖拽  dataType是层级分类
        if (draggingNode.data.dataType>1) {
          this.treeLable = this.treeDefaultProps.label?draggingNode.data[this.treeDefaultProps.label]:draggingNode.data.label;
          //解决不实时更新问题
          this.treeLable=this.treeLable+"@Math"+Math.random();
        }
        if (
          draggingNode.data.type === "funNode"
        ) {
          this.treeLable = draggingNode.data.name;
          //解决不实时更新问题
          this.treeLable=this.treeLable+"@Math"+Math.random();
        }
        if (draggingNode.data.type === "params") {
          this.treeLable = draggingNode.data.name;
          //解决不实时更新问题
          this.treeLable=this.treeLable+"@Math"+Math.random();
          this.paramsNode=draggingNode.data;
        }
      },
      // 拖拽成功完成时
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // console.log(draggingNode, dropNode, dropType, ev);
      },
      // 切换编辑模式事件处理函数
      onEditorModeChange(value) {
        switch (value) {
          case "json":
            this.cmMode = "application/json";
            break;
          case "sql":
            this.cmMode = "sql";
            break;
          case "javascript":
            this.cmMode = "javascript";
            break;
          case "xml":
            this.cmMode = "xml";
            break;
          case "css":
            this.cmMode = "css";
            break;
          case "html":
            this.cmMode = "htmlmixed";
            break;
          case "yaml":
            this.cmMode = "yaml";
            break;
          case "markdown":
            this.cmMode = "markdown";
            break;
          case "python":
            this.cmMode = "python";
            break;
          default:
            this.cmMode = "application/json";
        }
      },
      // 修改样式（不推荐，建议参考<style>中的样式，提前配置好样式）
      setStyle() {
        let styleStr =
          "position: absolute; top: 80px; left: 50px; right: 200px; bottom: 20px; padding: 2px; height: auto;";
        this.$refs.cmEditor.setStyle(styleStr);
      },
      //获取内容
      getValue() {
        let content = this.$refs.cmEditor.getValue();
        console.log(content);
      },
      //修改内容
      setValue() {
        let jsonValue = {
          name: "laiyu",
          addr: "广东省深圳市",
          other: "nothing",
          tel: "168888888",
          intro: [{ item1: "item1" }]
        };
        this.$refs.cmEditor.setValue(JSON.stringify(jsonValue));
      }
    }
  };
</script>



<style>

  .CodeMirror {

    /*position: absolute;*/

    /*top: 80px;*/

    /*left: 2px;*/

    /*right: 5px;*/

    /*bottom: 0px;*/

    /*padding: 2px;*/

    /*height: auto;*/

    /*overflow-y: auto;*/

  }

</style>



<style lang="scss" scoped>

  .code-mirror-div {

    /*position: absolute;*/

    /*top: 0px;*/

    /*left: 2px;*/

    /*right: 5px;*/

    /*bottom: 0px;*/

    /*padding: 2px;*/

    .tool-bar {

      top: 20px;

      margin: 30px 2px 0px 20px;

    }

  }
  /*.box-mirror{*/
    /*display: flex;*/
  /*}*/
/*.code-mirror-tree{*/
  /*width: 30%;*/
  /*display: inline-block;*/
/*}*/
  /*.code-mirror-div{*/
    /*width: 70%;*/
    /*display: inline-block;*/
  /*}*/
  .code-mirror-tree>div{
    display: inline-block;
    vertical-align: top;
  }
  .code-mirror-tree-hide{
    width: 30px!important;
    overflow: auto;
  }
  .mid-noLeft{
    width: 95%!important;
  }
  .tree-left{
    margin-top: 50px;
    width: 25px;
    white-space: pre-wrap;
    cursor: pointer;
    text-align: center;
    /*height: 200px;*/
  }
  .mune-tree{
    width:100%;
  }
  .tree-left>div{
    vertical-align: middle;
    /*height: 50%;*/
    display: inline-block;
    padding:30px 0;
    color:#939DA6;
    text-align: center;
    background: #F0F0F2;
    border-top-left-radius:5px;
    border-top-right-radius:20px;
    border-bottom-left-radius:5px;
    border-bottom-right-radius:20px;
    margin: 5px 0;
  }
  .tree-left>.tree-left-active{
    color: #000;
  }
  .tree-right{
    width: 89%;
  }
  .custom-tree-container{
    display: inline-block;
    overflow-y: hidden;
    overflow-x: auto;
    width:100%;
    padding: 3%;
  }
  .el-tree {
    min-width: 100%;
    display:inline-block !important;
  }
  /* 拖拽相关样式 */
  /*包围div样式*/
  .box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  /*左侧div样式*/
  .left {
    width: calc(32% - 10px);  /*左侧初始化宽度*/
    height: 100%;
    background: #FFFFFF;
    float: left;
    box-sizing: border-box;
    vertical-align: top;
  }
  /*拖拽区div样式*/
  .resize {
    cursor: w-resize;
    float: left;
    position: relative;
    top: 0;
    min-height: 85vh;
    height: 100%;
    max-height: 100%;
    background-color:#c0c5d4;
    width: 3px;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    font-size: 32px;
    color: white;
    vertical-align: top;
  }
  .resize-div{
    height:78px;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  /*右侧div'样式*/
  .mid {
    padding-left: 10px;
    float: left;
    width: 68%;   /*右侧初始化宽度*/
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    vertical-align: top;
  }
  .mid-100{
    width: 100%!important;
  }
  .tree-icon{
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .is-leaf.el-tree-node_expand-icon  {
    display:none;
  }
  .sql-tree-self{
    height:80vh;
    overflow: auto;
  }
  .custom-tree-container{
    overflow-y: hidden;
    overflow-x: auto;
    width:100%;
  }
  .dev-type-main-left {
    overflow: auto;
    padding: 10px;

  }
  .dev-type-main-left .right-menu {
    width: 150px;
    z-index: 1;
    position: fixed;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    list-style: none;
    padding: 0;
  }
  .right-menu .menu-item {
    line-height: 20px;
    text-align: left;
    font-size: 14px;
    color: #606266;
    padding: 5px;
    cursor: pointer;
  }
  .right-menu li:hover {
    background-color: #edf6ff;
    color: #606266;
  }
</style>
