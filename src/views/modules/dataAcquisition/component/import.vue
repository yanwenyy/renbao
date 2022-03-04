<template>
    <div class='import'>
         <el-button size="mini" type="primary" @click="chooseClick">选择文件</el-button>
         <p class='sp'>请保证医院编码正确！</p>
    </div>
</template>
<script>
export default {
    data(){
        return{
        
        }
    },
    methods:{
        chooseClick(){}
    }
}
</script>
<style lang="scss" scoped>
.sp{
   color:#D9001B;
   font-size:18px;
   font-weight: 600;
}
</style>