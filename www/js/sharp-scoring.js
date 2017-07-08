/*jslint plusplus: true */
/*jslint evil: true */
/*jslint nomen: true */
/*jslint vars: true */
/*jslint continue: true, regexp: true */
/*global console, document, Highcharts, dictionary, chartConfig, surveysPayload:true */
/*global $, Moss, Sharp */
/*global toastr */

var currentLanguage = "en";
var charts = [];
var headingCharts = [];
var currentSurveyIndex = 0;
var surveysPayload = {};
var originalSurveysPayload = {};
var filter = {sorting: "score_final", order: "desc", sortedKeys: [], top_bottom: "top", quantity: "all", grouping: "all", grouping_key: "all", scoring_type: "all", initialized: false};
var colors = {'respondent': '#7CB5EC', 'avg': '#FF0000', 'male': '#a9ff96', 'female': '#ffb200', 'farmer': '#00aaff', 'pastoralist' : '#ffaaff', 'agropastoralist': '#ff00ff', group: '#123456', 'certified': '#879ec4', 'conventional': '#9fc487'};
var isFFS = false;

//evt.target.value.split(":")[1] some times gives 0!!!!!!!!!!!!
// check limit visibility


function prepareSortedKeys(survey) {
    "use strict";    
    console.log("prepareSortedKeys", filter);
    var key, sortingKey, qty, top_bottom, sortedKeys;
    sortingKey = filter.sorting;
    qty = filter.quantity;
    top_bottom = filter.top_bottom;
    sortedKeys = getSortedAnswers(sortingKey, qty, "key", top_bottom);

	filter.sortedKeys = sortedKeys;
}


function comparator(a, b) {
    "use strict";
   // console.log("comparator");
    var result, scoringKey;
    if (filter.sorting === "question") {
        scoringKey = "score_final";
    } else {
        scoringKey = filter.sorting;
    }
    if (filter.order === "asc") {
        if (a.survey && a.survey.scoring) {
            result = a.survey.scoring[scoringKey] - b.survey.scoring[scoringKey];
        } else {
            //for ffs series
            result = a.survey - b.survey;
        }
    } else {
        if (b.survey && b.survey.scoring) {
            if (!a.survey.scoring) {
                console.log("errrrrrrrrrrrrrrrrrrror");
            }
            result = b.survey.scoring[scoringKey] - a.survey.scoring[scoringKey];
        } else {
            result = b.survey - a.survey;
        }
    }
	return (result);
}


function getSurvey(sortingKey) {
    "use strict";
    console.log("getSurvey", filter);
        
    var survey = {};
    if (isFFS) {
        if (sortingKey === "score_final") {
            survey = surveysPayload.avgScoring;
        } else {
            survey = surveysPayload.avgScoringWOSA;
        }
    } else {
        survey = surveysPayload.survey;
    }
    return survey;
}

/**
 *  sort current answers based on the selection made
 */
function sortAnswers() {
    "use strict";
    console.log("sortAnswers", filter);
	var survey, answers, sortedAnswers, i, key, ordering;
	//survey = surveysPayload.survey;
    survey = getSurvey(filter.sorting);
    //ordering = document.getElementById("ordering");
	if (filter.sorting !== "question") {
        // show ordering button
        //ordering.classList.remove("hide");
		answers = [];
		for (key in survey) {
            if (survey.hasOwnProperty(key)) {
                if (key !== 'general_info' && key !== 'S0_INFO') {
                    answers.push({key: key, survey: survey[key]});
                }
            }
		}
		sortedAnswers = answers.sort(comparator);
		filter.sortedKeys = [];
		for (i = 0; i < sortedAnswers.length; i++) {
			filter.sortedKeys.push(sortedAnswers[i].key);
		}
	} else {
        // hide ordering button
        //ordering.classList.add("hide");
		prepareSortedKeys(survey);
	}
	getAnswers();
}

function setSorting(evt) {
    "use strict";
    //console.log("setSorting");
	filter.initialized = true;
    filter.sorting = evt.target.value.split(":")[0];
    filter.order = evt.target.value.split(":")[1];
    sortAnswers();
	// show general chart
	initGeneralCharts(true);
    console.debug("function  setSorting completed " + evt.target.value);
}

function configureListeners() {
	//console.log("configureListeners");
    "use strict";
	// add listener on sorting dropdown
	$("#sorting").on('change', setSorting);
	$("#direction").on('change', setDirection);
    //$("#scoring-type").on('change', setScoringType);
    $("#grouping").on('change', setGrouping);
    $("#certificate").on('click', sendCertificateRequest);
    $("#expand-collapse-button").on('click', toggleExpandCollapseButton);
}

function setSorting(evt) {
    "use strict";
    //console.log("setSorting");
	filter.initialized = true;
    filter.sorting = evt.target.value.split(":")[0];
    filter.order = evt.target.value.split(":")[1];
    sortAnswers();
	// show general chart
	initGeneralCharts(true);
    console.debug("function  setSorting completed " + evt.target.value);
}

function setDirection(evt) {
    "use strict";
    //console.log("setDirection");
    console.log("setDirection", filter);
	filter.initialized = true;
    filter.top_bottom = evt.target.value.split(":")[0];
    filter.quantity = evt.target.value.split(":")[1];
    if(!filter.quantity){
        filter.quantity = "all";
    }
    sortAnswers();
	// show general chart
	initGeneralCharts(true);
    console.debug("function  setDirection completed " + evt.target.value);
}

//deprecated
function setScoringType(evt) {
    "use strict";
    //console.log("setScoringType");
	filter.initialized = true;
    filter.scoring_type = evt.target.value;
    console.debug("function  setScoringType completed " + evt.target.value);
    //sortAnswers();
}
//deprecated
function setOrdering(evt) {
    "use strict";
    //console.log("setOrdering");
    var ordering;
    // set ordering
    filter.order = evt.target.getAttribute("order");
    ordering = document.getElementById("ordering");
    if (filter.order === "asc") {
        ordering.innerHTML = "<i class='fa fa-sort-amount-desc' order='desc'></i>";
    } else {
        ordering.innerHTML = "<i class='fa fa-sort-amount-asc' order='asc'></i>";
    }
    sortAnswers();
}

function setGrouping(evt) {
    "use strict";
    console.log("setGrouping");
	filter.initialized = true;
    filter.grouping = evt.target.value;
    if (filter.grouping === "male" || filter.grouping === "female") {
        filter.grouping_key = "S0_INFO.gender";
    } else if (filter.grouping === "farmer" || filter.grouping === "pastoralist" || filter.grouping === "agro-pastoralist") {
        filter.grouping_key = "S0_INFO.practice";
    } else if (filter.grouping === "certified" || filter.grouping === "conventional") {
        filter.grouping_key = "S0_INFO.farm_typology";
    } else {
        filter.grouping_key = "";
    }
    filterSurveys();
	//initGeneralCharts(true);
    initGeneralCharts(true);
    console.debug("function  setGrouping completed " + evt.target.value);
}



