---
title: Implementing Server Selection UI
intro: Guide for implementing server selection UI in the Devopness web application
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - api/trigger-pipeline-action-specific-servers
    featured:
---

# Implementing Server Selection UI

## Overview
This guide is for implementing the server selection UI in the Devopness web application.

## Backend API Support
The backend already supports server selection via the `servers` parameter in `ActionPipelineCreate`:

```typescript
interface ActionPipelineCreate {
  servers?: number[];      // Array of server IDs to target
  source_type?: SourceType;
  source_ref?: string;
}
```

## UI Requirements

### 1. Pipeline Execution Dialog
When users trigger a pipeline action, show a server selection interface:

- Display list of servers linked to the resource
- Show server details: hostname, IP address, provider
- Allow multi-select (checkboxes or multi-select dropdown)
- Default: No servers selected (executes on all)
- Validation: At least one server must be selectable

### 2. Recommended Components
Use `@devopness/ui-react` components:
- `Select` component with `isMulti` prop for multi-select
- `CheckBox` component for server list
- `FormText` for helper text explaining the feature

### 3. Example Implementation

```typescript
import { Select, CheckBox, FormText } from '@devopness/ui-react';
import { useState } from 'react';

interface Server {
  id: number;
  hostname: string;
  ip_address: string;
}

function PipelineExecutionForm({ 
  pipelineId, 
  linkedServers 
}: {
  pipelineId: number;
  linkedServers: Server[];
}) {
  const [selectedServerIds, setSelectedServerIds] = useState<number[]>([]);
  
  const handleSubmit = async () => {
    await client.pipelines.actions.addPipelineAction(pipelineId, {
      servers: selectedServerIds.length > 0 ? selectedServerIds : undefined,
      source_ref: 'main'
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormText>
        Select specific servers to execute this action, or leave empty to execute on all linked servers.
      </FormText>
      
      <Select
        isMulti
        options={linkedServers.map(s => ({
          value: s.id,
          label: `${s.hostname} (${s.ip_address})`
        }))}
        onChange={(selected) => setSelectedServerIds(selected.map(s => s.value))}
        placeholder="All servers (default)"
      />
      
      <button type="submit">Execute Pipeline</button>
    </form>
  );
}
```

### 4. User Experience Considerations
- Show server count: "Execute on 2 of 5 servers" vs "Execute on all 5 servers"
- Highlight if action will execute on subset vs all servers
- Add confirmation dialog if executing on subset
- Show action targets in action details view

## Implementation Steps

### Step 1: Add Server Selection to Pipeline Execution Form

1. **Import required components:**
   ```typescript
   import { Select, FormText, CheckBox } from '@devopness/ui-react';
   ```

2. **Add state for selected servers:**
   ```typescript
   const [selectedServers, setSelectedServers] = useState<number[]>([]);
   ```

3. **Create server options from linked servers:**
   ```typescript
   const serverOptions = linkedServers.map(server => ({
     value: server.id,
     label: `${server.hostname} (${server.ip_address})`
   }));
   ```

### Step 2: Update API Call

Modify the pipeline action API call to include the `servers` parameter:

```typescript
const actionData = {
  servers: selectedServers.length > 0 ? selectedServers : undefined,
  source_ref: sourceRef
};

await client.pipelines.actions.addPipelineAction(pipelineId, actionData);
```

### Step 3: Add Validation

Ensure at least one server is available:

```typescript
if (linkedServers.length === 0) {
  return <ErrorMessage>No servers linked to this resource</ErrorMessage>;
}
```

### Step 4: Update Action Details View

Show which servers the action is targeting:

```typescript
function ActionDetails({ action }) {
  return (
    <div>
      <h3>Action Targets</h3>
      {action.targets?.map(target => (
        <div key={target.id}>
          Server {target.resource_id}: {target.status}
        </div>
      ))}
    </div>
  );
}
```

## Testing

### Unit Tests
Test the server selection component:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PipelineExecutionForm } from './PipelineExecutionForm';

test('allows selecting specific servers', () => {
  const servers = [
    { id: 1, hostname: 'web-1', ip_address: '192.168.1.1' },
    { id: 2, hostname: 'web-2', ip_address: '192.168.1.2' }
  ];
  
  render(<PipelineExecutionForm pipelineId={123} linkedServers={servers} />);
  
  // Test server selection
  const select = screen.getByRole('combobox');
  fireEvent.click(select);
  
  // Verify server options are displayed
  expect(screen.getByText('web-1 (192.168.1.1)')).toBeInTheDocument();
  expect(screen.getByText('web-2 (192.168.1.2)')).toBeInTheDocument();
});
```

### Integration Tests
Test the complete flow:

```typescript
test('executes pipeline on selected servers', async () => {
  const mockApiCall = jest.fn();
  // Mock the API call
  
  render(<PipelineExecutionForm pipelineId={123} linkedServers={servers} />);
  
  // Select servers
  fireEvent.click(screen.getByRole('combobox'));
  fireEvent.click(screen.getByText('web-1 (192.168.1.1)'));
  
  // Submit form
  fireEvent.click(screen.getByText('Execute Pipeline'));
  
  // Verify API call includes servers parameter
  expect(mockApiCall).toHaveBeenCalledWith(123, {
    servers: [1],
    source_ref: 'main'
  });
});
```

## Accessibility

### Keyboard Navigation
- Ensure server selection is keyboard accessible
- Provide clear focus indicators
- Support arrow keys for navigation

### Screen Reader Support
- Add proper ARIA labels
- Announce server selection changes
- Provide descriptive text for server options

```typescript
<Select
  isMulti
  options={serverOptions}
  aria-label="Select servers for pipeline execution"
  aria-describedby="server-selection-help"
/>
```

## Performance Considerations

### Large Server Lists
For resources with many linked servers:

1. **Implement virtualization** for large lists
2. **Add search/filter functionality**
3. **Consider pagination** for very large server sets

```typescript
const [searchTerm, setSearchTerm] = useState('');

const filteredServers = useMemo(() => {
  return linkedServers.filter(server =>
    server.hostname.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [linkedServers, searchTerm]);
```

## Related Documentation

- [API Documentation](/docs/api/trigger-pipeline-action-specific-servers) - Backend API usage
- [Run a Pipeline](/docs/pipelines/run-pipeline) - User-facing documentation
- [UI Component Library](https://github.com/devopness/devopness/tree/main/packages/ui/react) - Available components
