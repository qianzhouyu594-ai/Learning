"use strict";
//抽象类
class Person5 {
    //构造方法
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.name = name;
        this.age = age;
    }
    //具体方法
    introduce() {
        console.log(this.details());
    }
}
class Student5 extends Person5 {
    constructor(name, age, info) {
        super(name, age);
        this.info = info;
        this.info = info;
    }
    //抽象方法的具体实现
    details() {
        return `我是${this.name},我今年${this.age}岁了,我是${this.info}的学生`;
    }
}
const s5 = new Student5('zhangsan', 18, '123456789012345678');
s5.introduce();
