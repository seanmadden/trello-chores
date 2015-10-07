'use strict';

const Trello = require("trello");
const parser = require("HumanCron");
const _ = require("lodash");
const fs = require("fs");

const CHORE_BOARD = "Chores";
const SCHEDULE_CARD = "Schedule";

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
).then((listsOfCards) => {
        //return an object that separates the tasks from the schedules
        let listOfChores = [];
        return new Promise((resolve, reject) => {
            for (let list of listsOfCards) {
                let chores = {tasks: []};
                for (let card of list) {
                    if (card.name.toLowerCase() === "schedule") {
                        chores.schedule = card;
                    } else {
                        chores.tasks.push(card);
                    }
                }
                if (chores.tasks.length > 0) listOfChores.push(chores);
            }
            resolve(listOfChores);
        })
    }
).then((listOfChores) => {
        //parse the schedule cards to cron syntax at some point
        //Combine the chore cards into a single card with a checklist
        //Add the card to the correct board


        //return Promise((resolve, reject) => {
        //        listOfChores.map((scheduleCard) => {
        //            if (scheduleCard[0] !== undefined) {
        //                return {
        //                    cronString: parser(scheduleCard[0].desc),
        //                };
        //            }
        //        })
        //    }
        //)
    }
).then((cronStrings) => {
        //Print the cron strings
        console.log(cronStrings);
    }
);

