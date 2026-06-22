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

# H1

## H2

### H3

#### H4

##### H5

###### H6

---

## Emphasis

Emphasis, aka italics, with *asterisks* or *underscores*.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and *underscores***.

Strikethrough uses two tildes. ~~Scratch this.~~

Marked text uses the HTML mark tag. <mark>marked text</mark>

---

## Lists

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
  - [x] Completed task child list item

---

## Links

There are two ways to create links.

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

Here's our logo (hover to see the title text):

Inline-style: ![alt text](https://picsum.photos/40/40 'Logo Title Text 1')

Reference-style:
![alt text][logo]

[logo]: /og/writing/style.png 'Logo Title Text 2'

`<picture>` element appearance (if supported by the renderer):

<picture>
  <img
    src="/og/writing/style.png"
    alt="A random image from picsum.photos"
  />
</picture>

`figure` and `figcaption` appearance:

<figure>
  <img
    src="/og/writing/style.png"
    alt="A random image from picsum.photos"
  />
  <figcaption>Figure 1: A random image from picsum.photos</figcaption>
</figure>

---

## Code and Syntax Highlighting

Code blocks are part of the Markdown spec, but syntax highlighting isn't. However, many renderers -- like Github's and *Markdown Here* -- support syntax highlighting. Which languages are supported and how those language names should be written will vary from renderer to renderer. *Markdown Here* supports highlighting for dozens of languages (and not-really-languages, like diffs and HTTP headers); to see the complete list, and how to write the language names, see the [highlight.js demo page](https://highlightjs.org/demo).

Inline `code` has `back-ticks around` it.

Blocks of code are either fenced by lines with three back-ticks ` ``` `, or are indented with four spaces. I recommend only using the fenced code blocks -- they're easier and only they support syntax highlighting.

```js
// --- Demonstration of imports ---

// Importing named exports and the default export
import defaultAnimal, { add, person } from './module.js';
// Importing everything from the module as an alias
import * as Module from './module.js';

// --- Demonstration of exports ---

// Named exports
export const person = { name: 'Alice', age: 30 };

export function add(x, y = 0) {
  return x + y;
}

// Default export
const defaultAnimal = { name: 'Default Animal' };
export default defaultAnimal;

// Generator function
export function* idGenerator() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

// Using typeof for runtime type checks
console.log(typeof person); // object
console.log(add(2, 3)); // 5
console.log(defaultAnimal); // { name: "Default Animal" }

// Emulating 'satisfies' behavior using runtime checks
function createAnimal(animal) {
  if (typeof animal.name === 'string') {
    return animal; // Ensures the animal has a 'name' property
  }
  throw new Error('Animal must have a name');
}

const dog = createAnimal({ name: 'Buddy', breed: 'Golden Retriever' });
console.log(dog); // { name: 'Buddy', breed: 'Golden Retriever' }

// Generator usage
const generator = Module.idGenerator();
console.log(generator.next().value); // 0
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2

// Handling a generic-like behavior by allowing any type and runtime checks
function identity(arg) {
  return arg;
}

let str = identity('Hello');
let num = identity(42);
console.log(str, num); // "Hello", 42

// Emulating default generics by using default parameters
function wrapInArray(value = '') {
  return [value];
}

const stringArray = wrapInArray(); // Default is empty string
const numberArray = wrapInArray(42); // Passes 42 explicitly
console.log(stringArray, numberArray); // [""] , [42]

// --- for-of and for-in loops ---

// for-of: Iterates over iterable objects like arrays, strings, maps, etc.
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
  console.log(fruit); // Outputs: apple, banana, cherry
}

// for-in: Iterates over enumerable properties of an object
const car = { make: 'Tesla', model: 'Model S', year: 2021 };
for (const key in car) {
  if (car.hasOwnProperty(key)) {
    console.log(`${key}: ${car[key]}`); // Outputs key-value pairs of car object
  }
}

// --- IIFE (Immediately Invoked Function Expression) ---

(function () {
  console.log("This IIFE runs immediately after it's defined.");
  const privateVar = "I'm private inside the IIFE!";
  console.log(privateVar); // Accessing the private variable inside the IIFE
})();

// --- Using a generator to loop indefinitely ---
function* infiniteGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const gen = infiniteGenerator();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1

// --- Async and Await ---

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Example usage of async function
fetchData('https://jsonplaceholder.typicode.com/todos/1')
  .then((data) => console.log(data)) // Outputs fetched data
  .catch((error) => console.error(error));

// JSDoc type annotations
/**
 * @typedef {Object} Task
 * @property {string} title
 * @property {boolean} completed
 */

/**
 * Create a task
 * @param {Task} task
 * @returns {Task}
 */
function createTask(task) {
  return task;
}

const myTask = createTask({
  title: 'Learn JavaScript',
  completed: false,
});
console.log(myTask);

// Importing everything as a namespace (simulated for demonstration)
console.log(Module.person); // { name: "Alice", age: 30 }
console.log(Module.add(10, 20)); // 30
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

Here is a simple footnote[^1].

A footnote can also have multiple references[^1][^2].

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

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

---

## Blockquotes

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

Three or more of `-`…

---

… will generate a horizonal rule.

---

## Line Breaks

My basic recommendation for learning how line breaks work is to experiment and discover -- hit <Enter> once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. "Markdown Toggle" is your friend.

Here are some things to try out:

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

<details>
  <summary>Click to expand!</summary>
  My basic recommendation for learning how line breaks work is to experiment and discover -- hit [Enter] once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens.

You'll soon learn to get what you want. "Markdown Toggle" is your friend.

</details>
