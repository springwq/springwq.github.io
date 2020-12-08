---
title: Ruby 元编程读书笔记 - 类定义
date: 2020-12-07 15:20:29
tags: [Ruby, Metaprogramming, Class]
---

在 Ruby 中类的定义有所不同。使用 class 关键字时，不仅是在规定对象的行为方式，也是在运行代码。

<!--more-->

## 类定义

### 深入类定义

- 一般认为定义类就是定义方法
- 其实，可以再类定义中放入任何代码
- 类定义也会返回最后一条语句

### 当前类

- 总有一个当前类（或模块）存在
- 定义一个方法时，这个方法就成为当前类的一个实例方法
- 在程序的顶层，当前类是 Object
- 在一个方法中，当前列就是当前对象的类
- 当用 class 关键字打开一个类时（或者用 module 模块打开模块时），这类成为当前类


#### class_eval 方法

- class_eval 可以在不知道类名字的情况下打开一个类
- class_eval 会同时修改 self 和当前类
- Module#class_eval 比 class 关键字更灵活
  - 可以对任何代表类的变量使用 class_eval, 而 class 关键字只能使用常量
  - class 关键字会打开一个新的作用域，而 class_eval 则使用扁平作用域
- class_exec/module_exec 接受额外的代码块作为参数
- 通过我们用 install_eval 打开非类对象；而用 class_eval 打开类定义，然后用 def 定义方法。

### 类实例变量

- 在类定义时，定义的实例变量,即类对象的实例变量叫做类实例变量

```ruby
class MyClass
  @my_var = 1
end
```

- 在类中 以 @@ 大头的叫做类变量

```ruby
class MyClass
  @@v =1
end
```

- 类变量与类实例变量不同，它们可以被子类或类的实例被锁使用
- 类变量并真正属于类，而是属于类体系结构；一般尽量避免使用类变量

## 单件方法 Singleton Methods

- 只对单个对象生效的方法，成为单件方法

```ruby
str = "a string"

def str.title?
  self.updcase == self
end
```

### 类方法

- 类方法的实际上就是一个类对象的单件方法
- Ruby 中对象类型并不严格与类相关，类型只是对象能相应的一组方法，这种概念成为 duck typing

### 类宏 Class Macro

- attr_reader, attr_writer, attr_accessor 称为类宏


## 单件类 Singleton Class

### 单件类定义

- 一个对象特有的隐藏类，被称为该对象的单件类，或 metaclass, eigenclass
- 每个单件类只有一个实例，而且不能被继承
- 单件类是一个对象的单件方法存活之所
- Object#singleton_class 返回单件类的引用

```ruby
"abc".singleton_class
```

- 也可通过 class << 语法获取单件类

```ruby
obj = Object.new

singleton_class = class << obj
  self
end

singleton_class.class
```

### 关于方法查找

- 如果对象有单件类，Ruby 不是从它所在对象的类开始查找，而是从对象的单件类中开始查找方法
- 对象的单例方法就存在对象的单例类中
- 单件类的超类就是超类的单件类

#### Ruby 对象模型的七条规则

- 只有一种对象： 普通对象或模块
- 只有一种模块：普通模块、一个类或一个单件类
- 只有一种方法，它存在于一个模块中 - 通常是在一个类中
- 每个对象（包括类）都有自己的 “真正的类”：普通类或单件类
- 除了 BasicObject 类没有超类外，每个类有且只有一个祖先： 一个类或模块
- 一个对象的单件类的超类是这个对象的类：一个类的单件类的超类就是这个类的超类的单件类
- 调用一个方法时，Ruby 先进入接收者真正的类，然后进入祖先链

#### 定义类方法的三种语法

```ruby
def MyClass.a_class_method;end

class MyClass
  def self.another_class_method;end
end

class MyClass
  class << self
    def yet_another_class_method;end
  end
end
```

#### 单件类和 instance_eval

- instance_eval 也会修改当前类，他会把当前类修改为接收者的单件类；即 instance_eval 可定义单件方法

```ruby
s1, s2 = 'abc', 'def'

s1.instance_eval do
  def swoosh!; reverse; end
end

s1.swoosh! # => 'cba'
s2.respond_to?(:swoosh!) # => false
```

#### 类属性

- 一般可通过类宏给对象创造属性，如果要给类创建属性，可在单件类中定义类宏
- 在单例类中定义的方法，实际上会成为类方法

```ruby
class MyClass
  class << self
    attr_accessor :c
  end
end
```

#### 类方法和 include 方法

- 类扩展通过向类的单件类中添加模块来定义类方法
- 类方法其实是单件方法的特例
- 对象也可以在其单件类中通过 include module 的方式来扩展方法，成为对象扩展

#### Object#extend

- class 中通过 extend 引入的 module 中的方法是类方法
- class 中通过 incdule 引入的 module 中的方法是实例方法


## 方法包装器

有三种方式，可将一个方法包装另外一个方法

### 环绕别名 Around Alias

- alias_method 可以给 Ruby 方法取别名
- 如果要在顶级作用域中修改方法，需使用 alias 关键字
- 使用 alias_method 重新定义方法时，并不真正修改这个方法，只要老方法还存在一个绑定的名字，仍旧可以调用
- 可通过如下三个步骤编写环绕别名
  - 给方法定义一个别名
  - 重定义这个方法
  - 在新的方法中调用老的方法
- 环绕别名也是一种猴子补丁，是全局性的

### 细化封装器 Refinement Wrapper

- 在细化方法中调用 super, 则会调用哪个没有细化的原始方法，这种技巧成为细化包装器
- 细化包装器的作用范围知道文件末尾处


### 下包含包装器 Prepended Wrapper

- Module#prepend 方法会把包含的模块插在祖先链中该类的下方
- 被 prepend 方法包含的模块可以覆写改类的同名方法，同时可以通过super 调用该类中的原始方法
- 以上技术称为下包含包装器，一般认为它比细化包装和环绕别名更明晰
