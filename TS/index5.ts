//泛型函数，泛型可以有多个 
function fn<T,U>(a:T,b:U):T|U{
    return a
}
fn<number,string>(100,'hello')
fn<string,number>('hello',100)


//泛型接口
interface PersonInterface1<T>{
    name:string,
    age:number,
    extra:T
}

type jobInfo={
    job:string
    time:string
}
const p1:PersonInterface1<jobInfo>={
    name:'zhangsan',
    age:18,
    extra:{
        job:'teacher',
        time:'8:00'
    }
}

//泛型类
class PersonClass<T>{
    constructor(public name:string,public age:number,public extra:T){
    }
    say(){
        console.log(this.name,this.age,this.extra);
    }
}

const p7 = new PersonClass<string>('zhangsan',18,'male')
