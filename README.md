# bed-frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm start
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Environment

Before deploy please adapt the .env file or generate corresponding environment variables as in the .env.example file.

### Deployment

To deploy the front-end to Google Cloud follow these steps:

* Create the Docker image using the Dockerfile
* Push the Docker image to Harbor container registry
* Run the Terraform templates to deploy your Docker container

To build the container image locally run the docker build command. After completion you can run a Docker container locally using for example Docker Desktop

```
docker build -t <name> .
```

To make the Docker image available to run containers on external compute services you need to store the image somewhere. This can be done on the Harbor docker registry. First login to the Harbor docker registry using docker login:

```
docker login -u <<deltares_email>> -p <<cli_secret>> https://containers.deltares.nl
```

After that tag the container image using the docker tag command:

```
docker tag <<local_container_name>> https://containers.deltares.nl/<<Harbor Project name>>/<<Image Repository Name>>:<<Tag>>
```

And push your Docker image to the Docker registry using the docker push command:

```
docker push https://containers.deltares.nl/<<Harbor Project name>>/<<Image Repository Name>>:<<Tag>>
```

If you do not yet have a project in Harbor please request a project via DSC Support: https://publicwiki.deltares.nl/display/GIT/Harbor
