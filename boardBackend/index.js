//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');

const app = express();
app.use(express.json());

//Port environment variable already set up to run on Heroku
var port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

const apiPath = '/api/';
const version = 'v1';

//Id counters
let nextBoardId = 4;
let nextTaskId = 5;

//The following is an example of an array of three boards. 
var boards = [
    { id: '0', name: "To-do", description: "Everything that's on the todo list.", tasks: ["0","1","2"] },
    { id: '1', name: "Weekend", description: "Weekend plans.", tasks: ["3"] },
    { id: '3', name: "Shopping", description: "Items on the shopping list.", tasks: ["4"] }
];

var tasks = [
    { id: '0', boardId: '0', taskName: "Study", dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)), archived: false },
    { id: '1', boardId: '0', taskName: "Do the dishes", dateCreated: new Date(Date.UTC(2021, 00, 21, 16, 48)), archived: false },
    { id: '2', boardId: '0', taskName: "Fuel on car", dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)), archived: false },
    { id: '3', boardId: '1', taskName: "Birthday party", dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)), archived: false },
    { id: '4', boardId: '3', taskName: "Tomatos", dateCreated: new Date(Date.UTC(2021, 00, 10, 16, 00)), archived: true }
];

//Endpoints
//Get all boards

app.get(apiPath + version + '/boards', (req, res) => {
    let boardsArray = [];
    for (let i = 0; i < boards.length; i++) {
        boardsArray.push({ id: boards[i].id, name: boards[i].name, desciption: boards[i].description});
    }
    res.status(200).json(boardsArray);
    console.log('All boards displayed');
});

//Get individual board

app.get(apiPath + version + '/boards/:boardId', (req, res) => {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == req.params.boardId) {
            console.log('Board Id %s displayed',req.params.boardId);
            return res.status(200).json(boards[i]);
            
        }
    }
    res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist." });
});

//Create board
app.post(apiPath + version + '/boards', (req, res) => {
    if (req.body.name === undefined) {
        return res.status(400).json({ 'message': "Boards require at least a name." });
    } else {
        let description = "";
        
        if (req.body.description !== undefined) {
            description = req.body.description;
        }

        let newBoard = { id: nextBoardId, name: req.body.name, description: description, tasks: [] };
        boards.push(newBoard);
    
        res.status(201).json(newBoard);
        console.log('BoardId ' + nextBoardId + ' with name ' + req.body.name + ' was created');
        nextBoardId++;

    }
});

//Update a board
//l8r
app.put('/api/boards/:id/tasks/:taskId', (req, res) => {
    const board = boards.find(b => b.id === parseInt(req.params.id));
    if(!board) res.status(404).send('The course with the given ID was not found')


});

//Delete a board
app.delete(apiPath + version + '/boards/:boardId', (req, res) => {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == req.params.boardId){

            console.log('BoardId '+req.params.boardId + ' with name ' + boards[i].name + ' was deleted');
            return res.status(200).json(boards.splice(i,1));
        }
    }
    res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist." });
});

//Delete ALL boards
app.delete(apiPath + version + '/boards', (req, res) => {
    var returnArray = boards.slice();
    boards = []
    
    console.log('All boards deleted')
    res.status(200).json(returnArray);
});


//Read all tasks for a board
app.get(apiPath + version + '/boards/:boardId/tasks', (req, res) => {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == req.params.boardId) {
            let returnArray = [];
            for (let j = 0; j < tasks.length; j++) {
                if (boards[i].tasks.includes(tasks[j].id)) {
                    returnArray.push(tasks[j]);
                }
            }
            console.log('All tasks displayed for boardId ' + req.params.boardId);
            return res.status(200).json(returnArray);
            
        }
    }
    res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist." });
});


//Read an individual task for a selected board
//Ekki klárt, skoða línu 138(!)
app.get(apiPath + version + '/boards/:boardId/tasks/:taskId', (req, res) => {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == req.params.boardId) {
            if (boards[i].tasks.includes(Number(req.params.taskId))) {
                return res.status(404).json({ 'message': "Task with id " + req.params.taskId + " does not exist for the selected board." });
            }
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id == req.params.taskId) {
                    return res.status(200).json(tasks[j]);
                }
            }
            return res.status(404).json({ 'message': "Task with id " + req.params.taskId + " does not exist for the selected board." });
        }
    }
    res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist." });
});

//Create a new task
app.post(apiPath + version + '/boards/:boardId/tasks', (req, res) => {
    if (req.body.name === undefined) {
        return res.status(400).json({ 'message': "Task requires a name." });
    } else {
        for (let i = 0; i < boards.length; i++) {
            if (board[i].id == req.params.boardId) {
 
                let newTask = {
                    id: nextTaskId, boardID: board[i].id, taskName: req.body.name, dateCreated: new Date(), archived: false
                };

                boards[i].tasks.push(nextTaskId);
                tasks.push(newTask);
                nextTaskId++;
                res.status(201).json(newTask);
                return;
            }
        }
        res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist" });
    }
});


//Delete a task
app.delete(apiPath + version + '/boards/:boardId/tasks/:taskId', (req, res) => {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == req.params.boardId) {
            for (let j = 0; j < boards[i].tasks.length; j++) {
                if (boards[i].tasks[j] == req.params.taskId) {
                    for (let k = 0; k < tasks.length; k++) {
                        if (tasks[k].id == req.params.tasksId) {
                            //Remove the task from the board
                            boards[i].tasks.splice(j, 1);

                            //Remove and return the actual tasks
                            return res.status(200).json(tasks.splice(k, 1));
                        }
                    }

                }
            }
            return res.status(404).json({ 'message': "Task with id " + req.params.taskId + " does not exist for the selected board." });
        }
    }
    res.status(404).json({ 'message': "Board with id " + req.params.boardId + " does not exist." });
});


app.get('/', (req, res) => {
    res.send('Hello ÞRVR....');

});


//Start the server
app.listen(port, () => {
    console.log('Boards backend listening on port %s', port);
});