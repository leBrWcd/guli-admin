<template>

  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>

    </el-steps>

    <el-form label-width="120px">
        
        <el-form-item label="课程标题">

            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>

        </el-form-item>

        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">

            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="一级分类" @change="getTwoSubject">
                <el-option
                v-for="subject in OnesubjectList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>

             <el-select
                v-model="courseInfo.subjectId"
                placeholder="二级分类">
                <el-option
                v-for="subject in TwosubjectList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>


         </el-form-item>


        <!-- 课程讲师 TODO -->
        <el-form-item label="课程讲师">
            <el-select
                v-model="courseInfo.teacherId"
                placeholder="请选择">
                <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>
            </el-select>
        </el-form-item>



        <el-form-item label="总课时">

            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>

        </el-form-item>

        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面 TODO -->
        <el-form-item label="课程封面">

            <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"  
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/eduoss/fileoss/upload'"
                class="avatar-uploader">
                <img :src="courseInfo.cover">

            </el-upload>
        </el-form-item>

        <el-form-item label="课程价格">

            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元

        </el-form-item>

        <el-form-item>

            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>

        </el-form-item>

    </el-form>

  </div>

</template>


<script>
import course from '@/api/edu/course'

import subject from '@/api/edu/subject'

import Tinymce from '@/components/Tinymce'

export default {

  //声明组件
  components : { Tinymce },  

  data() {
    return {
      saveBtnDisabled: false ,// 保存按钮是否禁用
      courseInfo:{
            title: '',
            subjectId: '', //二级分类
            subjectParentId:'', //一级分类
            teacherId: '',  //讲师id
            lessonNum: 0,
            description: '',
            cover: 'https://lebrwcd-edu1010.oss-cn-guangzhou.aliyuncs.com/cover/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210404100913.jpg', //默认封面
            price: 0
      },
      teacherList :[],   //所有讲师列表
      OnesubjectList : [], //一级分类
      TwosubjectList : [],  //二级分类
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  created() {

    console.log('info created')
    //获取所有讲师
   
    //修改操作
    if(this.$route.params && this.$route.params.id){
        this.courseId =  this.$route.params.id
        //调用
        this.getInfo()
    }else{  //添加
        //获取所有讲师
        this.getAll()
        //初始化一级分类列表
        this.getOneSubject()
    }

  },
  methods: {

    //课程信息回显
    getInfo(){
        
        course.getCouseInfo(this.courseId)
            .then(response => {
                this.courseInfo = response.data.courseInfo

                //查询所有分类，包括一级和二级
                subject.getSubjectList()
                    .then(response => {
                        //得到所有一级分类
                        this.OnesubjectList = response.data.list 
                        //遍历所有一级分类
                        for(var i = 0 ;i < this.OnesubjectList.length;i++){
                            var oneSubject = this.OnesubjectList[i]
                            //判断当前回显中的一级分类的id和遍历的所有一级分类是否一致，有则取出该一级分类对应的二级分类存入前端中
                            if(this.courseInfo.subjectParentId == oneSubject.id){
                                this.TwosubjectList = oneSubject.children
                            }
                        }
                    })
                    //初始化所有讲师
                    this.getAll()
            })

    },
    

    //上传封面成功  
    handleAvatarSuccess(res,file){

        this.courseInfo.cover = res.data.url  //封面的url

    },

    //上传封面之前
    beforeAvatarUpload(file){

        const isJPG = file.type === 'image/jpeg'

        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M

    },

    //一级分类下拉框change执行  
    getTwoSubject(value){
        
        //这里的value就是改变后下拉框中一级分类的id值
        //遍历所有一级分类
        for(let i = 0;i < this.OnesubjectList.length;i++){
            //取出每一个一级分类的id，判断是否与当前一级分类id一致，是的话取出该一级分类下的所有二级分类，然后赋值给TwosubjectList
            if(this.OnesubjectList[i].id === value){
                this.TwosubjectList = this.OnesubjectList[i].children

                this.courseInfo.subjectId = ''

            }
        }
    },

    //获取一级分类
    getOneSubject(){
        subject.getSubjectList()
            .then(response => {
                this.OnesubjectList = response.data.list
            })
    } , 


    getAll(){
        course.getAllTeacher()
            .then(response => {
                this.teacherList = response.data.item
            })
    },
    saveOrUpdate() {

        if(this.$route.params && this.$route.params.id){
            //有id。更新操作
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    this.$message({
                        type : 'success',
                        message : '修改课程信息成功'
                    })
                    //跳转
                    this.$router.push({ path: '/edu/course/chapter/'+ this.courseId})
                })
        }else{
             course.addCourseInfo(this.courseInfo)
            .then(response => {
                //提示信息
                this.$message({
                    type:'success',
                    message:'添加课程信息成功!'
                })
                //跳转路由
                this.$router.push({ path: '/edu/course/chapter/'+ response.data.courseId })
            })
        }
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>