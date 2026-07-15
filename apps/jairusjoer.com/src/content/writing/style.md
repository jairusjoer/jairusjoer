---
title: 'Markdown Style Guide'
date: 2026-01-01
status: 'Draft'
---

A reference document demonstrating every element styled by the `.prose` CSS layer, plus the common inline text options not explicitly covered by it (sup, sub, s, del, ins, u, and friends).

---

## Headings

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

---

## Paragraphs & Links

This is a standard paragraph. It exists to show the default text color, font family, size, and line height applied by `.prose`, along with the block-start spacing (`--prose-flow`) that separates it from whatever came before.

Here's a second paragraph so you can see that rhythm repeat. It also contains a [regular link](https://example.com) and, right after it in the same sentence, [another link](https://example.com) — links are colored with the accent color and underlined, with the underline solidifying on hover.

---

## Inline Semantics

**Bold text** uses `strong`/`b` at weight 600.

_Italic text_ uses standard emphasis.

<mark>Highlighted text</mark> uses a tinted accent-color background.

An abbreviation with a tooltip: <abbr title="Cascading Style Sheets">CSS</abbr> — dotted underline, help cursor on hover.

### Common options not explicitly styled by this CSS (inherit browser defaults)

- Superscript: E = mc<sup>2</sup>
- Subscript: H<sub>2</sub>O
- Strikethrough (`~~`): ~~this text is struck through~~
- Deleted text (`<del>`): <del>this text was removed</del>
- Inserted text (`<ins>`): <ins>this text was added</ins>
- Underline (`<u>`): <u>this text is underlined</u>
- Small print (`<small>`): <small>this text is small</small>
- Citation (`<cite>`): <cite>The Great Gatsby</cite>
- Inline quote (`<q>`): <q>this is a short inline quotation</q>
- Variable (`<var>`): <var>x</var> = <var>y</var> + 2
- Sample output (`<samp>`): <samp>Segmentation fault (core dumped)</samp>

---

## Lists

### Unordered (disc → circle → square)

- Level one item
  - Level two item
    - Level three item
- Another level one item

### Ordered (decimal)

1. First step
2. Second step
3. Third step

### Ordered with `type` attributes

<ol type="a">
<li>Lower-alpha item</li>
<li>Another lower-alpha item</li>
</ol>

<ol type="i">
<li>Lower-roman item</li>
<li>Another lower-roman item</li>
</ol>

<ol type="A">
<li>Upper-alpha item</li>
<li>Another upper-alpha item</li>
</ol>

<ol type="I">
<li>Upper-roman item</li>
<li>Another upper-roman item</li>
</ol>

### GFM task list

- [x] Ship the prose stylesheet
  - [x] Write the style guide
- [ ] Another design sign-off done

---

## Disclosures

<details>
<summary>Click to expand</summary>

Hidden content revealed on toggle. The `summary` marker inherits the muted foreground color used for list markers.

</details>

---

## Keyboard Keys

Save the file with <kbd>Ctrl</kbd> + <kbd>S</kbd>, or force quit with <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>Esc</kbd>.

---

## Definition List

<dl>
  <dt>Specificity</dt>
  <dd>A measure of which CSS rule wins when several rules apply to the same element.</dd>
  <dt>Cascade</dt>
  <dt>Cascading</dt>
  <dd>The order in which conflicting declarations are resolved.</dd>
</dl>

---

## Code

Inline code, like `const x = 1;`, sits on a muted background with a monospace font.

A fenced code block:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

---

## Blockquote

> Design is not just what it looks like and feels like. Design is how it works.
>
> A second paragraph inside the same blockquote, indented with the left rule.

---

## Divider

Some content above the rule.

---

Some content below the rule.

---

## Footnotes

Here's a claim that needs backing up[^1], and another one right after it[^2].

[^1]: This is the first footnote's content.

[^2]: This is the second footnote's content.

---

<!--
## Math

Inline math: <math>$E = mc^2$</math> appears within a sentence.

Block math:

<math display="block">
$$
\int_{a}^{b} f(x)\, dx = F(b) - F(a)
$$
</math>

---
-->

## Media

An image (scales to container width, rounded corners):

![Placeholder image](https://placehold.co/600x300)

A figure with a caption:

<figure>
  <img src="https://placehold.co/600x300" alt="Placeholder figure image">
  <figcaption>Figure 1 — captions are centered, smaller, and muted.</figcaption>
</figure>

---

## Tables

| Plan       | Storage | Price/mo | Popular |
| ---------- | :-----: | -------: | :-----: |
| Free       |  5 GB   |       $0 |         |
| Pro        | 100 GB  |      $12 |    ✓    |
| Enterprise |  1 TB   |   Custom |         |

For wide tables, wrap in a `.prose-scroll` container so the table scrolls horizontally instead of compressing:

<div class="prose-scroll">

| Metric  | Jan  | Feb  | Mar  | Apr  | May  | Jun  | Jul  | Aug  | Sep  | Oct  | Nov  | Dec  |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Visits  | 1.2k | 1.4k | 1.1k | 1.6k | 1.8k | 2.0k | 2.1k | 1.9k | 1.7k | 1.5k | 1.3k | 1.6k |
| Signups | 80   | 95   | 70   | 110  | 130  | 150  | 160  | 140  | 120  | 100  | 90   | 115  |

</div>

---

## Nested Content Rhythm

Blocks inside list items use a tighter margin than top-level blocks:

- A list item with a nested blockquote:
  > Nested quotes sit closer to their parent item than a top-level blockquote would.
- A list item with a nested code block:
  ```bash
  echo "tighter spacing here too"
  ```
