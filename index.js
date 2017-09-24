/*
This takes the voice input from Alexa and sends it to our website. */

//'use strict';


const foofoo_endpoint = 'http://fudrushhack.azurewebsites.net/foodRequest';

const rp = require('request-promise');
const URL  = require('url');
const querystring = require('querystring');
const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Alexa Restaurant Yelp',
            WELCOME_MESSAGE: 'Welcome to FoodRush!',
			CHOOSE_FOOD_PROMPT: 'What kind of food do you want?',
            HELP_MESSAGE: 'You can say I want Italian, for example.',
            HELP_REPROMPT: 'You can say I want Italian, for example.',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', this.t('WELCOME_MESSAGE'), this.t('WELCOME_MESSAGE'));
    },
    'RawText': function () { 
        //var options = new URL(foofoo_endpoint);
        var text = this.event.request.intent.slots.Text.value;
		//this.emit(":ask", text, text);
		httpsPost(text, res => { 
			this.emit(":ask", res, res);
		});
    },
    'Exit': function () { 
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



function httpsPost(data, callback) {
	
    var post_options = { 
		method: 'POST', 
		uri: foofoo_endpoint,
		body: {
			fRequest: data
		},
		json: true
	}

    /*var post_req = https.request(post_options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            callback(returnData);
        });
    });
	console.log(JSON.stringify(data_t));
    post_req.write(JSON.stringify(data_t));
    post_req.end();*/
	rp(post_options)
		.then(function (res) { 
			callback(res);
		})
		.catch(function (err) { 
			callback("There was an online error. Please try again.");
		});
}
