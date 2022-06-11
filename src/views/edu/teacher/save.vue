<template>
  <div class="app-container">

    <el-form label-width="120px">

      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
    <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
                    v-show="imagecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduoss/fileoss/upload'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>

    </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {

    components: { ImageCropper, PanThumb },

    data(){
        return{
            teacher : {
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: 'https://lebrwcd-edu1010.oss-cn-guangzhou.aliyuncs.com/2022/05/02/68ce7996e84default_colleagues.jpg' //默认头像
            },
            saveBtnDisabled: false, // 保存按钮是否禁用,
            imagecropperShow:false, //点击更换头像弹出弹框，点击后为true
            BASE_API:process.env.BASE_API,
            imagecropperKey: 0 // 上传组件id


        }
        
    },
    watch:{
        $route(to,from){
            console.log('watch $route')
            this.init()
        }
    },
    created(){
        //页面渲染之前执行
        this.init()
    },
    methods:{

        // @close="close" ,点击头像弹框的关闭按钮发生的事件
        close(){

            this.imagecropperShow = false
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1

        },
        // @crop-upload-success="cropSuccess" 更换头像成功后发生的事件
        cropSuccess(data){

            this.imagecropperShow = false,
            //返回的数据
            this.teacher.avatar = data.url
            
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },

        //判断是修改操作还是添加操作
        init(){
            //如果路由中参数不为空，并且参数中有id值，则为修改操作
            if(this.$route.params && this.$route.params.id){
                //从路径中获取id值
                const id = this.$route.params.id
                //调用该id查询方法进行数据回显
                this.getInfo(id)
            }else{
                //添加操作，清空表单
                this.teacher = {}
            }
        },
        saveOrUpdate(){
            this.saveBtnDisabled = true
            if(!this.teacher.id){
                //id值为空，添加操作
                this.save()
                
            }else{
                this.update()
            }
        },
        //添加操作
        save(){
            teacherApi.addTeacher(this.teacher)
                .then(response=>{
                     //添加成功，提示信息
                        this.$message({
                            type:'success',
                            message:'添加成功!'
                        });
                        //回到列表页面，路由跳转
                        this.$router.push({path:'/teacher/list'})
                })
                
        },
        //数据回显
        getInfo(id){
            teacherApi.getInfoById(id)
                .then(response=>{
                    this.teacher = response.data.teacher
                })
                .catch(error=>{
                    console.log(error)
                })
        },
        //修改操作
        update(){
            teacherApi.updateInfo(this.teacher)
                .then(response=>{
                        //修改成功，提示信息
                        this.$message({
                            type:'success',
                            message:'修改成功!'
                        });
                        //回到列表页面。路由跳转
                        this.$router.push({path:'/teacher/list'})
                })
        }
    }
    
}
</script>