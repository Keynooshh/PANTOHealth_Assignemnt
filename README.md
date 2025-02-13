### **Getting Started with the Project**

Here’s a quick guide to get everything up and running.

---

### **Step 1: Start the Project**

1. Make sure you have `Docker` and `Docker Compose` installed.
2. Clone the project (if you haven’t already).
3. Navigate to the project directory.
4. Run the following command to start everything:
   ```bash
   docker-compose up
   ```
   This will:
   - Start the Node.js app (using Node LTS 20).
   - Spin up MongoDB (latest version).
   - Start RabbitMQ (latest version).

---

### **Step 2: Add Data to RMQ**

Once everything is up and running:

1. Send a POST request to start the producer:
   ```bash
   curl -X POST http://localhost:3000/start-producer
   ```
   This will start adding data to the RMQ queue (`x-ray-queue`).
   > You can also see the state of RMQ at `localhost:15672`
2. The consumer will automatically process the data and save it to MongoDB.

---

### **Step 3: Use the Endpoints**

Once the data is processed, you can start using the endpoints. The app is accessible at `http://localhost:8080`.

#### **For Raw Data (`x-ray-data`):**

- **Fetch all raw data**:

  ```bash
  curl http://localhost:8080/v1/xray/all
  ```

- **Fetch raw data by ID**:
  ```bash
  curl http://localhost:8080/v1/xray/:id
  ```
  Replace `:id` with the actual ID of the raw data entry.

#### **For Processed Data (`signals`):**

- **Fetch all processed data**:

  ```bash
  curl http://localhost:8080/v1/signals
  ```

- **Fetch processed data by ID**:

  ```bash
  curl http://localhost:8080/v1/signals/:id
  ```

  Replace `:id` with the actual ID of the processed data entry.

  > All the `id`s used here are mongoDB Object`_id`.

- **Fetch processed data with filters**:  
  Add query parameters to filter the data. For example:

  ```bash
  curl http://localhost:8080/v1/signals?deviceId=123&time=946684799
  ```

- **Add new processed data**:

  ```bash
  curl -X POST http://localhost:8080/v1/signals -H "Content-Type: application/json" -d '{"deviceId": "123", "time": "946684799",{...}}'
  ```

- **Update processed data by ID**:

  ```bash
  curl -X PUT http://localhost:8080/v1/signals/:id -H "Content-Type: application/json" -d '{"processedValues": {...}}'
  ```

  Replace `:id` with the actual ID of the processed data entry.

- **Delete processed data by ID**:
  ```bash
  curl -X DELETE http://localhost:8080/v1/signals/:id
  ```
  Replace `:id` with the actual ID of the processed data entry.

---

### **Tech Stack Details**

Here’s a quick rundown of the versions and libraries used:

- **Node.js**: LTS 20 (`npm: 10.8.2`, `node: 20.18.2`)
- **MongoDB**: Latest version
- **RabbitMQ**: Latest version
- **Mongoose**: Latest version (for MongoDB interactions)
- **amqplib**: Latest version (for RabbitMQ interactions)
- **fs**: Latest version (for file system operations)

---

### **That’s It!**

Once you’ve followed these steps, the app will be up and running, and you can start interacting with the data using the endpoints. If you have any questions or run into issues, feel free to reach out!
