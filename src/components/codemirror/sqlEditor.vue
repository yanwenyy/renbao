<template>
  <div class="box-mirror box"  ref="box">
    <div class="code-mirror-tree left" v-if="!fullScreen">
      <div class="tree-left">
        <div class="tree-left-one" @click="changeTree('1')">数据表</div>
        <div class="tree-left-two" @click="changeTree('2')">函数表</div>
      </div>
      <div class="tree-right">
        <div class="custom-tree-container">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div  v-show="treeType==='1'">
            <el-tree
              :data="treedata"
              :filter-node-method="filterNode"
              ref="tree"
              :load="loadNode"
              lazy
              node-key="id"
              :props="defaultProps"
              :default-expand-all="false"
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
            </el-tree>
          </div>
          <div  v-show="treeType==='2'">
            <el-tree
              :props="FundefaultProps"
              :data="funData"
              :filter-node-method="filterNode"
              ref="tree"
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
            </el-tree>
          </div>

        </div>

      </div>
    </div>
    <div v-if="!fullScreen" class="resize" title="收缩侧边栏">
      <div v-if="resultTableTabsList.length>0" class="resize-div" v-for="(item,index) in resultTableTabsList"></div>
    </div>
    <div class="code-mirror-div mid" :class="fullScreen?'mid-100':''">
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
        @setFS="getFullScreen"
      ></code-mirror-editor>

    </div>
  </div>
</template>
<script>
  // 使用时需要根据CodeMirrorEditor.vue的实际存放路径，调整from后面的组件路径，以便正确引用
  import CodeMirrorEditor from "./CodeMirrorEditor";
  export default {
    components: {
      CodeMirrorEditor
    },
    props:{
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
    },
    data() {
      return {
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
          isLeaf:'isLeaf'
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
        this.$refs.tree.filter(val);
      },
      treedata: function (newValue, oldValue) {
       // console.log(newValue, oldValue)
      },
      loadTree:{
        deep: true,
        handler(val) {
          // console.log(val,3333)
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
    methods: {
      //sql执行结果tab切换事件
      resultTabClick(list){
        this.resultTableTabsList=list;
      },
      //拖拽改变宽度
      dragControllerDiv: function () {
        var resize = document.getElementsByClassName('resize');
        var left = document.getElementsByClassName('code-mirror-tree');
        var mid = document.getElementsByClassName('code-mirror-div');
        var box = document.getElementsByClassName('box-mirror');
        for (let i = 0; i < resize.length; i++) {
          // 鼠标按下事件
          resize[i].onmousedown = function (e) {

            //颜色改变提醒
            resize[i].style.background = '#818181';
            var startX = e.clientX;
            resize[i].left = resize[i].offsetLeft;
            // 鼠标拖动事件
            document.onmousemove = function (e) {
              var endX = e.clientX;
              var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
              var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

              if (moveLen < 10) moveLen = 10; // 左边区域的最小宽度为32px
              if (moveLen > maxT - 10) moveLen = maxT - 10; //右边区域最小宽度为150px

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
        this.treeType=type;
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
            resolve(this.loadTree);
          }, 500);
        }

      },
      handleNodeClick(data,obj,node){
        this.getLoadTree(data,obj,node)
      },
      getFullScreen(data){
        console.log(data)
        this.fullScreen=data;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 树内不可拖拽
      returnFalse() {
        return false;
      },
      allowDrag(draggingNode) {
        return draggingNode.data.level>2||draggingNode.data.type=='funNode';
      },
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        // console.log(draggingNode, dropNode, dropType, ev);

        if (draggingNode.childNodes.length == 0 ) {
          this.treeLable = this.treeDefaultProps.label?draggingNode.data[this.treeDefaultProps.label]:draggingNode.data.label;
        }
        if (
          draggingNode.data.type === "funNode"
        ) {
          this.treeLable = draggingNode.data.name;
        }
      },
      // 拖拽成功完成时
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log(draggingNode.label);
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
  .tree-left{
    margin-top: 50px;
    width: 29px;
    white-space: pre-wrap;
    cursor: pointer;
    border: 1px solid #000;
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
    text-align: center;
  }
  .tree-left-one{
    border-bottom: 1px solid #000;
    /*padding-top: 2%;*/
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
  }
  /*拖拽区div样式*/
  .resize {
    cursor: col-resize;
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
  }
  .mid-100{
    width: 100%!important;
  }
</style>