function formatDate(date) {
    "use strict";
    //console.log("formatDate");
	return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}

function clearCharts() {
    "use strict";
    //console.log("clearCharts");
    var i;
	/*
	 * empty current charts
	 */
	for (i = 0; i < charts.length; i++) {
		try {
			charts[i].destroy();
		} catch (err) {
			console.log(err);
		}
	}
	$(".sharp-chart").addClass("hide");
}


function setNoAnswers() {
    "use strict";
    //console.log("setNoAnswers");
	var pageHeader = document.getElementById("main-header");
	if (pageHeader) {
		var alert = document.createElement("div");
		alert.setAttribute("role", "alert");
		alert.classList.add("alert");
		alert.classList.add("alert-warning");
		alert.innerHTML = Moss.fn.string("@SND");
		pageHeader.appendChild(alert);
	} else {
		console.log("Page header not found");
	}
}

function manageError(data) {
    "use strict";
    console.log("manageError");
	setNoAnswers();
}

function showHeadingChart(chartConfig) {
    "use strict";
    //console.log("showHeadingChart");
	headingCharts.push(new Highcharts.Chart(chartConfig));
}

function showChart(chartConfig) {
    "use strict";
    //console.log("showChart");
	$("#" + chartConfig.chart.renderTo).removeClass("hide");
	charts.push(new Highcharts.Chart(chartConfig));
}

function saveSurveyComments() {
    "use strict";
    //console.log("saveSurveyComments");
    var survey;
    survey = surveysPayload.survey;
    survey.general_info["S0_INFO.comments"] = $("#survey_comments").val();
}

function getInitialChartConfig(chartTitle, height) {
    "use strict";
    //console.log("getInitialChartConfig");
	var defaultChartConfig;
	defaultChartConfig = {
        chart: {
            height: height,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginLeft: 70,
            marginRight: 20
        },
        colors: colors,
        exporting: {
            enabled: false
        },
        title: {
            text: chartTitle || Moss.fn.string("@SGS")
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            },
            line: {
                minPointLength: 3,
                marker: {
                    enabled: true,
                    fillColor: '#FFFFFF',
                    lineWidth: 3,
                    lineColor: null
                }
            },
            column: {
                minPointLength: 3
            },
            bar: {
                minPointLength: 3
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
            enabled: true,
            formatter: function () {
                return '<b>' + this.y + '</b>';
            }
        },
        yAxis: [
            {
                title: {
                    text: Moss.fn.string("Score")
                },
                labels: {
                    enabled: true,
                    format: '{value}'
                }
            }
        ]
    };
	return defaultChartConfig;
}



/**
 * 
 * @param attr attribute on which to execute the sorting
 * @param order ascending/descending
 */
function getSortedAnswers(sortingKey, qty, returnType, top_bottom) {
    "use strict";
    //console.log("getSortedAnswers");
    //console.log('getSortedAnswers sortingKey: ' + sortingKey +  ' qty: ' + qty +' returnType: ' + returnType)
	var survey, answers, sortedAnswers, i, key, ordering, sortedKeys;
    survey = getSurvey(sortingKey);
	
	if (sortingKey !== "question") {
		answers = [];
		for (key in survey) {
            if (survey.hasOwnProperty(key)) {
                if (key !== 'general_info' && key !== 'S0_INFO') {
                    // filter out inconsistent questions      
                    if (isFFS) {
                        if (survey[key] !== null) {
                            answers.push({key: key, survey: survey[key]});
                        } else {
                            console.log("Inconsistent question : " + key);
                        }
                    } else {
                        if (survey[key].scoring !== null) {
                            answers.push({key: key, survey: survey[key]});
                        } else {
                            console.log("Inconsistent question : " + key);
                        }
                    }
                }
            }
        }
		sortedAnswers = answers.sort(comparator);
		sortedKeys = [];
		if (qty === "all") {
			qty = sortedAnswers.length;
		}
		if (qty >= sortedAnswers.length) {
			qty = sortedAnswers.length;
		}
		if (top_bottom === "bottom") {
			sortedKeys.reverse();
			sortedAnswers.reverse();
		}
		for (i = 0; i < qty; i++) {
			if (returnType !== 'key') {
				sortedKeys.push(getSurveyTitle(sortedAnswers[i].survey, sortedAnswers[i].key, returnType));
			} else {
				sortedKeys.push(sortedAnswers[i][returnType]);
			}
		}
	} else {
		sortedKeys = [];
		for (key in survey) {
            if (survey.hasOwnProperty(key)) {
                if (key !== 'general_info') {
                    if (isFFS) {
                        if (survey[key] !== null) {
                            sortedKeys.push(key);
                        } else {
                            console.log("Inconsistent question : " + key);
                        }
                    } else {
                        if (survey[key].scoring !== null) {
                            sortedKeys.push(key);
                        } else {
                            console.log("Inconsistent question : " + key);
                        }
                    }
                }
            }
		}
	}
	return sortedKeys;
}






function getSurveyScore(question, key, scoringKey) {
    "use strict";
    //console.log("question: " +question + " key: " + key + " scoringKey: " + scoringKey);
    var score;
    if (isFFS) {
        if (scoringKey === "score_final" || scoringKey === "avgScoring") {
            score = surveysPayload.avgScoring[key];
        } else if (scoringKey === "score_calculated" || scoringKey === "avgScoringWOSA") {
            score = surveysPayload.avgScoringWOSA[key];
        }
    } else {
        if (scoringKey === "score_final" || scoringKey === "score_calculated") {
            score = question.scoring[scoringKey];
        } else if (scoringKey === "score_calculated") {
            score = surveysPayload.avgScoringWOSA[key];
        } else if (scoringKey === "avgScoringWOSA") {
            score = surveysPayload.avgScoringWOSA[key];
        } else if (scoringKey === "avgScoring") {
            score = surveysPayload.avgScoring[key];
        }
    }
    return score;
}

