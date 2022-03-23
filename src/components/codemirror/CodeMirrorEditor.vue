<template>
  <div>
    <div id="box">
      <div id="top" class="codemirror-div" v-if="!fullScreen">
        <div class="btn-group">
          <el-button  v-if="!useChinese" type="text"
                     @click="formatContentSelf">
            <i class="el-icon-paperclip" title="格式化"></i>
          </el-button>
          <el-button  v-if="useChinese" type="primary"
                     @click="formatContentSelf">
            格式化
          </el-button>
          <el-button v-if="!useChinese" type="text"
                     :disabled="implementDisabled"
                     @click="implement">
            <i  class="el-icon-video-play" title="运行"></i>
          </el-button>
          <el-button v-if="useChinese" type="primary"
                     :disabled="implementDisabled"
                     @click="implement">
            运行
          </el-button>
          <el-button v-if="!useChinese" type="text" @click="openPython">
            <i class="el-icon-folder-opened" title="打开sql"></i>
          </el-button>
          <el-button v-if="useChinese" type="primary" @click="openPython">
            打开sql
          </el-button>
          <el-dropdown style="margin-left: 10px" trigger="click" placement="bottom-start">
            <el-button :type="useChinese?'primary':'text'">
              <i v-if="!useChinese" class="el-icon-document-add" title="保存"></i>
              <span v-if="useChinese" title="保存">保存</span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="draftSql='',saveSqlSelf('save')">保存</el-dropdown-item>
              <el-dropdown-item @click.native="sqlSaveForm.draftName='',saveSqlSelf('saveAs')">另存为</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown style="margin-left: 10px" trigger="click"  placement="bottom-start">
            <el-button  :type="useChinese?'primary':'text'">
              <i v-if="!useChinese" class="el-icon-suitcase-1" title="工具箱"></i>
              <span v-if="useChinese" title="工具箱">工具箱</span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="lookups">查找</el-dropdown-item>
              <el-dropdown-item @click.native="goReplace">替换</el-dropdown-item>
              <el-dropdown-item @click.native="Capitalization(1)"
              >转大写
              </el-dropdown-item
              >
              <el-dropdown-item @click.native="Capitalization(2)"
              >转小写
              </el-dropdown-item
              >
              <!--<el-dropdown-item @click.native="notes">
                注释选中行
              </el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="noteOff">取消注释</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="changeSize(1)"-->
              <!--&gt;字体放大-->
              <!--</el-dropdown-item-->
              <!--&gt;-->
              <!--<el-dropdown-item @click.native="changeSize(2)"-->
              <!--&gt;字体缩小-->
              <!--</el-dropdown-item-->
              <!--&gt;-->
            </el-dropdown-menu>
          </el-dropdown>
          <!--<el-button style="margin-left: 10px" type="primary" @click="">保存数据</el-button>-->
        </div>
        <codemirror
          ref="myCm"
          :value="editorValue"
          :options="cmOptions"
          @cursorActivity="cmCursorActivity"
          @beforeChange="cmBeforChange"
          @changes="onCmCodeChanges"
          @blur="onCmBlur"
          @keydown.native="onKeyDown"
          @mousedown.native="onMouseDown"
          @paste.native="OnPaste"
        ></codemirror>
      </div>
      <div id="resize" title="收缩栏"  v-if="!fullScreen">

      </div>
      <div id="bottom" class="codemirror-table-div" :class="fullScreen?'fullScreenClass':''">
        <div class="codemirror-table-btn">
          <el-button type="primary" @click="exportSqlSelf">全部导出</el-button>
          <div v-if="!useChinese" class="inline-block">
            <i v-if="!fullScreen" class="el-icon-full-screen" @click="setFullScreen(1)"></i>
            <i v-if="fullScreen" class="el-icon-minus" @click="setFullScreen(2)"></i>
          </div>
          <div v-if="useChinese" class="inline-block">
            <el-button  v-if="!fullScreen" type="primary"
                       @click="setFullScreen(1)">
              <span title="全屏">全屏</span>
            </el-button>
            <el-button v-if="fullScreen" type="primary"
                       @click="setFullScreen(2)">
              <span title="退出全屏">退出全屏</span>
            </el-button>
          </div>
        </div>
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
              <el-table v-if="item.columnList" border :data="[]" stripe style="width: 100%" class="box-table">
                <el-table-column v-if="item.columnListSelf[0]" v-for="(vtem,key,index) in item.columnListSelf[0]" prop="key" :key="index" :label="key">

                </el-table-column>
              </el-table>
            </div>
            <el-table :height="fullScreen?'80vh':boxHeight*0.35" v-if="item.list!=''" border :data="item.list" stripe style="width: 100%" class="box-table">
              <el-table-column v-if="item.list[0]" v-for="(vtem,key,index) in item.list[0]" :key="index" :label="key">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row[key]}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
    <el-dialog
      :append-to-body='true'
      custom-class="self-dialog"
      width="70%"
      title="sql草稿列表"
      :close-on-click-modal="false"
      :visible.sync="sqlvisible">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

        <el-form-item label="sql标题:">
          <el-input v-model="dataForm.name" placeholder="模糊查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button v-if="" @click="dataForm.name=''">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="sqlListData"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <!--<el-table-column-->
          <!--type="selection"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--width="50">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="draftName"
          header-align="center"
          align="center"
          label="草稿名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="草稿创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | dateformat }}
          </template>
        </el-table-column>
        <el-table-column

          header-align="center"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="lookSqlDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" @click="deleteSqlSef(scope.row.draftId)">删除</el-button>
            <el-button type="text" size="small" @click="useSql(scope.row)">使用sql</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="self-page"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sqlvisible = false">取消</el-button>
        <!--<el-button type="primary" @click="sub()">使用sql</el-button>-->
      </span>
    </el-dialog>
    <el-dialog :append-to-body='true' custom-class="self-dialog" title="草稿sql" :visible.sync="LookSql">
      <el-form>
        <el-form-item>
            <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="draftSql">
            </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :append-to-body='true' custom-class="self-dialog" title="保存草稿" :visible.sync="saveSqlVisible">
      <el-form :model="sqlSaveForm" ref="sqlSaveRef">
        <el-form-item label="草稿名称" prop="draftName"
                      :rules="{
                        required: true,
                        message: '此项不能为空',
                        trigger: 'blur',
                      }">
            <el-input
            placeholder="请输入内容"
            v-model="sqlSaveForm.draftName">
            </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveSqlVisible = false,sqlSaveForm.draftName=''">取消</el-button>
        <el-button type="primary" @click="saveSqlClick()">确定</el-button>
      </span>
    </el-dialog>
    <!--<el-dialog :append-to-body='true' custom-class="self-dialog" title="参数设置" :visible.sync="SlefparamsListVisible">-->
      <!--<el-form>-->
        <!--<el-form-item :label="item.label" v-for="(item,index) in paramsList" :key="index">-->
          <!--<el-select class="paramsSel" v-model="item.paramsValue" multiple placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="(vtem,i) in item.list"-->
              <!--:key="i"-->
              <!--:label="vtem.name||vtem.id"-->
              <!--:value="vtem.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="closeParams()">取消</el-button>-->
        <!--<el-button type="primary" @click="Paramssub()">确定</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
    <params-list :paramsList="paramsList" :paramsSub="paramsSub" :paramsSql="editorValue"></params-list>
  </div>
