---
title: Run a Pipeline
intro: Run a deploy pipeline to apply a network rule to a server.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - network-rule:deploy
---

:::note

A network rule and deploy pipeline were chosen as examples, the steps are the same to run pipelines of all operations in all environment's resources

:::

1. On Devopness, navigate to a project then select an environment
1. Find the `Network Rules` card
1. Click `View` in the `Network Rules` card to see a list of existing `Network Rules`
1. In the list of network rules, find the network rule you want to run a pipeline and click the `NAME` of the network rule
1. Click the `PIPELINES` tab
1. In the list of pipelines, find the deploy pipeline you want to run and click `DEPLOY`
1. (Optional) Select specific servers for action execution
    - If the resource is linked to multiple servers, you can choose which servers should execute the action
    - By default, if no servers are selected, the action will execute on all linked servers
    - To select specific servers:
        - Check the boxes next to the servers you want to target
        - At least one server must be selected
    - This is useful when you need to:
        - Deploy an application to only one server for testing
        - Restart a service on a specific server without affecting others
        - Perform maintenance on individual servers
1. Follow the prompts then click `DEPLOY`
    - The form confirm button will be labeled according to the pipeline operation

    :::note

    To run a deploy pipeline at least one server must be linked to the resource.

    If there are no servers linked to the network rule, follow the guide [/docs/applications/link-server-to-application]

    :::

1. Wait for the action `network-rule:deploy` to be completed