function getSurveyTitle(question, key, property) {
    "use strict";
    var title = "",
        survey,
        k,
        prop;
        
    if (question[property]) {
        title = question[property];
    } else {
        for (survey in surveysPayload.all_surveys) {
            if (surveysPayload.all_surveys.hasOwnProperty(survey)) {
                for (k in surveysPayload.all_surveys[survey]) {
                    if (surveysPayload.all_surveys[survey].hasOwnProperty(k)) {
                        if (k === key) {
                            for (prop in surveysPayload.all_surveys[survey][k]) {
                                if (surveysPayload.all_surveys[survey][k].hasOwnProperty(prop)) {
                                    if (prop === property) {
                                        title = surveysPayload.all_surveys[survey][k][prop];
                                        break;
                                    }
                                }

                            }
                        }
                    }
                }
            }
            
        }
    }
    return Moss.fn.string(title);
}
/**
 * Individual scoring series for a given survey
 * 
 * @param answerKeys : set of keys where to get anwsers' scoring
 * @param value : from which to get the values (score_final/score_calculated etc.)
 * @param type : line/column/pie etc.
 * @param axis : index of yAxis to be associated to the series
 * @returns series : to be added to the chart series
 */
function getScoringSeriesByKeys(answerKeys, value, type, axis) {
    "use strict";
    //console.log("getScoringSeriesByKeys");
	var series, i;
	series = {};
	if (type !== null) {
		series.type = type;
	} else {
		series.type = 'line';
	}
	if (axis) {
		series.yAxis = axis;
	}
	series.data = [];
	
	for (i = 0; i < answerKeys.length; i++) {
		var answer = surveysPayload.survey[answerKeys[i]];
		var data = {};
		if (answer) {
			data.y = answer.scoring[value];
		} else {
			data.y = 0;
		}
		if (surveysPayload.survey.general_info !== null) {
			data.name = surveysPayload.survey.general_info["S0_INFO.name_of_respondent"];
		} else {
			data.name = Moss.fn.string("@SNM");
		}
		
		series.data.push(data);
		series.name = surveysPayload.survey.general_info["S0_INFO.name_of_respondent"];
		series.color = colors.respondent;
	}
	return series;
}


function getAverageSeriesByGroup(answerKeys, type, groupId) {
    "use strict";
    //console.log("getAverageSeries");
	var avgSeries, i;
	/*
	 * prepare series for the average line
	 */
	avgSeries = {};
	avgSeries.type = (type === null ? "line" : type);
	avgSeries.name = "Group Average";//Moss.fn.string("@SFA");//"FFS average";
	avgSeries.color = colors.group;
	//avgSeries.dashStyle = 'longdash';
	//avgSeries.lineWidth = 0;
	var avgData = [],
        group = {},
        gid;
    for (gid in surveysPayload.groups) {
        if (surveysPayload.groups.hasOwnProperty(gid)) {
            if (surveysPayload.groups[gid].groupId === groupId) {
                group = surveysPayload.groups[gid];
            }
        }
    }

	for (i = 0; i < answerKeys.length; i++) {
		avgData.push(group.avgScoring[answerKeys[i]]);
	}
	avgSeries.data = avgData;
	return avgSeries;
    
    //console.log("getScoringSeriesByKeys");
	/*var series, i;
	series = {};
	if (type !== null) {
		series.type = type;
	} else {
		series.type = 'line';
	}
	if (axis) {
		series.yAxis = axis;
	}
	series.data = [];
	
	for (i = 0; i < answerKeys.length; i++) {
		var answer = surveysPayload.group.[answerKeys[i]];
		var data = {};
		if (answer) {
			data.y = answer.scoring[value];
		} else {
			data.y = 0;
		}
		if (surveysPayload.survey.general_info !== null) {
			data.name = surveysPayload.survey.general_info["S0_INFO.name_of_respondent"];			
		} else {
			data.name = Moss.fn.string("@SNM");
		}
		
		series.data.push(data);
		series.name = surveysPayload.survey.general_info["S0_INFO.name_of_respondent"];
		series.color = colors['respondent'];
	}
	return series;*/
}

function calculateAverageByCategory(key, attribute, value) {
	"use strict";
	//console.log("calculateAverageByCategory key: " + key + " attribute: " + attribute + " value: " + value);
    var values, survey, i, sum, avg, sortingKey;
	values = [];
	sum = 0;
    avg = null;
	if (filter.sorting !== "question") {
		sortingKey = filter.sorting;
	} else {
		sortingKey = "score_final";
	}
	for (i = 0; i < surveysPayload.all_surveys.length; i++) {
		survey = surveysPayload.all_surveys[i];
		if (survey.hasOwnProperty("general_info") && survey.general_info.hasOwnProperty(attribute)) {
			if (survey.general_info[attribute] === value) {
                if (survey.hasOwnProperty(key) && survey[key].scoring !== null) {
                    values.push(survey[key].scoring[sortingKey]);
                }
			}
		}
	}
	for (i = 0; i < values.length; i++) {
		sum = sum + values[i];
		avg = sum / values.length;
        avg = avg === null ? null : parseFloat(avg.toFixed(1));
	}
	//console.log("calculateAverageByCategory key: " + key + " attribute: " + attribute + " avg: " + avg);
	return avg;
}

function getAverageSeriesByCategory(answerKeys, type, category, label, value, color) {
	"use strict";
	var avgSeries, i;
	/*
	 * prepare series for the average chart
	 */
	avgSeries = {};
	avgSeries.type = (type === null ? "line" : type);
	avgSeries.name = Moss.fn.string(label);
	//avgSeries.color = (color === null ? "#95ceff" : color);
	avgSeries.dashStyle = 'longdash';
	avgSeries.lineWidth = 0;
	var avgData = [];
	for (i = 0; i < answerKeys.length; i++) {
		avgData.push(calculateAverageByCategory(answerKeys[i], category, value));
	}
	avgSeries.data = avgData;
	console.log("getAverageSeriesByCategory: category: " + category + " label: " + label +" value: " + value + " color" + color + " data found: " + avgData);
	return avgSeries;
}

function getAverageSeries(answerKeys, type, category) {
    "use strict";
    //console.log("getAverageSeries");
	var avgSeries, i;
	/*
	 * prepare series for the average line
	 */
	avgSeries = {};
	avgSeries.type = (type === null ? "line" : type);
	avgSeries.name = Moss.fn.string("@SFA");//"FFS average";
	avgSeries.color = colors.avg;
	avgSeries.dashStyle = 'longdash';
	avgSeries.lineWidth = 0;
	var avgData = [];
	for (i = 0; i < answerKeys.length; i++) {
		avgData.push(surveysPayload.avgScoring[answerKeys[i]]);
	}
	avgSeries.data = avgData;
	return avgSeries;
}



