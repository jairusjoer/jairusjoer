---
title: 'Markdown Style Guide'
date: 2026-01-01
status: 'Draft'
---

> This reference is based on [Adam Pritchard's Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet)

This is intended as a quick reference and showcase. For more complete info, see [John Gruber's original spec](http://daringfireball.net/projects/markdown/) and the [Github-flavored Markdown info page](http://github.github.com/github-flavored-markdown/).

---

## Table of Contents

- [Headers](#headers)
- [Emphasis](#emphasis)
- [Lists](#lists)
- [Links](#links)
- [Images](#images)
- [Code and Syntax Highlighting](#code-and-syntax-highlighting)
- [Footnotes](#footnotes)
- [Tables](#tables)
- [Blockquotes](#blockquotes)
- [Inline HTML](#inline-html)
- [Horizontal Rule](#horizontal-rule)
- [Line Breaks](#line-breaks)
- [YouTube Videos](#youtube-videos)
- [Details Element](#details-element)

---

## Headers

```md
# H1

## H2

### H3

#### H4

##### H5

###### H6
```

# H1

## H2

### H3

#### H4

##### H5

###### H6

---

## Emphasis

```md
Emphasis, aka italics, with _asterisks_ or _underscores_.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

Marked text uses the HTML mark tag. <mark>marked text</mark>
```

Emphasis, aka italics, with *asterisks* or *underscores*.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and *underscores***.

Strikethrough uses two tildes. ~~Scratch this.~~

Marked text uses the HTML mark tag. <mark>marked text</mark>

---

## Lists

```md
1. First ordered list item
2. Another item
   - Unordered sub-list.
3. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.
   Note that this line is separate, but within the same paragraph.
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

- Unordered list item
- Another item
  - Unordered sub-list.
- And another item

- [ ] Task list item
  - [x] Completed task list item
```

1. First ordered list item
2. Another item
   - Unordered sub-list.

3. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list

4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.
   Note that this line is separate, but within the same paragraph.
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

- Unordered list item
- Another item
  - Unordered sub-list.
- And another item

- [ ] Task list item
  - [x] Completed task list item

---

## Links

There are two ways to create links.

```md
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
https://www.example.com or <https://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: https://slashdot.org
[link text itself]: https://www.reddit.com
```

[I'm an inline-style link](https://www.google.com/)

[I'm an inline-style link with title](https://www.google.com/ "Google's Homepage")

[I'm a reference-style link](https://www.mozilla.org/)

[I'm a relative reference to a repository file](https://github.com/adam-p/markdown-here/blob/master/LICENSE)

[You can use numbers for reference-style link definitions](https://slashdot.org/)

Or leave it empty and use the [link text itself](https://www.reddit.com/).

URLs and URLs in angle brackets will automatically get turned into links. [https://www.example.com](https://www.example.com/) or [https://www.example.com](https://www.example.com/) and sometimes example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

---

## Images

```md
Here's our logo (hover to see the title text):

Inline-style: ![alt text](https://picsum.photos/40/40 'Logo Title Text 1')

Reference-style:
![alt text][logo]

[logo]: https://picsum.photos/600/400 'Logo Title Text 2'

<picture>
  <img
    src="https://picsum.photos/600/400"
    alt="A random image from picsum.photos"
  />
</picture>

<figure>
  <img
    src="https://picsum.photos/600/400"
    alt="A random image from picsum.photos"
  />
  <figcaption>Figure 1: A random image from picsum.photos</figcaption>
</figure>
```

Here's our logo (hover to see the title text):

Inline-style: ![alt text](https://picsum.photos/40/40 'Logo Title Text 1')

Reference-style:
![alt text][logo]

[logo]: https://picsum.photos/600/400 'Logo Title Text 2'

`<picture>` element appearance (if supported by the renderer):

<picture>
  <img
    src="https://picsum.photos/600/400"
    alt="A random image from picsum.photos"
  />
</picture>

`figure` and `figcaption` appearance:

<figure>
  <img
    src="https://picsum.photos/600/400"
    alt="A random image from picsum.photos"
  />
  <figcaption>Figure 1: A random image from picsum.photos</figcaption>
</figure>

---

## Code and Syntax Highlighting

Code blocks are part of the Markdown spec, but syntax highlighting isn't. However, many renderers -- like Github's and *Markdown Here* -- support syntax highlighting. Which languages are supported and how those language names should be written will vary from renderer to renderer. *Markdown Here* supports highlighting for dozens of languages (and not-really-languages, like diffs and HTTP headers); to see the complete list, and how to write the language names, see the [highlight.js demo page](https://highlightjs.org/demo).

```md
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

Blocks of code are either fenced by lines with three back-ticks ` ``` `, or are indented with four spaces. I recommend only using the fenced code blocks -- they're easier and only they support syntax highlighting.

````md
```javascript
var s = 'JavaScript syntax highlighting';
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```
````

```js
var s = 'JavaScript syntax highlighting';
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```md
No language indicated, so no syntax highlighting in Markdown Here (varies on Github).
But let's throw in a <b>tag</b>.
```

---

## Footnotes

Footnotes aren't part of the core Markdown spec, but they're [supported by GFM](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes).

```md
Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

You can also use words, to fit your writing style more closely[^note].

[^1]: My reference.

[^2]:
    Every new line should be prefixed with 2 spaces.
    This allows you to have a footnote with multiple lines.

[^note]:
    Named footnotes will still render with numbers instead of the text but allow easier identification and linking.
    This footnote also has been made with a different syntax using 4 spaces for new lines.
```

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

You can also use words, to fit your writing style more closely[^note].

[^1]: My reference.

[^2]:
    Every new line should be prefixed with 2 spaces.
    This allows you to have a footnote with multiple lines.

[^note]:
    Named footnotes will still render with numbers instead of the text but allow easier identification and linking.
    This footnote also has been made with a different syntax using 4 spaces for new lines.

---

## Tables

Tables aren't part of the core Markdown spec, but they are part of GFM and *Markdown Here* supports them. They are an easy way of adding tables to your email -- a task that would otherwise require copy-pasting from another application.

```md
There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |
```

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

---

## Blockquotes

```md
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can _put_ **Markdown** into a blockquote.
```

> Blockquotes are very handy in email to emulate reply text. This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

---

## Inline HTML

You can also use raw HTML in your Markdown, and it'll mostly work pretty well.

```html
<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
```

Definition list

Is something people use sometimes.

Markdown in HTML

Does _not_ work **very** well. Use HTML *tags*.

---

## Horizontal Rule

```md
Three or more...

---

Hyphens
```

Three or more...

---

Hyphens

---

## Line Breaks

My basic recommendation for learning how line breaks work is to experiment and discover -- hit <Enter> once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. "Markdown Toggle" is your friend.

Here are some things to try out:

```md
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a _separate paragraph_.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the _same paragraph_.
```

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also begins a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.

(Technical note: *Markdown Here* uses GFM line breaks, so there's no need to use MD's two-space line breaks.)

---

## YouTube Videos

They can't be added directly but you can add an image with a link to the video like this:

```html
<a
  href="https://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ"
  target="_blank"
>
  <img
    src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"
    alt="Rick Roll"
    width="240"
    height="180"
    border="10"
  />
</a>
```

Or, in pure Markdown, but losing the image sizing and border:

```md
[![Rick Roll](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

Referencing a bug by #bugID in your git commit links it to the issue. For example #1.

---

## Details Element

You can use the HTML `<details>` element to create collapsible sections.

```html
<details>
  <summary>Click to expand!</summary>
  This content is hidden until the user clicks "Click to expand!".
</details>
```

<details>
  <summary>Click to expand!</summary>
  My basic recommendation for learning how line breaks work is to experiment and discover -- hit [Enter] once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. "Markdown Toggle" is your friend.
</details>
