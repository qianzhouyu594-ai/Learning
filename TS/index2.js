"use strict";
//public修饰符
class Person1 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHello() {
        console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
    }
}
//简写属性方法
class Person2 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.name = name;
        this.age = age;
    }
}
//protectd修饰符
class Person3 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    details() {
        return `我是${this.name},我今年${this.age}岁了`;
    }
    introduce() {
        console.log(this.details());
    }
}
class Student1 extends Person3 {
    study() {
        console.log(`我是${this.name},我今年${this.age}岁了,我在学习`);
    }
}
const s2 = new Student1('zhangsan', 18);
//s2.name不可用
s2.introduce(); //可用
//private修饰符
class Person4 {
    constructor(name, age, IdCard) {
        this.name = name;
        this.age = age;
        this.IdCard = IdCard;
    }
    details() {
        return `我是${this.name},我今年${this.age}岁了`;
    }
    introduce() {
        console.log(this.details());
    }
}
const s3 = new Person4('zhangsan', 18, '123456789012345678');
// s3.IdCard不可用
//s3.details()不可用
