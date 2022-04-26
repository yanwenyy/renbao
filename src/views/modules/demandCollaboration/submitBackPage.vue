<template>
  <div>
    <el-dialog
      @close="deletCm"
      custom-class="rule-dialog"
      width="80%"
      title="需求规则退回"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        class="infoForm"
        :model="dataForm"
        ref="dataForm"
        label-width="80px"
      >
        <el-form-item>
          <div>项目成员信息：</div>
          <!--<el-button type="primary" @click="addMemberVisable=true">项目成员信息维护</el-button>-->
          <!--<el-button type="primary" @click="addTabel(xmcywhTabel,{name:''})">添加行</el-button>-->
          <el-table
            class="table-list"
            border
            :data="dataForm.xmProjectRoleUsers"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="roleName" label="角色" align="center">
              <template slot-scope="scope">
                <el-select
                  class="roleList"
                  v-model="scope.row.roleIds"
                  placeholder="请选择"
                  @change="getRoleResult"
                  style="width:100%"
                >
                  <el-option
                    v-for="(item, index) in roleList"
                    :key="index"
                    :label="item.roleName"
                    :value="item.roleNumber"
                  >
                    <span style="float: left"
                      >{{ item.roleName }}({{ item.roleNumber }})</span
                    >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="人员" align="center">
              <template slot-scope="scope">
                <el-select
                  class="userList"
                  v-model="scope.row.userIds"
                  placeholder="请选择"
                  @change="getMemberList"
                >
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId"
                  >
                    <span style="float: left"
                      >{{ item.userName }}({{ item.userNumber }})</span
                    >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="意见" prop="opinion">
          <el-input type="textarea" v-model="dataForm.opinion"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="(visible = false), clearMsg()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SubmitBack",
  props: {
    backNode: "",
    // demandCollaborationId: "",
    //roleId: "",
    flowNode: "",
    currentNode: "",
    demandCollaborationIds: {
      type: Array,
      default: false,
    },
    //userIds: "",
    roleIds: "",
    projectId: "",
    //demandCollaborationId: "",
  },
  data() {
    var validateInteger = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else if (!isInteger(value)) {
        callback(new Error("格式不正确"));
      } else {
        callback();
      }
    };
    var validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空"));
      } else if (
        !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
          value
        )
      ) {
        callback(new Error("金额格式不正确"));
      } else {
        callback();
      }
    };
    return {
      multipleTable: [],
      submitBack: {},
      userId: sessionStorage.getItem("userId"), //当前用户id
      meberList: [], //小组人员列表
      userList: [], //人员列表
      roleList: [], //角色列表
      groupMemberForm: {}, //添加小组成员表单
      addMemberForm: {}, //添加项目成员表单
      memberListVisible: false, //成员列表状态
      addGroupMemberVisable: false, //添加小组成员状态
      addMemberVisable: false, //添加项目成员状态
      xzTabel: [], //小组信息列表
      xmcywhTabel: [], //项目成员信息列表
      xmcywhTabelSel: [], //项目成员选择列表
      xmcbTabel: [], //项目成本列表
      visible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      dataFormCopy: {
        project: {},
        projectCosts: [],
        xmProjectGroupUsers: [],
        xmProjectRoleUsers: [],
      },
      dataForm: {
        project: {
          projectId: 0,
          projectCode: "",
          projectName: "",
          dataTime: [],
          auditedUnit: "",
          projectRemark: "",
          projectPeriodBegin: "",
          projectPeriodEnd: "",
        },
        opinion: "",
        projectCosts: [],
        xmProjectGroupUsers: [],
        xmProjectRoleUsers: [{ roleName: "" }],
      },
      dataRule: {
        dataAmount: [
          { required: true, validator: validateInteger, trigger: "blur" },
        ],
        effectiveData: [
          { required: true, validator: validateInteger, trigger: "blur" },
        ],
        moneyValid: [
          { required: true, validator: validateMoney, trigger: "blur" },
        ],
      },
      projectData: {}, // 记录当前数据
    };
  },
  methods: {
    deletCm() {},
    init(id) {
      // this.clearMsg();
      //this.dataForm.project.projectId = id||0;
      this.demandCollaborationId = id;
      this.visible = true;
      this.getRoleList(id);
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        // if (this.dataForm.project.projectId) {
        //   this.$http({
        //     url: this.$http.adornUrl(
        //       `/xmProject/selectDetailsByProjectId/${this.dataForm.project.projectId}`
        //     ),
        //     method: "get",
        //     params: this.$http.adornParams(),
        //   }).then(({ data }) => {
        //     if (data && data.code === 200) {
        //       var datas = data.result;
        //       this.projectData = datas;
        //       this.dataForm.project.projectId = datas.project.projectId;
        //       this.dataForm.project.projectCode = datas.project.projectCode;
        //       this.dataForm.project.projectName = datas.project.projectName;
        //       this.dataForm.project.auditedUnit = datas.project.auditedUnit;
        //       this.dataForm.project.projectRemark = datas.project.projectRemark;
        //       this.dataForm.project.projectPeriodBegin =
        //         datas.project.projectPeriodBegin;
        //       this.dataForm.project.projectPeriodEnd =
        //         datas.project.projectPeriodEnd;
        //       // this.dataForm.project.dataTime[0]=datas.project.projectPeriodBegin||'';
        //       // this.dataForm.project.dataTime[1]=datas.project.projectPeriodEnd||'';
        //       // this.$set(this.dataForm.project.dataTime,this.dataForm.project.dataTime);
        //       // console.log(this.dataForm.project.dataTime)
        //       this.dataForm.projectCosts = datas.projectCosts;
        //       this.dataForm.xmProjectRoleUsers.forEach((item) => {
        //         datas.xmProjectRoleUsers.forEach((vtem) => {
        //           if (vtem.roleId == item.roleId) {
        //             item.userIds = vtem.userIdss.split(",");
        //             this.getMemberList(item.userIds);
        //           }
        //         });
        //       });
        //       this.dataForm.xmProjectGroupUsers.forEach((item) => {
        //         datas.xmProjectGroupUsers.forEach((vtem) => {
        //           if (vtem.groupId == item.groupId) {
        //             item.leaderIds = vtem.leaderIdss
        //               ? vtem.leaderIdss.split(",")
        //               : "";
        //             item.memberIds = vtem.memberIdss
        //               ? vtem.memberIdss.split(",")
        //               : [];
        //           }
        //         });
        //       });
        //       this.dataFormCopy = JSON.parse(JSON.stringify(this.dataForm));
        //     }
        //   });
        // }
      });
    },
    clearMsg() {
      this.dataForm = {
        project: {
          projectId: 0,
          projectCode: "",
          projectName: "",
          dataTime: [],
          auditedUnit: "",
          projectRemark: "",
          projectPeriodBegin: "",
          projectPeriodEnd: "",
        },
        opinion: "",
        projectCosts: [],
        xmProjectGroupUsers: [],
        xmProjectRoleUsers: [],
      };
      this.dataFormCopy = {
        project: {},
        projectCosts: [],
        xmProjectGroupUsers: [],
        xmProjectRoleUsers: [],
      };
    },

    //获取角色结果
    getRoleResult(id) {
      this.roleId = id;
      if (id) {
        this.$http({
          url: this.$http.adornUrl("/demandCollaboration/selectProjectRole"),
          method: "get",
          params: this.$http.adornParams({
            // pageNo: 1,
            // pageSize: 1000,
            projectId: this.projectId,
            roleId: this.roleId,
          }),
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.userList = data.result;
          } else {
            this.userList = [];
          }
        });
      }
    },

    //获取小组成员列表
    getMemberList(id) {
      if (id) {
        var _list = this.filterMemberList();
        this.meberList = this.userList.filter((item) => {
          return _list.includes(item.userId);
        });
        this.$set(this.meberList, this.meberList);
      }
    },
    filterMemberList() {
      var list = [];
      this.dataForm.xmProjectRoleUsers.forEach((item) => {
        list = this.MergeArray(list, item.userIds);
        this.userIds = item.userIds;
      });

      return list;
    },
    MergeArray(arr1, arr2) {
      var _arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i] == arr1[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          _arr.push(arr2[i]);
        }
      }
      return _arr;
    },
    //获取角色和人员和小组列表
    getRoleList(projectId) {
      this.$http({
        url: this.$http.adornUrl("/demandCollaboration/selectSubmitBackRole"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: 1,
          pageSize: 10000,
          demandCollaborationId: this.demandCollaborationId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.roleList = data.result;
        } else {
          this.roleList = [];
        }
      });
    },
    //获取成员列表
    getDataList(data) {
      this.memberListVisible = false;
      console.log(data);
    },
    //项目成员维护选择事件
    // selectionChangeHandle(val){
    //   this.xmcywhTabelSel = val
    // },

    // 表单提交
    dataFormSubmit() {
      let fd = new FormData();
      this.loading = true;
      fd.append("demandCollaborationId", this.demandCollaborationId);
      fd.append("backNode", this.roleId);
      fd.append("opinion", this.dataForm.opinion);
      fd.append("userIds", this.userIds);

      this.$http({
        url: this.$http.adornUrl(`/demandCollaboration/submitBackDemand`),
        method: "post",
        //data: this.$http.adornData(this.demandCollaborationIds, false)
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: fd,
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.visible = false;
              this.$store.dispatch("common/changeProjectList", this.userId);
              this.$emit("refreshDataList");
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
>>> .el-form-item__label {
  width: 120px !important;
}
>>> .el-input {
  width: 90%;
}
.table-list {
  width: 100%;
  margin-top: 10px;
}
.table-btn {
  margin-left: 20px;
}
.input-hasBtn {
  width: 70%;
}
.tabelForm >>> .el-form-item__error {
  top: 22%;
  left: 40%;
  text-align: right;
  padding-right: 15%;
  display: inline-block;
  width: auto;
}
.userList {
  width: 80%;
}
.userList >>> .el-input {
  width: 100%;
  box-sizing: border-box;
}
.time-two {
  width: 44% !important;
  display: inline-block;
}
.time-two .el-input {
  width: 100% !important;
}
.time-two-nolabel {
  margin-left: 0 !important;
}
>>> .imitate-red > .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>