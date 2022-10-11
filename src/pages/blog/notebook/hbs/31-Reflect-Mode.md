---
layout: "@/layouts/BlogPost.astro"
title: 31-代理模式
image: /img/hbs.png
description: JavaScript 代理模式
date: 2021-01-13 16:36:13
---

[[toc]]

## 跟踪属性访问

```js
const user = { 
	name: 'Jake'
}; 
const proxy = new Proxy(user, { 
	get(target, property, receiver) { 
		console.log(`Getting ${property}`); 
		return Reflect.get(...arguments); 
	}, 
	set(target, property, value, receiver) { 
		console.log(`Setting ${property}=${value}`); 
		return Reflect.set(...arguments); 
	} 
}); 
proxy.name; // Getting name 
proxy.age = 27; // Setting age=27
```

## 隐藏属性

```js
const hidden = ['foo', 'bar']; 
const targetObject = { foo: 1, bar: 2, baz: 3 };
const proxy = new Proxy(targetObj, {
  get(target, property) {
    if(hidden.includes(property)) {
      return undefined;
    } else {
      return Reflect.get(...arguments);
    }
  },
  has(target, property) {
    if(hidden.includes(property)) {
      return false;
    } else {
      return Reflect.has(...arguments);
    }
  }
})
// get() 
console.log(proxy.foo); // undefined 
console.log(proxy.bar); // undefined 
console.log(proxy.baz); // 3 
// has() 
console.log('foo' in proxy); // false 
console.log('bar' in proxy); // false 
console.log('baz' in proxy); // true
```

## 属性验证

```js
const target = { 
 onlyNumbersGoHere: 0 
}; 
const proxy = new Proxy(target, { 
 set(target, property, value) { 
   if (typeof value !== 'number') { 
      return false; 
   } else { 
      return Reflect.set(...arguments); 
   } 
 } 
}); 
proxy.onlyNumbersGoHere = 1; 
console.log(proxy.onlyNumbersGoHere); // 1 
proxy.onlyNumbersGoHere = '2'; 
console.log(proxy.onlyNumbersGoHere); // 1
```

## 函数参数验证

```js
function median(...nums) { 
 	return nums.sort()[Math.floor(nums.length / 2)]; 
}
const proxy = new Proxy(median, {
  apply(target, thisObj, args) {
    for(const arg of args) {
      if(typeof arg !== 'number') {
        throw 'Non-number argument provided';
      }
    }
    return Reflect.apply(...args)
  }
})
console.log(proxy(4, 7, 1)); // 4 
console.log(proxy(4, '7', 1)); 
// Error: Non-number argument provided
```

## 构造函数参数限制

```js
class User { 
 constructor(id) { 
 		this.id_ = id; 
 } 
} 
const proxy = new Proxy(User, { 
 construct(target, argumentsList, newTarget) { 
   if (argumentsList[0] === undefined) { 
      throw 'User cannot be instantiated without id'; 
   } else { 
      return Reflect.construct(...arguments); 
   } 
 } 
}); 
new proxy(1); 
new proxy(); 
// Error: User cannot be instantiated without id
```

## 发布-订阅

```js
const userList = [];
class User {
  constructor(name) {
    this._name = name;
  }
}
const emit = (v) => console.log(v);

const p1 = new Proxy(userList, {
  set(target, property, value, receiver) {
    const result = Reflect.set(...arguments);
    if (result) {
      emit(Reflect.get(target, property, receiver));
    }
    return result;
  }
});
const proxy = new Proxy(User, {
  construct() {
    const newUser = Reflect.construct(...arguments);
    p1.push(newUser);
    return newUser;
  }
});
new proxy('John'); // {_name: "John"}
new proxy('Jacob'); // {_name: "Jacob"}
new proxy('Jingleheimerschmidt'); // {_name: "Jingleheimerschmidt"}
console.log(userList); // [User {}, User {}, User{}]
```