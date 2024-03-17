<div align="center">

# Node Labs

This project contains a collection of Proof-of-Concept (POC) implementations using Node.

[Getting Started](#getting-started)

</div>

## Getting Started

1. Set the `DOCKER_USER` environment variable:
   
   - ```bash
     export DOCKER_USER="$(id -u):$(id -g)"
     ```

1. Install the dependencies:

   - ```bash
     docker compose run -ti --rm app yarn --frozen-lockfile
     ```

1. Start asserting your solution by running the test file:

   - ```bash
     docker compose run -ti --rm --service-ports app yarn workspace <workspace> <command>
     ```

1. This runs `yarn` in a Docker container. Alternatively, you can use `yarn` installed in your local machine.
