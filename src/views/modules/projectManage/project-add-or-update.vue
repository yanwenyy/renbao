<template>
  <div>
    <el-dialog
      width="70%"
      :title="!dataForm.project.projectId ? '新增' : type=='look'?'查看':'修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="80px">
        <el-form-item label="项目编号">
          <!--<el-input @blur="verification(dataForm.project.projectCode,'项目编号不能重复','projectCode')" v-model="dataForm.project.projectCode" placeholder="项目编号"></el-input>-->
          <el-input disabled v-model="dataForm.project.projectCode" placeholder="自动生成"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="project.projectName">
          <el-input :disabled="type=='look'" @blur="verification(dataForm.project.projectName,'项目名称不能重复','projectName')"
                    v-model.trim="dataForm.project.projectName" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目周期" class="imitate-red">
          <!--<el-date-picker-->
          <!--v-model="dataForm.project.dataTime"-->
          <!--type="daterange"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--range-separator="-"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期">-->
          <!--</el-date-picker>-->
          <el-form-item class="time-two" prop="project.projectPeriodBegin">
            <el-date-picker
              :disabled="type=='look'"
              :picker-options="pickerOptionsStart"
              v-model="dataForm.project.projectPeriodBegin"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <span>--</span>
          <el-form-item class="time-two time-two-nolabel" prop="project.projectPeriodEnd">
            <el-date-picker
              :disabled="type=='look'"
              :picker-options="pickerOptionsEnd"
              v-model="dataForm.project.projectPeriodEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="委托单位" prop="project.auditedUnit">
          <el-input :disabled="type=='look'" v-model="dataForm.project.auditedUnit" placeholder="委托单位"></el-input>
        </el-form-item>
        <el-form-item label="项目成本">
          <el-button v-if="type!='look'" type="primary"
                     @click="addTabel(dataForm.projectCosts,{projectItem:'',costMoney:'',costRemark:''})">添加行
          </el-button>
          <el-table
            class="table-list"
            border
            :data="dataForm.projectCosts"
            stripe
            style="width: 100%">
            <el-table-column
              v-if="type!='look'"
              width="50">
              <template slot-scope="scope">
                <i class="el-icon-remove" @click="removeRow(dataForm.projectCosts,scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="成本事项"
            >
              <template slot-scope="scope">
                <el-form-item class="tabelForm" :prop="'projectCosts.' + scope.$index + '.projectItem'" :rules="{
      required: true, message: '成本事项不能为空', trigger: 'blur'
    }">
                  <!--@input="scope.row.contractAmount=getMoney(scope.row.contractAmount)"-->
                  <el-input :disabled="type=='look'" v-model="scope.row.projectItem" placeholder="成本事项"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="成本金额（元/天）"
            >
              <template slot-scope="scope">
                <el-form-item class="tabelForm" :prop="'projectCosts.' + scope.$index + '.costMoney'"
                              :rules='dataRule.moneyValid'>
                  <!--@input="scope.row.contractAmount=getMoney(scope.row.contractAmount)"-->
                  <el-input :disabled="type=='look'" v-model="scope.row.costMoney	"
                            @input="formatValue(scope.row.costMoney	,scope.$index,dataForm.projectCosts,'costMoney')"
                            placeholder="成本金额"></el-input>
                </el-form-item>

              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="备注"
            >
              <template slot-scope="scope">
                <el-input :disabled="type=='look'" v-model="scope.row.costRemark" placeholder="备注"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div>项目成员信息：</div>
          <!--<el-button type="primary" @click="addMemberVisable=true">项目成员信息维护</el-button>-->
          <!--<el-button type="primary" @click="addTabel(xmcywhTabel,{name:''})">添加行</el-button>-->
          <el-table
            class="table-list"
            border
            :data="dataForm.xmProjectRoleUsers"
            @selection-change="selectionChangeHandle"
            stripe
            style="width: 100%">
            <!--<el-table-column-->
            <!--type="selection"-->
            <!--header-align="center"-->
            <!--align="center"-->
            <!--width="50">-->
            <!--</el-table-column>-->
            <el-table-column
              prop="roleName"
              label="角色"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="人员"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item class="tabelForm" :prop="'xmProjectRoleUsers.' + scope.$index + '.userIds'" :rules="scope.row.roleName.indexOf('组长')!=-1?{
      required: true, message: '组长不能为空', trigger: 'blur'
    }:null">
                  <el-select
                    :disabled="type=='look'"
                    filterable
                    class="userList"
                    multiple
                    v-model="scope.row.userIds"
                    placeholder="请选择"
                    @change="getMemberList">
                    <el-option
                      v-for="(item,index) in userList"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId">
                      <span style="float: left">{{ item.userName }}({{item.userLoginName}})</span>
                    </el-option>
                  </el-select>
                </el-form-item>

              </template>

            </el-table-column>
            <!--<el-table-column-->
            <!--fixed="right"-->
            <!--header-align="center"-->
            <!--align="center"-->
            <!--width="100"-->
            <!--label="操作">-->
            <!--<template slot-scope="scope">-->
            <!--<el-button type="text" size="small"  @click="removeRow(xmcywhTabel,scope.$index)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<div>小组维护：</div>-->
        <!--<el-table-->
        <!--class="table-list"-->
        <!--border-->
        <!--:data="dataForm.xmProjectGroupUsers"-->
        <!--stripe-->
        <!--style="width: 100%">-->
        <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
        <!--&lt;!&ndash;type="selection"&ndash;&gt;-->
        <!--&lt;!&ndash;header-align="center"&ndash;&gt;-->
        <!--&lt;!&ndash;align="center"&ndash;&gt;-->
        <!--&lt;!&ndash;width="50">&ndash;&gt;-->
        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
        <!--<el-table-column-->
        <!--prop="groupName"-->
        <!--label="小组名称"-->
        <!--align="center"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--{{scope.row.groupName}}-->
        <!--&lt;!&ndash;<el-button class="table-btn" type="text" size="small" @click="addGroupMemberVisable=true">维护</el-button>&ndash;&gt;-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="name"-->
        <!--label="小组组长"-->
        <!--align="center"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-select class="userList" multiple v-model="scope.row.leaderIds" placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="(item,index) in meberList"-->
        <!--:key="index"-->
        <!--:label="item.userName"-->
        <!--:value="item.userId">-->
        <!--<span style="float: left">{{ item.userName }}({{item.userNumber}})</span>-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="name"-->
        <!--label="小组人员"-->
        <!--align="center"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-select class="userList" multiple v-model="scope.row.memberIds" placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="(item,index) in meberList"-->
        <!--:key="index"-->
        <!--:label="item.userName"-->
        <!--:value="item.userId">-->
        <!--<span style="float: left">{{ item.userName }}({{item.userNumber}})</span>-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
        <!--&lt;!&ndash;fixed="right"&ndash;&gt;-->
        <!--&lt;!&ndash;header-align="center"&ndash;&gt;-->
        <!--&lt;!&ndash;align="center"&ndash;&gt;-->
        <!--&lt;!&ndash;width="100"&ndash;&gt;-->
        <!--&lt;!&ndash;label="操作">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="text" size="small" @click="">删除</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
        <!--</el-table>-->
        <!--</el-form-item>-->
        <el-form-item label="备注">
          <el-input  :disabled="type=='look'" maxlength="2000" type="textarea"
                    :rows="4" v-model="dataForm.project.projectRemark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,clearMsg()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="type!='look'">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="添加成员" :visible.sync="addMemberVisable">
      <el-form :model="addMemberForm" :rules="dataRule" ref="addMemberForm" label-width="80px">
        <el-form-item label="成员角色">
          <el-select v-model="addMemberForm.cy" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择人员">
          <el-input class="input-hasBtn" v-model="addMemberForm.dataAmount" placeholder="选择人员"></el-input>
          <el-button type="primary" @click="memberListVisible=true">选择</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberVisable = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加小组成员" :visible.sync="addGroupMemberVisable">
      <el-form :model="groupMemberForm" :rules="dataRule" ref="groupMemberForm" label-width="80px">
        <el-form-item label="小组名称">
          <el-input v-model="groupMemberForm.dataAmount" placeholder="小组名称"></el-input>
        </el-form-item>
        <el-form-item label="小组组长">
          <el-select v-model="groupMemberForm.cy" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小组成员">
          <el-select v-model="groupMemberForm.cy" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupMemberVisable = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <member-list v-if="memberListVisible" ref="memberList" @refreshDataList="getDataList"></member-list>
  </div>