function initGeneralCharts() {
    "use strict";
    console.log("initGeneralCharts ", filter);
	var chartConfig1, chartConfig2, chartConfig3,  sortedAnwsers, sortedKeys, i, qty, top_bottom, sortingKey, sortedAnswers;
	if (filter.initialized === true) {
		qty = filter.quantity;
		top_bottom = filter.top_bottom;
		sortingKey = filter.sorting;
	} else {
		qty = 6; // default
		top_bottom = "top";
		sortingKey = "score_final";
	}
    
	chartConfig1 = getInitialChartConfig(Moss.fn.string("@SGS"),400);
	chartConfig1.series = [];
	sortedKeys = getSortedAnswers(sortingKey, qty, "key", top_bottom);
	sortedAnswers =  getSortedAnswers(sortingKey, qty, "title", top_bottom);
	chartConfig1.xAxis = {categories: sortedAnswers.slice(0,20)};
	//max available score is 30 for final and 10 for calculated
	chartConfig1.yAxis[0].max = (sortingKey === "score_final" ? 30 : 10);
	chartConfig1.yAxis[0].title.text = Moss.fn.string("@SRR");
	chartConfig1.series.push(getAverageSeries(sortedKeys.slice(0,20), 'column'));
	//console.log("filter.grouping_key: " + filter.grouping_key);

                                                
                                                
	if (filter.grouping_key === "S0_INFO.practice") {
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@SCR"), "farmer", colors.farmer));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@SCP"), "pastoralist", colors.pastoralist));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@SCS"), "agropastoralist", colors.agropastoralist));
	} else if (filter.grouping_key === "S0_INFO.gender") {
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.gender", Moss.fn.string("@SCM"), "male", colors.male));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.gender", Moss.fn.string("@SCF"), "female", colors.female));
	} else if (filter.grouping_key === "S0_INFO.farm_typology") {
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_certified"), "certified", colors.certified));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_conventional"), "conventional", colors.conventional));
	} else { // all		
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.gender", Moss.fn.string("@SCM"), "male", colors.male));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.gender", Moss.fn.string("@SCF"), "female", colors.female));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@VSV"), "farmer",  colors.farmer));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@KTO"), "pastoralist", colors.pastoralist));
        chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.practice", Moss.fn.string("@QBE"), "agropastoralist", colors.agropastoralist));
        chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_certified"), "certified", colors.certified));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'column', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_conventional"), "conventional", colors.conventional));
	}
	chartConfig1.chart.renderTo = "bottom-center-chart2";
	showChart(chartConfig1);

	chartConfig2 = getInitialChartConfig(Moss.fn.string("@SGS"),800);
	chartConfig2.chart.marginLeft = 120;
	chartConfig2.chart.marginRight = 30;
	chartConfig2.series = [];
	chartConfig2.xAxis = {categories: sortedAnswers};
	chartConfig2.yAxis[0].max = (sortingKey === "score_final" ? 30 : 10);
	chartConfig2.yAxis[0].title.text = Moss.fn.string("@SRR");
	//bottomChartConfig.xAxis.labels = {rotation: 90};
    if (!isFFS) {
        chartConfig2.series.push(getScoringSeriesByKeys(sortedKeys, sortingKey, 'bar', 0));
        chartConfig2.series.push(getAverageSeries(sortedKeys, 'line'));
    } else {
        chartConfig2.series.push(getAverageSeries(sortedKeys, 'bar'));
    }
	if (filter.grouping_key === "S0_INFO.practice") {
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@SCR"), "farmer",  colors.farmer));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@SCP"), "pastoralist", colors.pastoralist));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@SCS"), "agropastoralist", colors.agropastoralist));
	} else if (filter.grouping_key === "S0_INFO.gender") {
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.gender",   Moss.fn.string("@SCM"), "male", colors.male));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.gender",   Moss.fn.string("@SCF"), "female", colors.female));
	} else if (filter.grouping_key === "S0_INFO.farm_typology") {
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_certified"), "certified", colors.certified));
		chartConfig1.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_conventional"), "conventional", colors.conventional));
	} else {
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.gender",   Moss.fn.string("@SCM"), "male", colors.male));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.gender",   Moss.fn.string("@SCF"), "female", colors.female));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@VSV"), "farmer",  colors.farmer));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@KTO"), "pastoralist", colors.pastoralist));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.practice", Moss.fn.string("@QBE"), "agropastoralist", colors.agropastoralist));
        chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_certified"), "certified", colors.certified));
		chartConfig2.series.push(getAverageSeriesByCategory(sortedKeys, 'line', "S0_INFO.farm_typology", Moss.fn.string("@S0_INFO_01_conventional"), "conventional", colors.conventional));
	}
	chartConfig2.chart.renderTo = "bottom-center-chart3";
	showChart(chartConfig2);

	chartConfig3 = getInitialChartConfig(Moss.fn.string("@SGS"),400);
	chartConfig3.series = [];
	chartConfig3.xAxis = {categories: sortedAnswers.slice(0,20)};
	chartConfig3.yAxis[0].max = (sortingKey === "score_final" ? 30 : 10);
	chartConfig3.yAxis[0].title.text = Moss.fn.string("@SRR");
	//bottomChartConfig.xAxis.labels = {rotation: 90};
	if (!isFFS) {
        chartConfig3.series.push(getScoringSeriesByKeys(sortedKeys.slice(0,20), sortingKey, 'column', 0));
        chartConfig3.series.push(getAverageSeries(sortedKeys.slice(0,20), 'line'));
    } else {
        chartConfig3.series.push(getAverageSeries(sortedKeys.slice(0,20), 'column'));
    }
	if (filter.grouping !== "all") {        
		chartConfig3.series.push(getAverageSeriesByCategory(sortedKeys.slice(0,20), 'line', filter.grouping_key, $("#grouping option:selected").text()));        
	}
	chartConfig3.chart.renderTo = "bottom-center-chart";
	showChart(chartConfig3);
}

function getHeadingChartConfig(currentIdx, answerKey, value, type) {
    "use strict";
    //console.log("getHeadingChartConfig");
    var i;
	var seriesArray = [];
	var series = {};
	var series_hl = {};
    var scoringKey;
    if (filter.sorting === "question") {
        scoringKey = "score_final";
    } else {
        scoringKey = filter.sorting;
    }
	series_hl.type = "column";
	if (type && type !== null) {
		series.type = type;
	} else {
		series.type = 'area';
	}
    series.lineWidth = 1;
	series.data = [];
	series_hl.data = [];
	for (i = 0; i < surveysPayload.all_surveys.length; i++) {
        var answer;
		if (surveysPayload.all_surveys[i][answerKey] !== null) {
            answer = surveysPayload.all_surveys[i][answerKey];
            if (answer && answer.scoring !== null) {
                var data = {};
                var data_hl = {};
                if (i === currentIdx) {
                    data.color = "#FF0000";
                    data_hl.color = "#FF0000";
                    data_hl.y = answer.scoring[scoringKey];
                } else {
                    data_hl.y = 0;
                }
                data.y = answer.scoring[scoringKey];
                series.data.push(data);
                series_hl.data.push(data_hl);
            }
        }
	}
	chartConfig.series = [];
	chartConfig.series.push(series);
	chartConfig.series.push(series_hl);
	chartConfig.chart.renderTo = "heading-chart-" + answerKey;
	return chartConfig;
}

