//抽象类
abstract class Person5{
    //构造方法
    constructor(public name: string, public age: number) {
        this.name = name;
        this.age = age;
    }
    //抽象方法
    abstract details(): string;
    //具体方法
    introduce() {
        console.log(this.details());
    }
}
class Student5 extends Person5{
    constructor(name: string, age: number, public info:string) {
        super(name, age);
        this.info = info;
    }
    //抽象方法的具体实现
    details() {
        return `我是${this.name},我今年${this.age}岁了,我是${this.info}的学生`
    }
}
const s5 = new Student5('zhangsan',18,'123456789012345678')
s5.introduce()