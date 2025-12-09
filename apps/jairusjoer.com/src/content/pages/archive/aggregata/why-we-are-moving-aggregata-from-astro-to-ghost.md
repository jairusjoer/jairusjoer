---
title: Why we are moving Aggregata from Astro to Ghost
description: As Aggregata continues to evolve, we're committed to providing the optimal platform for our content. Read more about our decision to move from Astro to Ghost as an significant step towards enabling a more feature-rich content experience.
date: 2024-05-13
---

Aggregata started out as a small project with the intention of sharing our knowledge on current topics with everyone. As the number of articles grew, so did our requirements for providing insightful content.

Our stack primarily uses Astro and MDX to publish our content. While MDX is an excellent choice for writing technical articles, our frequent schedule began to outpace our ability to expand content management while integrating more complex features.

It was at this point that we opened up the possibility of moving our ever-growing blog to a more robust solution, optimized for frequent content publishing.

## Why we're moving

Over the course of two months, we identified desirable requirements for the future of our platform. Knowing that the quality of our content was paramount, we began to sort through our newly discovered requirements.

| Technical             | Functional             |
| --------------------- | ---------------------- |
| Open source           | Content management     |
| Self hostable         | Publishing workflow    |
| Secure environment    | Newsletter support     |
| Active community      | User management        |
| Customizable presence | Membership integration |

With our requirements in mind, we set out to determine how we could implement the desired features while maintaining our technical requirements.

We concluded early on that our current in-house development approach would not be sustainable in the near future. Outsourcing to a backend service seemed promising, but did not fully meet our requirements.

It was there that we rediscovered [Ghost](https://ghost.org/) as a publishing platform. A lot had changed since our last visit, so we were intrigued and delved into [all the features that had been released](https://ghost.org/changelog/) in the meantime.

## How we chose Ghost

Ghost hit the sweet spot of our functional and technical requirements. Having worked with Ghost on private projects in the past, we were already familiar with its core functionality and ready to evaluate it's new features.

To prove that Ghost would be sufficient for our future needs, we considered and discussed all of the above scenarios and some of their possible variations in several meetings before further investigating Ghost.

Ghost positioned itself as our preferred choice in the late stages of discussions. Although Ghost has some pain points in terms of advanced multilingual behavior, we were prepared to commit to our plan.

## What Ghost solves

Ghost's content management system and it's publishing workflow will replace our previous static MDX files. While we'll miss the flexibility of MDX, we'll carry on it's spirit by utilizing custom HTML components to support custom features like plots.

Integrated user management and newsletters will allow us to connect with our readers on a more personal and direct level. Personalizing your experience on Aggregata and delivering the latest posts to your inbox will make our content more accessible and enjoyable.

Memberships will be a way for you to support our efforts to create great content. While there are no current plans for implementation, rest assured that our current and future content will be accessible regardless of membership.

## What's to come

For now, there won't be much difference to your current experience of Aggregata. Articles will continue to be published every two weeks while we work in the background to bring you a new experience in the coming months.

Our move to Ghost marks a new milestone in Aggregata's development and we are sure you will be as excited as we are about the future of our content.

Finally, this is not a farewell to Astro. Astro will serve as an archive in our revamped blog to provide the original Aggregata experience and will continue to accompany us in future projects.

## TL;DR

We're moving from Astro to Ghost as our primary publishing platform. You can expect many more features as we refine our publishing workflow.