function getTopBottom() {
    "use strict";
    console.log("getTopBottom");
    var direction, quantity;
    if (filter.quantity !== "all") {
        direction = filter.top_bottom;
        quantity = filter.quantity;
        if (filter.sortedKeys.length > quantity) {
            if (direction === "top") {
                filter.sortedKeys.splice(quantity, (filter.sortedKeys.length - 1));
            } else if (direction === "bottom") {
                filter.sortedKeys.splice(0, (filter.sortedKeys.length - quantity));
            }
        }
    }
}

function getAnswers() {
    "use strict";
    //console.log("getAnswers");
    var i, a, key, sortedKeys, survey, scoringKey, scoringThresholds, avgScoringKey, scoringValue, avgScoringValue;
    getTopBottom();
	sortedKeys = filter.sortedKeys;
	survey = getSurvey(filter.sorting);//surveysPayload.survey;
    /*
    * identify the scoring keys and thresholds
    */
    if (filter.sorting === "question") {
        scoringKey = "score_final";
        avgScoringKey = "avgScoring";
        scoringThresholds = [10, 20, 30];
    } else if (filter.sorting === "score_final") {
        scoringKey = filter.sorting;
        avgScoringKey = "avgScoring";
        scoringThresholds = [10, 20, 30];
    } else {
        scoringKey = filter.sorting;
        avgScoringKey = "avgScoringWOSA";
        scoringThresholds = [3, 6, 10];
    }
    /*
     * clear all charts
     */
    clearCharts();
	
	/*
	 * set page header
	 */
	var pageHeader = document.getElementById("page-header");
    //use .innerHtml or better jquery's html()?
    
	pageHeader.innerHTML = "<h2>" + Moss.fn.string("@_ffs") + ": " + surveysPayload.superGroupName + "<span> (" + surveysPayload.group.id + ") </span>" + "</h2>";
	var panelBox = document.getElementById("widget-grid");
	var panelHeader = document.getElementById("panel-header");
	if (panelHeader) {
        if (isFFS) {
            panelHeader.innerHTML = surveysPayload.superGroupName;
        } else if (survey.general_info !== null &&
                survey.general_info !== undefined &&
                survey.general_info.hasOwnProperty("S0_INFO.name_of_respondent")) {
            
            /*
            * set comments
            */
            if (survey.general_info.hasOwnProperty("S0_INFO.comments")) {
                $("#survey_comments").val(survey.general_info["S0_INFO.comments"]);
            }
            panelHeader.innerHTML = "<span>" + Moss.fn.string("@SRP") + ": " + Moss.fn.string(survey.general_info["S0_INFO.name_of_respondent"]) + "</span>";
        } else {
            panelHeader.innerHTML = Moss.fn.string("@SNM");
        }
	} else {
		console.log("panel not found");
	}
	
	/*
	 * make the widget-grid visible
	 */
	panelBox.classList.remove("hide");
	
	/*
	 * start populating panel with information
	 */
	var panelContent = document.getElementById("wid-body-1");
	$(panelContent).empty();
	panelContent.classList.add("panel-group");
    for (i = 0; i < sortedKeys.length; i++) {
        key = sortedKeys[i];
        if (survey.hasOwnProperty(key)) {
            if (key !== "general_info") {
                var parentId = key;
                var question = survey[parentId];
                var questionPanel = document.createElement("div");
                var questionIndex = Moss.model.survey.revmap[key];

                panelContent.appendChild(questionPanel);

                questionPanel.setAttribute("id", key);
                questionPanel.classList.add("panel");
                questionPanel.classList.add("panel-default");

                var questionPanelHeading = document.createElement("div");
                questionPanelHeading.classList.add("panel-heading");

                var questionPanelHeadingRow = document.createElement("div");
                questionPanelHeadingRow.classList.add("row");

                if (!isFFS) {
                    var questionPanelHeadingChart = document.createElement("div");
                    questionPanelHeadingChart.classList.add("col-md-2");
                    questionPanelHeadingChart.setAttribute("id", "heading-chart-" + key);
                }

                
                var questionPanelHeadingText = document.createElement("h4");
                if (!isFFS) {
                    questionPanelHeadingText.classList.add("col-md-5");
                } else {
                    questionPanelHeadingText.classList.add("col-md-4");
                }
                questionPanelHeadingText.classList.add("panel-title");
                
                if (!isFFS) {
                    questionPanelHeadingText.setAttribute("onclick", "expandSurvey('" + key + "')");
                }

                // div containing personal and final score
                var questionPanelHeadingBadge = document.createElement("div");
                questionPanelHeadingBadge.classList.add("col-md-3");
                questionPanelHeadingBadge.setAttribute("id", "heading-badge-" + key);

                var questionPanelHeadingToggle = document.createElement("a");
                questionPanelHeadingToggle.setAttribute("id", "toggle-" + key);
                questionPanelHeadingToggle.classList.add("panel-toggle");
                questionPanelHeadingToggle.classList.add("collapsed");

                var questionPanelHeadingToggleTextSpan = document.createElement("span");
                questionPanelHeadingToggleTextSpan.innerHTML = getSurveyTitle(question, key, "title");//Moss.fn.string(question.title);
                if (!isFFS) {
                    var jumpToQuestionBox = document.createElement("div");
                    jumpToQuestionBox.classList.add("col-md-2");

                    var jumpToQuestionBoxLink = document.createElement("a");
                    jumpToQuestionBoxLink.setAttribute('onclick', 'jumpToQuestion(\"' + key + '\")');
                    jumpToQuestionBoxLink.setAttribute('href', 'survey-edit.html');
                    jumpToQuestionBoxLink.classList.add("btn");
                    jumpToQuestionBoxLink.classList.add("btn-primary");
                    jumpToQuestionBoxLink.innerHTML = "<i class='fa fa-external-link'></i> " + Moss.fn.string("@SJQ");

                    jumpToQuestionBox.appendChild(jumpToQuestionBoxLink);
                }
                questionPanelHeadingToggle.appendChild(questionPanelHeadingToggleTextSpan);


                /*
                 * compose accordion element
                 */
                questionPanelHeadingText.appendChild(questionPanelHeadingToggle);
                if (!isFFS) {
                    questionPanelHeadingRow.appendChild(questionPanelHeadingChart);
                }
                questionPanelHeadingRow.appendChild(questionPanelHeadingText);
                questionPanelHeadingRow.appendChild(questionPanelHeadingBadge);
                if (!isFFS) {
                    questionPanelHeadingRow.appendChild(jumpToQuestionBox);
                }
                questionPanelHeading.appendChild(questionPanelHeadingRow);
                questionPanel.appendChild(questionPanelHeading);

                var panelQuestionCollapse = document.createElement("div");
                panelQuestionCollapse.setAttribute("id", "collapse-" + key);
                panelQuestionCollapse.classList.add("panel-collapse");
                panelQuestionCollapse.classList.add("collapse");
                panelQuestionCollapse.classList.add("out");
                panelQuestionCollapse.style.height = "auto";

                questionPanel.appendChild(panelQuestionCollapse);

                var questionPanelBody = document.createElement("div");
                questionPanelBody.classList.add("panel-body");

                panelQuestionCollapse.appendChild(questionPanelBody);
                if (!isFFS) {
                    for (a = 0; a < question.scoring.score_components.length; a++) {
                        var component = question.scoring.score_components[a];
                        var qaBox = document.createElement("div");
                        qaBox.classList.add("row");
                        qaBox.classList.add("list-group");
                        //qaBox.classList.add("list-group-item");

                        questionPanelBody.appendChild(qaBox);

                        var questionBox = document.createElement("div");
                        questionBox.classList.add("col-md-8");

                        var answerBox = document.createElement("div");
                        answerBox.classList.add("col-md-4");

                        qaBox.appendChild(questionBox);
                        qaBox.appendChild(answerBox);

                        questionBox.innerHTML = "<i class='sharp-" + key + " question-title-icon'></i> <span class='question-title-text'>" + Moss.fn.string(component.label) + "</span>";
                        answerBox.innerHTML = "<span class='question-title-text'>" + component.value + "</span>";
                    }

                    /*
                     * create boxes for adequacy and importance
                     */
                    var paddingBox = document.createElement("div");
                    paddingBox.classList.add("col-md-1");
                    var aiBox = document.createElement("div");
                    aiBox.classList.add("row");
                    aiBox.appendChild(paddingBox);

                    if (question.scoring.hasOwnProperty("score_adequacy")) {
                        var adequacyBox = document.createElement("div");
                        adequacyBox.classList.add("col-md-5");
                        adequacyBox.classList.add("well");
                        adequacyBox.classList.add("score_adequacy");
                        adequacyBox.innerHTML = "<span><strong>" + question.scoring.score_adequacy + "</strong><span><br /><span class='score_adequacy_label'>Adequacy</span>";
                        aiBox.appendChild(adequacyBox);
                    }
                    if (question.scoring.hasOwnProperty("score_importance")) {
                        var importanceBox = document.createElement("div");
                        importanceBox.classList.add("col-md-5");
                        importanceBox.classList.add("well");
                        importanceBox.classList.add("score_importance");
                        importanceBox.innerHTML = "<span><strong>" + question.scoring.score_importance + "</strong><span><br /><span class='score_adequacy_label'>Importance</span>";
                        aiBox.appendChild(importanceBox);
                    }

                    paddingBox = document.createElement("div");
                    paddingBox.classList.add("col-md-1");
                    aiBox.appendChild(paddingBox);

                    questionPanelBody.appendChild(aiBox);
                }
               // }

                /*
                 * create span for final scoring and school avg
                 */
                var scoringBox = document.createElement("div");
                var scoringBoxTitle = document.createElement("div");

                scoringBox.classList.add("row");
                scoringBoxTitle.classList.add("row");
                var scoringFinalSpan = document.createElement("div");
                var scoringAvgSpan = document.createElement("div");
                var scoringFinalTitleSpan = document.createElement("div");
                var scoringAvgTitleSpan = document.createElement("div");

                scoringFinalSpan.classList.add("col-md-6");
                
                if (!isFFS) {
                    scoringAvgSpan.classList.add("col-md-6");
                } else {
                    scoringAvgSpan.classList.add("col-md-8");
                }

                scoringFinalTitleSpan.classList.add("col-md-6");
                if (!isFFS) {
                    scoringAvgTitleSpan.classList.add("col-md-6");
                } else {
                    scoringAvgTitleSpan.classList.add("col-md-8");
                }

                scoringFinalTitleSpan.innerHTML = Moss.fn.string("@SPS");
                scoringAvgTitleSpan.innerHTML = Moss.fn.string("@SFA");

                if (!isFFS) {
                    scoringBox.appendChild(scoringFinalSpan);
                }
                scoringBox.appendChild(scoringAvgSpan);

                if (!isFFS) {
                    scoringBoxTitle.appendChild(scoringFinalTitleSpan);
                }
                scoringBoxTitle.appendChild(scoringAvgTitleSpan);

                scoringFinalSpan.setAttribute("title", Moss.fn.string("@score_final"));
                scoringAvgSpan.setAttribute("title", Moss.fn.string("@SFA"));
                /*
                 * put final scoring into panel header badge
                 */
				//scoringValue = ((question.scoring[scoringKey] === null || question.scoring[scoringKey] === undefined) ? 0 : question.scoring[scoringKey]);
                scoringValue = getSurveyScore(question, key, scoringKey);//((question.scoring[scoringKey] === null || question.scoring[scoringKey] === undefined) ? 0 : question.scoring[scoringKey]);
                if (scoringValue >= 0 && scoringValue <= scoringThresholds[0]) {
                    scoringFinalSpan.classList.add("label");
                    scoringFinalSpan.classList.add("custom-badge");
                    scoringFinalSpan.classList.add("bg-color-red");
                } else if (scoringValue > scoringThresholds[0] && scoringValue <= scoringThresholds[1]) {
                    scoringFinalSpan.classList.add("label");
                    scoringFinalSpan.classList.add("custom-badge");
                    scoringFinalSpan.classList.add("bg-color-yellow");
                } else if (scoringValue > scoringThresholds[1] && scoringValue <= scoringThresholds[2]) {
                    scoringFinalSpan.classList.add("label");
                    scoringFinalSpan.classList.add("custom-badge");
                    scoringFinalSpan.classList.add("bg-color-green");
                }
                scoringFinalSpan.innerHTML = scoringValue + "<i class='fa fa-user pull-right'></i>";

                /*
                 * put school average scoring into panel header badge
                 */
				//avgScoringValue = ((surveysPayload[avgScoringKey][key] === null || surveysPayload[avgScoringKey][key] === undefined) ? 0 : surveysPayload[avgScoringKey][key]);
                avgScoringValue = getSurveyScore(question, key, avgScoringKey); //((surveysPayload[avgScoringKey][key] === null || surveysPayload[avgScoringKey][key] === undefined) ? 0 : surveysPayload[avgScoringKey][key]);
                if (avgScoringValue >= 0 && avgScoringValue <= scoringThresholds[0]) {
                    scoringAvgSpan.classList.add("label");
                    scoringAvgSpan.classList.add("custom-badge");
                    scoringAvgSpan.classList.add("bg-color-red");
                } else if (avgScoringValue > scoringThresholds[0] && avgScoringValue <= scoringThresholds[1]) {
                    scoringAvgSpan.classList.add("label");
                    scoringAvgSpan.classList.add("custom-badge");
                    scoringAvgSpan.classList.add("bg-color-yellow");
                } else if (avgScoringValue > scoringThresholds[1] && avgScoringValue <= scoringThresholds[2]) {
                    scoringAvgSpan.classList.add("label");
                    scoringAvgSpan.classList.add("custom-badge");
                    scoringAvgSpan.classList.add("bg-color-green");
                }
                scoringAvgSpan.innerHTML = avgScoringValue + "<i class='fa fa-users pull-right'></i>";
                questionPanelHeadingBadge.appendChild(scoringBoxTitle);
                questionPanelHeadingBadge.appendChild(scoringBox);
                if (!isFFS) {
                    var chartConfig = getHeadingChartConfig(Moss.model.currentSurveyIdx, key,  question.scoring[scoringKey]);
                    showHeadingChart(chartConfig);
                }
            }
        }
    }
}

