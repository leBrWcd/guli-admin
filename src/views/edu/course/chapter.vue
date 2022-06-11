<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">

      <el-step title="填写课程基本信息"/>

      <el-step title="创建课程大纲"/>

      <el-step title="发布课程"/>

    </el-steps>

    <el-button type="text" @click="ChapterForm()">添加章节</el-button>
        
    <!-- 章节 -->
    <ul class="chapterList">
        <li
            v-for="chapter in ChapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button type="text" @click="openVideo(); chapterId = chapter.id">添加小节</el-button>
                    <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
                </span>
            </p>
  
            <!-- 视频 -->
            <ul class="chapterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">

        <el-form :model="chapter" label-width="120px">

            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>

            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
            
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>

    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>

        </el-form-item>

        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
            <el-upload
                  :on-success="handleVodUploadSuccess"
                  :on-remove="handleVodRemove"
                  :before-remove="beforeVodRemove"
                  :on-exceed="handleUploadExceed" 
                  :file-list="fileList"
                  :action="BASE_API+'/eduvod/video/uploadVideo'"
                  :limit="1"
                  class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
            </el-tooltip>
            </el-upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

import chapter from '@/api/edu/chapter'

import video from '@/api/edu/video'

export default {

  data() {
    return {
      saveBtnDisabled: false,// 保存按钮是否禁用
      courseId : '',  //课程id
      ChapterVideoList : [], //返回的章节。小节
      chapterId :'',

      dialogChapterFormVisible: false, //是否显示章节表单
      dialogVideoFormVisible : false,//是否显示小节表单
      chapter:{ //章节对象
        title : '',
        sort : 0
      },
      video : {
        title :'',
        sort : 0,
        free : 0,
        videoSourceId :'',
        videoOriginalName :'',
      },
      fileList : [],
      BASE_API: process.env.BASE_API, // 接口API地址
  
    }
  },

  created() {
    console.log('chapter created')

    //从路由中判断是否有id
    if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterVideo()
    }



  },
  methods: {

    //==========================小节相关操作======================================
    
    handleVodRemove() {
      //调用api接口方法
      video.deleteVideoSource(this.video.videoSourceId)
        .then(response => {
          //提示信息
          this.$message({
            type : 'success',
            message :'删除视频成功！'
          })
          //把文件列表清空
          this.fileList = []
          //把video视频id 和 视频名字清空
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
        })
    },

    //点击x调用这个方法
    beforeVodRemove(file,fileList) {
        return this.$confirm(`确定删除 ${ file.name }? `)

    },


    //上传视频成功回调
    handleVodUploadSuccess(response,file,fileList) {
      
      this.video.videoOriginalName = file.name
  
      this.video.videoSourceId = response.data.videoId
      
    },

    //上传多于一个视频
    handleUploadExceed(files,fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },




    //修改章节信息
    updateVideo(){
      video.updateVideo(this.video)
        .then(response => {
            this.$message ({
              type : 'success',
              message : "修改小节信息成功"
            })
            //关闭弹出
            this.dialogVideoFormVisible = false 
            //刷新章节列表
            this.getChapterVideo()
        })
    },

    //修改小节
    editVideo(vid){
      //弹框
      this.dialogVideoFormVisible = true

      //数据回显
      video.getById(vid)
        .then(response => {
          this.video = response.data.video
          if(this.video.videoSourceId != '') {
               this.fileList = [{name:this.video.videoOriginalName}] //回显上传视频名称
          }else{
            this.fileList = []
          }
         
        })
    },


    //删除小节
    removeVideo(vid){
      this.$confirm('是否删除该小节','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        video.deleteVideo(vid)
          .then(response => {
            //提示
              this.$message({
                type :'success',
                message : '删除小节成功'
            })
             //刷新列表
            this.getChapterVideo()
          })
         
      })
    },

    //清空表单
    resetForm(){
       //清空表单内容
      this.video.title = ''
      this.video.sort = 0
      this.video.free = 0
      
    },

    //打开弹框
    openVideo(){

        //弹框
        this.dialogVideoFormVisible = true
        //清空表单
        this.resetForm()
    },

    freshVideo(){
      //关闭弹窗
      this.dialogVideoFormVisible = false
      //刷新列表
      this.getChapterVideo()
      //清空表单
     
    },  

    

    //添加小节
    saveVideo(){

      //初始化章节id
      this.video.chapterId = this.chapterId      
      //初始化课程id
      this.video.courseId = this.courseId


      video.addVideo(this.video)
        .then(response => {
            this.$message({
              type :'success',
              message : '添加小节成功'
          })
          this.freshVideo()
        })
    },

    //添加或者更新
    saveOrUpdateVideo(){

      if(this.video.title == ''){
        this.$message({
          type :'warning',
          message : '小节标题不能为空'
        })
      }else{

        //添加或者更新操作
        if(!this.video.id){
          //添加
          this.saveVideo()
        }else{
          //更新操作
          this.updateVideo()
        }

      }

    },

    //===========================章节相关操作======================================

    //删除章节
    deleteChapter(chapterId){
      this.$confirm('是否删除该记录?','提示',{
        confirmButtonText : '确定',
        cancelButtonText : '取消',
        type :'warning'
      }).then(()=>{ //点击确定，执行then方法
        chapter.deleteChapter(chapterId)
          .then(response => {
             //刷新列表
              this.getChapterVideo()
              this.$message({
                type:'success',
                message : '删除成功!'
              })

          })
      })
    },


    editChapter(chapterId){

      //弹框
      this.dialogChapterFormVisible = true

      //数据回显
      chapter.getById(chapterId)
        .then(reponse => {
          this.chapter = reponse.data.chapter
        })

    },

    ChapterForm(){
      //弹框
      this.dialogChapterFormVisible = true

      //清空
      this.chapter.title = ''
      this.chapter.sort = 0
    },
  
    //点击确定按钮后触发
    saveOrUpdate(){

      //先判断是否没输入字符
      if(this.chapter.title == ''){
          this.$message ({
              type : 'warning',
              message : "章节标题不能为空"
            })
      }else{
        if(this.chapter.id){
        //章节中有id，为更新操作
        this.updateChapter()
        
        }else{
          //添加操作
          this.addChapter()
        }
      
      }
    },

    //修改章节信息
    updateChapter(){
      chapter.updateChapter(this.chapter)
        .then(response => {
            this.$message ({
              type : 'success',
              message : "修改章节信息成功"
            })
            //关闭弹出
            this.dialogChapterFormVisible = false 
            //刷新章节列表
            this.getChapterVideo()
        })
    },

    //添加章节
    addChapter(){
      
      this.chapter.courseId = this.courseId

      chapter.addChapter(this.chapter)
        .then(response => {
          //添加成功
          //1.关闭弹框
          this.dialogChapterFormVisible = false
      
          //2.提示信息
          this.$message({
            type : 'success',
            message : '添加章节成功'
          })
          //3.刷新章节页面
          this.getChapterVideo()

        })
    },



    getChapterVideo(){
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
            this.ChapterVideoList = response.data.list
        })
    },

    previous() {

      console.log('previous')

      this.$router.push({ path: '/edu/course/info/'+ this.courseId })

    },

    next() {

      console.log('next')

      this.$router.push({ path: '/edu/course/publish/' + this.courseId})

    }

  }

}

</script>

<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 9px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 15px;
  margin: 9px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>