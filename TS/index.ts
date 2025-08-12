class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    sayHello() {
        console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
    }
}
class Student extends Person {
    grade: number;
    constructor(name: string, age: number, grade: number) {
        super(name, age);
        this.grade = grade;
    }
    speak() {
        console.log(`Hello, this is ${this.name}, I am ${this.age} years old, my student no is ${this.grade}.`);
    }
    //重写方法
    override sayHello() {
        console.log(`Hello, is ${this.name}, I am ${this.age} years old.`);
    }
}
const s1 = new Student('zhangsan',18,1)
s1.sayHello()