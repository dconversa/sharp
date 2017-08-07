/*jslint plusplus: true */
/*jslint evil: true */
/*jslint nomen: true */
/*jslint continue: true, regexp: true */
/*global console, document */
/*global $, Moss */
/*global toastr */

var Sharp = (function ($, Moss, toastr) {
    "use strict";

    var Sharp = {};
    
    Sharp.init = function () {
        Moss.model.cropsQIdx = Moss.fn.questionIndex('S4_PSP_04');
        Moss.model.livestockQIdx = Moss.fn.questionIndex('S4_PSP_05');
    };
    
    Sharp.registerEvents = function () {
        //console.log("Registering SHARP Events...");
    };
        
    
    Sharp.afterRender_S0_INFO = function () {
        //could be removed, needed for a change in the model
        //console.log("Sharp.afterRender_S0_INFO ");
        Moss.fn.loadPersons("#S0_INFO\\.id_of_respondent");
      //  Moss.fn.loadRegions($("#S0_INFO\\.region"),$("[name='S0_INFO\\.country'").val() );
       
    };
    
    Sharp.afterRender_S4_ENV_01 = function () {
        $("#S4_ENV_01\\.water_access\\#1\\#distance").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#2\\#distance").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#3\\#distance").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#4\\#distance").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#5\\#distance").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        
        $("#S4_ENV_01\\.water_access\\#1\\#time_to_walk").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#2\\#time_to_walk").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#3\\#time_to_walk").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#4\\#time_to_walk").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_01\\.water_access\\#5\\#time_to_walk").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
    };
    
    Sharp.afterRender_S4_ENV_04 = function () {
        
        //$("#S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access\\#private_plot").off("input").on("input",Moss.ui.validateDecimalInput);
        //try tap and [aste events. input event does not return event.which or event.keyCode
        $("#S4_ENV_04\\.land_access\\#tot_accessible\\#private_plots").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access#private_plots").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_area_owned\\#private_plots").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_accessible\\#community_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access\\#community_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_area_owned\\#community_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_accessible\\#gov_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access\\#gov_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
        $("#S4_ENV_04\\.land_access\\#tot_area_owned\\#gov_land").off("paste keypress").on("paste keypress", function (event) {Moss.ui.validateDecimalInput(event); });
      //  S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access\\#community_land
      //  S4_ENV_04\\.land_access\\#tot_numb_of_fields_w_access\\#gov_land
    };
    
    Sharp.afterRender_S4_PSP_04 = function () {
        $('#crops').stickyTableHeaders({fixedOffset: $('#header')});
    };
    
    Sharp.afterRender_S4_EC_04 = function () {

        $('#mrkt_acc_selling').stickyTableHeaders({fixedOffset: $('#header')});
    };
    
    
    Sharp.setDefaults_S4_PSP_13 = function () {
        
        var currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx],
            currentQuestion = Moss.fn.currentQuestion(),
            answers = currentSurvey.answers[currentQuestion.id] || {},
            response_checked = false,
            access_checked = false,
            cnt = 0;
        
        $("#wset .response input:checkbox").each(function () {
            var _name = this.name;
            response_checked = this.checked;
            if ($("#wset .access input:radio")[cnt]) {
                access_checked = $("#wset .access input:radio")[cnt].checked;
            }
            
            if (response_checked && !access_checked) {
                $("#wset .elaborate input:text")[cnt].show();
            }
         
            //console.log("response: "+_name+ " checked: "+this.checked)
            cnt++;
        });
    };
    
    
    Sharp.setDefaults_S4_PSP_08 = function () {
        
        var currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx],
            currentQuestion = Moss.fn.currentQuestion(),
            answers = currentSurvey.answers[currentQuestion.id] || {};
        
        $("#wset .crops input:radio[value='no']").each(function () {
            var _name = this.name;
            if (!answers[_name] && Moss.fn.currentSurvey().crops === 'no') {
                this.checked = true;
            }
        });

        $("#wset .livestock input:radio[value='no']").each(function () {
            var _name = this.name;
            if (!answers[_name] && Moss.fn.currentSurvey().livestock === 'no') {
                this.checked = true;
            }
        });

    };
    
    
    
    Sharp.setECDefaults = function () {
        var currentSurvey = Moss.model.surveys[Moss.model.currentSurveyIdx],
            currentQuestion = Moss.fn.currentQuestion(),
            answers = currentSurvey.answers[currentQuestion.id] || {};
        
        if (!currentSurvey.answers.S4_EC_02) {
            currentSurvey.answers.S4_EC_02 = {};
        }
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop1'] = answers['S4_EC_04.mrkt_acc_selling#description#crop1'];
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop2'] = answers['S4_EC_04.mrkt_acc_selling#description#crop2'];
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop3'] = answers['S4_EC_04.mrkt_acc_selling#description#crop3'];
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop4'] = answers['S4_EC_04.mrkt_acc_selling#description#crop4'];
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop5'] = answers['S4_EC_04.mrkt_acc_selling#description#crop5'];
        currentSurvey.answers.S4_EC_02['S4_EC_02.sold_products#description#crop6'] = answers['S4_EC_04.mrkt_acc_selling#description#crop6'];

        
        if (!currentSurvey.answers.S4_EC_05) {
            currentSurvey.answers.S4_EC_05 = {};
        }
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop1#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop1'];
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop2#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop2'];
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop3#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop3'];
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop4#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop4'];
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop5#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop5'];
        currentSurvey.answers.S4_EC_05['S4_EC_05.mrkt_prices#crop6#description'] = answers['S4_EC_04.mrkt_acc_selling#description#crop6'];
        
        if (!currentSurvey.answers.S4_EC_16) {
            currentSurvey.answers.S4_EC_16 = {};
        }
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop1'] = answers['S4_EC_04.mrkt_acc_selling#description#crop1'];
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop2'] = answers['S4_EC_04.mrkt_acc_selling#description#crop2'];
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop3'] = answers['S4_EC_04.mrkt_acc_selling#description#crop3'];
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop4'] = answers['S4_EC_04.mrkt_acc_selling#description#crop4'];
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop5'] = answers['S4_EC_04.mrkt_acc_selling#description#crop5'];
        currentSurvey.answers.S4_EC_16['S4_EC_16.interaction#description#crop6'] = answers['S4_EC_04.mrkt_acc_selling#description#crop6'];
        
        
        console.log(currentSurvey);
    };
    
        
    Sharp.updateRanking_S4_EC_09 = function (source) {
        var id = source.id,
            key = id.substr(id.lastIndexOf(':') + 1);
        if (key === 'not_owned') {
            return;
        }
        $("#mjr_prd_assets").find("input[type=radio][value='" + key + "']").each(function () {
            if (this.id === id) {
                return;
            }
            $(this).prop('checked', false).checkboxradio("refresh");
        });
    };
    
    Sharp.onChangePersonName = function (new_name) {
        $("#S0_INFO.name_of_respondent").val(new_name);
        Moss.fn.currentSurvey().answers.S0_INFO = Moss.fn.currentSurvey().answers.S0_INFO || {};
        Moss.fn.currentSurvey().answers.S0_INFO['S0_INFO.name_of_respondent'] = new_name;
    };
    
    // Scoring
    /*
    2016/12/11 changed the scoring component (current-score.html to display 'no scoring informaion' if there are no scoring components (see psp_05))
    */
    Sharp.calculateScore = function () {
        var answers = Moss.fn.currentSurvey().answers,
            currentAnswers = Moss.fn.currentAnswers(),
            crops = Moss.fn.currentSurvey().crops === 'yes',
            livestock = Moss.fn.currentSurvey().livestock === 'yes';
        if ($.isEmptyObject(currentAnswers)) {
            //TODO check 20160427
            Moss.model.surveys[Moss.model.currentSurveyIdx].answers[Moss.model.cqid] = currentAnswers;
        }
        Sharp._calculateScore(Moss.model.cqid, answers, currentAnswers, crops, livestock);
    };
    /*jslint vars: true */
    Sharp._calculateScore = function (cqid, answers, currentAnswers, crops, livestock) {
        console.log("calculateScore: " + cqid);
       
        var ZERO = 0,
            scoring =
                {
                    score_components: [],
                    number_of_score_components: 0,
                    score_calculated_sum: 0
                },
            academic_scoring =
                {
                    score_components: [],
                    number_of_score_components: 0,
                    score_calculated_sum: 0
                },
            tmp,
            tmp1,
            a,
            b,
            c,
            d,
            e;

       /* if ($.isEmptyObject(currentAnswers)) {
            Moss.model.surveys[Moss.model.currentSurveyIdx].answers[cqid] = currentAnswers;
        }
        */
        
        switch (cqid) {
                
        /*****************        
         *    Household  *
         *****************/
        case 'S4_PSP_01':
            //eth begin
            var people, tmp_40, tmp_50, tmp_70, tmp_71, men_16_65, women_16_65, boys_0_15, girls_0_15, women_66_p, men_66_p;
                
            people = Moss.fn.sum(/^S4_PSP_01\.hh_composition#qty#.*$/, currentAnswers);
                
            // Role of elders
            tmp = ("yes" === currentAnswers['S4_PSP_01.elders_role#role#men'] || "yes" === currentAnswers['S4_PSP_01.elders_role#role#women']) ? 10 : 0;
            Sharp.addScore([scoring, academic_scoring], 'hh_elders_roles', "@DGI", tmp);
            
            
            tmp = currentAnswers['S4_PSP_01.participation'];
            if (tmp !== '_not_applicable') {
                Sharp.addScore([scoring, academic_scoring], 'hh_participation', "@S4_PSP_01_participation_msr", (tmp === 'yes' ? 10 : 0));
            }
            
            tmp = currentAnswers['S4_PSP_01.freedom'];
            if (tmp) {
                if ("choose_free_yes" === tmp) {
                    tmp = 10;
                } else if ("mix_of_both" === tmp) {
                    tmp = 5;
                } else if ("choose_free_no_ok" === tmp) {
                    tmp = 5;
                } else {
                    tmp = 0;
                }
            }
            Sharp.addScore([scoring, academic_scoring], 'hh_freedom', "@S4_PSP_01_freedom_msr", tmp);
            
            
            //work hours  
            //S4_PSP_01.hh_composition#qty#women_16_65
            tmp_40 = 0;
            tmp_50 = 0;
            tmp_70 = 0;
            tmp_71 = 0;
            /* brakes
            Less than 40 =8 
            40-50=10
            50-70=2
            Above 80 = 0
            */
            /*men_16_65 = currentAnswers['S4_PSP_01.hh_composition#qty#men_16_65'];
            if (men_16_65) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_16_65/, 'to_42', currentAnswers) * 10 * men_16_65;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_16_65/, 'from_42_to_50', currentAnswers) * 8 * men_16_65;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_16_65/, 'from_51_to_70', currentAnswers) * 2 * men_16_65;
                tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_16_65/, 'over_71', currentAnswers) * ZERO * men_16_65;
            }
            women_16_65 = currentAnswers['S4_PSP_01.hh_composition#qty#women_16_65'];
            if (women_16_65) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_16_65/, 'to_42', currentAnswers) * 10 * women_16_65;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_16_65/, 'from_42_to_50', currentAnswers) * 8 * women_16_65;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_16_65/, 'from_51_to_70', currentAnswers) * 2 * women_16_65;
                tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_16_65/, 'over_71', currentAnswers) * ZERO * women_16_65;
            }
            boys_0_15 = currentAnswers['S4_PSP_01.hh_composition#qty#boys_0_15'];
            if (boys_0_15) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#boys_0_15/, 'to_42', currentAnswers) * 10 * boys_0_15;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#boys_0_15/, 'from_42_to_50', currentAnswers) * 8 * boys_0_15;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#boys_0_15/, 'from_51_to_70', currentAnswers) * 2 * boys_0_15;
                tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#boys_0_15/, 'over_71', currentAnswers) * ZERO * boys_0_15;
            }
            girls_0_15 = currentAnswers['S4_PSP_01.hh_composition#qty#girls_0_15'];
            if (girls_0_15) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#girls_0_15/, 'to_42', currentAnswers) * 10 * girls_0_15;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#girls_0_15/, 'from_42_to_50', currentAnswers) * 8 * girls_0_15;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#girls_0_15/, 'from_51_to_70', currentAnswers) * 2 * girls_0_15;
                tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#girls_0_15/, 'over_71', currentAnswers) * ZERO * girls_0_15;
            }
            women_66_p = currentAnswers['S4_PSP_01.hh_composition#qty#women_66_p'];
            if (women_66_p) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_66_p/, 'to_42', currentAnswers) * 10 * women_66_p;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_66_p/, 'from_42_to_50', currentAnswers) * 8 * women_66_p;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_66_p/, 'from_51_to_70', currentAnswers) * 2 * women_66_p;
                tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#women_66_p/, 'over_71', currentAnswers) * ZERO * women_66_p;
            }
            men_66_p = currentAnswers['S4_PSP_01.hh_composition#qty#men_66_p'];
            if (men_66_p) {
                tmp_40 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_66_p/, 'to_42', currentAnswers) * 10 * men_66_p;
                tmp_50 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_66_p/, 'from_42_to_50', currentAnswers) * 8 * men_66_p;
                tmp_70 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_66_p/, 'from_51_to_70', currentAnswers) * 2 * men_66_p;
                //tmp_71 += Moss.fn.count(/^S4_PSP_01.hh_roles#work_hours#men_66_p/, 'over_71', currentAnswers) * 0 * men_66_p;
            }
            tmp = (tmp_40 + tmp_50 + tmp_70 + tmp_71) / people;
            */
            tmp = currentAnswers["S4_PSP_01.work_hours"];
            if (tmp) {
                if (tmp === 'to_42') {
                    tmp1 = 10;
                } else if (tmp === 'from_42_to_50') {
                    tmp1 = 8;
                } else if (tmp === 'from_51_to_70') {
                    tmp1 = 2;
                } else if (tmp === 'over_71') {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'hh_work_hours', "@S4_PSP_01_work_hours_msr", tmp1);
            }
            //eth end
            
            // Who is unable to work due to health reasons?  
            tmp = Moss.fn.sum(/^S4_PSP_01\.hh_roles#unable_to_work#.*$/, currentAnswers);
            
            if (people > 0) {
                tmp = (tmp / people);
                Sharp.addScore([scoring, academic_scoring], 'hh_unable', "@V23", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 10},
                    {threshold: 0.1, value: 7},
                    {threshold: 0.2, value: 5},
                    {threshold: 0.3, value: 3},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]));
            }
            // Who has completed primary education?    
            /*tmp = Moss.fn.sum(/^S4_PSP_01\.hh_roles#primary_edu#.*$/, currentAnswers);
            if (people > 0) {
                tmp = (tmp / people) * 10;
                Sharp.addScore([scoring, academic_scoring], 'hh_education', "@MNI", tmp);
            }
            */
                //TODO check if it has to be added to scoring and or academic_scoring!!!!!
            tmp = Moss.fn.sum(/^S4_PSP_01\.hh_roles#primary_edu#.*$/, currentAnswers);
            if (people > 0) {
                tmp = (tmp / people) * 100;
                tmp = tmp / 10;
                Sharp.addScore([scoring, academic_scoring], 'hh_education', "@MNI", tmp);
                /*
                Sharp.addScore([scoring, academic_scoring], 'hh_education', "@MNI", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 10, value: 2.5},
                    {threshold: 50, value: 5},
                    {threshold: 75, value: 7.5},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]));
                */
            }
            // Ratio of girls(0-15) who complete primary education over boys value
            tmp = Moss.fn.sum(/^S4_PSP_01\.hh_roles#primary_edu#girls_0_15$/, currentAnswers);
            tmp1 = Moss.fn.sum(/^S4_PSP_01\.hh_roles#primary_edu#boys_0_15$/, currentAnswers);
            if (tmp1 > 0) {
                tmp = tmp / tmp1;
                if (tmp >= 1) {
                    tmp = 10;
                } else {
                    tmp = (tmp * 10);
                }
                Sharp.addScore([scoring, academic_scoring], 'hh_ratio', "@PK8", tmp);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_01.adeq_imp");
            break;
                
        /************************        
         *    Production types  *
         ************************/
        case 'S4_PSP_02':
            tmp = Moss.fn.count(/^S4_PSP_02\.activities#.*#response$/, 'yes', currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'pt_activities', "@AW2", Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 2, value: 5},
                {threshold: 3, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]));
            tmp = Moss.fn.count(/^S4_PSP_02\.activities#.*#traditional$/, true, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'pt_practices', "@PWB", Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]));
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_02.adeq_imp");
            break;
        
        /***********************        
         *    Aquaculture      *
         ***********************/
        case 'S4_PSP_03':
            
            tmp = Moss.fn.count(/^S4_PSP_03\.details#species#.*$/, undefined, currentAnswers);
            if (tmp > 0) {
                Sharp.addScore([scoring, academic_scoring], 'ac_species', "@CPO", Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            
            tmp1 = Moss.fn.sum(/^S4_PSP_03\.details#breeds_qty#.*$/, currentAnswers);
            if (tmp > 0) {
                //tmp1 = Math.round(tmp1 / tmp);
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'ac_breeds', '@AVG', Sharp.rangeScale(tmp1, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
           //# of different food supplements across species mentioned     
            tmp1 = Moss.fn.countTokenizedText(/^S4_PSP_03\.details#food_suppl_dscr#.*$/, currentAnswers);
            if (tmp > 0) {
                tmp1 = Math.round(tmp1 / tmp);
                Sharp.addScore([scoring, academic_scoring], 'ac_foods', "@K0O", Sharp.rangeScale(tmp1, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 5},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_03.adeq_imp");
            break;
                
        /*****************        
         *    Crops      *
         *****************/
        case 'S4_PSP_04':
            var v1, v2, v3, v4;
            tmp = currentAnswers['S4_PSP_04.growing_perennial_crops'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'cp_growing', "@TPI", (tmp === 'yes' ? 10 : 0));
            }

            tmp = Moss.fn.count(/^S4_PSP_04\.crops#.*#has$/, true, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'cp_species', "@LYA", Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 3, value: 4},
                {threshold: 5, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]));
            
                 
            //count rows that have varieties >1
            
           
            //1) make the varieties like: 1,2,3,4+ 
            //2) score each crops according to the table below
            //3) sum the scores and divide by the number of crops => 
            //4) print out the final score as average of the scores
            v1 = Moss.fn.count(/^S4_PSP_04\.crops.*#varieties$/, "1", currentAnswers);
            v2 = Moss.fn.count(/^S4_PSP_04\.crops.*#varieties$/, "2", currentAnswers);
            v3 = Moss.fn.count(/^S4_PSP_04\.crops.*#varieties$/, "3", currentAnswers);
            v4 = Moss.fn.count(/^S4_PSP_04\.crops.*#varieties$/, "4", currentAnswers);
            tmp1 = v1 + v2 + v3 + v4;
            tmp = ((v1 * ZERO) + (v2 * 4) + (v3 * 8) + (v4 * 10)) / tmp1;
            Sharp.addScore([scoring, academic_scoring], 'cp_has_vars', "@S4_PSP_04_corps_varieties_msr", tmp);
                
            //tmp1 = Moss.fn.sum(/^S4_PSP_04\.crops#.*#varieties$/, currentAnswers);
           /*if (tmp > 0) {
                tmp1 = Math.round(tmp1 / tmp);
               
                Sharp.addScore([scoring, academic_scoring], 'cp_has_vars', "@S4_PSP_04_corps_varieties_msr",  Sharp.addScore([scoring, academic_scoring], 'cp_vars', "@Y0B", Sharp.rangeScale(tmp1, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ])));
            }*/
            
           
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_04.adeq_imp");
            break;
                
        /*****************        
         *    Livestock  *
         *****************/
        case 'S4_PSP_05':
            var i,
                n,
                _N,
                _D,
                app;
            //1= 0, 2= 3, 3= 6, 4=8,5+= 10
            tmp = currentAnswers['S4_PSP_05.animals'];
            if (tmp === 'yes') {
                app = Moss.fn.count(/^S4_PSP_05\.lvst_practices#qty#.*$/, undefined, currentAnswers);
               // tmp = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#qty#.*$/, currentAnswers);
                if (app) {

                    tmp1 = Sharp.rangeScale(app, [
                        {threshold: 1, value: 0},
                        {threshold: 2, value: 3},
                        {threshold: 3, value: 6},
                        {threshold: 4, value: 8},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'ls_practices', Moss.fn.string("@PRU"), tmp1);
                }
                //_N = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#qty#.*$/, currentAnswers);

                //tmp = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#breeds#.*$/, currentAnswers);//Moss.fn.countConditionalValue(/^S4_PSP_05\.lvst_practices#breeds#.*$/, /^0*[2-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$/, currentAnswers);
                //changed oherwise it would count also txt giving nan
               //
                
                /*
                1= 0
                2= 4
                3= 8 
                4+=10
                */
                
                v1 = Moss.fn.count(/^S4_PSP_05\.lvst_practices.*#breeds/, "1", currentAnswers);
                v2 = Moss.fn.count(/^S4_PSP_05\.lvst_practices.*#breeds/, "2", currentAnswers);
                v3 = Moss.fn.count(/^S4_PSP_05\.lvst_practices.*#breeds/, "3", currentAnswers);
                v4 = Moss.fn.count(/^S4_PSP_05\.lvst_practices.*#breeds/, "4", currentAnswers);
                tmp1 = v1 + v2 + v3 + v4;
                tmp = ((v1 * ZERO) + (v2 * 4) + (v3 * 8) + (v4 * 10)) / tmp1;
                
               /* tmp = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#breeds#.*$/, currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 5, value: 3},
                    {threshold: 10, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);*/
                Sharp.addScore([scoring, academic_scoring], 'ls_breeds', "@YO4", tmp);
                //1-5= 3, 6-10= 8, 11+= 10 

                
                a = Moss.fn.count(/^S4_PSP_05\.lvst_practices#pas#.*$/, 'yes', currentAnswers);
                b = Moss.fn.count(/^S4_PSP_05\.lvst_practices#pas#.*$/, 'no', currentAnswers);
                c = Moss.fn.count(/^S4_PSP_05\.lvst_practices#pas#.*$/, '_not_applicable', currentAnswers);
                if ((a + b) > 0) { //means that some questions have been answered
                    tmp = (a + b) > 0 ? (a + b) : 1;
                    tmp1 = (a * 10) / tmp;
                    Sharp.addScore([scoring, academic_scoring], 'lvst_pas', "@S4_PSP_05_pas_msr", tmp1);
                }
                

                a = Moss.fn.count(/^S4_PSP_05\.lvst_practices#roel#.*$/, 'yes', currentAnswers);
                b = Moss.fn.count(/^S4_PSP_05\.lvst_practices#roel#.*$/, 'no', currentAnswers);
                c = Moss.fn.count(/^S4_PSP_05\.lvst_practices#roel#.*$/, '_not_applicable', currentAnswers);
                if ((a + b) > 0) {
                    tmp = (a + b) > 0 ? (a + b) : 1;
                    tmp1 = (a * 10) / tmp;
                    Sharp.addScore([scoring, academic_scoring], 'lvst_roel', "@S4_PSP_05_roel_msr", tmp1);
                }
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_05.adeq_imp");
            }
           
            break;

        /**************************        
         *    Livestock breeding  *
         **************************/
        case 'S4_PSP_06':
            tmp = Moss.fn.exists(/^S4_PSP_06\.lvst_breeding#tried#.*$/, true, currentAnswers) ? 10 : 0;
            Sharp.addScore([scoring, academic_scoring], 'ls_breeding', "@IW9| KPI 7.3", tmp);
            // Note: same scoring reported twice (KI 7.3 and 10.4 
            Sharp.addScore([scoring, academic_scoring], 'ls_breeding_academic', "@IW9| KPI 10.4", tmp);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_06.adeq_imp");
            break;
       
        /**************************        
         *    Animal nutrition    *
         **************************/
        case 'S4_PSP_07':
            var grazing = Moss.fn.count(/^S4_PSP_07\.animal_nutrition#keep_grazing#.*$/, true, currentAnswers),
                food_suppl_prop = Moss.fn.sum(/^S4_PSP_07\.animal_nutrition#food_suppl_prop#.*$/, currentAnswers),
                imported_feed_perc = currentAnswers['S4_PSP_07.feed_imported_perc'],
                totalNumberOfAnimalCategories = Sharp.totalNumberOfAnimalCategories();
                
            // How many other nutritive sources than pasture/grass do you give to your cattle? 
            // # of different foods with same function
            tmp = currentAnswers["S4_PSP_07.nutri_cattle"];
            if (tmp) {
             //   tmp = 0;
           
            //tmp = Moss.fn.countTokenizedText(/^S4_PSP_07\.animal_nutrition#food_suppl_dscr#.*$/, currentAnswers);
            // (including grazing)
            //tmp += grazing;

            //if (totalNumberOfAnimalCategories > 0) {
              //  tmp = Math.round(tmp / totalNumberOfAnimalCategories);
                Sharp.addScore([scoring, academic_scoring], 'an_foods',  "@WKK", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            tmp = (grazing / totalNumberOfAnimalCategories) * 10;
            Sharp.addScore([scoring, academic_scoring], 'an_grazing',  "@XJH", tmp);
            // }
            tmp = ("yes" === currentAnswers['S4_PSP_07.feed_storage']) ? 10 : 0;
            Sharp.addScore([scoring, academic_scoring], 'feed_storage', "@S4_PSP_07_feed_storage_msr", tmp);
                
            
            /*tmp = currentAnswers['S4_PSP_07.nutri_cattle'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'an_nutri_cattle',  "@S4_PSP_07_nutri_cattle", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 3, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
            tmp = currentAnswers['S4_PSP_07.nutri_pigs'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'an_nutri_pigs',  "@S4_PSP_07_nutri_pigs", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            */
           /* tmp = currentAnswers['S4_PSP_07.nutri_poultry'];
            Sharp.addScore([scoring, academic_scoring], 'an_nutri_poultry',  "@S4_PSP_07_nutri_poultry", (tmp === 'yes' ? 10 : 0));
*/
            tmp = currentAnswers['S4_PSP_07.nutri_pigs'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'an_nutri_pigs',  "@S4_PSP_07_nutri_pigs", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
            tmp = currentAnswers['S4_PSP_07.nutri_poultry'];
            if (tmp !== '_not_applicable') {
                Sharp.addScore([scoring, academic_scoring], 'an_nutri_poultry',  "@S4_PSP_07_nutri_poultry", (tmp === 'yes' ? 10 : 0));
            }
            
        
            tmp = currentAnswers['S4_PSP_07.feed_imported_perc'];
            if (imported_feed_perc && imported_feed_perc !== '_dontknow') {
                if (imported_feed_perc === '0') {
                    tmp1 = 10;
                } else if (imported_feed_perc === '1_10') {
                    tmp1 = 8;
                } else if (imported_feed_perc === '11_20') {
                    tmp1 = 6;
                } else if (imported_feed_perc === '21_40') {
                    tmp1 = 4;
                } else if (imported_feed_perc === '41_80') {
                    tmp1 = 2;
                } else {
                    tmp1 = 0;
                }
               
                Sharp.addScore([scoring, academic_scoring], 'food_suppl_prop_msr',  "@S4_PSP_07_feed_imported_perc_msr", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_07.adeq_imp");
            break;

        
                
        /****************************        
         *    Seed breed sources    *
         ****************************/
        case 'S4_PSP_08':
            var seedSourcesYes = Moss.fn.count(/^S4_PSP_08\.seed_breed_src#.*#seed$/, 'yes', currentAnswers),
                seedSourcesNo = Moss.fn.count(/^S4_PSP_08\.seed_breed_src#.*#seed$/, 'no', currentAnswers),
                breedSourcesYes = Moss.fn.count(/^S4_PSP_08.seed_breed_src#.*#breed$/, 'yes', currentAnswers),
                breedSourcesNo = Moss.fn.count(/^S4_PSP_08.seed_breed_src#.*#breed$/, 'no', currentAnswers);

            if (seedSourcesYes || seedSourcesNo) {
                Sharp.addScore([scoring, academic_scoring], 'sbs_number', "@MLY", Sharp.rangeScale(seedSourcesYes, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 3, value: 6},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            if (breedSourcesYes || breedSourcesNo) {
                Sharp.addScore([scoring, academic_scoring], 'sbs_ls_number', "@TVA", Sharp.rangeScale(breedSourcesYes, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 3, value: 6},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_PSP_08.adeq_imp_seed", "S4_PSP_08.adeq_imp_breed"]);
            break;
                
        /*************************************************        
         *    Utilisation of new varieties and breeds    *
         *************************************************/
        case 'S4_PSP_09':
            var count,
                myscore,
                hasAnswered = false,
                use_new_varieties_15yrs = 0,
                use_new_varieties_30yrs = 0,
                perc15yrs,
                perc30yrs,
                score2;
                                
            count = 0;
            tmp = 0;
            tmp1 = 0;
                
            if (currentAnswers['S4_PSP_09.use_new_varieties_15yrs'] === 'yes') {
                //Sharp.addScore([scoring, academic_scoring], 'ub_specs_15', "@T4B", 0);
      
                tmp = Moss.fn.sum(/^S4_PSP_09\.crop_imprv_perc/, undefined, currentAnswers);
                if (tmp) {
                    perc15yrs = Sharp.rangeScale(tmp, [
                        {threshold: 25, value: 10},
                        {threshold: 50, value: 6},
                        {threshold: 75, value: 3},
                        {threshold: 90, value: 1},
                        {threshold: 100, value: 0}
                    ]);
                }
                count++;
                hasAnswered = true;
            } else if (currentAnswers['S4_PSP_09.use_new_varieties_15yrs'] === 'dontknow') {
                tmp = 0;
                //Sharp.addScore([scoring, academic_scoring], 'ub_specs_15', "@T4B", 10);
           
                hasAnswered = true;
            } else if (currentAnswers['S4_PSP_09.use_new_varieties_15yrs'] === 'no') {
                tmp = 0;
                use_new_varieties_15yrs = 10;
                hasAnswered = true;
                count++;
            }
                
            if (currentAnswers['S4_PSP_09.use_new_varieties_30yrs'] === 'yes') {
                //Sharp.addScore([scoring, academic_scoring], 'ub_specs_30', "@SNH", 0);
             
                count++;
                tmp1 = Moss.fn.sum(/^S4_PSP_09\.breed_non_lcl_perc/, undefined, currentAnswers);
                if (tmp1) {
                    perc30yrs = Sharp.rangeScale(tmp1, [
                        {threshold: 25, value: 10},
                        {threshold: 50, value: 6},
                        {threshold: 75, value: 3},
                        {threshold: 90, value: 1},
                        {threshold: 100, value: 0}
                    ]);
                }
                hasAnswered = true;
            } else if (currentAnswers['S4_PSP_09.use_new_varieties_30yrs'] === 'dontknow') {
                //Sharp.addScore([scoring, academic_scoring], 'ub_specs_30', "@SNH", 0);
             
                tmp1 = 0;
                hasAnswered = true;
                //tmp1 = Moss.fn.sum(/^S4_PSP_09\.breed_non_lcl_perc/, undefined, currentAnswers);
            } else if (currentAnswers['S4_PSP_09.use_new_varieties_30yrs'] === 'no') {
                tmp1 = 0;
                //Sharp.addScore([scoring, academic_scoring], 'ub_specs_30', "@SNH", 10);
                use_new_varieties_30yrs = 10;
                hasAnswered = true;
                count++;
            }
                //should not sum the percentages but the score of the signle questions divided by the number of questions (percentages)
                //instead of 80+30 should be 6 +1 divided by 2
            if (perc15yrs !== undefined && perc30yrs !== undefined) {
                myscore = (perc15yrs + perc30yrs) / 2;
                Sharp.addScore([scoring, academic_scoring], 'ub_new_varieties_msr', "@UNQ", myscore);
            } else if (perc15yrs !== undefined) {
                Sharp.addScore([scoring, academic_scoring], 'ub_new_varieties_msr', "@UNQ", perc15yrs);
            } else if (perc30yrs !== undefined) {
                Sharp.addScore([scoring, academic_scoring], 'ub_new_varieties_msr', "@UNQ", perc30yrs);
            }
            /*if (count > 0 && hasAnswered) {
                if (count > 0) {
                    myscore = Sharp.rangeScale((((tmp + tmp1) / count)), [
                        {threshold: 25, value: 10},
                        {threshold: 50, value: 6},
                        {threshold: 75, value: 3},
                        {threshold: 90, value: 1},
                        {threshold: 100, value: 0}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'ub_new_varieties_msr', "@UNQ", myscore);
                }
            }*/
            if (hasAnswered) {
                Sharp.addScore([scoring, academic_scoring], 'ub_no_lcl', "@S4_PSP_09_new_varieties_msr", ((use_new_varieties_15yrs + use_new_varieties_30yrs) / (count > 0 ? count : 1)));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_09.adeq_imp");
            break;
                
        /********************************        
         *    Trees and Agroforestry    *
         ********************************/
        case 'S4_PSP_10':
            
            if (currentAnswers['S4_PSP_10.planted_trees'] === 'yes') {
                //Whether agroforestry is used    
                Sharp.addScore([scoring, academic_scoring], 'ta_planted', "@JOF", 10);
                                
                //# of different managed species       
                tmp = Moss.fn.sum(/^S4_PSP_10\.trees_planted_species_qty/, currentAnswers);
                Sharp.addScore([scoring, academic_scoring], 'ta_planted_species_qty',  "@S4_PSP_10_trees_planted_species_qty_msr", Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 2},
                    {threshold: 4, value: 5},
                    {threshold: 5, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
                
                //% of agricultural land covered by trees
                tmp = currentAnswers['S4_PSP_10.trees_nat_present'];
                //0= 0, 1-10%= 2, 11-20%= 7, 21-40%= 10, 41-60%= 7, 60%+= 1
                /*
                - {value: '0', label: 0 %}
                - {value: '5', label: 1-10 %}
                - {value: '15', label: 11-20 %}
                - {value: '30', label: 21-40 %}
                - {value: '50', label: 41-60 %}
                - {value: '75', label: 60+ %}
                */
                if (tmp) {
                    if (tmp === '0') {//0 %
                        tmp1 = 0;
                    } else if (tmp === '5') {//1-10 %
                        tmp1 = 2;
                    } else if (tmp === '15') {//11-20 %
                        tmp1 = 7;
                    } else if (tmp === '30') {//21-40 %
                        tmp1 = 10;
                    } else if (tmp === '50') {//41-60 %
                        tmp1 = 7;
                    } else {//60+ %
                        tmp1 = 1;
                    }
                }
                Sharp.addScore([scoring, academic_scoring], 'ta_percent_land_academic', "@TWD| KPI 2.6", tmp1);
                //# of different managed varieties
                tmp = currentAnswers['S4_PSP_10.trees_planted_var_of_same_spec'];
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'ta_vars', "@NOA", (tmp === 'yes' ? 10 : 0));
                }
            } else {
                Sharp.addScore([scoring, academic_scoring], 'ta_planted', "@JOF", 0);
            }
            //S4_PSP_10(11).What do you use products from these natural trees for?	
            //Use of natural products from trees	
            //# of uses of tree products for: Natural remedies (animals);Natural remedies (people); Products for the protection of crops (e.g. Neem)	0= 0, 1= 7, 2+= 10
            // //S4_PSP_10.trees_nat_use:no_use   
            if (currentAnswers['S4_PSP_10.trees_nat_present'] && currentAnswers['S4_PSP_10.trees_nat_present'] !== '0') {
                Sharp.addScore([scoring, academic_scoring], 'ta_trees_nat_use',  "@S4_PSP_10_trees_nat_use_msr", Sharp.rangeScale(
                    Moss.fn.count(/^S4_PSP_10\.trees_nat_use:.*$/, true, currentAnswers),
                    [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 7},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]
                ));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_10.adeq_imp");
            break;

        /***********************************        
         *    Crop and livestock losses    *
         ***********************************/
        case 'S4_PSP_11':
            //eth todo review
            //Whether  internal coping strategies are used
            //# of severe disturbances
            //# of grave disturbances
            tmp = currentAnswers['S4_PSP_11.loss_50perc_crops'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'cl_lost_crops', "@XOO", (tmp === 'yes' ? 0 : 10));
            }
            tmp = currentAnswers['S4_PSP_11.loss_50perc_lvstck'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'cl_lost_livestocks', "@ZUO", (tmp === 'yes' ? 0 : 10));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_11.adeq_imp");
            break;

        /************************        
         *    Record keeping    *
         ************************/
        case 'S4_PSP_12':
            //eth
            var resposeYes = Moss.fn.count(/^S4_PSP_12\.record_keeping#(?!stories).*#response$/, 'yes', currentAnswers),
                resposeNo = Moss.fn.count(/^S4_PSP_12\.record_keeping#(?!stories).*#response$/, 'no', currentAnswers);
                
            if (resposeYes || resposeNo) {
                tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_12\.record_keeping#(?!stories).*#response$/, 'yes', currentAnswers), [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 2, value: 2},
                    {threshold: 3, value: 3},
                    {threshold: 4, value: 4},
                    {threshold: 5, value: 5},
                    {threshold: 6, value: 6},
                    {threshold: 7, value: 7},
                    {threshold: 8, value: 8},
                    {threshold: 9, value: 9},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'rk', '@S3H', tmp);
            }
            
            tmp = currentAnswers['S4_PSP_12.record_keeping#stories#response'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'rk_stories', "@NKK", (tmp === 'yes' ? 10 : 0));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_12.adeq_imp");
            break;

        /************************        
         *    Infrastructure    *
         ************************/
        case 'S4_PSP_13':
            tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_13\.infrastructure.*(building_access)$/, 'yes', currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 1},
                {threshold: 2, value: 2},
                {threshold: 3, value: 4},
                {threshold: 4, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'i_access', "@ESR", tmp);
           /* tmp = currentAnswers['S4_PSP_13.infrastructure#cereal_bank#building_access'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'i_cereals_access', "@R3D", (tmp === 'yes' ? 10 : 0));
            }*/
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_13.adeq_imp");
            break;

        /*************************************************************************************************        
         *    Access to information climate change, cropping practices, and meteorological previsions    *
         *************************************************************************************************/
        case 'S4_PSP_14':
            //# of changes observed  
            //0= 0, 1= 8, 2= 10, 3= 6, 4= 4, 5+= 0    
                
            tmp = Moss.fn.count(/^S4_PSP_14\.clim_chg_types:.*$/, true, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'ai_clim_chg_types',  "@S4_PSP_14_clim_chg_types_msr", Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 8},
                {threshold: 2, value: 10},
                {threshold: 3, value: 6},
                {threshold: 4, value: 4},
                {threshold: Number.POSITIVE_INFINITY, value: 0}
            ]));
            
            //Awareness of changes
            tmp = currentAnswers['S4_PSP_14.clim_chg_witness'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_climate_change_witnessing', '@WCC', (tmp === 'yes' ? 10 : 0));
            }
                
            //Whether information/extension services on cropping/livestock practices are used
            tmp = currentAnswers['S4_PSP_14.access_to_cropping_pract_info'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_access_to_cropping_pract_info', "@S4_PSP_14_access_to_crop_pract_info_msr", (tmp === 'yes' ? 10 : 0));
            }
                
            //Whether they have enough knowledge/skills to diversify their farm
            tmp = currentAnswers['S4_PSP_14.knowledge_diversify'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_knowledge_diversify', "@S4_PSP_14_knowledge_diversify_msr", (tmp === 'yes' ? 10 : 0));
            }
            
            //Whether they are aware of climate change            
            tmp = currentAnswers['S4_PSP_14.clim_chg_awareness'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_clim_chg_awareness', "@S4_PSP_14_clim_chg_awareness_msr", (tmp === 'yes' ? 10 : 0));
            }
            
            //Whether there is knowledge about conservation agriculture 
            tmp = currentAnswers['S4_PSP_14.conservation_agr'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_conservation_agr', "@S4_PSP_14_conservation_agr_msr", (tmp === 'yes' ? 10 : 0));
            }
            
            //Whether there is  the required knowledge to use pesticide       
            tmp = currentAnswers['S4_PSP_14.knowledge_pesticides'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_knowledge_pesticides', "@S4_PSP_14_knowledge_pesticides_msr", (tmp === 'yes' ? 10 : 0));
            }
            
            //Whether there is knowledge about the phosphor crisis  
            tmp = currentAnswers['S4_PSP_14.aware_phosphor'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_aware_phosphor', "@S4_PSP_14_aware_phosphor_msr", (tmp === 'yes' ? 10 : 0));
            }
                
            
            tmp = currentAnswers['S4_PSP_14.access_to_weather_frcst'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_meteo_fcst', "@XKM", (tmp === 'yes' ? 10 : 0));
            }
           
            
            //Sources of information on cropping/livestock practices
            tmp1 = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_14\.cropping_pract_source_of_info.*/, true, currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 2},
                {threshold: 2, value: 5},
                {threshold: 3, value: 6},
                {threshold: 4, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'ai_info_sources', "@QHR", tmp1);
            
            tmp = currentAnswers['S4_PSP_14.sources'];
            if (tmp) {
                if ('sources_1' === tmp) {
                    tmp1 = 0;
                } else if ('sources_2' === tmp) {
                    tmp1 = 5;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ai_sources', '@S4_PSP_14_sources_msr', tmp1);
            }
            
            /*tmp = Moss.fn.count(/^S4_PSP_14\.cropping_pract_source_of_info:(ffs_apfs|extension_agent|other_farmers)$/, true, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text i18n
                Sharp.addScore([scoring, academic_scoring], 'ai_info_selected_sources', '@ACI', tmp1);
            }
            */
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_PSP_14.adeq_imp_cp_info", "S4_PSP_14.adeq_imp_meteo_info"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_14.adeq_imp_meteo_info");
            break;

        /*******************************************        
         *    Animal diseases control practices    *
         *******************************************/
        case 'S4_PSP_15':
            // TODO manage academic_scoring
           /* console.log("S4_PSP_15");
            tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_15\.practices#.*(response)$/, 'yes', currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 3},
                {threshold: 2, value: 5},
                {threshold: 3, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'ad_practices', "@IDC", tmp);
            tmp = currentAnswers['S4_PSP_15.practices#natural_remedies#number_of_types'];
            if (tmp) {
                tmp = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 5},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ad_practices_natural', '@NAD', tmp);
            }
            
           
            Sharp.addScore([scoring, academic_scoring], 'ad_number_of_types', '@S4_PSP_14_number_of_types_msr',
                           Sharp.rangeScale(Moss.fn.sum(/^S4_PSP_15\.practices#.*#number_of_types/, undefined, currentAnswers), [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 5},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
             */
            tmp = currentAnswers['S4_PSP_15.methods'];
            if (!tmp) {
                tmp = 0;
            }
            
            Sharp.addScore([scoring, academic_scoring], 'ad_number_of_types', '@S4_PSP_14_number_of_types_msr',
                           Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 2},
                    {threshold: 3, value: 6},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));

            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_15.adeq_imp");
            break;

        /********************************        
         *    Pest control practices    *
         ********************************/
        case 'S4_PSP_16':
            tmp = currentAnswers['S4_PSP_16.use_pest_ctrl'];
            if (tmp === 'yes') {
                //S4_PSP_16.pest_ctrl_practices:crop_rotation
                tmp = Moss.fn.count(/^S4_PSP_16\.pest_ctrl_practices:.*/, true, currentAnswers);
                //tmp = currentAnswers['S4_PSP_16.number_of_types'];
                if (!tmp) {
                    tmp = 0;
                }
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 2, value: 2},
                    {threshold: 3, value: 3},
                    {threshold: 4, value: 4},
                    {threshold: 5, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'pc_practices', "@I4H", tmp1);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_16.adeq_imp");
            } else if (tmp === 'no') {
                Sharp.addScore([scoring, academic_scoring], 'pc_practices', "@I4H", 0);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_16.adeq_imp");
            }
           
            break;

        /*********************************        
         *    Synthetic Pesticide use    *
         *********************************/
        case 'S4_PSP_17':
            // TODO manage academic_scoring
                        
            var score, cnt = 0;
          
            tmp = Moss.fn.count(/^S4_PSP_17.last_cropping_season#synth_pesticides#.*/, 'yes', currentAnswers);
            tmp1 = Moss.fn.count(/^S4_PSP_17.last_cropping_season#synth_pesticides#.*/, 'no', currentAnswers);
            if (tmp || tmp1) {
                if (tmp === 0) {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'sp_use', "@RYC", tmp1);
            }
           
            //S4_PSP_17(18). Have you used synthetic pesticides over the last cropping season? 
            //+ If you use synthetic pesticide, did you look for pests/diseases on your crops before spraying? (exist already but separated from the other one)
            //insecticide
           
            tmp1 = 0;
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#insecticide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    tmp = currentAnswers['S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#insecticide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
            }
            console.log("Use of pesticides#insecticide " + tmp1 + " "  + cnt);
            //S4_PSP_17(18). Have you used synthetic pesticides over the last cropping season? 
            //+ If you use synthetic pesticide, did you look for pests/diseases on your crops before spraying? (exist already but separated from the other one)
            //herbicide                
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#herbicide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    tmp = currentAnswers['S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#herbicide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
            }
            console.log("Use of pesticides#herbicide " + tmp1 + " "  + cnt);
            //S4_PSP_17(18). Have you used synthetic pesticides over the last cropping season? 
            //+ If you use synthetic pesticide, did you look for pests/diseases on your crops before spraying? (exist already but separated from the other one)
            //fungicide  
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#fungicide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    
                    tmp = currentAnswers['S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#fungicide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
                if (cnt > 0) {
                    tmp1 = tmp1 / cnt;
                }
                console.log("Use of pesticides#fungicide " + tmp1 + " "  + cnt);
                Sharp.addScore([scoring, academic_scoring], 'sp_look_before_use', "@S4_PSP_17_pesticides_use", tmp1);
            }
                
           
                
            //the least good score is the one that remains
            tmp = Moss.fn.count(/^S4_PSP_17\.containers_disposal.*/, true, currentAnswers);
            if (Moss.fn.matches(/^S4_PSP_17\.containers_disposal.*$/, undefined, currentAnswers)) {
                tmp1 = currentAnswers['S4_PSP_17.containers_disposal:to_collectors'];
                if (tmp1 && tmp1 === true) {
                    score = 10;
                }
                tmp1 = currentAnswers['S4_PSP_17.containers_disposal:thrown_away'];
                if (tmp1 && tmp1 === true) {
                    score = 4;
                }
                if (currentAnswers['S4_PSP_17.containers_disposal:reused'] === true ||
                        currentAnswers['S4_PSP_17.containers_disposal:burned'] === true ||
                        currentAnswers['S4_PSP_17.containers_disposal:throw_on_ground'] === true ||
                        currentAnswers['S4_PSP_17.containers_disposal:throw_water_stream'] === true ||
                        currentAnswers['S4_PSP_17.containers_disposal:other_specify'] === true) {
                    score = 0;
                }
            }
            Sharp.addScore([scoring, academic_scoring], 'sp_containers', "@MBX", score);
            tmp = currentAnswers['S4_PSP_17.use_protective_gear'];
            if (tmp) {
                if (tmp === 'always') {
                    score = 10;
                } else if (tmp === 'sometimes') {
                    score = 5;
                } else if (tmp === 'never') {
                    score = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'sp_protective_gear', "@WT4", score);
            }
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_17.adeq_imp");
            break;
                
        /***********************        
         *    Intercropping    *
         ***********************/
                
                /*
                Scoring for the first part could be: yes = 10, no = 0 and not sure = 4 
                (Almost half way since it could actually be either 
                option but since they are not aware, it is likely less useful/impactful). 
                Adequacy and importance would be the usual scoring.
                */
        case 'S4_PSP_18':
            // TODO manage academic_scoring
            tmp = currentAnswers['S4_PSP_18.intercropping'];
            if (tmp === "yes") {
                Sharp.addScore([scoring, academic_scoring], 'intercropping', "@A0E",  10);
                tmp = currentAnswers['S4_PSP_18.plant_and_aquacltr_intercropping'];
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'intercropping_aquaculture', "@ADG", (tmp === 'yes' ? 10 : 0));
                }
                tmp = currentAnswers['S4_PSP_18.intercropping_perc'];
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'intercropping_percentage', "@WZY", (tmp / 10));
                }

                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_18.adeq_imp");
            } else if (tmp === "no") {
                Sharp.addScore([scoring, academic_scoring], 'intercropping', "@A0E", 0);
            }
       
            break;

        /**********************        
         *    Governance 1    *
         **********************/
        case 'S4_GOV_01':
            // TODO manage academic_scoring
            /*tmp = currentAnswers['S4_GOV_01.awareness'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'gov_awareness', "@YLDI", (tmp === 'yes' ? 10 : tmp === 'no' ? 0 : 4));
            }*/
            tmp = currentAnswers['S4_GOV_01.flexibility'];
            if (tmp === 'yes') {
                tmp1 = 10;
            } else if (tmp === 'no_influence') {
                tmp1 = 5;
            } else {
                tmp1 = 0;
            }
                
            //S4_GOV_01.flexibility:not_enough
            Sharp.addScore([scoring, academic_scoring], 'gov_flexibility', "@S4_GOV_01_flex_msr", tmp1);
            
            tmp = currentAnswers['S4_GOV_01.admin_constraints'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'gov_admin_constraints', "@S4_GOV_01_admin_constraints_msr", (tmp === 'yes' ? 0 : 10));
            }
            
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_GOV_01.adeq_imp");
            break;
                
        /**********************        
         *    Governance 2    *
         **********************/
        case 'S4_GOV_02':
            // TODO manage academic_scoring
            tmp = currentAnswers['S4_GOV_02.rules'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'rules', "@KYB9", (tmp === 'yes' ? 10 : tmp === 'no' ? 0 : 5));
            }
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_GOV_02.adeq_imp");
            break;
        /**********************        
         *    Water access    *
         **********************/
        case 'S4_ENV_01':
            a = Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#type_of_wtr_src.*/, undefined, currentAnswers);
            b = Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#type_of_wtr_src.*/, 'no_water_access', currentAnswers);
            tmp = Sharp.rangeScale((a - b), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 2},
                {threshold: 2, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'wa_sources', "@FRU", tmp);
            //Whether there has been negative changes of water quality or quantity    
            
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#negative_changes.*/, "negative", currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#negative_changes.*/, "no_change", currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#negative_changes.*/, "improvement", currentAnswers);
            tmp += c;
            tmp1 = tmp > 0 ? ((a * ZERO) + (b * 7) + (c * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'wa_negative_changes', "@S4_ENV_01_neg_chng_msr", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_01.adeq_imp");
            break;

        /****************************        
         *    Water conservation    *
         ****************************/
        case 'S4_ENV_02':
            if (!currentAnswers['S4_ENV_02.wtr_conservation:no_conservation']) {
                tmp = Sharp.rangeScale(Moss.fn.count(/^S4_ENV_02\.wtr_conservation:.*$/, true, currentAnswers), [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 2, value: 4},
                    {threshold: 4, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);

                Sharp.addScore([scoring, academic_scoring], 'wa_conservation', "@ZO4", tmp);
            } else {
                Sharp.addScore([scoring, academic_scoring], 'wa_conservation', "@ZO4", 0);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_02.adeq_imp");
            break;

        /***********************        
         *    Water quality    *
         ***********************/
        case 'S4_ENV_03':
            tmp = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, undefined, currentAnswers);
            a = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, 'yes', currentAnswers);
            b = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, 'no', currentAnswers);
            c = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, '_not_applicable', currentAnswers);
            if (tmp > c) {
                tmp1 = Sharp.rangeScale(a, [
                    {threshold: 0, value: 10},
                    {threshold: 1, value: 6},
                    {threshold: 2, value: 4},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'wa_quality', "@OWY", tmp1);
                
                tmp1 = 0;
                count = 0;
                tmp = currentAnswers['S4_ENV_03.adequacy_animal'];
                if (tmp && tmp !== '_not_applicable') {
                    tmp1 = tmp1 + Sharp.rangeScale(tmp, [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 2.5},
                        {threshold: 2, value: 5},
                        {threshold: 3, value: 7.5},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}]);
                    count++;
                }
                tmp = currentAnswers['S4_ENV_03.adequacy_human'];
                if (tmp) {
                    tmp1 = tmp1 + Sharp.rangeScale(tmp, [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 2.5},
                        {threshold: 2, value: 5},
                        {threshold: 3, value: 7.5},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}]);
                    count++;
                }
                if (count > 0) {
                    tmp = currentAnswers["S4_ENV_03.adeq_imp:adq"];
                    if (tmp) {
                        tmp1 = parseFloat(tmp1) + parseFloat(tmp);
                        count++;
                    }
                }
                currentAnswers["S4_ENV_03.adeq_imp:adq"] = (tmp1 / count);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_03.adeq_imp");
            }
            /*} else {
                tmp = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, 'no', currentAnswers);
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'wa_quality', "@OWY", 0);
                }
            }*/
            
            break;

        /***********************        
         *    Land access    *
         ***********************/
        case 'S4_ENV_04':
            var _score,
                total_land = Moss.fn.sum(/^S4_ENV_04.total_land/, undefined, currentAnswers);
           
            /*tmp =  Moss.fn.sum(/^S4_ENV_04.land_access#used_agr_land#communal_land/, undefined, currentAnswers);
            tmp1 = Moss.fn.sum(/^S4_ENV_04.land_access#pasture_land#communal_land"/, undefined, currentAnswers);
            //Total # (hectares) inserted in: ‘Communal land’ column (agricultural and pasture land together)
            if (tmp || tmp1) {
                if (!tmp) {
                    tmp = 0;
                }
                if (!tmp1) {
                    tmp1 = 0;
                }
                tmp = tmp + tmp1;
                Sharp.addScore([scoring, academic_scoring], 'la_communal_land', "@S4_ENV_communal_land_msr", tmp > 0 ? 10 : 0);
            }*/
            
            //# of separate fields accessible (across private, community and government)
            tmp = currentAnswers["S4_ENV_04.total_fields"];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'sq_degradation', "@S4_ENV_04_total_fields_msr", Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            
            tmp =  Moss.fn.sum(/^S4_ENV_04.land_access#.*#owned_land/, undefined, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'la_owned_land', "@S4_ENV_owned_land_msr", (((tmp / total_land) * 100) / 10));
                
            //Moss.fn.sum(/^S4_ENV_04\.land_access#.*/, undefined, currentAnswers);
            //tmp1 = Moss.fn.sum(/^S4_ENV_04.land_access#pasture_land#owned_land/, undefined, currentAnswers);//Moss.fn.sum(/^S4_ENV_04\.pasture_land#.*/, undefined, currentAnswers);
            
            //Total # (hectares) inserted in: ‘Communal land’ column (agricultural and pasture land together)
            //if (tmp && tmp1 && tmp2) {
            //    //((Total # (hectares) inserted in: ‘Owned land’ column (agricultural and pasture land together))/ Total land accessible *100) / 10
            //    tmp = (((tmp + tmp1) / tmp2) * 100) / 10;
            //    Sharp.addScore([scoring, academic_scoring], 'la_owned_land', "@S4_ENV_owned_land_msr", tmp);
            //}
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_04.adeq_imp");
            break;

        /**********************        
         *    Soil quality    *
         **********************/
        case 'S4_ENV_05':
            //# of different types of soil observed     
            tmp = currentAnswers['S4_ENV_05.number_of_soil_types'];
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'sq_types', "@OML", tmp1);
            }
            //level of soil quality
            tmp = currentAnswers['S4_ENV_05.soil_richness'];
            tmp1 = 0;
            if (tmp === '0' || tmp === '5') {
                tmp1 = 0;
            } else if (tmp === '1') {
                tmp1 = 2.5;
            } else if (tmp === '2') {
                tmp1 = 5;
            } else if (tmp === '3') {
                tmp1 = 7.5;
            } else if (tmp === '4') {
                tmp1 = 10;
            }
            Sharp.addScore([scoring, academic_scoring], 'sq_richness', "@S4_ENV_05_soil_richness_msr", tmp1);
            
            //Whether organic matter balance are made            
            tmp = currentAnswers['S4_ENV_05.organic_matter_balance'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'sq_organic_matter_balance', "@S4_ENV_05_omb_msr", tmp1);
            }
            //degraded
            tmp = Moss.fn.count(/^S4_ENV_05\.status_of_degradation#.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 10},
                {threshold: 1, value: 7},
                {threshold: 2, value: 4},
                {threshold: 3, value: 1},
                {threshold: Number.POSITIVE_INFINITY, value: 0}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'sq_degradation', "@DH3", tmp1);
            
            //Level of consideration of the climate/environmental conditions crops
            tmp = currentAnswers['S4_ENV_05.account_env_crops'];
            if (tmp && tmp !== '_not_applicable') {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'sq_account_env_crops', "@S4_ENV_05_account_env_crops_msr", tmp1);
            }
            //Level of consideration of the climate/environmental conditions animals
            tmp = currentAnswers['S4_ENV_05.account_env_animals'];
            if (tmp && tmp !== '_not_applicable') {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'sq_account_env_animals', "@S4_ENV_05_account_env_animals_msr", tmp1);
            }
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_05.adeq_imp");
            break;

        /************************        
         *    Land management   *
         ************************/
        case 'S4_ENV_06':
            tmp = currentAnswers['S4_ENV_06.use_land_improving'];
            if (tmp === '_not_applicable') {
                //do nothing
                console.log(tmp);
            } else if (tmp === 'no') {
                Sharp.addScore([scoring, academic_scoring], 'lm_improving', '@XHU', 0);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_06.adeq_imp");
            } else {
                var bare_land_perc, covered_land;
                //TODO    
                //What % of your land is bare (without any vegetal cover) between cropping season?
                //Percentage of bare land between cropping season
                //Bare land (square meter)/covered land *100  
                bare_land_perc = currentAnswers['S4_ENV_06.bare_land_perc'];
                covered_land = 100; //???????? currentAnswers['S4_ENV_06.recycling'];
                if (bare_land_perc && covered_land && covered_land > 0) {
                    tmp = (bare_land_perc /  covered_land) * 100;
                    tmp1 = Sharp.rangeScale(tmp, [
                        {threshold: 0, value: 0},
                        {threshold: 10, value: 1},
                        {threshold: 20, value: 2},
                        {threshold: 30, value: 3},
                        {threshold: 40, value: 4},
                        {threshold: 50, value: 5},
                        {threshold: 60, value: 6},
                        {threshold: 70, value: 7},
                        {threshold: 80, value: 8},
                        {threshold: 90, value: 9},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'lm_bare_land', "@S4_ENV_06_bare_land_perc_msr", tmp1);
                }

                //Whether crop residue/manure is recycled    
                tmp = currentAnswers['S4_ENV_06.recycling'];
                if (tmp && tmp !== '_not_applicable') {
                    if (tmp === 'yes') {
                        tmp1 = 10;
                    } else {
                        tmp1 = 0;
                    }
                    Sharp.addScore([scoring, academic_scoring], 'lm_recycling', "@S4_ENV_06_recycling_msr", tmp1);
                }

                //# of land management practices used
                //0= 0, 1= 1, 2= 3, 3= 5, 4= 7, 5= 9, 6+=10
                //if (currentAnswers['S4_ENV_06.use_land_improving'] === 'yes') {
                tmp = Moss.fn.count(/^S4_ENV_06\.land_improving#.*#response.*$/, 'yes', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 2, value: 3},
                    {threshold: 3, value: 5},
                    {threshold: 4, value: 7},
                    {threshold: 5, value: 9},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                //}
                Sharp.addScore([scoring, academic_scoring], 'lm_improving', '@XHU', tmp1);
               /* tmp = Moss.fn.count(/^S4_ENV_06\.land_improving#(crop_rotation|rotational_grazing|fallowing|zero_tillage|wind_break_hedge)#response.*$/, 'yes', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 3, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'lm_improving', '@SMI', tmp1);
                 */
                 //Whether mycorrhiza are considered
                tmp = currentAnswers['S4_ENV_06.mycorrhiza'];
                if (tmp && tmp !== '_not_applicable') {
                    if (currentAnswers['S4_ENV_06.mycorrhiza'] === 'yes') {
                        tmp = 10;
                    } else {
                        tmp = 0;
                    }
                    Sharp.addScore([scoring, academic_scoring], 'lp_presence', "@S4_ENV_07_mycorrhiza_msr", tmp);
                }
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_06.adeq_imp");
            }
            
            break;

        /*************************        
         *    Leguminous plants  *
         *************************/
        case 'S4_ENV_07':
            tmp = currentAnswers['S4_ENV_07.leguminous'];
            if (tmp && tmp !== '_not_applicable') {
                if (currentAnswers['S4_ENV_07.leguminous'] === 'every_year') {
                    tmp = 10;
                } else if (currentAnswers['S4_ENV_07.leguminous'] === 'not_every_year') {
                    tmp = 5;
                } else {
                    tmp = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'lp_presence', "@PYW| KPI 2.4", tmp);
                //Sharp.addScore([scoring, academic_scoring], 'lp_presence-academic', "@PYW| KPI 8.3", tmp);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_07.adeq_imp");
            }
            break;

        /********************        
         *    Buffer zones  *
         ********************/
        case 'S4_ENV_08':
                
            /*
            None of it = 0
            Less than 7%+ No = 2
            Less than 7%+ Yes = 5
            7% or more but less than 15%+ No =4
            7% or more but less than 15% + Yes = 6
            15% or more + No = 7.5
            15% or more+ Yes = 10            
            */
            //Existence of buffer zones and observance of wild plant/ insect species  
            tmp = currentAnswers['S4_ENV_08.wild_bordered'];
            if (tmp && tmp !== '_not_applicable') {
                if (currentAnswers['S4_ENV_08.wild_bordered'] === '15_or_more') {
                    if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                        tmp = 10;
                    } else {
                        tmp = 7.5;
                    }
                } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'from_7_to_15') {
                    if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                        tmp = 6;
                    } else {
                        tmp = 4;
                    }
                } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'to_7') {
                    if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                        tmp = 5;
                    } else {
                        tmp = 2;
                    }
                } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'none') {
                    tmp = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'bz_wild', "@YFI", tmp);
                //Sharp.addScore([scoring, academic_scoring], 'bz_wild_academic', "@YFI| KPI 7.4", tmp1);
                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_08.adeq_imp");
            }
            break;

        /**********************        
         *    Energy sources  *
         **********************/
        case 'S4_ENV_09':
            tmp1 = 0;
            //0= 0
            //Solar= 4
            //Domestic waste= 4
            //Agricultural residues= 4
            //Wood residues= 4
            //Manure= 4
            //Other options= 3
            //2+= 10 (maximum of 10)
            
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(agri_residues)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(biogas)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(charcoal)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(diesel)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(domestic_waste)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(electricity)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(fuel_wood)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(manure)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(natgas)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(oil)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(paraffin)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(wind)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(water)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(wood_residues)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(other_specify)#.*$/, true, currentAnswers) > 0 ? 2 + tmp1 : tmp1;
        
            if (tmp1 >= 7) {
                tmp1 = 10;
            }

            Sharp.addScore([scoring, academic_scoring], 'es_usage', "@LMX", tmp1);
                                
            //External dependence for energy source   
            tmp = currentAnswers['S4_ENV_09.energy_stakeholders'];
            if (tmp) {
                if (tmp === 'energy_all_ext') {
                    tmp1 = 0;
                } else if (tmp === 'energy_half_ext') {
                    tmp1 = 5;
                } else if (tmp === 'energy_half_farm') {
                    tmp1 = 8;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'es_usage_local', '@S4_ENV_09_energy_stakeholders_msr', tmp1);
            }

                  
            tmp = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar|wood_residues|manure|agri_residues|domestic_waste|biogas|water|wind)#.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 4},
                {threshold: 2, value: 8},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            
            Sharp.addScore([scoring, academic_scoring], 'es_usage_friendly', '@NOF', tmp1);
            tmp = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar|agri_residues|domestic_waste|wood_residues|wind)#.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 4},
                {threshold: 2, value: 8},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
        
            Sharp.addScore([scoring, academic_scoring], 'es_usage_local', '@NOL', tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_09.adeq_imp");
            break;

        /***************************        
         *    Energy conservation  *
         ***************************/
        case 'S4_ENV_10':
                //S4_ENV_10_non_liq_man_stock_msr','S4_ENV_10_liq_man_stock_msr','S4_ENV_10_bioplant_use_msr','S4_ENV_10_energy_conserv_methods_msr','S4_ENV_10_bioplant_use_onfarm_msr'
            var t1, t2, t3, t4;
            tmp = currentAnswers['S4_ENV_10.energy_conserv'];
            if (tmp === 'yes') {
                tmp1 = 10;
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'ec_practices', "@JT1", tmp1);
                
            if (tmp === 'yes') {
                //# of types of energy conservation methods used            
                tmp = Moss.fn.count(/^S4_ENV_10\.energy_conserv_methods.*/, true, currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ec_methods', "@S4_ENV_10_energy_conserv_methods_msr", tmp1);

                //Whether liquid manure is in an open or closed container   
                tmp = 0;
                t1 = currentAnswers['S4_ENV_10.liq_man_stock'];
                t2 = currentAnswers['S4_ENV_10.non_liq_man_stock'];
                t3 = currentAnswers['S4_ENV_10.bioplant_use'];
                t4 = currentAnswers['S4_ENV_10.bioplant_use_onfarm'];
                if (t1 !== '_not_applicable') {
                    Sharp.addScore([scoring, academic_scoring], 'ec_manure_liq', "@S4_ENV_10_liq_man_stock_msr", "closed" === t1 ? 10 : 0);
                }
                if (t2 !== '_not_applicable') {
                    Sharp.addScore([scoring, academic_scoring], 'ec_manure_non_liq', "@S4_ENV_10_non_liq_man_stock_msr", "closed" === t2 ? 10 : 0);
                    Sharp.addScore([scoring, academic_scoring], 'ec_bioplant_use', "@S4_ENV_10_bioplant_use_msr", "yes" === t3 ? 10 : 0);
                    Sharp.addScore([scoring, academic_scoring], 'ec_bioplant_use_onfarm', "@S4_ENV_10_bioplant_use_onfarm_msr", "yes" === t4 ? 10 : 0);
                }
                
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_10.adeq_imp");
            break;

        /*******************        
         *    Fertilizers  *
         *******************/
        case 'S4_ENV_11':
                
            var synt = currentAnswers['S4_ENV_11.synth_fertilizes_use'],
                synt_check = currentAnswers['S4_ENV_11.synth_fert_check_bfr'],
                nat  = currentAnswers['S4_ENV_11.nat_fertilizes_use'],
                nat_check = currentAnswers['S4_ENV_11.natural_fertilizes_check'],
                combine = currentAnswers['S4_ENV_11.natural_synth_combine'],
                combine_check = currentAnswers['S4_ENV_11.natural_synth_combine_check'],
                cover_crops = currentAnswers['S4_ENV_11.cover_crops'],
                cover_crops_oth_use = currentAnswers['S4_ENV_11.cover_crops_oth_use'],
                app1 = 0,
                app2 = 0;
                
            //Type and use of fertilizers and Whether soil/plant have been check before using fertilizer        
            if (synt) {
                if (synt === 'yes') {
                    if (synt_check === 'yes') {
                        app1 = 6;
                    } else if (!synt_check || synt_check === 'no') {
                        app1 = 2;
                    }
                } else if (synt === 'no') {
                    app1 = 0;
                }
            }
            Sharp.addScore([scoring, academic_scoring], 'fe_synth_use', "@S4_ENV_11_synt_fert_msr", app1);
                
            //Natural fertilizers use and Whether soil/plant have been check before using fertilizer
            if (nat) {
                if (nat === 'yes') {
                    if (nat_check === 'yes') {
                        app2 = 10;
                    } else {
                        app2 = 2;
                    }
                } else if (nat === 'no') {
                    app2 = 0;
                }
            }
            Sharp.addScore([scoring, academic_scoring], 'fe_synth_use', "@S4_ENV_11_nat_fert_msr", app2);
            //Whether there is a combination of natural organic fertilizer and synthetic fertilizer        
            if (combine) {
                if (combine === 'yes') {
                    if (combine_check === 'yes') {
                        tmp = 10;
                    } else {
                        tmp = 2;
                    }
                } else if (combine === 'no') {
                    tmp = 0;
                }
            }
            Sharp.addScore([scoring, academic_scoring], 'fe_nat_synth_combine', "@S4_ENV_11_nat_synth_comb_msr", tmp);
                
            if (cover_crops && cover_crops === 'yes') {
                tmp = 10;
            } else {
                tmp = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'fe_cover_crops', "@S4_ENV_11_cover_crops_msr", tmp);
                
            tmp = Moss.fn.count(/^S4_ENV_11\.fertilizer_src.*/, undefined, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 2, value: 5},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'fe_sources', "@RDL", tmp1);
            
            Sharp.addScore([scoring, academic_scoring], 'fe_cover_crops_oth_use', "@S4_ENV_11_cover_crops_oth_use_msr", (cover_crops_oth_use ? 10 : 0));
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_ENV_11.adeq_imp_synth_fert", "S4_ENV_11.adeq_imp_nat_fert"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_11.adeq_imp_nat_fert");
            break;

        /***********************************        
         *    Weed species and management  *
         ***********************************/
        case 'S4_ENV_12':
            tmp = currentAnswers['S4_ENV_12.has_weed_mgmt_pract'];
            if (tmp === 'yes') {
                tmp = currentAnswers['S4_ENV_12.perc_covered_weed'];
                if (tmp) {
                    tmp1 = Sharp.rangeScale(tmp, [
                        {threshold: 10, value: 10},
                        {threshold: 25, value: 6},
                        {threshold: 50, value: 4},
                        {threshold: 75, value: 2},
                        {threshold: Number.POSITIVE_INFINITY, value: 0}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'ws_percentage', "@QZJ", tmp1);
                }
                tmp = currentAnswers['S4_ENV_12.number_of_inv_species'];
                if (tmp) {
                    tmp1 = Sharp.rangeScale(tmp, [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 2},
                        {threshold: 2, value: 4},
                        {threshold: 3, value: 10},
                        {threshold: 4, value: 5},
                        {threshold: Number.POSITIVE_INFINITY, value: 2}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'ws_number', '@NOI', tmp1);
                }

                //S4_ENV_12. In your field, what weed management practices do you use? (exist already)	Different types of weed management practices 
                //S4_ENV_12.weed_mgmt_pract
                tmp =  Moss.fn.count(/^S4_ENV_12\.weed_mgmt_pract:.*$/, true, currentAnswers);
                if (tmp) {
                    tmp1 = Sharp.rangeScale(tmp, [
                        {threshold: 1, value: 0},
                        {threshold: 2, value: 3},
                        {threshold: 3, value: 5},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'ws_mgmt_pract', '@S4_ENV_12_weed_mgmt_pract_msr', tmp1);
                }

                Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_12.adeq_imp");
            }
            break;
        
        /************************        
         *    Group membership  *
         ************************/
        case 'S4_SOC_01':
            if (currentAnswers['S4_SOC_01.is_member_of_groups'] === 'yes') {
                //# of groups which have at least ‘quite active’ participation level
                //Degree of participation 
               // S4_SOC_01.groups#seed_bank#participation
                a = Moss.fn.count(/^S4_SOC_01\.groups#.*#participation.*$/, true, currentAnswers);
                tmp = Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'quite_active', currentAnswers);
                tmp += Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'very_active', currentAnswers);
                tmp += Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'leader', currentAnswers);
                                
                Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@L2C", Sharp.rangeScale(
                    tmp,
                    [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 2},
                        {threshold: 3, value: 5},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]
                ));
                
                     
            //Degree of participation 
                if (a) {
                    Sharp.addScore([scoring, academic_scoring], 'gm_participation_selection', '@PIS', (((tmp / a) * 100) / 10));
                
          
                    //Frequency of the group meeting       
                    cnt = 0;
                    tmp = 0;
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_a_week', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 10) / a);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_every_2_week', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 7) / a);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_a_month', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 5) / a);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_twice_a_year', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 2) / a);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'never', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * ZERO) / a);
                    }
                    /*cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_a_week', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 10) / cnt);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_every_2_week', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 7) / cnt);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_a_month', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 5) / cnt);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'freq_once_twice_a_year', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * 2) / cnt);
                    }
                    cnt = Moss.fn.count(/^S4_SOC_01\.groups#.*#frequency.*$/, 'never', currentAnswers);
                    if (cnt > 0) {
                        tmp += ((cnt * ZERO) / cnt);
                    }
                    */
                    Sharp.addScore([scoring, academic_scoring], 'gm_frequency', "@S4_SOC_01_frequency_msr", tmp);

                    //# of different types of groups
                    Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@S4_SOC_01_participation_msr", Sharp.rangeScale(
                        Moss.fn.count(/^S4_SOC_01\.groups#.*#participation.*$/, true, currentAnswers),
                        [
                            {threshold: 0, value: 0},
                            {threshold: 3, value: 2},
                            {threshold: 6, value: 5},
                            {threshold: Number.POSITIVE_INFINITY, value: 10}
                        ]
                    ));
                    
                    //# of different groups
                    tmp =  Moss.fn.count(/^S4_SOC_01\.knowledge_exchange:.*$/, true, currentAnswers);
                    tmp1 = Sharp.rangeScale(tmp, [
                        {threshold: 0, value: 0},
                        {threshold: 2, value: 2},
                        {threshold: 4, value: 4},
                        {threshold: 5, value: 5},
                        {threshold: 6, value: 6},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]);
                    Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@S4_SOC_01_know_exchg_msr", tmp1);
                    
                }
                //Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@S4_SOC_01_know_exchg_msr", tmp1);
            
            } else {
                Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@L2C", Sharp.rangeScale(
                    0,
                    [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 2},
                        {threshold: 3, value: 5},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]
                ));
            }
                
            //# of different groups	# ticked from all options given in table	0=0. 1-2= 2, 3-4=4;4-5 = 5, 5-6=6, 6+=10
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_SOC_01.adeq_imp_grp", "S4_SOC_01.adeq_imp_knwldg"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_01.adeq_imp_knwldg");
            break;

        /*************        
         *    Meals  *
         *************/
        case 'S4_SOC_02':
            //Whether the diet is diverse
            tmp = currentAnswers['S4_SOC_02.diet'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'gm_participation_selection', '@S4_SOC_02_diet_msr', tmp === 'yes' ? 10 : 0);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_02.adeq_imp");
            break;

        /*********************        
         *    Disturbancies  *
         *********************/
        case 'S4_SOC_03':
             //What types of disturbances have you experienced in the past 10 years?   
            tmp = Moss.fn.count(/^S4_SOC_03\.types_of_disturbances#.*#response/, 'yes', currentAnswers);

            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 5},
                {threshold: 1, value: 10},
                {threshold: 2, value: 8},
                {threshold: 3, value: 6},
                {threshold: 4, value: 4},
                {threshold: Number.POSITIVE_INFINITY, value: 0}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'di_types', 'Number of disturbancies experienced (10 years)', tmp1);

            tmp = currentAnswers['S4_SOC_03.mod_habit_clim_chg'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'di_habit', "@NT9", (tmp === 'yes' ? 10 : 0));
            }

            //Whether they are keen to changes/adaptations    
            tmp = currentAnswers['S4_SOC_03.deal_with_disturbances'];
            if (tmp) {
                if (tmp === '_not_at_all') {
                    tmp1 = 0;
                } else if (tmp === '_a_little') {
                    tmp1 = 2.5;
                } else if (tmp === '_average') {
                    tmp1 = 5;
                } else if (tmp === '_a_lot') {
                    tmp1 = 7.5;
                } else if (tmp === '_completely') {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'di_deal_with_disturbances', "@S4_SOC_03_dist_deal_msr", tmp1);
            }
            //Whether the entourage is giving enough support 
            tmp = currentAnswers['S4_SOC_03.entourage_support_with_disturbances'];
            Sharp.addScore([scoring, academic_scoring], 'di_support_deal_with_disturbances', "@S4_SOC_03_dist_entourage_msr", tmp === 'dist_support' ? 10 : 0);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_03.adeq_imp");
            break;

        /*************************        
         *    Veterinary access  *
         *************************/
        case 'S4_SOC_04':
            tmp = currentAnswers['S4_SOC_04.access_to_vet_svc'];
            if (tmp) {
                if (tmp === 'no') {
                    tmp1 = 0;
                } else if (tmp === 'yes') {
                    tmp1 = 10;
                } else if (tmp === "yes_but_problematic") {
                    tmp1 = 5;
                }
                Sharp.addScore([scoring, academic_scoring], 'va_access', "@AKJ", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_04.adeq_imp");
            break;

        /*****************************        
         *    Trust and cooperation  *
         *****************************/
        case 'S4_SOC_05':
            //Level of household support
            var s1 = Moss.fn.count(/^S4_SOC_05\.household_duties#.*#support$/, 'no_support', currentAnswers),
                s2 = Moss.fn.count(/^S4_SOC_05\.household_duties#.*#support$/, 'more_support', currentAnswers),
                s3 = Moss.fn.count(/^S4_SOC_05\.household_duties#.*#support$/, 'ok_support', currentAnswers),
                s4 = Moss.fn.count(/^S4_SOC_05\.household_duties#.*#support$/, 'no_support_need', currentAnswers);
      
            count =  Moss.fn.count(/^S4_SOC_05\.household_duties#.*#support$/, undefined, currentAnswers);
                
            tmp = currentAnswers['S4_SOC_05.trust_general'];
            if (s1) {
                s1 = 0;
            }
            if (s2) {
                s2 = (s2 * 5);
            }
            if (s3) {
                s3 = (s3 * 10);
            }
            if (s4) {
                s4 = (s4 * 10);
            }
            tmp1 = (s1 + s2 + s3 + s4) / count;
            Sharp.addScore([scoring, academic_scoring], 'tc_household_duties', '@S4_SOC_05_hh_duties_msr', tmp1);

            //Generally speaking, would you say that most people in your village/ neighbourhood can be trusted or that you can’t be too careful in dealing with people? 
            //Level of trust in the community
            tmp = currentAnswers['S4_SOC_05.trust_general'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'tc_general', '@BAA', (tmp === 'trust' ? 10 : 0));
            }
            //In your village/ neighbourhood do you generally trust others in matters of lending and borrowing?
            //Level of trust in the community
            tmp = currentAnswers['S4_SOC_05.trust_lending'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'tc_lending', '@BAA1', (tmp === 'yes' ? 10 : 0));
            }
                
            //Level of involvement in communal activities
            tmp = Moss.fn.count(/^S4_SOC_05\.trust_contribution:(time|money|other)$/, true, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    //{threshold: 0, value: 0},
                    {threshold: 1, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'tc_contribution', '@S4_SOC_05_trust_contribution_msr', tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_05.adeq_imp");
            break;

        /***********************************        
         *    Previous collective actions  *
         ***********************************/
        case 'S4_SOC_06':
            //Frequency (and presence) of collective action
            tmp = currentAnswers['S4_SOC_06.lst_yr_joining_freq'];
            if (tmp && tmp !== 'not_applicable') {
                if (tmp === 'never') {
                    tmp1 = 0;
                } else if (tmp === 'rarely') {
                    tmp1 = 4;
                } else if (tmp === 'sometimes') {
                    tmp1 = 7;
                } else if (tmp === 'frequently') {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ca_previous', "@PST", tmp1);
            }
            
                
            //Whether machinery are shared with other farmers S4_SOC_06_share_machinery_msr
            tmp = currentAnswers['S4_SOC_06.share_machinery'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ca_share_machinery', "@S4_SOC_06_share_machinery_msr", tmp === 'yes' ? 10 : 0);
            }
            //Whether plots of land are exchanged with other farmers S4_SOC_06_exchange_plots_msr
            tmp = currentAnswers['S4_SOC_06.exchange_plots'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ca_exchange_plots', "@S4_SOC_06_exchange_plots_msr", tmp === 'yes' ? 10 : 0);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_06.adeq_imp");
            break;

        /*********************************        
         *    Household decision-making  *
         *********************************/
        case 'S4_SOC_07':
            /*
            tmp = currentAnswers['S4_SOC_07.financial_decisions#prtnr_earnings_usage#response'];
            if (tmp) {
                if (tmp === 'both') {
                    tmp1 = 10;
                } else if (tmp === 'your_partner' || tmp === 'someone_else') {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'dm_decisions_earnings', 'Who decide on pertner\'s earnings', tmp1);
            }
            */
            /* QA */
            tmp = currentAnswers['S4_SOC_07.general_decisions#healt_care#response'];
            if (tmp) {
                if (tmp === 'both' || tmp === 'you') {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_healthcare', "@IJH", 10);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_healthcare', "@IJH", 0);
                }
            }
            /* QB */
            tmp = currentAnswers['S4_SOC_07.general_decisions#major_purchases#response'];
            if (tmp) {
                if (tmp === 'both') {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_major_purchases', "@LPP", 10);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_major_purchases', "@LPP", 0);
                }
            }
            /* QC */
            tmp = currentAnswers['S4_SOC_07.general_decisions#daily_purchases#response'];
            if (tmp) {
                if (tmp === 'both') {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_daily_purchases', "@S29", 10);
                } else if (tmp === 'you' || tmp === 'your_partner') {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_daily_purchases', "@S29", 5);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_daily_purchases', "@S29", 0);
                }
            }
            /* QD */
            tmp = currentAnswers['S4_SOC_07.general_decisions#making_visits_to_rel#response'];
            if (tmp) {
                if (tmp === 'both') {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_visits', "@TUR", 10);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'dm_decisions_visits', "@TUR", 0);
                }
            }
            /* Earnings 1 */
            tmp = currentAnswers['S4_SOC_07.financial_decisions#prtnr_earnings_usage#response'];
            if (tmp) {
                if (tmp !== 'not_applicable') {
                    if (tmp === 'both') {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_partner_earnings', "@P5L", 10);
                    } else if (tmp === 'your_partner') {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_partner_earnings', "@P5L", 5);
                    } else {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_partner_earnings', "@P5L", 0);
                    }
                }
            }
            /* Earnings 2 */
            tmp = currentAnswers['S4_SOC_07.financial_decisions#your_earnings_usage#response'];
            if (tmp) {
                if (tmp !== 'not_applicable') {
                    if (tmp === 'both') {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_your_earnings', "@HWF", 10);
                    } else if (tmp === 'your_partner') {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_your_earnings', "@HWF", 5);
                    } else {
                        Sharp.addScore([scoring, academic_scoring], 'dm_decisions_your_earnings', "@HWF", 0);
                    }
                }
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_07.adeq_imp");
            break;
        
        case 'S4_SOC_08':
            //the sum of all questions (that may rich 14) is normalized to 10 (SUM(questions)/MAX)*10
            tmp = 0;
            if (currentAnswers['S4_SOC_08.food_security#q1#response'] === '1') {
                tmp += 1;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@YGB9", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q2#response'] === '1') {
                tmp += 1;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@TO6R", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q3#response'] === '1') {
                tmp += 1;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@H0K9", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q4#response'] === '1') {
                tmp += 1;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@I529", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q5#response'] === '1') {
                tmp += 1;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@R529", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q6#response'] === '1') {
                tmp += 1;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@FLXR", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q7#response'] === '1') {
                tmp += 1;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@6GVI", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q7a#response'] === '1') {
                tmp += 1;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@JJOR", tmp);
            } else if (currentAnswers['S4_SOC_08.food_security#q7a#response'] === '2') {
                tmp += 2;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@JJOR", tmp);
            } else if (currentAnswers['S4_SOC_08.food_security#q7a#response'] === '3') {
                tmp += 3;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@JJOR", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q8#response'] === '1') {
                tmp += 1;
                //Sharp.addScore([scoring, academic_scoring], 'food_security', "@OW29", tmp);
            }
            if (currentAnswers['S4_SOC_08.food_security#q8a#response'] === '1') {
                tmp += 1;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@IUDI", tmp);
            } else if (currentAnswers['S4_SOC_08.food_security#q8a#response'] === '2') {
                tmp += 2;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@IUDI", tmp);
            } else if (currentAnswers['S4_SOC_08.food_security#q8a#response'] === '3') {
                tmp += 3;
               // Sharp.addScore([scoring, academic_scoring], 'food_security', "@IUDI", tmp);
            }
            //console.log("inverse"+parseInt((1-(tmp/14))*10));
            //console.log("strait"+parseInt((tmp/14)*10));
            tmp = parseInt((1 - (tmp / 14)) * 10, 10);
            Sharp.addScore([scoring, academic_scoring], 'fies', "@3SOR", tmp);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_08.adeq_imp");
            break;
        case 'S4_SOC_09':
            tmp1 = 0;
            tmp = currentAnswers['S4_SOC_09.resettlement_displacement#q1#response'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'resettlement_displacement', "@YQFR", tmp1);
            }
            tmp = currentAnswers['S4_SOC_09.resettlement_displacement#q2#response'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'resettlement_displacement', "@VX6R", tmp1);
            }
            
            tmp = currentAnswers['S4_SOC_09.resettlement_displacement#q3#response'];
            if (tmp) {
                tmp = parseInt(tmp, 10);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 2, value: 2},
                    {threshold: 4, value: 4},
                    {threshold: 6, value: 6},
                    {threshold: 8, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'resettlement_displacement', "@OLXR", tmp1);
            }
           
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_09.adeq_imp");
            break;
        /*********************************        
         *    Financial support  *
         *********************************/
        case 'S4_EC_01':
            /*tmp = currentAnswers['S4_EC_01.fin_supp_in_lst_5_yrs_needed'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'fs_needed', "@JJA", tmp1);
            }*/
            //Proportion of short-term borrowed funds 
                
            tmp = currentAnswers['S4_EC_01.financial_support_perc'];
            if (tmp === 'less_45') {
                tmp1 = 0;
            } else if (tmp === '45_55') {
                tmp1 = 5;
            } else {
                tmp1 = 10;
            }
            console.log(tmp);
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'es_financial_support_perc', "@S4_EC_01_financial_support_perc_msr", tmp1);
            }
            //Proportion of bank mortgage over the total loans from the farm
            /*tmp = currentAnswers['S4_EC_01.financial_support_perc#bank#perc'];
            if (tmp) {
                tmp = parseInt(tmp, 10);
                Sharp.addScore([scoring, academic_scoring], 'es_bank_support', "@S4_EC_01_bank_support_msr", Sharp.rangeScale(tmp, [
                    {threshold: 30, value: 0},
                    {threshold: 50, value: 4},
                    {threshold: 70, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
            //Proportion of current account credits over the total  loans from the farm
            tmp = currentAnswers['S4_EC_01.financial_support_perc#acc_credits#perc'];
            if (tmp) {
                tmp = parseInt(tmp, 10);
                Sharp.addScore([scoring, academic_scoring], 'es_acc_credits_support', "@S4_EC_01_acc_credits_msr", Sharp.rangeScale(tmp, [
                    {threshold: 15, value: 10},
                    {threshold: 30, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]));
            }
                
            //Proportion of consumer credits over the total  loans from the farm
            tmp = currentAnswers['S4_EC_01.financial_support_perc#consumer_credits#perc'];
            if (tmp) {
                tmp = parseInt(tmp, 10);
                Sharp.addScore([scoring, academic_scoring], 'es_consumer_credits_support', "@S4_EC_01_consumer_credits_msr", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 10},
                    {threshold: 5, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]));
            }*/
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_01.adeq_imp");
            break;

        /*******************************        
         *   Access to local market  *
         *******************************/
        case 'S4_EC_02':
            tmp = currentAnswers['S4_EC_02.has_sold_products'];
            if (tmp === 'yes') {
                                    //2monthly 3week all_time
                //Frequency of selling at local farmer’s market
               /* tmp = currentAnswers['S4_EC_02.access_to_local_market'];
                if (tmp) {
                    if (tmp === 'no_access') {
                        tmp1 = 0;
                    } else if (tmp === '2monthly') {
                        tmp1 = 4;
                    } else if (tmp === '3week') {
                        tmp1 = 7;
                    } else if (tmp === 'all_time') {
                        tmp1 = 10;
                    }
                    Sharp.addScore([scoring, academic_scoring], 'ma_local', "@OPF", tmp1);
                }*/

                 //Whether items are sold/ traded directly to producers
                //count S4_EC_04.mrkt_acc_selling#directly#crop1:yes  yes 10 no 0, average
                tmp = Moss.fn.count(/^S4_EC_02\.sold_products#directly.*$/, 'yes', currentAnswers);
                tmp1 = Moss.fn.count(/^S4_EC_02\.sold_products#directly.*$/, 'no', currentAnswers);
                if (tmp || tmp1) {
                    tmp = (tmp * 10) / (tmp + tmp1);
                } else {
                    tmp = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_directly', "@S4_EC_04_directly_msr", tmp);


                //Frequency of selling at local farmer’s market
                //No = 0 1-2 times a month = 4 1-3 times a week = 7 All the time= 10
                tmp = 0;
                tmp1 = 0;
                a = Moss.fn.count(/^S4_EC_02\.sold_products#seller#.*$/, 'false', currentAnswers);
                tmp += a;
                b = Moss.fn.count(/^S4_EC_02\.sold_products#seller#.*$/, '2_month', currentAnswers);
                tmp += b;
                c = Moss.fn.count(/^S4_EC_02\.sold_products#seller#.*$/, '1_3_week', currentAnswers);
                tmp += c;
                d = Moss.fn.count(/^S4_EC_02\.sold_products#seller#.*$/, 'always', currentAnswers);
                tmp += d;
                tmp1 = ((a * ZERO) + (b * 4) + (c * 7) + (d * 10)) / (tmp > 0 ? tmp : 1);
                //the sum of all questions (that may rich 42) is normalized to 10 (SUM(questions)/MAX)*10

                Sharp.addScore([scoring, academic_scoring], 'ma_seller', "@S4_EC_04_seller_msr", tmp1);


                tmp = 0;
                tmp1 = 0;

                a = Moss.fn.count(/^S4_EC_02\.sold_products#frequency.*$/, 'every_week', currentAnswers);
                tmp += a;
                b = Moss.fn.count(/^S4_EC_02\.sold_products#frequency.*$/, 'every_month', currentAnswers);
                tmp += b;
                c = Moss.fn.count(/^S4_EC_02\.sold_products#frequency.*$/, 'once_per_season', currentAnswers);
                tmp += c;
                d = Moss.fn.count(/^S4_EC_02\.sold_products#frequency.*$/, 'once_a_year', currentAnswers);
                tmp += d;
                e = Moss.fn.count(/^S4_EC_02\.sold_products#frequency.*$/, 'never', currentAnswers);
                tmp += e;
                tmp1 = ((a * 10) + (b * 7) + (c * 5) + (d * 2) + (e * ZERO)) / (tmp > 0 ? tmp : 1);
                Sharp.addScore([scoring, academic_scoring], 'ma_single_buyer', "@S4_EC_04_sold_frequency_msr", tmp1);

                tmp = currentAnswers['S4_EC_02.sold_perc'];
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'ma_sold_perc', "@S4_EC_04_perc_direct_selling_msr", (tmp / 10));
                }
                
            } else {
                Sharp.addScore([scoring, academic_scoring], 'ma_directly', "@S4_EC_04_directly_msr", 0);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_02.adeq_imp");
            break;

        /*******************************        
         *    Market access (buying)  *
         *******************************/
        case 'S4_EC_03':
            tmp = currentAnswers['S4_EC_03.mrkt_acc_buying#directly#response'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_buying', "@IP0", tmp1);
            }
            //Whether there is any vegetal product with only one available seller
            tmp = currentAnswers['S4_EC_03.mrkt_acc_buying#crops_single_seller#response'];
            if (tmp && tmp !== '_not_applicable') {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_sb_crops', "@S4_EC_03_veg_prod_msr", tmp1);
            }
            //Whether there is any animal product with only one available seller
            tmp = currentAnswers['S4_EC_03.mrkt_acc_buying#lvstck_single_seller#response'];
            if (tmp && tmp !== '_not_applicable') {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_sb_lvstk', "@S4_EC_03_ani_prod_msr", tmp1);
            }
            tmp = currentAnswers['S4_EC_03.binding_contracts_seller'];
            if (tmp && tmp !== '_not_applicable') {
                if (tmp === 'satisfied_ok') {
                    tmp1 = 10;
                } else if (tmp === 'satisfied_mixed') {
                    tmp1 = 5;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_sb_lvstk', "@S4_EC_03_binding_contracts_seller_msr", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_03.adeq_imp");
            break;

        /*******************************        
         *    Market access (selling)  *
         *******************************/
        case 'S4_EC_04':
            /*if (currentAnswers['S4_EC_04.lst_yr_sold'] === 'yes') {
                tmp = currentAnswers['S4_EC_04.mrkt_acc_selling#directly#response'];
                if (tmp) {
                    if (tmp === 'yes') {
                        tmp1 = 10;
                    } else {
                        tmp1 = 0;
                    }
                }
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'ma_selling', "@ABD", tmp1);
            */
            //Threat from imported competing products
            //S4_EC_04.mrkt_acc_selling#prod_imported#crop1:yes
            tmp = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_imported.*$/, 'yes', currentAnswers);
            tmp1 = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_imported.*$/, 'no', currentAnswers);
            console.log("S4_EC_04");
            tmp = (tmp1 * 10) / (tmp + tmp1);
            Sharp.addScore([scoring, academic_scoring], 'ma_prod_imported', "@S4_EC_04_prod_imported_msr", tmp);
            //prod_imported
           
            
            //Level of involvement in the upgrading channels most products
            //S4_EC_04.mrkt_acc_selling#prod_upgrading#crop1:often    
            //Often= 10 Sometimes= 5 Very rarely=2 never = 0
            tmp = 0;
            a = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_upgrading.*$/, 'often', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_upgrading.*$/, 'sometimes', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_upgrading.*$/, 'very_rarely', currentAnswers);
            tmp += c;
            d = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#prod_upgrading.*$/, 'never', currentAnswers);
            tmp += d;
                
            tmp1 = ((a * 10) + (b * 5) + (c * 2) + (d * ZERO)) / (tmp > 0 ? tmp : 1);
            Sharp.addScore([scoring, academic_scoring], 'ma_prod_upgrading', "@S4_EC_04_prod_upgrading_msr", tmp1);
                
            //Existence of binding agreements with seller --> question not present in questionaire
            
                
            //Existence of binding agreements with buyer     
            tmp = 0;
            tmp1 = 0;
                
            a = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#buyer_agreement.*$/, 'satisfied_ok', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#buyer_agreement.*$/, 'satisfied_mixed', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#buyer_agreement.*$/, 'satisfied_ko', currentAnswers);
            tmp += c;
            
            //since not applicable has been added, i don't add to the total the answers 'not applicable'
            d = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#buyer_agreement.*$/, '_not_applicable', currentAnswers);
            //tmp += d;
            
            tmp1 = ((a * 10) + (b * 5) + (c * ZERO)) / (tmp > 0 ? tmp : 1);
              //  a = a > 0 ? (a * 10) / a : 0;
               // b = b > 0 ? (b * 5) / b : 0;
              // c = 0;
            Sharp.addScore([scoring, academic_scoring], 'ma_buyer_agreement', "@S4_EC_04_buyer_agreement_msr", tmp1);
            
         
            //S4_EC_04.mrkt_acc_selling#buyer_agreement#crop1:yes
            //Yes=10 , No = 0 
                
                
            //Percentage of products sold through direct selling
            //%/10=score  S4_EC_04.perc_direct_selling  -->S4_EC_04_perc_direct_selling_msr S4_EC_04.perc_direct_selling
                
                
            tmp = currentAnswers['S4_EC_04.perc_direct_selling'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ma_direct_selling', "@S4_EC_04_perc_direct_selling_msr", tmp / 10);
            }
            
                
                
            //Frequency of direct selling
            //Every week=10 every months=7 once per season=5 once a year=2 Never=0
            //S4_EC_04.mrkt_acc_selling#sold_frequency#crop1:  
            //every_week every_month  once_per_season once_a_year never
           /* tmp = 0;
            tmp1 = 0;
                
            a = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#sold_frequency.*$/, 'every_week', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#sold_frequency.*$/, 'every_month', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#sold_frequency.*$/, 'once_per_season', currentAnswers);
            tmp += c;
            d = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#sold_frequency.*$/, 'once_a_year', currentAnswers);
            tmp += d;
            e = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#sold_frequency.*$/, 'never', currentAnswers);
            tmp += e;
            tmp1 = ((a * 10) + (b * 7) + (c * 5) + (d * 2) + (e * ZERO)) / (tmp > 0 ? tmp : 1);
            Sharp.addScore([scoring, academic_scoring], 'ma_single_buyer', "@S4_EC_04_sold_frequency_msr", tmp1);
                */
            //Whether there is any product with only one available buyer          
            tmp = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#single_buyer.*$/, 'yes', currentAnswers);
            tmp1 = Moss.fn.count(/^S4_EC_04\.mrkt_acc_selling#single_buyer.*$/, 'no', currentAnswers);
            tmp = (tmp1 * 10) / (tmp + tmp1);
           
            Sharp.addScore([scoring, academic_scoring], 'ma_single_buyer', "@S4_EC_04_single_buyer_msr", tmp);
            
            //Whether products were sold and which types
            tmp = Moss.fn.countTokenizedText(/^S4_EC_04\.prd_sold$/, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 5},
                    {threshold: 5, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'ma_sold_prd', '@WPS', tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_04.adeq_imp");
            break;

        /*********************        
         *    Market prices  *
         *********************/
        case 'S4_EC_05':
            //NOTE: unpredictables lable has been changed to stable
            tmp = 0;
            tmp1 = 0;
            count = 0;
            /*
            - {value: stable, label: '@stable'}
            - {value: increasing, label: '@increasing'}
              - {value: decreasing, label: '@decreasing'}
              - {value: unpredicatable, label: '@unpredicatable'}
              - {value: high_enough, label: '@high_enough'}
              - {value: too_low, label: '@too_low'}
              - {value: other_specify, la
            */
                
             //   S4_EC_05.mrkt_prices#crop1#price_dscr:stable
            var cropsList = Moss.fn.matches(/^S4_EC_05\.mrkt_prices#crop[0-9]#price_dscr.*$/, undefined, currentAnswers);
            var animalsList = Moss.fn.matches(/^S4_EC_05\.mrkt_prices#animal_[0-9]#price_dscr.*$/, undefined, currentAnswers);
            for (i = 0; i < cropsList.length; i++) {
                if (cropsList[i].match_value === 'stable') {
                    tmp = tmp + 5;
                    count++;
                } else if (cropsList[i].match_value === 'increasing') {
                    tmp = tmp + 8;
                    count++;
                } else if (cropsList[i].match_value === 'high_enough') {
                    tmp = tmp + 10;
                    count++;
                } else {
                    //tmp = tmp + 0; jslint error                    
                    count++;
                }
            }
            /*for (i = 0; i < animalsList.length; i++) {
                if (animalsList[i].match_value === 'stable') {
                    tmp = tmp + 5;
                    count++;
                } else if (animalsList[i].match_value === 'increasing') {
                    tmp = tmp + 8;
                    count++;
                } else if (animalsList[i].match_value === 'high_enough') {
                    tmp = tmp + 10;
                    count++;
                } else {
                    //tmp = tmp + 0;
                    count++;
                }
            }*/
            Sharp.addScore([scoring, academic_scoring], 'mp_crops', "@DOF", ((tmp + tmp1) / count));
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_05.adeq_imp");
            break;
        
        /*******************************        
         *    Market access (selling)  *
         *******************************/
        case 'S4_EC_06':
            tmp = currentAnswers['S4_EC_06.mrkt_info_access'];
            if (tmp) {
                if (tmp === 'often') {
                    tmp1 = 10;
                } else if (tmp === 'sometimes') {
                    tmp1 = 5;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_info', "@O8V", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_06.adeq_imp");
            break;

        /***********        
         *    ICT  *
         ***********/
        case 'S4_EC_07':
            tmp1 = Moss.fn.count(/^S4_EC_07\.ict#.*#use.*$/, undefined, currentAnswers);
            if (tmp1 > 0) {
                tmp = Moss.fn.count(/^S4_EC_07\.ict#.*#use.*$/, 'yes', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 1},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 5},
                    {threshold: 4, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text with i18n                
                Sharp.addScore([scoring, academic_scoring], 'ict_devices', '@ICT', tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_07.adeq_imp");
            break;

        /*****************        
         *    Insurance  *
         *****************/
        case 'S4_EC_08':
            /*tmp = currentAnswers['S4_EC_08.insured'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'in_crops', "@HQE", tmp1);
            }
            */
            //Whether livestock/ crops / income/buildings are insured (Yes= 10, No= 0 (average of all))
            //tmp = Moss.fn.count(/^S4_EC_08\.insurance#.*(?!claimed)$/, 'yes', currentAnswers);
            tmp =  Moss.fn.count(/^S4_EC_08\.insurance#(?!.*claimed).*$/, 'yes', currentAnswers);
            tmp1 = Moss.fn.count(/^S4_EC_08\.insurance#(?!.*claimed).*$/, 'no', currentAnswers);
            if (tmp > 0) {
                tmp = (tmp * 10) / (tmp + tmp1);
            }
            Sharp.addScore([scoring, academic_scoring], 'in_insured', "@S4_EC_08_insured_msr", tmp);
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_08.adeq_imp");
            break;

        /*******************************        
         *    Major productive assets  *
         *******************************/
        case 'S4_EC_09':
            tmp = Moss.fn.matches(/^S4_EC_09\.mjr_prd_assets#.*#ranking.*$/, undefined, currentAnswers);
            if (tmp) {
                tmp1 = 0;
                for (i = 0; i < tmp.length; i++) {
                    if (tmp[i].match_value !== 'not_owned') {
                        tmp1++;
                    }
                }
                tmp1 = Sharp.rangeScale(tmp1, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 2, value: 5},
                    {threshold: 3, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'pa_quantity', "@IDQ", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_09.adeq_imp");
            break;

        /*************************        
         *    Main expenditures  *
         *************************/
        case 'S4_EC_10':
            tmp = Moss.fn.matches(/^S4_EC_10\.expenditures#[0-9]#item.*$/, undefined, currentAnswers);
            console.log("S4_EC_10");
            tmp1 = 0;
            if (tmp) {
                for (i = 0; i < tmp.length; i++) {
                    if (tmp[i].match_value === 'education') {
                        if (tmp[i].match_key === 'S4_EC_10.expenditures#1#item') {
                            tmp1 = 10;
                        } else if (tmp[i].match_key === 'S4_EC_10.expenditures#2#item') {
                            tmp1 = 8;
                        } else if (tmp[i].match_key === 'S4_EC_10.expenditures#3#item') {
                            tmp1 = 6;
                        } else if (tmp[i].match_key === 'S4_EC_10.expenditures#4#item') {
                            tmp1 = 4;
                        } else if (tmp[i].match_key === 'S4_EC_10.expenditures#5#item') {
                            tmp1 = 2;
                        }
                        break;
                    }
                }
                Sharp.addScore([scoring, academic_scoring], 'me_ranking', "@GWG", tmp1);
            }
            //Whether they are appropriately rewarded             
            tmp = currentAnswers["S4_EC_10.financially_rewarded"];
            if (tmp !== '_not_applicable') {
                Sharp.addScore([scoring, academic_scoring], 'me_ranking', "@S4_EC_10_financially_rewarded_msr", tmp === "yes" ? 10 : 0);
            }
            
            
            //Whether their debts  could generate imminent bankruptcy    
            tmp = currentAnswers["S4_EC_10.debts_threat"];
            if (tmp !== '_not_applicable') {
                Sharp.addScore([scoring, academic_scoring], 'me_ranking', "@S4_EC_10_debts_threat_msr", tmp === "yes" ? 0 : 10);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_10.adeq_imp");
            break;

        /**********************        
         *    Income sources  *
         **********************/
        case 'S4_EC_11':
            console.log('S4_EC_11');
            //# of different income sources 
            tmp = currentAnswers['S4_EC_11.income_src_qty'];
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'is_quantity', "@S4_EC_11_income_source_msr", tmp1);
            }
            //Evolution of the economic outcome
            tmp = currentAnswers["S4_EC_11.economic_outcome"];
            if (tmp) {
                if (tmp === "deficit_increase") {
                    tmp1 = 0;
                } else if (tmp === "deficit_stable") {
                    tmp1 = 2;
                } else if (tmp === "deficit_no") {
                    tmp1 = 4;
                } else if (tmp === "profit_stable") {
                    tmp1 = 8;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'is_quantity', "@S4_EC_11_economic_outcome_msr", tmp1);
            }
            
            
            //Share of the governmental support over total agricultural income            
            tmp = currentAnswers["S4_EC_11.gov_support_perc"];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'is_quantity', "@S4_EC_11_gov_support_perc_msr",
                    Sharp.rangeScale(tmp, [
                        {threshold: 10, value: 10},
                        {threshold: 30, value: 7},
                        {threshold: 45, value: 5},
                        {threshold: 60, value: 3},
                        {threshold: Number.POSITIVE_INFINITY, value: 0}
                    ]));
            }
            
                
            //Whether the farm could  survive without government support 
            tmp = currentAnswers["S4_EC_11.no_gov_support_surv"];
            Sharp.addScore([scoring, academic_scoring], 'is_quantity', "@S4_EC_11_no_gov_support_surv_msr", tmp === "yes" ? 10 : 0);
            /*
            "S4_EC_11_economic_outcome_msr"
            "S4_EC_11_gov_support_perc_msr"
            "S4_EC_11_no_gov_support_surv_msr"
            "S4_EC_11_income_source_msr"

            */
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_11.adeq_imp");
            break;

        /**************************************************        
         *    Nonfarm income generating activities (IGA)  *
         **************************************************/
        case 'S4_EC_12':
            //IGAs external to the farm
            tmp = currentAnswers['S4_EC_12.nonfarm_iga'];
            if (tmp) {
                if (tmp === '_all_year') {
                    tmp1 = 10;
                } else if (tmp === '_seasonally') {
                    tmp1 = 7;
                } else if (tmp === '_occasionally') {
                    tmp1 = 3;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'iga_nonfarm_iga', "@S4_EC_12_nonfarm_iga_msr", tmp1);
            }
            //Subsistence of the farm without the income external to the farm
            if (tmp !== '_no') {
                tmp = currentAnswers["S4_EC_12.subsist_nonfarm_iga"];
                Sharp.addScore([scoring, academic_scoring], 'iga_subsist_nonfarm_iga', "@S4_EC_12_subsist_nonfarm_iga_msr", tmp === "yes" ? 10 : 0);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_12.adeq_imp");
            break;

        /*************************        
         *    Local farm inputs  *
         *************************/
        case 'S4_EC_13':
            count = 0;
            tmp1 = 0;
            //Average distance from the main inputs
            tmp = Moss.fn.matches(/^S4_EC_13\.inputs_accessibility#.*#access.*$/, undefined, currentAnswers);
            for (i = 0; i < tmp.length; i++) {
                if (tmp[i].match_value === 'yes_easily') {
                    tmp1 = tmp1 + 10;
                    count++;
                } else if (tmp[i].match_value === 'false') {
                    count++;
                } else {
                    //do nothing, don't count
                    console.log("");
                }
            }
            if (count > 0) {
                Sharp.addScore([scoring, academic_scoring], 'fi_distance', "@VJP", (tmp1 / count));
            }
                
            //Share of on-farm inputs
            tmp = currentAnswers["S4_EC_13.onfarm_inputs"];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'fi_share', "@S4_EC_13_onfarm_inputs_msr", (tmp / 10));
            }
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_13.adeq_imp");
            break;
        
        /**************************************************        
         *    Nonfarm income generating activities (IGA)  *
         **************************************************/
        case 'S4_EC_14':
            tmp = currentAnswers['S4_EC_14.savings'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'savings', "@SUO", tmp1);
            }
            tmp = currentAnswers['S4_EC_14.more_savings_than_5yr_ago'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'increased_savings', "@DJO", (tmp === 'yes' ? 10 : 0));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_14.adeq_imp");
            break;
                
         /**************************************************        
         *    Investment to adapt or transform the farm   *
         **************************************************/
        case 'S4_EC_15':
            tmp = currentAnswers['S4_EC_15.financial_resources'];
            if (tmp === 'manov_yes') {
                Sharp.addScore([scoring, academic_scoring], 'ia_financial_resources', "@S4_EC_15_financial_resources_msr", 10);
            } else if (tmp === 'manov_room') {
                Sharp.addScore([scoring, academic_scoring], 'ia_financial_resources', "@S4_EC_15_financial_resources_msr", 5);
            } else {
                Sharp.addScore([scoring, academic_scoring], 'ia_financial_resources', "@S4_EC_15_financial_resources_msr",  0);
            }
            /*tmp = currentAnswers['S4_EC_15.investments'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ia_investments', "@S4_EC_15_investments_msr", (tmp === 'yes' ? 10 : 0));
            }*/
            
            //Financial capacity to maintain a good state of operation of the equipment   
            tmp = currentAnswers['S4_EC_15.financial_capacity'];
            Sharp.addScore([scoring, academic_scoring], 'ia_financial_capacity', "@S4_EC_15_financial_capacity_msr",  (tmp === 'yes' ? 10 : 0));
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_15.adeq_imp");
            break;
         
        /**************************************************        
         *    Interaction between stakeholders of the value chain    *
         **************************************************/
        case 'S4_EC_16':
            console.log('S4_EC_16');
         
            //Level of commercialization of the main products  =>
            //S4_EC_16.interaction#commercialize#crop1
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#commercialize.*$/, 'agroindustry', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#commercialize.*$/, 'agricoop', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_16\.interaction#commercialize.*$/, 'selling_to_retailer', currentAnswers);
            tmp += c;
            d = Moss.fn.count(/^S4_EC_16\.interaction#commercialize.*$/, 'local_coop', currentAnswers);
            tmp += d;
            e = Moss.fn.count(/^S4_EC_16\.interaction#commercialize.*$/, 'direct_selling', currentAnswers);
            tmp += e;
            tmp1 = tmp > 0 ? ((a * 2) + (b * 6) + (c * 8) + (d * 8) + (e * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_commercialize', "@S4_EC_16_commercialize_msr", tmp1);

                
                
            //Self-perception of the farmer about his role in the food system => self_consider
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#self_consider#.*$/, 'stakeholder', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#self_consider#.*$/, 'individual_entity', currentAnswers);
            tmp += b;
            tmp1 = tmp > 0 ? (a * 10) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_self_consider', "@S4_EC_16_self_consider_msr", tmp1);
            
        
            
            //Level of the farmers’ participation in the determination of the specifications of his produce => local regional federal
            //S4_EC_16.interaction#participation_local#crop1
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#participation_local.*$/, 'a_little', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#participation_local.*$/, 'a_lot', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_16\.interaction#participation_local.*$/, 'not_at_all', currentAnswers);
            tmp += c;
            tmp1 = tmp > 0 ? ((a * 4) + (b * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_participation', "@S4_EC_16_participation_local_msr", tmp1);
            
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#participation_regional.*$/, 'a_little', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#participation_regional.*$/, 'a_lot', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_16\.interaction#participation_regional.*$/, 'not_at_all', currentAnswers);
            tmp += c;
            tmp1 = tmp > 0 ? ((a * 6) + (b * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_participation', "@S4_EC_16_participation_regional_msr", tmp1);
            
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#participation_federal.*$/, 'a_little', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#participation_federal.*$/, 'a_lot', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_16\.interaction#participation_federal.*$/, 'not_at_all', currentAnswers);
            tmp += c;
            tmp1 = tmp > 0 ? ((a * 8) + (b * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_participation', "@S4_EC_16_participation_federal_msr", tmp1);
                
            //Level of negotiation power => contract_farming  
            //S4_EC_16.interaction#contract_farming#crop2:yes
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#contract_farming#.*$/, 'yes', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#contract_farming#.*$/, 'no', currentAnswers);
            tmp += b;
            tmp1 = tmp > 0 ? (a * 10) / tmp : 0;
            if (tmp > 0) {
                Sharp.addScore([scoring, academic_scoring], 'ibs_contract_farming', "@S4_EC_16_self_contract_farming_msr", tmp1);
            }
            //Main Stakeholder determining the production     
            tmp = 0;
            tmp1 = 0;
            a = Moss.fn.count(/^S4_EC_16\.interaction#what_production#.*$/, 'you', currentAnswers);
            tmp += a;
            b = Moss.fn.count(/^S4_EC_16\.interaction#what_production#.*$/, 'you_and_farmers', currentAnswers);
            tmp += b;
            c = Moss.fn.count(/^S4_EC_16\.interaction#what_production#.*$/, 'stakeholders', currentAnswers);
            tmp += c;
            tmp1 = tmp > 0 ? ((a * 10) + (b * 10)) / tmp : 0;
            Sharp.addScore([scoring, academic_scoring], 'ibs_what_production', "@S4_EC_16_what_production_msr", tmp1);

            //Awareness of  citizen-consumers
            tmp = currentAnswers["S4_EC_16.citizend_aware"];
            if (tmp === 'not_enough') {
                tmp1 = 2;
            } else if (tmp === 'true') {
                tmp1 = 10;
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'ibs_citizend_aware', "@S4_EC_10_citizend_aware_msr", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_16.adeq_imp");
            break;
        default:
        }
        
        //CHANGES_TO_SCORING
       scoring.score_final = Sharp.sum([scoring.score_calculated, scoring.score_adequacy, scoring.score_importance]);
       academic_scoring.score_final = academic_scoring.score_calculated;
       
        
        currentAnswers[cqid + "._scoring"] = scoring;
        currentAnswers[cqid + "._academic_scoring"] = academic_scoring;
    };
    
    Sharp.addScore = function (scoring, id, component, value) {
        var i;
        for (i = 0; i < scoring.length; i++) {
            if (value === undefined) {
                scoring[i].score_components[scoring[i].score_components.length] = {id: id, label: component, value: "not_applicable"};
                continue;
            } else {
                value = parseFloat(value.toFixed(1));
            }

            scoring[i].number_of_score_components++;
            scoring[i].score_components[scoring[i].score_components.length] = {id: id, label: component, value: value};
            scoring[i].score_calculated_sum += value;
            scoring[i].score_calculated = parseFloat((scoring[i].score_calculated_sum / scoring[i].number_of_score_components).toFixed(1));
        }
    };
    
    Sharp.totalNumberOfAnimalCategories = function () {
        try {
            var lvstck = Moss.fn.currentSurvey().answers.S4_PSP_05;
            return Moss.fn.count(/^S4_PSP_05.lvst_practices#qty#.*$/, undefined, lvstck);
        } catch (err) {
            return 0;
        }
    };
    
    Sharp.rangeScale = function (value, rangeScale) {
        var i, scaleItem;
        for (i = 0; i <= rangeScale.length; i++) {
            scaleItem = rangeScale[i];
            if (value <= scaleItem.threshold) {
                return scaleItem.value;
            }
        }
        return rangeScale[rangeScale.length - 1].value;
    };
    
    Sharp.sum = function (array) {
        var sum = 0,
            i;
        if (!array) {
            return 0;
        }
        for (i = 0; i < array.length; i++) {
            if (array[i] && !isNaN(array[i])) {
                sum += parseFloat(array[i]);
            }
        }
        return parseFloat(sum.toFixed(1));
    };
    
    Sharp.addAdequcyImportanceScore = function (scoring, answers, fields) {
        
        var i, val, fname, adqSum = 0, impSum = 0, adqCount = 0, impCount = 0;

        if (!$.isArray(fields)) {
            fields = [fields];
        }
        
        for (i = 0; i < fields.length; i++) {
            fname = fields[i] + ':adq';
            val = answers[fname];
            if (val) {
                val = parseFloat(val);
                scoring[fname] = val;
                adqSum += val;
                adqCount++;
            } else {
                delete scoring.score_adequacy;
            }
            fname = fields[i] + ':imp';
            val = answers[fname];
            if (val) {
                val = parseFloat(val);
                scoring[fname] = val;
                impSum += val;
                impCount++;
            } else {
                delete scoring.score_importance;
            }
        }

        if (adqCount > 0) {
            scoring.score_adequacy = Sharp.truncate(adqSum / adqCount, 1);
        }
        if (impCount > 0) {
            scoring.score_importance = Sharp.truncate(impSum / impCount, 1);
        }
    };
    
    Sharp.truncate = function (n, i) {
        return parseFloat(n.toFixed(i));
    };

    
    Sharp.loadIndividual = function (callback) {
        var i,
            key,
            currentAnswers = Moss.fn.currentSurvey().answers,
            scoring,
            academic_scoring,
            s,
            ret = {superGroupName: Moss.fn.currentSuperGroupName(),
                   survey: {},
                   all_surveys: [],
                   avgScoring: {},
                   avgScoringWOSA: {},
                   avgAcademicScoring: {},
                   avgSelfAssessmentScoring: {},
                   group: {name: Moss.model.groupName, id: Moss.model.groupId, avgScoring: {}},
                   groups: []
                  },
            series,
            survey = ret.survey,
            validScoring = function (scoring) {
                return scoring && (scoring.number_of_score_components > 0 || scoring.score_adequacy || scoring.score_importance);
            },
            //receives an array of values and replaces it with a unique value, the avg
            avg = function (map) {
                var key, a, i, n, sum;
                if (!map) {
                    return;
                }
                for (key in map) {
                    if (map.hasOwnProperty(key)) {
                        n = 0;
                        sum = 0;
                        a = map[key];
                        if (!$.isArray(a)) {
                            continue;
                        }
                        for (i = 0; i < a.length; i++) {
                            if ($.isNumeric(a[i])) {
                                n++;
                                sum += a[i];
                            }
                        }
                        if (n > 0) {
                            map[key] = parseFloat((sum / n).toFixed(1));
                        } else {
                            map[key] = 0;
                        }
                        
                    }
                }
            },
            partialCopy = function (person, answer, key) {
                var valid = false;
                if (key === 'S0_INFO') {
                    person.general_info = answer;
                    return;
                }
                if (answer.valid !== true) {
                    return;
                }
                                
                scoring = answer[key + '._scoring'];
                if (scoring) {
                    valid = true;
                    person[key] = {};
                    person[key].scoring = scoring;
                }
                
                academic_scoring = answer[key + '._academic_scoring'];
                if (academic_scoring) {
                    valid = true;
                    if (!person[key]) {
                        person[key] = {};
                    }
                    person[key].academic_scoring = academic_scoring;
                }
                if (valid) {
                    person[key].title = Moss.fn.getQuestionById(key).title;
                }
            };
        
        survey.general_info = currentAnswers.S0_INFO || {};
        //Moss.model.surveySchema.hasOwnProperty(key) added because different schemas may be loaded, so only answers and questions
        Moss.fn.loadSurveySchema(Moss.fn.settings.surveyNameAndVersion, function () {
            var k;
         //for(var questionId in Moss.model.surveySchema) {}
            for (k in currentAnswers) {
                if (currentAnswers.hasOwnProperty(k) && Moss.model.surveySchema.hasOwnProperty(k)) {
                    if (currentAnswers[k].valid !== true) {
                        continue;
                    }
                    scoring = currentAnswers[k][k + '._scoring'];
                    if (validScoring(scoring)) {
                        survey[k] = survey[k] || {};
                        //console.log("k" + k)
                        //console.log("survey[k].title" + survey[k].title)
                        //console.log("Moss.fn.getQuestionById(k)" + Moss.fn.getQuestionById(k))
                        survey[k].title = survey[k].title || Moss.fn.getQuestionById(k).title;
                        survey[k].scoring = scoring;
                        //console.log("k" + k + "... done")
                        
                    }
                    scoring = currentAnswers[k][k + '._academic_scoring'];
                    if (validScoring(scoring)) {
                        survey[k] = survey[k] || {};
                        survey[k].title = survey[k].title || Moss.fn.getQuestionById(k).title;
                        survey[k].academic_scoring = scoring;
                    }
                }
            }

            //Retrieve all data (all groups) for the current FFS (aka supergroup)
            Moss.svc.db.query(
                'SELECT moss_survey.group_id, moss_group.group_name, moss_survey.json FROM moss_supergroup, moss_group, moss_survey WHERE ' +
                    'moss_supergroup.id = moss_group.supergroup_id AND ' +
                    'moss_group.id = moss_survey.group_id AND ' +
                    'moss_supergroup.id = ?',
                [Moss.model.superGroupId]
            ).done(function (rows) {
                var person, answers, key, scoring, group, groupId, groupName, gid;
                for (i = 0; i < rows.length; i++) {
                    //console.log("GROUP_ID: "+rows[i].group_id )
                    s = JSON.parse(rows[i].json);
                    groupId = rows[i].group_id;
                    groupName = rows[i].group_name;
                    group = null;
                    //console.log(s);
                    answers = s.answers || {};
                    person = {};

                    var found = false;
                    for (gid in ret.groups) {
                        if (ret.groups.hasOwnProperty(gid)) {
                            if (ret.groups[gid].groupId === groupId) {
                                group = ret.groups[gid];
                                break;
                            }
                        }
                        
                    }

                    if (!group) {
                        group = {};
                        group.groupId = groupId;
                        group.groupName = groupName;
                        group.avgScoring = {};
                        ret.groups.push(group);
                    }

                    //Moss.model.surveySchema.hasOwnProperty(key) added because different schemas may be loaded, so only answers and questions
                    for (key in answers) {
                        if (answers.hasOwnProperty(key) && Moss.model.surveySchema.hasOwnProperty(key)) {
                            partialCopy(person, answers[key], key);
                            if (answers[key].valid !== true) {
                                continue;
                            }

                            scoring = answers[key][key + '._scoring'];
                            if (validScoring(scoring)) {
                                //The concat() method is used to join two or more arrays.

                                //group.avgScoring[key] = group.avgScoring[key//] || {};

                                //ret.groups.push(group);
                                group.avgScoring[key] = group.avgScoring[key] || [];
                                group.avgScoring[key] = group.avgScoring[key].concat(scoring.score_final);


                                if (groupId === ret.group.id) {
                                    ret.group.avgScoring[key] = ret.group.avgScoring[key] || [];
                                    ret.group.avgScoring[key] = ret.group.avgScoring[key].concat(scoring.score_final);
                                }

                                ret.avgScoring[key] = ret.avgScoring[key] || [];
                                ret.avgScoring[key] = ret.avgScoring[key].concat(scoring.score_final);

                                ret.avgScoringWOSA[key] = ret.avgScoringWOSA[key] || [];
                                ret.avgScoringWOSA[key] = ret.avgScoringWOSA[key].concat(scoring.score_calculated);

                                ret.avgSelfAssessmentScoring[key] = ret.avgSelfAssessmentScoring[key] || [];
                                ret.avgSelfAssessmentScoring[key] = ret.avgSelfAssessmentScoring[key].concat(scoring.score_final - scoring.score_final);
                            }
                            scoring = answers[key][key + '._academic_scoring'];
                            if (validScoring(scoring)) {
                                ret.avgAcademicScoring[key] = ret.avgAcademicScoring[key] || [];
                                ret.avgAcademicScoring[key] = ret.avgAcademicScoring[key].concat(scoring.score_final);
                            }
                        }
                    }
                    if (!$.isEmptyObject(person)) {
                        ret.all_surveys[ret.all_surveys.length] = person;
                    }
                }

                for (key in ret.groups) {
                    if (ret.groups.hasOwnProperty(key)) {
                        avg(ret.groups[key].avgScoring);
                    }
                        
                }
                //avg(ret.avgScoring);   
                avg(ret.group.avgScoring);
                avg(ret.avgScoring);
                avg(ret.avgScoringWOSA);
                avg(ret.avgSelfAssessmentScoring);
                avg(ret.avgAcademicScoring);

                if (callback) {
                    callback(ret);
                }
            }).fail(function (tx, err) {
                throw new Error(err.message);
            });
            
        });
    };
        
    Sharp.requestCertificate = function (options) {
        var message, response;
        
        $.ajax({
            beforeSend: function () {
                Moss.ui.showLoader("Sending request...");
            },
            url: Moss.fn.getEndpoint() + "certificate",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            data: JSON.stringify(options),
            headers: {
                "user-id": Moss.settings.userId,
                "api-key": Moss.settings.apiKey
            },
            success: function (result) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    Moss.ui.notify("Your request has been sent. You'll receive an e-mail with the requested certificate.");
                }});
                //console.log(JSON.stringify(result));
            },
            error: function (xhr, status, error) {
                Moss.ui.hideLoader({timeout: 500, callback: function () {
                    message = "Error sending request";
                    if (xhr.responseText) {
                        try {
                            response = JSON.parse(xhr.responseText);
                            if (response.reason) {
                                message = message + ":<br/><br/>" + response.reason;
                            }
                        } catch (error) {
                        }
                    } else {
                        message = message + ". Please retry later.";
                    }
                    Moss.ui.notifyError(message);
                }});
                //console.log(xhr.responseText);
            }
        });
    };
    
    Sharp.applyLocationToAll = function () {
        var surveys, survey, s0_info, location, i;
        Moss.ui.showPopupMessage(
            {
                title: Moss.fn.string("@_confirm"),
                message: Moss.fn.string("@_apply_location_conf"),
                confirmLabel: Moss.fn.string("@_confirm"),
                cancelLabel: Moss.fn.string("@_cancel"),
                onConfirm: function () {
                    Moss.fn.bindToModel();
                    surveys = Moss.model.surveys;
                    s0_info = Moss.model.surveys[Moss.model.currentSurveyIdx].answers.S0_INFO;
                    location = {};
                    if (s0_info.hasOwnProperty("S0_INFO.country")) {
                        location["S0_INFO.country"] = s0_info["S0_INFO.country"];
                    }
                    if (s0_info.hasOwnProperty("S0_INFO.region")) {
                        location["S0_INFO.region"] = s0_info["S0_INFO.region"];
                    }
                    if (s0_info.hasOwnProperty("S0_INFO.district")) {
                        location["S0_INFO.district"] = s0_info["S0_INFO.district"];
                    }
                    if (s0_info.hasOwnProperty("S0_INFO.village")) {
                        location["S0_INFO.village"] = s0_info["S0_INFO.village"];
                    }
                    for (i = 0; i < surveys.length; i++) {
                        survey = surveys[i];
                        if (!survey.hasOwnProperty("answers")) {
                            survey.answers = {};
                        }
                        if (!survey.answers.hasOwnProperty("S0_INFO")) {
                            survey.answers.S0_INFO = {};
                        }
                        survey.answers.S0_INFO["S0_INFO.country"] = location["S0_INFO.country"];
                        survey.answers.S0_INFO["S0_INFO.region"] = location["S0_INFO.region"];
                        survey.answers.S0_INFO["S0_INFO.district"] = location["S0_INFO.district"];
                        survey.answers.S0_INFO["S0_INFO.village"] = location["S0_INFO.village"];
                    }
                }
            }
        );
    };

    Moss.register(Sharp);
    
    return Sharp;
    
}($, Moss, toastr));