function jumpToQuestion(key) {
    "use strict";
    //console.log("jumpToQuestion");
    var idx;
    idx = Moss.model.survey.revmap[key];
    saveSurveyComments();
    Moss.fn.jumpToQuestion(idx, Moss.model.currentSurveyIdx);
}

function changeCurrentLanguage(lang) {
    "use strict";
    //console.log("changeCurrentLanguage");
	currentLanguage = lang;
	getAnswers(0);
}

function getScoringSeries(answerKey, value, type, axis) {
    "use strict";
    //console.log("getScoringSeries");
    var i;
	var series = {};
	if (type !== null) {
		series.type = type;
	} else {
		series.type = 'line';
	}
    if (axis) {
        series.yAxis = axis;
    }
	series.data = [];
	
	for (i = 0; i < surveysPayload.all_surveys.length; i++) {
		var answer = surveysPayload.all_surveys[i][answerKey];
		var data = {};
		if (answer) {
			data.y = answer.scoring[value];
		} else {
			data.y = 0;
		}
        if (surveysPayload.all_surveys[i].general_info !== null && surveysPayload.all_surveys[i].general_info.hasOwnProperty("S0_INFO.name_of_respondent")) {
            data.name = surveysPayload.all_surveys[i].general_info["S0_INFO.name_of_respondent"];
        } else {
            data.name = Moss.fn.string("@SNM");
        }
		series.data.push(data);
		series.name = Moss.fn.string(value); // TODO replace with label from dictionary
	}
	return series;
}



