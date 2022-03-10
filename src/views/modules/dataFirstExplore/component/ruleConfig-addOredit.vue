<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px" :rules="rules">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则类别" prop="ruleCategory">
        <el-select
          v-model="dataForm.ruleCategory"
          filterable
          clearable
          placeholder="规则类别"
          size="small"
        >
          <el-option
            v-for="(item, index) in ruleCategory"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择分类" prop="folderId">
        <el-select
          v-model="dataForm.folderName"
          placeholder="请选择"
          multiple
          collapse-tags
        >
          <el-option :value="dataForm.folderName" style="height: auto">
            <el-tree
              :data="treeData"
              default-expand-all
              show-checkbox
              check-strictly
              ref="treeSelect"
              highlight-current
              :props="layoutTreeProps"
              node-key="folderId"
              @check-change="handleCheckChange"
              @node-click="handleNodeChange"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createUserName">
        <el-input
          disabled
          v-model="dataForm.createUserName"
          placeholder="创建人"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="sql语句" prop="sql">
        <el-input v-model="dataForm.sql" placeholder="备注"></el-input>
      </el-form-item> -->
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          disabled
          v-model="dataForm.createTime"
          placeholder="创建时间"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submit('dataForm')">保存</el-button>
    <el-button @click="close">关闭</el-button>
  </div>
</template>
<script>
import { getDate } from "@/utils";
export default {
  props: {
    ruleId: { type: String },
    getData: {
      type: Object
    }
  },
  name: "detail",
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleCategory: "",
        folderName: "",
        createUserName: "",
        // sql: "",
        createTime: ""
      },
      //必填项校验
      rules: {
        ruleName: [{ required: true, message: "请输入", trigger: "blur" }],
        ruleCategory: [{ required: true, message: "请选择", trigger: "blur" }],
        folderName: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      treeData: [],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__ || data;
          return config.label || config.folderName;
        }
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      folderName: [],
      timer: "", //定义一个定时器的变量
      currentTime: new Date() // 获取当前时间
    };
  },
  computed: {
    username: {
      get() {
        return this.$store.state.user.name;
      }
    }
  },
  created() {
    if (this.ruleId != null && this.ruleId != "" && this.ruleId != undefined) {
      this.init();
    } else {
      this.dataForm.createTime = getDate(); // 回显创建时间
      this.dataForm.createUserName = this.username; // 回显创建人
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    // 获取数据
    init() {
      this.$http({
        url: this.$http.adornUrl(`/rule/selectByUuid/${this.ruleId}`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          batchType: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var rule = data.result;
          this.dataForm.ruleName = rule.ruleName;
          this.dataForm.ruleCategory = rule.ruleCategory;
          this.dataForm.createUserName = rule.createUserName;
          this.dataForm.sql = rule.sql;
          this.dataForm.createTime = rule.createTime;
          // 递归获取对应的规则对象
          let getTreeData = this.getTreeData(
            treeData,
            this.checkedData[0].folderId
          );
          // 回显规则名称
          if (getTreeData.length > 0) {
            this.dataForm.folderName = [getTreeData[0].folderName];
            this.dataForm.folderPath = this.getParentByData(
              treeData,
              getTreeData[0].folderId
            );
            this.$nextTick(() => {
              this.$refs.treeSelect.setCheckedNodes(getTreeData);
            });
          }
        }
      });
    },
    //保存
    submit(data) {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/rule/${!this.ruleId ? "add" : "updateByUuId"}`
            ),
            method: "post",
            data: this.$http.adornData(
              {
                ruleId: this.ruleId || undefined,
                ruleName: this.dataForm.ruleName,
                ruleCategory: this.dataForm.ruleCategory,
                folderId: this.dataForm.folderId,
                folderName: this.dataForm.folderName,
                createUserName: this.dataForm.createUserName,
                createTime: this.dataForm.createTime
              },
              false
            )
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.$emit("ok");
                }
              });
            } else {
              this.$message.error("操作失败");
            }
          });
        }
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    },
    // 获取规则树
    getRuleFolder(callBack) {
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleFolder/getRuleFolder"),
        method: "get"
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.treeData = data.result;
            callBack(this.treeData);
          }
        })
        .catch(() => {});
    },
    getTreeData(treeData, folderId) {
      const getTreeDataItem = [];
      const traverse = function(treeData, folderId) {
        treeData.map(i => {
          if (i.folderId == folderId) {
            getTreeDataItem.push(i);
          }
          if (i.children) {
            traverse(i.children, folderId);
          }
        });
      };
      traverse(treeData, folderId);
      return getTreeDataItem;
    },
    getParentByNode(node) {
      const checkedNodes = [];
      const traverse = function(node) {
        if (node.parent.data.folderId) {
          checkedNodes.push(node.parent.data.folderId);
          traverse(node.parent);
        }
      };
      traverse(node);
      return checkedNodes.join("/");
    },
    getParentByData(ruleTreeData1, folderId) {
      var temp = [];
      var forFn = function(ruleTreeData, folderId) {
        for (var i = 0; i < ruleTreeData.length; i++) {
          var item = ruleTreeData[i];
          if (item.folderId === folderId) {
            temp.push(item.folderId);
            forFn(ruleTreeData1, item.folderParentId);
            break;
          } else {
            if (item.children) {
              forFn(item.children, folderId);
            }
          }
        }
      };
      forFn(ruleTreeData1, folderId);
      temp.remove(folderId);
      return temp.join("/");
    },
    handleNodeChange(data, node, selt) {
      this.$refs.treeSelect.setCheckedNodes([data]);
      this.dataForm.folderName = [data.folderName];
      this.dataForm.folderId = data.folderId;
      this.dataForm.folderPath = this.getParentByNode(node);
    },
    handleCheckChange(data, checked, node) {
      let res = this.$refs.treeSelect.getCheckedNodes(false, true); //true，1. 是否只是叶子节点 2.选择的时候不包含父节点）
      if (checked) {
        this.$refs.treeSelect.setCheckedNodes([data]);
      }
      let arrLabel = [];
      res.forEach(item => {
        if (arrLabel.length === 0) {
          arrLabel.push(item);
        } else {
          arrLabel.length === 0;
        }
      });

      if (arrLabel.length > 0) {
        this.dataForm.folderName = [arrLabel[0].folderName];
        this.dataForm.folderId = arrLabel[0].folderId;
        this.dataForm.folderPath = this.getParentByData(
          this.treeData,
          data.folderId
        );
      } else {
        this.dataForm.folderName = [];
        this.dataForm.folderId = "";
        this.dataForm.folderPath = "";
      }
    }
  }
};
</script>
