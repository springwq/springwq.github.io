---
title: Pry 实用命令
date: 2020-07-28 17:43:01
tags: [Pry]
---

[Pry](http://pry.github.io/) is a powerful alternative to the standard IRB shell for Ruby.

Pry 有三个实用的小功能

<!--more-->

## edit 命令

在 pry 中如果输入了多行的代码，然后想要再修改，可能比较头疼。这时可以通过 edit 命令，用 pry 默认的编辑器来编辑代码

具体使用方法如下：


```
[1] pry(main)> def test_method
[1] pry(main)*   puts "Hello, Worrrld!"
[1] pry(main)* end
=> :test_method
[2] pry(main)> edit -i 1
```


```ruby
def test_method
  puts "Hello, Worrrld!"
end
```

## show-source 命令

 `show-source` 命令会查询访问或类的源代码，加上 `-d` 会显示详细的代码文档

```
7] pry(main)> show-source -d puts

From: io.c (C Method):
Owner: Kernel
Visibility: private
Signature: puts(*arg1)
Number of lines: 12

Equivalent to

    $stdout.puts(obj, ...)

static VALUE
rb_f_puts(int argc, VALUE *argv, VALUE recv)
{
    if (recv == rb_stdout) {
	return rb_io_puts(argc, argv, recv);
    }
    return rb_funcallv(rb_stdout, rb_intern("puts"), argc, argv);
}
```

## ls 命令

有时我们会忘记某一个类的方法， `ls` 能查看某一个类的方法，常量和变量


```
[9] pry(main)> ls String
Object.methods: yaml_tag
String.methods: try_convert
String#methods:
  %            chr                    freeze             reverse      sum
  *            clear                  getbyte            reverse!     swapcase
  +            codepoints             grapheme_clusters  rindex       swapcase!
  +@           concat                 gsub               rjust        to_c
  -@           count                  gsub!              rpartition   to_f
  <<           crypt                  hash               rstrip       to_i
  <=>          delete                 hex                rstrip!      to_r
  ==           delete!                include?           scan         to_s
  ===          delete_prefix          index              scrub        to_str
  =~           delete_prefix!         insert             scrub!       to_sym
  []           delete_suffix          inspect            setbyte      tr
  []=          delete_suffix!         intern             shell_split  tr!
  ascii_only?  downcase               length             shellescape  tr_s
  b            downcase!              lines              shellsplit   tr_s!
  bytes        dump                   ljust              size         undump
  bytesize     each_byte              lstrip             slice        unicode_normalize
  byteslice    each_char              lstrip!            slice!       unicode_normalize!
  capitalize   each_codepoint         match              split        unicode_normalized?
  capitalize!  each_grapheme_cluster  match?             squeeze      unpack
  casecmp      each_line              next               squeeze!     unpack1
  casecmp?     empty?                 next!              start_with?  upcase
  center       encode                 oct                strip        upcase!
  chars        encode!                ord                strip!       upto
  chomp        encoding               partition          sub          valid_encoding?
```
