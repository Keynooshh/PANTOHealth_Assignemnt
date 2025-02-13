## Documentation for Interview Assignment

### **Overview**

I built a NestJS application to process IoT device data. The data comes from an RMQ (RabbitMQ) server, gets processed, and is stored in MongoDB. I created two services: one for raw data (called `x-ray-data`) and another for processed data (called `signals`). Both have their own MongoDB schemas and endpoints.

The main steps I followed were:

1. Retrieve data from RMQ.
2. Save raw data in MongoDB.
3. Process the data.
4. Save the processed data in MongoDB.
5. Create endpoints for both raw and processed data.

---

### **Tech Stack**

- **Node.js**: Version 20 LTS
- **NestJS**: Framework for building the app
- **MongoDB**: Database for storing raw and processed data
- **RabbitMQ**: Message queue for IoT data
- **Docker**: For containerization
- **Jest**: For testing

---

### **Project Setup**

I started by setting up a NestJS project using `npm`, `nvm`, and the Nest CLI.
The Node version I used is 20 LTS. And i used `npm` to manage the packages and dependencies.

---

### **Implementation Steps**

#### **1. RMQ Producer**

I created a producer to send data to the RMQ queue. Here’s what I did:

- Used `amqplib` to connect to the RMQ server.
- Used `fs` to read a JSON file and add its content to the queue.
- Added logging and error handling (like retries and timeouts).
- Created two endpoints:
  - `@Get('json-test')`: To test if the JSON file is being read.
  - `@Post('start-producer')`: To start the producer.
- The app runs on port `3000`.

I also wrote tests using Jest to make sure everything works as expected. To monitor the queues and connections, I used the RMQ management GUI.

---

#### **2. RMQ Consumer**

Once the producer was set up, I moved on to the consumer. The consumer:

- Connects to the RMQ server.
- Consumes messages from the queue.
- Saves the raw data to MongoDB.

---

#### **3. MongoDB Connection and Schema Design**

I used Mongoose to connect to MongoDB. To make things easier, I created a general module for all database connections. This way, connecting to different collections isn’t a hassle.

The raw data schema was a bit complicated, so I flattened it by one level to make it cleaner and easier to work with. Here’s the schema I came up with:

```javascript
const xrayData = {
    deviceId: string,
    time: number,
	data: [
		[
			time: number,
			speed: number,
			[
				x: number,
				y: number
			]
		]
	]
};
```

---

#### **4. Signal Processing Service**

After saving the raw data, I created a service to process and enrich it. This service:

- Takes the raw data.
- Processes it based on the requirements.
- Adds additional insights I thought were useful.

Once the processing was done, I saved the processed data in another MongoDB collection. Here’s the schema for the processed data:

```javascript
const signalData = {
	deviceId: string,
	time: number,
	dataLength: number,
	timeRange: {
	    minTime: number,
	    maxTime: number
	 },
	averageSpeed: number,
	totalDistance: number
	geoData:  {
		minX: number,
		maxX: number,
		minY: number,
		maxY: number,
	},
};
```

---

#### **5. Endpoints**

I created CRUD endpoints for both raw and processed data. Here’s a quick overview:

**For Raw Data (`x-ray-data`):**

- `GET /v1/xray/all`: Fetch all raw data.
- `GET /v1/xray/:id`: Fetch raw data by ID.

**For Processed Data (`signals`):**

- `GET /v1/signals`: Fetch all processed data.
- `GET /v1/signals/:id`: Fetch processed data by ID.
- `GET /v1/signals`: Fetch processed data by adding filters on the query parameters.
- `POST /v1/signals`: Add signal data.
- `PUT /v1/signals/:id`: update signal data by ID.
- `DELETE /v1/signals/:id`: Delete processed data by ID.

---

#### **6. Testing**

I used Jest to write tests for all the modules and endpoints. This ensured everything worked as expected before moving to the next step.

---

#### **7. Dockerization**

To make the app easier to run, I dockerized it. Here’s what I did:

- Created a `Dockerfile` to set up a Node environment and install dependencies.
- Exposed port used by the app.
- Added a `docker-compose.yml` file to automate the build and setup process.

With Docker Compose, you can just run `docker-compose up`:

- The RMQ Producer will be up and ready at `localhost:3000`
- The main application will be available at `localhost:8080`

---

### **Configuration**

I added a config module to handle environment variables and secrets (like URIs, database names, and queue names). This made it easier to manage different configurations for development and production.

---

### **Access Details**

Here’s how you can access the different components:

- **MongoDB**:

  - Host: `localhost:27017`
  - Username: `root`
  - Password: `example`

- **RMQ Management Panel**:

  - URL: `localhost:15672`
  - Username: `guest`
  - Password: `guest`

- **RMQ Queue**:
  - Queue Name: `x-ray-queue`

---

### **Final Thoughts**

This project was a fun challenge! I learned a lot about NestJS, RMQ, and MongoDB while working on it.
