### Prerequisites
Before you begin, make sure you have the following installed:

Docker: Follow the instructions for your operating system to download and install Docker.
Clone the Repository

First, clone the repository containing the application:
```bash
git clone https://github.com/okeyonyia/loggerator-client.git
cd loggerator-client
```

### Build the Docker Image
From the root directory of the repository, build the Docker image by running:

```bash
docker build -t loggerator-client .
```


```bash
docker run --name loggerator-client -p 3000:3000 loggerator-client
```

```bash
docker stop loggerator-client
```