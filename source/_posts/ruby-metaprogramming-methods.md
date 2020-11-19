---
title: Ruby 元编程学习笔记 - 方法
date: 2020-11-19 23:57:02
tags: [Ruby, Metaprogramming]
---

Ruby 是一门动态语言，本身有很多动态特性，能够用来解决代码繁复的问题。这些动态特性主要表现在几个动态方法上，以下做详细介绍。

<!--more-->

## 动态方法

### 动态调用方法

- 使用 Object#send 方法代码点标识符来调用方法

```ruby
obj.send(:my_method, 3)
```

- send 方法的第一个参数就是方法的名字
  - 这个参数可以是字符串，也可以用符号
  - 通常使用符号作为方法名
- 使用 send 方法后， 想要调用的方法名变成了参数，这样就可以再代码运行的最后一刻决定调用哪个方法
- 这个技巧，也被成为动态派发 Dynamic Dispatch
- 可以通过 send 调用任何方法，包括私有方法
- 如果不想破坏封装的行为，可以使用 public_send


### 动态定义方法

- 可以使用 Module#define_method 方法随时定义一个方法
  - define_method 方法在 MyClass 内部执行
  - 因此 my_method 定义为 MyClass 的实例方法

```ruby
class MyClass
  define_method :my_method do |my_arg|
    my_arg + 3
  end
end
```

- 这种在运行时定义方法的技术成为动态方法 Dynamic Method

- define_method 允许在运行时决定方法名

## method_missing 方法

- 在 Ruby 中，编译器并去检查方法调用的行为，因此可以调用一个并不存在的方法
- method_missing 是 BasicObkect 的一个私有实例方法
- 如果调用的一个方法在哪里都找不到，最后会调用 method_missing
- 覆写 method_missing 方法可以调用实际上并不存在的方法

### 幽灵方法 Ghost Methods

- 被 method_missing 方法处理的消息，从调用者角度看，跟皮套方法没什么区别，而实际上接收者并没有对应的方法，这成为幽灵方法

### 动态代理 Dynamic Proxies

- 可以捕获幽灵方法，并把它们转发给另外一个对象，成为动态代理
- repond_to? 不会感知幽灵方法
- respond_to_missing? 会返回 true 如果该方法是一个幽灵方法
- 每次覆写 method_missing 时，同时也覆写 respond_to_missing? 方法
- 当引用一个不存在的常量时，Ruby 会把这个常量名作为一个符号床底给 const_missing 方法
  - Module#const_missing
- 幽灵方法经常会遇到的问题
  - 由于调用未定义的方法会导致调用 method_missing 方法，所以对象可能会接受错误的方法调用
  - 应该只在必要时才使用幽灵方法
  - 首先用普通方法实现功能，代码没有问题后，再将这些方法重构到 method_missing 中

## 白板类 Blank Slates

- 如果幽灵方法和真实方法发生名字冲突，幽灵方法就会忽略
- 去除继承来的方法，这种拥有极少方法的类称为白板类

### BasicObject

- 如果需要有个白板类，可以直接从 BasicObject 类继承

### 删除方法

- Module#undef_method
  - 它会删除所有所有好酷哦继承而来的方法

- Module#remove_method
  - 只删除接收者自己的方法，而保留继承来的方法

## 总结

- 在可以使用带胎方法的时候，尽量使用动态方法；除非必须使用幽灵方法，否则尽量不要使用它