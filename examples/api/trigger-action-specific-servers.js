/**
 * Example: Trigger pipeline action on specific servers
 * 
 * Use case: Deploy application to a canary server before full deployment
 */

import { DevopnessApiClient } from '@devopness/sdk-javascript';

const client = new DevopnessApiClient({
  token: process.env.DEVOPNESS_TOKEN
});

async function canaryDeploy() {
  const pipelineId = 789;
  const canaryServerId = 123;
  const productionServerIds = [456, 789];
  
  try {
    // Step 1: Deploy to canary server
    console.log('Deploying to canary server...');
    const canaryAction = await client.pipelines.actions.addPipelineAction(
      pipelineId,
      {
        servers: [canaryServerId],
        source_ref: 'main'
      }
    );
    
    console.log(`Canary deployment started: ${canaryAction.data.id}`);
    console.log(`View at: ${canaryAction.data.url_web_permalink}`);
    
    // Step 2: Wait for canary to complete and verify
    // (In production, you'd monitor the action status and run tests)
    
    // Step 3: Deploy to production servers
    console.log('Deploying to production servers...');
    const prodAction = await client.pipelines.actions.addPipelineAction(
      pipelineId,
      {
        servers: productionServerIds,
        source_ref: 'main'
      }
    );
    
    console.log(`Production deployment started: ${prodAction.data.id}`);
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }
}

// Example: Restart service on a single server
async function restartServiceOnServer(pipelineId, serverId) {
  try {
    const action = await client.pipelines.actions.addPipelineAction(
      pipelineId,
      {
        servers: [serverId]
      }
    );
    
    console.log(`Service restart initiated on server ${serverId}`);
    console.log(`Action ID: ${action.data.id}`);
    console.log(`View at: ${action.data.url_web_permalink}`);
    
    return action.data;
    
  } catch (error) {
    console.error(`Failed to restart service on server ${serverId}:`, error.message);
    throw error;
  }
}

// Example: Execute on all linked servers (default behavior)
async function deployToAllServers(pipelineId) {
  try {
    const action = await client.pipelines.actions.addPipelineAction(
      pipelineId,
      {
        // No servers parameter = execute on all linked servers
        source_ref: 'main'
      }
    );
    
    console.log(`Deployment to all servers started: ${action.data.id}`);
    return action.data;
    
  } catch (error) {
    console.error('Failed to deploy to all servers:', error.message);
    throw error;
  }
}

// Export functions for use in other modules
export {
  canaryDeploy,
  restartServiceOnServer,
  deployToAllServers
};

// Run canary deployment if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  canaryDeploy();
}
