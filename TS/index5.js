"use strict";
//泛型函数，泛型可以有多个 
function fn(a, b) {
    return a;
}
fn(100, 'hello');
fn('hello', 100);
const p1 = {
    name: 'zhangsan',
    age: 18,
    extra: {
        job: 'teacher',
        time: '8:00'
    }
};
//泛型类
class PersonClass {
    constructor(name, age, extra) {
        this.name = name;
        this.age = age;
        this.extra = extra;
    }
    say() {
        console.log(this.name, this.age, this.extra);
    }
}
const p7 = new PersonClass('zhangsan', 18, 'male');
