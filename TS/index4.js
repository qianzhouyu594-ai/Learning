"use strict";
//定义类使用接口
class Person6 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHello(n) {
        for (let i = 0; i < n; i++) {
            console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
        }
    }
}
const p6 = new Person6('zhangsan', 18);
p6.sayHello(3);
//定义对象使用接口
const s6 = {
    name: 'zhangsan',
    gender: 'male',
    age: 18,
    run(n) {
        console.log(`跑了${n}米`);
    }
};
// s6.gender='female' 不可以更改
s6.run(100);
//定义函数使用接口
const count = (x, y) => {
    return x + y;
};
