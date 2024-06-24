---
title:  Ruby 元编程 - Eval and Hook
date: 2020-12-09 10:15:56
tags: [Ruby, Metaprogramming]
---

使用 Kernal#eval 和 Hook methods 能实现编写代码的代码

<!--more-->

## Kernal#eval 方法
### 定义

- Kernal#eval 方法会执行字符串中的代码，并返回执行结果

### Binding Objects

- Binding 就是一个用对象表示的完整作用域
- Kernal#binding 方法可以用来创建 Binding 对象
- Binding 对象可以看做是比块更“纯净”的闭包，因为它们只包含作用域而不包含代码
- TOPLEVEL_BINDING 表示顶级作用域的 Binding 对象

```ruby
class MyClass
  def my_method
    @x = 1
    binding
  end
end

b = MyClass.new.my_method

eval "@x", b  # => 1
```

### Sting of Code vs. Blocks

- eval 与 instance_eval 和 class_eval 不同，它只能执行代码字符串，不能执行代码块
- instance_eval 和 class_eval 可以执行代码字符串

### eval 方法的麻烦

- Ruby 在执行字符串前不会对它进行语法检查，容易导致程序在运行时出错
- 代码注入攻击
- 防止代码注入的几种方式
  - 限制 eval 方法只执行自己写的字符串
  - 使用 define_method 和 send 进行替换 eval

### 污染对象和安全级别

- Ruby 会自动把不安全的独享笔记为污染对象
- tainted? 方法用来判断一个对象是不是被污染了
- 有四种安全级别： 从 0 到 3， 以及升高

### Checked Attributes 功能实现

#### 使用 eval 方法编写 add_checked_attribute 方法

```ruby
require 'test/unit'

class Person; end

class TestCheckedAttribute < Test::Unit::TestCase
  def setup
    add_checked_attribute(Person, :age)
    @bob = Person.new
  end

  def test_accepts_valid_values
    @bob.age = 20
    assert_equal 20, @bob.age
  end

  def test_refuses_nil_values
    assert_raises RuntimeError, 'Invalid attribute' do
      @bob.age = nil
    end
  end

  def test_refuses_false_values
    assert_raises RuntimeError, 'Invalid attribute' do
      @bob.age = false
    end
  end
end
```

```ruby
def add_checked_attribute(klass, attribute)
  eval "
    class #{klass}
      def #{attribute}=(value)
        raise 'Invalid attribute’ unless value
        @#{attribute} = value
      end

      def #{attribute}()
        @#{attribute}
      end
    end
  "
end
```

#### 去掉 eval 方法, 重构 add_checked_attribute 方法

```ruby
def add_checked_attribute(klass, attribute)
  klass.class_eval do
    define_method "#{attribute}=" do |value|
      raise 'Invalid attribute' unless value
      instance_variable_set("@#{attribute}", value)
    end

    define_method attribute do
      instance_variable_get "@#{attribute}"
    end
  end
end
```

#### 给 add_checked_attribute 加上属性校验

```ruby
require 'test/unit'

class Person; end

class TestCheckedAttribute < Test::Unit::TestCase
  def setup
    add_checked_attribute(Person, :age) { |v| v >= 18 }
    @bob = Person.new
  end

  def test_accepts_valid_values
    @bob.age = 20
    assert_equal 20, @bob.age
  end

  def test_refuses_invalid_values
    assert_raises RuntimeError, 'Invalid attribute' do
      @bob.age = 17
    end
  end
end
```

```ruby
def add_checked_attribute(klass, attribute, &validation)
  klass.class_eval do
    define_method "#{attribute}=" do |value|
      raise 'Invalid attribute' unless validation.call(value)
      instance_variable_set("@#{attribute}", value)
    end

    define_method attribute do
      instance_variable_get "@#{attribute}"
    end
  end
end
```

#### 把 add_checked_attribute 变成类宏，对所有类可用

```ruby
require 'test/unit'

class Person
  attr_checked :age do |v|
    v >= 18
  end
end

class TestCheckedAttribute < Test::Unit::TestCase
  def setup
    @bob = Person.new
  end

  def test_accepts_valid_values
    @bob.age = 20
    assert_equal 20, @bob.age
  end

  def test_refuses_invalid_values
    assert_raises RuntimeError, 'Invalid attribute' do
      @bob.age = 17
    end
  end
end
```

```ruby
class Class
  def attr_checked(attribute, &validation)
    define_method "#{attribute}=" do |value|
      raise 'Invalid attribute' unless validation.call(value)
      instance_variable_set("@#{attribute}", value)
    end

    define_method attribute do
      instance_variable_get "@#{attribute}"
    end
  end
end
```

## Hook Methods

- Class#inherited 是 Class 的一个实例方法，当一个类被集成时，Ruby 会调用这种方法
- Class#inherited 这种方法被称为 Hook Methods

### 更多的钩子方法

### 只对实例方法生效的钩子方法

- Module#included
- Module#prepended
- Module#extend_object
- Module#method_added
- Module#method_removed
- Module#method_undefined


### 对单例方法生效的钩子方法

- BasicObject#singleton_method_added
- BasicObject#singleton_method_removed
- BasicObject#singleton_method_undefined


### 普通方法也可实现钩子方法的效果

- 覆写 Module#include 方法也可实现 Module#included 的效果


```ruby
module M; end

class C
  def self.include(*modules)
    puts "Called: C.include(#{modules})"
    super
  end

  include M
end
```

### 实例 - 限制对 attr_checked 的访问

```ruby
require 'test/unit'

class Person
  include CheckedAttributes

  attr_checked :age do |v|
    v >= 18
  end
end

class TestCheckedAttribute < Test::Unit::TestCase
  def setup
    @bob = Person.new
  end

  def test_accepts_valid_values
    @bob.age = 20
    assert_equal 20, @bob.age
  end

  def test_refuses_invalid_values
    assert_raises RuntimeError, 'Invalid attribute' do
      @bob.age = 17
    end
  end
end
```

```ruby
module CheckedAttributes
  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def attr_checked(attribute, &validation)
      define_method "#{attribute}=" do |value|
        raise 'Invalid attribute' unless validation.call(value)
        instance_variable_set("@#{attribute}", value)
      end

      define_method attribute do
        instance_variable_get "@#{attribute}"
      end
    end
  end
end
```
