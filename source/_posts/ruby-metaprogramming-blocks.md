---
title: Ruby 元编程 - Blocks
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

```ruby
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
    C.new.instance_exec(@y) { |y| "@x: #{@x}, @y: #{y}" }
  end
end
```

- 有时，想创建一个知识为了在其中执行块的对象，这样的对象称为 Clean Room, BasicObject 往往用来充当 Clean Room

## 可调用对象 Callable Objects

- 从底层来看，使用代码块分为两步，第一步，将代码打包备用；第二步, 调用代码块（通过 yield 语句）
- 这种 “打包代码，以后调用”的机制并不是代码的专利，在 Ruby 中至少还有其他三种方法可以用来打包代码
  - 使用 proc, proc 是由代码块转换来的对象
  - 使用 lambda, 它是 proc 的变种
  - 使用方法

### Proc 对象

- 代码块 block 不是对象
- Proc 类就是由块转换来的对象
- 可以把代码块传给 Proc.new 方法来创建一个 Proc, 后面可以用 Proc#call 方法来指向这个由代码块转换而来的对象, 这种技巧称为延迟执行

```ruby
inc = Proc.new { |x| x + 1 }
inc.call(2) # => 3
```

- 另外一种 创建 proc 的方式

```ruby
dec = proc { |x| x - 1 }
dec.call(2) # => 1
```

- 通过 lambda 方式创建 proc, 有两种方式

```ruby
dec = lambda { |x| x - 1 }
dec.class # => Proc
dec.call(2) # => 1
```

```ruby
p = ->(x) { x + 1 }
```

- 要想将代码块传递给另外一个方法（或代码块），可以给这个方法添加一个特殊的参数，这个参数必须是参数列表中的最后一个，且以 & 符号开头。

```ruby
def match(a, b)
  yield(a,b)
end

def do_match(a, b, &op)
  match(a, b, &op)
end

do_match(2, 3) { |x, y| x * y } # => 6
```

- 代码块转换成 proc 对象: 加上 & 操作符
  - & 操作符含义：这是一个 Proc 对象，我想把它当做代码块来使用
  - 去掉 & 操作符，就能再次得到一个 Proc 对象

```ruby
def my_method(&the_proc)
  the_proc
end

p = my_method { |name| "Hello, #{name}" }
p.class # => Proc
p.call('Bill')
```

- Proc 转换成代码块：加上 & 操作符

```ruby
def my_method
  yield
end

my_proc = proc { "Hello World" }
my_method(&my_proc) # => Hello World

```
### Proc 与 Lambda 对比

- Proc.new 方法，proc 方法， lambda 方法，& 操作符，都会返回一个 Proc 对象
- 用 lambda 方法创建的 Pro 成为 lambda, 而用其它方式创建的则成为 proc
  - 可以使用 Proc#lambda? 方法监测 Proc 是不是 lambda

#### Proc 与 Lambda 的重要差别之一: return 关键字表现不同

- lambda 中，return 仅从这个 lambda 中返回
- proc 中, return 不是从 proc 中返回，而是从定义 proc 的作用域返回

#### Proc 与 Lambda 的重要差别之二： 参数数量检查方式

- 如果调用 lambda 时的参数数量不对，就会跑出 ArgumentError 错误
- 如果调用 proc 时的参数数量不对，则会把传来的参数调整成自己期望的参数形式

#### 对比结论

- lambda 更直观，更像是一个方法
- lambda 对参数要求严格，在调用 return 时只是从代码中返回

## Method 对象

- 调用 Kernal#method 方法，可以获得一个用 Method 对象表示的方法，并能够通过 Method#call 方法进行调用
- 通过 Method#to_proc 方法，可以把 Method 对象转换为 Proc
- define_method 可以把代码块转换为方法
- Method 对象在它自身所在对象的作用有中执行
