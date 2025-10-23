---
title: Trigger Pipeline Action on Specific Servers
intro: Learn how to execute pipeline actions on specific servers using the Devopness API
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - pipelines/run-pipeline
    featured:
---

## Overview
When triggering a pipeline action via API, you can optionally specify which servers should execute the action using the `servers` parameter.

## API Endpoint
POST /pipelines/{pipeline_id}/actions

## Request Body
```json
{
  "servers": [123, 456],  // Optional: Array of server IDs
  "source_ref": "main"    // Optional: Git reference for deployments
}
```

## Examples

### Example 1: Deploy to specific servers
```bash
curl -X POST https://api.devopness.com/pipelines/789/actions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "servers": [123, 456],
    "source_ref": "feature-branch"
  }'
```

### Example 2: Execute on all linked servers (default)
```bash
curl -X POST https://api.devopness.com/pipelines/789/actions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Using SDKs

### JavaScript/TypeScript
```typescript
import { DevopnessApiClient } from '@devopness/sdk-javascript';

const client = new DevopnessApiClient({ token: 'YOUR_TOKEN' });

// Execute on specific servers
await client.pipelines.actions.addPipelineAction(789, {
  servers: [123, 456],
  source_ref: 'main'
});
```

### Python
```python
from devopness import DevopnessClient

client = DevopnessClient(api_token='YOUR_TOKEN')

# Execute on specific servers
client.pipelines.actions.add_pipeline_action(
    pipeline_id=789,
    action_pipeline_create={
        'servers': [123, 456],
        'source_ref': 'main'
    }
)
```

## Use Cases

### Canary Deployment
Deploy to a canary server first, then to production servers:

```javascript
// Step 1: Deploy to canary server
const canaryAction = await client.pipelines.actions.addPipelineAction(pipelineId, {
  servers: [canaryServerId],
  source_ref: 'main'
});

// Step 2: After canary verification, deploy to production
const prodAction = await client.pipelines.actions.addPipelineAction(pipelineId, {
  servers: productionServerIds,
  source_ref: 'main'
});
```

### Service Maintenance
Restart a service on a specific server during troubleshooting:

```python
# Restart NGINX service on server 456
action = client.pipelines.actions.add_pipeline_action(
    pipeline_id=123,
    action_pipeline_create={
        'servers': [456]
    }
)
```

### Rolling Updates
Deploy to servers one at a time for zero-downtime updates:

```javascript
const serverIds = [123, 456, 789];

for (const serverId of serverIds) {
  await client.pipelines.actions.addPipelineAction(pipelineId, {
    servers: [serverId],
    source_ref: 'main'
  });
  
  // Wait for deployment to complete before next server
  await waitForActionCompletion(actionId);
}
```

## Response
The API returns an `Action` object with details about the triggered action:

```json
{
  "id": 12345,
  "status": "pending",
  "url_web_permalink": "https://app.devopness.com/actions/12345",
  "targets": [
    {
      "id": 1,
      "resource_type": "server",
      "resource_id": 123,
      "status": "pending"
    }
  ]
}
```

## Error Handling

### Invalid Server IDs
If you specify server IDs that are not linked to the resource:

```json
{
  "error": "Invalid server IDs: [999, 888]",
  "message": "The specified servers are not linked to this resource"
}
```

### No Servers Linked
If the resource has no servers linked:

```json
{
  "error": "No servers linked",
  "message": "This resource has no servers linked. Please link servers before running actions."
}
```

## Best Practices

1. **Always validate server IDs** before making API calls
2. **Use canary deployments** for critical applications
3. **Monitor action status** to ensure successful execution
4. **Handle errors gracefully** and provide meaningful feedback to users
5. **Use appropriate timeouts** for long-running actions

## Related Documentation

- [Run a Pipeline](/docs/pipelines/run-pipeline) - Web UI guide for running pipelines
- [Actions Overview](/docs/actions/) - Understanding Devopness actions
- [Link Server to Application](/docs/applications/link-server-to-application) - How to link servers to resources
