---
title: The future of the web might be native
description: The ever-expanding catalog of web-native technologies and features offered by your browser often goes unnoticed or untapped in real-world projects. Today, we're changing that paradigm and explore applicable patterns for your projects.
date: 2025-05-31
---

The Web has changed dramatically since its inception in the early 1990s. What began as a simple document sharing system with basic HTML has evolved into a sophisticated application platform capable of supporting complex, interactive experiences.

Its history of development has been marked by cycles of centralization and decentralization. From early browser-native capabilities, to a shift to client-side JavaScript frameworks and external dependencies, to the return of server-side applications.

## A paradox emerges

Today's browsers are technical marvels, packed with deeply integrated features and capabilities just waiting to be exploited. Yet, paradoxically, many developers remain unaware of these advances or choose to implement dependencies that replicate functionality that is already built in.

This paradox creates a peculiar situation where projects become increasingly bloated with dependencies that replicate functionality already built into the browser. All the while, the solution - leveraging the native capabilities of the browser - is overlooked.

The paradox may stem from a self-perpetuating cycle where education gaps, framework ecosystems, and organizational inertia reinforce reliance on familiar dependencies while discouraging exploration of browser-native capabilities.

## The current state

A dependency-based approach to browser issues has taken hold for a variety of valid historical reasons. From significant feature gaps to compatibility issues, dependencies have emerged to bridge the gap between browsers.

In particular, jQuery was an early and strong advocate for implementing common functionality across browsers. Today, efforts such as the Interop project, supported by major companies such as Apple, Google, and Mozilla, are enforcing common features and compatibility across the board.

[GitHub - web-platform-tests/interop: web-platform-tests Interop project](https://github.com/web-platform-tests/interop)

Over the past 10 years, browsers have consolidated into a standardized and mature ecosystem, spawning working groups to implement cross-compatible features, such as the WebExtensions Community Group (WECG).

[GitHub - w3c/webextensions: Charter and administrivia for the WebExtensions Community Group (WECG)](https://github.com/w3c/webextensions)

## The case for native

We've come a long way from the fragmented experience of a decade ago, and while the legacy of cross-browser compatibility may still linger in developers' minds, it's time to consider the cases for a native approach.

Browser-native capabilities reduce external dependencies and leverage cross-compatibility features to provide functionality previously reserved for those dependencies without the overhead of managing and maintaining them in a project.

A prominent and widely recognized example, which we'll discuss in the next chapter, for advocating a native approach is dialogs and form validation - both of which are already available and [fully supported in all major browsers as of March 2022](https://caniuse.com/dialog).

## Dialogs and Form Validation

### Dialogs

Dialogs used to be a challenge. Issues like focus management, context communication for assistive technologies, and UI/UX concerns such as dialog stacking, Z-index, and closing methods had to be handled in applications increasingly adopting modal-based interfaces.

The `<dialog>` HTML element addresses many of these issues, providing a customizable, modal-based approach that implements accessible and stackable dialogs in a separate top layer that is also compatible with form submission requests.

[dialog: The Dialog element - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

### Form Validation

This was also the case with form validation. Waiting for a validated response from the server for each submit request was not only slower, but also required resources to process each form over and over again until its contents fit the desired patterns.

Implementing form input validation in the client also reduces the response time and resources required to facilitate the same process. In case of incorrect input, the browser will reject the form submission request and prompt the user to correct the incorrect input.

[Client-side form validation - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)

### Practical example

In its simplest form, a modal-based form with validation can take the following shape, where the user's Email, name, and birthday are required to be entered before the form is successfully submitted and the dialog automatically closes:

```html
<dialog>
  <form method="dialog">
    <label>
      Email
      <input
        type="email"
        name="email"
        autofocus
        required
      />
    </label>
    <label>
      Name
      <input
        type="text"
        name="name"
        required
      />
    </label>
    <label>
      Birthday
      <input
        type="datetime-local"
        name="birthday"
        required
      />
    </label>
    <div>
      <button type="button">Close</button>
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </div>
  </form>
</dialog>
```

Native implementation of a modal-based form with validation

Let's take a look at the code above, starting with the `<form>` element; its submit method has been changed to `dialog`. This integrates with the `<dialog>` element to close the dialog upon successful form submission.

While the focus automatically moves to the dialog element when it is opened, we can further enhance the placement of the focus by using the [`autofocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) attribute in an `<input>` element to allow immediate input without further navigation.

To verify that our form contains all the necessary and valid information, the `type` and `required` attributes come in handy. For a more granular approach, consider [using built-in form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#using_built-in_form_validation) with advanced attributes such as `pattern`, which accepts regex.

## The case against native

For now, we've only covered the upsides of native capabilities, but as with any tool, there are downsides and possible considerations to be made when considering implementing a native-based approach in a larger project context.

Native capabilities sacrifice design control by using system UI for interfaces like form validation and selection inputs. This limitation extends to complex validation scenarios with cross-field dependencies where native solutions may be inadequate.

While native features typically perform better, they often lack customization options for complex applications. Major frameworks provide integrated components that enhance developer experience, though at the cost of increased abstraction and dependencies.

## TL;DR

Modern browsers offer powerful native features that can replace many third-party dependencies. Elements like `<dialog>` and form validation provide accessible, performant solutions out of the box, particularly for simple to moderately complex applications.

For complex applications requiring specific UI requirements or deep framework integration, traditional frameworks remain the better choice. The key is to evaluate each feature's requirements against native capabilities before reaching for external dependencies.
