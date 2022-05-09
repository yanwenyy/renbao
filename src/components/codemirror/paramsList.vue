<template>
    <div>
      <el-dialog :close-on-click-modal="false" :append-to-body='true' custom-class="self-dialog" title="参数设置" :visible.sync="SlefparamsListVisible">
        <el-form>
          <el-form-item :label="item.label" v-for="(item,index) in paramsList" :key="index">
            <el-select class="paramsSel" v-model="item.paramsValue" multiple placeholder="请选择">
              <el-option
                v-for="(vtem,i) in item.list"
                :key="i"
                :label="vtem.name||vtem.id"
                :value="vtem.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="closeParams()">取消</el-button>
        <el-button type="primary" @click="selfParamssub()">确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      props:{
        //后台返回的参数列表
        paramsList: {
          type: Array,
          default: null,
        },
        paramsSql: {
          type: String,
          default: null,
        },
        paramsSub:{
          type: Function,
          default: null,
        },
      },
      data(){
        return{
          SelfparamsList:[],//参数设置列表
          SlefparamsListVisible:false,//参数设置显示状态
        }
      },
      watch:{
        paramsListVisible: {
          // 实时监控数据变化
          deep: true,
          handler(val) {
            if (val) {
              this.SlefparamsListVisible=true;
            }
          },
        },
        paramsList: {
          deep: true,
          handler(val) {
            if (val) {
              if (val.length>0) {
                this.SelfparamsList=val;
              }else{
                this.SelfparamsList=[];
              }
            }
          },
        },
        SelfparamsList: {
          deep: true,
          handler(val) {
            if (val) {
              if (val.length>0) {
                this.SlefparamsListVisible=true;
              }
            }
          },
        },
      },
      methods:{
        //参数设置确定点击
        selfParamssub(){
          var _str=JSON.parse(JSON.stringify(this.paramsSql));
          this.paramsList.forEach(item=>{
            if(this.paramsSql.indexOf("{#"+item.id+"#}")!=-1&&item.paramsValue){
              var _reg=new RegExp("{#"+item.id+"#}",'g');
              var _s='';
              if(item.paramsValue.length>1){
                _s=JSON.parse(JSON.stringify(item.paramsValue.join(",")));
                var _sreg=new RegExp(",",'g');
                _s=_s.replace(_sreg ,"','");
                _s="'"+_s+"'";

              }else{
                _s=String("'"+item.paramsValue+"'")
              }
              _str=_str.replace(_reg, _s);
            }
          });
          console.log(_str);
          this.closeParams();
          this.paramsSub(_str,this.paramsList);
        },
        //参数设置取消点击
        closeParams(){
          this.SelfparamsList=[];
          this.SlefparamsListVisible=false;
        },
      }
    }
</script>

<style scoped>

</style>
