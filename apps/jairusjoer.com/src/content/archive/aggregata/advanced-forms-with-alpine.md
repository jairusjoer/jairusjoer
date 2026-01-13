---
title: 'Advanced forms with Alpine.js'
date: 2024-02-05
description: 'Visualise validation errors in your backend for input elements with Alpine.js and improve the user experience of your forms. Read more in this article.'
---

## Visualise validation errors in your backend

If you are not yet familiar with working on forms with Alpine.js, you can refresh your knowledge in our first article on this topic, [Interactive forms with Alpine.js](https://aggregata.de/interactive-forms-with-alpine/).

In our first article on interactive forms with Alpine.js, we already indicated that Alpine.js can also be used to influence individual elements in addition to the general display of server-side information in the form.

Due to popular demand, we have decided to take up precisely this topic in this follow-up article and show examples of how you can use information and states to validate a form with Alpine.js.

### Setup

For this demonstration, we are using our [Astro Boilerplate](https://github.com/aggregata/astro-boilerplate), which we have already presented in detail in an [earlier article](https://aggregata.de/astro-an-introduction-to-your-next-project/).

If our boilerplate isn’t right for you, that’s not a problem. The steps for validating form entries work in any project with Alpine.js.

### Integrating methods for Alpine.js

In order to be able to access the required data and methods from Alpine.js in the further course of the implementation, these are first declared in order to avoid errors in the further course.

#### `form.ts`

`form()` controls the `loading` state and saves the `Response` sent by the server via the `submit()` method, which is executed when the form is submitted.

A fictitious `fakeResponse()` is also included, which “receives” exemplary and simplified validation errors from our fictitious backend.

```ts
import { sleep } from '../utilities';

export const form = () => ({
  loading: false,
  response: null as unknown,
  async submit(event: SubmitEvent) {
    this.loading = true;
    this.response = null;
    const formData = new FormData(event.target as HTMLFormElement);

    const fakeResponse = async () => {
      await sleep(1000);
      return {
        errors: {
          username: 'Username is already taken',
          password: 'Password is too short',
        },
      };
    };

    this.response = await fakeResponse();
    this.loading = false;
  },
});
```

#### `input.ts`

`input.ts` handles the display of validation errors for an input element via the `validate()` method, which is integrated via the [`x-effect`](https://alpinejs.dev/directives/effect) attribute in order to recalculate the data for display when the form is submitted.

```ts
export const input = () => ({
  error: null as unknown,
  validate() {
    if (!this.response?.errors?.[this.$el.name]) return (this.error = null);
    this.error = this.response.errors[this.$el.name];
  },
});
```

#### `globals.ts`

Finally, the methods declared for Alpine.js are imported for this step and registered in the EventListener `alpine:init` in order to be able to access the required scopes.

```ts
import Alpine from 'alpinejs';
import { app } from './alpine/app';
import { form } from './alpine/form';
import { input } from './alpine/input';

document.addEventListener('alpine:init', () => {
  Alpine.data('app', app);
  Alpine.data('form', form);
  Alpine.data('input', input);
});

Alpine.start();
```

### Declaring optional utility methods

So that we can also use names for input elements as labels, we create the method `capitalize`, which splits strings written in kebab-case (e.g.: `"email-address"`) and capitalises each word.

```ts
export const capitalize = (string: string) => {
  return string
    .split('-')
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
};
```

### Creating pages and components in Astro

In the following step, we create the pages and components we need for the form. We define an `<Input />` component and integrate it into the form block.

#### `input.astro`

`input.astro` combines the elements `<input />` and `<label>` in one component and also contains the representation of the validation errors, which are mapped via the Alpine context `input`.

```astro
---
import { capitalize } from '@/scripts/utilities';
const { name, ...props } = Astro.props;
---

<div
  class="relative font-medium"
  x-data="input"
>
  <div
    class="pointer-events-none absolute inset-x-4 top-3 flex items-center gap-1 overflow-hidden text-xs leading-4 transition-colors"
    x-bind:class="error && 'text-rose-500'"
  >
    <label
      class="mr-auto"
      for={name}
      title={capitalize(name)}
    >
      {capitalize(name)}{props?.required && '*'}
    </label>
    <div
      class="ml-3 flex justify-end gap-1 overflow-hidden"
      x-cloak
      x-show="error"
      x-transition
    >
      <span
        class="truncate"
        x-text="error"
      ></span>
    </div>
  </div>
  <input
    class="text-foreground disabled:bg-muted w-full rounded-xl border bg-transparent px-4 pt-7 pb-3 leading-6 transition-colors invalid:border-rose-500"
    x-bind:class="error && 'border-rose-500'"
    {name}
    {...props}
    x-effect="validate"
  />
</div>
```

#### `index.astro`

`index.astro` represents our form block and uses the predefined component `<Input />` and supplements its logic with the `form` context so that errors from the `response` object can be displayed.

```astro
---
import Root from '@/layouts/root.astro';
import Input from '@/components/input.astro';
const meta = { title: 'Advanced forms with Alpine.js' };
---

<Root {meta}>
  <main>
    <form
      class="grid gap-2 p-6"
      x-data="form"
      x-on:submit.prevent="submit"
    >
      <Input
        id="username"
        name="username"
        type="email"
        required
        placeholder="tim@apple.com"
        x-bind:disabled="loading"
      />
      <Input
        id="password"
        name="password"
        type="password"
        required
        placeholder="Your password"
        x-bind:disabled="loading"
      />
      <button
        class="bg-primary text-primary-foreground h-12 rounded-xl font-medium transition-opacity disabled:opacity-50"
        type="submit"
        x-bind:disabled="loading"
      >
        Submit
      </button>
    </form>
  </main>
</Root>
```

### TL;DR

With Alpine.js, we demonstrate how validation errors from the backend are dynamically displayed in a form and how input elements react to corresponding events in the browser.
