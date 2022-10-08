---
title: 04-文档模式
image: /img/hbs.png
description: HTML 模式(版本迭代)
date: 2020-12-28 16:18:44
---

[[toc]]

## 由来

`IE5.5` 发明了文档模式的概念，即可以使用 `doctype` 切换文档模式

最初的文档模式有两种：**混杂模式**（quirks mode）和**标准模式**（standards mode）

混杂模式可以支持一些非标准的特性

标准模式可以拥有兼容行为

虽然这两种模式的主要区别只体现在通过 `CSS` 渲染的内容方面，但对 `JavaScript` 也有一些关联影响，或称为副作用

随着浏览器的普遍实现，又出现了第三种文档模式：**准标准模式**（almost standards mode）

准标准模式支持很多标准的特性，但是没有标准规定得那么严格

**混杂模式**在所有浏览器中都**以省略文档开头的 `doctype` 声明作为开关**

标准模式和准标准模式使用 `doctype` **声明开启**

### 标准模式

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
           
<!-- XHTML 1.0 Strict -->
<!DOCTYPE html PUBLIC
"-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- HTML5 -->
<!DOCTYPE html>
```

### 准标准模式

```html
<!-- HTML 4.01 Transitional -->
<!DOCTYPE HTML PUBLIC
"-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
           
<!-- HTML 4.01 Frameset -->
<!DOCTYPE HTML PUBLIC
"-//W3C//DTD HTML 4.01 Frameset//EN"
"http://www.w3.org/TR/html4/frameset.dtd">
           
<!-- XHTML 1.0 Transitional -->
<!DOCTYPE html PUBLIC
"-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
           
<!-- XHTML 1.0 Frameset -->
<!DOCTYPE html PUBLIC
"-//W3C//DTD XHTML 1.0 Frameset//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```


*准标准模式与标准模式非常接近，很少需要区分。**人们在说到“标准模式”时，可能指其中任何一个**。而对文档模式的检测也不会区分它们*