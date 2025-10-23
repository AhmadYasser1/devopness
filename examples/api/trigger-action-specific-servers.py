"""
Example: Trigger pipeline action on specific servers

Use case: Restart service on a single server during troubleshooting
"""

from devopness import DevopnessClient
import os

client = DevopnessClient(api_token=os.environ['DEVOPNESS_TOKEN'])

def restart_service_on_server(pipeline_id: int, server_id: int):
    """Restart a service on a specific server"""
    try:
        action = client.pipelines.actions.add_pipeline_action(
            pipeline_id=pipeline_id,
            action_pipeline_create={
                'servers': [server_id]
            }
        )
        
        print(f"Service restart initiated on server {server_id}")
        print(f"Action ID: {action.data.id}")
        print(f"View at: {action.data.url_web_permalink}")
        
        return action.data
        
    except Exception as e:
        print(f"Failed to restart service: {str(e)}")
        raise

def canary_deploy(pipeline_id: int, canary_server_id: int, production_server_ids: list):
    """Deploy to canary server first, then to production servers"""
    try:
        # Step 1: Deploy to canary server
        print('Deploying to canary server...')
        canary_action = client.pipelines.actions.add_pipeline_action(
            pipeline_id=pipeline_id,
            action_pipeline_create={
                'servers': [canary_server_id],
                'source_ref': 'main'
            }
        )
        
        print(f"Canary deployment started: {canary_action.data.id}")
        print(f"View at: {canary_action.data.url_web_permalink}")
        
        # Step 2: Wait for canary to complete and verify
        # (In production, you'd monitor the action status and run tests)
        
        # Step 3: Deploy to production servers
        print('Deploying to production servers...')
        prod_action = client.pipelines.actions.add_pipeline_action(
            pipeline_id=pipeline_id,
            action_pipeline_create={
                'servers': production_server_ids,
                'source_ref': 'main'
            }
        )
        
        print(f"Production deployment started: {prod_action.data.id}")
        
        return {
            'canary_action': canary_action.data,
            'production_action': prod_action.data
        }
        
    except Exception as e:
        print(f"Deployment failed: {str(e)}")
        raise

def deploy_to_all_servers(pipeline_id: int):
    """Deploy to all linked servers (default behavior)"""
    try:
        action = client.pipelines.actions.add_pipeline_action(
            pipeline_id=pipeline_id,
            action_pipeline_create={
                # No servers parameter = execute on all linked servers
                'source_ref': 'main'
            }
        )
        
        print(f"Deployment to all servers started: {action.data.id}")
        return action.data
        
    except Exception as e:
        print(f"Failed to deploy to all servers: {str(e)}")
        raise

def deploy_to_specific_servers(pipeline_id: int, server_ids: list):
    """Deploy to a specific list of servers"""
    try:
        action = client.pipelines.actions.add_pipeline_action(
            pipeline_id=pipeline_id,
            action_pipeline_create={
                'servers': server_ids,
                'source_ref': 'main'
            }
        )
        
        print(f"Deployment to servers {server_ids} started: {action.data.id}")
        print(f"View at: {action.data.url_web_permalink}")
        
        return action.data
        
    except Exception as e:
        print(f"Failed to deploy to servers {server_ids}: {str(e)}")
        raise

if __name__ == '__main__':
    # Example: Restart NGINX service on server 456
    restart_service_on_server(pipeline_id=123, server_id=456)
    
    # Example: Canary deployment
    # canary_deploy(
    #     pipeline_id=789,
    #     canary_server_id=123,
    #     production_server_ids=[456, 789]
    # )
    
    # Example: Deploy to specific servers
    # deploy_to_specific_servers(
    #     pipeline_id=789,
    #     server_ids=[123, 456]
    # )
