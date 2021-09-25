const getters = {
  articleList: state => state.article.articleList,
  chatList:state => state.chat.chatList,
  programList:state => state.program.programList,
  userInfo:state=>state.user.userInfo,
  loginType:state=>state.user.loginType,
  onlineType:state=>state.user.onlineType,
  configObj:state=>state.config.configObj
}
export default getters
