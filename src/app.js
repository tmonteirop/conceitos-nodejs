const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

let resultFindRepositoryIndex = -1;
let resultFindlikes = 0;

// Search for repository
findRepositoryIndex = (request, response, next) => {
  const { id } = request.params;

  resultFindRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (resultFindRepositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" })
  }

  resultFindlikes = repositories[resultFindRepositoryIndex].likes; 

  return next();

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", findRepositoryIndex, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: resultFindlikes,
  }

  repositories[resultFindRepositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", findRepositoryIndex, (request, response) => {
  repositories.splice(resultFindRepositoryIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", findRepositoryIndex, (request, response) => {
  const repository = repositories[resultFindRepositoryIndex];

  repository.likes+=1;

  return response.json(repository);
  
});

module.exports = app;
