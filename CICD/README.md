# CI/CD Pipelines

## Testing Pipeline

This is the `./github/workflows/docker-test.yml` workflow.

The workflow runs on any PRs into the `dev` branch, and runs two jobs: Testing and building.

### Testing
This job verifies that all unit and integration tests run successfully.

This is done by running the `test` service within our `compose.yaml` file. 
The test service, which runs `test.dockerfile`, creates a temporary nodejs container and uses it to run the `npm test` command. 

### Building
This job verifies that the production build of the app compiles without issue. 

This is done by building (not running) the all of the services within the `prod` profile in our `compose.yaml` file (The app, run using `prod.dockerfile`, the socket server, run with `ws.dockerfile`, and the database, run with `db.dockerfile`). The job succeeds if this compose build succeeds.

## Deploying Pipelines

Our app is hosted on a AWS EC2 VM instance, which has exposed port 80 (for HTTP connections into our app) and port 8080 (for TCP connections to our websocket server).
The instance has a copy of the `compose.yaml` file located in this repository, but it contains a different set of environment variables attached to it. 
Notably, it sets the `APP_PORT` variable to `80`, so that our app container maps the port it uses for connections to our publicly exposed VM HTTP port.

The deploying of our app is handled by the `./github/workflows/docker-hub-push.yml` workflow.

It runs in two parts: Building and deploying.

### Building
In this step, the workflow builds the `prod` profile docker compose images, similar to the building step in the test pipeline.
Once a build has completed successfully, the pipeline then pushes the images onto Docker Hub under two tags: A `latest` tag (this is the tag that our VM will later pull), and a specific version number tag, like `0.3.0`.

Once the push has completed successfully, the deploy job begins.

### Deploying
Our VM instance has been configured with docker and docker compose, and already contains the necessary compose file and environment variables that it needs to run the images correctly.

To deploy the app, our workflow SSHs into our EC2 virtual machine, then:
1. It `down`'s the existing running containers, if they exist.
2. It pulls the latest version of all the necessary images it needs to run the production app.
3. It `ups` all the `prod` profile services.
