---
title: Ruby 元编程学习笔记 - Blocks
date: 2020-11-20 16:15:07
tags: [Ruby, Metaprogramming]
---

代码块（block）可以用来控制作用域（scope）, 作用域是变量和方法的可用性范围。块只是“可调用对象”大家族中的一员，还有像 proc 和 lambda 这样的对象。

<!--more-->

## Blocks

- 代码块可以用大括号定义，也可以用 do...end 关键字定义

```ruby
def a_method(a, b)
  a + yield(a, b)
end

a_method(1, 2) { |x, y| (x + y) *3 }
```

- 只有在定义一个方法时，才可以定义一个块。块会被直接传递给这个方法，该方法可以用 yield 关键字调用这个块
- 块可以有自己的参数。另外，块的最后一行代码执行的结果会被作为返回值
- 在一个方法里，可以询问当前方法是否包含块。通过 Kernel#block_given?

```ruby
def a_method
  return 'no block' unless block_given?
  yield
end
```

## Closures

- 代码块之所以能运行，是因为它既包含代码，也包含一组绑定（binding）
- 定义一个代码块时，它会获取环境中的绑定
- 当块被传递给一个方法时，它会带着这些绑定一块进入该方法
- 还可以在代码块内定义额外的绑定，但这些绑定在代码块结束时就消失了
- 基以上特性，人们喜欢把代码块成为闭包（Closure）。代码块可以获取局部绑定，并一直带着他们

### 作用域 Scope

- Kernal#local_variables 返回当前作用域内的本地变量，可以用来跟踪绑定的名字
- Ruby 的作用域之间是截然分开的，一旦进入一个新的作用域，原来的绑定会被替换为一组新的绑定
- 绑定（尤其是局部变量）在切换作用域时很容易失效

### 作用域门 Scope Gate

- 程序会在三个地方关闭前一个作用域，同时打开一个新作用域
  - 类定义：class 关键字作为标志
  - 模块定义：module 关键字作为标志
  - 方法：def 关键字作为标志

- 在类定义和模块定义中行的代码会立即执行
- 在方法中定义的代码不会立即执行

### 扁平化作用域  Flatting the Scope

- 如何让绑定穿越 class 作用域门
  - 将 class 关键字替换为某个非作用域门的东西，比如方法调用
  - 如果能用方法替换 class, 就能在一个闭包中获取 class 作用门之外的本地变量
  - Class.new 就是这样的方法

- 如何让绑定穿越 def 作用域门
  - 可以使用 Module#define_method 来替代 def

```ruby
my_var = 'Success'

MyClass = Class.new do
  puts "#{my_var} in the class definition"

  define_method :my_methdo do
    "#{my_var} in the method"
  end
end
```

- 使用方法来替代作用域门，就可以让一个作用域看到另外一个作用域里的变量
  - 这种技巧，称为嵌套文法作用域（nested lexical scopes）或扁平化作用域（flatting the scope）

- 如果想要在一组方法之间共享一个变量，但有不希望其它方法访问这个变量，可以把这些方法定义在那个变量所在的边坡作用域里。这种用来共享变量的技巧成为共享作用域

```ruby
def define_methods
  shared = 0
  Kernel.send :define_method, :counter do
    Shared
  end

  Kernel.send :define_method, :inc do |x|
    shared += x
  end
end
```

- 闭包总结
  - 每个 Ruby 作用域都包含一组绑定。不同的作用域之间被作用域门分隔
  - 要想让某个绑定穿越作用域，可以使用代码块。
    - 一个代码块是一个闭包
    - 当定义一个代码块是，它会捕获当前环境中的绑定，并带着它们四处流动
  - 可以使用 Class.new 方法代替 class 关键字，用 Module.new 代替 module 关键字, 用 Module#define_method 方法来代替 def 关键字。这就是扁平化作用域

  - 如果一个扁平作用于中定义了多个方法，把这些方法用一个作用域门保护起来，它们就可以共享绑定，这种技巧成为共享作用域

## instance_eval 方法

- BasicObject#instance_eval

```rubyi
class MyClass
  def initialize
    @y = 1
  end
end

obj = MyClass.new

obj.instance_eval do
  self
  @v
end
```

- instance_eval 运行时，代码块的接收者会成为 self, 因此它可以访问接收者的私有方法和实例变量

- 一般把传递给 instance_eval 方法的代码块称为上下文探针 （Context Probe）
- instance_exec 方法，比 instance_eval 灵活一点，允许对代码块传入参数

```ruby
class D
  def twisted_method
    @y = 2
    C.new.instance_exec(@y) { |y| "@x: #{@x}, #y: #{y}" }
  end
end
```