</template>

<script>
  import MemberList from './memberList'
  import {isInteger} from '@/utils/validate'

  export default {
    components: {
      MemberList
    },
    data() {
      var validateInteger = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'))
        } else if (!isInteger(value)) {
          callback(new Error('格式不正确'))
        } else {
          callback()
        }
      };
      var validateMoney = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      };
      return {
        type: 'add',
        // 开始日期 :picker-options 中引用
        pickerOptionsStart: {
          disabledDate: time => {
            // 获取结束日期的 v-model 值并赋值给新定义的对象
            let endDateVal = this.dataForm.project.projectPeriodEnd;
            if (endDateVal) {
              // 比较 距 1970 年 1 月 1 日之间的毫秒数：
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        // 结束日期 :picker-options 中引用
        pickerOptionsEnd: {
          disabledDate: time => {
            // 获取开始日期的 v-model 值并赋值给新定义的对象
            let beginDateVal = this.dataForm.project.projectPeriodBegin;
            if (beginDateVal) {
              // 比较 距 1970 年 1 月 1 日之间的毫秒数：
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        userId: sessionStorage.getItem("userId"),//当前用户id
        meberList: [],//小组人员列表
        userList: [],//人员列表
        groupMemberForm: {},//添加小组成员表单
        addMemberForm: {},//添加项目成员表单
        memberListVisible: false,//成员列表状态
        addGroupMemberVisable: false,//添加小组成员状态
        addMemberVisable: false,//添加项目成员状态
        xzTabel: [],//小组信息列表
        xmcywhTabel: [],//项目成员信息列表
        xmcywhTabelSel: [],//项目成员选择列表
        xmcbTabel: [],//项目成本列表
        visible: false,
        roleList: [],
        dialogImageUrl: '',
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
            projectCode: '',
            projectName: '',
            dataTime: [],
            auditedUnit: '',
            projectRemark: '',
            projectPeriodBegin: '',
            projectPeriodEnd: '',
          },
          projectCosts: [],
          xmProjectGroupUsers: [],
          xmProjectRoleUsers: [],
        },
        dataRule: {
          'project.projectCode': [
            {required: true, message: '项目编号不能为空', trigger: 'blur'}
          ],
          'project.projectName': [
            {required: true, message: '项目名称不能为空', trigger: 'blur'}
          ],
          "project.dataTime": [
            {required: true, message: '项目周期不能为空', trigger: 'blur'}
          ],
          "project.projectPeriodBegin": [
            {required: true, message: '项目周期开始时间不能为空', trigger: 'change'}
          ],
          "project.projectPeriodEnd": [
            {required: true, message: '项目周期结束时间不能为空', trigger: 'change'}
          ],
          "project.auditedUnit": [
            {required: true, message: '委托单位不能为空', trigger: 'blur'}
          ],
          dataAmount: [
            {required: true, validator: validateInteger, trigger: 'blur'}
          ],
          effectiveData: [
            {required: true, validator: validateInteger, trigger: 'blur'}
          ],
          moneyValid: [
            {required: true, validator: validateMoney, trigger: 'blur'}
          ],
        },
        projectData: {}, // 记录当前数据
      }
    },
    methods: {
      //验证唯一性
      verification(val, msg, name) {
        var params = {};
        params[name] = val;
        if (val && val != this.dataFormCopy.project[name]) {
          this.$http({
            url: this.$http.adornUrl("/xmProject/selectRepeat"),
            method: "get",
            isLoading: false,
            params: this.$http.adornParams(params)
            // params: this.$http.adornParams({
            //   projectCode: name == 'projectCode' && val || this.dataForm.project.projectCode,
            //   projectName:   name == 'projectName' && val || this.dataForm.project.projectName ,
            // })
          }).then(({data}) => {
            if (data && data.code === 200) {
              if (data.result === false) {
                this.$message.error(msg);
                this.$forceUpdate();
                this.dataForm.project[name] = '';
                this.$set(this.dataForm, this.dataForm)
              }
            }
          });
        }
      },
      //获取小组成员列表
      getMemberList(id) {
        if (id) {
          var _list = this.filterMemberList();
          this.meberList = this.userList.filter(item => {
            return _list.includes(item.userId)
          });
          this.$set(this.meberList, this.meberList)
        }
      },
      filterMemberList() {
        var list = [];
        this.dataForm.xmProjectRoleUsers.forEach(item => {
          list = this.MergeArray(list, item.userIds);
        })
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
          url: this.$http.adornUrl("/role/selectPage"),
          method: "get",
          params: this.$http.adornParams({
            pageNo: 1,
            pageSize: 10000,
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataForm.xmProjectRoleUsers = data.result.records;
          } else {
            this.dataForm.xmProjectRoleUsers = [];
          }
        });
        this.$http({
          url: this.$http.adornUrl("/user/selectPage"),
          method: "get",
          params: this.$http.adornParams({
            pageNo: 1,
            pageSize: 10000,
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.userList = data.result.records;
          } else {
            this.userList = [];
          }
        });
        this.$http({
          url: this.$http.adornUrl(projectId ? "/xmProjectGroup/selectPage" : "/xmProjectGroupTemplate/selectPage"),
          method: "get",
          params: this.$http.adornParams({
            pageNo: 1,
            pageSize: 10000,
            projectId: projectId,
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataForm.xmProjectGroupUsers = data.result.records;
          } else {
            this.dataForm.xmProjectGroupUsers = [];
          }
        });
      },
      //清除信息
      clearMsg() {
        this.dataForm = {
          project: {
            projectId: 0,
            projectCode: '',
            projectName: '',
            dataTime: [],
            auditedUnit: '',
            projectRemark: '',
            projectPeriodBegin: '',
            projectPeriodEnd: '',
          },
          projectCosts: [],
          xmProjectGroupUsers: [],
          xmProjectRoleUsers: []
        };
        this.dataFormCopy = {
          project: {},
          projectCosts: [],
          xmProjectGroupUsers: [],
          xmProjectRoleUsers: [],
        };
        this.type = 'add';
      },
      //删除表格里的某行
      removeRow(table, index) {
        this.$forceUpdate();
        table.splice(index, 1);
        this.$set(table, table);
      },
      //添加行
      addTabel(table, val) {
        this.$forceUpdate();
        table.push(val);
        this.$set(table, table);
      },
      //获取成员列表
      getDataList(data) {
        this.memberListVisible = false;
        console.log(data)
      },
      //项目成员维护选择事件
      selectionChangeHandle(val) {
        this.xmcywhTabelSel = val
      },
      // 只允许输入金额类型，最大两位小数（如：3.88）
      formatValue(val, index, list, name) {
        val = val.replace(/(^\s*)|(\s*$)/g, "");
        if (!val) return this.value = "";
        val = val.replace(/[^\d.]/g, "");
        val = val.replace(/^\./g, "");
        val = val.replace(/^\b(0{2,})/gi, "0");
        val = val
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d*).*$/, "$1$2.$3");
        list[index][name] = val;
        this.$forceUpdate();
      },
      init(id, type) {
        this.clearMsg();
        this.type = type;
        this.dataForm.project.projectId = id || 0;
        this.visible = true;
        this.getRoleList(id);
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.project.projectId) {
            this.$http({
              url: this.$http.adornUrl(`/xmProject/selectDetailsByProjectId/${this.dataForm.project.projectId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                var datas = data.result;
                this.projectData = datas;
                this.dataForm.project.projectId = datas.project.projectId;
                this.dataForm.project.projectCode = datas.project.projectCode;
                this.dataForm.project.projectName = datas.project.projectName;
                this.dataForm.project.auditedUnit = datas.project.auditedUnit;
                this.dataForm.project.projectRemark = datas.project.projectRemark;
                this.dataForm.project.projectPeriodBegin = datas.project.projectPeriodBegin;
                this.dataForm.project.projectPeriodEnd = datas.project.projectPeriodEnd;
                // this.dataForm.project.dataTime[0]=datas.project.projectPeriodBegin||'';
                // this.dataForm.project.dataTime[1]=datas.project.projectPeriodEnd||'';
                // this.$set(this.dataForm.project.dataTime,this.dataForm.project.dataTime);
                // console.log(this.dataForm.project.dataTime)
                this.dataForm.projectCosts = datas.projectCosts;
                this.dataForm.xmProjectRoleUsers.forEach(item => {
                  datas.xmProjectRoleUsers.forEach(vtem => {
                    if (vtem.roleId == item.roleId) {
                      item.userIds = vtem.userIdss.split(",");
                      this.getMemberList(item.userIds)
                    }
                  })
                });
                this.dataForm.xmProjectGroupUsers.forEach(item => {
                  datas.xmProjectGroupUsers.forEach(vtem => {
                    if (vtem.groupId == item.groupId) {
                      item.leaderIds = vtem.leaderIdss ? vtem.leaderIdss.split(",") : '';
                      item.memberIds = vtem.memberIdss ? vtem.memberIdss.split(",") : [];
                    }
                  })
                });
                this.dataFormCopy = JSON.parse(JSON.stringify(this.dataForm));
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // if(this.dataForm.project.dataTime!=''&&this.dataForm.project.dataTime!=null){
            //   this.dataForm.project.projectPeriodBegin=this.dataForm.project.dataTime[0];
            //   this.dataForm.project.projectPeriodEnd=this.dataForm.project.dataTime[1];
            // }
            this.dataForm.projectCosts.forEach((item, index) => {
              item.costSort = index;
            });
            this.$http({
              url: this.$http.adornUrl(`/xmProject/${!this.dataForm.project.projectId ? 'addProject' : 'updateProject'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$store.dispatch('common/changeProjectList', this.userId);
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
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
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>

