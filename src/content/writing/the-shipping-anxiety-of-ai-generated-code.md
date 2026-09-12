---
title: "The Shipping Anxiety of AI-Generated Code"
date: '2026-04-02'
tags: [ai, engineering]
description: "I’ve never quite bought into the hype of the \"zero-oversight\" AI developer. If you spend five minutes on tech social media, you’ll see developers bragging about giving Claude or Gemini full access to their codebase. They talk about letting the AI write entire features, merging the pull requests, and"
---

I’ve never quite bought into the hype of the "zero-oversight" AI developer.  
If you spend five minutes on tech social media, you’ll see developers bragging about giving Claude or Gemini full access to their codebase. They talk about letting the AI write entire features, merging the pull requests, and moving on without a second thought.  
But honestly? I still haven't gotten over the feeling that the AI is eventually going to mess me up.  
I tried it once, letting AI completely handle a non-critical feature for an internal tool without my usual deep, manual review. I didn't feel the rush of 10x productivity. Instead, I felt a sudden drop in confidence. Even though it was low-stakes, there was this lingering, mild anxiety when it went live. _Did I catch every edge case? Does it actually do what I think it does?_ It highlighted the psychological trade-off of the modern stack: you might save a few hours of typing, but you buy yourself days of low-grade panic waiting for a bug report.

This isn't just about developer pride; it’s about strategic risk. AI has produced some incredible software, and I’m more than happy to let it do whatever it pleases with the frontend. If a UI component breaks or a layout shifts, it's a visual annoyance that can be quickly patched.  
But the backend is a completely different story.  
When you are building financial systems, when your platform is actively processing real money on a daily basis, the stakes change completely. I honestly still struggle with the concept of letting an LLM write critical logic for the core engine of the financial systems I work on, including [SusuPaa.](https://susupaa.com/?ref=ghost.noelzappy.dev) In fintech, a backend hallucination isn't just a broken div; it's a catastrophic breach of trust with the users relying on you to keep their funds safe.  
  
Ultimately, confidence in shipping comes from comprehension. If you don't fully understand the code, you don't really own the feature. Responsible innovation isn't about rejecting AI; it's knowing when to use it as an accelerator, and when you need to keep your own hands firmly on the wheel.
