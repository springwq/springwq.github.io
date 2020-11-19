---
title: Ruby 元编程学习笔记 - 对象模型
date: 2020-11-19 15:19:52
tags: [Ruby, MetaProgramming]
---

Ruby 的对象模型 The Object Model, 是 Ruby 的灵魂, 《Ruby 元编程》第 2 章通过对以下三个问题的探索，详细介绍了 Ruby 对象模型的细节.

<!--more-->

## 打开类

### 什么是打开类

当已经有了一个类的定义后，再次定义一个同名类后，此时 Ruby 会重新打开这个类，而不是再次定义一个同名类。
打开类对像 `Sting` 或 `Array` 这样的标准库中的类同样有效。

```ruby
  class D
    def hi
      'hello'
    end
  end

  class D
    def greeting
      'hello word'
    end
  end
```

### 打开类问题

当为某一个类添加一个新方法时，可能会覆盖已经存在的方法定义，这种行为也叫猴子补丁 - Monkey Patch.

例如： Array 类中有一个 replace 方法，我们可以在代码中复写这个方法

```ruby
class Array
  def replace(new, old)
    'override replace method'
  end
end
```

## 什么是类

### 对象中有什么

- 对象包含实例变量
- 对于同一个类，可以创建不有不同实例变量的对象
- 对象的实例变量一般是通过调用实例方法获得
- 对象的方法即实例方法不是来自自身，而是来自它的类
  - object.methods 返回对象的所有方法
- 类当中除了实例方法，还有类方法
- 同一个类的对象共享同样的方法，但不共享实例变量

### 类的真相

- 类本身也是对象，类这个对象的类叫做 Class
  -  Class.new 能创建一个类

- Class 的实例方法： allocate, new, superclass

- Class 类的超类是 Module, 每个类都是带有三个方法（allocate, new, superclass）的增强模块
  - Class.superclass # => Module


## 方法是如何执行的
