<template>
  <div class="detail-box">
    <el-dialog
      ref="ImportFileDialog"
      title="导入数据"
      class="import-file-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      @open="IPInt"
    >
      <div class="import-file">
        <div class="import-file-left">
          <el-tree
            class="rule-tree"
            :data="ruleData"
            :props="menuListTreeProps"
            node-key="folderId"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expanded-keys="defaultshowKeys"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">

                <span class="tree-label">
                    <span class="folder-icon" :title="node.label"></span>
                    <span :title="node.label" class="cut-width custom-tree-label"> {{node.label}}</span>
                </span>
            </span>
          </el-tree>
          <!--<ruleTree-->
            <!--ref="ruleTree"-->
            <!--:isShowSearch="false"-->
            <!--:isParent="false"-->
            <!--:isShowCheckBox="false"-->
            <!--:isShowEdit="false"-->
            <!--v-on:getTreeId="getTreeData"-->
          <!--&gt;</ruleTree>-->
        </div>
        <el-form
          size="small"
          ref="ruleExportForm"
          :model="ruleExportForm"
          :rules="ruleExportFormRules"
          label-width="90px"
          style="text-align: left"
          class="rule-form-inline"
        >
          <el-form-item label="导入文件" prop="ruleFile" class="upload-box">
            <el-upload
              ref="ruleFileUpload"
              action="#"
              class="upload-demo"
              :on-remove="handleRemove"
              :http-request="uploadData"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传导出的文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit('ruleExportForm')"
          size="small"
          >确 定</el-button
        >
        <el-button @click="cancel" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ruleTree from "../../common/rule-tree.vue";
export default {
  // props: ["getData"],
  props: {
    ruleData: {
      default: []
    },
    ruleCheckData: {
      type:Object,
      default:null
    },
    getData: {
      default: null
    },
  },
  data() {
    return {
      dataForm: {
        multipartFiles :[],
      },
      loading: false,
      dialogVisible: false,
      //文件上传成功状态
      fileUploadStatus: "",
      ruleExportForm: {},
      // ruleCheckData:{},
      // ruleData:[],
      defaultshowKeys:[],
      menuListTreeProps: {
        label: "folderName",
        children: "children"
      },
      ruleExportFormRules: {},
      fileList: [],
      rule: {
        folderId: "",
        folderPath: "",
        folderName: ""
      } // 右侧树选择参数
    };
  },
  methods: {
    //默认打开页面
    showDialog(ruleCheckData,ruleData) {
      this.dialogVisible = true;
      this.resetForm();
    },
    IPInt(){
      this.$nextTick(()=>{
        this.menuListTreeSetCurrentNode();
      })
    },
    // 规则树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.rule.folderId = data.folderId;
      this.rule.parentName = data.folderName;
      this.rule.folderPath = data.folderPath;
      this.ruleCheckData = data;
    },
    // 规则树设置当前选中节点
    menuListTreeSetCurrentNode() {
      if (this.ruleCheckData.folderId) {
        this.rule.folderId = this.ruleCheckData.folderId;
        this.rule.parentName = this.ruleCheckData.folderName;
        this.rule.folderPath = this.ruleCheckData.folderPath;
        if (this.$refs.menuListTree){
          this.defaultshowKeys=[this.ruleCheckData.folderId];
          this.$refs.menuListTree.setCurrentKey(this.ruleCheckData.folderId);
        }
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
    },
    onSubmit(formName) {
      // this.uploadData()
      if (this.rule.folderId == "") {
        return this.$message({
          message: "请选择对应的规则分类！",
          type: "warning"
        });
      }
      if (this.fileList.length == 0) {
        return this.$message({ message: "请选择上传文件！", type: "warning" });
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$refs.ruleFileUpload.submit();
          let fd = new FormData();
          this.loading = true;
          this.dataForm.multipartFiles.forEach(item=>{
            fd.append("ruleFile", item);
          });
          fd.append("folderId", this.rule.folderId);
          fd.append("folderPath", this.rule.folderPath);
          this.$http({
            method: "post",
            isLoading: false,
            url: this.$http.adornUrl("rule/ruleImport"),
            headers: {
              "Content-Type": "multipart/form-data"
            },
            data: fd
          }).then(res => {
            this.loading = false;
            if (res.data.code == 200) {
              this.$message.success("导入成功");
              this.$parent.getDataList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    // 上传文件
    uploadData(file) {
      this.dataForm.multipartFiles=[file.file];
      this.fileList=[file.file];

    },
    cancel() {
      this.dialogVisible = false;
      this.resetForm();
    },
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs["ruleExportForm"]) {
          this.$refs["ruleExportForm"].resetFields();
        }
        this.fileList = [];
        // 初始化左侧树
        this.rule.folderId = "";
        this.rule.folderPath = "";
        this.rule.folderName = "";
      });
    },
    //文件上传成功时的钩子
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.fileUploadStatus = "success";
      } else {
        this.fileUploadStatus = "error";
      }
    },

    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [];
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange(file) {
      this.fileList.push(file);
    },
    getTreeData(data, node) {
      this.rule.folderId = (data.folderId && data.folderId) || "";
      this.rule.folderPath = (data.folderPath && data.folderPath) || "";
      this.rule.folderName = data.folderName;
    }
  },
  components: {
    ruleTree
  },
  watch: {
    dialogVisible(nval, oval) {
      if (nval) {
      }
    }
  }
};
</script>

<style scoped lang="scss">
.detail-box {
  .import-file-dialog {
    // max-height: 500px;
  }
  .import-file {
    height: 50vh;
    overflow: auto;
    display: flex;
  }
  .import-file-left {
    // width: 50%;
    width: 300px;
  }
  .rule-form-inline {
    flex: 1;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  .upload-box {
    max-width: 400px;
  }
  /deep/ .el-upload-list__item {
    margin-top: 0;
  }
  .el-upload__tip{
    color:red;
  }
  .folder-icon {
    background: url(../../../assets/img/folder.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    width: 13px;
    height: 16px;
  }
}
</style>
