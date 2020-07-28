---
title: My Favorite Pry Features
date: 2020-07-28 17:43:01
tags: [Pry]
---

[Pry](http://pry.github.io/) is a powerful alternative to the standard IRB shell for Ruby.

Pry has 3 features are my favorite


## Edit code via line number in text editor

If we write or paste code in multiple lines, it will be difficult to fix typos in the middle. The
`edit` command of Pry will allow us edit via line number from default text editor.


A method with multiple lines, but the line number will keep the same.

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

## View documentation or source code directly

The `show-source` command is very handy to check the source code of class or method, especially with
`-d` option, it will show detail documentation as well.

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

## The ls command

If we missed some methods, constants or variables of one class, the `ls` will help.

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

