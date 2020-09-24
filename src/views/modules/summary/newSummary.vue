<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="物料名称:">
        <el-input v-model="dataForm.materialsName" placeholder="物料名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-date-picker
          v-model="dataForm.timeStart"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-date-picker
          v-model="dataForm.timeEnd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排放标准:">
        <el-select clearable  v-model="dataForm.emissionStand" placeholder="请选择">
          <el-option
            v-for="item in pfbz"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运输方式:">
        <el-select clearable  v-model="dataForm.tranType" placeholder="请选择">
          <el-option
            v-for="item in ysfs"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="磅单类型:">
        <el-select clearable  v-model="dataForm.meaType" placeholder="请选择">
          <el-option
            v-for="item in bdClass"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料大类:">
        <el-input v-model="dataForm.materialsPname" placeholder="物料大类" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="exportList()">导出</el-button>
        <!--<el-button v-if="" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      :span-method="objectOneMethod"
      height="80vh"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="measureType"
        align="center"
        label="运输类型">
        <template slot-scope="scope">
          {{scope.row.measureType==1?'采购':'销售'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="materialsPname"
        align="center"
        label="物料大类">
      </el-table-column>
      <el-table-column
        prop="materialsName"
        align="center"
        label="物料名称">
      </el-table-column>
      <el-table-column label="铁路"  align="center">
        <el-table-column
          prop="trainNum"
          header-align="center"
          align="center"
          label="车数">
        </el-table-column>
        <el-table-column
          prop="trainWeigh"
          header-align="center"
          align="center"
          label="重量">
          <template slot-scope="scope">
            <span>{{scope.row.trainWeigh==0||scope.row.trainWeigh%1==0?scope.row.trainWeigh:scope.row.trainWeigh.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="电车"  align="center">
        <el-table-column
          prop="electNum"
          header-align="center"
          align="center"
          label="车数">
        </el-table-column>
        <el-table-column
          prop="electWeigh"
          header-align="center"
          align="center"
          label="重量">
          <template slot-scope="scope">
            <span>{{scope.row.electWeigh==0||scope.row.electWeigh%1==0?scope.row.electWeigh:scope.row.electWeigh.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="公路（国五及以上车辆）"  align="center">
        <el-table-column
          prop="carNum"
          header-align="center"
          align="center"
          label="车数">
        </el-table-column>
        <el-table-column
          prop="carWeigh"
          header-align="center"
          align="center"
          label="重量">
          <template slot-scope="scope">
            <span>{{scope.row.carWeigh==0||scope.row.carWeigh%1==0?scope.row.carWeigh:scope.row.carWeigh.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="percentage"
        header-align="center"
        align="center"
        label="清洁运输占比(%)">
        <template slot-scope="scope">
          <span>{{scope.row.percentage%1===0?scope.row.percentage*100+'%':(scope.row.percentage*100).toFixed(2)+'%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="" type="text" size="small" @click="addOrUpdateHandle(scope.row)">查看</el-button>
          <!--<el-button v-if="isAuth('biz:pdbaidudate:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="sumWeigh">合计:</div>
    <el-table
      :header-cell-style="{background:'#eef1f6'}"
      :data="totalList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="measureType"
        align="center"
        label="合计类型">
        <template slot-scope="scope">
          <span>{{scope.row.measureType==1?'采购':scope.row.measureType==2?'销售':'采购+销售'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="trainWeigh"
        align="center"
        label="铁路">
        <template slot-scope="scope">
          <span>{{scope.row.trainWeigh==0||scope.row.trainWeigh%1==0?scope.row.trainWeigh:scope.row.trainWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="electWeigh"
        align="center"
        label="电车">
        <template slot-scope="scope">
          <span>{{scope.row.electWeigh==0||scope.row.electWeigh%1==0?scope.row.electWeigh:scope.row.electWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="carWeigh"
        align="center"
        label="公路">
        <template slot-scope="scope">
          <span>{{scope.row.carWeigh==0||scope.row.carWeigh%1==0?scope.row.carWeigh:scope.row.carWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sumWeigh"
        align="center"
        label="总计">
        <template slot-scope="scope">
          <span>{{scope.row.sumWeigh==0||scope.row.sumWeigh%1==0?scope.row.sumWeigh:scope.row.sumWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="percentage"
        header-align="center"
        align="center"
        label="清洁运输占比(%)">
        <template slot-scope="scope">
          <span>{{scope.row.percentage%1===0?scope.row.percentage*100+'%':(scope.row.percentage*100).toFixed(2)+'%'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './summary-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          timeStart: '',
          timeEnd: '',
          meaType:'',
          materialsPname:'',
          tranType:'',
          emissionStand:'',
          materialsName:''
        },
        dataList: [],
        totalList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        pfbz: [
          {
            value: '国五',
            label: '国五'
          }, {
            value: '国六',
            label: '国六'
          }],
        bdClass:[
          {
            value:'1',
            label:'采购 '
          },
          {
            value:'2',
            label:'销售'
          }
        ],
        ysfs:[
          {
            value: '0',
            label: '铁路'
          },
          {
            value: '1',
            label: '公路'
          },{
            value: '2',
            label: '纯电动'
          }
        ],
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList();
      this.$http({
        url: this.$http.adornUrl('/jinding/sum/list/count'),
        method: 'get',
      }).then(({data}) => {
        if (data && data.code === 10000) {
          this.totalList = data.data;
        }
        this.dataListLoading = false
      })
    },
    methods: {
      //导出
      exportList() {
        //要导出的json数据
        this.$http({
          url: this.$http.adornUrl('/jinding/sum/list/two'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': 100000000,
            'timeStart': this.dataForm.timeStart || '',
            'timeEnd': this.dataForm.timeEnd || '',
            'meaType': this.dataForm.meaType,
            'materialsPname': this.dataForm.materialsPname,
            'emissionStand': this.dataForm.emissionStand,
            'tranType': this.dataForm.tranType,
            'materialsName': this.dataForm.materialsName
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            var jsonData = data.data;
            //列标题
            let str = '<tr>\n' +
              '<th rowspan="2">运输类型</th>\n' +
              '<th rowspan="2">物料大类</th>\n' +
              '<th rowspan="2">物料名称</th>\n' +
              '<th colspan="2">铁路</th>\n' +
              '<th colspan="2">电车</th>\n' +
              '<th colspan="2">公路（国五及以上车辆）</th>\n' +
              '<th rowspan="2">清洁运输占比(%)</th>\n' +
              '</tr>\n' +
              '<tr>\n' +
              '<th>车数</th>\n' +
              '<th>重量</th>\n' +
              '<th>车数</th>\n' +
              '<th>重量</th>\n' +
              '<th>车数</th>\n' +
              '<th>重量</th>\n' +
              '</tr>';
            //循环遍历，每行加入tr标签，每个单元格加td标签
            for (let i = 0; i < jsonData.length; i++) {
              var v = jsonData[i];
              str += ' <tr>\n' +
                '<td>' + (v.measureType && (v.measureType == 1 ? '采购 ' : '销售')) + '</td>\n' +
                '<td>' + (v.materialsPname || '') + '</td>\n' +
                '<td>' + (v.materialsName || '') + '</td>\n' +
                '<td>' + (v.trainNum) + '</td>\n' +
                // '<td>' + (v.trains) + '</td>\n' +
                '<td>' + (v.trainWeigh == 0 || v.trainWeigh % 1 == 0 ? v.trainWeigh : v.trainWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.electNum) + '</td>\n' +
                // '<td>' + (v.elects) + '</td>\n' +
                '<td>' + (v.electWeigh == 0 || v.electWeigh % 1 == 0 ? v.electWeigh : v.electWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.carNum) + '</td>\n' +
                // '<td>' + (v.cars) + '</td>\n' +
                '<td>' + (v.carWeigh == 0 || v.carWeigh % 1 == 0 ? v.carWeigh : v.carWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.percentage % 1 === 0 ? v.percentage * 100 + '%' : (v.percentage * 100).toFixed(2) + '%') + '</td>\n' +
                '</tr>';
            }
            var hjStr = ' <tr>\n' +
              '<th>合计类型</th>\n' +
              '<th>铁路</th>\n' +
              '<th>电车</th>\n' +
              '<th>公路</th>\n' +
              '<th>总计</th>\n' +
              '<th>清洁运输占比</th>\n' +
              '</tr>';
            var list = this.totalList, i = 0, len = list.length, html = '';
            for (; i < len; i++) {
              var v = list[i];
              hjStr += ' <tr>\n' +
                '<td>' + (v.measureType && (v.measureType == 1 ? '采购 ' : v.measureType == 2 ? '销售 ' : '采购+销售')) + '</td>\n' +
                '<td>' + (v.trainWeigh == 0 || v.trainWeigh % 1 == 0 ? v.trainWeigh : v.trainWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.electWeigh == 0 || v.electWeigh % 1 == 0 ? v.electWeigh : v.electWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.carWeigh == 0 || v.carWeigh % 1 == 0 ? v.carWeigh : v.carWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.sumWeigh == 0 || v.sumWeigh % 1 == 0 ? v.sumWeigh : v.sumWeigh.toFixed(2)) + '</td>\n' +
                '<td>' + (v.percentage % 1 === 0 ? v.percentage * 100 + '%' : (v.percentage * 100).toFixed(2) + '%') + '</td>\n' +
                '</tr>'
            }
            //Worksheet名
            let worksheet = 'Sheet1';
            let uri = 'data:application/vnd.ms-excel;base64,';

            var tabel = this.parseDom(`<table id="newSummary">${str + hjStr}</table>`);
            this.autoRowSpan(tabel, 1, 1);
            this.autoRowSpan(tabel, 1, 0);
            var htmlTabel = this.nodeToString(tabel[0]);
            //下载的表格模板数据
            let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body>${htmlTabel}</body></html>`;
            //下载模板
            window.location.href = uri + this.base64(template)
          }
        });

      },
      //输出base64编码
      base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      nodeToString(node) {
        //createElement()返回一个Element对象
        var tmpNode = document.createElement("div");
        //appendChild()  参数Node对象   返回Node对象  Element方法
        //cloneNode()  参数布尔类型  返回Node对象   Element方法
        tmpNode.appendChild(node.cloneNode(true));
        var str = tmpNode.innerHTML;
        tmpNode = node = null; // prevent memory leaks in IE
        return str;
      },
      //合并单元格
      autoRowSpan(tb, row, col) {
        var lastValue = "";
        var value = "";
        var pos = 1;
        var list = tb[0].rows,
          len = list.length,
          i = row;
        for (; i < len; i++) {
          value = list[i].cells[col].innerText && list[i].cells[col].innerText;
          if (lastValue == value) {
            list[i].deleteCell(col);
            list[i - pos].cells[col].rowSpan = list[i - pos].cells[col].rowSpan + 1;
            pos++;
          } else {
            lastValue = value;
            pos = 1;
          }
        }

      },
      parseDom(arg) {
        var objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes;
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/jinding/sum/list/two'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'timeStart': this.dataForm.timeStart|| '',
            'timeEnd': this.dataForm.timeEnd|| '',
            'meaType': this.dataForm.meaType,
            'materialsPname': this.dataForm.materialsPname,
            'emissionStand': this.dataForm.emissionStand,
            'tranType': this.dataForm.tranType,
            'materialsName': this.dataForm.materialsName
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            this.dataList = data.data;
            this.totalPage = data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
        // this.addOrUpdateVisible = true
        // this.$nextTick(() => {
        //   this.$refs.addOrUpdate.init(id)
        // })

        this.$router.push({
          name: 'summary-detail',
          // name: 'mallList',
          params: {
            list: id
          }
        })
      },
      objectOneMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          const _row = this.setTable(this.dataList).one[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
        if (columnIndex === 2 ) {
          const _row = this.setTable(this.dataList).two[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      },
      setTable(tableData) {
        let spanOneArr = [],
          spanTwoArr = [],
          concatOne = 0,
          concatTwo = 0;
        tableData.forEach((item, index) => {
          if (index === 0) {
            spanOneArr.push(1);
            spanTwoArr.push(1);
          } else {
            if (item.measureType === tableData[index - 1].measureType) {
              //第一列需合并相同内容的判断条件
              spanOneArr[concatOne] += 1;
              spanOneArr.push(0);
            } else {
              spanOneArr.push(1);
              concatOne = index;
            }
            if (item.materialsPname === tableData[index - 1].materialsPname) {
              //第二列和需合并相同内容的判断条件
              spanTwoArr[concatTwo] += 1;
              spanTwoArr.push(0);
            } else {
              spanTwoArr.push(1);
              concatTwo = index;
            }
          }
        });
        return {
          one: spanOneArr,
          two: spanTwoArr
        };
      },
    }
  }
</script>
<style>
  .sumWeigh{
    font-size: 18px;
    margin: 20px 0;
    font-weight: bold;
  }
</style>
