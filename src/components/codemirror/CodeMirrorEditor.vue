<template>
  <div>
    <div class="codemirror-div" v-if="!fullScreen">
      <div class="btn-group">
        <el-button type="text"
                   @click="formatContentSelf">
          <i v-if="!useChinese" class="el-icon-paperclip" title="格式化"></i>
          <span v-if="useChinese" title="格式化">格式化</span>
        </el-button>
        <el-button type="text"
                   :disabled="implementDisabled"
                   @click="implement">
          <i  v-if="!useChinese" class="el-icon-video-play" title="运行"></i>
          <span v-if="useChinese" title="运行">运行</span>
        </el-button>
        <el-button type="text" @click="openPython">
          <i v-if="!useChinese" class="el-icon-folder-opened" title="打开sql"></i>
          <span v-if="useChinese" title="打开sql">打开sql</span>
        </el-button>
        <el-dropdown style="margin-left: 10px" trigger="click" placement="bottom-start">
          <el-button type="text">
            <i v-if="!useChinese" class="el-icon-document-add" title="保存"></i>
            <span v-if="useChinese" title="保存">保存</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="saveSqlSelf('save')">保存</el-dropdown-item>
            <el-dropdown-item @click.native="saveSqlSelf('saveAs')">另存为</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown style="margin-left: 10px" trigger="click"  placement="bottom-start">
          <el-button type="text">
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
        @changes="onCmCodeChanges"
        @blur="onCmBlur"
        @keydown.native="onKeyDown"
        @mousedown.native="onMouseDown"
        @paste.native="OnPaste"
      ></codemirror>
    </div>
    <div class="codemirror-table-div">
      <div>
        <el-button type="primary">全部导出</el-button>
        <i v-if="!fullScreen" class="el-icon-full-screen" @click="setFullScreen(1)"></i>
        <i v-if="fullScreen" class="el-icon-minus" @click="setFullScreen(2)"></i>
      </div>
      <el-table border :data="tableData" stripe style="width: 100%" class="box-table">
        <el-table-column v-if="tableData[0]" v-for="(item,key,index) in tableData[0]" :key="index" :label="key">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row[key]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      width="70%"
      title="sql草稿列表"
      :close-on-click-modal="false"
      :visible.sync="sqlvisible">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

        <el-form-item label="sql标题:">
          <el-input v-model="dataForm.name" placeholder="模糊查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button v-if="" type="info" @click="dataForm.name=''">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="sqlListData"
        border
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
          fixed="right"
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
    <el-dialog title="草稿sql" :visible.sync="LookSql">
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
    <el-dialog title="保存草稿" :visible.sync="saveSqlVisible">
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
  </div>
