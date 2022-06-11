import request from '@/utils/request'

//另一种写法
export default{


    //根据课程id获得所有章节和小节
    getAllChapterVideo(courseId){

        return request({
            url:`/eduservice/chapter/getAllChapter/${courseId}`,
            method:'get',
        })
    },
    //添加章节
    addChapter(eduChapter){
        return request({
            url:`/eduservice/chapter/addChapter`,
            method:'post',
            data : eduChapter
        })
    },
    //根据章节id查询
    getById(chapterId){
        return request({
            url:`/eduservice/chapter/getChapter/${chapterId}`,
            method:'get',
        })
    },
    //更新
    updateChapter(eduChapter){

        return request({
            url:`/eduservice/chapter/update`,
            method:'post',
            data : eduChapter
        })
        
    },
    //删除
    deleteChapter(chapterId){
        return request({
            url:`/eduservice/chapter/${chapterId}`,
            method:'delete',
        })
    }

}