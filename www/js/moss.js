/*jslint plusplus: true */
/*jslint evil: true */
/*jslint nomen: true */
/*jslint continue: true */
/*global navigator, localStorage, openDatabase, console, $, doT, toastr, JSZip, document, window, getAnswers, prepareSortedKeys, extractCurrentData, configureListeners, surveysPayload, createAttendanceReportListDataTable,  FileChecksum, Sharp, Camera, FileTransfer, FileUploadOptions, initAttendanceReportSearch, initAttendanceReportEdit, LocalFileSystem, ble*/


var Moss = (function ($, doT, toastr, JSZip) {
    "use strict";
    /*
    $.getScript('./js/prova.js', function ()
    {
        // script is now loaded and executed.
        // put your dependent JS here.
    });
    */
    
    var Moss = {
        version: "2.0.9",
        surveyNameAndVersion: "sharp-1.0-eth",
        settings: {},
        shared: {},
        schemas: {},
        model: {},
        fn: {},
        svc: {},
        ui: {},
        plugins: [],
        devices: [{"name":"Andrea’s iMac","id":"6B:F9:2F:6D:F4:F7","advertising":{},"rssi":-70},{"name":"Charge HR","id":"E6:7D:37:4D:CA:DB","advertising":{},"rssi":-85},{"name":"Andrea’s iMac","id":"6B:F9:2F:6D:F4:F7","advertising":{},"rssi":-71},{"name":"Seos","id":"F4:02:00:D7:B0:53","advertising":{},"rssi":-95},{"name":"Seos","id":"F4:02:00:D7:B0:53","advertising":{},"rssi":-97},{"name":"Andrea’s iMac","id":"6B:F9:2F:6D:F4:F7","advertising":{},"rssi":-72},{"name":"Charge HR","id":"E6:7D:37:4D:CA:DB","advertising":{},"rssi":-81}],
        debug: true
    };
    
    Moss.register = function (plugin) {
        Moss.plugins[Moss.plugins.length] = plugin;
    };

    Moss.init = function () {
        var i;
        function getTemplate(url, callback) {
            return $.ajax({
                type : "GET",
                url : url,
                mimeType : "text/plain",
                contentType : "text/plain; charset=utf-8",
                dataType : "text",
                success : callback,
                error : function (xhr, textStatus, errorThrown) {
                    console.error(xhr.responseText);
                }
            });
        }

        function loadWidgetTemplate(widget) {
            getTemplate("moss-widgets/" + widget + ".html", function (data) {
                Moss.ui[widget] = Moss.ui[widget] || {};
                Moss.ui[widget].tpl = doT.template(data);
            });
        }

        if (Moss.initialized) {
            return;
        }

        Moss.settings = localStorage.getItem("settings");
        if (Moss.settings) {
            Moss.settings = JSON.parse(Moss.settings);
        } else {
            Moss.settings = {version: Moss.version, language: "en", surveyNameAndVersion: Moss.surveyNameAndVersion, dataDirectory: "/"};
        }
        
        if (!Moss.fn.settings.surveyNameAndVersion) {
            Moss.fn.settings.surveyNameAndVersion = Moss.surveyNameAndVersion;
        }
        
        Moss.fn.clearModel();
        Moss.model.survey = null;
        Moss.model.attendanceReport = null;
        Moss.shared.surveyDictionary = null;
        Moss.tmp = null;

        Moss.fn.loadDictionaries();
                      
        loadWidgetTemplate('adequacy-importance');
        loadWidgetTemplate('button');
        loadWidgetTemplate('calendar');
        loadWidgetTemplate('current-score');
        loadWidgetTemplate('default_wdg');
        loadWidgetTemplate('gps');
        loadWidgetTemplate('grid');
        loadWidgetTemplate('hidden');
        loadWidgetTemplate('hide_show');
        loadWidgetTemplate('html');
        loadWidgetTemplate('info');
        loadWidgetTemplate('int');
        loadWidgetTemplate('int_and_textarea');
        loadWidgetTemplate('int_not_applicable');
        loadWidgetTemplate('label');
        loadWidgetTemplate('message');
        loadWidgetTemplate('multi');
        loadWidgetTemplate('navbar');
        loadWidgetTemplate('navbuttons');
        loadWidgetTemplate('popup');
        loadWidgetTemplate('qstatus');
        loadWidgetTemplate('qstatus-all');
        loadWidgetTemplate('radio');
        loadWidgetTemplate('radio_and_textarea');
        loadWidgetTemplate('radio-single');
        loadWidgetTemplate('section');
        loadWidgetTemplate('select');
        loadWidgetTemplate('text');
        loadWidgetTemplate('textarea');
        loadWidgetTemplate('title');
        loadWidgetTemplate('yes');
        loadWidgetTemplate('yes_no');
        loadWidgetTemplate('yes_no_dontknow');
        loadWidgetTemplate('yes_no_dontknow_refused');
        loadWidgetTemplate('yes_no_not_applicable');
        loadWidgetTemplate('yes_no_textarea');

        //init multipage popup
        
        Moss.svc.initDatabase();

        
        //TODO check why data is lost in sharp.js
        
        //MSS multi schema survey
        //MSS commented: schema should be loaded on new survey and saved with the survey itself
        //Moss.fn.loadSurveySchema(Moss.fn.settings.surveyNameAndVersion,function () {});       
        
        
        Moss.fn.registerEvents();
        for (i = 0; i < Moss.plugins.length; i++) {
            Moss.plugins[i].registerEvents();
        }
        
        Moss.schemas = [
            {"id" : "sharp-1.0-eth", "name"     : "@_sharp_eth_version"}
            /*
            {"id" : "sharp-1.0-full", "name"     : Moss.fn.string("@_sharp_full_version|SHARP full version")},
            {"id" : "sharp-1.0-standard", "name" : Moss.fn.string("@_sharp_standard_version|SHARP Standard version")},
            {"id" : "sharp-1.0-rapid", "name"    : Moss.fn.string("@_sharp_rapid_version|SHARP rapid version")},
            {"id" : "sharp-1.0-ssudan", "name"   : Moss.fn.string("@_sharp_ssudan_version|SHARP South Sudan version")},
            {"id" : "sharp-1.0-hhbat", "name"    : Moss.fn.string("@_sharp_hhbat_version|SHARP HH/BAT version")}            
            {"id" : "sharp-1.0-full", "name"     : "@_sharp_full_version"},
            {"id" : "sharp-1.0-standard", "name" : "@_sharp_standard_version"},
            {"id" : "sharp-1.0-rapid", "name"    : "@_sharp_rapid_version"},
            {"id" : "sharp-1.0-ssudan", "name"   : "@_sharp_ssudan_version"},
            {"id" : "sharp-1.0-hhbat", "name"    : "@_sharp_hhbat_version"}
            */
        ];
        Moss.initialized = true;
        Moss.fn.updateData(false);
    };
    
    Moss.fn.log = function (message) {
        if (Moss.debug) {
            console.log(message);
        }
    };
    /**
    Need to upgrade cordova to version 5 to use the app version plugin
    for the moment app version will be stored in the localstorage
    */
    Moss.fn.updateData = function (forceUpdate) {
        Moss.fn.updatePersons();
        var doUpdate = forceUpdate;
        if (!Moss.settings.version || Moss.settings.version !== Moss.version) {
            doUpdate = true;
        }
        if (doUpdate) {
           
           // Moss.fn.log("updating data...");      
            
         /*    Moss.fn.log("update schemas");                           
            Moss.fn.log("update geographical data");
            Moss.fn.log("update values and labels");
            Moss.fn.log("update surveys");
          */
            $.getScript('./surveys/sharp-1.0.js', function () {
                
                Moss.svc.findAllGroups(function (groups) {
                    var g, group;
                    for (g in groups) {
                        if (groups.hasOwnProperty(g)) {
                            group = groups[g];
                            Moss.svc.findAllSurveysByGroupId(group, Moss.fn.updateGroupSchema);
                        }
                    }
                });
             
                
            });
        } else {
            Moss.fn.log("no need to update data");
        }
    };
    
    Moss.fn.updateGroupSchema = function (group, surveys) {
        var json = JSON.parse(group.json),
            hasSchema = !(!json.templateVersion || json.templateVersion === 'sharp,1.0'),
            answers,
            survey,
            country,
            index;
        
        if (surveys) {
            for (index in surveys) {
                if (surveys.hasOwnProperty(index)) {
                    survey = surveys[index];
                    answers = survey.json.answers;
                    country = answers.S0_INFO["S0_INFO.country"];
                    //Moss.fn.log(answers["S0_INFO"]["S0_INFO.name_of_respondent"]);

                    if (!hasSchema) {
                            //Moss.fn.log("saving group from " + json.templateVersion)
                        if ("south_sudan" === country) {
                            json.templateVersion = "sharp-1.0-ssudan";
                        } else if ("Uganda" === country) {
                            json.templateVersion = "sharp-1.0-hhbat";
                        } else {
                            json.templateVersion = "sharp-1.0-standard";
                        }
                        //Moss.fn.log("saving group to " +json.templateVersion)
                        group.json = json;
                        //Moss.fn.log(group)                                                    
                        Moss.svc.updateGroupSchema(group);
                        hasSchema = true;
                        
                    }
                    
                    Moss.fn.loadSurveyDef(json.templateVersion, survey, Moss.fn.updateSurveyData);
                    
                    
                }
            }
        }
    };
    
    Moss.fn.updateSurveyData = function (survey) {
        Moss.fn.log(survey);
        var answers = survey.json.answers,
            livestock = survey.json.livestock === 'yes',
            crops = survey.json.crops === 'yes',
            country = answers.S0_INFO["S0_INFO.country"],
            countryOther = answers.S0_INFO["S0_INFO.country:other:text"],
            //S0_INFO.country:other:text:"Burundi"
            region = answers.S0_INFO["S0_INFO.region"],
            district = answers.S0_INFO["S0_INFO.district"],
            village = answers.S0_INFO["S0_INFO.village"],
            index2,
            a,
            b,
            cell,
            found = false,
            o,
            option,
            q,
            question,
            row,
            rows,
            v,
            value,
            w,
            widget,
            widgetSet;
        if ("other" === country && countryOther && countryOther !== "") {
            if ("BURUNDI" === countryOther.toUpperCase()) {
                answers.S0_INFO["S0_INFO.country"] = "Burundi";
                country = answers.S0_INFO["S0_INFO.country"];
                delete answers.S0_INFO["S0_INFO.country:other:text"];
            } else if ("KENYA" === countryOther.toUpperCase()) {
                answers.S0_INFO["S0_INFO.country"] = "Kenya";
                country = answers.S0_INFO["S0_INFO.country"];
                delete answers.S0_INFO["S0_INFO.country:other:text"];
            }
        }
        for (index2 in answers) {
            if (answers.hasOwnProperty(index2)) {
                if (Moss.model.survey) {//check if the survey definition is loaded
                    for (q in Moss.model.survey.questions) {
                        if (Moss.model.survey.questions.hasOwnProperty(q)) {
                            question = Moss.model.survey.questions[q];
                            if (question.id === index2) {
                                for (w in Moss.model.survey.questions[q].widgetSet) {
                                    if (Moss.model.survey.questions[q].widgetSet.hasOwnProperty(w)) {
                                        widget = Moss.model.survey.questions[q].widgetSet[w];
                                        //Moss.fn.log("trying to match " + value + " of question " + "answers[" + index2 + "].[" + widget.id + "]" + " type: " + widget.widget);
                                        //if ("S4_ENV_04" === index2) {
                                        //    console.log(index2);
                                        //}
                                        if (widget.widget === "select") {
                                            value = answers[index2][index2 + "." + widget.id];
                                            if (value && "id_of_respondent" !== widget.id) {
                                                Moss.fn.log("trying to match " + value + " of question " + "answers[" + index2 + "].[" + widget.id + "]");
                                                for (o in Moss.model.survey.questions[q].widgetSet[w].options) {
                                                    if (Moss.model.survey.questions[q].widgetSet[w].options.hasOwnProperty(o)) {
                                                        option = Moss.model.survey.questions[q].widgetSet[w].options[o];
                                                        Moss.fn.log(option);
                                                        if (option.value === value) {
                                                            found = true;
                                                            Moss.fn.log(option.value + " matches " + value);
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (!found) {
                                                    Moss.fn.log(value + " does not match predefined values, changing to other_value");
                                                }
                                            }
                                        } else if (widget.widget === "grid") {
                                            Moss.fn.log("trying to match " + value + " of question " + "answers[" + index2 + "].[" + widget.id + "]");
                                            rows = widget.rows;
                                            for (row in rows) {
                                                if (rows.hasOwnProperty(row)) {
                                                    if (rows[row].cells) {
                                                        for (cell in rows[row].cells) {
                                                            if (rows[row].cells.hasOwnProperty(cell) && rows[row].cells[cell] && rows[row].cells[cell].widget) {
                                                                if (rows[row].cells[cell].widget === "select") {
                                                                    value = answers[index2][index2 + "." + widget.id + "#" + rows[row].id + "#" + widget.cols[cell].id];
                                                                    Moss.fn.log("answers[" + index2 + " ][" + index2 + "." + widget.id + "#" + rows[row].id + "#" + widget.cols[cell].id + "] value: " + value);
                                                                    if (value) {
                                                                        found = false;
                                                                        for (o in rows[row].cells[cell].options) {
                                                                            if (rows[row].cells[cell].options.hasOwnProperty(o)) {
                                                                                option =  rows[row].cells[cell].options[o];
                                                                                Moss.fn.log(option);
                                                                                if (option.value === value) {
                                                                                    found = true;
                                                                                    Moss.fn.log(option.value + " matches " + value);
                                                                                    break;
                                                                                }
                                                                            }
                                                                        }
                                                                        if (!found) {
                                                                            for (o in rows[row].cells[cell].options) {
                                                                                if (rows[row].cells[cell].options.hasOwnProperty(o)) {
                                                                                    o = rows[row].cells[cell].options[o];
                                                                                    if (o.value === "other_specify") {
                                                                                        //delete answers[index2][index2 + "." + widget.id + "#" + rows[row].id + "#" + widget.cols[cell].id];
                                                                                        answers[index2][index2 + "." + widget.id + "#" + rows[row].id + "#" + widget.cols[cell].id] = "other_specify";
                                                                                        answers[index2][index2 + "." + widget.id + "#" + rows[row].id + "#" + widget.cols[cell].id + ":text"] = value;
                                                                                        //input#S4_ENV_04.land_access#usage#private_plots:text
                                                                                        Moss.fn.log(value + " does not match predefined values, changing to other_value");
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
//                    Moss.model.survey.questions[0].widgetSet[4].options[0]
                }
                if (answers[index2][index2 + "._scoring"]) {
                    a = index2 + "._scoring: " + answers[index2][index2 + "._scoring"].score_final;
                    //Moss.fn.log(index+ "._scoring: " +answers[index][index + "._scoring"]["score_final"])
                }
                Sharp._calculateScore(index2, answers, answers[index2], crops, livestock);
                if (answers[index2][index2 + "._scoring"]) {
                    b = index2 + "._scoring: " + answers[index2][index2 + "._scoring"].score_final;
                    //Moss.fn.log(index+ "._scoring: " +answers[index][index + "._scoring"]["score_final"])
                }
                //Moss.fn.log(a === b ? "score not changed:  "  + a + " " +  b : "score  changed:  "   + a + " " +  b);
            }
        }
        Moss.svc.updateSurvey(survey.id, survey.group, survey.json);
    };
    
    Moss.fn.updateDictionaries = function () {
        
        Moss.fn.bindSettings();
        
        Moss.fn.getJSON(Moss.fn.getEndpoint() + "dictionaries/1",
            function (data) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    Moss.ui.notify(Moss.fn.string("@_dictionary_update_completed"));
                }});
                Moss.shared.baseDictionary = data;
                Moss.svc.insertOrUpdateDictionary(1, data, true);
                //Moss.fn.log("Base Dictionary updated.");
            },
            function (xhr, textStatus, errorThrown) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    var message = Moss.fn.string("@_dictionary_update_error"),
                        response;
                    if (xhr.responseText) {
                        console.error(xhr.responseText);
                        try {
                            response = JSON.parse(xhr.responseText);
                            if (response.reason) {
                                message = message + ":<br/><br/>" + response.reason;
                            }
                        } catch (error) {
                        }
                    } else {
                        message = message + ". " + Moss.fn.string("@_please_retry");
                    }
                    Moss.ui.notifyError(message);
                }});
            });
        
        var s_a = Moss.fn.settings.surveyNameAndVersion.split(",");
        Moss.fn.getJSON(Moss.fn.getEndpoint() + "dictionaries/2",
            function (data) {
                Moss.shared.surveyDictionary = data;
                Moss.svc.insertOrUpdateDictionary(2, data, true);
                //Moss.fn.log("Sharp Dictionary updated.");            
            },
            function (xhr, textStatus, errorThrown) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    var message = Moss.fn.string("@_dictionary_update_error"),
                        response;
                    if (xhr.responseText) {
                        console.error(xhr.responseText);
                        try {
                            response = JSON.parse(xhr.responseText);
                            if (response.reason) {
                                message = message + ":<br/><br/>" + response.reason;
                            }
                        } catch (error) {
                        }
                    } else {
                        message = message + ". " + Moss.fn.string("@_please_retry");
                    }
                    Moss.ui.notifyError(message);
                }});
                
            });
        //refresh labels
        window.setTimeout(function () {
            Moss.fn.i18n($('body'));
        }, 100);
        
    };
    
    Moss.fn.loadDictionaries = function () {
        //Moss.fn.bindSettings();
        
        Moss.fn.getJSON("./js/moss-base-dictionary.json", function (data) {
            Moss.shared.baseDictionary = data;
            Moss.svc.insertOrUpdateDictionary(1, data, false);
            //Moss.fn.log("Base Dictionary loaded.");
        });
        
        var s_a = Moss.fn.settings.surveyNameAndVersion.split(",");
        Moss.fn.getJSON("./surveys/sharp-dictionary-1.0.json", function (data) {
            Moss.shared.surveyDictionary = data;
            Moss.svc.insertOrUpdateDictionary(2, data, false);
            //Moss.fn.log("Sharp Dictionary loaded.");            
        });
        
        window.setTimeout(function () {
            Moss.fn.i18n($('body'));
        }, 100);
    };
    
    Moss.fn.clearModel = function () {
        Moss.model.currentSurveyIdx = 0;
        Moss.model.surveys = {};
        Moss.model.comments = {};
        Moss.model.pictures = {};
        Moss.model.attendanceReport = {};
    };

    Moss.fn.string = function (s) {
        function getDictionary(key) {
            if (key.charAt(0) === '_') {
                return Moss.shared.baseDictionary;
            } else {
                return Moss.shared.surveyDictionary;
            }
        }
        
        if (s === null || s === undefined) {
            return null;
        }
        var res = s.split("|"), out = '', i, _part, _key, dictionary;
        for (i = 0; i < res.length; i++) {
            _part = res[i];
            if (_part.length === 1 || (_part.substring(0, 1) !== "@")) {
                out += _part;
                continue;
            }
            _key = _part.substring(1);
            //TODO check if works when dictionaries are not yet loaded
            dictionary =  getDictionary(_key);
            if (dictionary === null) {
                if (res.length > 1) {
                    out = res[1];
                    return out;
                }
            }
            _part = getDictionary(_key)[_key + "@" + Moss.settings.language];
            if (_part !== null) {
                out += _part;
                continue;
            }
            _part = getDictionary(_key)[_key + "@en"];
            if (_part !== null) {
                out += _part;
                continue;
            }
            out += _key;
        }
        if (out === "undefined") {
            out = s + ":  undefined!";
        }
        return out;

    };
    
    
    Moss.fn.toId = function (s) {
        return "#" + s.replace(/(:|#|\.|\[|\])/g, "\\$1");
    };

    Moss.fn.getJSON = function (url, callback) {
        //Moss.fn.log("URL loaded: " + url);
        return $.ajax({
            type : "GET",
            url : url,
            mimeType : "text/plain",
            contentType : "text/plain; charset=utf-8",
            dataType : "json",
            //crossDomain: true,
            success : callback,
            error : function (xhr, textStatus, errorThrown) {
                Moss.ui.hideLoader();
                Moss.ui.notifyError(Moss.fn.string("@KZN") + "\n " + errorThrown);
            },
            headers: {
                "user-id": Moss.settings.userId,
                "api-key": Moss.settings.apiKey,
                "sharp-version": Moss.version
            }
        });
    };

    
    Moss.fn.getJSONPost = function (url, success, error) {
        return $.ajax({
            beforeSend: function () {
                Moss.ui.showLoader(Moss.fn.string("@_uploading_data"));
            },
            type : "POST",
            url : url,
            mimeType : "application/json",
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            success : success,
            error : error,
            headers: {
                "user-id": Moss.settings.userId,
                "api-key": Moss.settings.apiKey,
                "sharp-version": Moss.version
            }
        });
    };
    
    Moss.fn.settings = function () {
        $.mobile.pageContainer.pagecontainer("change", "settings.html", {
            allowSamePageTransition : true,
            transition : "fade"
        });
    };
    
    Moss.fn.newSurvey = function () {
        /*if (Moss.shared.supergroups.length === 0) {
            Moss.ui.notifyError(Moss.fn.string("@_error_new_survey"));
            return false;
        }*/
        //Moss.fn.loadSupergroupsSelect("#supergroup-new", Moss.shared.supergroups[0].id);
   
        Moss.fn.loadSurveySchemaSelect("#select-survey-schema", null);
        Moss.fn.loadSupergroupsSelect("#supergroup-new", null);
        $("[name=rd-nq]").prop("checked", false).checkboxradio("refresh");
        $("#rdnq1").prop("checked", true).checkboxradio("refresh");
        $("#gname").val('');
        $("#sg_name").val('');
        $("#btnAddFfs").off().click(function () {
            //Moss.fn.log("adding ffs");
            if (!$("#sg_name").val().trim()) {
                return;
            }
            $('select#supergroup-new option').removeAttr("selected");
            Moss.fn.saveSG();
            Moss.fn.loadSupergroupsSelect("#supergroup-new", null);
            //$("#sg-edit").popup("close");
        });
        $("#survey-new").popup("open", {transition: "pop"});
    };
    
    
    Moss.fn.loadSurveyDef = function (templateVersion, params, callback) {
        var s_a = templateVersion.split(","),
            i;
        //Moss.fn.log("Loading survey definition for " + "./schemas/" + templateVersion + ".json");
        Moss.fn.getJSON(
            //MSS"./surveys/" + s_a[0] + "-" + s_a[1] + ".json",
            "./schemas/" + templateVersion + ".json",
            function (data) {
                Moss.model.survey = data;
                Moss.model.survey.total_required = 0;
                Moss.model.survey.revmap = {};
                for (i = 0; i < Moss.model.survey.questions.length; i++) {
                    Moss.model.survey.revmap[Moss.model.survey.questions[i].id] = i;
                    if (Moss.model.survey.questions[i].required) {
                        Moss.model.survey.total_required++;
                    }
                }
            }
        )/*.then(
            function () {
                Moss.fn.getJSON("./surveys/" + s_a[0] + "-dictionary-" + s_a[1] + ".json", function (data) {
                    Moss.model.surveyDictionary = data;
                   //alert("Dictionary full " + Moss.model.surveyDictionary)
                });
            }
        )*/
            .then(
                function () {
                    var i;
                    for (i = 0; i < Moss.plugins.length; i++) {
                        Moss.plugins[i].init();
                    }
                }
            ).done(function () {
                Moss.fn.log("surveydef loaded " + templateVersion + " params: " + params);
                Moss.fn.log(params);
                callback(params);
            });
    };

    Moss.fn.loadSurveySchema = function (templateVersion, callback) {
        var s_a = templateVersion.split(","),
            i;
        Moss.fn.getJSON(
            //MSS
            //"./surveys/" + s_a[0] + "-" + s_a[1] + "-schema.json",
            "./schemas/" + templateVersion + "-schema.json",
            function (data) {
                Moss.model.surveySchema = data;
                //Moss.fn.log("Schema loaded");
                //Moss.fn.log(Moss.model.surveySchema);
            }
        ).done(callback);
    };
    
    
    Moss.fn.bindSettings = function () {
        Moss.settings.userName = $("#user-name").val();
        Moss.settings.userId = $("#user-id").val();
        Moss.settings.apiKey = $("#api-key").val();
        Moss.settings.endpoint = $("#endpoint").val();
        Moss.settings.rememberCredentials = $("#rememberCredentials").prop("checked");
        Moss.svc.updateSettings();
    };
    
    Moss.fn.getQuestionById = function (id) {
        var idx = Moss.model.survey.revmap[id];
        return Moss.model.survey.questions[idx];
    };
    
    
    Moss.fn.startView = function () {
        Moss.fn.first();
        $.mobile.pageContainer.pagecontainer({
            change : function (event, ui) {
                var page = ui.toPage.attr('data-url');
                if ("edit-page" === page) {
                    Moss.fn.render();
                }
            }
        });
        $.mobile.pageContainer.pagecontainer("change", "survey-edit.html", {
            allowSamePageTransition : true,
            //transition : "fade"
            transition : "fade"
        });
    };
    
    Moss.fn.updateSurvey =  function () {
        Moss.model.templateVersion = $("#select-survey-schema-update").val();
        Moss.svc.updateGroup(Moss.model).done(Moss.fn.load(Moss.model.groupId));
    };
    
    Moss.fn.startSurvey = function () {
        var surveyNameAndVersion = $("#select-survey-schema").val(),
           //MSS surveyNameAndVersion = Moss.fn.settings.surveyNameAndVersion,
            superGroupId =  $("#supergroup-new").val(),
            groupName =  $("#gname").val(),
            groupSize =  parseInt($("[name=rd-nq]:checked").val(), 10);
        
        if (surveyNameAndVersion === "" || superGroupId === "" || groupName === "") {
            //$("#validation-dialog").popup("open");
            Moss.ui.notifyError(Moss.fn.string("@_mandatory_fields"));
            return;
        }
        
        Moss.fn.clearModel();
        Moss.model.templateVersion = surveyNameAndVersion;
        Moss.model.superGroupId = superGroupId;
        Moss.model.groupName = groupName;
        
        Moss.fn.loadSurveyDef(surveyNameAndVersion, null, function (params) {
            Moss.model.surveys = [];
            Moss.model.groupId = Moss.fn.generateId({prefix: "G", digits: 5});
            var i;
            for (i = 0; i < groupSize; i++) {
                Moss.model.surveys[i] = {id: Moss.fn.generateId({digits: 5, prefix: "Q"}), visible: true, schema: surveyNameAndVersion + "-schema", answers: {}};
                //TODO SOUTH SUDAN parametrize!!! 
                /*Moss.model.surveys[i].answers = {};                
                Moss.model.surveys[i].answers.S0_INFO = {};
                Moss.model.surveys[i].answers.S0_INFO['S0_INFO.country']='south_sudan';                                                
                */
            }
            Moss.svc.createGroup();
            Moss.fn.startView();
        });
    };
            
    Moss.fn.updateGroupInfo = function () {
        $('#supergroup-edit').val(Moss.model.superGroupId).selectmenu('refresh');
        $('#group-name').val(Moss.model.groupName);
    };
    
    Moss.fn.first = function () {
        // TODO find first question
        Moss.model.currentQuestionIdx = 0;
        // TODO find first person;
        Moss.model.currentSurveyIdx = 0;

    };
    
    Moss.fn.bindAndValidate = function (callback) {
        var result = Moss.fn.bindToModel();
        if (!result.success) {
            //Moss.fn.log("Validation error: " + result.expression);
            Moss.ui.validationDialog(result.message || Moss.fn.currentQuestion().validation.message || '@_required_message', callback);
        } else {
            //Moss.fn.log("bindAndValidateOk " + callback );
            callback();
        }
    };
        
    Moss.fn.next = function () {
        var go = function () {
            Moss.fn.slideTo(Moss.model.currentQuestionIdx + 1);
            //Moss.fn.log("current page: "+ Moss.model.currentQuestionIdx +  " going to page " + (Moss.model.currentQuestionIdx + 1))
        };
        Moss.fn.bindAndValidate(go);
    };

    Moss.fn.prev = function () {
        Moss.fn.bindToModel();
        Moss.fn.slideTo(Moss.model.currentQuestionIdx - 1);
    };

    Moss.fn.jumpToQuestion = function (question_idx, survey_idx) {
        if (survey_idx === undefined) {
            if (question_idx === Moss.model.currentQuestionIdx) {
                $("#right-panel").panel("close");
                return;
            }
            var go = function () {
                $("#right-panel").panel("close");
                Moss.fn.slideTo(question_idx);
            };
            Moss.fn.bindAndValidate(go);
        } else {
            Moss.ui.showLoader();
            $.mobile.activePage.fadeOut(300, function () {
                Moss.model.currentQuestionIdx = question_idx;
                Moss.model.currentSurveyIdx = survey_idx;
                Moss.fn.render();
                Moss.ui.hideLoader();
            });
        }
    };


    Moss.fn.addSurvey = function () {
        Moss.ui.showPopupMessage(
            {
                title: Moss.fn.string("@_add_new_participant"),
                message: Moss.fn.string("@_add_new_participant_confirm"),
                confirmLabel: Moss.fn.string("@_confirm"),
                cancelLabel: Moss.fn.string("@_cancel"),
                onConfirm: function () {
                    Moss.fn.bindToModel();
                    Moss.model.surveys[Moss.model.surveys.length] = {id: Moss.fn.generateId(), visible: true, answers: {}};
                    Moss.model.currentSurveyIdx = Moss.model.surveys.length - 1;
                    Moss.model.currentQuestionIdx = 0;
                    Moss.fn.render();
                }
            }
        );
    };

    Moss.fn.deleteAllSurveys = function () {
        Moss.ui.showPopupMessage(
            {
                title: Moss.fn.string("@_delete_all_surveys"),
                message: Moss.fn.string("@_delete_all_surveys_conf"),
                confirmLabel: Moss.fn.string("@_confirm"),
                cancelLabel: Moss.fn.string("@_cancel"),
                onConfirm: function () {
                    Moss.svc.dropAllSurveys().done(function () {
                        Moss.ui.notify(Moss.fn.string("@_delete_all_surveys_msg"));
                    });
                }
            }
        );
    };

    Moss.fn.removeCurrentSurvey = function () {
        var surveyId = Moss.model.surveys[Moss.model.currentSurveyIdx].id;
        Moss.model.surveys.splice(Moss.model.currentSurveyIdx, 1);
        Moss.svc.deleteSurvey(surveyId);
        Moss.fn.checkRemaining();
    };

    Moss.fn.moveToGroup = function () {
        Moss.fn.bindToModel();
        var newGroup,
            supergroupId = Moss.model.superGroupId,
            newGroupId = $("#other-grps").val(),
            finish = function () {
                Moss.svc.updateSurveyGroup(Moss.fn.currentSurvey().id, newGroupId);
                Moss.model.surveys.splice(Moss.model.currentSurveyIdx, 1);
                Moss.ui.notify(Moss.fn.string("@_member_moved"));
                Moss.fn.checkRemaining();
            };
        if (newGroupId === '') {
            newGroupId = Moss.fn.generateId({digits: 5, prefix: "G"});
            newGroup = {};
            newGroup.groupId = newGroupId;
            newGroup.superGroupId = Moss.model.superGroupId;
            newGroup.groupName = Moss.fn.string("@_new_group") + " " + Moss.fn.dateToString(new Date(), true) + " " + Moss.fn.string("@_group_name_change");
            newGroup.templateVersion = Moss.model.templateVersion;
            newGroup.surveys = [Moss.fn.currentSurvey()];
            Moss.svc.createGroup(newGroup).done(finish);
        } else {
            Moss.svc.addSurveyToGroupJson(newGroupId, Moss.fn.currentSurvey().id, finish);
        }
    };
    
    Moss.fn.checkRemaining = function () {
        if (Moss.model.surveys.length === 0) {
            Moss.svc.deleteGroup(Moss.model.groupId);
            Moss.fn.home();
        } else {
            Moss.model.currentSurveyIdx = 0;
            $("#right-panel").panel("close");
            Moss.fn.render();
        }
    };
    
    Moss.fn.deleteGroup = function () {
        var groupId = Moss.model.groupId;
        Moss.model.surveys.splice(Moss.model.currentSurveyIdx, 1);
        Moss.svc.deleteGroup(groupId);
        Moss.model = {};
        $("#left-panel").panel("close");
        Moss.fn.home();
    };
    
    Moss.fn.home = function () {
        $.mobile.pageContainer.pagecontainer("change", "index.html", {
            allowSamePageTransition : true,
            transition : "flip"
        });
    };
    
    Moss.fn.switchToSurvey = function (survey_idx) {
        //Moss.fn.log("switchToSurvey");
        Moss.fn.bindToModel();
        Moss.model.currentSurveyIdx = survey_idx;
        Moss.fn.render();
    };
    
    Moss.fn.setPersonName = function (name) {
        if (name) {
            name = name.trim();
        }
        var _survey = Moss.fn.currentSurvey(), i;
        _survey.personName = name;
            
        $("#S0_INFO\\.name_of_respondent").val($("#S0_INFO\\.id_of_respondent option:selected").text());
        $("#navbar").empty();
        Moss.ui.renderWidget('navbar', 'navbar', {survey: true});
        //Moss.fn.log('navbar');
        for (i = 0; i < Moss.plugins.length; i++) {
            if (typeof Moss.plugins[i].onChangePersonName === 'function') {
                Moss.plugins[i].onChangePersonName(name);
            }
        }
    };
    
    Moss.fn.setPersonPractice = function (lbl_key) {
        var _survey = Moss.fn.currentSurvey();
        _survey.personPracticeLabelKey = lbl_key;
    };

    Moss.fn.getPersonName =  function (idx) {
        var _survey = Moss.model.surveys[idx];
        return _survey.personName;
    };

    Moss.fn.cloneCurrentAnswers = function () {
        Moss.fn.bindToModel();
        var currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx],
            currentQuestion = Moss.fn.currentQuestion(),
            currentAnswers = currentSurvey.answers[currentQuestion.id],
            i,
            clone;
        for (i = 0; i < Moss.model.surveys.length; i++) {
            clone = $.extend(true, {}, currentAnswers);
            if (!$.isEmptyObject(clone)) {
                if (Moss.fn.isQuestionApplicable(currentQuestion, currentSurvey, currentAnswers)) {
                    Moss.model.surveys[i].answers[currentQuestion.id] = clone;
                }
            } else {
                delete Moss.model.surveys[i].answers[currentQuestion.id];
            }
        }
        $("#navbar").empty();
        Moss.ui.renderWidget('navbar', 'navbar', {survey: true});
        //Moss.fn.log('navbar');
        Moss.ui.notify(Moss.fn.string("@J3M"));
    };


    Moss.fn.changeGroupInfo = function () {
        Moss.model.superGroupId = $('#supergroup-edit').val();
        Moss.model.groupName = $('#group-name').val();
        $("#left-panel").panel("close");
        Moss.fn.bindToModel();
        Moss.fn.render();
    };
    
    Moss.fn.currentSuperGroupName = function () {
        var i;
        for (i = 0; i < Moss.shared.supergroups.length; i++) {
            if (Moss.shared.supergroups[i].id === Moss.model.superGroupId) {
                return Moss.shared.supergroups[i].name;
            }
        }
        return null;
    };

    Moss.fn.setSurveysVisibility = function () {
        if ($(".hideshow:checked").length === 0) {
            Moss.ui.notifyWarning(Moss.fn.string("@M29"));
            return;
        }
        $(".hideshow").each(function () {
            var _cb = $(this),
                _idx = this.attributes["data-idx"].value;
            Moss.model.surveys[_idx].visible = _cb.prop('checked');
        });
        Moss.fn.moveToFirstVisibleSurvey();
    };

    Moss.fn.moveToFirstVisibleSurvey = function () {
        var i;
        for (i = 0; i < Moss.model.surveys.length; i++) {
            if (Moss.model.surveys[i].visible) {
                Moss.model.currentSurveyIdx = i;
                break;
            }
        }
        $("#left-panel").panel("close");
        $("#right-panel").panel("close");
        Moss.fn.render();
    };

    Moss.fn.hideAllButThis = function () {
        var i;
        Moss.model.surveys[Moss.model.currentSurveyIdx].visible = true;
        for (i = 0; i < Moss.model.surveys.length; i++) {
            if (i !== Moss.model.currentSurveyIdx) {
                Moss.model.surveys[i].visible = !Moss.model.surveys[i].visible;
            }
        }
        $("#showHideSurveys").html("SHOW");
        Moss.fn.moveToFirstVisibleSurvey();
    };

    Moss.fn.isBlank = function (s) {
        return (!s || s.trim() === '');
    };
    
    Moss.fn.getEndpoint = function () {
        //eth commented, for the moment upload is not permitted at least to production database
        /*if (Moss.fn.isBlank(Moss.settings.endpoint)) {
            return "http://data.fao.org/apps/sharp/api/";
        } else {
            return Moss.settings.endpoint;
        }*/
        return Moss.settings.endpoint;
    };
    
    Moss.fn.sendAll = function () {
        Moss.svc.db.dump('json').done(function (result) {
            var json = JSON.stringify(result),
                zip = new JSZip(),
                zt,
                message,
                response;
            zt = zip.file("dump.zip", json).generate({compression : "DEFLATE"});
            $.ajax({
                beforeSend: function () {
                    Moss.ui.showLoader(Moss.fn.string("@_uploading_data"));
                },
                url: Moss.fn.getEndpoint() + "upload-db",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                crossDomain: true,
                data: JSON.stringify({
                    payload: zt
                }),
                headers: {
                    "user-id": Moss.settings.userId,
                    "api-key": Moss.settings.apiKey,
                    "sharp-version": Moss.version
                },
                success: function (result) {
                    Moss.ui.hideLoader({timeout: 500, callback: function () {
                        Moss.ui.notify(Moss.fn.string("@_upload_completed"));
                    }});
                    Moss.svc.updateDateSent().then(function () {
                        Moss.fn.listSurveys();
                    });
                    //Moss.fn.log(JSON.stringify(result));
                },
                error: function (xhr, status, error) {
                    Moss.ui.hideLoader({timeout: 500, callback: function () {
                        message = Moss.fn.string("@_error_upload");
                        if (xhr.responseText) {
                            try {
                                response = JSON.parse(xhr.responseText);
                                if (response.reason) {
                                    message = message + ":<br/><br/>" + response.reason;
                                }
                            } catch (error) {
                            }
                        } else {
                            message = message + ". " + Moss.fn.string("@_please_retry");
                        }
                        Moss.ui.notifyError(message);
                    }});
                    Moss.fn.log(xhr.responseText);
                }
            });
        });
    };
    
    Moss.fn.slideTo = function (question_idx) {
        if (question_idx >= Moss.model.survey.questions.length || question_idx < 0) {
            return;
        }
        var _direction =  (question_idx < Moss.model.currentQuestionIdx) ? "right" : "left";

        Moss.ui.showLoader();
        
        Moss.model.currentQuestionIdx = question_idx;
        Moss.fn.render();
        
        $("#main").hide("slide", {direction: _direction }, 200, function () {
            $("#main").fadeToggle(function () {
                Moss.ui.hideLoader();
            });
            $.mobile.silentScroll(0);
        });
        
    };

    Moss.fn.render = function () {
        var start = new Date().getTime(),
            lapse = new Date().getTime(),
            qdef = Moss.fn.currentQuestion(),
            i,
            w_def,
            hide = false,
            hideMsg;
        
        if (Moss.model.surveys.length === 0) {
            Moss.fn.home();
        }

        $("#navbar").empty();
        $("#title").empty();
        $("#wset").empty();
        Moss.fn.log('Time: Moss.fn.render: empty: ' + (new Date().getTime() - lapse));

        Moss.model.cqid = qdef.id;
     
        qdef.pageInfo = (Moss.model.currentQuestionIdx + 1) + "/" + Moss.model.survey.questions.length;
        lapse = new Date().getTime();
        Moss.ui.renderWidget('navbar', 'navbar', {survey: true});
        Moss.ui.renderWidget('title', 'title', qdef);
        Moss.fn.log('Time: Moss.fn.render: navbar&Title: ' + (new Date().getTime() - lapse));
        
        hide = !Moss.fn.isQuestionApplicable(qdef);
        
        lapse = new Date().getTime();
        if (hide && qdef.hideMessage) {
            // alert("TO be hidden " + qdef.hideMessage)
            hideMsg = eval(qdef.hideMessage);
        }
        if (hide) {
            Moss.ui.renderWidget('wset', 'info', {message: hideMsg});
            delete Moss.fn.currentSurvey().answers[Moss.fn.currentQuestion().id];
        } else {
            for (i = 0; i < qdef.widgetSet.length; i++) {
                w_def = qdef.widgetSet[i];
                Moss.ui.renderWidget('wset', w_def.widget, w_def);
                if (w_def.afterRender) {
                    eval(w_def.afterRender);
                }
            }
        }
        Moss.fn.log('Time: Moss.fn.render: widgetset: ' + (new Date().getTime() - lapse));
        
        lapse = new Date().getTime();
        Moss.ui.renderWidget('wset', 'navbuttons');
        Moss.fn.i18n($('#navbuttons'));
        Moss.fn.log('Time: Moss.fn.render: navbuttons: ' + (new Date().getTime() - lapse));
        
        lapse = new Date().getTime();
        Moss.fn.bindToView();
        Moss.fn.log('Time: Moss.fn.render: bindtoview: ' + (new Date().getTime() - lapse));
        
        lapse = new Date().getTime();
        $("#btn-scoring").prop("disabled", Moss.fn.currentQuestion().scoring !== true);
        $("#btn-help").prop("disabled", Moss.fn.currentQuestion().help === undefined);
        $("#btn-clone").prop("disabled", Moss.fn.currentQuestion().cloneable !== true || Moss.model.surveys.length < 2);
        Moss.fn.log('Time: Moss.fn.render: buttons: ' + (new Date().getTime() - lapse));
        
        lapse = new Date().getTime();
        $.mobile.silentScroll(0);
        $.mobile.activePage.enhanceWithin();
        Moss.fn.log('Time: Moss.fn.render: mobile: ' + (new Date().getTime() - lapse));
        lapse = new Date().getTime();
        Moss.fn.fireChange();
        Moss.fn.log('Time: Moss.fn.render: firechange: ' + (new Date().getTime() - lapse));
   
        lapse = new Date().getTime();
        $("#main").trigger("updatelayout");
        Moss.fn.log('Time: Moss.fn.render: updatelayout: ' + (new Date().getTime() - lapse));
        Moss.ui.hideLoader();
      
        Moss.fn.log('Time: Moss.fn.render: ' + (new Date().getTime() - start));

    };
    
    Moss.fn.isQuestionApplicable = function (qdef, survey, answers) {
        if (!qdef.hideIf) {
            return true;
        }
        var currentSurvey = survey || Moss.fn.currentSurvey(),
            currentAnswers = answers || Moss.fn.currentAnswers();
        return !Moss.fn.evalExpression(qdef.hideIf, currentSurvey, currentAnswers);
    };

    Moss.fn.currentQuestion = function () {
        return Moss.model.survey.questions[Moss.model.currentQuestionIdx];
    };

    Moss.fn.currentAnswers = function () {
        if (Moss.model.surveys && Moss.model.surveys[Moss.model.currentSurveyIdx] && Moss.model.surveys[Moss.model.currentSurveyIdx].answers && Moss.model.surveys[Moss.model.currentSurveyIdx].answers[Moss.model.cqid]) {
            return Moss.model.surveys[Moss.model.currentSurveyIdx].answers[Moss.model.cqid];
        } else {
            return {};
        }
    };
        
    Moss.fn.getCurrentSurveyComments = function () {
        return Moss.model.comments.current || '';
    };
    
    Moss.fn.setCurrentQuestionComments = function () {
        var _txt = $('#question-comments').val() || '';
        _txt = _txt.trim();
        if (_txt === '') {
            delete Moss.model.comments.current;
        } else {
            Moss.model.comments.current = _txt;
        }
        //Moss.fn.log(JSON.stringify(Moss.model));
    };
    
    Moss.fn.getCurrentQuestionComments = function () {
        return Moss.model.comments[Moss.fn.currentQuestion().id] || '';
    };
    
    Moss.fn.setCurrentQuestionComments = function () {
        var _txt = $('#question-comments').val() || '';
        _txt = _txt.trim();
        if (_txt === '') {
            delete Moss.model.comments[Moss.fn.currentQuestion().id];
        } else {
            Moss.model.comments[Moss.fn.currentQuestion().id] = _txt;
        }
        //Moss.fn.log(JSON.stringify(Moss.model));
    };
    
    
    /*PICTURES MANAGEMENT*/
    
    Moss.fn.openPicturesPopup = function (qid) {
        
        $(document).off('click', '#pictures-dialog #btn-pictures-add').on('click', '#pictures-dialog #btn-pictures-add', function (e) {
            Moss.fn.log("adding pictures to " + qid + "...");
            Moss.fn.setCurrentPictures(qid);
            Moss.fn.log("adding pictures to " + qid + "... done!");
        });
        
        $(document).off('click', '#pictures-dialog #btn-pictures-cancel').on('click', '#pictures-dialog #btn-pictures-cancel', function (e) {
            Moss.fn.log("canceled adding pictures to " + qid + "...");
            //("#pictures-dialog").popup("close");
            Moss.fn.log("canceled adding pictures to " + qid + "...");
        });
        
        /*
        $("#pictures-dialog #btn-pictures-add").unbind("click");
        $("#pictures-dialog #btn-pictures-add").on("click", function () {
            Moss.fn.setCurrentPictures();
        });
        
        $("#pictures-dialog #btn-pictures-cancel").unbind("click");
        $("#pictures-dialog #btn-pictures-cancel").on("click",function () {
            $("#pictures-dialog").popup("open")
        });
        */
        
        $("#pictures-dialog").popup("open");
        
        Moss.fn.getCurrentPictures(qid);
    };
    
    Moss.fn.getCurrentPictures = function (qid) {
        var container = $("#question-pictures"),
            picture;
        $(container).empty();
        if (Moss.model.pictures && Moss.model.pictures[qid]) {
            for (picture in Moss.model.pictures[qid]) {
                if (Moss.model.pictures[qid].hasOwnProperty(picture)) {
                    Moss.fn.displayPicture(Moss.model.pictures[qid][picture].imageURI, Moss.model.pictures[qid][picture].descr);
                }
            }
        }
    };
    
    Moss.fn.setCurrentPictures = function (qid) {
        var start = new Date().getTime(),
            container = $('#question-pictures'),
            pictures = $(container).find('.my-picture');
        
        if (Moss.model.pictures === null || Moss.model.pictures === undefined) {
            Moss.fn.log("Moss.model.pictures null, initializing");
            Moss.model.pictures = {};
        }
        if (!Moss.model.fileChecksum) {
            if (typeof FileChecksum === 'undefined') {
                Moss.model.fileChecksum = null;
            } else {
                Moss.model.fileChecksum = new FileChecksum();
            }
        }
        
        
        if (pictures.length > 0) {
            Moss.model.pictures[qid] = [];
        } else {
            delete Moss.model.pictures[qid];
        }
        
        $(pictures).each(function () {
            //alert("each picture " + imageURI)
            var picture = {},
                imageURI = $($(this).find('img')[0]).attr("src"),
                filePath = null,
                fileURL = null,
                fileName = null;
            Moss.fn.log("resolving file uri...");
            if (window && window.resolveLocalFileSystemURI) {
                
                window.resolveLocalFileSystemURI(imageURI,
                    function (fileEntry) {
                        Moss.fn.log("resolving file uri...done!");

                        filePath = fileEntry.fullPath;
                        fileURL =  fileEntry.toURL().replace("file://", "");
                        fileName = fileEntry.name;
                        picture.fileURL = fileURL;
                        //alert("IMAGE URI: " + imageURI + "FULLPATH: " + filePath+ "\nFILEURL: " + fileURL+ "\nfileName: " + fileName);                  
                        Moss.fn.log("getting file checksum...");
                        Moss.model.fileChecksum.getChecksum(fileURL,
                            function (resp) {
                                Moss.fn.log("getting file checksum...done!");
                                picture.sha1 = resp;
                            },
                            function (err) {
                                Moss.fn.log("getting file checksum...failed!");
                                Moss.ui.notifyError("FileChecksum fullURL KO: " + err + "\n" + JSON.stringify(err));
                            });
                        picture.descr = $($(this).find('textarea')[0]).val();
                        picture.imageURI  = imageURI;
                        //alert("Picture: " + JSON.stringify(picture))                    
                        Moss.model.pictures[qid].push(picture);
                        Moss.fn.log("pushing picture to model" + JSON.stringify(Moss.model.pictures[qid]));
                       // $("#pictures-dialog").popup("close");   
                        Moss.fn.log("Time: Moss.fn.setCurrentPictures: " + (new Date().getTime() - start));
                    },
                    function (fail) {
                        Moss.fn.log("resolving file uri...failed!");
                        Moss.fn.log("error saving picture");
                        Moss.ui.notifyError("Error finding file " + fail);
                        //$("#pictures-dialog").popup("close");
                    });
            } else {
                Moss.fn.log("resolving file uri...done!");
                picture.fileURL = "./images/test.jpg";
                //alert("IMAGE URI: " + imageURI + "FULLPATH: " + filePath+ "\nFILEURL: " + fileURL+ "\nfileName: " + fileName);                  
                Moss.fn.log("getting file checksum...");
                picture.sha1 = "572889721E6A7216C73A10A08EC2506D";
                Moss.fn.log("getting file checksum...done!");
                picture.descr = $($(this).find('textarea')[0]).val();
                picture.imageURI  = imageURI;
                //alert("Picture: " + JSON.stringify(picture))                    
                Moss.model.pictures[qid].push(picture);
                Moss.fn.log("pushing picture to model" + JSON.stringify(Moss.model.pictures[qid]));
                //$("#pictures-dialog").popup("close");
            }
            
            /*
            picture.descr = $($(this).find('textarea')[0]).val();
            picture.imageURI  = imageURI;
            //alert("Picture: " + JSON.stringify(picture))
            Moss.model.pictures[qid].push(picture);
            */
        });
        
    };
    
    //SURVEY PICTURES
    Moss.fn.getCurrentSurveyPictures = function () {
        Moss.fn.getCurrentPictures('current');
    };
    
    Moss.fn.setCurrentSurveyPictures = function () {
        Moss.fn.setCurrentPictures('current');
    };
    //QUESTION PICTURES
    Moss.fn.getCurrentQuestionPictures = function () {
        Moss.fn.getCurrentPictures(Moss.fn.currentQuestion().id);
    };
    
    Moss.fn.setCurrentQuestionPictures = function () {
        Moss.fn.setCurrentPictures(Moss.fn.currentQuestion().id);
    };
    
    Moss.fn.getPicture = function (source) {
        if (navigator && navigator.camera) {
            navigator.camera.getPicture(
                function (imageURI) {
                    //Moss.fn.displayPicture(imageURI, descr);
                    Moss.fn.displayPicture(imageURI, "");
                },
                function (message) {
                    //Moss.fn.log(error)
                    Moss.ui.notifyError('Failed because: ' + message);
                },
                {
                    quality : 100,
                    destinationType : navigator.camera.DestinationType.FILE_URI,
                    sourceType : source,
                    allowEdit : false,
                    encodingType: Camera.EncodingType.JPEG,
                    saveToPhotoAlbum: true
                }
            );
        } else {
            //TESTONLY                                                                              
            var imageURI = "./images/test.jpg",
                imageName = imageURI.substring(imageURI.lastIndexOf("/")),//"test.jpg",
                descr = 'picture description';
            Moss.fn.displayPicture(imageURI, descr);
        }
    };

    Moss.fn.displayPicture = function (imageURI, descr) {
        //alert("Moss.fn.displayPicture  " );
        var container = $("#question-pictures"),
            a = $("<a href='#' data-role='button' data-icon='delete' class='ui-link ui-btn ui-icon-delete ui-btn-icon-left ui-shadow ui-corner-all' role='button'>" + Moss.fn.string("@_delete") + "</a>"),
            div1 = $("<div class='ui-block-a' style='width: 30%; height: 175px; padding: 5px; overflow: hidden;'>"),
            div2 = $("<div class='ui-block-b' style='width: 70%; height: 175px; padding: 5px;'>"),
            div3 = $("<div class='ui-block-solo my-picture' style='border: 1px solid black;'>"),
            img2 = $('<img>'),
            txt = $("<textarea style='height: 90% !important; width: 98% !important'></textarea>");
        
        $(a).on("click", function () {$(this).parent().remove(); });
        
        $(txt).html(descr || '');
        img2.css('width', '100%');
        img2.attr('src', imageURI);
     
        div1.append(img2);
        div2.append(txt);
        div3.append(div1);
        div3.append(div2);
        div3.append(a);
        container.append(div3);
        //alert("Moss.fn.displayPicture  end" );
    };
    
    Moss.fn.uploadPictures = function () {
        //TODO dialog on upload with data connection and not wifi. check before if there is connection
        
        //to manage async calls, added a counter. when counter ==0 , last response has arrived and next operations can be done opn the whole list
        var reqsCounter = 0,
            index = 0,
            sha1List = [],
            groupId,
            table = $('#survey-list-table').dataTable().api().row(0);
        Moss.tmp = {};
        Moss.tmp.pictures = [];
        
        while (table.rows().row(index).length > 0 &&  table.rows().row(index).data() !== undefined) {
            reqsCounter++;
            groupId = table.rows().row(index).data().id;
            Moss.svc.loadGroupForPictures(groupId, reqsCounter, Moss.fn._uploadPictures);
            index++;
        }
    };
    
    Moss.fn._uploadPictures = function (group, reqsCounter) {
        reqsCounter--;
        Moss.model = group;
        var questionId,
            picture,
            sha1List;
        for (questionId in group.pictures) {
            if (group.pictures.hasOwnProperty(questionId)) {
                for (picture in group.pictures[questionId]) {
                    if (group.pictures[questionId].hasOwnProperty(picture)) {
                        Moss.tmp.pictures.push(group.pictures[questionId][picture]);
                        sha1List.push(group.pictures[questionId][picture].sha1);
                    }
                }
            }
        }
        if (reqsCounter === 0) {
            Moss.fn.checkPictures(sha1List);
        }
    };
    
    
    Moss.fn.checkPictures = function (sha1List) {
        $.ajax({
            beforeSend: function () {
                Moss.ui.showLoader(Moss.fn.string("@_uploading_data"));
            },
            type : "POST",
            url : Moss.fn.getEndpoint() + "file",
            mimeType : "application/json",
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            data: JSON.stringify(sha1List),
            headers: {
                "user-id": Moss.settings.userId,
                "api-key": Moss.settings.apiKey,
                "sharp-version": Moss.version
            },
            success : function (data) {
                if (data && data.length > 0) {
                    var count = data.length,
                        sha1,
                        picture;
                    
                    for (sha1 in data) {
                        if (data.hasOwnProperty(sha1)) {
                            for (picture in Moss.tmp.pictures) {
                                if (Moss.tmp.pictures.hasOwnProperty(picture)) {
                                    if (Moss.tmp.pictures[picture].sha1 === data[sha1]) {
                                        Moss.fn.uploadPicture(Moss.tmp.pictures[picture], count);
                                        count--;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Moss.ui.hideLoader({timeout: 500, callback: function () {
                        Moss.ui.notify(Moss.fn.string("@_no_new_pictures"));
                    }});
                }
            },
            error: function (xhr, status, error) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    var message = Moss.fn.string("@_error_upload"),
                        response;
                    if (xhr.responseText) {
                        try {
                            response = JSON.parse(xhr.responseText);
                            if (response.reason) {
                                message = message + ":<br/><br/>" + response.reason;
                            }
                        } catch (error) {
                        }
                    } else {
                        message = message + ". " + Moss.fn.string("@_please_retry");
                    }
                    Moss.ui.notifyError(message);
                }});
                //Moss.fn.log(xhr.responseText);
            }
        });
    };
    
    Moss.fn.uploadPicture = function (picture, count) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            params;
        
        options.fileKey = "file";
        options.fileName = picture.fileURL.substr(picture.fileURL.lastIndexOf('/') + 1);
        //TODO check how to get mimetype
        options.mimeType = "image/jpeg";
        //options.chunkedMode = true; //this is important to send both data and files
        params = {};
        params.sha1 = picture.sha1;
        options.params = params;
        options.headers = {
            "user-id": Moss.settings.userId,
            "api-key": Moss.settings.apiKey,
            "sharp-version": Moss.version
        };
        
        //ft.upload(fileURL, uri, win, fail, options);
        ft.upload(picture.imageURI, encodeURI(Moss.fn.getEndpoint() + "file"),
            function (r) {
                        //alert(JSON.stringify(r));
                        //alert('uploadPictureSuccess')
                        //alert.log("Code = " + r.responseCode);
                        //alert.log("Response = " + r.response);
                        //alert.log("Sent = " + r.bytesSent);
                        // alert("count: " + count)
                if (count === 1) {
                    Moss.ui.hideLoader({
                        timeout: 500,
                        callback: function () {
                            Moss.ui.notify(Moss.fn.string("@_upload_completed"));
                        }
                    });
                }
            },
            function uploadPictureError(xhr) {
                var message = Moss.fn.string("@_error_upload");
                if (count === 1) {
                    Moss.ui.hideLoader({timeout: 500, callback: function () {
                        if (xhr.responseText) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.reason) {
                                    message = message + ":<br/><br/>" + response.reason;
                                }
                            } catch (error) {
                            }
                        } else {
                            message = message + ". " + Moss.fn.string("@_please_retry");
                        }
                        Moss.ui.notifyError(message);
                    }});
                } else {
                    Moss.ui.notifyError(message);
                }
            },
            options
            );
    };
    
    Moss.fn.getModelCopy = function () {
        var copy = {};
        copy.comments = Moss.model.comments;
        copy.pictures = Moss.model.pictures;
        copy.groupId = Moss.model.groupId;
        copy.groupName = Moss.model.groupName;
        copy.surveys = Moss.model.surveys;
        copy.templateVersion = Moss.model.templateVersion;
        return JSON.stringify(copy);
    };

    Moss.fn.getAnswers = function (question_idx, survey_idx) {
        try {
            if (survey_idx === undefined) {
                survey_idx = Moss.model.currentSurveyIdx;
            }
            var currentSurvey = Moss.model.surveys[survey_idx],
                currentAnswers,
                currentQuestion,
                qid;
            
            if (question_idx === undefined) {
                currentQuestion = Moss.fn.currentQuestion();
                currentAnswers = currentSurvey.answers[currentQuestion.id];
            } else {
                qid = Moss.model.survey.questions[question_idx].id;
                currentAnswers = currentSurvey.answers[qid];
            }
            return currentAnswers;
        } finally {}
        return null;
    };

    Moss.fn.questionStatus = function (question_idx, survey_idx) {
        var _answers = Moss.fn.getAnswers(question_idx, survey_idx),
            qdef = Moss.model.survey.questions[question_idx],
            survey = Moss.model.surveys[survey_idx],
            field,
            hasAValue = false,
            endsWith = function (str, suffix) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            };

        if (!Moss.fn.isQuestionApplicable(qdef, survey, _answers)) {
            return 3;
        }
        
        if (!_answers) {
            return 0;
        }
        
        for (field in _answers) {
            if (_answers.hasOwnProperty(field)) {
                if (field === "valid" || endsWith(field, "._scoring") || endsWith(field, "._academic_scoring")) {
                    continue;
                } else {
                    hasAValue = true;
                    break;
                }
            }
        }
        if (!hasAValue) {
            return 0;
        }
        return _answers.valid ? 2 : 1;
    };

    Moss.fn.currentSurvey = function () {
        return Moss.model.surveys[Moss.model.currentSurveyIdx];
    };

    Moss.fn.generateId = function (opts) {
        opts = opts || {};
        if (opts.digits === undefined) {
            opts.digits = 8;
        }
        if (opts.prefix === undefined) {
            opts.prefix = "";
        }
        var text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            i;
        for (i = 0; i < opts.digits; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return opts.prefix + text;
    };

    Moss.fn.bindToModel = function () {
        var start = new Date().getTime(),
            widgets = $("[data-moss='widget']"),
            currentSurvey,
            currentQuestion,
            name,
            checked,
            value,
            bbtm,
            retval,
            i;
        if (!widgets || widgets.length === 0) {
            return {success: true};
        }
        currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx];
        currentQuestion = Moss.fn.currentQuestion();
        currentSurvey.answers[currentQuestion.id] = {};
        widgets.each(function (i) {
            var _w = $(this);
            if (_w.attr("type") === "radio" && _w.attr("data-mossType") !== "radio-single") {
                name = _w.attr("name");
                checked = $("input[name='" + name + "']:checked").first();
                if (checked && checked.length > 0) {
                    currentSurvey.answers[currentQuestion.id][_w.attr("name")] = checked.val();
                }
            } else if (_w.attr("type") === "checkbox" || _w.attr("data-mossType") === "radio-single") {
                if (this.checked) {
                    currentSurvey.answers[currentQuestion.id][_w.attr("id")] = true;
                }
            } else {
                value = _w.val();
                if (typeof value === 'string') {
                    value = value.trim();
                }
                if (value) {
                    currentSurvey.answers[currentQuestion.id][_w.attr("id")] = value;
                }
            }
        });
        if ($.isEmptyObject(currentSurvey.answers[currentQuestion.id])) {
            delete currentSurvey.answers[currentQuestion.id];
        }
        if (currentQuestion.afterBindToModel) {
            if (typeof currentQuestion.afterBindToModel === 'string') {
                Moss.fn.evalExpression(currentQuestion.afterBindToModel, currentSurvey, Moss.fn.currentAnswers());
            } else {
                for (i = 0; i < currentQuestion.afterBindToModel.length; i++) {
                    Moss.fn.evalExpression(currentQuestion.afterBindToModel[i], currentSurvey, Moss.fn.currentAnswers());
                }
            }
        }

        if (Moss.fn.isQuestionApplicable(currentQuestion, currentSurvey, currentSurvey.answers[currentQuestion.id])) {
            retval = Moss.fn.validate(currentQuestion, currentSurvey, currentSurvey.answers[currentQuestion.id]);
        } else {
            retval = {success: true};
            if (currentSurvey.answers[currentQuestion.id]) {
                currentSurvey.answers[currentQuestion.id].applicable = false;
            }
        }
        
        if (currentSurvey.answers[currentQuestion.id]) {
            currentSurvey.answers[currentQuestion.id].valid = retval.success;
        }

        //Moss.fn.log(currentQuestion.id + ": " + JSON.stringify(currentSurvey.answers[currentQuestion.id]) || 'empty form');

        Moss.svc.saveGroupAndSurveys();
        Moss.fn.log("Time: Moss.fn.bindToModel: " + (new Date().getTime() - start));
        return retval;
    };

    
    Moss.fn.validate = function (currentQuestion, currentSurvey, currentAnswers) {
        if (!currentQuestion.validation) {
            return {success: true};
        }
        var start = new Date().getTime(),
            assertions = currentQuestion.validation.assertions || [],
            assertion,
            i,
            j,
            result,
            areq,
            matches,
            expr;
        
        for (i = 0; i < assertions.length; i++) {
            assertion = assertions[i];
            if (assertion.each) {
                matches = Moss.fn.matches(new RegExp(assertion.each), assertion.eachValue, currentAnswers);
                for (j = 0; j < matches.length; j++) {
                    expr = assertion.test;
                    expr = expr.replace(/\%match_value%/g, matches[j].match_value)
                        .replace(/\%match_key%/g, matches[j].match_key)
                        .replace(/\%match_text%/g, matches[j].match_text);
                    result = Moss.fn.evalExpression(expr, currentSurvey, currentAnswers);
                    if (!result) {
                        Moss.fn.log("Validation failed " + expr);
                        return {success: false, message: assertion.message, expression: expr};
                    }
                }
            } else {
                if (assertion.skipIf) {
                    result = Moss.fn.evalExpression(assertion.skipIf, currentSurvey, currentAnswers);
                    if (result) {
                        continue;
                    }
                }
                result = Moss.fn.evalExpression(assertion.test, currentSurvey, currentAnswers);
                if (!result) {
                    Moss.fn.log("Validation failed " + assertion.test);
                    return {success: false, message: assertion.message, expression: assertion.test};
                }
            }
        }
        Moss.fn.log("Time: Moss.fn.validate: " + (new Date().getTime() - start));
        return {success: true};
    };
    
    Moss.fn.count = function (key_regex, value, answers) {
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        var count = 0, key;
        for (key in answers) {
            if (answers.hasOwnProperty(key)) {
                if (key.match(key_regex)) {
                    if (value === undefined || answers[key] === value) {
                        count++;
                    }
                }
            }
        }
        return count;
    };

    Moss.fn.countConditionalValue = function (key_regex, value_regex, answers) {
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        var count = 0, key;
        for (key in answers) {
            if (answers.hasOwnProperty(key)) {
                if (key.match(key_regex)) {
                    if (answers[key].match(value_regex)) {
                        try {
                            count++;
                        } catch (err) {
                            Moss.fn.log(err);
                        }
                    }
                }
            }
        }
        return count;
    };
    
    Moss.fn.sum = function (key_regex, answers) {
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        var sum = 0, key;
        for (key in answers) {
            if (answers.hasOwnProperty(key)) {
                if (key.match(key_regex)) {
                    try {
                        sum += parseFloat(answers[key]);
                    } catch (err) {
                    }
                }
            }
        }
        return sum;
    };

    

    
    Moss.fn.countTokenizedText = function (key_regex, answers) {
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        var count = 0, key, txt, i;
        for (key in answers) {
            if (answers.hasOwnProperty(key)) {
                if (key.match(key_regex)) {
                    txt = answers[key];
                    try {
                        txt = txt.replace(/\n/g, ",");
                        txt = txt.replace(/\;/g, ",");
                        txt = txt.split(",");
                        for (i = 0; i < txt.length; i++) {
                            if (txt[i].trim()) {
                                count++;
                            }
                        }
                    } catch (err) {
                    }
                }
            }
        }
        return count;
    };
    
    
    
    Moss.fn.exists = function (key_regex, value, answers) {
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        var _skey = key_regex.toString(),
            qid = _skey.substr(0, _skey.indexOf(".")),
            key;
        if (value === undefined && (answers.hasOwnProperty(_skey))) {
            return true;
        } else if (value && answers[_skey] === value) {
            return true;
        }
        try {
            for (key in answers) {
                if (answers.hasOwnProperty(key)) {
                    if (key.match(key_regex)) {
                        if (value === undefined || answers[key] === value) {
                            return true;
                        }
                    }
                }
            }
        } catch (err) {}
        return false;
    };
    
    Moss.fn.matches = function (key_regex, value, answers) {
        var key, mtxt, ret = [];
        if (!answers) {
            answers = Moss.fn.currentAnswers();
        }
        try {
            key_regex = new RegExp(key_regex);
            for (key in answers) {
                if (answers.hasOwnProperty(key)) {
                    mtxt = key.match(key_regex);
                    if (mtxt) {
                        if (value === undefined || answers[key] === value) {
                            ret[ret.length] = {match_key: key, match_value: answers[key], match_text: mtxt[1]};
                        }
                    }
                }
            }
        } catch (err) {}
        return ret;
    };
    
    Moss.fn.evalExpression = function (expr, currentSurvey, currentAnswers) {
        var ret, app = expr;
        // $$.* = currentSurvey.*                                                      // expr = "$?(/^S4_EC_04\.mrkt_acc_selling#directly#.*:$/)"
        expr = expr.replace(/\$\$\./g, "currentSurvey.");                              // expr =
        // $['*'] = currentAnswers[Moss.model.cqid]                 
        expr = expr.replace(/\$\[\'/g, "currentAnswers['" + Moss.model.cqid + ".");    // expr =
        // $# Moss.fn.toNumber(*
        expr = expr.replace(/\$\#\(/g, "Moss.fn.toNumber(");                           // expr =
        // $? = Moss.fn.exists
        expr = expr.replace(/\$\?\(/g, "Moss.fn.exists(");                             // expr =
        
        try {
            ret = eval(expr);
            if (!ret) {
                Moss.fn.log("Validation failed for " + app + " evaluated to " + expr);
            }
            return ret;
        } catch (e) {
            return undefined;
        }
    };

    Moss.fn.toNumber = function (s) {
        if (!s) {
            return 0;
        }
        var n = Number(s);
        if (isNaN(n)) {
            return 0;
        }
        return n;
    };
    
    
    Moss.fn.concat = function (separator, values) {
        var i, ret = "";
        for (i = 0; i < values.length; i++) {
            if (!values[i]) {
                values.splice(i, 1);
                i--;
            }
        }
        if (values.length === 0) {
            return null;
        }
        if (values.length === 1) {
            return values[0];
        }
        for (i = 0; i < values.length; i++) {
            ret = ret + ";" + values[i];
        }
        return ret.substr(1);
    };
    
    Moss.fn.toYesNo = function (expr) {
        if (expr === true) {
            return "yes";
        }
        return "no";
    };
    
    Moss.fn.getAnswer = function (qid, wid) {
        var _cs = Moss.fn.currentSurvey().answers;
        if (!_cs || !_cs[qid]) {
            return undefined;
        }
        return _cs[qid][wid];
    };
    
    Moss.fn.questionIndex = function (qid) {
        var i = 0;
        for (i = 0; i < Moss.model.survey.questions.length; i++) {
            if (Moss.model.survey.questions[i].id === qid) {
                return i + 1;
            }
        }
        return 0;
    };
    
    Moss.fn.bindToView = function () {
        var currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx],
            currentQuestion = Moss.fn.currentQuestion(),
            answers = currentSurvey.answers[currentQuestion.id],
            widgets,
            name,
            value,
            _re,
            id,
            i,
            wdef;

        for (i = 0; i < currentQuestion.widgetSet.length; i++) {
            wdef = currentQuestion.widgetSet[i];
            if (wdef.defaultValue && (!answers || !answers[Moss.model.cqid + '.' + wdef.id])) {
                if (!answers) {
                    currentSurvey.answers[currentQuestion.id] = {};
                    answers = currentSurvey.answers[currentQuestion.id];
                }
                try {
                    answers[Moss.model.cqid + '.' + wdef.id] = eval(wdef.defaultValue);
                    //Moss.fn.log("after default: " + JSON.stringify(answers));
                } catch (error) {
                    
                }
            }
        }
        
        if (!answers) {
            return;
        }
        widgets = $("[data-moss='widget']");
        _re = /:text$/;
        widgets.each(function (i) {
            var _w = $(this),
                _def,
                tagName;
            
            id = _w.attr("id");
            if (_w.attr("type") === "radio" && _w.attr("data-mossType") !== "radio-single") {
                name = _w.attr("name");
                value = answers[name];
                if (value) {
                    $("input[name='" + name + "'][value='" + value + "']").prop("checked", true);
                    $(Moss.fn.toId(name + ":" + value + ":text")).show();
                }
            } else if (_w.attr("data-mossType") === "radio-single") {
                value = answers[id];
                _w.prop("checked", (value === true));
            } else if (_w.attr("type") === "checkbox") {
                value = answers[id];
                if (value) {
                    $(Moss.fn.toId(id + ":text_DIV")).show();
                    this.checked = true;
                }
            } else {
                /*if ($(Moss.fn.escapeId(id))) {
                    tagName = $(Moss.fn.escapeId(id)).prop("tagName").toLowerCase();
                    if ("select" === tagName) {
                        value = answers[id];
                        console.log(id + " is a " + tagName);
                        //TODO iterate over option sot set value. set to other if not found
                    }
                } else {
                    value = answers[id];                    
                }
                */
                value = answers[id];
                if (value) {
                    _w.val(value);
                    if (_re.test(id)) {
                        _w.parent().show();
                    }
                }
            }
        });
    };

    Moss.fn.escapeId = function jq(myid) {
        return "#" + myid.replace(/(:|#|\.|\[|\]|,)/g, "\\$1");
    };
    
    Moss.fn.changeLanguage = function () {
        Moss.settings.language = $("[name=rd_main_lang]:checked").val();
        Moss.fn.log("Language change to: " + Moss.settings.language);
        Moss.ui.updateImages();
        var table = $("#survey-list-table").DataTable();
        table.clear();
        table.destroy();
        table = null;
        Moss.fn.listSurveys(function () {
            Moss.fn.i18n($('body'));
        });
        Moss.svc.updateSettings();
    };
    
    Moss.fn.i18n = function (jqTarget) {
        if (Moss.shared.baseDictionary === undefined) {
            Moss.fn.log("scheduling i18n");
            window.setTimeout(function () {
                Moss.fn.i18n(jqTarget);
            }, 100);
            return;
        }
        jqTarget.find("[data-i18n]").each(function () {
            var t = $(this),
                s = Moss.fn.string(t.attr("data-i18n"));
            //if ("@_next_question" === t.attr("data-i18n") || "_next_question" === t.attr("data-i18n"))
              //  console.debug(Moss.settings.language + " label for " + t.attr("data-i18n") + " = " +Moss.fn.string(t.attr("data-i18n")) )
            if ((t).is("input")) {
                t.attr("placeholder", s);
            } else {
                t.html(s);
            }
            
        });
    };
    
    Moss.fn.fillpage = function () {
        try {
            var y1 = $("#navbuttons").position().top,
                y2 = $("#footer").position().top,
                d = y2 - y1;
            if (d > 0) {
                $("#filler").height(d);
            }
            
        } catch (e) {
            console.error(e);
        }
    };
    
    Moss.fn.registerEvents = function () {
        $(document).on('pagecreate', '#home', function (event) {
            //Moss.fn.log("homepage create")
            //equivalent to document ready() for jquierymobile: init has been replaced by pagecreate on jquery 1.4.0 -->https://api.jquerymobile.com/pageinit/
            $("#surveys-export-dialog").enhanceWithin().popup();
            Moss.ui.updateImages();
            //$('#div-about').text('SHARP V.' + Moss.version + " - HH-BAT");
            $('#div-about').text('V.' + Moss.version);
            
            //$('#div-about').text('SHARP V.' + Moss.version);
            //$('#div-about').append(', <a href="#" style="text-decoration: none;color: white;" onclick="window.open(\'http://www.fao.org/contact-us/terms/en/\', \'_system\');">© FAO 2015</a> - ');
            //$('#div-about').append('<a href="#" style="text-decoration: none;color: white;" onclick="window.open(\'http://www.fao.org/contact-us/privacy-policy/en/\', \'_system\');" data-i18n="@_privacy_policy">Privacy Policy</a>');
        });
        
        $(document).on('popupbeforeposition', function (event) {
            Moss.fn.i18n($(event.target));
        });
        
        $(document).on('panelbeforeopen', function (event) {
            Moss.fn.i18n($(event.target));
        });

        $(document).on('pagebeforeshow', function (event) {
            Moss.fn.i18n($(event.target));
        });
    
        $(document).on('panelbeforeopen', '#left-panel', function (event) {
            Moss.fn.fillpage();
            Moss.fn.bindToModel();
        });
        
        $(document).on('popupbeforeposition', '#hide-dialog', function (event) {
            $("#hide-show-div").empty();
            Moss.ui.renderWidget('hide-show-div', 'hide_show');
            $("#hide-show-div").enhanceWithin();
        });

        $(document).on('panelbeforeopen', '#right-panel', function (event) {
            Moss.fn.fillpage();
            Moss.fn.bindToModel();
            var _pn = Moss.fn.currentSurvey().personName,
                _pp = Moss.fn.currentSurvey().personPracticeLabelKey;
            if (!_pn) {
                _pn = "";
            }
            if (!_pp) {
                _pp = "(Practice not set)";
            }
            $("#person-name").val(_pn);
            $("#person-practice").text(Moss.fn.string(_pp));
            Moss.ui.renderQStatusSingle("qstatus-single");
        });

        $(document).on('popupbeforeposition', '#current-scoring', function (event) {
            Moss.fn.bindToModel();
            $("#current-scoring-content").html(
                Moss.ui['current-score'].tpl(Moss.fn.currentAnswers())
            );
        });
        
        $(document).on('pagebeforeshow', '#settings', function (event) {
            $("#user-name").val(Moss.settings.userName);
            $("#user-id").val(Moss.settings.userId);
            $("#api-key").val(Moss.settings.apiKey);
            $("#endpoint").val(Moss.settings.endpoint);
            $("#rememberCredentials").prop("checked", Moss.settings.rememberCredentials).checkboxradio("refresh");
            
            //SETUP FFS datatable
            var tablePersons,
                tableSG = $("#sg-list-table").DataTable({
                    retrieve: true,
                    //responsive: true,
                    language: Moss.shared.baseDictionary["dataTable@" + Moss.settings.language],
                    paging: false,
                    searching: false,
                    columns: [
                        {
                            data: "name",
                            "class": "open-control"
                        },
                        {
                            "class": "delete-control",
                            orderable: false,
                            data: null,
                            defaultContent: '<span class="ui-icon-delete ui-btn-icon-left " style="position:relative;" />'
                        }
                    ]
                });
            
            Moss.fn.loadSG();
            
            $("#sg-list-table tbody").off().on("click", "td", function () {
                var cell = $(this),
                    tr = cell.closest('tr'),
                    row = tableSG.row(tr),
                    id = row.data().id;
                
                if (cell.hasClass("open-control")) {
                    Moss.fn.editSGPopup(id);
                } else if (cell.hasClass("delete-control")) {
                    Moss.fn.deleteSG(id);
                }
            });
            
            //SETUP PERSONS datatable
            /*
             <th data-i18n="@_pid">Person Identifier</th>
                            <th data-i18n="@_lastname">Last name</th>
                            <th data-i18n="@_firstname">First name</th>                            
                            <th style="width:60px" data-i18n="@_delete">Delete</th>
           */
            tablePersons = $("#sg-persons-list-table").DataTable({
                retrieve: true,
                language: Moss.shared.baseDictionary["dataTable@" + Moss.settings.language],
                paging: false,
                searching: false,
                columns: [
                    {
                        data: "id",
                        "visible": false
                    },
                    {
                        data: "pid"
                    },
                    {
                        data: "lastname"
                    },
                    {
                        data: "firstname"
                    },
                    {
                        "class": "delete-control",
                        orderable: false,
                        data: null,
                        defaultContent: '<span class="ui-icon-delete ui-btn-icon-left " style="position:relative;" />'
                    }
                ]
            });
            Moss.fn.loadPersonsDataTable();
            $("#sg-persons-list-table tbody").off().on("click", "td", function () {
                var cell = $(this),
                    tr = cell.closest('tr'),
                    row = tablePersons.row(tr),
                    id = row.data().id;
                if (cell.hasClass("delete-control")) {
                    Moss.svc.deletePerson(id);
                }
            });
            Moss.fn.updateLanguageSwitcher();
           
        });
        
        $(document).on('pageshow', '#survey-scoring', function (event) {
            Moss.fn.log("Moss.ui.renderWidget('navbar', 'navbar',{scoring: true});");
            $("#navbar").empty();
            Moss.ui.renderWidget('navbar-scoring', 'navbar', {scoring: true});
            configureListeners();
            extractCurrentData();
        });
        
        $(document).on('pagebeforehide', '#settings', function (event) {
            Moss.settings.rememberCredentials = $("#rememberCredentials").prop("checked");
            if (Moss.settings.rememberCredentials) {
                Moss.settings.userName = $("#user-name").val();
                Moss.settings.userId = $("#user-id").val();
                Moss.settings.apiKey = $("#api-key").val();
                Moss.settings.endpoint = $("#endpoint").val();
                Moss.settings.rememberCredentials = $("#rememberCredentials").prop("checked");
            } else {
                Moss.settings.userName = "";
                Moss.settings.userId = "";
                Moss.settings.apiKey = "";
                Moss.settings.endpoint = "";
            }
            Moss.svc.updateSettings();
        });
        
        /*
        $(document).on('pagecreate', '#attendance-report-search', function (event) {
            initAttendanceReportSearch();
            Moss.svc.searchAttendanceReports({}, createAttendanceReportListDataTable);
           
        });
        */
        $(document).on('pageshow', '#attendance-report-search', function (event) {
            initAttendanceReportSearch();
            Moss.svc.searchAttendanceReports({}, createAttendanceReportListDataTable);
           
        });
        
        $(document).on('pagecreate', '#page-attendance-report-edit', function (event) {
            initAttendanceReportEdit(Moss.model.attendanceReport);
        });
        
        $(document).on('popupbeforeposition', '#question-help', function (event) {
            $("#question-help-content").html(Moss.fn.string(Moss.fn.currentQuestion().help));
        });

        
        $(document).on("pageshow", "#survey-edit", function (event) {
            Moss.fn.loadSupergroupsSelect("#supergroup-edit", Moss.model.superGroupId);
            Moss.fn.loadOtherGroupsSelect();
        });

        
        $(document).on("pagecreate", "#survey-progress", function (event) {
            Moss.ui.renderWidget('wprogress', 'qstatus-all');
        });
        
        $(document).on("pagebeforeshow", "#home", function (event) {
            //Moss.fn.log("HOME beforepageshow " + new Date());
            Moss.fn.updateLanguageSwitcher();
            Moss.fn.listSurveys();
            
            Moss.svc.findAllSuperGroups(function (list) {
                //20160222 this part has been commented as ffs new button  has been moved in the new survey popup
                /*if (Moss.shared.supergroups.length === 0) {
                    Moss.ui.message(
                        {
                            icon: 'alert',
                            message:  Moss.fn.string("@_error_new_survey_ffs"),
                            style: "background-color: #f0f096"
                        }
                    );
                } else {
                    $("#moss-message").empty();
                }*/
            });
        });
        
        $(document).on('pagebeforeshow', '#bluetooth', function (event) {
            //SETUP bluetooth devices list datatable
            
            
            Moss.fn.bluetooth_start();
            console.log("pagebeforeshow bluetooth done..");
            
        });
             
    };
    
    
    Moss.fn.updateLanguageSwitcher = function () {
        $("input[name='rd_main_lang'][value='" + Moss.settings.language + "']").each(function () {
            $(this).prop("checked", true).checkboxradio("refresh");
        });
    };
    
    Moss.fn.loadSurveySchemaSelect = function (element_id, selected_value) {
        $(element_id).empty();
        $(element_id).append($('<option>', {
            value: "",
            text : ""
        }));
        $(element_id).val([]);
        $(element_id).val(selected_value).selectmenu("refresh");
        $.each(Moss.schemas, function (i, item) {
            $(element_id).append($('<option>', {
                value: item.id,
                text : Moss.fn.string(item.name)
            }));
        });
    };
    
    Moss.fn.loadSupergroupsSelect = function (element_id, selected_value) {
        $(element_id).empty();
        $(element_id).append($('<option>', {
            value: "",
            text : ""
        }));
        $.each(Moss.shared.supergroups, function (i, item) {
            $(element_id).append($('<option>', {
                value: item.id,
                text : item.name
            }));
        });
        if (selected_value) {
            $(element_id).val(selected_value).selectmenu("refresh");
        } else if ($("#sg_name")) {
            var app = $("#sg_name").val();
            
            $(element_id + " option").filter(function () {
                //Moss.fn.log(this.text + " " + $("#sg_name").val() + ": " + this.text === $("#sg_name").val());
                return this.text === app;
            }).attr('selected', true);
            $(element_id).selectmenu("refresh");
            //$("#sg_name").val("");
        } else {
            $(element_id).selectmenu("refresh");
        }
    };
    
    Moss.fn.loadOtherGroupsSelect = function () {
        $("#other-grps").empty();
        $("#other-grps").append($('<option>', {
            value: '',
            text: Moss.fn.string("@_create_new_group")
        }));
        Moss.svc.findOtherGroups(Moss.model.groupId, Moss.model.superGroupId)
            .done(function (rows) {
                $.each(rows, function (i, item) {
                    $("#other-grps").append($('<option>', {
                        value: item.id,
                        text : item.group_name
                    }));
                });
                $('#other-grps').selectmenu('refresh');
            }).fail(function (tx, err) {
                throw new Error(err.message);
            });
    };
    
    
    Moss.fn.listSurveys = function (callback) {
        Moss.svc.findAllGroups(function (list) {
            $("#survey-list-table").DataTable(
                {
                    /* Disable initial sort */
                    retrieve: true,
                    language: Moss.shared.baseDictionary["dataTable@" + Moss.settings.language],
                    aaSorting: [],
                    "oLanguage": {
                        "sInfo": Moss.fn.string("@_showing") + " _START_ " + Moss.fn.string("@_to") + " _END_ " + Moss.fn.string("@_of") + " _TOTAL_ " + Moss.fn.string("@_records"),
                        "sLengthMenu": Moss.fn.string("@_show") + " _MENU_ " + Moss.fn.string("@_records"),
                        "sSearch": Moss.fn.string("@_search"),
                        "sEmptyTable": Moss.fn.string("@_no_data"),
                        "oPaginate": {
                            "sNext": Moss.fn.string("@_next"),
                            "sPrevious": Moss.fn.string("@_previous")
                        }
                    },
                    columnDefs: [
                        {
                            defaultContent: ""
                        }
                    ],
                    columns: [
                        {
                            title: "<span data-i18n='@_creation_date'>"+Moss.fn.string("@_records")+"</span>",
                            data: "creationDate"
                        },                        {
                            title: "<span data-i18n='@_ffs'>"+Moss.fn.string("@_ffs")+"</span>",
                            data: "superGroupName"
                        },
                        {
                            title: "<span data-i18n='@_gsn'>Group/Session Name</span>",
                            data: "groupName"
                        },
                        {
                            title: "<span data-i18n='@_nop'>Number of Persons</span>",
                            data: "numberOfSurveys"
                        },
                        {
                            title: "<span data-i18n='@_last_access'>Last Access</span>",
                            data: "lastModDate",
                            render: function (data, type, row, meta) {
                                if (!row.sentDate || data > row.sentDate) {
                                    data = data || "";
                                    return '<span style="font-weight: bold">' + data + '</span>';
                                }
                                return data;
                            }
                        },
                        {
                            title: "<span data-i18n='@_sent'>Date sent</span>",
                            data: "sentDate"
                        },
                        {
                            title: "<span data-i18n='@_completed'>Completed %</span>",
                            data: "completionPercentage"
                        }
                    ]
                }
            );
            var dt = $("#survey-list-table").dataTable().api();
            dt.clear();
            dt.rows.add(list).draw();
            $("#survey-list-table").off().on('click', 'tr', function () {
                var id = $("#survey-list-table").dataTable().api().row(this).data().id;
                Moss.fn.load(id);
            });
            if (callback) {
                callback();
            }
        });
    };
    
    Moss.fn.load = function (groupId) {
        var group;
        Moss.svc.load(groupId, function (group) {
            Moss.model = group;
            var found = false,
                schema;
            for (schema in Moss.schemas) {
                if (Moss.schemas.hasOwnProperty(schema)) {
                    if (Moss.schemas[schema].id === group.templateVersion) {
                        found = true;
                    }
                }
            }
            //If the group does not have a schema, as for old surveys, the system displkays a oppup to force the schema update
            if (!found) {
                //Moss.fn.log("sharp,1.0")
                Moss.fn.loadSurveySchemaSelect("#select-survey-schema-update", null);
                $("#survey-type-select").popup("open", {transition: "pop"});
                return;
            }
            Moss.fn.loadSurveyDef(group.templateVersion, null, function (params) {
                Moss.fn.startView();
            });
        });
    };
    
    Moss.fn.setGPS = function (wid) {
        // TODO dummy
        Moss.fn.log('setting gps ' + wid);
        var onSuccess = function (position) {
            $(Moss.fn.toId(wid + ":lat")).val(position.coords.latitude);
            $(Moss.fn.toId(wid + ":lon")).val(position.coords.longitude);
            Moss.ui.hideLoader(
                {
                    timeout: 500,
                    callback: function () {
                        Moss.ui.notify(Moss.fn.string("@RZK"));
                    }
                }
            );
        },
            onError = function (position) {
                Moss.ui.hideLoader(
                    {
                        timeout: 500,
                        callback: function () {
                            Moss.ui.notifyWarning(Moss.fn.string("@ZMM"));
                        }
                    }
                );
            };
        Moss.ui.showLoader(Moss.fn.string("@RZZ") || "Acquiring location...");
        navigator.geolocation.getCurrentPosition(onSuccess, onError,
                                         { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    };
        
    Moss.fn.dateToString = function (date, dateTime) {
        var yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDay().toString(),
            hh = date.getHours().toString(),
            min = date.getMinutes().toString(),
            out;
        out =  yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
        if (dateTime) {
            out += " " + (hh[1] ? hh : "0" + hh[0]) + ':' + ((min[1] ? min : "0" + min[0]));
        }
        return out;
    };
    
    Moss.fn.dateTimeToString = function (date) {
        var yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDate().toString(),
            hh = date.getHours().toString(),
            min = date.getMinutes().toString(),
            secs = date.getSeconds().toString(),
            msecs = date.getMilliseconds().toString(),
            out;
        out =  yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0])
              + "_" + (hh[1] ? hh : "0" + hh[0]) + '-' + ((min[1] ? min : "0" + min[0])) + '-' + ((secs[1] ? secs : "0" + secs[0])) + "_" + msecs;
        
        return out;
    };
    
    Moss.fn.stringToDate = function (dateStr) {
        return new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        //$("#startDate").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") 
    };
    
    Moss.fn.fireChange = function (control) {
        Moss.fn.bindToModel();
        var _listeners = $("[data-moss-hideif]"),
            i,
            _expr,
            _hide,
            _w,
            currentSurvey = Moss.fn.currentSurvey(),
            currentAnswers = Moss.fn.currentAnswers();
        _listeners.each(function () {
            _w = $(this);
            _expr = _w.attr("data-moss-hideif");
            _hide = Moss.fn.evalExpression(_expr, currentSurvey, currentAnswers);
            if (_hide) {
                try {
                    _w.hide();
                    _w.find("input[type='text']").val('');
                    _w.find("input[type='number']").val('');
                    _w.find("input[type='date']").val('');
                    _w.find("textarea").val('');
                    _w.find("select").val('').selectmenu("refresh");
                    if (_w.find("select").size() > 0) {
                        var _textid = _w.find("select").attr('id') + ":text",
                            _divid = _textid + '_DIV',
                            _d;
                        _w = $(Moss.fn.toId(_textid));
                        _d = $(Moss.fn.toId(_divid));
                        if (_d.length) {
                            _w.val("");
                            _d.hide();
                        }
                    }
                    _w.find("input[type='radio']").prop('checked', false).checkboxradio("refresh");
                    _w.find("input[type='checkbox']").prop('checked', false).checkboxradio("refresh");
                } catch (err) {
                    Moss.fn.log(err);
                }
            } else if (_w.is(':hidden')) {
                _w.show(200);
            }
        });
        if (control) {
            $('#main').animate({
                scrollTop: $(control).offset().top
            }, 'slow');
        }
    };
    
    // Supergroups management
    
    Moss.fn.newSGPopup = function () {
        $("#sg-edit-title").text(Moss.fn.string("@_new_ffs"));
        $("#sg_name").val('');
        $("#btn-save").off().click(function () {
            if (!$("#sg_name").val().trim()) {
                return;
            }
            Moss.fn.saveSG();
            $("#sg-edit").popup("close");
        });
        $("#sg-edit").popup('open');
    };
    
    Moss.fn.editSGPopup = function (id) {
        Moss.svc.findSuperGroup(id)
            .done(function (rows) {
                if (rows.length !== 1) {
                    return;
                }
                $("#sg-edit-title").text(Moss.fn.string("@_edit_ffs"));
                $("#btn-save").off().click(function () {
                    if (!$("#sg_name").val().trim()) {
                        return;
                    }
                    Moss.fn.updateSG();
                    $("#sg-edit").popup("close");
                });
                $("#sg_name").attr("data-id", rows[0].id);
                $("#sg_name").val(rows[0].name);
                $("#sg-edit").popup("open");
            })
            .fail(function (tx, err) {
                throw new Error(err.message);
            });
    };
    
    Moss.fn.about = function () {
        
        Moss.ui.showPopupMessage(
            {
                title: Moss.fn.string('@_about'),
                message: '<div style="width: 400px; color: navy">' +
                            'SHARP V.' + Moss.version + '<br/><br/>' +
                        '</div>',
                /*
                message: '<div style="width: 400px; color: navy">' +
                            'SHARP V.' + Moss.version + '<span style="text-align: right;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;© FAO, 2014</span><br/><br/>' +
                            '<div style="text-align: center;">' +
                                '<a href="#" style="color: navy;" onclick="window.open(\'http://www.fao.org/contact-us/privacy-policy/en/\', \'_system\');">' + Moss.fn.string("@_privacy_policy") + '</a>' +
                            '</div>' +
                        '</div>',
                */
                cancelLabel: Moss.fn.string('@_close')
            }
        );
    };
    
    Moss.fn.deleteSG = function (id) {
        Moss.svc.deleteSuperGroup(id, function (res) {
            if (res.rowsAffected === 0) {
                Moss.ui.showPopupMessage(
                    {
                        title: Moss.fn.string('@_warning'),
                        message: Moss.fn.string('@_unable_delete_survey')
                    }
                );
            } else if (res.rowsAffected === 1) {
                Moss.ui.notify(Moss.fn.string("@_record_deleted"));
            }
            Moss.fn.loadSG();
        });
    };
    
    Moss.fn.saveSG = function () {
        var name = $("#sg_name").val();
        Moss.svc.saveNewSuperGroup({name: name})
            .fail(function (tx, err) {
                Moss.ui.notifyError(Moss.fn.string("@_error_saving_ffs"));
            })
            .done(function () {
                Moss.fn.loadSG();
            });
    };

    Moss.fn.updateSG = function () {
        var id = $("#sg_name").attr("data-id"),
            name = $("#sg_name").val();
        Moss.svc.updateSuperGroup({id: id, name: name})
            .fail(function (tx, err) {
                Moss.ui.notifyError(Moss.fn.string('@_error_update_ffs'));
            })
            .done(function () {
                Moss.fn.loadSG();
            });
    };
      
    // removed because ffs was moved to new survey popup
    /*
    Moss.fn.loadSG = function () {
        Moss.svc.findAllSuperGroups(function (list) {
            var dt = $("#sg-list-table").dataTable().api();
            dt.clear();
            dt.rows.add(list).draw();
        });
    };
        
    */
    Moss.fn.loadSG = function () {
        Moss.svc.findAllSuperGroups(function (list) {
            if ($("#supergroup-new")) {
                Moss.fn.loadSupergroupsSelect("#supergroup-new", null);
            }
            if ($("#sg-list-table")) {
                var dt = $("#sg-list-table").dataTable().api();
                dt.clear();
                dt.rows.add(list).draw();
            }
        });
    };
    
    //------- end Supergroups Management    
    
    Moss.fn.attendanceReportSearch = function () {
        $.mobile.pageContainer.pagecontainer("change", "#attendance-report-search", {
            allowSamePageTransition : true,
            transition : "fade"
        });
    };
    
    
    Moss.fn.loadAttendanceReport = function (id) {
        Moss.svc.findAttendanceReport(id, Moss.fn.attendanceReportEdit);
    };
     
    Moss.fn.newAttendanceReport = function () {
        $("#attendance-report-new").popup("open", {transition: "pop"});
        $("#form-attendance-report-new").trigger('reset');
        $("#div-participants").empty();
    };
    
    
    Moss.fn.createAttendanceReport = function () {
        
        if (!$("#startDatePopup").val() || !$("#endDatePopup").val() || !$('#ffsPopup option:selected').val() || !$("#participants input:checked")) {
            Moss.ui.notifyError(Moss.fn.string("@_mandatory_fields"));
            return;
        }
        
        var startDate = new Date($("#startDatePopup").val().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")),
            endDate = new Date($("#endDatePopup").val().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")),
            ffs = $('#ffsPopup option:selected').val(),
            participants = $("#participants input:checked"),
            weeks = (Math.ceil((((endDate.getTime() - startDate.getTime()) / 1000) / 60) / 60 / 24 / 7)),
            attendanceReport,
            week,
            i,
            participant,
            l;
        
        if (weeks <= 0) {
            Moss.ui.notifyError(Moss.fn.string("@_validate_start_end_date"));
            return;
        }
        
        attendanceReport = {};
		attendanceReport.participants = [];
		attendanceReport.weeks = [];
		attendanceReport.startDate = Moss.fn.dateToString(startDate);
		attendanceReport.endDate = Moss.fn.dateToString(endDate);
		attendanceReport.ffs = {};
        //attendanceReport.description = description;
		attendanceReport.ffs.name = $('#ffsPopup option:selected').text();
		attendanceReport.ffs.id = $('#ffsPopup option:selected').val();
		
		for (week = 0; week < weeks; week++) {
			attendanceReport.weeks.push("week-" + week);
		}
		
		participant = {};
		for (i = 0; i < participants.length; i++) {
			participant = {};
			participant.id = $(participants[i]).attr("data-value");
			participant.name = $(participants[i]).attr("data-label");
			participant.weeks = [];

			for (week in attendanceReport.weeks) {
                if (attendanceReport.weeks.hasOwnProperty(week)) {
                    l = attendanceReport.weeks[week];
                    participant.weeks.push(false);
                }
			}
			attendanceReport.participants.push(participant);
		}

        Moss.fn.attendanceReportEdit(attendanceReport);
    };
    
    Moss.fn.attendanceReportEdit = function (attendanceReport) {
        Moss.model.attendanceReport = attendanceReport;
        $.mobile.pageContainer.pagecontainer("change", "attendance-report-edit.html", {
            allowSamePageTransition : true,
            transition : "fade"
        });
    };
            
    
    
    Moss.fn.updatePersons = function () {
        var surveyList = [];
        Moss.svc.findAllSurveys(function (surveys) {
            var index,
                survey;
            for (index in surveys) {
                if (surveys.hasOwnProperty(index)) {
                    survey = surveys[index];
                    Moss.fn.findOrInsertPerson(survey);
                }
            }
        });
    };
    
    Moss.fn.findOrInsertPerson = function (survey) {
        var currentPersonId =  survey.json.answers.S0_INFO['S0_INFO.id_of_respondent'],
            currentPersonName = survey.json.answers.S0_INFO['S0_INFO.name_of_respondent'],
            found = false,
            person = {};
        
        if (currentPersonId) {
            return;
        }

        Moss.svc.findAllPersons(function (rows) {
            var row,
                p;
            
            for (row in rows) {
                if (rows.hasOwnProperty(row)) {
                    p = rows[row].firstname + " " + rows[row].lastname;
                    if (currentPersonName && p.trim().toLowerCase() === currentPersonName.trim().toLowerCase()) {
                        found = true;
                        person.id = rows[row].id;
                        person.pid = rows[row].pid;
                        Moss.fn.addPersonToSurvey(person, survey);
                        break;
                    }
                }
            }
            if (!found && currentPersonName) {
                Moss.svc.findSuperGroupIdByIdGroup(survey.groupId, function (superGroupId) {

                    person.id  = Moss.fn.generateId({digits: 6, prefix: "P"});
                    person.pid = Moss.fn.generateId({digits: 6, prefix: "PID"});

                    var p = currentPersonName.split(" "),
                        i;

                    if (p.length === 2) {
                        person.firstname = p[0];
                        person.lastname = p[1];
                    } else {
                        person.firstname = p[0];
                        person.lastname = "";

                        for (i = 1; i < p.length; i++) {
                            person.lastname += p[i] + " ";
                        }
                        person.lastname = person.lastname.trim();
                    }
                    person.ffs = superGroupId;
                    Moss.fn.insertNewPerson(person, survey);

                });
            }
        });
    };
    
    Moss.fn.insertNewPerson = function (person, survey) {
        Moss.svc.saveNewPerson(person)
            .fail(function (tx, err) {
                Moss.ui.notifyError(Moss.fn.string("@_error_saving_person") + " " + err.message);
            }).then(function () {
                Moss.fn.addPersonToSurvey(person, survey);
                
            })
            .done(function (data) {
                Moss.fn.log("person updated " + data);
               /* survey.json.answers.S0_INFO['S0_INFO.id_of_respondent'] = person.id;
                //updatedSurveys.push(survey);
                Moss.svc.updateSurvey(survey.id, survey.groupId, survey.json)
                .done(function (s) {
                    Moss.fn.log(s);
                });*/

            });
    };
    
    Moss.fn.addPersonToSurvey = function (person, survey) {
        survey.json.answers.S0_INFO['S0_INFO.id_of_respondent'] = person.id;
        //updatedSurveys.push(survey);
        Moss.svc.updateSurvey(survey.id, survey.groupId, survey.json)
            .done(function (s) {
                Moss.fn.log(survey.json.answers.S0_INFO['S0_INFO.id_of_respondent']);
                Moss.fn.log(survey);
            });
    };

    
    Moss.fn.loadPersons = function (select, selectedPersonId) {
        //var select = $("S0_INFO\\.name_of_respondent");
        Moss.svc.findAllPersonsByFFS(Moss.model.superGroupId, function (rows) {
            var found = false,
                currentPersonId = Moss.model.surveys[Moss.model.currentSurveyIdx].answers.S0_INFO['S0_INFO.id_of_respondent'],
                currentPerson = Moss.model.surveys[Moss.model.currentSurveyIdx].answers.S0_INFO['S0_INFO.name_of_respondent'],
                row,
                p,
                id,
                option,
                person,
                i;
            
            $(select).empty();
            $(select).append($("<option>").attr("value", "").text(""));
            
            for (row in rows) {
                if (rows.hasOwnProperty(row)) {
                    p = rows[row].firstname + " " + rows[row].lastname;
                    id = rows[row].id;
                    option = $("<option>").attr("value", rows[row].id).text(p);
                    if (currentPersonId && id && id === currentPersonId) {
                        $(option).attr("selected", "selected");
                        found = true;
                        $(select).val(id);
                    } else if (currentPerson && p.trim().toLowerCase() === currentPerson.trim().toLowerCase()) {
                        $(option).attr("selected", "selected");
                        $(select).val(id);
                        found = true;
                    } else if (selectedPersonId) {
                        if (selectedPersonId === id) {
                            $(option).attr("selected", "selected");
                        }
                    }
                    $(select).append(option);
                }
            }
            
            if (!found && currentPerson) {
                person = {};
                p = currentPerson.split(" ");
                
                if (p.length === 2) {
                    person.firstname = p[0];
                    person.lastname = p[1];
                } else {
                    person.firstname = p[0];
                    person.lastname = "";
                    for (i = 1; i < p.length; i++) {
                        person.lastname += p[i] + " ";
                    }
                    person.lastname = person.lastname.trim();
                }
                person.ffs = Moss.model.superGroupId;
                

                //person.country = $("#input-person-country").val();
                Moss.svc.saveNewPerson(person).fail(function (tx, err) {
                    Moss.ui.notifyError(Moss.fn.string("@_error_saving_person") + " " + err.message);
                })
                    .done(function () {
                        if ($("#S0_INFO\\.name_of_respondent")) {
                            Moss.fn.loadPersons(select, null);
                            $(select).selectmenu('refresh');
                        }
                    });
                                
            }
            $(select).selectmenu('refresh');
        });
    };
    
    Moss.fn.addPerson = function () {
        //init popup
        $("#person-dialog").popup();
        $("#form-report-search").trigger('reset');
        $(document).off('click', '#person-dialog #btn-person-add').on('click', '#person-dialog #btn-person-add', function (e) {
            var person = {};
            person.ffs = Moss.model.superGroupId;
            //person.id = $("#input-person-id").val();
            //PID is a "friendly identifier for persons, like a cell number or id card or similar"
            person.id = $("#input-person-id").val();
            if (!person.id) {
                person.id = Moss.fn.generateId({digits: 6, prefix: "P"});
            }
            person.pid = $("#input-person-pid").val();
            person.lastname = $("#input-person-lastname").val();
            person.firstname = $("#input-person-firstname").val();
            
            if (person.lastname === "" || person.firstname === "") {
                Moss.ui.notifyError(Moss.fn.string("@_mandatory_fields"));
                return;
            }
               

            //person.country = $("#input-person-country").val();
            $("#input-person-pid").blur();
            $("#input-person-lastname").blur();
            $("#input-person-firstname").blur();
            if (person.pid) {
                Moss.svc.findPersonByPID(person.pid).done(function (rows) {
                    if (rows.length !== 0) {
                        Moss.ui.notifyError(Moss.fn.string("@_duplicate_pid"));
                    } else {
                        Moss.svc.saveNewPerson(person).fail(function (tx, err) {
                            Moss.ui.notifyError(Moss.fn.string("@_error_saving_person") + " " + err.message);
                        }).done(function () {
                            $("#person-dialog").popup("close");
                            if ($("#S0_INFO\\.name_of_respondent")) {
                                Moss.fn.loadPersons("#S0_INFO\\.id_of_respondent", person.id);
                            }
                        });
                    }
                })
                    .fail(function (tx, err) {
                        Moss.ui.notifyError(Moss.fn.string("@_error_saving_person") + " " + err.message);
                    });
            } else {
                
                Moss.svc.saveNewPerson(person).fail(function (tx, err) {
                    Moss.ui.notifyError(Moss.fn.string("@_error_saving_person") + " " + err.message);
                }).done(function () {
                    $("#person-dialog").popup("close");
                    if ($("#S0_INFO\\.name_of_respondent")) {
                        Moss.fn.loadPersons("#S0_INFO\\.id_of_respondent", person.id);
                    }
                });
                
            }
        });
        $("#person-dialog").popup("open");
    };
    
    
    Moss.fn.loadPersonsDataTable = function () {
        Moss.svc.findAllPersons(function (list) {
            var dt = $("#sg-persons-list-table").dataTable().api();
            dt.clear();
            dt.rows.add(list).draw();
        });
    };
   
    
    Moss.fn.exportSurveys = function (survey) {
        $("#surveys-export-dialog").popup("open");
        Moss.fn.loadSurveySchemaSelect("#select-survey-schema-export", null);
                
        $("#btn-surveys-export-dialog-export").off().on("click", function (event) {
            //export            
            var surveySchema = $("#select-survey-schema-export").val(),
                exportType = $('input[name=export-type]:checked').val();
            
            if ("scores" === exportType) {
                Moss.fn.exportSurveyScoreToCSV(survey, surveySchema);
            } else {
                Moss.fn.exportSurveyToCSV(survey, surveySchema);
            }
            $("#surveys-export-dialog").popup("close");
        });
        $("#btn-surveys-export-dialog-close").off().on("click", function (event) {
            $("#surveys-export-dialog").popup("close");
        });
    };
    
    Moss.fn.exportSurveyDefinition = function () {
        var surveyToCsv = [],
            list = [];
        
        Moss.fn.loadSurveySchema(Moss.fn.settings.surveyNameAndVersion, function () {
            //Moss.fn.log(Moss.model.surveySchema);
            surveyToCsv = {};
            surveyToCsv.section = "Section";
            surveyToCsv.id = "Id";
            surveyToCsv.number = "Number";
            surveyToCsv.title = "Question";
            //surveyToCsv.type = "Type";
            surveyToCsv.indicators = "Indicators";
            surveyToCsv.measurement = "Measurement";
            surveyToCsv.scoring = "Scoring";
            surveyToCsv.score = "Score";
            surveyToCsv.required = "Required";
            list.push(surveyToCsv);
            var questionId,
                question;
            
            for (questionId in Moss.model.surveySchema) {
                if (Moss.model.surveySchema.hasOwnProperty(questionId)) {
                    question = Moss.model.surveySchema[questionId];
                    if (question.type !== "question" && question.type !== "label" && question.type !== "adequacy-importance"
                            && question.type !== "int_and_textarea"  && question.type !== "button"  && question.type !== "gps"
                            /*&& question.type != "grid"*/ && question.type !== "section"
                            && !question.rowId) {
                        surveyToCsv = {};
                        surveyToCsv.section = questionId.split(".")[0];
                        surveyToCsv.id = questionId;
                        surveyToCsv.number = question.pos;
                        surveyToCsv.title = Moss.fn.string(question.label);
                        //surveyToCsv.type = question.type; 
                        surveyToCsv.indicators = question.indicators;
                        surveyToCsv.measurement = question.measurement;
                        surveyToCsv.scoring = question.scoring ? "Yes" : "No";
                        surveyToCsv.score = question.score;
                        surveyToCsv.required = question.required ? "Yes" : "No";
                        list.push(surveyToCsv);
                    }
                }
            }
            Moss.fn.downloadCSV(Moss.fn.dataToCsv(list, '"', ','), "MODEL");
        });
    };
        
    Moss.fn.exportSurveyScoreToCSV = function (survey, surveySchema) {
        if (!survey) {
            Moss.svc.findAllSurveys(function (list) {
                Moss.fn.surveyScoreToCSV(list, surveySchema);
            });
        } else {
            Moss.fn.surveyScoreToCSV(survey, surveySchema);
        }
    };
         
    Moss.fn.surveyScoreToCSV = function (data, surveySchema) {
        var questions = [],
            list = [];
        Moss.fn.loadSurveySchema(surveySchema, function () {
            //load the survey definition and add the header row to csv            
            var surveyToCsv = {},
                ids = {},
                cnt = 1,
                questionId,
                question,
                surveys;
            
            for (questionId in Moss.model.surveySchema) {
                if (Moss.model.surveySchema.hasOwnProperty(questionId)) {
                    question = Moss.model.surveySchema[questionId];
                    if (question.id && question.id.indexOf('S0_INFO') === 0) {
                        Moss.fn._addQuestion(question, questions, ids, surveyToCsv, cnt);
                    } else if (question.type === "question" && question.scoring) {
                        Moss.fn._addQuestion(question, questions, ids, surveyToCsv, cnt);
                    }
                }
            }
            cnt = 1;
            list.push(ids);
            list.push(surveyToCsv);
            //load the answers from the surveys
            surveys = [];
            if ($.isArray(data)) {
                surveys = data;
            } else {
                surveys.push(data);
            }
            
            Moss.fn.extractAnswers(surveys, list, questions);
            Moss.fn.downloadCSV(Moss.fn.dataToCsv(list, '"', ','), "SCORES");
        });
    };
    
    Moss.fn.exportSurveyToCSV = function (survey, surveySchema) {
        if (!survey) {
            Moss.svc.findAllSurveys(function (list) {
                Moss.fn.surveyToCsv(list, surveySchema);
            });
        } else {
            Moss.fn.surveyToCsv(survey, surveySchema);
        }
    };

    Moss.fn.surveyToCsv = function (data, surveySchema) {
        var questions = [],
            list = [];
        Moss.fn.loadSurveySchema(surveySchema, function () {
            //load the survey definition and add the header row to csv            
            var surveyToCsv = {},
                ids = {},
                cnt = 1,
                questionId,
                question,
                surveys;
            
            for (questionId in Moss.model.surveySchema) {
                if (Moss.model.surveySchema.hasOwnProperty(questionId)) {
                    question = Moss.model.surveySchema[questionId];//SO_INFO, SO_INFO.data_collector, SPS_01 ecc...       
                    Moss.fn._addQuestion(question, questions, ids, surveyToCsv, cnt);
                }
            }

            cnt = 1;
            list.push(ids);
            list.push(surveyToCsv);
            //load the answers from the surveys
            surveys = [];
            if ($.isArray(data)) {
                surveys = data;
            } else {
                surveys.push(data);
            }

            Moss.fn.extractAnswers(surveys, list, questions);
            Moss.fn.downloadCSV(Moss.fn.dataToCsv(list, '"', ','), "FULL");
        });
    };
    
    Moss.fn._addQuestion = function (question, questions, ids, surveyToCsv, cnt) {
        
        if (question.type === "question" && question.scoring) {
            questions.push(question.id + "._scoring.score_calculated");
            surveyToCsv[question.id + "._scoring.score_calculated"] = Moss.fn.string("@_academic_scoring");
            ids[question.id + "._scoring.score_calculated"] = question.id + "._scoring.score_calculated";
            cnt++;

            questions.push(question.id + "._scoring.score_adequacy");
            surveyToCsv[question.id + "._scoring.score_adequacy"] = Moss.fn.string("@AQS");
            ids[question.id + "._scoring.score_adequacy"] = question.id + "._scoring.score_adequacy";
            cnt++;

            questions.push(question.id + "._scoring.score_importance");
            surveyToCsv[question.id + "._scoring.score_importance"] = Moss.fn.string("@AIS");
            ids[question.id + "._scoring.score_importance"] = question.id + "._scoring.score_importance";
            cnt++;

            questions.push(question.id + "._scoring.score_final");
            surveyToCsv[question.id + "._scoring.score_final"] = Moss.fn.string("@score_final");
            ids[question.id + "._scoring.score_final"] = question.id + "._scoring.score_final";
            cnt++;
        } else if (question.type !== "question" && question.type !== "label" && question.type !== "adequacy-importance"
                && question.type !== "int_and_textarea"  && question.type !== "button"  && question.type !== "gps"
                && question.type !== "grid" && question.type !== "section" && question.type !== "html") {

            questions.push(question.id);
            ids[question.id] = question.id;

            if (question.label) {
                surveyToCsv[question.id] = Moss.fn.string(question.label);
            } else if (question.columnLabel) {
                surveyToCsv[question.id] = Moss.fn.string(question.columnLabel);
            } else if (question.id && question.id.indexOf(".comment") > -1) {
                surveyToCsv[question.id] = Moss.fn.string("_comments");
            } else {
                surveyToCsv[question.id] = question.id;
            }
            cnt++;
        }
    };
    
    Moss.fn.extractAnswers = function (surveys, list, questions) {
        var index,
            cnt,
            survey,
            surveyToCsv = {},
            key,
            sectionAndQuestionId,
            sectionId,
            questionId,
            scoreId,
            a;
        
        for (index in surveys) {
            if (surveys.hasOwnProperty(index)) {
                cnt = 1;
                survey = surveys[index];
                surveyToCsv = {};
                for (key in questions) {
                    if (questions.hasOwnProperty(key)) {
                        sectionAndQuestionId = questions[key];
                        if (!sectionAndQuestionId) {
                            console.log(" key " + key + " is undefined");
                        }
                        sectionId = sectionAndQuestionId.split(".")[0];
                        questionId = sectionAndQuestionId.split(".")[1];
                        scoreId = sectionAndQuestionId.split(".")[2];
                        a = null;
                        if (survey.json) {
                            a = survey.json.answers[sectionId];
                        } else {
                            a = survey.answers[sectionId];
                        }
                        if (a) {
                            if (scoreId) {
                                if (a[sectionId + "." + questionId] && a[sectionId + "." + questionId].hasOwnProperty(scoreId)) {
                                    surveyToCsv[sectionAndQuestionId] = a[sectionId + "." + questionId][scoreId];
                                } else {
                                    surveyToCsv[sectionAndQuestionId]  = '';
                                }

                            } else {
                                if (a.hasOwnProperty(sectionAndQuestionId)) {
                                    surveyToCsv[sectionAndQuestionId] = a[sectionAndQuestionId];
                                } else {
                                    surveyToCsv[sectionAndQuestionId]  = '';
                                }
                            }

                        } else {
                            surveyToCsv[sectionAndQuestionId]  = '';
                        }
                        cnt++;
                    }
                }
                list.push(surveyToCsv);
            }
        }
    };
    
    Moss.fn.dataToCsv = function (strData, strDelimiter, separator) {
        var csvContent = "", dataString, i, j, value;

        if (!strDelimiter) {
            strDelimiter = '"';
        }
        if (!separator) {
            separator = ',';
        }

       // csvContent = "data:text/csv;charset=utf-8,";
        for (i = 0; i < strData.length; i++) {
            dataString = "";
            for (j in strData[i])  {
                if (strData[i].hasOwnProperty(j)) {
                    value = strData[i][j];
                    if ($.type(value) === "boolean" || $.type(value) === "number") {
                        value = value.toString();
                    }

                    if (value) {
                        if (strDelimiter === '"') {
                            while (value.indexOf('"') >= 0) {
                                value = value.replace('"', "'");
                            }
                        } else if (strDelimiter === "'") {
                            while (value.indexOf("'") >= 0) {
                                value = value.replace("'", '"');
                            }
                        }
                    } else {
                        value = "";
                    }

                    dataString = dataString + strDelimiter + value + strDelimiter;
                    dataString = dataString + separator;
                }
            }
            dataString = dataString.replace(new RegExp(separator + '$'), '');
            csvContent = csvContent + dataString + '\n';
        }
        return csvContent;
    };
                              
    Moss.fn.downloadCSV = function (csvContent, prefix) {
        var suffix = Moss.fn.dateTimeToString(new Date()),
            filename = "SHARP_" + prefix + "_EXPORT_" + suffix + ".csv",
            encodedUri,
            link;       
        if (window && window.resolveLocalFileSystemURI) {
            //alert("seeeeee1");
            window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function (fileSystem) {                   
                    fileSystem.root.getFile("download/" + filename, {create: true, exclusive: false},
                        function gotFileEntry(fileEntry) {                        
                            fileEntry.createWriter(function gotFileWriter(writer) {
                                //alert("createWriter");
                                writer.onwriteend = function (evt) {/*alert("writeend")*/};
                                writer.write(csvContent);
                                Moss.ui.notify(Moss.fn.string("@_file_export_completed") + "\n( Download/" + filename + ")");
                            },
                                function (err) {Moss.ui.notifyError("Error saving file (createWriter) " + err.message); });
                        },
                        function (err) {Moss.ui.notifyError("Error saving file (getFile)" + JSON.stringify(err.message)); }
                        );
                },
                function (err) {Moss.ui.notifyError("Error saving file (requestFileSystem)" + err.message); }
            );
        } else {
            csvContent = "data:text/csv;charset=utf-8," + csvContent;
            encodedUri = encodeURI(csvContent);
      
            link = document.createElement("a");
            link.id =  "_downloadedFile";
            if (link.download !== undefined) {
                link.href = encodedUri;
                link.download =   filename;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
            } else {
                window.open(encodedUri);
            }
        }
    };
    
    
    /*
        GeoFunctions
    */
    
 /*   Moss.fn.loadGeoJSON = function () {
         Moss.fn.getJSON("./surveys/geo.json", function (data) {            
            Moss.geo = data;
            Moss.fn.log(Moss.geo);
        });  
    };
    
    //TODO MANAGE PREIOUS ENTERED DATA AND OTHER COUNTIRES
    Moss.fn.countryChange = function () {
        Moss.fn.log($("#country").val());
         $('#region').find('option').remove().end().append('<option value=""> </option>');
         $('#county').find('option').remove();
         $('#district').find('option').remove();
         $('#village').find('option').remove();       
        Moss.fn.loadRegions($('#region'),$("#country").val() );
                
    }
    Moss.fn.loadRegions = function (target, value) {
        Moss.fn.log("loading  with value " + value);
        if (Moss.geo.countries[value]) {
            for(var region in Moss.geo.countries[value].regions) {
                 Moss.fn.log(Moss.geo.countries[value].regions[region])
                $(target).append('<option value="'+region+'">@'+region+'</option>');                    
             }  
        }
    }
    Moss.fn.regionChange = function () {
        //Moss.fn.log($("#state").val());
        Moss.fn.log($('#region').val());
        $('#county').find('option').remove().end().append('<option value=""> </option>');                
        $('#district').find('option').remove();
        $('#village').find('option').remove();
        if (Moss.geo.countries[$('#country').val()].regions[$("#region").val()]) {
            for(var county in Moss.geo.countries[$('#country').val()].regions[$("#region").val()].counties) {                    
                $('#county').append('<option value="'+county+'">@'+county+'</option>');                    
            }       
        }
    }
    Moss.fn.countyChange = function () {
        Moss.fn.log($("#county").val());
        Moss.fn.log($('#county').val());
        $('#district').find('option').remove().end().append('<option value=""> </option>');                                 
        $('#village').find('option').remove();          
        if (Moss.geo.countries[$('#country').val()].regions[$("#region").val()].counties[$("#county").val()]) {
            for(var district in Moss.geo.countries[$('#country').val()].regions[$("#region").val()].counties[$("#county").val()].districts) {                    
                $('#district').append('<option value="'+district+'">@'+district+'</option>');                    
            }  
        }
    }
    Moss.fn.districtChange = function () {
        Moss.fn.log($("#district").val());
        //Moss.fn.log($('#payam').val());
        $('#village').find('option').remove().end().append('<option value=""> </option>');
        if (Moss.geo.countries[$('#country').val()].states[$("#state").val()].counties[$("#county").val()].districts[$("#district").val()]) {
            for(var village in Moss.geo.countries[$('#country').val()].states[$("#state").val()].counties[$("#county").val()].districts[$("#district").val()].villages) {                    
                $('#village').append('<option value="'+village+'">@'+village+'</option>');                    
            }  
        }
    }
    Moss.fn.villageChange = function () {
        Moss.fn.log($("#village").val());
    }
    */
    
    Moss.fn.bluetooth = function () {
        $.mobile.pageContainer.pagecontainer("change", "bluetooth.html", {
            allowSamePageTransition : true,
            transition : "fade"
        });
    };
    
    
    Moss.fn.bluetooth_start = function () {
        if (ble) {                    
            ble.isEnabled(
                function () {
                    // Bluetooth is enabled
                    console.log('bluetooth enabled, going to scan for devices...');
                    Moss.fn.bluetooth_scan();                
                },
                function () {
                     // Bluetooth not yet enabled so we try to enable it
                    ble.enable(
                        function () {
                            // bluetooth now enabled
                            Moss.fn.bluetooth_scan();
                        },
                        function (err) {
                            alert('Cannot enable bluetooth');
                        }
                    );
                }
            );
        } else {
            alert("bluetooth not available");
            return;
        }
    };
    
    Moss.fn.bluetooth_scan = function () {
        console.log('starting scan...');
        
        ble.startScan(
            [],
            function (device) {
                console.log("device found " + JSON.stringify(device) + " - " + device.id);
                //scanned worke, a device was found
                Moss.devices.push(device);
            },
            function (err) {
                console.log('Scanning failed. Please try again.');
            }
        );
        
        setTimeout(
            ble.stopScan,
            5000,
            function () {
                // Stopping scan success
                console.log("devices found: ", Moss.devices);
                var tableBluetooth = $("#bluetooth-list-table").DataTable({
                    retrieve: true,
                    //responsive: true,
                    language: Moss.shared.baseDictionary["dataTable@" + Moss.settings.language],
                    paging: false,
                    searching: false,
                    columns: [
                        {
                            data: "id",
                            "class": "connect-control"
                        },
                        {
							"data": "name",
							"render": function( data, type, full, meta) {
								var value = "";
								if (data != null) {
									value = data;
								}
								return value;
							}
						},
                        {
                            "class": "connect-control",
                            orderable: false,
                            data: null,
                            defaultContent: '<span class="ui-icon-transferthick-e-w ui-btn-icon-left " style="position:relative;" />'
                        }                        
                    ]
                });
            
            
                $("#bluetooth-list-table").off().on("click", "td", function () {
                    var cell = $(this),
                        tr = cell.closest('tr'),
                        row = tableBluetooth.row(tr),
                        id = row.data().id;

                    if (cell.hasClass("connect-control")) {
                        console.log("connect to device" + row.data().id + " ");
                        Moss.fn.bluetooth_connect(row.data().id);
                    }
                });
                
                var dt = $("#bluetooth-list-table").dataTable().api();
                console.log("datatable", dt);
                dt.clear();
                dt.rows.add(Moss.devices).draw();                                          
                console.log("devices added to table");                                
            },
            function () {
             // Stopping scan failed
            }
        );
    };
    
    Moss.fn.bluetooth_connect = function (deviceId) {
        ble.connect(
            deviceId,
            function (res) {
                //connected to device...
                console.log(" connected to device  " + deviceId + " the result is ", res);
            },
            function (err) {
                console.log("Something went wrong while trying to connect to device " + deviceId + ". Please try again");
            }
        );
    };
    
    
    /*
    *****************************
    *        Services           *
    *****************************
    */

    Moss.svc.initDatabase = function () {
        Moss.svc.db = $.WebSQL('sharp');
        Moss.svc.db.query(
            'CREATE TABLE IF NOT EXISTS moss_supergroup (id, name UNIQUE, PRIMARY KEY(id));',
            'CREATE TABLE IF NOT EXISTS moss_group (id, creation_dt, last_mod_dt, last_sent_dt, supergroup_id, group_name, group_size int, completion_perc int, json, PRIMARY KEY(id));',
            'CREATE TABLE IF NOT EXISTS moss_survey (id, group_id,  json, PRIMARY KEY(id));',
            'CREATE TABLE IF NOT EXISTS moss_dictionary (id, creation_dt, last_mod_dt, json, PRIMARY KEY(id));',
            'CREATE TABLE IF NOT EXISTS moss_person (id, pid UNIQUE, creation_dt, last_modifier, last_mod_dt, lastname, firstname, supergroup_id, country_id, PRIMARY KEY(id));',
            'CREATE TABLE IF NOT EXISTS moss_attendance_report (id, creation_dt, last_modifier, last_mod_dt, start_date, end_date, description, supergroup_id, json, PRIMARY KEY(id));'
            
        ).fail(function (tx, err) {
            throw new Error(err.message);
        }).done(function () {
        });
    };
    
    Moss.svc.saveNewSuperGroup = function (superGroup) {
        return Moss.svc.db.query(
            'INSERT INTO moss_supergroup (id, name) VALUES (?,?)',
            [
                superGroup.id || Moss.fn.generateId({digits: 4, prefix: "S"}),
                superGroup.name
            ]
        );
    };
    
    Moss.svc.updateSuperGroup = function (superGroup) {
        return Moss.svc.db.query(
            'UPDATE moss_supergroup SET name=? WHERE id=?',
            [
                superGroup.name,
                superGroup.id
            ]
        );
    };

    Moss.svc.deleteSuperGroup = function (id, ok, err) {
        Moss.svc.db.rawTx(function (tx) {
            tx.executeSql('DELETE FROM moss_supergroup WHERE id=? AND NOT EXISTS ' +
                          '(SELECT * FROM moss_group WHERE supergroup_id=?)', [id, id], function (tx, res) {
                    ok(res);
                }, function (tx, err) {
                    err(err.message);
                });
        });
    };
    
    
    Moss.svc.findAllSuperGroups = function (callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT * FROM moss_supergroup ORDER BY UPPER(name)',
            []
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.name = row.name;
            }
            Moss.shared.supergroups = list;
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    Moss.svc.findSuperGroup = function (id) {
        return Moss.svc.db.query(
            'SELECT * FROM moss_supergroup WHERE id= ?',
            [id]
        );
    };

    Moss.svc.findSuperGroupIdByIdGroup = function (idGroup, callback) {
        Moss.svc.db.query(
            'SELECT g.supergroup_id FROM moss_group AS g where g.id = ? ',
            [idGroup]
        ).done(function (row) {
            var  superGroupId;
            if (row && row.length === 1) {
                superGroupId = row[0].supergroup_id;
            }
            if (callback) {
                callback(superGroupId);
            }
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.findOtherGroups = function (currentGroupId, currentSuperGroupId) {
        return Moss.svc.db.query(
            'SELECT * FROM moss_group WHERE id!=? AND supergroup_id=? ORDER BY group_name',
            [
                currentGroupId,
                currentSuperGroupId
            ]
        );
    };
    
    Moss.svc.createGroup = function (model) {
        if (!model) {
            model = Moss.model;
        }
        return Moss.svc.db.query(
            'INSERT INTO moss_group (id, creation_dt, supergroup_id, group_name, group_size, completion_perc, json) VALUES (?,?,?,?,?,?,?)',
            [
                model.groupId,
                Moss.fn.dateToString(new Date(), true),
                model.superGroupId,
                model.groupName,
                model.surveys.length,
                0,
                Moss.svc.serializeMoss(model)
            ]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.updateGroup = function (group) {
        return Moss.svc.db.query('UPDATE moss_group SET last_mod_dt=?, supergroup_id=?, group_name=?, group_size=?, completion_perc=?, json=? WHERE id=?;',
            [
                Moss.fn.dateToString(new Date(), true),
                group.superGroupId,
                group.groupName,
                group.numberOfSurveys,
                group.completionPercentage,
                Moss.svc.serializeMoss(group),
                group.id
            ]
            ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    
    Moss.svc.updateGroupSchema = function (group) {
        return Moss.svc.db.query('UPDATE moss_group SET last_mod_dt=?, supergroup_id=?, group_name=?, group_size=?, completion_perc=?, json=? WHERE id=?;',
            [
                Moss.fn.dateToString(new Date(), true),
                group.superGroupId,
                group.groupName,
                group.numberOfSurveys,
                group.completionPercentage,
                JSON.stringify(group.json),
                group.id
            ]
            ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.deleteGroup = function (groupId) {
        Moss.svc.db.query(
            'DELETE FROM moss_group WHERE id=?',
            [groupId],
            'DELETE FROM moss_survey WHERE group_id=?',
            [groupId]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    Moss.svc.saveGroupAndSurveys = function () {
        var i = 0,
            j = 0,
            valid = 0,
            completion_perc = 0,
            total_required = 0,
            qstatus;

        for (i = 0; i < Moss.model.surveys.length; i++) {
            Moss.model.surveys[i].completed = 0;
            Moss.model.surveys[i].total_required = 0;
        }
        
        for (i = 0; i < Moss.model.survey.questions.length; i++) {
            if (Moss.model.survey.questions[i].required) {
                for (j = 0; j < Moss.model.surveys.length; j++) {
                    qstatus = Moss.fn.questionStatus(i, j);
                    if (qstatus === 3) {
                        continue;
                    }
                    if (qstatus === 2) {
                        Moss.model.surveys[j].completed++;
                        valid++;
                    }
                    Moss.model.surveys[j].total_required++;
                    total_required++;
                }
            }
        }
        
        Moss.model.completed_surveys = 0;
        for (i = 0; i < Moss.model.surveys.length; i++) {
            if (Moss.model.surveys[i].completed >= Moss.model.surveys[i].total_required) {
                Moss.model.completed_surveys++;
            }
        }
        
        if (total_required > 0 && Moss.model.surveys.length > 0) {
            completion_perc = ((valid / (Moss.model.surveys.length)) / total_required) * 100;
            completion_perc = parseFloat(completion_perc.toFixed(1));
        }
        Moss.model.completion_perc = completion_perc;

        Moss.svc.db.query(
            'UPDATE moss_group SET last_mod_dt=?, supergroup_id=?, group_name=?, group_size=?, completion_perc=?, json=? WHERE id=?;',
            [
                Moss.fn.dateToString(new Date(), true),
                Moss.model.superGroupId,
                Moss.model.groupName,
                Moss.model.surveys.length,
                completion_perc,
                Moss.svc.serializeMoss(Moss.model),
                Moss.model.groupId
            ],
            'INSERT OR REPLACE INTO moss_survey (id, group_id, json) VALUES (?,?,?);',
            [
                Moss.model.surveys[Moss.model.currentSurveyIdx].id,
                Moss.model.groupId,
                JSON.stringify(Moss.fn.currentSurvey())
            ]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.updateSurvey = function (id, groupId, json) {
        return Moss.svc.db.query(
            'UPDATE moss_survey set json = ? WHERE id = ? ;',
            [
                JSON.stringify(json),
                id
            ]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.updateSurveyGroup = function (surveyId, newGroupId) {
        return Moss.svc.db.query(
            'UPDATE moss_survey SET group_id=? WHERE id=?;',
            [
                newGroupId,
                surveyId
            ]
        );
    };
    Moss.svc.addSurveyToGroupJson = function (groupId, surveyId, callback) {
        Moss.svc.db.query(
            'SELECT json FROM moss_group WHERE id=?',
            [groupId]
        ).done(function (rows) {
            var json = rows[0].json,
                obj = JSON.parse(json),
                surveys,
                i;
            surveys = obj.surveys || [];
            for (i = 0; i < surveys.length; i++) {
                if (surveys[i] === surveyId) {
                    return;
                }
            }
            surveys[surveys.length] = surveyId;
            Moss.svc.db.query(
                'UPDATE moss_group SET json=?, group_size=? WHERE id=?',
                [
                    JSON.stringify(obj),
                    surveys.length,
                    groupId
                ]
            ).done(function () {
                if (callback) {
                    callback();
                }
            });
        });
    };
    
    Moss.svc.findAllGroups = function (callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT g.*,sg.name AS supergroup_name, json FROM moss_group g LEFT JOIN moss_supergroup sg ON (g.supergroup_id=sg.id) ORDER BY creation_dt DESC',
            []
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.creationDate = row.creation_dt;
                item.superGroupId = row.supergroup_id;
                item.superGroupName = row.supergroup_name;
                item.groupName = row.group_name;
                item.numberOfSurveys = row.group_size;
                item.lastModDate = row.last_mod_dt;
                item.sentDate = row.last_sent_dt;
                item.completionPercentage = row.completion_perc;
                item.json = row.json;
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
            
    Moss.svc.findAllSurveys = function (callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT s.* FROM moss_survey s ',
            []
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.groupId = row.group_id;
                item.json = JSON.parse(row.json);
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.findAllSurveysByGroupId = function (group, callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT s.* FROM moss_survey s where group_id=?',
            [group.id]
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.groupId = row.group_id;
                item.json = JSON.parse(row.json);
            }
            callback(group, list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.findSurveys = function () {
        
        return Moss.svc.db.query(
            'SELECT s.* FROM moss_survey s ',
            []
        );
    };
    
    Moss.svc.load = function (groupId, callback) {
        Moss.svc.loadGroup(groupId, function (group) {
            Moss.svc.resolveSurveys(group, callback);
        });
    };
    

    Moss.svc.loadGroup = function (groupId, callback) {
        Moss.svc.db.query(
            'SELECT id,json FROM moss_group WHERE id=?',
            [groupId]
        ).done(function (rows) {
            if (rows.length === 0) {
                throw new Error("Group not found: " + groupId);
            }
            var group = JSON.parse(rows[0].json);
            group.id = rows[0].id;
            callback(group);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.loadGroupForPictures = function (groupId, reqCounter, callback) {
        Moss.svc.db.query(
            'SELECT id,json FROM moss_group WHERE id=?',
            [groupId]
        ).done(function (rows) {
            if (rows.length === 0) {
                throw new Error("Group not found: " + groupId);
            }
            var group = JSON.parse(rows[0].json);
            group.id = rows[0].id;
            callback(group, reqCounter);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.resolveSurveys = function (group, callback) {
        Moss.svc.db.query(
            'SELECT json FROM moss_survey WHERE group_id=?',
            [group.id]
        ).done(function (rows) {
            var i,
                survey,
                map = {},
                _s;
            if (rows.length === 0) {
                for (i = 0; i < group.surveys.length; i++) {
                    group.surveys[i] = {id: group.surveys[i], visible: true, answers: {}};
                }
                callback(group);
                return;
            }
            for (i = 0; i < rows.length; i++) {
                survey = JSON.parse(rows[i].json);
                map[survey.id] = survey;
            }
            for (i = 0; i < group.surveys.length; i++) {
                _s = map[group.surveys[i]];
                if (_s) {
                    group.surveys[i] = _s;
                } else {
                    group.surveys[i] = {id: group.surveys[i], visible: true, answers: {}};
                }
            }
            callback(group);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.serializeMoss = function (model) {
        if (!model) {
            model = Moss.model;
        }
        var json = {}, i;
        json.templateVersion = model.templateVersion;
        json.groupId = model.groupId;
        json.superGroupId = model.superGroupId;
        json.groupName = model.groupName;
        json.comments = model.comments;
        json.pictures = model.pictures;
        json.completedSurveys = model.completed_surveys;
        json.completionPerc = model.completion_perc;

        json.surveys = [];
        for (i = 0; i < model.surveys.length; i++) {
            json.surveys[i] = model.surveys[i].id;
        }
        json.groupSize = json.surveys.length;
        //Moss.fn.log("serializing moss... " + JSON.stringify(json));
        return JSON.stringify(json);
    };
    
    Moss.svc.updateDateSent = function () {
        return Moss.svc.db.query(
            'UPDATE moss_group SET last_sent_dt=?',
            [Moss.fn.dateToString(new Date(), true)]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.deleteSurvey = function (surveyId) {
        Moss.svc.db.query(
            'DELETE FROM moss_survey WHERE id=?',
            [surveyId]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    
    Moss.svc.dropAll = function () {
        Moss.svc.db.query(
            'DROP TABLE moss_survey;',
            'DROP TABLE moss_group;',
            'DROP TABLE moss_supergroup;',
            'DROP TABLE moss_dictionary;',
            'DROP TABLE moss_attendance_report;',
            'DROP TABLE moss_person;'
            
        );
        Moss.svc.initDatabase();
    };

    Moss.svc.dropAllSurveys = function () {
        return Moss.svc.db.query(
            'DROP TABLE moss_survey;',
            'DROP TABLE moss_group;'
        ).done(function () {
            Moss.svc.initDatabase();
        });
    };

    Moss.svc.insertOrUpdateDictionary = function (id, json, override) {
        
        Moss.svc.db.query(
            'SELECT id FROM moss_dictionary WHERE id=?',
            [id]
        ).done(function (rows) {
            if (rows.length === 0) {
                return Moss.svc.db.query(
                    'INSERT INTO moss_dictionary (id, creation_dt, json) VALUES (?,?,?)',
                    [
                        id,
                        new Date(),
                        JSON.stringify(json)
                    ]
                ).fail(function (tx, err) {
                    throw new Error(err.message);
                });
            } else if (override) {
                return Moss.svc.db.query(
                    'UPDATE moss_dictionary SET last_mod_dt=?, json=? WHERE id=?',
                    [
                        new Date(),
                        JSON.stringify(json),
                        id
                    ]
                ).fail(function (tx, err) {
                    throw new Error(err.message);
                });
            }
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.deleteDictionary = function (dictionaryId) {
        Moss.svc.db.query(
            'DELETE FROM moss_dictionary WHERE id=?',
            [dictionaryId]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    
    //persons

    
    Moss.svc.saveNewPerson = function (person) {
        return Moss.svc.db.query(
            'INSERT INTO moss_person (id, pid, creation_dt, last_modifier, last_mod_dt, lastname, firstname, country_id, supergroup_id) VALUES (?,?,?,?,?,?,?,?,?)',
            [
                person.id || Moss.fn.generateId({digits: 6, prefix: "P"}),
                person.pid || Moss.fn.generateId({digits: 6, prefix: "PID"}),
                Moss.fn.dateToString(new Date(), true),
                Moss.settings.userId,
                Moss.fn.dateToString(new Date(), true),
                person.lastname,
                person.firstname,
                person.country,
                person.ffs
            ]
        );
    };
    
   
    //... sort of private method ... :-)
    Moss.svc.updatePerson = function (person) {
        return Moss.svc.db.query(
            'UPDATE moss_person SET  pid=?, last_modifier=?, last_mod_dt=?, lastname=?, firstname=?, country_id=?, supergroup_id=? WHERE id=?',
            [
                person.pid,
                Moss.settings.userId,
                Moss.fn.dateToString(new Date(), true),
                person.lastname,
                person.firstname,
                person.country,
                person.ffs,
                person.id
            ]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
                                                     
                                                     
    /*Moss.svc.deletePerson = function (id, ok, err) {
        Moss.svc.db.rawTx(function (tx) {
            tx.executeSql('DELETE FROM moss_person WHERE id=? )', [id], function (tx, res) {
                    ok(res);
                }, function (tx, err) {
                    err(err.message);
                });
        });
    };*/
    
    Moss.svc.deletePerson = function (id) {
        Moss.svc.db.rawTx(function (tx) {
            tx.executeSql('SELECT json FROM moss_survey ', [], function (tx, resultset) {
                var len = resultset.rows.length,
                    item,
                    row,
                    i,
                    survey;
                
                for (i = 0; i < len; i++) {
                    survey = JSON.parse(resultset.rows[i].json);
                    if (survey.answers.S0_INFO['S0_INFO.id_of_respondent'] === id) {
                        //Moss.fn.log("person " + id + " used in survey " + resultset.rows[i].id);                        
                        Moss.ui.showPopupMessage(
                            {
                                title: Moss.fn.string('@_warning'),
                                message: Moss.fn.string('@_unable_delete_person')
                            }
                        );
                        return;
                    }
                }
                tx.executeSql('DELETE FROM moss_person WHERE id=? ', [id], function (tx, res) {
                    //ok(res);
                    Moss.ui.notify(Moss.fn.string("@_record_deleted"));
                    Moss.fn.loadPersonsDataTable();
                }, function (tx, err) {
                    err(err.message);
                });
            }, function (tx, err) {
                err(err.message);
            });
        });
    };

    Moss.svc.deleteSuperGroup = function (id, ok, err) {
        Moss.svc.db.rawTx(function (tx) {
            tx.executeSql('DELETE FROM moss_supergroup WHERE id=? AND NOT EXISTS ' +
                          '(SELECT * FROM moss_group WHERE supergroup_id=?)', [id, id], function (tx, res) {
                    ok(res);
                }, function (tx, err) {
                    err(err.message);
                });
        });
    };
    
    Moss.svc.findAllPersons = function (callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT * FROM moss_person ORDER BY lastname, firstname',
            []
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.lastname = row.lastname;
                item.firstname = row.firstname;
                item.country = row.country_id;
                item.ffs = row.supergroup_id;
                item.id = row.id;
                item.pid = row.pid;
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    Moss.svc.findAllPersonsByFFS = function (ffs, callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT * FROM moss_person WHERE supergroup_id=? ORDER BY lastname, firstname',
            [ffs]
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.lastname = row.lastname;
                item.firstname = row.firstname;
                item.country = row.country;
                item.ffs = row.supergroup_id;
                item.pid = row.pid;
                item.id = row.id;
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.findPerson = function (id) {
        return Moss.svc.db.query(
            'SELECT * FROM moss_person WHERE id=?',
            [id]
        );
    };
    
    Moss.svc.findPersonByPID = function (pid) {
        return Moss.svc.db.query(
            'SELECT * FROM moss_person WHERE pid=?',
            [pid]
        );
    };
    //attendance report
    
    //id, creation_dt, last_mod_dt, start_date, end_date, description, json
    Moss.svc.saveNewAttendanceReport = function (attendanceReport) {
        if (!attendanceReport.id) {
            attendanceReport.id = Moss.fn.generateId({digits: 6, prefix: "A"});
        }
        attendanceReport.startDate = Moss.fn.dateToString(attendanceReport.startDate, false);
        attendanceReport.endDate = Moss.fn.dateToString(attendanceReport.endDate, false);
        return Moss.svc.db.query(
           
            'INSERT INTO moss_attendance_report (id, creation_dt, last_modifier, last_mod_dt, start_date, end_date, description, supergroup_id, json) VALUES (?,?,?,?,?,?,?,?,?)',
            [
                attendanceReport.id,
                Moss.fn.dateToString(new Date(), true),
                Moss.settings.userId,
                Moss.fn.dateToString(new Date(), true),
                attendanceReport.startDate,
                attendanceReport.endDate,
                attendanceReport.description,
                attendanceReport.ffs.id,
                JSON.stringify(attendanceReport)
            ]
        ).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    Moss.svc.updateAttendanceReport = function (attendanceReport) {
        attendanceReport.startDate = Moss.fn.dateToString(attendanceReport.startDate, false);
        attendanceReport.endDate = Moss.fn.dateToString(attendanceReport.endDate, false);
        return Moss.svc.db.query(
            'UPDATE moss_attendance_report SET last_modifier=?, last_mod_dt=?, start_date=?, end_date=?, description=?, supergroup_id=?, json=? WHERE id=?',
            [
                Moss.settings.userId,
                Moss.fn.dateToString(new Date(), true),
                attendanceReport.startDate,
                attendanceReport.endDate,
                attendanceReport.description,
                attendanceReport.ffs.id,
                JSON.stringify(attendanceReport),
                attendanceReport.id
            ]
        );
    };

    Moss.svc.deleteAttendanceReport = function (id, success, fail) {
        Moss.svc.db.rawTx(function (tx) {
            tx.executeSql('DELETE FROM moss_attendance_report WHERE id=? ', [id], function (tx, res) {
                success(res);
            }, function (tx, err) {
                fail(err.message);
            });
        });
    };

    
    Moss.svc.findAllAttendanceReports = function (callback) {
        var list = [];
        Moss.svc.db.query(
            'SELECT * FROM moss_attendance_report ORDER BY start_date',
            []
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.creationDate = row.lastname;
                item.lastModDate = row.firstname;
                item.startDate = row.country;
                item.endDate = row.supergroup_id;
                item.description = row.description;
                item.ffs = row.supergroup_id;
                item.json = JSON.parse(row.json);
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    Moss.svc.searchAttendanceReports = function (params, callback) {
        var list = [],
            sql = " SELECT * FROM moss_attendance_report ",
            where = "",
            qp = [];
        
        //  'INSERT INTO moss_attendance_report (id, creation_dt, last_mod_dt, start_date, end_date, description, json) VALUES (?,?,?,?,?,?,?)',
        if (params) {
            if (params.ffs) {
                where += " AND supergroup_id=?";
                qp.push(params.ffs);
            }
            if (params.startDate) {
                where += " AND start_date=?";
                qp.push(Moss.fn.dateToString(params.startDate, false));
            }
            if (params.endDate) {
                where += " AND end_date=?";
                qp.push(Moss.fn.dateToString(params.endDate, false));
            }
            if (where.length > 4) {
                where = where.substr(4);
                where = " WHERE " + where;
            }
            
        }
        
        Moss.svc.db.query(
            
            sql + where,
            qp
        ).done(function (rows) {
            var len = rows.length,
                item,
                row,
                i;
            for (i = 0; i < len; i++) {
                row = rows[i];
                list[i] = {};
                item = list[i];
                item.id = row.id;
                item.creationDate = row.lastname;
                item.lastModDate = row.firstname;
                item.startDate = row.country;
                item.endDate = row.supergroup_id;
                item.description = row.description;
                item.ffs = row.supergroup_id;
                item.json = JSON.parse(row.json);
            }
            callback(list);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };

    
    Moss.svc.findAttendanceReport = function (id, callback) {
        
        Moss.svc.db.query(
            'SELECT * FROM moss_attendance_report WHERE id=?',
            [id]
        ).done(function (rows) {
            if (rows.length === 0) {
                throw new Error(Moss.fn.string('@_areport_not_found') + id);
            }
            var report = JSON.parse(rows[0].json);
            callback(report);
        }).fail(function (tx, err) {
            throw new Error(err.message);
        });
    };
    
    
    
    Moss.svc.updateSettings = function () {
        localStorage.setItem("settings", JSON.stringify(Moss.settings));
    };
        
    
    
    /*
    *****************************
    *           UI              *
    *****************************
    */
    
  /*  Moss.ui.bindOnInputValidateDecimal = function (target) {
        Moss.fn.log(target)
        $(target).off("input").on("input",function (event) {
            Moss.fn.log(event.type)
            alert(event.which)
            $(this).val($(this).val().replace(/[^0-9\.]/g,''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {«
                alert(event.which + " is wrong ")
                event.preventDefault();
            }
        });        
    }
    */
    Moss.ui.validateDecimalInput = function (event) {
        event = event || window.event;
       // alert(event.which)
        //$(event.currentTarget).val($(event.currentTarget).val().replace(/[^0-9\.]/g,''));
        if (!(event.which === 46 || (event.which >= 48 && event.which <= 57))) {
            //alert(event.which + " is wrong ")
            event.preventDefault();
        }
    };
        
    Moss.ui.updateImages = function () {
        $("#img_sharp_header").attr("src", "images/sharp_header_" + Moss.settings.language + ".png");
        //$("#img_fao_logo").attr("src", "images/FAO-logo-" + Moss.settings.language + "-w.png");
    };
    
    Moss.ui.showLoader = function (msgText, timeout) {
        $.mobile.loading('show', {
            text: msgText,
            textVisible: msgText !== undefined,
            theme: 'b'
        });
    };
    
    Moss.ui.hideLoader = function (options) {
        options = options || {};
        if (Moss.loaderHandler !== -1) {
            window.clearTimeout(Moss.loaderHandler);
            Moss.loaderHandler = -1;
        }
        if (options.timeout) {
            Moss.loaderHandler = window.setTimeout(function () {
                Moss.ui.hideLoader({callback: options.callback});
            }, options.timeout);
            return;
        }
        $.mobile.loading("hide");
        if (options.callback) {
            options.callback();
        }
    };
    
    Moss.ui.message = function (options) {
        $("#moss-message").empty();
        Moss.ui.renderWidget("moss-message", "message", options);
    };

    Moss.ui.renderCell = function (cell, grid, row, col) {
        if (cell === null) {
            return "";
        }
        if (typeof cell === "string") {
            return Moss.fn.string(cell);
        }
        if (typeof cell === "object") {
            cell.id = grid.id + "#" + grid.rows[row].id + "#" + grid.cols[col].id;
            if (cell.hideIf) {
                cell = $.extend(false, {}, cell);
            } else if (grid.cols[col].hideIf) {
                cell = $.extend(false, {}, cell);
                cell.hideIf = grid.cols[col].hideIf;
            }
            if (cell.hideIf) {//activities#{{row_id}}#response
                cell.hideIf = cell.hideIf.replace("{{row_id}}", grid.rows[row].id);
            }
            if (cell.hideIf) {
                cell.hideIf = cell.hideIf.replace("{{col_id}}", grid.cols[col].id);
            }
            if (cell.afterRender) {
                eval(cell.afterRender);
            }
            if (!Moss.ui[cell.widget]) {
                console.log(cell);
            }
            return Moss.ui[cell.widget].tpl(cell);
        }
        return "missing widget/text!";
    };

    Moss.ui.renderWidget = function (div, widget, data) {
        var start = new Date().getTime(),
            _fn_after;
        
        if (!Moss.ui[widget]) {
            Moss.ui.renderWidget(div, 'default_wdg', {missing: widget});
            return;
        }
        
        
       // Moss.fn.log("renderWidget: " + widget);
       // Moss.fn.log(data);
        //Moss.fn.log("Rendering widget " + widget + " attached to div " + div + " with data " +JSON.stringify(data));
        $("#" + div).append(Moss.ui[widget].tpl(data));
        //$(Moss.ui[widget].tpl(data)).enhanceWithin();
        _fn_after = Moss.ui[widget].afterRender;
        if (typeof _fn_after !== 'undefined' && typeof _fn_after === 'function') {
            _fn_after(data);
        }
        //Moss.fn.log('Time: Moss.ui.renderWidget: ' + widget +": " + (new Date().getTime()-start));
    };

    Moss.ui.renderQStatusSingle = function (div) {
        $("#" + div).empty();
        Moss.ui.renderWidget(div, "qstatus");
    };

    Moss.ui.toggleOptText = function (option_id) {
        var _textid = option_id + ":text",
            _divid = _textid + '_DIV',
            _w = $(Moss.fn.toId(_textid)),
            _d = $(Moss.fn.toId(_divid));
        _w.val(null);
        _d.toggle();
    };
    
    Moss.ui.resetMulti = function (id, option) {
        if (option.checked === false) {
            return true;
        }
        $("." + id).find("input[type='checkbox']").prop('checked', false).checkboxradio("refresh");
        $("." + id).find("input[type='text']").val("");
        $("." + id).find(".moss-additional-text").hide();
        option.checked = true;
        Moss.fn.fireChange();
        return true;
    };

    Moss.ui.uncheckResetMulti = function (id, option) {
        if (option.checked === false) {
            return true;
        }
        $("." + id).find(".moss-reset-multi").prop('checked', false).checkboxradio("refresh");
        return true;
    };
    
    Moss.ui.onSelectChange = function (select_id, fireChange) {
        Moss.fn.log("select change " + select_id + " fire change: " + fireChange);
        var _select = $(Moss.fn.toId(select_id)),
            _opt = _select.find(':selected'),
            _textid,
            _divid,
            _w,
            _d;
        _textid = select_id + ":text";
        _divid = _textid + '_DIV';
        _w = $(Moss.fn.toId(_textid));
        _d = $(Moss.fn.toId(_divid));
        if (_opt.attr("data-addtext")) {
            _w.attr("placeholder", _opt.text());
            _w.val("");
            _d.show();
        } else {
            if (_d.length) {
                _w.val("");
                _d.hide();
            }
        }
        if (fireChange) {
            Moss.fn.fireChange();
        }
    };
    
    Moss.ui.toggleOptTextRadio = function (radio, wdg_id, addText) {
        var _texts, _textid, _w;
        if (radio.checked && !addText) {
            _texts = $("[data-moss-radiogroup='" + wdg_id + "']");
            _texts.val(null);
            _texts.hide();
            return;
        } else if (radio.checked && addText) {
            _textid = radio.id + ":text";
            _w = $(Moss.fn.toId(_textid));
            _w.show();
        }
        return;
    };

    Moss.ui.notify = function (msg) {
        toastr.options = {
            timeOut: 2000,
            positionClass: "toast-center-center"
        };
        toastr.clear();
        toastr.success(msg);
    };

    Moss.ui.notifyWarning = function (msg) {
        toastr.options = {
            closeButton: true,
            timeOut: 2000,
            positionClass: "toast-center-center"
        };
        toastr.clear();
        toastr.warning(msg);
    };

    Moss.ui.notifyError = function (msg) {
        toastr.options = {
            closeButton: true,
            timeOut: 3000,
            positionClass: "toast-center-center"
        };
        toastr.clear();
        toastr.error(msg);
    };
    
   
    
    Moss.ui.validationDialog = function (msg, callback) {
        $("#message-dialog-content").html(Moss.fn.string(msg));
        Moss.ui.stayOnPage = false;
        var _p = $("#message-dialog");
        _p.popup({
            dismissible: false,
            afterclose: function (event, ui) {
                if (!Moss.ui.stayOnPage) {
                    Moss.ui.showLoader();
                    window.setTimeout(function () {
                        callback();
                    }, 100);
                } else {
                    $("#right-panel").panel("close");
                }
            }
        });
        _p.popup("open");
    };

    Moss.ui.showPopupMessage = function (options) {
        $("#moss-ui-message-dialog").remove();
        var html = Moss.ui.popup.tpl(options),
            _popup;
        $.mobile.activePage.append(html);
        _popup = $("#moss-ui-message-dialog");
        _popup.popup({
            afterclose: function (event, ui) {
                if (options.onConfirm && $(this).data("confirm")) {
                    options.onConfirm();
                }
                $(this).remove();
            }
        });
        _popup.enhanceWithin();
        _popup.popup("open");
    };
    
    Moss.fn.loadDatabase = function () {
        Moss.fn.bindSettings();
        Moss.fn.getJSON(Moss.fn.getEndpoint() + "retrieve-db",
            function (data) {
                var zip = new JSZip(),
                    zt,
                    dbJson;
                //load()
                zip.load(data.payload, {base64: true});
                zt = zip.file("dump.zip");
                dbJson = JSON.parse(zt.asText());
                //Moss.fn.log(dbJson)
                Moss.fn._loadFFSs(dbJson.moss_supergroup.data);
                Moss.fn._loadGroups(dbJson.moss_group.data);
                Moss.fn._loadSurveys(dbJson.moss_survey.data);
                Moss.fn._loadDictionaries(dbJson.moss_dictionary.data);
                if (dbJson.moss_person && dbJson.moss_person.data) {
                    Moss.fn._loadPersons(dbJson.moss_person.data);
                }
                if (dbJson.moss_person && dbJson.moss_attendance_report.data) {
                    Moss.fn._loadAttendanceReports(dbJson.moss_attendance_report.data);
                }
                Moss.fn.loadSG();
                //commented, seems needed only when accessing the survey page 
                // Moss.fn.loadPersons();
                //Moss.fn.log(zt);
                Moss.fn.updateData(true);
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    Moss.ui.notify(Moss.fn.string("@_database_load_completed"));
                }});
                //unzip json.parse check tables exist, load data by type
                //Moss.fn.log("Database updated.");
            },
            function (xhr, textStatus, errorThrown) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    var message = Moss.fn.string("@_database_load_error"),
                        response;
                    if (xhr.responseText) {
                        console.error(xhr.responseText);
                        try {
                            response = JSON.parse(xhr.responseText);
                            if (response.reason) {
                                message = message + ":<br/><br/>" + response.reason;
                            }
                        } catch (error) {
                        }
                    } else {
                        message = message + ". " + Moss.fn.string("@_please_retry");
                    }
                    Moss.ui.notifyError(message);
                }});
            });
    };
    
    
    Moss.fn._loadFFSs = function (data) {
        if (data) {
            var i,
                item;
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT OR REPLACE INTO moss_supergroup (id, name) VALUES (?,?)',
                        [
                            item.id,
                            item.name
                        ]
                    );
                }
            }
        }
    };
    
    Moss.fn._loadGroups = function (data) {
        if (data) {
            var i,
                item;
            
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT OR REPLACE INTO moss_group (id, creation_dt, supergroup_id, group_name, group_size, completion_perc, json) VALUES (?,?,?,?,?,?,?)',
                        [
                            item.id,
                            item.creation_dt,
                            item.supergroup_id,
                            item.group_name,
                            item.group_size,
                            item.completion_perc,
                            item.json
                        ]
                    );
                }
            }
        }
    };
    
    Moss.fn._loadSurveys = function (data) {
        var i,
            item;
        if (data) {
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT OR REPLACE INTO moss_survey (id, group_id, json) VALUES (?,?,?);',
                        [
                            item.id,
                            item.group_id,
                            item.json
                        ]
                    );
                }
            }
        }
    };
    
    Moss.fn._loadDictionaries = function (data) {
        var i,
            item;
        if (data) {
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT INTO moss_dictionary (id, creation_dt, json) VALUES (?,?,?);',
                        [
                            item.id,
                            item.creation_dt,
                            item.json
                        ]
                    );
                }
            }
        }
    };
    
    Moss.fn._loadPersons = function (data) {
        var i,
            item;
        if (data) {
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT OR REPLACE INTO moss_person (id, pid, creation_dt, last_modifier, last_mod_dt, lastname, firstname, country_id, supergroup_id) VALUES (?,?,?,?,?,?,?,?,?);',
                        [
                            item.id,
                            item.pid,
                            item.creation_dt,
                            item.last_modifier,
                            item.last_mod_dt,
                            item.lastname,
                            item.firstname,
                            item.country_id,
                            item.supergroup_id
                        ]
                    );
                }
            }
        }
    };
    
    Moss.fn._loadAttendanceReports = function (data) {
        var i,
            item;
        if (data) {
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    item = data[i];
                    Moss.svc.db.query(
                        'INSERT OR REPLACE INTO moss_attendance_report (id, creation_dt, last_modifier, last_mod_dt, start_date, end_date, description, supergroup_id, json) VALUES (?,?,?,?,?,?,?,?,?);',
                        [
                            item.id,
                            item.creation_dt,
                            item.last_modifier,
                            item.last_mod_dt,
                            item.start_date,
                            item.end_date,
                            item.description,
                            item.supergroup_id,
                            item.json
                        ]
                    );
                }
            }
        }
    };
    
    Moss.init();
    return Moss;

}($, doT, toastr, JSZip));
