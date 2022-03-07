<template>
  <div class="box-mirror">
    <div class="code-mirror-tree" v-if="!fullScreen">
      <div class="tree-left">
        <div class="tree-left-one" @click="changeTree('数据表')">数据表</div>
        <div class="tree-left-two" @click="changeTree('函数表')">函数表</div>
      </div>
      <div class="tree-right">
        <div class="custom-tree-container">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
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

      </div>
    </div>
    <div class="code-mirror-div">
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
        :getwsData="getwsData"
        :tableData="tableData"
        ref="cmEditor"
        :cmTheme="cmTheme"
        :cmMode="cmMode"
        :treeLable="treeLable"
        :autoFormatJson="autoFormatJson"
        :jsonIndentation="jsonIndentation"
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
      changeTree: {
        type: Function,
        default: null,
      },
      getLoadTree: {
        type: Function,
        default: null,
      },
      getwsData: {
        type: Function,
        default: null,
      },
      treedata: {
        type: Array,
        default: null,
      },
      loadTree: {
        type: Array,
        default: null,
      },
      tableData: {
        type: Array,
        default: null,
      },
    },
    data() {
      return {
        fullScreen:false,
        filterText: '',
        treeLable:'',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
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
       console.log(newValue, oldValue)
      },
      loadTree: function (newValue, oldValue) {
       console.log(newValue, oldValue)
      },
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.treedata);
        }
        // if (node.level > 1) return resolve([]);
        if(node.data.children){
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
        return draggingNode.data.isLeaf;
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
        console.log(draggingNode, dropNode, dropType, ev);

        if (draggingNode.childNodes.length == 0 ) {
          this.treeLable = draggingNode.data.label;
        }
        if (
          draggingNode.data.type === "view" ||
          draggingNode.data.type === "table" ||
          draggingNode.data.type === "datasource" ||
          draggingNode.data.type === "zero"
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
  .box-mirror{
    display: flex;
  }
.code-mirror-tree{
  width: 30%;
  display: inline-block;
}
  .code-mirror-div{
    width: 70%;
    display: inline-block;
  }
  .code-mirror-tree>div{
    display: inline-block;
    vertical-align: top;
  }
  .tree-left{
    margin-top: 20%;
    width: 9%;
    white-space: pre-wrap;
    cursor: pointer;
    border: 1px solid #000;
    text-align: center;
    height: 40%;
  }

  .tree-left>div{
    vertical-align: middle;
    height: 50%;
    display: inline-block;
    padding-top: 35%;
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
</style>
