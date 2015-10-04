'use strict';

const Trello = require("trello");
const parser = require("HumanCron");
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

        return Promise.all(
            lists.map((list) => {
                return trello.getCardsOnList(list.id);
            })
        );
    }
).then((cards) => {
        //get the schedule cards
        return Promise.all(
            cards.map((cardList) => {
                return _.filter(cardList, (card) => {
                    return card.name === SCHEDULE_CARD
                });
            })
        )
    }
).then((schedules) => {
        //parse the schedule cards to cron syntax
        return Promise.all(
            schedules.map((scheduleCard) => {
                if (scheduleCard[0] !== undefined) {
                    return {
                        cronString: parser(scheduleCard[0].desc),


                    };
                }
            })
        )
    }
).then((cronStrings) => {
        //Print the cron strings
        console.log(cronStrings);
    }
);

