TaskManager Frontend

Frontend do TaskManager desenvolvido em React.

====================================================================
Como rodar localmente

git clone https://github.com/AmericoGodoyG/taskmanager-frontend.git
cd taskmanager-frontend
npm install
npm start
====================================================================

Acesse em: http://localhost:3000
====================================================================
Docker

docker build -t americogodoydocker/taskmanager-frontend:latest .
docker run -p 80:80 americogodoydocker/taskmanager-frontend:latest
====================================================================

CI/CD
Este projeto utiliza GitHub Actions para build e push automático da imagem Docker para o Docker Hub.