<template>
  <div>
    <el-dialog
      width="70%"
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="项目编号">
          <el-input v-model="dataForm.dataAmount" placeholder="项目编号"></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="dataForm.dataAmount" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目周期">
          <el-date-picker
            v-model="dataForm.dataTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="被审核单位">
          <el-input v-model="dataForm.dataAmount" placeholder="被审核单位"></el-input>
        </el-form-item>
        <el-form-item label="项目成本">
          <el-button type="primary" @click="addTabel(xmcbTabel,{dataAmount:''})">添加行</el-button>
          <el-table
            class="table-list"
            border
            :data="xmcbTabel"
            stripe
            style="width: 100%">
            <el-table-column
              width="50">
              <template slot-scope="scope">
                <i class="el-icon-remove" @click="removeRow(xmcbTabel,scope.$index)"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="人员成本（元/天）"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.dataAmount"  @input="formatValue(scope.row.dataAmount,scope.$index,xmcbTabel,'dataAmount')" placeholder="人员成本"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="费用成本（元/天）"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.dataAmount"  @input="formatValue(scope.row.dataAmount,scope.$index,xmcbTabel,'dataAmount')" placeholder="人员成本"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div>项目成员信息：</div>
          <el-button type="primary" @click="addMemberVisable=true">项目成员信息维护</el-button>
          <el-button type="primary" @click="addTabel(xmcywhTabel,{name:''})">添加行</el-button>
          <el-table
            class="table-list"
            border
            :data="xmcywhTabel"
            @selection-change="selectionChangeHandle"
            stripe
            style="width: 100%">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="角色"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="人员"
              align="center"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="removeRow(xmcywhTabel,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div>小组维护：</div>
          <el-table
            class="table-list"
            border
            :data="xzTabel"
            stripe
            style="width: 100%">
            <!--<el-table-column-->
            <!--type="selection"-->
            <!--header-align="center"-->
            <!--align="center"-->
            <!--width="50">-->
            <!--</el-table-column>-->
            <el-table-column
              prop="name"
              label="小组名称"
              align="center"
            >
              <template slot-scope="scope">
                医学组 <el-button class="table-btn" type="text" size="small" @click="addGroupMemberVisable=true">维护</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="小组组长"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="小组人员"
              align="center"
            >
            </el-table-column>
            <!--<el-table-column-->
              <!--fixed="right"-->
              <!--header-align="center"-->
              <!--align="center"-->
              <!--width="100"-->
              <!--label="操作">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button type="text" size="small" @click="">删除</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,clearMsg()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
    <member-list  v-if="memberListVisible" ref="memberList" @refreshDataList="getDataList"></member-list>
  </div>
</template>

<script>
  import MemberList from './memberList'
  import { isInteger } from '@/utils/validate'
  export default {
    components: {
      MemberList
    },
    data () {
      var validateInteger = (rule, value, callback) => {
        if(value===''){
          callback(new Error('不能为空'))
        }else if (!isInteger(value)) {
          callback(new Error('格式不正确'))
        } else {
          callback()
        }
      };
      var validateMoney = (rule, value, callback) => {
        if(!value){
          callback(new Error('不能为空'))
        }else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      };
      return {
        groupMemberForm:{},//添加小组成员表单
        addMemberForm:{},//添加项目成员表单
        memberListVisible:false,//成员列表状态
        addGroupMemberVisable:false,//添加小组成员状态
        addMemberVisable:false,//添加项目成员状态
        xzTabel:[],//小组信息列表
        xmcywhTabel:[],//项目成员信息列表
        xmcywhTabelSel:[],//项目成员选择列表
        xmcbTabel:[],//项目成本列表
        visible: false,
        roleList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm: {
          id: 0,
          dataTime: '',
          dataAmount: '',
          effectiveData: '',
          todayConsumeMoney: ''
        },
        dataRule: {
          dataTime: [
            { required: true, message: '数据时间不能为空', trigger: 'blur' }
          ],
          dataAmount: [
            { required: true,validator: validateInteger, trigger: 'blur' }
          ],
          effectiveData: [
            { required: true, validator: validateInteger,trigger: 'blur' }
          ],
          todayConsumeMoney: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      //清除信息
      clearMsg(){
        this.xzTabel=[];
        this.xmcywhTabel=[];
        this.xmcywhTabelSel=[];
        this.xmcbTabel=[];
        this.memberListVisible=false;
        this.addGroupMemberVisable=false;
        this.addMemberVisable=false;
      },
      //删除表格里的某行
      removeRow(table,index){
        this.$forceUpdate();
        table.splice(index,1);
        this.$set(table,table);
      },
      //添加行
      addTabel(table,val){
        this.$forceUpdate();
        table.push(val);
        this.$set(table,table);
      },
      //获取成员列表
      getDataList(data){
        this.memberListVisible=false;
        console.log(data)
      },
      //项目成员维护选择事件
      selectionChangeHandle(val){
        this.xmcywhTabelSel = val
      },
      // 只允许输入金额类型，最大两位小数（如：3.88）
      formatValue(val,index,list,name){
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
        list[index][name]=val;
        this.$forceUpdate();
      },
      init (id) {
        this.dataForm.id = id||0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/pdbaidudata/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.dataTime = data.data.dataTime;
                this.dataForm.dataAmount = data.data.dataAmount;
                this.dataForm.effectiveData = data.data.effectiveData;
                this.dataForm.todayConsumeMoney = data.data.todayConsumeMoney;
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/pdbaidudata/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataTime': this.dataForm.dataTime+" 00:00:00",
                'dataAmount': this.dataForm.dataAmount,
                'effectiveData': this.dataForm.effectiveData,
                'todayConsumeMoney': this.dataForm.todayConsumeMoney
              })
            }).then(({data}) => {
              if (data && data.code ===200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
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
  >>> .el-form-item__label{
    width: 120px!important;
  }
  >>> .el-input{
    width: 90%;
  }
  .table-list{
    width: 100%;
    margin-top:10px;
  }
  .table-btn{
    margin-left: 20px;
  }
  .input-hasBtn{
    width: 70%;
  }
</style>

