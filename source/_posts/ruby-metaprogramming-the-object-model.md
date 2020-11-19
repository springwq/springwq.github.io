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
- 总之，对象就是一组实例变量外加一个指向其类的引用


### 类的真相

- 类本身也是对象，类这个对象的类叫做 Class
  -  Class.new 能创建一个类

- Class 的实例方法： allocate, new, superclass

- Class 类的超类是 Module, 每个类都是带有三个方法（allocate, new, superclass）的增强模块
  - Class.superclass # => Module

- 类也是对象，类也可以通过引用来访问

```ruby
my_class = MyClass
```

- 类名是常量

- 任何以大写字母开头的引用（包括类名和模块名）都是常量
- 常量有自己独特的作用域规则
  - 常量就像文件系统中的文件
  - 模块和类就像是文件目录
- 常量也可以通过路径来标识：M::C::X
  - 双冒号开头表示路径的根位置


- Module#constants 返回当前范围类的所有常量
- Module.constants 返回当前程序中所有顶层常量
- Module.nesting 返回当前代码所在路径
- 总之，类就是一个对象（Class 类的实例）外加一组实例方法和一个对其超类的引用
  - Class 类是 Module 类的子类，一个类也是一个模块

- require 与 load 的区别：
  - require 方法对每个文件只加载一次
  - 而 load 方法在每次调用时都会再次运行所加载的文件


## 方法是如何执行的

### 方法查找

- 接受者：就是调用方法所在的对象
- 祖先链： 一个类找到它的超类，然后再找到超类的超类，以此类推，直到找到 BasicObject 类。在这个过程中，经历的类路径就是祖先链。
- 方法查找的过程： Ruby 首先在接收者的类中查找，然后再顺着祖先连向上查找，知道找到这个方法为止。
- 当把一个模块包含在一个类中时（使用 include 方法）, Ruby 就会把这个模块加入到该类的祖先连中，该模块在祖先链中的位置就在包含它的类之上
- 而使用 prepend 方法则会把模块插入到祖先连中包含它的该类的下方
- 一个模块在祖先链中只能出现一次

### 执行方法

- 为了执行方法，一般需要回答两个问题：
  - 方法中的实例变量属于哪个对象，如果有的话
  - 应该在哪个对象上调用该方法

- Ruby 的每一行代码都会在一个对象中被执行， 这个对象就是当前对象 self

- 任何时刻，只有一个对象能充当当前对象
- 调用一个方法时，接收者就成为 self
- private 方法只能通过隐性的接收者调用
- 在类和模块定义中，self 的校色由这个类或模块本身担任

### 细化 Refinement

- Refinement 可以用来解决猴子补丁带来的问题
- 首先需要定义一模块
- 然后在模块的定义中调用 refine 方法

```ruby
module StringExtensions
  refine String do
    def to_alphanumeric
      gsub(/[^\w\s]/, '')
    end
  end
end
```
- 为了让这些变化生效，必须调用 using 方法

```ruby
using StringExtensions
```

- 可以在模块内部调用 using 方法
- 细化和打开类相似，区别在于细化不是全局性的
- 细化只在两种场合有效：
  - refine 代码内部
  - 从 using 语句的位置开始到模块结束，或者到文件结束
- 在细化中定义的代码具有优先权
- 细化一个类就像是把一个补丁直接打到原有代码上一样
- 细化的陷阱
  - 被细化的方法如果在另一个方法中被调用，可能细化不生效
  - 在使用细化之前，要仔细检查方法的调用情况