</template>
<script>
  import {codemirror} from "vue-codemirror";
  import "codemirror/theme/blackboard.css";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/mode/xml/xml.js";
  import "codemirror/mode/htmlmixed/htmlmixed.js";
  import "codemirror/mode/css/css.js";
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/sql/sql.js";
  import "codemirror/mode/python/python.js";
  import "codemirror/mode/markdown/markdown.js";
  import "codemirror/addon/hint/show-hint.css";
  import "codemirror/addon/hint/show-hint.js";
  import "codemirror/addon/hint/javascript-hint.js";
  import "codemirror/addon/hint/xml-hint.js";
  import "codemirror/addon/hint/css-hint.js";
  import "codemirror/addon/hint/html-hint.js";
  import "codemirror/addon/hint/sql-hint.js";
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
  export default {
    components: {
      codemirror
    },
    // props: ["cmTheme", "cmMode", "autoFormatJson", "jsonIndentation",'treeLable','tableData'],
    props: {
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
      tableData: {
        type: Array,
        default: null,
      },
      sqlListData: {
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
    },
    data() {
      return {
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
            "CodeMirror-lint-markers",
            "CodeMirror-linenumbers",
            "CodeMirror-foldgutter"
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
      treeLable: {
        // 实时监控数据变化
        immediate: true,
        deep: true,
        handler(val) {
          if (val !== "") {
            this.treeValve = val;
            if (val !== "") {
              let pos1 = this.$refs.myCm.codemirror.getCursor();
              let pos2 = {};
              pos2.line = pos1.line;
              pos2.ch = pos1.ch;
              this.$refs.myCm.codemirror.replaceRange(val, pos2);
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
    methods: {
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
        this.getwsData(this.editorValue);
        // //清空上一次的执行结果
        // this.arr = [];
        // //执行按钮禁用
        // var executeFlag = false;
        // this.implementDisabled = true;
        // /*if (this.batchId.trim() == "") {
        //   // this.$emit("result", "false");
        //   this.$message({
        //     message: "获取登录信息失败，请重新加载网页",
        //   });
        //   this.implementDisabled = false;
        //   return false;
        // }*/
        // //每次执行重新给一个执行的uuid
        // this.batchId = "";
        // generateUUID().split("-").forEach(e => {
        //   this.batchId += e;
        // })
        // // this.batchId = generateUUID().replace("-","");
        // /*if (this.selectNumber.trim() != "") {
        //   //设置cookie
        //   setCookie("selectNumber", this.selectNumber);
        // }*/
        // //显示开始进行执行
        // this.$emit("result", "true");
        // //逐行拆分
        // var valueList = this.editorValue.split("\n");
        // //检测python删除文件的方法
        // //删除文件方法组
        // var delArr = [
        //   "remove",
        //   "rmdir",
        //   "removedirs",
        //   "unlink",
        //   "rmtree",
        //   "delete",
        //   "del",
        //   "Send2trash"
        // ];
        // //小括号
        // var regex = /\([^\)]*\)/g;
        // //对代码进行检测
        // valueList.forEach(item => {
        //   if (item.search(regex) !== -1) {
        //     delArr.forEach(delarr => {
        //       if (item.indexOf(("." + delarr + "(")) !== -1) {
        //         // this.$emit("result", "false");
        //         this.$message({
        //           message: "函数不能以" + delarr + "命名或使用",
        //         });
        //         //返回前解禁按钮
        //         this.implementDisabled = false;
        //         return false;
        //       }
        //     })
        //   }
        // })
        // //进行特殊方法的包装
        // var data = [];
        // valueList.forEach((item) => {
        //   if (item.indexOf("execute") != -1) {
        //     // replace(/(\s*$)/g, "")
        //     var a = item;
        //     var b = a + "&}";
        //     // var b = a.replace(")", ")#}")
        //     var str = b.replace("execute", "execute{&");
        //     data.push(str);
        //   } else if (item.indexOf("outPutPrint") != -1) {
        //     // replace(/(\s*$)/g, "")
        //     var a = item;
        //     var b = a + "%}";
        //     // var b = a.replace(")", ")#}")
        //     var str = b.replace("outPutPrint", "outPutPrint{%");
        //     data.push(str);
        //   } else if (item.indexOf("outPutPicture") != -1) {
        //     // replace(/(\s*$)/g, "")
        //     var a = item;
        //     var b = a + "%}";
        //     // var b = a.replace(")", ")#}")
        //     var str = b.replace("outPutPicture", "outPutPicture{%");
        //     data.push(str);
        //   } else if (item.indexOf("outPutTable") != -1) {
        //     // replace(/(\s*$)/g, "")
        //     var a = item;
        //     var b = a + "%}";
        //     // var b = a.replace(")", ")#}")
        //     var str = b.replace("outPutTable", "outPutTable{%");
        //     data.push(str);
        //   } else if (item.indexOf("fileDownloadOutPut") != -1) {
        //     // replace(/(\s*$)/g, "")
        //     var a = item;
        //     var b = a + "%}";
        //     // var b = a.replace(")", ")#}")
        //     var str = b.replace("fileDownloadOutPut", "fileDownloadOutPut{%");
        //     data.push(str);
        //   } else {
        //     data.push(item);
        //   }
        // });
        // data = data.join("\n");
        // if (this.funLists.length > 0) {
        //   this.funLists.forEach((item) => {
        //     var m = "import " + item.name;
        //     if (data.indexOf(m) != -1) {
        //       var f = "{|(" + m + ")|}";
        //       data = data.replace(m, f);
        //     }
        //   });
        // }
        // // this.arr = [];
        // //取消禁用按钮
        // this.implementDisabled = false;
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
        let obj = {};
        selectTree(obj).then((res) => {
          this.sheetData = res.data;
          this.sheetData.forEach((m) => {
            this.idArr.push(m.id);
          });
        });
        this.draftFlag = true;
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
        if (!keyCombination && keyCode > 64 && keyCode < 123) {
          this.$refs.myCm.codemirror.showHint({completeSingle: false});
        }
      },
      // 按下鼠标时事件处理函数
      onMouseDown(event) {
        this.$refs.myCm.codemirror.closeHint();
      },
      onCmCodeChanges(cm, changes) {
        this.editorValue = cm.getValue();
        this.resetLint();
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
  .cm-matchhighlight {
    background-color: #ae00ae;
  }
  .btn-group .el-button--text i{
    font-size: 18px;
  }
  .CodeMirror{
    height: 150px;
    border: 1px solid #999;
    margin: 10px 0;
  }
</style>
