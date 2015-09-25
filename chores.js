'use strict';

const Trello = require("trello");
const _ = require("lodash");
const CHOREBOARD = "Chores";
const fs = require("fs");

var choreLists;

const keys = JSON.parse(fs.readFileSync("./keys.json"));


let trello = new Trello(keys.key, keys.token);

let getSchedule = function(boardId, cardId) {
	return new Promise(function(resolve, reject) {
		trello.getCard(boardId, cardId, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

trello.getBoards("me").then((boards) => {
	let choreBoard = _.find(boards, (chr) => {return chr.name === CHOREBOARD}, 'name');
	return choreBoard.id;
}).then((id) => {
	return trello.getListsOnBoard(id)
})
.then((lists) => {
	lists.forEach((list) => {
		console.log(list)
	});
});

