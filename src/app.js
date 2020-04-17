const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  response.json(repositories)
  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title,
    url,
    techs,
    likes: 0,    
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  let result = repositories.findIndex(repository => repository.id === id);

  if(result < 0) {
    return response.status(400).json({ error: "Repository not found"});
  }  

  repositories[result].title = title;
  repositories[result].url = url;
  repositories[result].techs = techs;
  
  return response.status(200).json(repositories[result]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({});
});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const result = repositories.find(repository => repository.id === id);

  if(!result) {
    return response.status(400).json({ error: "Repository not found"});
  }

  result.likes++

  return response.status(200).json(result);

});

module.exports = app;
