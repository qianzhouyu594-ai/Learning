const state = {
    isShouqi:false,
    selectMenu:[]
}
const mutations = {
    shouqiCaidan(state){
        state.isShouqi = !state.isShouqi
    },
    addMenu(state,payload){
        //对数据进行去重，找不到就添加到头部导航栏
        if(state.selectMenu.findIndex(item => item.path === payload.path) ===-1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(item => item.name === payload.name)
        //通过索引删除指定数组元素
        state.selectMenu.splice(index,1)
    }
}
export default{
    state,
    mutations
}