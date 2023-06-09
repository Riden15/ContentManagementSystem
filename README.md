[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/suhcjUE-)
# Exam #12345: "Exam Title"
## Student: s319441 Cardona Riccardo 

## React Client Application Routes

qua vanno scritte le route dell'applicazione
- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/pages`
  - Description: Get all the questions
  - Request body: _None_
  - Response: `200 OK` (success) or `500 Internal Server Error` (generic error).
  - Response body: An array of objects, each describing a page.
  ```
  [{
      "id": 1,
      "authorId": 1,
      "creationDate": "2023-06-05T22:00:00.000Z",
      "publicationDate": "2023-06-09T22:00:00.000Z"
  },
  ...
  ]
  ```

- GET `/api/pages/<id>`
  - Description: Get the page identified by the id `<id>`
  - Request body: _None_
  - Response: `200 OK` (success), `404 Not Found` (wrong id) or `500 Internal Server Error` (generic error).
  - Response body: An object, describing a sigle page.
  ```
  {
      "id": 2,
      "authorId": 2,
      "creationDate": "2023-06-05T22:00:00.000Z",
      "publicationDate": "2023-06-09T22:00:00.000Z"
  }
  ```
  
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users`  - id, username, name, salt, password
- Table `pages`  - id, authorId, title, creationDate, publicationDate
- Table `blocks` - id, blockType, pageId, content


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

mettere screenshot della pagina, cosa si dovrebbe vedere
![Screenshot](./img/screenshot.jpg)

## Users Credentials

* username: riccardo@test.com, password: "pwd"
* username: stefano@test.com, password: "pwd"
* username: simone@test.com, password: "pwd"
* username: lorenzo@test.com, password: "pwd"
* username: chiara@test.com, password: "pwd"


