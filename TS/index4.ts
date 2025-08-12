//接口
interface PersonInterface {
    name: string;
    age: number;
    sayHello(n:number): void;
}
//定义类使用接口
class Person6 implements PersonInterface {
    constructor(public name: string, public age: number) {

    }
    sayHello(n: number):void {
       for(let i=0;i<n;i++){
           console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
       }
    }
}
const p6 = new Person6('zhangsan',18);
p6.sayHello(3);

//第二个接口
interface StudentInterface {
    name: string;
    readonly gender:string
    age?: number;   
    run(n:number):void
}
//定义对象使用接口
const s6:StudentInterface={
    name:'zhangsan',
    gender:'male',
    age:18,
    run(n:number){
        console.log(`跑了${n}米`);
    }
}
// s6.gender='female' 不可以更改
s6.run(100)

//接口继承
interface StudentInterface2 extends StudentInterface{
    grade:number
}

//第三个接口
interface CountInterface{
    (a:number,b:number):number
}
//定义函数使用接口
const count:CountInterface = (x,y)=>{
    return x+y
}

//接口可重复定义，自动合并
interface StudentInterface2{
    hobby:string
}