</template>
<script>
  String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
  }
  import paramsList from './paramsList'

  import {codemirror} from "vue-codemirror";
  import "codemirror/theme/blackboard.css";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/mode/xml/xml.js";
  import "codemirror/mode/htmlmixed/htmlmixed.js";
  import "codemirror/mode/css/css.js";
  import "codemirror/mode/yaml/yaml.js";
  // import "codemirror/mode/sql/sql.js";
  import "./js/sql.js";

  import "codemirror/mode/python/python.js";
  import "codemirror/mode/markdown/markdown.js";
  import "codemirror/addon/hint/show-hint.css";
  import "codemirror/addon/hint/show-hint.js";
  import "codemirror/addon/hint/javascript-hint.js";
  import "codemirror/addon/hint/xml-hint.js";
  import "codemirror/addon/hint/css-hint.js";
  import "codemirror/addon/hint/html-hint.js";
  // import "codemirror/addon/hint/sql-hint.js";
  import "./js/sql-hint.js";

  import "codemirror/addon/hint/anyword-hint.js";
  import "codemirror/addon/lint/lint.css";
  import "codemirror/addon/lint/lint.js";
  import "codemirror/addon/lint/json-lint";
  require("script-loader!jsonlint");

  // import "codemirror/addon/lint/html-lint.js";
  // import "codemirror/addon/lint/css-lint.js";
  import "codemirror/addon/lint/javascript-lint.js";
  import "codemirror/addon/fold/foldcode.js";
  import "codemirror/addon/fold/foldgutter.js";
  import "codemirror/addon/fold/foldgutter.css";
  import "codemirror/addon/fold/brace-fold.js";
  import "codemirror/addon/fold/xml-fold.js";
  import "codemirror/addon/fold/comment-fold.js";
  import "codemirror/addon/fold/markdown-fold.js";
  import "codemirror/addon/fold/indent-fold.js";
  import "codemirror/addon/edit/closebrackets.js";
  import "codemirror/addon/edit/closetag.js";
  import "codemirror/addon/edit/matchtags.js";
  import "codemirror/addon/edit/matchbrackets.js";
  import "codemirror/addon/selection/active-line.js";
  import "codemirror/addon/search/jump-to-line.js";
  import "codemirror/addon/dialog/dialog.js";
  import "codemirror/addon/dialog/dialog.css";
  import "codemirror/addon/search/searchcursor.js";
  import "codemirror/addon/search/search.js";
  import "codemirror/addon/display/autorefresh.js";
  import "codemirror/addon/selection/mark-selection.js";
  import "codemirror/addon/search/match-highlighter.js";
  const CodeMirror = require('codemirror');
  export default {
    components: {
      codemirror,
      paramsList
    },
    // props: ["cmTheme", "cmMode", "autoFormatJson", "jsonIndentation",'treeLable','tableData'],
    props: {
      hintShowName: {
        type: String,
        default: null,
      },//hint提示要显示的name名字
      paramsNode: {
        type: Object,
        default: null,
      },//左侧参数树拖拽的节点
      cmMode: {
        type: String,
        default: null,
      },
      autoFormatJson: {
        type: Boolean,
        default: null,
      },
      jsonIndentation: {
        type: Number,
        default: null,
      },
      treeLable: {
        type: String,
        default: null,
      },
      sqlData: {
        type: String,
        default: null,
      },
      resultTableTabs: {
        type: Array,
        default: null,
      },
      sqlListData: {
        type: Array,
        default: null,
      },
      treeDataToHint: {
        type: Array,
        default: null,
      },
      getwsData: {
        type: Function,
        default: null,
      },
      deleteSql: {
        type: Function,
        default: null,
      },
      getSqlList: {
        type: Function,
        default: null,
      },
      exportSql: {
        type: Function,
        default: null,
      },
      resultTabClick: {
        type: Function,
        default: null,
      },
      getSqlMsg: {
        type: Function,
        default: null,
      },
      useChinese: {
        type: Boolean,
        default: false,
      },
      saveSql: {
        type: Function,
        default: null,
      },
      formatContent: {
        type: Function,
        default: null,
      },
      //后台返回的参数列表
      paramsList: {
        type: Array,
        default: null,
      },
      paramsSub: {
        type: Function,
        default: null,
      },
      //左侧参数树的数据
      paramsData: {
        type: Array,
        default: null,
      },
    },
    data() {
      return {
        boxHeight:0,
        dragParmasList:[],//拖拽进来的参数数组
        // SelfparamsList:[],//参数设置列表
        // SlefparamsListVisible:false,//参数设置显示状态
        sqlKeyWord:[
          "select ",
          "from",
          "left",
          "join",
          "right",
          "inner",
          "sum",
        ],//需要高亮的关键字
        hintTable:{},//自定义提示的table
        resultTableTabsValue: '2',//动态标签显示项
        sqlSaveType:'',
        sqlSaveForm:{
          draftName:'',
        },
        saveSqlVisible:false,//保存sql框状态
        //选择的sql列表id
        draftSqlId:'',
        draftSql:'',
        LookSql:false,
        //sql列表
        sqlvisible:false,
        dataForm: {
          startTime: '',
          endTime: '',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,


        fullScreen:false,
        implementDisabled:false,
        editorValue: "",
        cmOptions: {
          hintOptions: { // 自定义提示选项
            tables: {},
            tablesTitle:{},

          },
          theme:'solarized light',
          mode:'text/x-mysql',
          lineWrapping: true,
          lineNumbers: true,
          autofocus: true,
          smartIndent: false,
          autocorrect: true,
          spellcheck: true,
          extraKeys: {
            Tab: "autocomplete",
            "Ctrl-Alt-L": () => {
              try {
                if (
                  this.cmOptions.mode == "application/json" &&
                  this.editorValue
                ) {
                  this.editorValue = this.formatStrInJson(
                    this.editorValue
                  );
                }
              } catch (e) {
                this.$message.error(
                  "格式化代码出错：" + e.toString()
                );
              }
            }
          },
          lint: true,
          gutters: [
            // "CodeMirror-lint-markers",
            "CodeMirror-linenumbers",
            // "CodeMirror-foldgutter"
          ],
          foldGutter: true,
          autoCloseBrackets: true,
          autoCloseTags: true,
          matchTags: {bothTags: true},
          matchBrackets: true,
          styleActiveLine: true,
          autoRefresh: true,
          highlightSelectionMatches: {
            minChars: 2,
            style: "matchhighlight",
            showToken: true
          },
          styleSelectedText: true,
          enableAutoFormatJson:
            this.autoFormatJson == null ? true : this.autoFormatJson,
          defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation != typeof 1 ? 2 : this.jsonIndentation
        },
        enableAutoFormatJson: this.autoFormatJson == null ? true : this.autoFormatJson,
        defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation != typeof 1 ? 2 : this.jsonIndentation
      };
    },
    watch: {
      treeDataToHint: {
        deep: true,
        handler(val,old) {
          if(val){
            val=this.setHintList(val);
            val.forEach(item=>{
              this.hintTable[item.name]=item.childHints||[];
              // this.$refs.myCm.codemirror.options.hintOptions.tables[item.name]=item.childHints||[];
              // this.$refs.myCm.codemirror.options.hintOptions.tablesTitle[item.name]=item.childHints||[];
            });
            this.$refs.myCm.codemirror.options.hintOptions.tables=this.hintTable;
            this.$refs.myCm.codemirror.options.hintOptions.tablesTitle=this.hintTable;

            // this.$refs.myCm.codemirror.setOption('hintOptions', { // 自定义提示选项
            //   completeSingle: false, // 当匹配只有一项的时候是否自动补全
            //   tables: this.hintTable
            // });
            // console.log(this.$refs.myCm.codemirror.options)

          }
        }
      },
      paramsNode: {
        // 实时监控数据变化
        immediate: true,
        deep: true,
        handler(val) {
          if (val) {
            if (val) {
              this.paramsNode=val;
            }
          }
        },
      },
      treeLable: {
        // 实时监控数据变化
        immediate: true,
        deep: true,
        handler(val) {
          if (val !== "") {
            this.treeValve = val;
            if (val !== "") {

              if( Object.keys(this.paramsNode).length>0){
                this.dragParmasList.push(this.paramsNode);
                //制作标签dom(颜色样式自行设置)
                var _cursor=this.$refs.myCm.codemirror.getCursor();
                var id="{#"+this.paramsNode.id+"#}";
                this.$refs.myCm.codemirror.replaceRange(id, _cursor,_cursor);
                var dom = document.createElement("button");
                dom.className = "parmasBtn";
                dom.innerHTML = val;
                dom.id=id;
                const endPos = { line: _cursor.line, ch: _cursor.ch + id.length,sticky:null };
                this.$refs.myCm.codemirror.markText(_cursor, endPos, {
                  replacedWith: dom,
                  className:"paramBlock",
                });
              }else{
                let pos1 = this.$refs.myCm.codemirror.getCursor();
                let pos2 = {};
                pos2.line = pos1.line;
                pos2.ch = pos1.ch;
                this.$refs.myCm.codemirror.replaceRange(val, pos2);
              }
            } else {
              let dimId =
                "cursor.execute{#('select * from MLC_RELATION_MODEL')#}#执行sql语句";
              var dom = $("<span class ='selected' >" + 222 + "</span>").get(0);
              var beforecursor = this.$refs.myCm.codemirror.getCursor();
              var star = {
                ch: beforecursor.ch + 14,
                line: beforecursor.line,
                sticky: null,
              };
              var endCursor = {
                ch: beforecursor.ch + 16,
                line: beforecursor.line,
                sticky: null,
              };
              var star1 = {
                ch: beforecursor.ch + 52,
                line: beforecursor.line,
                sticky: null,
              };
              var endCursor1 = {
                ch: beforecursor.ch + 54,
                line: beforecursor.line,
                sticky: null,
              };
              this.$refs.myCm.codemirror.replaceRange(dimId, beforecursor);
              this.$refs.myCm.codemirror.markText(star, endCursor, {
                replacedWith: dom,
                className: "selected",
              });
              this.$refs.myCm.codemirror.markText(star1, endCursor1, {
                replacedWith: dom,
                className: "selected",
              });
            }
            this.$emit("func", "2");
          }
        },
      },
      sqlData: {
        // 实时监控数据变化
        immediate: true,
        deep: true,
        handler(val) {
          if (val != "") {
            if (val !== "") {
              this.editorValue=val;
              if(this.$refs.myCm){
                this.idToButton(val);
              }

            }
          }
        },
      },
      // paramsListVisible: {
      //   // 实时监控数据变化
      //   deep: true,
      //   handler(val) {
      //     if (val) {
      //       this.SlefparamsListVisible=true;
      //     }
      //   },
      // },
      // paramsList: {
      //   deep: true,
      //   handler(val) {
      //     if (val) {
      //       if (val.length>0) {
      //         this.SelfparamsList=val;
      //       }
      //     }
      //   },
      // },
      // SelfparamsList: {
      //   deep: true,
      //   handler(val) {
      //     if (val) {
      //       if (val.length>0) {
      //         this.SlefparamsListVisible=true;
      //       }
      //     }
      //   },
      // },
      resultTableTabs: {
        // 实时监控数据变化
        deep: true,
        handler(val) {
          if (val != "") {
            if (val !== "") {
              this.resultTableTabsValue=this.resultTableTabs.length>0?String(this.resultTableTabs.length-1):'0';
              this.resultTableTabs=val;
              this.resultTableTabs.forEach(item=>{
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
      cmTheme: function (newValue, oldValue) {
        try {
          let theme = this.cmTheme == "default" ? "blackboard" : this.cmTheme;require("codemirror/theme/" + theme + ".css");
          this.cmOptions.theme = theme;
          this.resetLint();
        } catch (e) {
          this.$message.error("切换编辑器主题出错：" + e.toString());
        }
      },
      cmMode: function (newValue, oldValue) {
        this.$set(this.cmOptions, "mode", this.cmMode);
        this.resetLint();
        this.resetFoldGutter();
      },
      tabelData: function (newValue, oldValue) {

      }
    },
    mounted(){
      this.dragControllerDiv2();
      if(this.sqlData!=''){
       this.idToButton(this.sqlData);
      }
    },
    methods: {
          //将参数id转换成按钮显示到页面
      idToButton(sql,to){
        if(sql){
          this.$refs.myCm.codemirror.setCursor({line:1,ch:sql.length});
          this.paramsData.forEach(item=>{
            if(item.children&&item.children.length>0){
              item.children.forEach(vtem=>{
                if(this.editorValue.indexOf("{#"+vtem.id+"#}")!=-1){
                  this.dragParmasList.push(vtem);
                  var line=this.$refs.myCm.codemirror.getCursor().line;
                  var ch=this.getIndexArr(this.editorValue,"{#"+vtem.id+"#}",  0, [])
                  var id="{#"+vtem.id+"#}";
                  this.editorValue=this.editorValue.replace(id,'');

                  var dom = document.createElement("button");
                  dom.className = "parmasBtn";
                  dom.innerHTML = vtem.name;
                  dom.id=id;
                  var startCursor = {ch: to?to.ch:ch[0], line: to?to.line:line, sticky: null};
                  const endPos = { ch: to?to.ch+("{#"+vtem.id+"#}").length:ch[0]+("{#"+vtem.id+"#}").length, line: to?to.line:line,sticky:null };
                  this.$refs.myCm.codemirror.replaceRange(id, startCursor,endPos);
                  this.$refs.myCm.codemirror.markText(startCursor, endPos, {
                    replacedWith: dom,
                    className:"paramBlock",
                  });
                }
              })
            }
          })
        }

      },
      /**
       * 获取某行内容中字符串出现的位置数组
       * @param text 文本内容
       * @param str 字符串
       * @param index 出现位置
       * @param indexArr 位置数组
       * */
      getIndexArr(text, str, index, indexArr) {
        index = text.indexOf(str, index);
        if (index > -1) {
          indexArr.push(index);
          indexArr = this.getIndexArr(text, str, parseInt(index + 1), indexArr);
        }
        return indexArr;
      },
      // //参数设置确定点击
      // Paramssub(){
      //
      //   var _str=JSON.parse(JSON.stringify(this.editorValue));
      //   this.paramsList.forEach(item=>{
      //     console.log(item)
      //     if(this.editorValue.indexOf("{#"+item.id+"#}")!=-1&&item.paramsValue){
      //
      //       var _reg=new RegExp("{#"+item.id+"#}",'g');
      //       var _s=JSON.parse(JSON.stringify(item.paramsValue.join(",")));
      //       var _sreg=new RegExp(",",'g');
      //       _s=_s.replace(_sreg ,"','");
      //       _s="'"+_s+"'";
      //       _str=_str.replace(_reg, _s);
      //       console.log(_str)
      //     }
      //   });
      //   this.closeParams();
      //   this.paramsSub(_str);
      // },
      // //参数设置取消点击
      // closeParams(){
      //   this.SelfparamsList=[];
      //   this.SlefparamsListVisible=false;
      // },
      setHintList(list){
        list.forEach(item=>{
          item.name=item[this.hintShowName];
          if(item.childrens){
            this.setHintList(item.childrens)
          }
        });
        return list;
      },
      //导出事件
      exportSqlSelf(){
        this.exportSql(this.editorValue)
      },
      //sql结果tab切换事件
      tabClick(e){
        var list=this.resultTableTabs[e.index].list;
        this.resultTabClick(list)
      },
      //拖拽改变高度
      dragControllerDiv2: function () {
        var resize = document.getElementById('resize');
        var _top = document.getElementsByClassName('CodeMirror');
        var _topBtn=document.getElementsByClassName("btn-group");
        var _bottom = document.getElementById('bottom');
        var _box = document.getElementById('box');
        this.boxHeight=_box.offsetHeight||'85vh';
        resize.onmousedown = function (e) {
          //颜色改变提醒
          resize.style.background = '#818181';
          resize.style.cursor = 'n-resize';
          var startY = e.clientY;
          resize.top = resize.offsetTop-_topBtn[0].offsetHeight-_box.offsetTop;
          console.log(resize.offsetTop,_box.clientHeight,_box.offsetTop,_topBtn[0].clientHeight)
          // 鼠标拖动事件
          document.onmousemove = function (e) {

            var endY = e.clientY;
            var moveLen = resize.top + (endY - startY); // （endY - startY）=移动的距离。resize.top+移动的距离=左边区域最后的高度
            var maxT = _box.clientHeight - resize.offsetHeight; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

            if (moveLen < 150) moveLen = 150; // 上边区域的最小高度为150px
            if (moveLen > maxT - 150) moveLen = maxT - 150; //下边区域最小高度为150px

            resize.style.top = moveLen; // 设置上册区域的高度

            _top[0].style.height = moveLen + 'px';
            _bottom.style.height = (_box.clientHeight - moveLen - 10) + 'px';

          };
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize.style.background = '#c0c5d4';
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        }
      },
      //sql列表开始
      //使用sql
      useSql(row){
        this.editorValue=row.draftSql;
        this.draftSqlId=row.draftId;
        this.sqlvisible=false;
      },
      //删除sql
      deleteSqlSef(id){
        if(id){
          this.$confirm('确认进行删除操作么?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteSql(id)
          }).catch(() => {

          });
        }else{
          this.$message.error("主键id不能为空")
        }

      },
      //保存信息
      sub(){
        this.$emit('refreshDataList',this.dataListSelections);
      },
      //查看详情
      lookSqlDetail(row){
        this.LookSql=true;
        this.draftSql=row.draftSql||'';
      },
      // 获取数据列表
      getDataList () {
        var options={
          draftName:this.dataForm.name,
          pageSize:this.pageSize,
          pageNo:this.pageIndex,
        };
        this.getSqlList(options);
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/pdbaidudata/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //sql列表结束

      //格式化
      formatContentSelf(){
        var datas=this.$refs.myCm.codemirror.getValue();
        this.formatContent(datas)
      },
      //是否全屏
      setFullScreen(type){
        this.fullScreen=type==1?true:false;
        this.$emit("setFS",this.fullScreen);
      },
      // 执行
      implement: function () {
        var _marks=this.$refs.myCm.codemirror.getAllMarks(),_list=[];
        _marks.forEach((item)=>{
          if(item.className=='paramBlock'){
            _list.push(item.replacedWith.id)
          }
        });
        var selectValue = this.$refs.myCm.codemirror.getSelection();
        this.dragParmasList=this.dragParmasList.filter(item=>{return _list.indexOf("{#"+item.id+"#}")!=-1});
        this.getwsData(selectValue!=''?selectValue:this.$refs.myCm.codemirror.getValue(),selectValue!=''&&selectValue.indexOf("{#")==-1?[]:_list,this.dragParmasList);
      },
      // 打开
      openPython() {
        this.sqlvisible = true;
      },
      //保存弹框点击
      saveSqlClick(){
        this.$refs['sqlSaveRef'].validate((valid) => {
          if (valid) {
            var options={
              draftName:this.sqlSaveForm.draftName,
              draftSql:this.editorValue
            };
            if(this.draftSqlId!=''){
              options.type=this.sqlSaveType;
              options.draftId=this.draftSqlId;
            }
            this.saveSqlVisible=false;
            this.saveSql(options);
          }
        })
      },
      // 保存
      saveSqlSelf(type) {
        if (this.editorValue) {
          this.saveSqlVisible = true;
          this.sqlSaveType = type;
        }else{
          this.$message.error("请输入sql内容")
        }
      },
      /**
       * 另存为
       */
      saveAs() {

      },
      // 查找
      lookups() {
        this.$refs.myCm.codemirror.execCommand("find"); //触发
        // this.frame.flag = 1;
        // this.searchFlag = true;
      },
      // 替换确定
      replaceDetermine() {
        if (this.editorValue) {
          var str = this.cm.getValue();
          let reg = "/" + this.frame.searchValue + "/g";
          var res = str.replace(eval(reg), this.replaceValue);
          this.cm.setValue(res);
        }
        this.replaceFlag = false;
        this.replaceValue = "";
        this.frame.searchValue = "";
      },
      // 替换
      goReplace() {
        this.$refs.myCm.codemirror.execCommand("replace");
        // this.frame.flag = 2;
        // this.frame.searchValue = this.pyText;
        // this.searchFlag = true;
      },
      // 转大小写 type=== 1转大写 type===2转小写
      Capitalization(type) {
        var selectValue = this.$refs.myCm.codemirror.getSelection();
        if (selectValue !== "" && typeof selectValue !== "undefined") {
          if (type === 1) {
            selectValue = selectValue.toUpperCase();
          }
          if (type === 2) {
            selectValue = selectValue.toLocaleLowerCase();
          }
          this.$refs.myCm.codemirror.replaceSelection(selectValue);
        } else {
          this.$message({
            message: "请选择转换内容",
          });
        }
        // var selectValue = this.pyText;
        // if (selectValue !== "" && typeof selectValue !== "undefined") {
        //   if (type === 1) {
        //     this.replaceSelection(selectValue.toUpperCase());
        //   }
        //   if (type === 2) {
        //     this.replaceSelection(selectValue.toLocaleLowerCase());
        //   }
        // } else {
        //   this.$message.error("请选择转换内容");
        // }
      },
      // 改变字体大小 type === 1 变大 type === 2变小
      changeSize(type) {
        var thisEle = this.$refs.myCm.codemirror.style;
        console.log(thisEle);
        var textFontSize = parseFloat(thisEle, 10);
        var unit = thisEle.slice(-2); //获取单位
        if (type === 1) {
          textFontSize += 2;
          $this.$refs.myCm.codemirror.css("font-size", textFontSize + unit);
        }
        if (type === 2) {
          textFontSize -= 2;
          this.$refs.myCm.codemirror.css("font-size", textFontSize + unit);
        }
      },
      resetLint() {
        if (!this.$refs.myCm.codemirror.getValue()) {
          this.$nextTick(() => {
            this.$refs.myCm.codemirror.setOption("lint", false);
          });
          return;
        }
        this.$refs.myCm.codemirror.setOption("lint", false);
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption("lint", true);
        });
      },
      resetFoldGutter() {
        this.$refs.myCm.codemirror.setOption("foldGutter", false);
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption("foldGutter", true);
        });
      },
      // 修改编辑框样式
      setStyle(style) {
        try {
          this.$nextTick(() => {
            let cm = this.$refs.myCm.$el.querySelector(".CodeMirror");
            if (cm) {
              cm.style.cssText = style;
            } else {
              this.$message.error(
                "未找到编辑器元素，修改编辑器样式失败"
              );
            }
          });
        } catch (e) {
          this.$message.error("修改编辑器样式失败：" + e.toString());
        }
      },
      // 获取值
      getValue() {
        try {
          return this.$refs.myCm.codemirror.getValue();
        } catch (e) {
          let errorInfo = e.toString();
          this.$message.error("获取编辑框内容失败：" + errorInfo);
          return errorInfo;
        }
      },
      // 修改值
      setValue(value) {
        try {
          if (typeof value != typeof "") {
            this.$message.error(
              "修改编辑框内容失败：编辑宽内容只能为字符串"
            );
            return;
          }
          if (this.cmOptions.mode == "application/json") {
            this.editorValue = this.formatStrInJson(value);
          } else {
            this.editorValue = value;
          }
        } catch (e) {
          this.$message.error("修改编辑框内容失败：" + e.toString());
        }
      },
      // 黏贴事件处理函数
      OnPaste(event) {
        if (this.cmOptions.mode == "application/json") {
          try {
            this.editorValue = this.formatStrInJson(this.editorValue);
          } catch (e) {
            // 啥都不做
          }
        }
      },
      // 失去焦点时处理函数
      onCmBlur(cm, event) {
        try {
          let editorValue = cm.getValue();
          if (this.cmOptions.mode == "application/json" && editorValue) {
            if (!this.enableAutoFormatJson) {
              return;
            }
            this.editorValue = this.formatStrInJson(editorValue);
          }
        } catch (e) {
          // 啥也不做
        }
      },
      // 按下键盘事件处理函数
      onKeyDown(event) {
        const keyCode = event.keyCode || event.which || event.charCode;
        const keyCombination =
          event.ctrlKey || event.altKey || event.metaKey;

        // if (!keyCombination && keyCode > 64 && keyCode < 123) {
        //   this.$refs.myCm.codemirror.showHint({completeSingle: false,className:'self-hints'});
        // }
      },
      // 按下鼠标时事件处理函数
      onMouseDown(event) {
        this.$refs.myCm.codemirror.closeHint();

      },
      //codemirror 改变之前的事件
      cmBeforChange(){

      },
      onCmCodeChanges(cm, changes) {
        this.editorValue = cm.getValue();
        this.getSqlMsg(this.editorValue);
        if(changes&&changes[0].origin=="paste"){
          this.idToButton(changes[0].text[0],changes[0].to)
        }
        // console.log(cm);
        // if(this.editorValue!=''){
        //   var tok = cm.getTokenAt(cm.getCursor());
        //   if (tok.type === "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length === 1)) return false;
        //   this.$refs.myCm.codemirror.showHint({completeSingle: false,className:'self-hints'});
        // }
        this.resetLint();
      },
      cmCursorActivity(cm){
        if (cm.curOp.focus === false) {
          this.initHint(cm);
        }
      },
      initHint(editor){
        //获取用户当前的编辑器中的编写的代码
        var cur = editor.getCursor();
        var words = editor.getTokenAt(cur).string;
        var shieldString = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", " ", ",", "-", "_", "=", "+", "-", "/", ";"];
        //如果用户输入空格，则退回
        if (words.trim() === "") {
          return;
        }
        if (shieldString.indexOf(words) > -1) {
          return;
        }
        // //利用正则取出用户输入的所有的英文的字母
        words = words.replace(/[a-z]+[\-|\']+[a-z]+/ig, '').match(/([a-z]+)/ig);
        //将获取到的用户的单词传入CodeMirror,并在javascript-hint中做匹配
        CodeMirror.ukeys = words;
        //调用显示提示
        this.completeAfter(editor,null);
      },
      completeAfter(cm, pred ){
        var cur = cm.getCursor();
        if (!pred || pred()) {
          setTimeout(function () {
            if (!cm.state.completionActive)
              cm.showHint({
                completeSingle: false,
                className:'self-hints'
              });
          }, 100);
        }
        return CodeMirror.Pass;
      },


      // 格式化字符串为json格式字符串
      formatStrInJson(strValue) {
        return JSON.stringify(
          JSON.parse(strValue),
          null,
          this.defaultJsonIndentation
        );
      }
    },
    created() {
      try {
        if (!this.editorValue) {
          this.cmOptions.lint = false;
          return;
        }
        if (this.cmOptions.mode == "application/json") {
          if (!this.enableAutoFormatJson) {
            return;
          }
          this.editorValue = this.formatStrInJson(this.editorValue);
        }
      } catch (e) {
        console.log("初始化codemirror出错：" + e);
        // this.$message.error("初始化codemirror出错：" + e);
      }
    }
  };
</script>
<style>
  .CodeMirror-selected {
    background-color: blue !important;
  }
  .CodeMirror-selectedtext {
    color: white !important;
  }
  .cm-keyword{
    line-height: 1em;
    font-weight: bold;
    color: #281EF9;
  }
  .codeMirror-blue{
    background: blue !important;
  }
  /*紫色高亮*/
  /*.cm-matchhighlight {*/
    /*background-color: #ae00ae;*/
  /*}*/
  .btn-group .el-button--text i{
    font-size: 18px;
  }
  .CodeMirror{
    height: 150px;
    border: 1px solid #999;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  #box{
    width:100%;
    min-height: 85vh;
    height: 100%;
    position: relative;
  }
  #top{
    width:100%;
    height: 48%;
    float: left;
    background: #fff;
  }
  #bottom{
    width:100%;
    height: 48%;
    padding-top: 10px;
    box-sizing: border-box;
    float: left;
    background: #fff;
    z-index: 99999;
  }
  #resize{
    float: left;
    cursor: n-resize;
    width: calc(100% + 10px);
    height: 3px;
    background-color:#c0c5d4;
    position: relative;
    left:-10px;
    background-size: cover;
    background-position: center;
    /*z-index: 9999999999;*/
    font-size: 32px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  #resize:hover {
    color: #444444;
  }
  .codemirror-table-btn{
   text-align: right;
    margin-bottom: 10px;
  }
  .inline-block{
    display: inline-block;
  }
  .CodeMirror-hints{
    z-index: 3000 !important;
  }
  .fullScreenClass{
    width: 100%!important;
    height: 100vh!important;
    position: fixed;
    top:0;
    left: 0;
    border: 1px solid #999;
    padding: 10px;
    box-shadow:5px 2px 6px #ddd;
  }
  >>>.self-dialog{
    z-index: 9999999999!important;
  }
  .parmasBtn{
    border:1px solid #000;
    border-radius: 4px;
    padding: 5px;
    display: inline-block;
  }
  .paramsSel{
    width: 80%;
  }
  .box-table{
    padding-top: 0;
  }
  .box-table .el-table__header-wrapper{
    padding-top: 10px;
  }
</style>