function expandSurvey(id) {
    "use strict";
    //console.log("expandSurvey");
    var i;
    $("#collapse-" + id).toggleClass("in");
    if ($("#collapse-" + id).hasClass("in")) {
        $("#collapse-" + id).removeClass("out");
        $("#collapse-" + id).attr("style", "height: auto");
    } else {
        $("#collapse-" + id).addClass("out");
        $("#collapse-" + id).attr("style", "height: 0px;");
    }
	var question = surveysPayload.survey[id];
	var chartCategories = [];
	for (i = 0; i < surveysPayload.all_surveys.length; i++) {
        if (surveysPayload.all_surveys[i].general_info !== null && surveysPayload.all_surveys[i].general_info.hasOwnProperty("S0_INFO.name_of_respondent")) {
            chartCategories.push(surveysPayload.all_surveys[i].general_info["S0_INFO.name_of_respondent"]);
        } else {
            chartCategories.push(Moss.fn.string("@SNM"));
        }
	}
}

function toggleExpandCollapseButton() {
    "use strict";
    //console.log("toggleExpandCollapseButton");
    var toggleButton, status;
    toggleButton = document.getElementById("expand-collapse-button");
    status = toggleButton.getAttribute("status");
	if (status === "collapsed") {
        toggleButton.setAttribute("status", "expanded");
	    $('.out').collapse('toggle');
	    $('.out').removeClass('out');
	    toggleButton.innerHTML = "<i class='fa fa-folder'></i> " + Moss.fn.string("@SCA");
	} else {
        toggleButton.setAttribute("status", "collapsed");
	    $('.collapse').addClass('out');
	    $('.in').collapse('toggle');
		toggleButton.innerHTML = "<i class='fa fa-folder-open'></i> " + Moss.fn.string("@SEA");
	}
    console.debug("function  toggleExpandCollapseButton completed");
}

function expandAll() {
    "use strict";
    var toggleButton;
    
    $(".panel-collapse").addClass("in");
    toggleButton = document.getElementById("expand-collapse-button");
    toggleButton.setAttribute("onclick", "collapseAll()");
    toggleButton.innerHTML = Moss.fn.string("@SCA");
    
}

function collapseAll() {
    "use strict";
    var toggleButton;
    $(".in").removeClass("in");
    toggleButton = document.getElementById("expand-collapse-button");
    toggleButton.setAttribute("onclick", "expandAll()");
    toggleButton.innerHTML = Moss.fn.string("@SEA");
}

function printPage() {
    "use strict";
    window.print();
}

function manageSuccess(data) {
    "use strict";
	//surveysPayload = data;
	//addNavigation();
	getAnswers(0);
}

function manageComplete(data) {
    "use strict";
	//console.log("VMT DEBUG : inside manageComplete");
}




/*
*   fill in the status box with the info about form completion
*/
function initStatus() {
    "use strict";
    //console.log("initStatus");
    var statusBox, statusText, completed, required, percentage;
    statusBox = document.getElementById("panel-status");
    completed = Moss.model.surveys[Moss.model.currentSurveyIdx].completed;
    required = Moss.model.surveys[Moss.model.currentSurveyIdx].total_required;
    percentage = completed / required * 100;
    if (percentage > 0 && percentage <= 33) {
        $(statusBox).addClass("text-color-red");
    } else if (percentage > 33 && percentage <= 66) {
        $(statusBox).addClass("text-color-yellow");
    } else {
        $(statusBox).addClass("text-color-green");
    }
    statusText = Moss.fn.string("@SSC") + ": " + completed + "/" + required + " " + Moss.fn.string("@SSP") + " (" + percentage.toFixed(1) + "%)";
    statusBox.innerHTML = "<div class='panel-status-text pull-right'>" + statusText + "</div>";
}

