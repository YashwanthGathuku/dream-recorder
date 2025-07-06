# Docker Guide for Dream Recorder

This guide will help you containerize, run, and manage the Dream Recorder project using Docker and Docker Compose. It covers:
- Docker basics
- Writing a Dockerfile
- Writing a docker-compose.yml
- Building images
- Running containers
- Setting environment variables
- Useful Docker commands

---

## 1. **What is Docker?**
Docker is a tool that lets you package your application and its dependencies into a container. Containers are lightweight, portable, and ensure your app runs the same everywhere.

---

## 2. **Install Docker & Docker Compose**
- **Linux:**
  ```bash
  sudo apt update
  sudo apt install docker.io docker-compose -y
  sudo systemctl enable --now docker
  sudo usermod -aG docker $USER
  # Log out and back in for group changes to take effect
  ```
- **macOS/Windows:**
  - Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

---

## 3. **Project Structure**
```
project-root/
├── backend/           # Flask backend
├── DreamRecorderMobileExpo/  # React Native (Expo) mobile app
├── docker-compose.yml # Compose file
├── Dockerfile         # Backend Dockerfile
└── ...
```

---

## 4. **Writing a Dockerfile (for Backend)**
Create a `Dockerfile` in your backend directory:
```Dockerfile
# Use official Python image
FROM python:3.10-slim

# Set workdir
WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables (optional)
ENV FLASK_ENV=production

# Run the app
CMD ["python", "dream_recorder.py"]
```

---

## 5. **Writing docker-compose.yml**
At the project root, create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dream-recorder-app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - OPENAI_API_KEY=your_openai_key
      - LUMALABS_API_KEY=your_luma_key
    volumes:
      - ./backend/media:/app/media
    restart: unless-stopped
```

---

## 6. **Building Docker Images**
From the project root:
```bash
docker-compose build
```
This will build the backend image using the Dockerfile.

---

## 7. **Running Docker Containers**
Start all services in the background:
```bash
docker-compose up -d
```
Stop all services:
```bash
docker-compose down
```

---

## 8. **Environment Variables**
Set sensitive keys in the `environment` section of `docker-compose.yml` or use a `.env` file:
```env
OPENAI_API_KEY=your_openai_key
LUMALABS_API_KEY=your_luma_key
```
And reference in `docker-compose.yml`:
```yaml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - LUMALABS_API_KEY=${LUMALABS_API_KEY}
```

---

## 9. **Useful Docker Commands**
- **List running containers:**
  ```bash
  docker ps
  ```
- **View logs:**
  ```bash
  docker-compose logs -f
  ```
- **Enter a running container:**
  ```bash
  docker exec -it dream-recorder-app bash
  ```
- **Rebuild after code changes:**
  ```bash
  docker-compose build --no-cache
  docker-compose up -d
  ```
- **Remove all containers/images (dangerous!):**
  ```bash
  docker system prune -a
  ```

---

## 10. **Troubleshooting**
- **Permission denied on Docker socket:**
  - Use `sudo` or add your user to the `docker` group.
- **Port already in use:**
  - Change the `ports` mapping in `docker-compose.yml`.
- **Environment variables not set:**
  - Check `.env` file and `docker-compose.yml`.

---

## 11. **Advanced: Multi-Container Setup**
You can add more services (e.g., database, frontend) to `docker-compose.yml` as needed.

---

## 12. **References**
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## 13. **All Commands Used in This Guide/Session**

### Docker & Docker Compose
- Build images:
  ```bash
  docker-compose build
  ```
- Start containers in background:
  ```bash
  docker-compose up -d
  ```
- Stop all containers:
  ```bash
  docker-compose down
  ```
- View running containers:
  ```bash
  docker ps
  ```
- View logs:
  ```bash
  docker-compose logs -f
  ```
- Enter a running container:
  ```bash
  docker exec -it dream-recorder-app bash
  ```
- Remove all containers/images (dangerous!):
  ```bash
  docker system prune -a
  ```

### Expo (React Native Mobile App)
- Start Expo server (from DreamRecorderMobileExpo directory):
  ```bash
  npx expo start --offline
  ```
- Start Expo server with environment variables:
  ```bash
  export ANDROID_HOME=/home/ash/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
  npx expo start --offline
  ```

### Android SDK & Emulator
- Install ADB and Fastboot:
  ```bash
  sudo apt install -y android-tools-adb android-tools-fastboot
  ```
- Check ADB version:
  ```bash
  adb version
  ```
- List connected devices:
  ```bash
  adb devices
  ```
- Set Android SDK environment variables:
  ```bash
  export ANDROID_HOME=/home/ash/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
  ```
- List available AVDs:
  ```bash
  $ANDROID_HOME/emulator/emulator -list-avds
  ```
- Start Android Studio:
  ```bash
  android-studio &
  ```

### Git Commands
- Add all changes:
  ```bash
  git add .
  ```
- Commit changes:
  ```bash
  git commit -m "Your commit message"
  ```
- Push to remote branch:
  ```bash
  git push origin your-branch-name
  ```
- Set git user/email:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your@email.com"
  ```

### Backend API Testing
- Test backend API endpoint:
  ```bash
  curl -s http://localhost:5000/api/dreams
  ```

---

**This section collects all the essential commands used to build, run, debug, and deploy the Dream Recorder application.**

**You are now ready to use Docker for your Dream Recorder project!** 