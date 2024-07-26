Stop Docker Services:
sudo systemctl stop docker
sudo systemctl stop docker.socket

Ensure All Docker Processes Are Killed:
sudo pkill -f docker

Restart Docker Services:
sudo systemctl start docker
sudo systemctl start docker.socket

Verify Docker is Running:
sudo systemctl status docker

If Needed, Restart Docker Desktop Application:
If you are using the Docker Desktop application, you might need to restart it as well. If it's a GUI application, you can do this manually or by using the following commands:

sh
Copiar código

# Close Docker Desktop application

pkill Docker

# Open Docker Desktop application

nohup Docker > /dev/null 2>&1 &
Summary of Commands
sh
Copiar código
sudo systemctl stop docker
sudo systemctl stop docker.socket
sudo pkill -f docker
sudo systemctl start docker
sudo systemctl start docker.socket
sudo systemctl status docker
pkill Docker
nohup Docker > /dev/null 2>&1 &
These commands should help you stop and restart Docker services and Docker Desktop on Ubuntu.
