---
title: 'Accessibility - a Necessity, not an Afterthought'
description: Learn how accessibility and its design patterns benefit businesses and users alike, and find practical resources and tools to improve your site's accessibility.
date: 2024-07-08
---

The 2024 [The WebAIM Million](https://webaim.org/projects/million/) report highlights recent advances and setbacks in web accessibility (a18y). Reading the report inspired us to share some of our experiences with web accessibility.

Given its growing importance in the design and development of modern front-ends, we'll provide an overview of its current situation, resources, tools and examples of accessible websites to further the development of an inclusive internet.

WebAIM reports,

> Over the last 5 years, the pages with detectable WCAG failures have decreased by only 1.9% from 97.8%[^1].

The report delves into the details of the current situation and provides positive examples, which we'll highlight in this article.

> Want to learn more about accessible design? Check out our article on [developing design systems with accessibility in mind](https://aggregata.de/develop-design-systems-with-accessibility-in-mind/)

Before we delve into improving these numbers, let's recapture the essence of accessibility on the web. Accessibility as defined by the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/#guidelines) can be broken down in four overarching principles.

> MDN offers a [comprehensive introduction to accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Information_for_Web_authors) regarding these topics and defines in its guide [Understanding the Web Content Accessibility Guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG) these four principles as the following:

- [Perceivable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable): Users must be able to perceive it in some way, using one or more of their senses.
- [Operable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Operable): Users must be able to control UI elements (e.g. buttons must be clickable in some way — mouse, keyboard, voice command, etc.).
- [Understandable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Understandable): The content must be understandable to its users.
- [Robust](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Robust): The content must be developed using well-adopted web standards that will work across different browsers, now and in the future.

## The Necessity for Accessibility

While accessibility slowly pushes further into the market, it still might be perceived as an afterthought when it comes to development. Concerns such as task complexity and required resources and the profitability of a comprehensive implementation might come to mind.

In particular, in the case of business sense, the W3C provides resources to assist in the transition to or establishment of accessibility within organizations and/or products, which we'll explore further into the article.

### Equal Access and Inclusion

First and foremost though, web accessibility is for the benefit of everyone and a common ground for equal access and inclusion. The internet and subsequently its contents should be accessible and consumable for everyone regardless of disability.

Individuals, small businesses, and corporations are already incorporating or are in the process of incorporating values based on accessibility principles to create websites that are equally accessible to all.

Notable design and development resources based on these principles are published by leading organizations, including [IBM](https://www.ibm.com/able/), [Nordhealth](https://nordhealth.design/accessibility-checklist/) and [Atlassian](https://atlassian.design/foundations/accessibility), among others.

### Business Sense

To challenge previous assumptions about implementing accessibility features into a product in a business sense, consider the following four key takeaways when undertaking such a task. These takeaways will further the development and return on investment for the product in question.

- **Drive Innovation**
  - Solving accessibility challenges at hand will lead to a better overall user experience
  - Diverse users and their experience will produce better usage and analytics data
- **Enhance Your Brand**
  - Promote social responsibility through practiced accessibility
  - Diversify the workforce by employing accessible technology
- **Increase Market Reach**
  - 15% of the global population have at least one recognized disability[^2]
  - $6.9 trillion in annual disposable income captured in untapped users[^3]
- **Minimize Legal Risk**
  - Both the [EU](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility) and the [US](https://www.ada.gov/) are introducing legislations to enforce accessibility
  - Legislations especially target public-facing institutions and corporations

While these takeaways are an abbreviated summary of the W3C's insightful article [The Business Case for Digital Accessibility](https://www.w3.org/WAI/business-case/), the following quote from Paul Smyth best sums up the business sense for adopting accessible patterns:

> Many organizations are waking up to the fact that embracing accessibility leads to multiple benefits – reducing legal risks, strengthening brand presence, improving customer experience and colleague productivity.
> — Paul Smyth, Head of Digital Accessibility, Barclays, via [W3C](https://www.w3.org/WAI/business-case/)

### Improving the User Experience

As mentioned before, solving accessibility challenges at hand will lead to a better overall user experience. Users and power users alike will benefit from progressive enhancements, which in overall will improve the overall look and feel of the website.

Popular component primitive libraries such as [Radix UI](https://www.radix-ui.com/primitives) deliver an improved user experience by building on accessibility standards and serving as a building block for your own implementation of components.

Providing a foundation of guidelines, such as primitives or components, and their correct implementation through documentation lays the groundwork for the gradual but steady expansion of accessibility standards within a website.

## Examples of Accessibility Implementations

### shadcn/ui

We have already mentioned Radix UI, and you may already be familiar with a particularly popular implementation of it: [shadcn/ui](https://ui.shadcn.com/). This component reference provides components built from Radix primitives that you can copy and paste into your code.

Combined with Next.js, it has had quite an impact on user interface development and is often seen in the wild. Next.js in particular, looking back at the WebAIM Million report, has carved out a leading position in measured positive differences in average of accessibility errors[^1].

> Next.js exhibited a -27.1% difference from the 41.4 average number of errors in both JavaScript and Web frameworks compared to last year[^1].

### U.S. Web Design System

The [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) is an official effort to consistently unify and provide accessibility and design patterns to federal websites through a standardized design system.

[In a recent article](https://www.technologyreview.com/2024/06/26/1093656/us-government-website-design-accessibility/), the MIT Technology Review provided a concise introduction to the motivation, history, and scope of the project, which also gave rise to the accompanying open-source typeface for the project: [Public Sans](https://public-sans.digital.gov/).

The documentation of the USWDS is comprehensive and provides a wealth of information on the implementation of accessible patterns. It is a valuable resource for those interested in developing holistic practices that embrace accessibility.

> .gov domains experienced a -64.2% difference from the 20.3 average number of errors compared to last year[^1], according to the WebAIM Million report.

## Getting Started with Accessibility

Asserting the current situation of your website can be done using [Lighthouse](https://developer.chrome.com/docs/lighthouse), which is built into all browsers built on Chromium. The process of measuring can further be automated using tools such as [Unlighthouse](https://unlighthouse.dev/), which crawls and audits websites.

Lighthouse is equipped to handle WCAG 2.2 Level A & AA[^4]. Fore a more comprehensive approach, I'd like to recommend Microsoft's [Accessibility Insights](https://accessibilityinsights.io/) extension, which offers multiple assessment methods to validate the accessibility level of your site o a step-by-step basis.

It is important to note that both tools provide a comprehensive overview of the elements that require attention and offer a wealth of resources to assist in resolving accessibility issues with a given website.

### Further resources

Tools of the trade are a great start to discover and resolve major accessibility issues in your website. Regarding minor issues and those unseen by unaffected users, more theoretical approaches and patterns can be found in the following resources and sources:

- [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/). W3C
- [Understanding the Web Content Accessibility Guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG). MDN
- [Introduction to Web Accessibility](https://webaim.org/intro/). WebAIM

## TL;DR

Web accessibility is essential for creating an inclusive digital world. By ensuring equal access and inclusion, individuals and businesses can reach a wider audience, enhance their brand, and minimize legal risks.

## Sources

[^1]: [The WebAIM Million](https://webaim.org/projects/million). WebAIM (2024)

[^2]: [Disability Inclusion Overview](http://www.worldbank.org/en/topic/disability). The World Bank (2018)

[^3]: [Richard Branson Supports People With Disabilities – Here Are Six Ways You Can Do It, Too](https://www.forbes.com/sites/gaudianohunt/2016/10/31/richard-branson-supports-disabilities/#4da9aa36788e). Gaudiano, P. and Hunt, E.; Forbes.com (2016)

[^4]: [WCAG 2.0 Level A & AA Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md). dequelabs/axe-core (2024)
