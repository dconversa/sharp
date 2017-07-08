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
        //console.log("calculateScore");
      
        var scoring =
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
            tmp1;

       /* if ($.isEmptyObject(currentAnswers)) {
            Moss.model.surveys[Moss.model.currentSurveyIdx].answers[cqid] = currentAnswers;
        }
        */
        switch (cqid) {
                
        /*****************        
         *    Household  *
         *****************/
        case 'S4_PSP_01':
            var people;
            // Role of elders
            tmp = ("yes" === currentAnswers['S4_PSP_01.elders_role#role#men'] || "yes" === currentAnswers['S4_PSP_01.elders_role#role#women']) ? 10 : 0;
            Sharp.addScore([scoring, academic_scoring], 'hh_elders_roles', "@DGI", tmp);
                
            // Who is unable to work due to health reasons?  
            tmp = Moss.fn.sum(/^S4_PSP_01\.hh_roles#unable_to_work#.*$/, currentAnswers);
            people = Moss.fn.sum(/^S4_PSP_01\.hh_composition#qty#.*$/, currentAnswers);
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
                Sharp.addScore([scoring, academic_scoring], 'hh_education', "@MNI", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 10, value: 2.5},
                    {threshold: 50, value: 5},
                    {threshold: 75, value: 7.5},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]));
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
                
        /*****************        
         *    Crops      *
         *****************/
        case 'S4_PSP_04':
            tmp = currentAnswers['S4_PSP_04.growing_perennial_crops'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'cp_growing', "@TPI", (tmp === 'yes' ? 10 : 0));
            }

            tmp = Moss.fn.count(/^S4_PSP_04\.crops#.*#has$/, true, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'cp_species', "@LYA", Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 2, value: 4},
                {threshold: 3, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]));
            
                 
            //count rows that have varieties >1
            tmp1 = Moss.fn.countConditionalValue(/^S4_PSP_04\.crops#.*#varieties.*int$/, /^0*[2-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$/, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'cp_vars', "@Y0B", (tmp1 > 0 ? 10 : 0));
            //console.log("VMT DEBUG : varieties = " + tmp1);
           /*
            tmp1 = Moss.fn.sum(/^S4_PSP_04\.crops#.*#varieties.*int$/, undefined, currentAnswers);
            if (tmp > 0) {
                tmp1 = Math.round(tmp1 / tmp);
                Sharp.addScore([scoring, academic_scoring], 'cp_vars', "@Y0B", Sharp.rangeScale(tmp1, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }*/
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_04.adeq_imp");
            break;
                
        /*****************        
         *    Livestock  *
         *****************/
        case 'S4_PSP_05':
            var i, n, _N, _D;
            tmp = Moss.fn.count(/^S4_PSP_05\.lvst_practices#qty#.*$/, undefined, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ls_practices', Moss.fn.string("@PRU"), tmp1);
            }
            _N = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#qty#.*$/, currentAnswers);
                
            tmp1 = Moss.fn.countConditionalValue(/^S4_PSP_05\.lvst_practices#breeds#.*$/, /^0*[2-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$/, currentAnswers);
            Sharp.addScore([scoring, academic_scoring], 'ls_breeds', "@YO4", (tmp1 > 0 ? 10 : 0));
            /*    
            tmp1 = Moss.fn.sum(/^S4_PSP_05\.lvst_practices#breeds#.*$/, currentAnswers);
            //console.log("VMT DEBUG : " + tmp + " - " + tmp1);
            if (tmp > 0) {
                tmp1 = Math.round(tmp1 / tmp);
                Sharp.addScore([scoring, academic_scoring], 'ls_breeds', "@YO4", Sharp.rangeScale(tmp1, [
                    {threshold: 0, value: 0},
                    {threshold: 5, value: 3},
                    {threshold: 10, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
            */
            tmp1 = Moss.fn.matches(/^S4_PSP_05\.lvst_practices#qty#.*$/, undefined, currentAnswers);
            if (tmp1 && tmp1.length > 0 && _N > 0) {
                n = 0;
                for (i = 0; i < tmp1.length; i++) {
                    n = n + (tmp1[i].match_value * (tmp1[i].match_value - 1));
                    //console.log("VMT SYMPSON (n): " + n);
                }
//                console.log("VMT SYMPSON (N): " + _N);
                _D = n / (_N * (_N - 1));
//                console.log("VMT SYMPSON (D) : " + _D);
//                console.log("VMT SYMPSON FINAL (1-D) : " + (1 - _D).toFixed(2));
                tmp = (1 - _D) * 10;
                //Sharp.addScore([scoring, academic_scoring], 'ls_practices', 'Bio-diversity', tmp);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_05.adeq_imp");
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
                totalNumberOfAnimalCategories = Sharp.totalNumberOfAnimalCategories();
            tmp = Moss.fn.countTokenizedText(/^S4_PSP_07\.animal_nutrition#food_suppl_dscr#.*$/, currentAnswers);
            tmp += grazing;

            if (totalNumberOfAnimalCategories > 0) {
                tmp = Math.round(tmp / totalNumberOfAnimalCategories);
                Sharp.addScore([scoring, academic_scoring], 'an_foods',  "@WKK", Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 5},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
                
                tmp = (grazing / totalNumberOfAnimalCategories) * 10;
                Sharp.addScore([scoring, academic_scoring], 'an_grazing',  "@XJH", tmp);
            }
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_07.adeq_imp");
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
                tmp1 = Math.round(tmp1 / tmp);
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'ac_breeds', '@AVG', Sharp.rangeScale(tmp1, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]));
            }
                
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
                
        /****************************        
         *    Seed breed sources    *
         ****************************/
        case 'S4_PSP_08':
            var seedSources = Moss.fn.count(/^S4_PSP_08\.seed_breed_src#.*#seed$/, 'yes', currentAnswers),
                breedSources = Moss.fn.count(/^S4_PSP_08.seed_breed_src#.*#breed$/, 'yes', currentAnswers);

            if (crops) {
                if (seedSources === 0) {
                    tmp = 0;
                } else if (seedSources === 1 && currentAnswers['S4_PSP_08.seed_breed_src#own_production#seed'] === 'yes') {
                    tmp = 4;
                } else if (seedSources === 1 && currentAnswers['S4_PSP_08.seed_breed_src#own_production#seed'] !== 'yes') {
                    tmp = 2;
                } else if (seedSources === 2) {
                    tmp = 6;
                } else if (seedSources > 2) {
                    tmp = 10;
                }
                
                tmp1 = Sharp.rangeScale(seedSources, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                
                Sharp.addScore([scoring, academic_scoring], 'sbs_number', "@MLY", tmp);
                
                Sharp.addScore([scoring, academic_scoring], 'sbs_sources', "@KV9", tmp1);
            }

            if (livestock) {
                if (breedSources === 0) {
                    tmp = 0;
                } else if (breedSources === 1 && currentAnswers['S4_PSP_08.seed_breed_src#own_production#breed'] === 'yes') {
                    tmp = 4;
                } else if (breedSources === 1 && currentAnswers['S4_PSP_08.seed_breed_src#own_production#breed'] !== 'yes') {
                    tmp = 2;
                } else if (breedSources === 2) {
                    tmp = 6;
                } else if (breedSources > 2) {
                    tmp = 10;
                }
                
                tmp1 = Sharp.rangeScale(breedSources, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                
                Sharp.addScore([scoring, academic_scoring], 'sbs_ls_number', "@TVA", tmp);
                Sharp.addScore([scoring, academic_scoring], 'sbs_ls_sources', "@D5A", tmp1);
            }
                
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_PSP_08.adeq_imp_seed", "S4_PSP_08.adeq_imp_breed"]);
            break;
                
        /*************************************************        
         *    Utilisation of new varieties and breeds    *
         *************************************************/
        case 'S4_PSP_09':
            var count, myscore;
            count = 0;
            tmp = 0;
            tmp1 = 0;
            count = 2;
                console.log("count", count);
            if (currentAnswers['S4_PSP_09.use_new_varieties_15yrs'] === 'yes') {
                Sharp.addScore([scoring, academic_scoring], 'ub_specs_15', "@T4B", 0);
                tmp = Moss.fn.sum(/^S4_PSP_09\.crop_imprv_perc/, undefined, currentAnswers);
            } else {
                tmp = 0;
                Sharp.addScore([scoring, academic_scoring], 'ub_specs_15', "@T4B", 10);
            }
            console.log("scoring", scoring);
            console.log("academic_scoring", academic_scoring);
            console.log("tmp", tmp);
            if (currentAnswers['S4_PSP_09.use_new_varieties_30yrs'] === 'yes') {
                Sharp.addScore([scoring, academic_scoring], 'ub_specs_30', "@SNH", 0);
                tmp1 = Moss.fn.sum(/^S4_PSP_09\.breed_non_lcl_perc/, undefined, currentAnswers);
            } else {
                tmp1 = 0;
                Sharp.addScore([scoring, academic_scoring], 'ub_specs_30', "@SNH", 10);
            }
            console.log("scoring", scoring);
            console.log("academic_scoring", academic_scoring);
            console.log("tmp1", tmp1);
            if (count > 0) {
                myscore = Sharp.rangeScale(((tmp + tmp1) / count), [
                    {threshold: 25, value: 10},
                    {threshold: 50, value: 6},
                    {threshold: 75, value: 3},
                    {threshold: 100, value: 1}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ub_no_lcl', "@UNQ| KPI 2.2", myscore);               
                console.log("myscore", myscore);
                console.log("scoring", scoring);
                console.log("academic_scoring", academic_scoring);
                myscore = Sharp.rangeScale(Math.round(((tmp + tmp1) / count)), [
                    {threshold: 0, value: 0},
                    {threshold: 10, value: 4},
                    {threshold: 20, value: 6},
                    {threshold: 30, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ub_no_lcl_academic', "@UNQ| KPI 7.5", myscore);
                console.log("myscore", myscore);
                console.log("scoring", scoring);
                console.log("academic_scoring", academic_scoring);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_09.adeq_imp");
            break;
                
        /********************************        
         *    Trees and Agroforestry    *
         ********************************/
        case 'S4_PSP_10':
            if (currentAnswers['S4_PSP_10.planted_trees'] === 'yes') {
                Sharp.addScore([scoring, academic_scoring], 'ta_planted', "JOF", 10);
                tmp = Moss.fn.sum(/^S4_PSP_10\.trees_planted_qty/, undefined, currentAnswers);
                if (tmp === 0) {
                    Sharp.addScore([scoring, academic_scoring], 'ta_tree_numbers', "@Z4L", 0);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'ta_tree_numbers', "@Z4L", 10);
                }
                tmp = Moss.fn.countTokenizedText(/^S4_PSP_10\.trees_planted_species/, currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 1},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 5},
                    {threshold: 3, value: 7},
                    {threshold: 4, value: 9},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                tmp = currentAnswers['S4_PSP_10.trees_planted_var_of_same_spec'];
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'ta_vars', "@NOA", (tmp === 'yes' ? 10 : 0));
                }
                Sharp.addScore([scoring, academic_scoring], 'ta_tree_specs', "@KTC", tmp1);
                if (!currentAnswers['S4_PSP_10.trees_nat_use:no_use']) {
                    tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_10\.trees_nat_use:(natural_remed_ani|natural_remed_peo|crops_protection)$/, true, currentAnswers), [
                        {threshold: 0, value: 0},
                        {threshold: 1, value: 7},
                        {threshold: Number.POSITIVE_INFINITY, value: 10}
                    ]);
                    
                    Sharp.addScore([scoring, academic_scoring], 'ta_prods_use', "@L2F", tmp);
                } else {
                    Sharp.addScore([scoring, academic_scoring], 'ta_prods_use', "@L2F", 0);
                }
            } else {
                Sharp.addScore([scoring, academic_scoring], 'ta_planted', "@JOF", 0);
            }
            tmp = currentAnswers['S4_PSP_10.trees_nat_present'];
            if (tmp) {
                if (tmp === '0') {
                    tmp1 = 0;
                } else if (tmp === '5') {
                    tmp1 = 2;
                } else if (tmp === '15') {
                    tmp1 = 7;
                } else if (tmp === '30') {
                    tmp1 = 10;
                } else if (tmp === '50') {
                    tmp1 = 7;
                } else {
                    tmp1 = 1;
                }
                Sharp.addScore([scoring, academic_scoring], 'ta_percent_land_academic', "@TWD| KPI 2.6", tmp1);
                if (tmp === '0') {
                    tmp1 = 0;
                } else if (tmp === '5') {
                    tmp1 = 2;
                } else if (tmp === '15') {
                    tmp1 = 6;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ta_percent_land', "@TWD| KPI 6.2", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_10.adeq_imp");
            break;

        /***********************************        
         *    Crop and livestock losses    *
         ***********************************/
        case 'S4_PSP_11':
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
            tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_12\.record_keeping#(?!stories).*$/, 'yes', currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'rk', '@S3H', tmp);
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
                {threshold: 1, value: 5},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'i_access', "@ESR", tmp);
            tmp = currentAnswers['S4_PSP_13.infrastructure#cereal_bank#building_access'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'i_cereals_access', "@R3D", (tmp === 'yes' ? 10 : 0));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_13.adeq_imp");
            break;

        /*************************************************************************************************        
         *    Access to information climate change, cropping practices, and meteorological previsions    *
         *************************************************************************************************/
        case 'S4_PSP_14':
            tmp = currentAnswers['S4_PSP_14.access_to_weather_frcst'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ai_meteo_fcst', "@XKM", (tmp === 'yes' ? 10 : 0));
            }

            tmp = currentAnswers['S4_PSP_14.access_to_cropping_pract_info'];
            //tmp = Moss.fn.count(/^S4_PSP_14\.cropping_pract_source_of_info#.*/, true, currentAnswers);
            
            tmp1 = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_14\.cropping_pract_source_of_info.*/, true, currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 4},
                {threshold: 2, value: 8},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'ai_info_sources', "@QHR| KPI 3.3", tmp1);
            Sharp.addScore([scoring, academic_scoring], 'ai_info_sources_academic', "@QHR| KPI 9.3", (tmp1 === 5 ? 8 : tmp1));
            /*if (tmp && tmp === 'yes') {
                if (currentAnswers['S4_PSP_14.cropping_pract_source_of_info:ffs_apfs'] === true ||
                        currentAnswers['S4_PSP_14.cropping_pract_source_of_info:extension_agent'] === true ||
                        currentAnswers['S4_PSP_14.cropping_pract_source_of_info:other_farmers'] === true) {
                    tmp1 = 10;
                } else if (currentAnswers['S4_PSP_14.cropping_pract_source_of_info:other_specify'] === true) {
                    tmp1 = 5;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'ai_info_sources', "@QHR| KPI 3.3", tmp1);
                Sharp.addScore([scoring, academic_scoring], 'ai_info_sources_academic', "@QHR| KPI 9.3", (tmp1 === 5 ? 8 : tmp1));
            }*/
            tmp = currentAnswers['S4_PSP_14.clim_chg_witness'];
            if (tmp) {
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'ai_climate_change_witnessing', '@WCC', (tmp === 'yes' ? 10 : 0));
            }
            tmp = Moss.fn.count(/^S4_PSP_14\.cropping_pract_source_of_info:(ffs_apfs|extension_agent|other_farmers)$/, true, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text i18n
                Sharp.addScore([scoring, academic_scoring], 'ai_info_selected_sources', '@ACI', tmp1);
            }
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_PSP_14.adeq_imp_cp_info", "S4_PSP_14.adeq_imp_meteo_info"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_14.adeq_imp_meteo_info");
            break;

        /*******************************************        
         *    Animal diseases control practices    *
         *******************************************/
        case 'S4_PSP_15':
            // TODO manage academic_scoring
            tmp = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_15\.practices#.*(response)$/, 'yes', currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 5},
                {threshold: 2, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'ad_practices', "@IDC", tmp);
            tmp = Sharp.rangeScale(Moss.fn.countTokenizedText(/^S4_PSP_15\.practices#natural_remedies#description$/, currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            // TODO replace text with i18n
            Sharp.addScore([scoring, academic_scoring], 'ad_practices_natural', '@NAD', tmp);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_15.adeq_imp");
            break;

        /********************************        
         *    Pest control practices    *
         ********************************/
        case 'S4_PSP_16':
            tmp = currentAnswers['S4_PSP_16.use_pest_ctrl'];
            if (tmp && tmp === 'yes') {
                tmp1 = Sharp.rangeScale(Moss.fn.count(/^S4_PSP_16\.pest_ctrl_practices.*/, true, currentAnswers), [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 5},
                    {threshold: 2, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'pc_practices', "@I4H", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_16.adeq_imp");
            break;

        /*********************************        
         *    Synthetic Pesticide use    *
         *********************************/
        case 'S4_PSP_17':
            // TODO manage academic_scoring
            var cnt = 0;
            tmp1 = 0;
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#insecticide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    tmp = currentAnswers['tmp = S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#insecticide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
            }
                
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#herbicide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    tmp = currentAnswers['tmp = S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#herbicide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
            }
                
            tmp = currentAnswers['S4_PSP_17.last_cropping_season#synth_pesticides#fungicide'];
            if (tmp) {
                cnt++;
                if (tmp === 'yes') {
                    
                    tmp = currentAnswers['tmp = S4_PSP_17.last_cropping_season#look_for_pests_bfr_spraying#fungicide'];
                    if (tmp && tmp === 'yes') {
                        tmp1 += 5;
                    } else {
                        tmp1 += 0;
                    }
                } else {
                    tmp1 += 10;
                }
            }
            if (cnt > 0) {
                tmp1 = tmp1 / count;
            }
                
            Sharp.addScore([scoring, academic_scoring], 'sp_use', "@RYC", tmp1);
                
            var score;
         
            //tmp = Moss.fn.count(/^S4_PSP_17\.last_cropping_season#synth_pesticides#.*/, 'yes', currentAnswers);
            //if (tmp === 0) {
            ///    score = 10;
            //} else {
            //    tmp1 = Moss.fn.count(/^S4_PSP_17\.last_cropping_season#look_for_pests_bfr_spraying#.*/, 'yes', currentAnswers);
            //    // Note : not response to the above equals to "no"
            //    if (tmp1 > 0) {
            //        score = 5;
            //    } else {
            //        score = 0;
            //    }
            //}
            //Sharp.addScore([scoring, academic_scoring], 'sp_use', "@RYC", score);
               
                
            tmp = Moss.fn.count(/^S4_PSP_17\.containers_disposal.*/, true, currentAnswers);
            if (tmp === 0) {
                score = 10;
            } else {
                tmp1 = currentAnswers['S4_PSP_17.containers_disposal:to_collectors'];
                if (tmp1 && tmp1 === true) {
                    score = 10;
                }
                tmp1 = currentAnswers['S4_PSP_17.containers_disposal:thrown_away'];
                if (tmp1 && tmp1 === true) {
                    score = 6;
                }
                if (currentAnswers['S4_PSP_17.containers_disposal:reused'] === true ||
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
            }
            Sharp.addScore([scoring, academic_scoring], 'sp_protective_gear', "@WT4", score);
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
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'intercropping', "@A0E", (tmp === 'yes' ? 10 : 0));
            }
            tmp = currentAnswers['S4_PSP_18.plant_and_aquacltr_intercropping'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'intercropping_aquaculture', "@ADG", (tmp === 'yes' ? 10 : 0));
            }
            tmp = currentAnswers['S4_PSP_18.intercropping_perc'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'intercropping_percentage', "@WZY", (tmp / 10));
            }
            
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_PSP_18.adeq_imp");
            break;

        /**********************        
         *    Governance 1    *
         **********************/
        case 'S4_GOV_01':
            // TODO manage academic_scoring
            tmp = currentAnswers['S4_GOV_01.awareness'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'awareness', "@YLDI", (tmp === 'yes' ? 10 : tmp === 'no' ? 0 : 4));
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
            tmp = Sharp.rangeScale(Moss.fn.count(/^S4_ENV_01\.water_access#[0-9]#type_of_wtr_src.*/, undefined, currentAnswers), [
                {threshold: 0, value: 0},
                {threshold: 1, value: 2},
                {threshold: 2, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'wa_sources', "@FRU", tmp);
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
                    {threshold: 2, value: 7},
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
            tmp = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, 'yes', currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 10},
                    {threshold: 1, value: 7},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 1},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'wa_quality', "@OWY", tmp1);
            } else {
                tmp = Moss.fn.count(/^S4_ENV_03\.water_quality#.*#response.*$/, 'no', currentAnswers);
                if (tmp) {
                    Sharp.addScore([scoring, academic_scoring], 'wa_quality', "@OWY", 0);
                }
            }
            tmp1 = 0;
            count = 0;
            tmp = currentAnswers['S4_ENV_03.adequacy_animal'];
            if (tmp) {
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
            break;

        /***********************        
         *    Land access    *
         ***********************/
        case 'S4_ENV_04':
            tmp = currentAnswers['S4_ENV_04.land_access#tot_accessible#private_plots'];
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 5, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
               /* tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);*/
                // TODO replace text with i18N
                Sharp.addScore([scoring, academic_scoring], 'la_private', '@TAP', tmp1);
            }
                
            tmp = currentAnswers['S4_ENV_04.land_access#tot_accessible#community_land'];
            if (tmp) {
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'la_community', '@TAC', (tmp >= 0 ? 10 : 0));
            }
            tmp = Moss.fn.sum(/^S4_ENV_04\.land_access#tot_numb_of_fields_w_access.*/, undefined, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 2, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'la_fields_access', "@DYW", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_04.adeq_imp");
            break;

        /**********************        
         *    Soil quality    *
         **********************/
        case 'S4_ENV_05':
            tmp = currentAnswers['S4_ENV_05.number_of_soil_types'];
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 2},
                {threshold: 2, value: 4},
                {threshold: 3, value: 6},
                {threshold: 4, value: 8},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'sq_types', "@OML", tmp1);
            tmp = Moss.fn.count(/^S4_ENV_05\.soil_degradation:.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 10},
                {threshold: 1, value: 7},
                {threshold: 2, value: 4},
                {threshold: 3, value: 1},
                {threshold: Number.POSITIVE_INFINITY, value: 0}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'sq_degradation', "@DH3", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_05.adeq_imp");
            break;

        /************************        
         *    Land management   *
         ************************/
        case 'S4_ENV_06':
            if (currentAnswers['S4_ENV_06.use_land_improving'] === 'yes') {
                tmp = Moss.fn.count(/^S4_ENV_06\.land_improving#.*#response.*$/, 'yes', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 6},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
            }
            Sharp.addScore([scoring, academic_scoring], 'lm_improving', '@XHU', tmp1);
  /*          if (currentAnswers['S4_ENV_06.use_land_improving'] === 'yes') {
                tmp = Moss.fn.count(/^S4_ENV_06\.land_improving#.*#response.*$/, 'yes', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 3},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 6},
                    {threshold: 4, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
            }
            Sharp.addScore([scoring, academic_scoring], 'lm_improving_academic', '@XHU', tmp1);
*/
            tmp = Moss.fn.count(/^S4_ENV_06\.land_improving#(crop_rotation|rotational_grazing|fallowing|zero_tillage|wind_break_hedge)#response.*$/, 'yes', currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            // TODO replace text with i18n
            Sharp.addScore([scoring, academic_scoring], 'lm_improving', '@SMI', tmp1);
            //console.log("VMT DEBUG: ACADEMIC SCORING = " + tmp + " - " + tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_06.adeq_imp");
            break;

        /*************************        
         *    Leguminous plants  *
         *************************/
        case 'S4_ENV_07':
            if (currentAnswers['S4_ENV_07.leguminous'] === 'yes' &&
                    currentAnswers['S4_ENV_07.leguminous_planted'] === 'yes') {
                tmp = 10;
            } else if (currentAnswers['S4_ENV_07.leguminous'] === 'yes' &&
                    currentAnswers['S4_ENV_07.leguminous_planted'] === 'no') {
                tmp = 5;
            } else {
                tmp = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'lp_presence', "@PYW| KPI 2.4", tmp);
            Sharp.addScore([scoring, academic_scoring], 'lp_presence-academic', "@PYW| KPI 8.3", tmp);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_07.adeq_imp");
            break;

        /********************        
         *    Buffer zones  *
         ********************/
        case 'S4_ENV_08':
        
            if (currentAnswers['S4_ENV_08.wild_bordered'] === 'all_of_it') {
                if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 7.5;
                }
            } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'most_of_it') {
                if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                    tmp1 = 6;
                } else {
                    tmp1 = 4;
                }
            } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'some_of_it') {
                if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
                    tmp1 = 5;
                } else {
                    tmp1 = 2;
                }
            } else if (currentAnswers['S4_ENV_08.wild_bordered'] === 'none_of_it') {
                tmp1 = 1;
            }
            Sharp.addScore([scoring, academic_scoring], 'bz_wild', "@YFI| KPI 4.1", tmp1);
            Sharp.addScore([scoring, academic_scoring], 'bz_wild_academic', "@YFI| KPI 7.4", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_08.adeq_imp");
            //    tmp = Moss.fn.count(/^S4_ENV_08\.wild_bordered.*/, undefined, currentAnswers);
            //    if (tmp === 1 || !currentAnswers['S4_ENV_08.wild_bordered:all_of_it']) {
            //        if (currentAnswers['S4_ENV_08.refuge_biodiv'] === 'yes') {
            //            tmp1 = 10;
            //        } else {
            //            tmp1 = 0;
            //        }
            //    } else {
            //        tmp1 = 0;
            //    }
            //    Sharp.addScore([scoring, academic_scoring], 'bz_wild', "@YFI| KPI 4.1", tmp1);
            //    tmp = currentAnswers['S4_ENV_08.wild_bordered'];
            //    if (tmp === 'all_of_it') {
            //        tmp1 = 10;
            //    } else if (tmp === 'most_of_it') {
            //        tmp1 = 7;
            //    } else if (tmp === 'some_of_it') {
            //        tmp1 = 4;
            //    } else if (tmp === 'none_of_it') {
            //        tmp1 = 0;
            //    }
            //    Sharp.addScore([scoring, academic_scoring], 'bz_wild_academic', "@YFI| KPI 7.4", tmp1);
            //    Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_08.adeq_imp");
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

            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(wood_residues)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(manure)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(agri_residues)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(domestic_waste)#.*$/, true, currentAnswers) > 0 ? 4 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(biogas)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(charcoal)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(diesel)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(electricity)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(oil)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(paraffin)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            tmp1 = Moss.fn.count(/^S4_ENV_09\.energy_sources#(other_specify)#.*$/, true, currentAnswers) > 0 ? 3 + tmp1 : tmp1;
            
            if (tmp1 >= 7) {
                tmp1 = 10;
            }
                
            //tmp = Moss.fn.count(/^S4_ENV_09\.energy_sources#.*/, true, currentAnswers);
            /*
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 3},
                {threshold: 2, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            */
            Sharp.addScore([scoring, academic_scoring], 'es_usage', "@LMX", tmp1);
            tmp = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar|wood_residues|manure|agri_residues|domestic_waste|biogas)#.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            // TODO replace text with i18n
            Sharp.addScore([scoring, academic_scoring], 'es_usage_friendly', '@NOF', tmp1);
            tmp = Moss.fn.count(/^S4_ENV_09\.energy_sources#(solar|fuel_wood|charcoal|agri_residues|domestic_waste|manure|wood_residues)#.*$/, true, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 6},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            // TODO replace text with i18n
            Sharp.addScore([scoring, academic_scoring], 'es_usage_local', '@NOL', tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_09.adeq_imp");
            break;

        /***************************        
         *    Energy conservation  *
         ***************************/
        case 'S4_ENV_10':
            if (currentAnswers['S4_ENV_10.energy_conserv'] === 'yes') {
                tmp = 10;
            } else {
                tmp = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'ec_practices', "@JT1", tmp);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_10.adeq_imp");
            break;

        /*******************        
         *    Fertilizers  *
         *******************/
        case 'S4_ENV_11':
            var app1 = 0, app2 = 0;
                
            if (currentAnswers['S4_ENV_11.synth_fertilizes_use']) {
                if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'yes' && currentAnswers['S4_ENV_11.synth_fert_check_bfr'] === 'yes') {
                    app1 = 5;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'yes' &&
                        (!currentAnswers['S4_ENV_11.synth_fert_check_bfr'] || currentAnswers['S4_ENV_11.synth_fert_check_bfr'] === 'no')) {
                    app1 = 2.5;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'no') {
                    app1 = 10;
                }
                //unreachable
                /*
                else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'no' &&  currentAnswers['S4_ENV_11.synth_fert_check_bfr'] === 'no') {
                    app1 = 0;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'no' &&  currentAnswers['S4_ENV_11.synth_fert_check_bfr'] === 'yes') {
                    app1 = 10;
                }
                */
                //Sharp.addScore([scoring, academic_scoring], 'fe_synth_use', "@AAD", app1);
            }
            //TODO check scoring average                
            if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] && currentAnswers['S4_ENV_11.nat_fertilizes_use']) {
                if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'yes' && currentAnswers['S4_ENV_11.nat_fertilizes_use'] === 'yes') {
                    app2 = 5;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'yes' && currentAnswers['S4_ENV_11.nat_fertilizes_use'] === 'no') {
                    app2 = 2.5;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'no' &&  currentAnswers['S4_ENV_11.nat_fertilizes_use'] === 'no') {
                    app2 = 0;
                } else if (currentAnswers['S4_ENV_11.synth_fertilizes_use'] === 'no' &&  currentAnswers['S4_ENV_11.nat_fertilizes_use'] === 'yes') {
                    app2 = 10;
                }
                //Sharp.addScore([scoring,  academic_scoring], 'fe_synth_use', "@AAD", app2);
            }
            
            //console.log("app1 " + app1)
            //console.log("app2 " + app2)
            //console.log("app1+app2/2 " + ((app1+app2)/2))
            Sharp.addScore([scoring, academic_scoring], 'fe_synth_use', "@AAD", (app1 + app2) / 2);
           /* if (currentAnswers['S4_ENV_11.nat_fertilizes_use']) {
                if (currentAnswers['S4_ENV_11.nat_fertilizes_use'] === 'yes') {
                    tmp = 10;
                } else {
                    tmp = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'fe_natural_use', "@XIO", tmp);
            }
            */
            tmp = Moss.fn.count(/^S4_ENV_11\.fertilizer_src.*/, undefined, currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 1, value: 0},
                {threshold: 2, value: 5},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            Sharp.addScore([scoring, academic_scoring], 'fe_sources', "@RDL", tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_ENV_11.adeq_imp_synth_fert", "S4_ENV_11.adeq_imp_nat_fert"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_11.adeq_imp_nat_fert");
            break;

        /***********************************        
         *    Weed species and management  *
         ***********************************/
        case 'S4_ENV_12':
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
                    {threshold: 3, value: 6},
                    {threshold: 4, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                // TODO replace text with i18n
                Sharp.addScore([scoring, academic_scoring], 'ws_number', '@NOI', tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_ENV_12.adeq_imp");
            break;
        
        /************************        
         *    Group membership  *
         ************************/
        case 'S4_SOC_01':
            if (currentAnswers['S4_SOC_01.is_member_of_groups']) {
                tmp = Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'quite_active', currentAnswers);
                tmp = tmp + Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'very_active', currentAnswers);
                tmp = tmp + Moss.fn.count(/^S4_SOC_01\.groups#.*#degree_of_participation.*$/, 'leader', currentAnswers);
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 7},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'gm_participation', "@L2C", tmp1);
            }
            tmp = currentAnswers['S4_SOC_01.started_by_community'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'gm_initiation', "@QNO", (tmp === 'yes' ? 10 : 0));
            }
            tmp = Moss.fn.count(/^S4_SOC_01\.groups#(seed_bank|ap_ffs|listening_clubs|traders_assoc|farmers_group|cooperatives|water_waste_group)#degree_of_participation.*$/, 'quite_active', currentAnswers);
            tmp = tmp + Moss.fn.count(/^S4_SOC_01\.groups#(seed_bank|ap_ffs|listening_clubs|traders_assoc|farmers_group|cooperatives|water_waste_group)#degree_of_participation.*$/, 'very_active', currentAnswers);
            tmp = tmp + Moss.fn.count(/^S4_SOC_01\.groups#(seed_bank|ap_ffs|listening_clubs|traders_assoc|farmers_group|cooperatives|water_waste_group)#degree_of_participation.*$/, 'leader', currentAnswers);
            tmp1 = Sharp.rangeScale(tmp, [
                {threshold: 0, value: 0},
                {threshold: 1, value: 7},
                {threshold: Number.POSITIVE_INFINITY, value: 10}
            ]);
            // TODO replace text with i18n
            Sharp.addScore([scoring, academic_scoring], 'gm_participation_selection', '@PIS', tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, ["S4_SOC_01.adeq_imp_grp", "S4_SOC_01.adeq_imp_knwldg"]);
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_01.adeq_imp_knwldg");
            break;

        /*************        
         *    Meals  *
         *************/
        case 'S4_SOC_02':
            tmp = Moss.fn.count(/^S4_SOC_02\.meals#.*#response.*$/, 'yes', currentAnswers);
            /* tmp1 = (tmp * 10 / 12); */
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 11, value: (tmp - 1)},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'ft_hdds', "@STU", tmp1);
            }
            tmp = Moss.fn.sum(/^S4_SOC_02\..*_stocks_qty$/, undefined, currentAnswers);
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'ft_stocks', "@YKX", (tmp > 0 ? 10 : 0));
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_02.adeq_imp");
            break;

        /*********************        
         *    Disturbancies  *
         *********************/
        case 'S4_SOC_03':
            tmp = Moss.fn.sum(/^S4_SOC_03\.types_of_disturbances#.*#frequency.*$/);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 5},
                    {threshold: 1, value: 10},
                    {threshold: 2, value: 8},
                    {threshold: 3, value: 6},
                    {threshold: 4, value: 4},
                    {threshold: Number.POSITIVE_INFINITY, value: 0}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'di_types', 'Number of disturbancies experienced (10 years)', tmp1);
            }
            tmp = currentAnswers['S4_SOC_03.mod_habit_clim_chg'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'di_habit', "@NT9", (tmp === 'yes' ? 10 : 0));
            }
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
            tmp = currentAnswers['S4_SOC_05.trust_general'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'tc_general', '@BAA', (tmp === 'trust' ? 10 : 0));
            }
            tmp = currentAnswers['S4_SOC_05.trust_lending'];
            if (tmp) {
                Sharp.addScore([scoring, academic_scoring], 'tc_lending', '@BAA', (tmp === 'yes' ? 10 : 0));
            }
            tmp = Moss.fn.count(/^S4_SOC_05\.trust_contribution:(time|money)$/, true, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 8},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'tc_contribution', '@BAA', tmp1);
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_SOC_05.adeq_imp");
            break;

        /***********************************        
         *    Previous collective actions  *
         ***********************************/
        case 'S4_SOC_06':
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
                
            } else {
                tmp1 = 0;
            }
            Sharp.addScore([scoring, academic_scoring], 'ca_previous', "@PST", tmp1);
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
            tmp = currentAnswers['S4_EC_01.fin_supp_in_lst_5_yrs_needed'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 0;
                } else {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'fs_needed', "@JJA", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_01.adeq_imp");
            break;

        /*******************************        
         *   Access to local market  *
         *******************************/
        case 'S4_EC_02':
            tmp = currentAnswers['S4_EC_02.access_to_local_market'];
            if (tmp) {
                if (tmp === 'no_access') {
                    tmp1 = 0;
                } else if (tmp === 'intermittent_access') {
                    tmp1 = 4;
                } else if (tmp === 'sustained_access') {
                    tmp1 = 10;
                }
                Sharp.addScore([scoring, academic_scoring], 'ma_local', "@OPF", tmp1);
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
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_03.adeq_imp");
            break;

        /*******************************        
         *    Market access (selling)  *
         *******************************/
        case 'S4_EC_04':
            if (currentAnswers['S4_EC_04.lst_yr_sold'] === 'yes') {
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

            tmp = Moss.fn.countTokenizedText(/^S4_EC_04\.prd_sold$/, currentAnswers);
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 0, value: 0},
                    {threshold: 1, value: 2},
                    {threshold: 2, value: 4},
                    {threshold: 3, value: 6},
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
            var cropsList = Moss.fn.matches(/^S4_EC_05\.mrkt_prices#crop_[0-9]#price_dscr.*$/, undefined, currentAnswers);
            var animalsList = Moss.fn.matches(/^S4_EC_05\.mrkt_prices#animal_[0-9]#price_dscr.*$/, undefined, currentAnswers);
            for (i = 0; i < cropsList.length; i++) {
                if (cropsList[i].match_value === 'high') {
                    tmp = tmp + 5;
                    count++;
                } else if (cropsList[i].match_value === 'fluctuating') {
                    tmp = tmp + 2;
                    count++;
                } else if (cropsList[i].match_value === 'unpredictable') {
                    tmp = tmp + 10;
                    count++;
                } else {
                    //tmp = tmp + 0; jslint error                    
                    count++;
                }
            }
            for (i = 0; i < animalsList.length; i++) {
                if (animalsList[i].match_value === 'high') {
                    tmp = tmp + 5;
                    count++;
                } else if (animalsList[i].match_value === 'fluctuating') {
                    tmp = tmp + 2;
                    count++;
                } else if (animalsList[i].match_value === 'unpredictable') {
                    tmp = tmp + 10;
                    count++;
                } else {
                    //tmp = tmp + 0;
                    count++;
                }
            }
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
            tmp = currentAnswers['S4_EC_08.insured'];
            if (tmp) {
                if (tmp === 'yes') {
                    tmp1 = 10;
                } else {
                    tmp1 = 0;
                }
                Sharp.addScore([scoring, academic_scoring], 'in_crops', "@HQE", tmp1);
            }
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
                    {threshold: 1, value: 4},
                    {threshold: 2, value: 7},
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
            //Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_10.adeq_imp");
            break;

        /**********************        
         *    Income sources  *
         **********************/
        case 'S4_EC_11':
            tmp = currentAnswers['S4_EC_11.income_src_qty'];
            if (tmp) {
                tmp1 = Sharp.rangeScale(tmp, [
                    {threshold: 1, value: 0},
                    {threshold: 2, value: 5},
                    {threshold: Number.POSITIVE_INFINITY, value: 10}
                ]);
                Sharp.addScore([scoring, academic_scoring], 'is_quantity', "@YIG", tmp1);
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_11.adeq_imp");
            break;

        /**************************************************        
         *    Nonfarm income generating activities (IGA)  *
         **************************************************/
        case 'S4_EC_12':
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
                Sharp.addScore([scoring, academic_scoring], 'iga', "@RRY", tmp1);
                //DC
                //alert (tmp + ":  " + tmp1)
            }
            Sharp.addAdequcyImportanceScore(scoring, currentAnswers, "S4_EC_12.adeq_imp");
            break;

        /*************************        
         *    Local farm inputs  *
         *************************/
        case 'S4_EC_13':
            count = 0;
            tmp1 = 0;
            tmp = Moss.fn.matches(/^S4_EC_13\.inputs_accessibility#.*#access.*$/, undefined, currentAnswers);
            for (i = 0; i < tmp.length; i++) {
                if (tmp[i].match_value === 'yes_easily') {
                    tmp1 = tmp1 + 10;
                    count++;
                } else if (tmp[i].match_value === 'yes_with_difficulty') {
                    tmp1 = tmp1 + 5;
                    count++;
                } else {
                    count++;
                }
            }
            if (count > 0) {
                Sharp.addScore([scoring, academic_scoring], 'fi_distance', "@VJP", (tmp1 / count));
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

        default:
        }
        
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