function initCurrentData(data) {
    "use strict";
    //console.log("initCurrentData");
    //console.log(data);
    surveysPayload = data;
    originalSurveysPayload = data;
    prepareSortedKeys(surveysPayload.survey);
    getAnswers();
	initGeneralCharts(true);
    initStatus();
}

function extractFFSData() {
    "use strict";
    //console.log("extractCurrentData");
    isFFS = true;
    $("#navbar-scoring").empty();
    Moss.ui.renderWidget('navbar-scoring', 'navbar', {scoring: true});
    var selections = $("#navbar-scoring button"),
        i;
	for (i = 0; i < selections.length; i++) {
        if (selections[i].id !== "navbar-fs") {
            $(selections[i]).removeClass("ui-btn-active");
        }
    }
    $("#navbar-fs").addClass("ui-btn-active");
    Sharp.loadIndividual(initCurrentData);

}


function extractCurrentData() {
    "use strict";
    //console.log("extractCurrentData");
    isFFS = false;
    $("#navbar-scoring").empty();
    Moss.ui.renderWidget('navbar-scoring', 'navbar', {scoring: true});
    Sharp.loadIndividual(initCurrentData);
}

function filterSurveys() {
    "use strict";
    //console.log("filterSurveys");
	var filteredSurveys, i, survey, filterKey, filterValue, currentSurvey;
	surveysPayload = JSON.parse(JSON.stringify(originalSurveysPayload));
	prepareSortedKeys(currentSurvey);
	if (filter.grouping !== "all") {
		filteredSurveys = [];
		currentSurveyIndex = 0;
		filterKey = filter.grouping_key;
		filterValue = filter.grouping;
		// apply selected filter
		for (i = 0; i < surveysPayload.all_surveys.length; i++) {
			survey = surveysPayload.all_surveys[i];
			if (survey.general_info.hasOwnProperty(filterKey) &&
                    survey.general_info[filterKey] !== null &&
                    survey.general_info[filterKey] === filterValue &&
                    JSON.stringify(survey) !== JSON.stringify(currentSurvey)) {
				filteredSurveys.push(survey);
			}
		}
		surveysPayload.all_surveys = filteredSurveys;
	} else {
		extractCurrentData();
	}
	//addNavigation();
	getAnswers();
	// show general chart with initial parameters
	//initGeneralCharts();
}

function sendCertificateRequest() {
    "use strict";
    //console.log("sendCertificateRequest");
    var quantity, tempFilter, i, survey, answers, key, sortedAnswers, sortedKeys, completed, required, minimum, startDate, endDate, district, country, region, respondent, comments;
    minimum = 0;
    /*
    * save comments
    */
    saveSurveyComments();
    completed = Moss.model.surveys[Moss.model.currentSurveyIdx].completed;
    required = Moss.model.surveys[Moss.model.currentSurveyIdx].total_required;
    if (completed >= minimum) {
        survey = surveysPayload.survey;
        // make a copy of the current filter
        tempFilter = {};
        filter.sorting = "final_score";
        // execute sorting by score final
        answers = [];
        sortedKeys = [];
        for (key in survey) {
            if (survey.hasOwnProperty(key)) {
                if (key !== 'general_info' && key !== 'S0_INFO') {
                    answers.push({key: key, survey: survey[key]});
                }
            }
        }
        sortedAnswers = answers.sort(comparator);
        filter.sorting = "question";

        tempFilter.sortedKeys = [];
        for (i = 0; i < sortedAnswers.length; i++) {
            tempFilter.sortedKeys.push(sortedAnswers[i].key);
        }

        if (tempFilter.sortedKeys.length <= 5) {
            quantity = tempFilter.sortedKeys.length;
        } else {
            quantity = 5;
        }
        if (survey.general_info.hasOwnProperty("S0_INFO.date")) {
            startDate = survey.general_info["S0_INFO.date"];
        } else {
            startDate = "__/__/__";
        }
        if (surveysPayload.hasOwnProperty("uploadDate")) {
            endDate = formatDate(new Date(surveysPayload.uploadDate));
        } else {
            endDate = "__/__/__";
        }
        if (survey.general_info.hasOwnProperty("S0_INFO.district")) {
            district = survey.general_info["S0_INFO.district"];
        } else {
            district = null;
        }
        if (survey.general_info.hasOwnProperty("S0_INFO.country")) {
            country = survey.general_info["S0_INFO.country"];
        } else {
            country = "";
        }
        if (survey.general_info.hasOwnProperty("S0_INFO.region")) {
            region = survey.general_info["S0_INFO.region"];
        } else {
            region = "";
        }
        if (survey.general_info.hasOwnProperty("S0_INFO.comments")) {
            comments = survey.general_info["S0_INFO.comments"];
        } else {
            comments = "";
        }
    
        var options = {
            school: surveysPayload.superGroupName,
            location: (district === null ? "" : (district + ", ")) + country + " (" + (region === null ? "_________" : region) + ")",
            respondent: survey.general_info["S0_INFO.name_of_respondent"],
            dateStarted: startDate,
            dateCompleted: endDate,
            comments: comments,
            strengths: [],
            weakness: []
        };

        //sorts the surveys and takes the first 5 with highest score and the 5 with lowest score
        tempFilter.sortedKeys.splice(quantity, (tempFilter.sortedKeys.length - 1));
        for (i = 0; i < tempFilter.sortedKeys.length; i++) {
            //options.strengths.push(Moss.fn.string(survey[tempFilter.sortedKeys[i]].title));
            options.strengths.push({key: tempFilter.sortedKeys[i], value: Moss.fn.string(survey[tempFilter.sortedKeys[i]].title)});
        }

        tempFilter.sortedKeys = [];
        for (i = 0; i < sortedAnswers.length; i++) {
            tempFilter.sortedKeys.push(sortedAnswers[i].key);
        }

        tempFilter.sortedKeys.splice(0, (tempFilter.sortedKeys.length - quantity));
        for (i = 0; i < tempFilter.sortedKeys.length; i++) {
            //options.weakness.push(Moss.fn.string(survey[tempFilter.sortedKeys[i]].title));
            options.weakness.push({key: tempFilter.sortedKeys[i], value: Moss.fn.string(survey[tempFilter.sortedKeys[i]].title)});
        }
        Sharp.requestCertificate(options);
    } else {
        Moss.ui.notifyWarning(Moss.fn.string("@SE1") + ": " + surveysPayload.total_required + " " + Moss.fn.string("@SE2"));
    }
    
    console.debug("function  sendCertificateRequest completed");
    
}