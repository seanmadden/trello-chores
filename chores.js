'use strict';

const Trello = require("trello");
const _ = require("lodash");
const fs = require("fs");

const CHORE_BOARD = "Chores";
const SCHEDULE_CARD = "Schedule";

var choreLists;

const keys = JSON.parse(fs.readFileSync("./keys.json"));


let trello = new Trello(keys.key, keys.token);

let getSchedule = function (boardId, cardId) {
    return new Promise(function (resolve, reject) {
        trello.getCard(boardId, cardId, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

trello.getBoards("me").then((boards) => {
    let choreBoard = _.find(boards, (chr) => {
        return chr.name === CHORE_BOARD
    }, 'name');
    return choreBoard.id;
}).then((id) => {
    return trello.getListsOnBoard(id)
}).then((lists) => {

        Promise.all(
            lists.map((list) => {
                return trello.getCardsOnList(list.id);
            })
        ).then((cards) => {
                cards.forEach((cardList) => {
                    console.log(_.filter(cardList, (card) => {return card.name === SCHEDULE_CARD}));
                })
            })
    }
);

