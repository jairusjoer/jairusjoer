---
title: 'Interactive forms with Alpine.js'
date: 2022-11-25
description: 'In this post, I dynamize a contact form using Alpine.js to incrementally enrich the user experience.'
---

## Starting point: The form

A simple contact form serves as the starting point for the intended dynamization. The next step is to define the necessary HTML and JavaScript.

```html
<form class="form">
  <input
    class="form-input"
    name="name"
    type="text"
  />
  <input
    class="form-input"
    name="email"
    type="email"
  />
  <textarea
    class="form-input"
    name="message"
  ></textarea>
  <button type="submit">Submit</button>
</form>
```

## Integrate Alpine.js into the form

> Alpine.js installation and setup is required for this section. Read more in our post: [Include Alpine.js in a production environment](https://aggregata.de/alpine-in-a-production-environment/).

Inside the Alpine script, register the `useForm` context and define the asynchronous `post` function as follows. Note also the offloading of the data formatting to its own `data` function, which allows a more flexible inclusion of the data within the context.

The `data` function returns an object of the stored input values, while the `post` function sends data as JSON as POST to our (still) fictitious backend.

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('useForm', () => ({
    data() {
      const inputs = Array.from(this.$el.querySelectorAll('input, textarea'));
      const data = inputs.reduce((object, key) => ({ ...object, [key.name]: key.value }), {});
      return data;
    },
    async post() {
      return await (
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.data()),
        })
      ).json();
    },
  }));
});
```

In the `<form>` element we register the previously defined `useForm` context, along with the `post` function to handle data collection with Alpine. `x-on:submit.prevent` is Alpine's counterpart to `Event.preventDefault()`, interrupts the form submission and triggers the `post` function instead.

```html
<form
  class="form"
  x-data="useForm"
  x-on:submit.prevent="post"
>
  <input
    class="form-input"
    name="name"
    type="text"
  />
  <input
    class="form-input"
    name="email"
    type="email"
  />
  <textarea
    class="form-input"
    name="message"
  ></textarea>
  <button type="submit">Submit</button>
</form>
```

## Display responses dynamically

Thanks to Alpine's reactivity, responses to submitted forms can be used to provide users with immediate feedback on their requests. In the following example a simple PHP script serves as backend, which provides the form data as JSON via the variable `$json` and also returns a JSON object via `$response`.

Via `$response->state` the state of the query is defined, which is returned independently of the data. The included information is used to identify, display and communicate the response in the frontend.

```php
header("Content-type: application/json; charset=utf-8");

$json = json_decode(file_get_contents('php://input'));

$response->data = [
  // ...
];

$response->state = [
  'code' => 200,
  'type' => 'success',
  'message' => 'Your request was sent successfully.'
];

http_response_code($response->state['code']);
exit(json_encode($response));
```

In the Alpine object `response` the response of the `POST` request is stored and made accessible to the HTML frontend via the `useForm` context.

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('useForm', () => ({
    response: false,
    data() {
      const inputs = Array.from(this.$el.querySelectorAll('input, textarea'));
      const data = inputs.reduce((object, key) => ({ ...object, [key.name]: key.value }), {});
      return data;
    },
    async post() {
      this.response = await (
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.data()),
        })
      ).json();
    },
  }));
});
```

Via `x-show` the element `.form-response` is faded in by the response of the backend - here in form of a simple banner. The returned status type `success` is registered as a new class `.is-success` to influence the coloring of the banner.

```html
<form
  class="form"
  x-data="useForm"
  x-on:submit.prevent="post"
>
  <div
    class="form-response"
    x-cloak
    x-show="response"
    x-bind:class="`is-${response?.state?.type}`"
    x-text="response?.state?.message"
    x-transition
  ></div>
  <input
    class="form-input"
    name="name"
    type="text"
  />
  <input
    class="form-input"
    name="email"
    type="email"
  />
  <textarea
    class="form-input"
    name="message"
  ></textarea>
  <button type="submit">Submit</button>
</form>
```

Thus, answers from the backend can be displayed dynamically via Alpine. In a further step, this functionality could also be used to display information for the validation of individual input fields.

> Due to popular demand, we've created a follow-up article on working with advanced forms in Alpine.js. Check out our article on working with [Advanced forms with Alpine.js](https://aggregata.de/advanced-forms-with-alpine/).

## TL;DR

Alpine adds reactive features to a static form that make it easier to send, receive, and visualize information from the backend for input - using Alpine's context.
