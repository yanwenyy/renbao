<template>
  <div>
    <div class="codemirror-div" v-if="!fullScreen">
      <div class="btn-group">
        <el-button type="text"
                   :disabled="implementDisabled"
                   @click="implement">
          <i class="el-icon-video-play" title="运行"></i>
        </el-button>
        <el-button type="text" @click="openPython"><i class="el-icon-folder-opened" title="打开sql"></i></el-button>
        <!-- <el-button type="primary" @click="savePython">保存python</el-button> -->
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button type="text">
           <i class="el-icon-document-add" title="保存"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="savePython">保存</el-dropdown-item>
            <el-dropdown-item @click.native="saveAs">另存为</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button type="text">
            <i class="el-icon-suitcase-1" title="工具箱"></i>
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
            <el-dropdown-item @click.native="changeSize(1)"
            >字体放大
            </el-dropdown-item
            >
            <el-dropdown-item @click.native="changeSize(2)"
            >字体缩小
            </el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button style="margin-left: 10px" type="primary" @click="">保存数据</el-button>
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
    props: ["cmTheme", "cmMode", "autoFormatJson", "jsonIndentation",'treeLable'],
    data() {
      return {
        fullScreen:false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
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
            if (val !== "" && val !== "BBB") {
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
      }
    },
    methods: {
      //是否全屏
      setFullScreen(type){
        this.fullScreen=type==1?true:false;
        this.$emit("setFS",this.fullScreen);
      },
      // 执行
      implement: function () {
        //清空上一次的执行结果
        this.arr = [];
        //执行按钮禁用
        var executeFlag = false;
        this.implementDisabled = true;
        /*if (this.batchId.trim() == "") {
          // this.$emit("result", "false");
          this.$message({
            message: "获取登录信息失败，请重新加载网页",
          });
          this.implementDisabled = false;
          return false;
        }*/
        //每次执行重新给一个执行的uuid
        this.batchId = "";
        generateUUID().split("-").forEach(e => {
          this.batchId += e;
        })
        // this.batchId = generateUUID().replace("-","");
        /*if (this.selectNumber.trim() != "") {
          //设置cookie
          setCookie("selectNumber", this.selectNumber);
        }*/
        //显示开始进行执行
        this.$emit("result", "true");
        //逐行拆分
        var valueList = this.editorValue.split("\n");
        //检测python删除文件的方法
        //删除文件方法组
        var delArr = [
          "remove",
          "rmdir",
          "removedirs",
          "unlink",
          "rmtree",
          "delete",
          "del",
          "Send2trash"
        ];
        //小括号
        var regex = /\([^\)]*\)/g;
        //对代码进行检测
        valueList.forEach(item => {
          if (item.search(regex) !== -1) {
            delArr.forEach(delarr => {
              if (item.indexOf(("." + delarr + "(")) !== -1) {
                // this.$emit("result", "false");
                this.$message({
                  message: "函数不能以" + delarr + "命名或使用",
                });
                //返回前解禁按钮
                this.implementDisabled = false;
                return false;
              }
            })
          }
        })
        //进行特殊方法的包装
        var data = [];
        valueList.forEach((item) => {
          if (item.indexOf("execute") != -1) {
            // replace(/(\s*$)/g, "")
            var a = item;
            var b = a + "&}";
            // var b = a.replace(")", ")#}")
            var str = b.replace("execute", "execute{&");
            data.push(str);
          } else if (item.indexOf("outPutPrint") != -1) {
            // replace(/(\s*$)/g, "")
            var a = item;
            var b = a + "%}";
            // var b = a.replace(")", ")#}")
            var str = b.replace("outPutPrint", "outPutPrint{%");
            data.push(str);
          } else if (item.indexOf("outPutPicture") != -1) {
            // replace(/(\s*$)/g, "")
            var a = item;
            var b = a + "%}";
            // var b = a.replace(")", ")#}")
            var str = b.replace("outPutPicture", "outPutPicture{%");
            data.push(str);
          } else if (item.indexOf("outPutTable") != -1) {
            // replace(/(\s*$)/g, "")
            var a = item;
            var b = a + "%}";
            // var b = a.replace(")", ")#}")
            var str = b.replace("outPutTable", "outPutTable{%");
            data.push(str);
          } else if (item.indexOf("fileDownloadOutPut") != -1) {
            // replace(/(\s*$)/g, "")
            var a = item;
            var b = a + "%}";
            // var b = a.replace(")", ")#}")
            var str = b.replace("fileDownloadOutPut", "fileDownloadOutPut{%");
            data.push(str);
          } else {
            data.push(item);
          }
        });
        data = data.join("\n");
        if (this.funLists.length > 0) {
          this.funLists.forEach((item) => {
            var m = "import " + item.name;
            if (data.indexOf(m) != -1) {
              var f = "{|(" + m + ")|}";
              data = data.replace(m, f);
            }
          });
        }
        // this.arr = [];
        let formData = new FormData();
        // var str = "";
        // var str1 = "";
        // if (
        //   data.indexOf("{@cursor@}") != -1 &&
        //   data.indexOf("{@send_msg@}") != -1
        // ) {
        //   str = data.replace("{@cursor@}", this.funList[0].value);
        //   str1 = str.replace("{@send_msg@}", this.funList[1].value);
        // } else {
        // str1 = data;
        // }
        // if (str1.indexOf("{@cursor@}") != -1) {
        //   str1 = str1.replace("{@cursor@}", this.funList[0].value);
        // }
        // if (str1.indexOf("{@send_msg@}") != -1) {
        //   str1 = str1.replace("{@send_msg@}", this.funList[1].value);
        // }
        // 执行时print出现的次数 frequency
        var frequency = (data.match(/print{%/g) || []).length;

        formData.append("script", data);
        // this.batchId
        formData.append("batchId", this.batchId);
        //执行语句转换及权限转换，返回成功会生产临时文件
        shiftSql(formData)
          .then((res) => {
            var arr = [];
            if (res.status !== "50") {
              //debugger
              //获取返回的保存文件路径
              var savePath = res.pySavePath
              var pySaveRelativePath = res.pySaveRelativePath
              var pyOpenFilePath = res.pyOpenFilePath
              var pyOpenRelativePath = res.pyOpenRelativePath
              //有保存路径
              if (savePath !== undefined && savePath !== null && savePath.length !== 0) {
                //设置存在变量
                var flag = false
                //返回路径存在
                if (savePath !== null) {
                  /*//分隔符
                  var separator = "/";

                  //解析路径进行比对
                  for (let i = 0; i < savePath.length; i++) {
                    //进行解析

                    //根路径下
                    if (pySaveRelativePath[i].indexOf("/") === -1 && pySaveRelativePath[i].indexOf("\\") === -1) {
                      flag = true;
                      // break;
                    }
                    if (savePath[i].indexOf("\\") !== -1) {
                      separator = "\\";
                    }
                    //截取全路径
                    var fullPath = savePath[i].substring(0, savePath[i].lastIndexOf(separator) + 1);
                    //对比个人文件的路径是否存在
                    var tempFileData = this.fileData
                    for (let j = 0; j < tempFileData.length; j++) {
                      if (tempFileData[j].filePath.indexOf(separator) === -1) {
                        if (separator === "\\") {
                          while (tempFileData[j].filePath.indexOf("/") !== -1) {
                            tempFileData[j].filePath = tempFileData[j].filePath.replace("/", "\\");
                          }
                        } else {
                          tempFileData[j].filePath = tempFileData[j].filePath.replace(/\\/g, "/");
                        }
                      }
                      //,个人文件是否已存
                      if(tempFileData[j].extendName === null){
                        var textTemp = tempFileData[j].filePath + tempFileData[j].fileName;
                      }
                      var textTemp = tempFileData[j].filePath + tempFileData[j].fileName + "." + tempFileData[j].extendName
                      if(tempFileData[j].filePath.trim() === separator){
                        textTemp =  tempFileData[j].fileName + "." + tempFileData[j].extendName
                      }
                      textTemp = textTemp.replace(/\\/g, "/");
                      if (tempFileData[j].isDir === 0 && (textTemp).indexOf(pySaveRelativePath[i]) !== -1 && (pySaveRelativePath[i]).indexOf(textTemp) !== -1) {
                        this.$emit("result", "false");
                        this.$message({
                          message: "同名文件已存在",
                        });
                        return false;
                      }
                      if (tempFileData[j].isDir === 0 && fullPath.indexOf(tempFileData[j].filePath) !== -1) {
                        flag = true;
                        // break;
                      }
                    }
                  }*/
                  //重新使用相对路径进行解析
                  var tempFileData = this.fileData
                  for (let i = 0; i < pySaveRelativePath.length; i++) {
                    //解析所需要的数据
                    var fileName = ""
                    var filePath = ""
                    var extendName = ""
                    if (pySaveRelativePath[i].indexOf("/") === -1) {
                      filePath = "/";
                      var apa = pySaveRelativePath[i].split(".");
                      fileName = apa[0];
                      extendName = apa[1];
                    } else {
                      filePath = "/" + pySaveRelativePath[i].substring(0, pySaveRelativePath[i].lastIndexOf("/") + 1);
                      var apa = pySaveRelativePath[i].substring(pySaveRelativePath[i].lastIndexOf("/") + 1).split(".");
                      fileName = apa[0];
                      extendName = apa[1];
                    }
                    //查找相同路径
                    for (let j = 0; j < tempFileData.length; j++) {
                      //文件，路径,目录存在，文件不存在
                      if (filePath === "/" && tempFileData[j].filePath === "/") {
                        if (tempFileData[j].fileName === fileName && tempFileData[j].extendName === extendName) {
                          this.$emit("result", "false");
                          this.$message({
                            message: "同名文件已存在",
                          });
                          //进行临时文件的删除及禁用按钮的解封
                          this.toDelTempFile();
                          this.implementDisabled = false;
                          return false;
                        }
                        flag = true;
                      }
                      if (tempFileData[j].extendName !== null) {
                        // if (tempFileData[j].filePath + tempFileData[j].fileName + "/" === filePath){
                        if (tempFileData[j].filePath === filePath) {
                          if (tempFileData[j].fileName === fileName && tempFileData[j].extendName === extendName) {
                            this.$emit("result", "false");
                            this.$message({
                              message: "同名文件已存在",
                            });
                            //进行临时文件的删除及禁用按钮的解封
                            this.toDelTempFile();
                            this.implementDisabled = false;
                            return false;
                          }
                          flag = true;
                          continue;
                        }
                      } else {
                        if (tempFileData[j].filePath + tempFileData[j].fileName + "/" === filePath) {
                          flag = true;
                        }
                      }
                    }
                  }
                }
                //路径不存在，抛出错误信息
                if (!flag) {
                  this.$emit("result", "false");
                  this.$message({
                    message: "保存文件的目录不存在",
                  });
                  //进行临时文件的删除及禁用按钮的解封
                  this.toDelTempFile();
                  this.implementDisabled = false;
                  return false;
                }
              }
              //如果有要下载的文件
              //请求下载文件到本地服务器，参数路径以？进行分隔
              if (pyOpenFilePath !== undefined && pyOpenFilePath !== null && pyOpenFilePath.length !== 0 && pyOpenRelativePath !== undefined && pyOpenRelativePath !== null && pyOpenRelativePath.length !== 0) {
                var openFile = "";
                var openRelativeFiles = "";
                for (let n = 0; n < pyOpenFilePath.length; n++) {
                  if (n < pyOpenFilePath.length - 1) {
                    openFile += (pyOpenFilePath[n] + "?");
                    openRelativeFiles += (pyOpenRelativePath[n] + "?");
                  } else {
                    openFile += pyOpenFilePath[n];
                    openRelativeFiles += pyOpenRelativePath[n];
                  }
                }
                var openFileData = new URLSearchParams();
                openFileData.append("openRelativeFiles", openRelativeFiles);
                openFileData.append("openFilePath", openFile);
                //进行下载
                downloadFile(openFileData).then((response) => {
                  // console.log(response)
                  let obj = {
                    batchId: this.batchId,
                    sqript: res.newScript,
                    printSum: frequency,
                    savePath: savePath
                  };
                  //执行过滤后的python
                  executePython(obj)
                    .then((re) => {
                      if (re.status != 50) {
                        //如果有保存路径
                        if (savePath !== undefined && savePath !== null && savePath.length !== 0) {
                          var saveFiles = "";
                          var saveRelativeFiles = "";
                          for (let k = 0; k < savePath.length; k++) {
                            if (k < savePath.length - 1) {
                              saveFiles += (savePath[k] + "?");
                              saveRelativeFiles += (pySaveRelativePath[k] + "?");
                            } else {
                              saveFiles += savePath[k];
                              saveRelativeFiles += pySaveRelativePath[k];
                            }
                          }
                          //准备数据
                          let saveFileData = new FormData();
                          saveFileData.append("saveFiles", saveFiles);
                          saveFileData.append("saveRelativeFiles", saveRelativeFiles);
                          //文件管理中存储文件
                          //进行文件保存
                          saveUploadFile(saveFileData).then((r) => {
                            //删除临时文件
                            this.toDelTempFile();
                            //刷新对比文件树列表
                            this.$emit("getfiletree");
                            //刷新个人基础数据
                            this.getFileData();
                            // let saveMessage = "文件保存成功";
                            //显示执行结果
                            if (re.result.length > 0) {
                              var arrList = [];
                              re.result.forEach((item) => {
                                var ind = item.indexOf("@");
                                var before = item.substring(0, ind);
                                var after = item.substring(ind + 1, item.length);
                                if (item.indexOf("icssError:") != -1) {
                                  var objH = {
                                    value: item,
                                    flagValue: 0,
                                  };
                                  arrList.push(objH);
                                  executeFlag = true;
                                } else {
                                  if (before === "print") {
                                    var objH = {
                                      value: after,
                                      flagValue: 1,
                                    };
                                    arrList.push(objH);
                                  }
                                  if (before === "picture") {
                                    var obj1 = {
                                      name: "图表",
                                      value: after,
                                      flag: 3,
                                      valueFlag: 1,
                                    };
                                    arr.push(obj1);
                                  }
                                  if (before === "table") {
                                    try {
                                      var obj4 = {
                                        name: "数据表",
                                        value: JSON.parse(after),
                                        flag: 2,
                                        valueFlag: 1,
                                      };
                                      arr.push(obj4);
                                    } catch (e) {
                                      var objH = {
                                        value: after,
                                        flagValue: 1,
                                      };
                                      arrList.push(objH);
                                    }
                                  }
                                  if (before === "fileUpload") {
                                    let token =
                                      "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                    // /AuditAnalysis/pythonTools/downLoadFile
                                    // /pythontools/pythonEditor/downLoadFile
                                    this.File(
                                      "/pythontools/pythonEditor/downLoadFile?url=" +
                                      after
                                    );
                                    this.$emit("result", "false");
                                  }
                                }
                                // if (item.indexOf(this.batchId) != -1) {
                                //   var obj0 = {
                                //     name: "执行结果",
                                //     value: item,
                                //     flag: 1,
                                //     valueFlag: 0,
                                //   };
                                //   arr.push(obj0);
                                // } else {
                                //   var redata;
                                //   if (item.slice(0, 1) == "{") {
                                //     redata = JSON.parse(item);
                                //     var obj1 = {
                                //       name: "执行结果",
                                //       value: redata,
                                //       flag: 2,
                                //       valueFlag: 1,
                                //     };
                                //     arr.push(obj1);
                                //   } else {
                                //     if (item.indexOf("data:image/png;base64") != -1) {
                                //       var obj1 = {
                                //         name: "执行结果",
                                //         value: item,
                                //         flag: 3,
                                //         valueFlag: 1,
                                //       };
                                //       arr.push(obj1);
                                //     } else {
                                //       redata = item;
                                //       var obj2 = {
                                //         name: "执行结果",
                                //         value: item,
                                //         flag: 1,
                                //         valueFlag: 2,
                                //       };
                                //       arr.push(obj2);
                                //     }
                                //   }
                                // }
                                // if (item.indexOf("cols") != -1) {
                                //   if (item.slice(0, 1) == "{") {
                                //     try {
                                //       var obj1 = {
                                //         name: "执行结果",
                                //         value: JSON.parse(item),
                                //         flag: 2,
                                //         valueFlag: 1,
                                //       };
                                //       arr.push(obj1);
                                //       return true;
                                //     } catch (e) {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 0,
                                //       };
                                //       arrList.push(objH);
                                //       return false;
                                //     }
                                //   } else {
                                //     if (item.indexOf("data:image/png;base64") != -1) {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 1,
                                //       };
                                //     } else {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 0,
                                //       };
                                //     }
                                //     arrList.push(objH);
                                //   }
                                // } else {
                                //   if (item.indexOf("data:image/png;base64") != -1) {
                                //     var objH = {
                                //       value: item,
                                //       flagValue: 1,
                                //     };
                                //   } else {
                                //     var objH = {
                                //       value: item,
                                //       flagValue: 0,
                                //     };
                                //   }
                                //   arrList.push(objH);
                                // }
                              });
                              // var objH = {
                              //   value: saveMessage,
                              //   flagValue: 1,
                              // };
                              // arrList.push(objH);
                              if (arrList.length > 0) {
                                var objL = {
                                  name: "执行结果",
                                  value: arrList,
                                  flag: 1,
                                  valueFlag: 2,
                                };
                                //将执行结果添加到显示的结果数组里面
                                arr.push(objL);
                              }
                              this.$emit("result", arr);
                            } else {
                              this.$emit("result", "false");
                            }
                            // arrs.forEach((item, index) => {
                            //   orderNumList[index];
                            //   var Aobj = {
                            //     name: "执行结果",
                            //     value: item,
                            //     flag: 2,
                            //     valueFlag: 1,
                            //   };
                            //   var inde = orderNumList[index] - 1;
                            //   // arr.splice(inde, 0, Aobj);
                            //   arr.push(Aobj);
                            // });
                            // this.$emit("result", arr);
                            if (executeFlag) {
                              this.implementDisabled = false;
                              return
                            }
                            this.implementDisabled = false;
                            return;
                          }).catch(() => {
                            // debugger
                            let saveMessage = "文件保存失败";
                            //删除临时文件
                            this.toDelTempFile();
                            if (re.result.length > 0) {
                              var arrList = [];
                              re.result.forEach((item) => {
                                var ind = item.indexOf("@");
                                var before = item.substring(0, ind);
                                var after = item.substring(ind + 1, item.length);
                                if (item.indexOf("icssError:") != -1) {
                                  var objH = {
                                    value: item,
                                    flagValue: 0,
                                  };
                                  arrList.push(objH);
                                  executeFlag = true;
                                } else {
                                  if (before === "print") {
                                    var objH = {
                                      value: after,
                                      flagValue: 1,
                                    };
                                    arrList.push(objH);
                                  }
                                  if (before === "picture") {
                                    var obj1 = {
                                      name: "图表",
                                      value: after,
                                      flag: 3,
                                      valueFlag: 1,
                                    };
                                    arr.push(obj1);
                                  }
                                  if (before === "table") {
                                    try {
                                      var obj4 = {
                                        name: "数据表",
                                        value: JSON.parse(after),
                                        flag: 2,
                                        valueFlag: 1,
                                      };
                                      arr.push(obj4);
                                    } catch (e) {
                                      var objH = {
                                        value: after,
                                        flagValue: 1,
                                      };
                                      arrList.push(objH);
                                    }
                                  }
                                  if (before === "fileUpload") {
                                    let token =
                                      "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                    // /AuditAnalysis/pythonTools/downLoadFile
                                    // /pythontools/pythonEditor/downLoadFile
                                    this.File(
                                      "/pythontools/pythonEditor/downLoadFile?url=" +
                                      after
                                    );
                                    this.$emit("result", "false");
                                  }
                                }
                                // if (item.indexOf(this.batchId) != -1) {
                                //   var obj0 = {
                                //     name: "执行结果",
                                //     value: item,
                                //     flag: 1,
                                //     valueFlag: 0,
                                //   };
                                //   arr.push(obj0);
                                // } else {
                                //   var redata;
                                //   if (item.slice(0, 1) == "{") {
                                //     redata = JSON.parse(item);
                                //     var obj1 = {
                                //       name: "执行结果",
                                //       value: redata,
                                //       flag: 2,
                                //       valueFlag: 1,
                                //     };
                                //     arr.push(obj1);
                                //   } else {
                                //     if (item.indexOf("data:image/png;base64") != -1) {
                                //       var obj1 = {
                                //         name: "执行结果",
                                //         value: item,
                                //         flag: 3,
                                //         valueFlag: 1,
                                //       };
                                //       arr.push(obj1);
                                //     } else {
                                //       redata = item;
                                //       var obj2 = {
                                //         name: "执行结果",
                                //         value: item,
                                //         flag: 1,
                                //         valueFlag: 2,
                                //       };
                                //       arr.push(obj2);
                                //     }
                                //   }
                                // }
                                // if (item.indexOf("cols") != -1) {
                                //   if (item.slice(0, 1) == "{") {
                                //     try {
                                //       var obj1 = {
                                //         name: "执行结果",
                                //         value: JSON.parse(item),
                                //         flag: 2,
                                //         valueFlag: 1,
                                //       };
                                //       arr.push(obj1);
                                //       return true;
                                //     } catch (e) {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 0,
                                //       };
                                //       arrList.push(objH);
                                //       return false;
                                //     }
                                //   } else {
                                //     if (item.indexOf("data:image/png;base64") != -1) {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 1,
                                //       };
                                //     } else {
                                //       var objH = {
                                //         value: item,
                                //         flagValue: 0,
                                //       };
                                //     }
                                //     arrList.push(objH);
                                //   }
                                // } else {
                                //   if (item.indexOf("data:image/png;base64") != -1) {
                                //     var objH = {
                                //       value: item,
                                //       flagValue: 1,
                                //     };
                                //   } else {
                                //     var objH = {
                                //       value: item,
                                //       flagValue: 0,
                                //     };
                                //   }
                                //   arrList.push(objH);
                                // }
                              });
                              var objH = {
                                value: saveMessage,
                                flagValue: 0,
                              };
                              arrList.push(objH);
                              if (arrList.length > 0) {
                                var objL = {
                                  name: "执行结果",
                                  value: arrList,
                                  flag: 1,
                                  valueFlag: 2,
                                };
                                arr.push(objL);
                              }
                              this.$emit("result", arr);
                            } else {
                              this.$emit("result", "false");
                            }
                            // arrs.forEach((item, index) => {
                            //   orderNumList[index];
                            //   var Aobj = {
                            //     name: "执行结果",
                            //     value: item,
                            //     flag: 2,
                            //     valueFlag: 1,
                            //   };
                            //   var inde = orderNumList[index] - 1;
                            //   // arr.splice(inde, 0, Aobj);
                            //   arr.push(Aobj);
                            // });
                            // this.$emit("result", arr);
                            if (executeFlag) {
                              this.implementDisabled = false;
                              return;
                            }
                            this.implementDisabled = false;
                            return;
                          });
                        }
                        //没有保存路径
                        else {
                          //删除临时文件
                          this.toDelTempFile();
                          if (re.result.length > 0) {
                            var arrList = [];
                            re.result.forEach((item) => {
                              var ind = item.indexOf("@");
                              var before = item.substring(0, ind);
                              var after = item.substring(ind + 1, item.length);
                              if (item.indexOf("icssError:") != -1) {
                                var objH = {
                                  value: item,
                                  flagValue: 0,
                                };
                                arrList.push(objH);
                                executeFlag = true
                              } else {
                                if (before === "print") {
                                  var objH = {
                                    value: after,
                                    flagValue: 1,
                                  };
                                  arrList.push(objH);
                                }
                                if (before === "picture") {
                                  var obj1 = {
                                    name: "图表",
                                    value: after,
                                    flag: 3,
                                    valueFlag: 1,
                                  };
                                  arr.push(obj1);
                                }
                                if (before === "table") {
                                  try {
                                    var obj4 = {
                                      name: "数据表",
                                      value: JSON.parse(after),
                                      flag: 2,
                                      valueFlag: 1,
                                    };
                                    arr.push(obj4);
                                  } catch (e) {
                                    var objH = {
                                      value: after,
                                      flagValue: 1,
                                    };
                                    arrList.push(objH);
                                  }
                                }
                                if (before === "fileUpload") {
                                  let token =
                                    "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                  // /AuditAnalysis/pythonTools/downLoadFile
                                  // /pythontools/pythonEditor/downLoadFile
                                  this.File(
                                    "/pythontools/pythonEditor/downLoadFile?url=" +
                                    after
                                  );
                                  this.$emit("result", "false");
                                }
                              }
                              // if (item.indexOf(this.batchId) != -1) {
                              //   var obj0 = {
                              //     name: "执行结果",
                              //     value: item,
                              //     flag: 1,
                              //     valueFlag: 0,
                              //   };
                              //   arr.push(obj0);
                              // } else {
                              //   var redata;
                              //   if (item.slice(0, 1) == "{") {
                              //     redata = JSON.parse(item);
                              //     var obj1 = {
                              //       name: "执行结果",
                              //       value: redata,
                              //       flag: 2,
                              //       valueFlag: 1,
                              //     };
                              //     arr.push(obj1);
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 3,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //     } else {
                              //       redata = item;
                              //       var obj2 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 1,
                              //         valueFlag: 2,
                              //       };
                              //       arr.push(obj2);
                              //     }
                              //   }
                              // }
                              // if (item.indexOf("cols") != -1) {
                              //   if (item.slice(0, 1) == "{") {
                              //     try {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: JSON.parse(item),
                              //         flag: 2,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //       return true;
                              //     } catch (e) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //       arrList.push(objH);
                              //       return false;
                              //     }
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 1,
                              //       };
                              //     } else {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //     }
                              //     arrList.push(objH);
                              //   }
                              // } else {
                              //   if (item.indexOf("data:image/png;base64") != -1) {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 1,
                              //     };
                              //   } else {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 0,
                              //     };
                              //   }
                              //   arrList.push(objH);
                              // }
                            });
                            if (arrList.length > 0) {
                              var objL = {
                                name: "执行结果",
                                value: arrList,
                                flag: 1,
                                valueFlag: 2,
                              };
                              arr.push(objL);
                            }
                            this.$emit("result", arr);
                          } else {
                            this.$emit("result", "false");
                          }
                          // arrs.forEach((item, index) => {
                          //   orderNumList[index];
                          //   var Aobj = {
                          //     name: "执行结果",
                          //     value: item,
                          //     flag: 2,
                          //     valueFlag: 1,
                          //   };
                          //   var inde = orderNumList[index] - 1;
                          //   // arr.splice(inde, 0, Aobj);
                          //   arr.push(Aobj);
                          // });
                          // this.$emit("result", arr);
                          if (executeFlag) {
                            this.implementDisabled = false;
                            return;
                          }
                          this.implementDisabled = false;
                          return;
                        }
                      } else {
                        //执行python发生错误
                        //删除临时文件
                        this.toDelTempFile();
                        //取消执行显示
                        this.$emit("result", "false");
                        //提示执行结果
                        this.$message({
                          message: re.msg,
                        });
                      }
                    })
                    .catch(() => {
                      this.toDelTempFile();
                      this.$emit("result", "false");
                      this.$message({
                        message: "python执行失败",
                      });
                    });
                }).catch(() => {
                  this.toDelTempFile();
                  this.$emit("result", "false");
                  this.$message({
                    message: "无法读取到文件",
                  })
                })
              } else {
                //没有需要下载的文件
                let obj = {
                  batchId: this.batchId,
                  sqript: res.newScript,
                  printSum: frequency,
                  savePath: savePath
                };
                //执行python
                executePython(obj)
                  .then((re) => {
                    if (re.status != 50) {
                      //有要保存的文件
                      if (savePath !== undefined && savePath !== null && savePath.length !== 0) {
                        var saveFiles = "";
                        var saveRelativeFiles = "";
                        for (let k = 0; k < savePath.length; k++) {
                          if (k < savePath.length - 1) {
                            saveFiles += (savePath[k] + "?");
                            saveRelativeFiles += (pySaveRelativePath[k] + "?");
                          } else {
                            saveFiles += savePath[k];
                            saveRelativeFiles += pySaveRelativePath[k];
                          }
                        }
                        //准备数据
                        let saveFileData = new FormData();
                        saveFileData.append("saveFiles", saveFiles);
                        saveFileData.append("saveRelativeFiles", saveRelativeFiles);
                        //文件管理中存储文件
                        saveUploadFile(saveFileData).then((r) => {
                          this.toDelTempFile();
                          this.$emit("getfiletree");
                          this.getFileData();
                          // let saveMessage = "文件保存成功";
                          if (re.result.length > 0) {
                            var arrList = [];
                            re.result.forEach((item) => {
                              var ind = item.indexOf("@");
                              var before = item.substring(0, ind);
                              var after = item.substring(ind + 1, item.length);
                              if (item.indexOf("icssError:") != -1) {
                                var objH = {
                                  value: item,
                                  flagValue: 0,
                                };
                                arrList.push(objH);
                                executeFlag = true;
                              } else {
                                if (before === "print") {
                                  var objH = {
                                    value: after,
                                    flagValue: 1,
                                  };
                                  arrList.push(objH);
                                }
                                if (before === "picture") {
                                  var obj1 = {
                                    name: "图表",
                                    value: after,
                                    flag: 3,
                                    valueFlag: 1,
                                  };
                                  arr.push(obj1);
                                }
                                if (before === "table") {
                                  try {
                                    var obj4 = {
                                      name: "数据表",
                                      value: JSON.parse(after),
                                      flag: 2,
                                      valueFlag: 1,
                                    };
                                    arr.push(obj4);
                                  } catch (e) {
                                    var objH = {
                                      value: after,
                                      flagValue: 1,
                                    };
                                    arrList.push(objH);
                                  }
                                }
                                if (before === "fileUpload") {
                                  let token =
                                    "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                  // /AuditAnalysis/pythonTools/downLoadFile
                                  // /pythontools/pythonEditor/downLoadFile
                                  this.File(
                                    "/pythontools/pythonEditor/downLoadFile?url=" +
                                    after
                                  );
                                  // this.$emit("result", "false");
                                }
                              }
                              // if (item.indexOf(this.batchId) != -1) {
                              //   var obj0 = {
                              //     name: "执行结果",
                              //     value: item,
                              //     flag: 1,
                              //     valueFlag: 0,
                              //   };
                              //   arr.push(obj0);
                              // } else {
                              //   var redata;
                              //   if (item.slice(0, 1) == "{") {
                              //     redata = JSON.parse(item);
                              //     var obj1 = {
                              //       name: "执行结果",
                              //       value: redata,
                              //       flag: 2,
                              //       valueFlag: 1,
                              //     };
                              //     arr.push(obj1);
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 3,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //     } else {
                              //       redata = item;
                              //       var obj2 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 1,
                              //         valueFlag: 2,
                              //       };
                              //       arr.push(obj2);
                              //     }
                              //   }
                              // }
                              // if (item.indexOf("cols") != -1) {
                              //   if (item.slice(0, 1) == "{") {
                              //     try {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: JSON.parse(item),
                              //         flag: 2,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //       return true;
                              //     } catch (e) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //       arrList.push(objH);
                              //       return false;
                              //     }
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 1,
                              //       };
                              //     } else {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //     }
                              //     arrList.push(objH);
                              //   }
                              // } else {
                              //   if (item.indexOf("data:image/png;base64") != -1) {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 1,
                              //     };
                              //   } else {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 0,
                              //     };
                              //   }
                              //   arrList.push(objH);
                              // }
                            });
                            // var objH = {
                            //   value: saveMessage,
                            //   flagValue: 1,
                            // };
                            // arrList.push(objH);
                            if (arrList.length > 0) {
                              var objL = {
                                name: "执行结果",
                                value: arrList,
                                flag: 1,
                                valueFlag: 2,
                              };
                              arr.push(objL);
                            }
                            this.$emit("result", arr);
                          } else {
                            this.$emit("result", "false");
                          }
                          // arrs.forEach((item, index) => {
                          //   orderNumList[index];
                          //   var Aobj = {
                          //     name: "执行结果",
                          //     value: item,
                          //     flag: 2,
                          //     valueFlag: 1,
                          //   };
                          //   var inde = orderNumList[index] - 1;
                          //   // arr.splice(inde, 0, Aobj);
                          //   arr.push(Aobj);
                          // });
                          // this.$emit("result", arr);
                          if (executeFlag) {
                            this.implementDisabled = false;
                            return;
                          }
                          this.implementDisabled = false;
                          return;
                        }).catch(() => {
                          let saveMessage = "文件保存失败";
                          this.toDelTempFile();
                          if (re.result.length > 0) {
                            var arrList = [];
                            re.result.forEach((item) => {
                              var ind = item.indexOf("@");
                              var before = item.substring(0, ind);
                              var after = item.substring(ind + 1, item.length);
                              if (item.indexOf("icssError:") != -1) {
                                var objH = {
                                  value: item,
                                  flagValue: 0,
                                };
                                arrList.push(objH);
                                executeFlag = true;
                              } else {
                                if (before === "print") {
                                  var objH = {
                                    value: after,
                                    flagValue: 1,
                                  };
                                  arrList.push(objH);
                                }
                                if (before === "picture") {
                                  var obj1 = {
                                    name: "图表",
                                    value: after,
                                    flag: 3,
                                    valueFlag: 1,
                                  };
                                  arr.push(obj1);
                                }
                                if (before === "table") {
                                  try {
                                    var obj4 = {
                                      name: "数据表",
                                      value: JSON.parse(after),
                                      flag: 2,
                                      valueFlag: 1,
                                    };
                                    arr.push(obj4);
                                  } catch (e) {
                                    var objH = {
                                      value: after,
                                      flagValue: 1,
                                    };
                                    arrList.push(objH);
                                  }
                                }
                                if (before === "fileUpload") {
                                  let token =
                                    "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                  // /AuditAnalysis/pythonTools/downLoadFile
                                  // /pythontools/pythonEditor/downLoadFile
                                  this.File(
                                    "/pythontools/pythonEditor/downLoadFile?url=" +
                                    after
                                  );
                                  // this.$emit("result", "false");
                                }
                              }
                              // if (item.indexOf(this.batchId) != -1) {
                              //   var obj0 = {
                              //     name: "执行结果",
                              //     value: item,
                              //     flag: 1,
                              //     valueFlag: 0,
                              //   };
                              //   arr.push(obj0);
                              // } else {
                              //   var redata;
                              //   if (item.slice(0, 1) == "{") {
                              //     redata = JSON.parse(item);
                              //     var obj1 = {
                              //       name: "执行结果",
                              //       value: redata,
                              //       flag: 2,
                              //       valueFlag: 1,
                              //     };
                              //     arr.push(obj1);
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 3,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //     } else {
                              //       redata = item;
                              //       var obj2 = {
                              //         name: "执行结果",
                              //         value: item,
                              //         flag: 1,
                              //         valueFlag: 2,
                              //       };
                              //       arr.push(obj2);
                              //     }
                              //   }
                              // }
                              // if (item.indexOf("cols") != -1) {
                              //   if (item.slice(0, 1) == "{") {
                              //     try {
                              //       var obj1 = {
                              //         name: "执行结果",
                              //         value: JSON.parse(item),
                              //         flag: 2,
                              //         valueFlag: 1,
                              //       };
                              //       arr.push(obj1);
                              //       return true;
                              //     } catch (e) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //       arrList.push(objH);
                              //       return false;
                              //     }
                              //   } else {
                              //     if (item.indexOf("data:image/png;base64") != -1) {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 1,
                              //       };
                              //     } else {
                              //       var objH = {
                              //         value: item,
                              //         flagValue: 0,
                              //       };
                              //     }
                              //     arrList.push(objH);
                              //   }
                              // } else {
                              //   if (item.indexOf("data:image/png;base64") != -1) {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 1,
                              //     };
                              //   } else {
                              //     var objH = {
                              //       value: item,
                              //       flagValue: 0,
                              //     };
                              //   }
                              //   arrList.push(objH);
                              // }
                            });
                            var objH = {
                              value: saveMessage,
                              flagValue: 0,
                            };
                            arrList.push(objH);
                            if (arrList.length > 0) {
                              var objL = {
                                name: "执行结果",
                                value: arrList,
                                flag: 1,
                                valueFlag: 2,
                              };
                              arr.push(objL);
                            }

                            this.$emit("result", arr);
                          } else {
                            // this.$emit("result", "false");
                          }
                          // arrs.forEach((item, index) => {
                          //   orderNumList[index];
                          //   var Aobj = {
                          //     name: "执行结果",
                          //     value: item,
                          //     flag: 2,
                          //     valueFlag: 1,
                          //   };
                          //   var inde = orderNumList[index] - 1;
                          //   // arr.splice(inde, 0, Aobj);
                          //   arr.push(Aobj);
                          // });
                          // this.$emit("result", arr);
                          if (executeFlag) {
                            this.implementDisabled = false;
                            return;
                          }
                          this.implementDisabled = false;
                          return false;
                        });
                      } else {
                        //没有要保存的文件
                        //删除临时文件
                        this.toDelTempFile();
                        //显示执行结果
                        if (re.result.length > 0) {
                          var arrList = [];
                          re.result.forEach((item) => {
                            var ind = item.indexOf("@");
                            var before = item.substring(0, ind);
                            var after = item.substring(ind + 1, item.length);
                            if (item.indexOf("icssError:") != -1) {
                              var objH = {
                                value: item,
                                flagValue: 0,
                              };
                              arrList.push(objH);
                              executeFlag = true;
                            } else {
                              if (before === "print") {
                                var objH = {
                                  value: after,
                                  flagValue: 1,
                                };
                                arrList.push(objH);
                              }
                              if (before === "picture") {
                                var obj1 = {
                                  name: "图表",
                                  value: after,
                                  flag: 3,
                                  valueFlag: 1,
                                };
                                arr.push(obj1);
                              }
                              if (before === "table") {
                                try {
                                  var obj4 = {
                                    name: "数据表",
                                    value: JSON.parse(after),
                                    flag: 2,
                                    valueFlag: 1,
                                  };
                                  arr.push(obj4);
                                } catch (e) {
                                  var objH = {
                                    value: after,
                                    flagValue: 1,
                                  };
                                  arrList.push(objH);
                                }
                              }
                              if (before === "fileUpload") {
                                let token =
                                  "&result=login&maxInerval=14400&LTPAToken=Y3MqOTQ4NTJjNjU1NzAzN2JhNjAxNTcwM2JiYzk4YTAwMDYqMTI4KlN0cmluZw==";
                                // /AuditAnalysis/pythonTools/downLoadFile
                                // /pythontools/pythonEditor/downLoadFile
                                this.File(
                                  "/pythontools/pythonEditor/downLoadFile?url=" +
                                  after
                                );
                                this.$emit("result", "false");
                              }
                            }
                            // if (item.indexOf(this.batchId) != -1) {
                            //   var obj0 = {
                            //     name: "执行结果",
                            //     value: item,
                            //     flag: 1,
                            //     valueFlag: 0,
                            //   };
                            //   arr.push(obj0);
                            // } else {
                            //   var redata;
                            //   if (item.slice(0, 1) == "{") {
                            //     redata = JSON.parse(item);
                            //     var obj1 = {
                            //       name: "执行结果",
                            //       value: redata,
                            //       flag: 2,
                            //       valueFlag: 1,
                            //     };
                            //     arr.push(obj1);
                            //   } else {
                            //     if (item.indexOf("data:image/png;base64") != -1) {
                            //       var obj1 = {
                            //         name: "执行结果",
                            //         value: item,
                            //         flag: 3,
                            //         valueFlag: 1,
                            //       };
                            //       arr.push(obj1);
                            //     } else {
                            //       redata = item;
                            //       var obj2 = {
                            //         name: "执行结果",
                            //         value: item,
                            //         flag: 1,
                            //         valueFlag: 2,
                            //       };
                            //       arr.push(obj2);
                            //     }
                            //   }
                            // }
                            // if (item.indexOf("cols") != -1) {
                            //   if (item.slice(0, 1) == "{") {
                            //     try {
                            //       var obj1 = {
                            //         name: "执行结果",
                            //         value: JSON.parse(item),
                            //         flag: 2,
                            //         valueFlag: 1,
                            //       };
                            //       arr.push(obj1);
                            //       return true;
                            //     } catch (e) {
                            //       var objH = {
                            //         value: item,
                            //         flagValue: 0,
                            //       };
                            //       arrList.push(objH);
                            //       return false;
                            //     }
                            //   } else {
                            //     if (item.indexOf("data:image/png;base64") != -1) {
                            //       var objH = {
                            //         value: item,
                            //         flagValue: 1,
                            //       };
                            //     } else {
                            //       var objH = {
                            //         value: item,
                            //         flagValue: 0,
                            //       };
                            //     }
                            //     arrList.push(objH);
                            //   }
                            // } else {
                            //   if (item.indexOf("data:image/png;base64") != -1) {
                            //     var objH = {
                            //       value: item,
                            //       flagValue: 1,
                            //     };
                            //   } else {
                            //     var objH = {
                            //       value: item,
                            //       flagValue: 0,
                            //     };
                            //   }
                            //   arrList.push(objH);
                            // }
                          });
                          if (arrList.length > 0) {
                            var objL = {
                              name: "执行结果",
                              value: arrList,
                              flag: 1,
                              valueFlag: 2,
                            };
                            arr.push(objL);
                          }
                          this.$emit("result", arr);
                        } else {
                          this.$emit("result", "false");
                        }
                        // arrs.forEach((item, index) => {
                        //   orderNumList[index];
                        //   var Aobj = {
                        //     name: "执行结果",
                        //     value: item,
                        //     flag: 2,
                        //     valueFlag: 1,
                        //   };
                        //   var inde = orderNumList[index] - 1;
                        //   // arr.splice(inde, 0, Aobj);
                        //   arr.push(Aobj);
                        // });
                        // this.$emit("result", arr);
                        /*if (executeFlag) {
                          this.implementDisabled = false;
                          return;
                        }*/
                        this.implementDisabled = false;
                        // return;//这个return也没用
                      }
                    } else {
                      this.toDelTempFile();
                      this.$emit("result", "false");
                      this.$message({
                        message: re.msg,
                      });
                    }
                  })
                  .catch(() => {
                    this.toDelTempFile();
                    this.$emit("result", "false");
                    this.$message({
                      message: "python执行失败",
                    });
                  });
              }
            } else {
              this.toDelTempFile();
              this.$emit("result", "false");
              this.$message({
                message: res.result,
              });
            }
          })
          .catch(() => {
            this.toDelTempFile();
            this.$emit("result", "false");
            this.$message({
              message: "python转换过程中出现错误，请检查",
              // message: "sql转换过程中出现错误，请检查",
            });
          });
        //取消禁用按钮
        this.implementDisabled = false;
      },
      // 打开
      openPython() {
        this.draft = true;
      },
      // 保存
      savePython() {
        if (this.pythonValue) {
          // var valueList = this.editorValue.split("\n");
          // var data = [];
          // valueList.forEach((item) => {
          //   if (item.indexOf("print") != -1) {
          //     var a = item;
          //     var b = a + "%}";
          //     // var b = a.replace(")", ")#}")
          //     var str = b.replace("print", "print{%");
          //     data.push(str);
          //   } else {
          //     data.push(item);
          //   }
          // });
          // data = data.join("\n");
          // this.arr = [];
          // var str = "";
          // var str1 = "";
          // // if (
          // //   data.indexOf("{@cursor@}") != -1 &&
          // //   data.indexOf("{@send_msg@}") != -1
          // // ) {
          // //   str = data.replace("{@cursor@}", this.funList[0].value);
          // //   str1 = str.replace("{@send_msg@}", this.funList[1].value);
          // // } else {
          // str1 = data;
          // // }
          // // if (str1.indexOf("{@cursor@}") != -1) {
          // //   str1 = str1.replace("{@cursor@}", this.funList[0].value);
          // // }
          // // if (str1.indexOf("{@send_msg@}") != -1) {
          // //   str1 = str1.replace("{@send_msg@}", this.funList[1].value);
          // // }
          this.ruleForm.pyDraftText = this.editorValue;
          draftUpdate(this.ruleForm).then((res) => {
            if (res.msg === "成功") {
              this.draftFlag = false;
              this.$message.success("操作成功");
              //操纵成功，修改当前使用python草稿
              this.pythonValue = res.data.pyDraftTitle;
              this.ruleForm.pyDraftTitle = res.data.pyDraftTitle;
              this.ruleForm.pyDraftText = res.data.pyDraftText;
              this.ruleForm.pyDraftUuid = res.data.pyDraftUuid;
              this.ruleForm.pyFolderUuid = res.data.pyFolderUuid;
            }
          });
        } else {
          let obj = {};
          selectTree(obj).then((res) => {
            this.sheetData = res.data;
            this.sheetData.forEach((m) => {
              this.idArr.push(m.id);
            });
          });
          this.draftFlag = true;
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
        var thisEle = $(".CodeMirror").css("font-size");
        var textFontSize = parseFloat(thisEle, 10);
        var unit = thisEle.slice(-2); //获取单位
        if (type === 1) {
          textFontSize += 2;
          $(".CodeMirror").css("font-size", textFontSize + unit);
        }
        if (type === 2) {
          textFontSize -= 2;
          $(".CodeMirror").css("font-size", textFontSize + unit);
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
