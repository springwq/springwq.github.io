---
layout: post
title: "Ruby 中的 Block 和 Iterator"
date: 2015-05-16 00:13:41 +0800
comments: true
categories: Ruby
---
## Block

### 定义
 
```ruby
some_array.each { |value| puts value + 3 }

sum = 0
other_array.each do |value|
  sum += value
  puts value / sum
end
```

* A block is somewhat like the body of an anonymous method
* Block can take parameters
* Block 只有被 method 调用时才会起作用，如果 method 中有参数，block 出现在最后面

### Block 中的变量

- 如果 block 的本地变量的名字和 block 之外但是在同样 scope 里面的 变量名字一样，那他们两个是一样的。block 内变量的值会改变 block 外变量的值。

```ruby
sum = 0
[1,2,3,4].each do |value|
  sum += value
  puts value / sum
end
puts sum  # => 30
```

- 如果 block 中的变量只出现在 block 中，那么它只是 block 中本地变量，无法在 block 之外被引用。

```ruby
sum = 0
[1,2,3,4].each do |value|
  square = value * value
  sum += square
end
puts sum  # => 30
puts square # undefined local variable or method 'square' for main:Object <NameError>
```

- Parameters to a block are always local to a block, even if they have the same name as locals in the surrounding scope.

```ruby
value =  "some shape"
[1,2].each { |value| puts value }
puts value

# 1
# 2
# some shape
```

- You can define a block-local variables by putting them after s semicolon in the block's parameter list

```ruby
square = "some shape"
sum = 0
[1,2,3,4].each do |value; square|
    square = value * value
    sum += square
end
puts sum # 30
puts square # some shape
```
By making square block-local, values assigned inside the block will not affect the value of the variable with the same name in the outer scope.

### Blocks for Transactions

You can use blocks to define a chunk of code that must be run under some kind of transnational control

```ruby
class File
  def self.open_and_process(*args)
    f = File.open(*args)
    yield f
    f.close
  end
end

File.open_and_process("testfile","r") do |file|
  while line = file.gets 
    puts line
  end
end
```

### Blocks Can Be Objects
You can convert a block into an object, store it in variables, pass it around, and then invoke its code later.

如果 method 的最后一个参数前面有 & 符号 （&action）, 那么当此 method 被调用时，Ruby 会找一个 code block, 这个 code block 被转换成 class Proc 的一个对象。

```ruby
class ProcExample
  def pass_in_block(&action)
    @stored_proc = action
  end

  def use_proc(parameter)
    @store_proc.call(parameter)
  end
end

eg = ProcExample.new
eg.pass_in_block { |param| puts "The parameter is #{param}"  }
eg.use_proc(99)
# => The parameter is 99
```

```ruby
def create_block_object(&block)
  block
end

bo = create_block_object { |param| puts "You called me with #{param}" }
bo.call 99  # => You called me with 99
bo.call "cat" # => You called me with cat
```
Ruby have two built-in methods that convert a block to an object: lambda and Proc.new

```ruby
bo = lambda { |param| puts "You called me with #{param}" }
bo.call 99 # => You called me with 99
```

### Blocks Can Be Closures

Closure: Variables in the surrounding scope that are referenced in a block remain accessible accessible for the life of that block and the life on any Proc object created from that block.

```ruby
def n_times(thing)
  lambda {|n| thing * n}
end

p1 = n_times(23)
p1.call(3) #=> 69
p2.call(4) #=> 92

def power_proc_generator
  value = 1
  lambda { value += value }
end

power_proc = power_proc_generator
puts power_proc.call # 2
puts power_proc.call # 4
```

lambda 表达式的另一种简写方式

```ruby
lambda { |params| ... }
# 与下面的写法等价
-> params { ... }
# parmas 是可选的
```

```ruby
proc1 = -> arg1, arg2 {puts "#{arg1} #{arg2}"}

proc1.call "hello", "world"
# => hello world

proc2 = -> { "Hello World" }
proc2.call # => Hello World
```

### Block Parameter List
Blocks can take default values, splat args, keyword args and a block parameter

```ruby
proc = -> a, *b, &block do 
  puts "a = #{a.inspect}"
  puts "b = #{b.inspect}"
  block.call
end

proc.call(1,2,3,4) {puts "in block"}
# a = 1
# b = [2,3,4]
# in block
```


## Iterator

### 定义
A Ruby iterator is simple a method that can invoke a block of code.

> 1. Block 一般是跟着 method 出现的, 并且 block 中的代码不一定会执行
> 2. 如果 method 中有 `yield`, 那么它的block 中的代码会被执行
> 3. Block 可以接收参数，和返回 value

```ruby
def two_times
    yield
    yield
end
two_times { puts "Hello" }
# Hello
# Hello
```

```ruby
def fib_up_to(max)
  i1, i2 = 1. 1
  while i1 <= max
      yield i1
      i1, i2 = i2, i1 + i2
  end
end

fib_up_to(1000) { |f| print f, " " }

# 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

* 上面代码中的 yield 之后的 `i1` 会作为 parameter 传入到 block 中， 赋值给 block 的 argument `f`。
* Block 中可以有多个 arguments.


### 常见的 iterator

#### each

each is probable the simplest iterator - all it does is yield successive elements of its collection.

```ruby
[1, 3, 5, 7, 9].each { |i| puts i }

# 1 
# 3
# 5
# 7
# 9
```

#### find

A blocl may also return a value to the method. The value of the last expression evaluated in the block is passed back to the method as the value of the yield.

```ruby
class Array
  def find
    each do |value|
        return value if yield(value)
    end
  end
end

[1,3,4,7,9].find { |v| V*V > 30 } # => 7
```

#### collect (also known as map)

Which takes each element from the collection and passes it to the block. The results returned by the block are used to construct a new array

```ruby
["H", "A", "L"].collect { |x| x.succ } # => ["I", "B", "M"]
```

### inject
The inject method lets you accumulate a value across the members of a collection.

```ruby
[1,3,5,7].inject { |sum, element| sum + element } # => 16

# sum = 1, element = 3
# sum = 4, element = 5
# sum = 9, element = 7
# sum = 16

[1,3,5,6].inject { |product, element| product*element } # => 105
```

If `inject` is called with no parameter, it uses the first element of the collections as the initial value and starts the iteration with the second value.

上面代码的另一种简便写法：

```ruby
[1,3,5,7].inject(:+) # => 16
[1,3,5,7]/inject(:*) # => 105
```


### Iterator 和 I/O 系统的交互

Iterators 不仅仅能够访问 Array 和 Hash 中的数据， 和可以和 I/O 系统交互

```ruby
f = File.open("testfile")
f.each do |line|
  puts "The line is: #{line}"
end
f.close

produces:
The line is: This is line one
The line is: This is line two
The line is: This is line three
```

## Parameter 和 Argument

目前，我的理解是 Parameter 是实际参数，而 Argument 是形式参数
