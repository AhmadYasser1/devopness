---
title: Actions
intro: Devopness creates an “action” every time you need to run a pipeline to perform single-step or multi-step operations on resources in your project environments.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

## What are actions and action steps?
An “action” is the execution of a pipeline.

As in our daily routine of managing software projects we need to “take an action” to fix or improve something, that’s exactly what Devopness does for you and your team:
- Devopness executes actions in an automated, predictable and reliable way, so your team can get repetitive tasks done without manual work

Each step in a pipeline becomes an action step, that is then executed by Devopness according to how a pipeline was configured at that point in time.

For your convenience, each action step output log is made available for you in Devopness action details view.

## Server Targeting
When triggering pipeline actions, you can specify which servers should execute the action. This allows for:
- **Canary deployments**: Deploy to a single server first for testing
- **Selective maintenance**: Restart services on specific servers
- **Rolling updates**: Deploy to servers one at a time for zero-downtime updates

See [Trigger Pipeline Action on Specific Servers](/docs/api/trigger-pipeline-action-specific-servers) for API usage examples.
