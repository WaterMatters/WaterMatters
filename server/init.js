//The Game is programmed to last for 10 seasons max
//The Game is programmed for 4 fields per village
//There are 8 villages in this game

import { Meteor } from 'meteor/meteor';

import TimeLine from '../collections/TimeLine';
import Crops from '../collections/Crops';
import Villages from '../collections/Villages';
import WeatherCards from '../collections/WeatherCards';
import Games from '../collections/Games';
import WaterManager from '../collections/WaterManager';

import '../imports/api/messages.js';
import '../imports/api/channels.js';
import '../imports/api/notifications.js';
import { Messages } from '../imports/api/messages.js';
import { Channels } from '../imports/api/channels.js';
import { Notifications } from '../imports/api/notifications.js';
import { Timer } from '../imports/api/timer.js';


Meteor.startup(() => {


  Meteor.methods({
        getUser : function(key, game) {
          return Meteor.users.findOne({'_id' : key, 'profile.game_id' : game});
        },
        getServerTime: function () {
            var _time = (new Date).toTimeString().substring(0,5);
            //console.log(_time);
            return _time;
        },
        setTime : function(gameId) {

        }
    });

//Inserts to go faster for coding. When resetting a game,
//permits to have accounts already created (controller, map and 8 villages)
if(Meteor.users.find().count() === 0){
    Meteor.call('insertInitUsers');
};

if(Villages.find().count() === 0){
    Meteor.call('newGameVillages', 'one');
};


//Normal startup inserts
if (TimeLine.find().count() === 0) {

    /////////////////////////////////////////////////////
    //////// Dependant from one game to another /////////
    /////////////////////////////////////////////////////

    Games.insert({ _id : 'one', code:'oNe' , name : 'initial game', description : 'game initiated when meteor refreshes', createdAt : new Date(), seasonTime : 15 });

    Meteor.call('newGameWaterManager', 'one');

    Meteor.call('newGameWeatherCards', 'one');

    Meteor.call('newGameTransparency', 'one');

    Meteor.call('newGameFields', 'one');

    Meteor.call('newGameEvents', 'one');

    Meteor.call('newGameSubsistences', 'one');

    /////////////////////////////////////////////////////
    ////// Independant from one game to another /////////
    /////////////////////////////////////////////////////


    // Crops
    Crops.insert({
        crop: 'fallow',
        buy:{
          price:0,
          yield:0,
        }
    });
    Crops.insert({
        crop: 'maize',
        buy:{
          price:1500,
          yield:20,
        },
        sell:[
          {production:230, price:400},
          {production:70, price:600}
        ],
        supply:[
                        {stage:1,
                          fef02:[
                            {water:125, supplyCategory:'G'},
                            {water:60, supplyCategory:'M'},
                            {water:25, supplyCategory:'P'},
                          ],
                          fef03:[
                            {water:85, supplyCategory:'G'},
                            {water:40, supplyCategory:'M'},
                            {water:15, supplyCategory:'P'},
                          ],
                          fef04:[
                            {water:60, supplyCategory:'G'},
                            {water:30, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef05:[
                            {water:50, supplyCategory:'G'},
                            {water:25, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef06:[
                            {water:40, supplyCategory:'G'},
                            {water:20, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef07:[
                            {water:35, supplyCategory:'G'},
                            {water:20, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef08:[
                            {water:30, supplyCategory:'G'},
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef09:[
                            {water:30, supplyCategory:'G'},
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                           },
                        {stage:2,
                          fef02:[
                            {water:150, supplyCategory:'G'},
                            {water:75, supplyCategory:'M'},
                            {water:25, supplyCategory:'P'},
                          ],
                          fef03:[
                            {water:100, supplyCategory:'G'},
                            {water:50, supplyCategory:'M'},
                            {water:15, supplyCategory:'P'},
                          ],
                          fef04:[
                            {water:75, supplyCategory:'G'},
                            {water:40, supplyCategory:'M'},
                            {water:15, supplyCategory:'P'},
                          ],
                          fef05:[
                            {water:60, supplyCategory:'G'},
                            {water:30, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef06:[
                            {water:50, supplyCategory:'G'},
                            {water:25, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef07:[
                            {water:40, supplyCategory:'G'},
                            {water:20, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef08:[
                            {water:40, supplyCategory:'G'},
                            {water:20, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef09:[
                            {water:40, supplyCategory:'G'},
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                        },
                        {stage:3,
                          fef02:[
                            {water:75, supplyCategory:'G'},
                            {water:40, supplyCategory:'M'},
                            {water:15, supplyCategory:'P'},
                          ],
                          fef03:[
                            {water:50, supplyCategory:'G'},
                            {water:25, supplyCategory:'M'},
                            {water:10, supplyCategory:'P'},
                          ],
                          fef04:[
                            {water:40, supplyCategory:'G'},
                            {water:20, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef05:[
                            {water:30, supplyCategory:'G'},
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef06:[
                            {water:25, supplyCategory:'G'},
                            // In the original game it was 10 for 0.6, but it didn't make sense because it was lower than was it requested for fef 0.7 mean.
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef07:[
                            {water:20, supplyCategory:'G'},
                            {water:15, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef08:[
                            {water:20, supplyCategory:'G'},
                            {water:10, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                          fef09:[
                            {water:20, supplyCategory:'G'},
                            {water:10, supplyCategory:'M'},
                            {water:5, supplyCategory:'P'},
                          ],
                  },
        ],
        yieldResponse:[
          { stage:1,
            yieldBefore20:{
              supplyCategoryG:{yieldAfter:20},
              supplyCategoryM:{yieldAfter:18},
              supplyCategoryP:{yieldAfter:15},
            },
          },
          { stage:2,
            yieldBefore20:{
              supplyCategoryG:{yieldAfter:20},
              supplyCategoryM:{yieldAfter:11},
              supplyCategoryP:{yieldAfter:2},
            },
            yieldBefore18:{
              supplyCategoryG:{yieldAfter:18},
              supplyCategoryM:{yieldAfter:11},
              supplyCategoryP:{yieldAfter:2},
            },
            yieldBefore15:{
              supplyCategoryG:{yieldAfter:15},
              supplyCategoryM:{yieldAfter:11},
              supplyCategoryP:{yieldAfter:2},
            },
          },
          { stage:3,
            yieldBefore20:{
              supplyCategoryG:{yieldAfter:20},
              supplyCategoryM:{yieldAfter:17},
              supplyCategoryP:{yieldAfter:14},
            },
            yieldBefore18:{
              supplyCategoryG:{yieldAfter:18},
              supplyCategoryM:{yieldAfter:17},
              supplyCategoryP:{yieldAfter:14},
            },
            yieldBefore15:{
              supplyCategoryG:{yieldAfter:15},
              supplyCategoryM:{yieldAfter:15},
              supplyCategoryP:{yieldAfter:14},
            },
            yieldBefore11:{
              supplyCategoryG:{yieldAfter:11},
              supplyCategoryM:{yieldAfter:11},
              supplyCategoryP:{yieldAfter:11},
            },
            yieldBefore2:{
              supplyCategoryG:{yieldAfter:2},
              supplyCategoryM:{yieldAfter:2},
              supplyCategoryP:{yieldAfter:2},
            },
          }],
    });
    Crops.insert({
        crop: 'rice',
        buy:{
          price:1500,
          yield:30,
        },
        sell:[
          {production:340, price:300},
          {production:100, price:650}
        ],
        supply:[
              {stage:1,
                        fef02:[
                          {water:175, supplyCategory:'G'},
                          {water:85, supplyCategory:'M'},
                          {water:40, supplyCategory:'P'},
                        ],
                        fef03:[
                          {water:115, supplyCategory:'G'},
                          {water:60, supplyCategory:'M'},
                          {water:25, supplyCategory:'P'},
                        ],
                        fef04:[
                          {water:90, supplyCategory:'G'},
                          {water:45, supplyCategory:'M'},
                          {water:20, supplyCategory:'P'},
                        ],
                        fef05:[
                          {water:70, supplyCategory:'G'},
                          {water:35, supplyCategory:'M'},
                          {water:15, supplyCategory:'P'},
                        ],
                        fef06:[
                          {water:60, supplyCategory:'G'},
                          {water:30, supplyCategory:'M'},
                          {water:15, supplyCategory:'P'},
                        ],
                        fef07:[
                          {water:50, supplyCategory:'G'},
                          {water:25, supplyCategory:'M'},
                          {water:10, supplyCategory:'P'},
                        ],
                        fef08:[
                          {water:45, supplyCategory:'G'},
                          {water:20, supplyCategory:'M'},
                          {water:10, supplyCategory:'P'},
                        ],
                        fef09:[
                          {water:40, supplyCategory:'G'},
                          {water:20, supplyCategory:'M'},
                          {water:10, supplyCategory:'P'},
                        ],
                    },
                    {stage:2,
                    fef02:[
                      {water:350, supplyCategory:'G'},
                      {water:175, supplyCategory:'M'},
                      {water:75, supplyCategory:'P'},
                    ],
                    fef03:[
                      {water:235, supplyCategory:'G'},
                      {water:115, supplyCategory:'M'},
                      {water:50, supplyCategory:'P'},
                    ],
                    fef04:[
                      {water:175, supplyCategory:'G'},
                      {water:90, supplyCategory:'M'},
                      {water:40, supplyCategory:'P'},
                    ],
                    fef05:[
                      {water:140, supplyCategory:'G'},
                      {water:70, supplyCategory:'M'},
                      {water:30, supplyCategory:'P'},
                    ],
                    fef06:[
                      {water:120, supplyCategory:'G'},
                      {water:60, supplyCategory:'M'},
                      {water:25, supplyCategory:'P'},
                    ],
                    fef07:[
                      {water:100, supplyCategory:'G'},
                      {water:50, supplyCategory:'M'},
                      {water:20, supplyCategory:'P'},
                    ],
                    fef08:[
                      {water:90, supplyCategory:'G'},
                      {water:45, supplyCategory:'M'},
                      {water:20, supplyCategory:'P'},
                    ],
                    fef09:[
                      {water:75, supplyCategory:'G'},
                      {water:40, supplyCategory:'M'},
                      {water:15, supplyCategory:'P'},
                    ],
                  },
                  {stage: 3,
                    fef02:[
                      {water:125, supplyCategory:'G'},
                      {water:65, supplyCategory:'M'},
                      {water:25, supplyCategory:'P'},
                    ],
                    fef03:[
                      {water:85, supplyCategory:'G'},
                      {water:40, supplyCategory:'M'},
                      {water:15, supplyCategory:'P'},
                    ],
                    fef04:[
                      {water:65, supplyCategory:'G'},
                      {water:30, supplyCategory:'M'},
                      {water:15, supplyCategory:'P'},
                    ],
                    fef05:[
                      {water:50, supplyCategory:'G'},
                      {water:25, supplyCategory:'M'},
                      {water:10, supplyCategory:'P'},
                    ],
                    fef06:[
                      {water:40, supplyCategory:'G'},
                      {water:20, supplyCategory:'M'},
                      {water:10, supplyCategory:'P'},
                    ],
                    fef07:[
                      {water:35, supplyCategory:'G'},
                      {water:10, supplyCategory:'M'},
                      {water:5, supplyCategory:'P'},
                    ],
                    fef08:[
                      {water:30, supplyCategory:'G'},
                      {water:15, supplyCategory:'M'},
                      {water:5, supplyCategory:'P'},
                    ],
                    fef09:[
                      {water:30, supplyCategory:'G'},
                      {water:15, supplyCategory:'M'},
                      {water:5, supplyCategory:'P'},
                    ],
                },
          ],
        yieldResponse:[
          { stage:1,
            yieldBefore30:{
              supplyCategoryG:{yieldAfter:30},
              supplyCategoryM:{yieldAfter:27},
              supplyCategoryP:{yieldAfter:22},
            },
          },
          { stage:2,
            yieldBefore30:{
              supplyCategoryG:{yieldAfter:30},
              supplyCategoryM:{yieldAfter:16},
              supplyCategoryP:{yieldAfter:5},
            },
            yieldBefore27:{
              supplyCategoryG:{yieldAfter:27},
              supplyCategoryM:{yieldAfter:16},
              supplyCategoryP:{yieldAfter:5},
            },
            yieldBefore22:{
              supplyCategoryG:{yieldAfter:22},
              supplyCategoryM:{yieldAfter:16},
              supplyCategoryP:{yieldAfter:5},
            },
          },
          { stage:3,
            yieldBefore30:{
              supplyCategoryG:{yieldAfter:30},
              supplyCategoryM:{yieldAfter:22},
              supplyCategoryP:{yieldAfter:19},
            },
            yieldBefore27:{
              supplyCategoryG:{yieldAfter:27},
              supplyCategoryM:{yieldAfter:22},
              supplyCategoryP:{yieldAfter:19},
            },
            yieldBefore22:{
              supplyCategoryG:{yieldAfter:22},
              supplyCategoryM:{yieldAfter:22},
              supplyCategoryP:{yieldAfter:19},
            },
            yieldBefore16:{
              supplyCategoryG:{yieldAfter:16},
              supplyCategoryM:{yieldAfter:16},
              supplyCategoryP:{yieldAfter:5},
            },
            yieldBefore5:{
              supplyCategoryG:{yieldAfter:5},
              supplyCategoryM:{yieldAfter:5},
              supplyCategoryP:{yieldAfter:1},
            },
          }],
    });
    Crops.insert({
        crop: 'soybean',
        buy:{
          price:3000,
          yield:10,
        },
        sell:[
          {production:110, price:750},
          {production:30, price:1250}
        ],
        supply:[{stage:1,
                        fef02:[
                          {water:100, supplyCategory:'G'},
                          {water:50, supplyCategory:'M'},
                          {water:25, supplyCategory:'P'},
                        ],
                        fef03:[
                          {water:65, supplyCategory:'G'},
                          {water:35, supplyCategory:'M'},
                          {water:15, supplyCategory:'P'},
                        ],
                        fef04:[
                          {water:50, supplyCategory:'G'},
                          {water:25, supplyCategory:'M'},
                          {water:10, supplyCategory:'P'},
                        ],
                        fef05:[
                          {water:40, supplyCategory:'G'},
                          {water:20, supplyCategory:'M'},
                          {water:10, supplyCategory:'P'},
                        ],
                        fef06:[
                          {water:35, supplyCategory:'G'},
                          {water:15, supplyCategory:'M'},
                          {water:5, supplyCategory:'P'},
                        ],
                        fef07:[
                          {water:30, supplyCategory:'G'},
                          {water:15, supplyCategory:'M'},
                          {water:5, supplyCategory:'P'},
                        ],
                        fef08:[
                          {water:25, supplyCategory:'G'},
                          {water:15, supplyCategory:'M'},
                          {water:5, supplyCategory:'P'},
                        ],
                        fef09:[
                          {water:20, supplyCategory:'G'},
                          {water:10, supplyCategory:'M'},
                          {water:5, supplyCategory:'P'},
                        ],
                      },
                      {stage:2,
                      fef02:[
                        {water:125, supplyCategory:'G'},
                        {water:65, supplyCategory:'M'},
                        {water:25, supplyCategory:'P'},
                      ],
                      fef03:[
                        {water:85, supplyCategory:'G'},
                        {water:40, supplyCategory:'M'},
                        {water:15, supplyCategory:'P'},
                      ],
                      fef04:[
                        {water:60, supplyCategory:'G'},
                        {water:30, supplyCategory:'M'},
                        {water:15, supplyCategory:'P'},
                      ],
                      fef05:[
                        {water:50, supplyCategory:'G'},
                        {water:25, supplyCategory:'M'},
                        {water:10, supplyCategory:'P'},
                      ],
                      fef06:[
                        {water:40, supplyCategory:'G'},
                        {water:20, supplyCategory:'M'},
                        {water:10, supplyCategory:'P'},
                      ],
                      fef07:[
                        {water:35, supplyCategory:'G'},
                        {water:20, supplyCategory:'M'},
                        {water:10, supplyCategory:'P'},
                      ],
                      fef08:[
                        {water:30, supplyCategory:'G'},
                        {water:15, supplyCategory:'M'},
                        {water:5, supplyCategory:'P'},
                      ],
                      fef09:[
                        {water:30, supplyCategory:'G'},
                        {water:15, supplyCategory:'M'},
                        {water:5, supplyCategory:'P'},
                      ],
                    },
                    {stage:3,
                      fef02:[
                        {water:100, supplyCategory:'G'},
                        {water:50, supplyCategory:'M'},
                        {water:25, supplyCategory:'P'},
                      ],
                      fef03:[
                        {water:65, supplyCategory:'G'},
                        {water:35, supplyCategory:'M'},
                        {water:15, supplyCategory:'P'},
                      ],
                      fef04:[
                        {water:50, supplyCategory:'G'},
                        {water:25, supplyCategory:'M'},
                        {water:15, supplyCategory:'P'},
                      ],
                      fef05:[
                        {water:40, supplyCategory:'G'},
                        {water:20, supplyCategory:'M'},
                        {water:10, supplyCategory:'P'},
                      ],
                      fef06:[
                        {water:35, supplyCategory:'G'},
                        {water:15, supplyCategory:'M'},
                        {water:10, supplyCategory:'P'},
                      ],
                      fef07:[
                        {water:30, supplyCategory:'G'},
                        {water:15, supplyCategory:'M'},
                        {water:5, supplyCategory:'P'},
                      ],
                      fef08:[
                        {water:25, supplyCategory:'G'},
                        {water:15, supplyCategory:'M'},
                        {water:5, supplyCategory:'P'},
                      ],
                      fef09:[
                        {water:20, supplyCategory:'G'},
                        {water:10, supplyCategory:'M'},
                        {water:5, supplyCategory:'P'},
                      ],
                    },
              ],
        yieldResponse:[
          { stage:1,
            yieldBefore10:{
              supplyCategoryG:{yieldAfter:10},
              supplyCategoryM:{yieldAfter:5},
              supplyCategoryP:{yieldAfter:1},
            },
          },
          { stage:2,
            yieldBefore10:{
              supplyCategoryG:{yieldAfter:10},
              supplyCategoryM:{yieldAfter:5},
              supplyCategoryP:{yieldAfter:5},
            },
            yieldBefore5:{
              supplyCategoryG:{yieldAfter:5},
              supplyCategoryM:{yieldAfter:3},
              supplyCategoryP:{yieldAfter:3},
            },
            yieldBefore1:{
              supplyCategoryG:{yieldAfter:1},
              supplyCategoryM:{yieldAfter:1},
              supplyCategoryP:{yieldAfter:1},
            },
          },
          { 'stage3':3,
            yieldBefore10:{
              supplyCategoryG:{yieldAfter:10},
              supplyCategoryM:{yieldAfter:5},
              supplyCategoryP:{yieldAfter:5},
            },
            yieldBefore5:{
              supplyCategoryG:{yieldAfter:5},
              supplyCategoryM:{yieldAfter:3},
              supplyCategoryP:{yieldAfter:3},
            },
            yieldBefore3:{
              supplyCategoryG:{yieldAfter:3},
              supplyCategoryM:{yieldAfter:1},
              supplyCategoryP:{yieldAfter:1},
            },
            yieldBefore1:{
              supplyCategoryG:{yieldAfter:1},
              supplyCategoryM:{yieldAfter:1},
              supplyCategoryP:{yieldAfter:1},
            },
          }],
    });

    //inserting TimeLine at last so that all the others inserts can happen.
    Meteor.call('newGameTimeLine', 'one');
};

});
