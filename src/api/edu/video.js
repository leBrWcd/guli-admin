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

    //添加小节
    addVideo(Video){
        return request({
            url:`/eduservice/video/addVideo`,
            method:'post',
            data : Video
        })
    },

    //根据章节id查询
    getById(videoId){
        return request({
            url:`/eduservice/video/getVideo/${videoId}`,
            method:'get',
        })
    },


    //更新
    updateVideo(Video){

        return request({
            url:`/eduservice/video/update`,
            method:'post',
            data : Video
        })
        
    },

    //删除小节
    deleteVideo(VideoId){
        return request({
            url:`/eduservice/video/${VideoId}`,
            method:'delete',
        })
    },
    //删除视频
    deleteVideoSource(VideoId){
        return request({
            url:`/eduvod/video/${VideoId}`,
            method:'delete',
        })
    }

}