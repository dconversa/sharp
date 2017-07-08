/*jslint plusplus: true */
/*jslint evil: true */
/*jslint nomen: true */
/*jslint continue: true, regexp: true */
/*global console, document */
/*global $, Moss */
/*global toastr */


var visibleColumns = 4;
var fromColumn = 1;

function initAttendanceReportSearch() {
    "use strict";
    console.log("initAttendanceReportSearch");
    clearSearchData();
    populateFFS('#select-ffs-search');
           
    $("#btn-report-search").unbind("click");
    $("#btn-report-search").on("click", function () {
        searchAttendanceReports();
    });

    $("#btn-reset-report-search").unbind("click");
    $("#btn-reset-report-search").on("click", function () {
        clearSearchData();
    });

    $("#btn-new-report").unbind("click");
    $("#btn-new-report").on("click", function () {
        console.log("init attendance clkick");
        Moss.fn.newAttendanceReport();
    });
    
	populateFFS("#ffsPopup");
	
    $("#ffsPopup").unbind("click");
	$("#ffsPopup").on("change", function () {
        console.log("ffs on change");
		populateParticipants($('#ffsPopup option:selected').val());
	});
}

function searchAttendanceReports() {
    "use strict";
    var params = {};
    params.ffs = $('#select-ffs-search option:selected').val();
    if ($("#input-start-date-search").val()) {
        params.startDate = new Date($("#input-start-date-search").val());
    }
    if ($("#input-end-date-search").val()) {
        params.endDate =  new Date($("#input-end-date-search").val());
    }
    Moss.svc.searchAttendanceReports(params, createAttendanceReportListDataTable);
}


function clearSearchData() {
    "use strict";
    $("#form-report-search").trigger('reset');
    $("#datatable-attendance-report-search").DataTable().clear();
    $("#datatable-attendance-report-search").DataTable().draw();
}

function createAttendanceReportListDataTable(attendanceReportList) {
    "use strict";
    console.log("asdasda");
    destroyDatatable("#datatable-attendance-report-search");
    
    $("#datatable-attendance-report-search").DataTable(
        {
            /* Disable initial sort */
            //retrieve: true,
            data: attendanceReportList,
            language: Moss.shared.baseDictionary["dataTable@" + Moss.settings.language],
            aaSorting: [],
            columnDefs: [
                {
                    defaultContent: ""
                }
            ],
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
            columns: [
                {
                    title: "<span data-i18n='@_ffs'>" + Moss.fn.string("@_ffs") + "</span>",
                    data: "json.ffs.name"
                },                        {
                    title: "<span data-i18n='@_start_date'>" + Moss.fn.string("@_start_date") + "</span>",
                    data: "json.startDate"
                },
                {
                    title: "<span data-i18n='@_end_date'>" + Moss.fn.string("@_end_date") + "</span>",
                    data: "json.endDate"
                },
                {
                    title: "<span data-i18n='@_description'>" + Moss.fn.string("@_description") + "</span>",
                    data: "json.description"
                },
                {
                    "title" : Moss.fn.string("@_delete"),
                    "data" : "json.id",
                    "render" : function (data, type, row) {
                        return "<a href=\"#delete-dialog\" onclick=\"deleteAttendanceReport('" + data + "')\" class=\"fao-light-text\" data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\" data-i18n=\"@_delete\">" + Moss.fn.string("@_delete") + " </a>";
                    },
                    "className" : "dt-column delete-column"
                }
                 
            ]
        }
    );
    
    $("#datatable-attendance-report-search").off();
    
    $('#datatable-attendance-report-search tr td:not(:last-child)').click(function () {
        //var id = $("#datatable-attendance-report-search").dataTable().api().row(this).data().id;
        var id = $("#datatable-attendance-report-search").dataTable().api().row($(this).parent('tr')).data().id;
        Moss.fn.loadAttendanceReport(id);
    });
    
    /*
    $("#datatable-attendance-report-search").off().on('click', 'tr', function () {
        var id = $("#datatable-attendance-report-search").dataTable().api().row(this).data().id;
        Moss.fn.loadAttendanceReport(id);
    });
    */
}

function deleteAttendanceReport(id) {
    "use strict";
    if (confirm("Delete Attendance Report")) {
        Moss.svc.deleteAttendanceReport(id,
                function (res) {searchAttendanceReports(); },
                function (err) {alert("error"); });
    }
}
function getFormattedDate(date){
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);

    var date = date.getFullYear()+"-"+(month)+"-"+(day) ;
    return date;
}

function initAttendanceReportEdit(attendanceReport){
    console.log("init");
    console.log(attendanceReport);
    //$("#startDate").datepicker('setDate', new Date(attendanceReport.startDate));
    //$("#endDate").datepicker('setDate', new Date(attendanceReport.endDate));
    $("#reportId").val(attendanceReport.id);
    $("#startDate").val(getFormattedDate(new Date(attendanceReport.startDate)));
    $("#endDate").val(getFormattedDate(new Date(attendanceReport.endDate)));
    $("#ffsName").val(attendanceReport.ffs.name);
    $("#ffsId").val(attendanceReport.ffs.id);
    $("#description").val(attendanceReport.description);
    
    $("#btn-save-report").unbind("click");
    $("#btn-save-report").on("click", function(){        
        
        var startDate = new Date( $("#startDate").val()); //new Date( $("#startDate").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
		var endDate =   new Date( $("#endDate").val());  //new Date( $("#endDate").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );        
        
        var report = {};
        var table =  $('#datatable-attendance-report').DataTable();
        var index = 0;
        var newAttendanceReport = {}; 
        newAttendanceReport.participants = [];
        newAttendanceReport.weeks = getWeeks(startDate, endDate);
        newAttendanceReport.ffs = {};     
        newAttendanceReport.id = $("#reportId").val()
        newAttendanceReport.description = $("#description").val();
        newAttendanceReport.startDate = startDate;
        newAttendanceReport.endDate = endDate;
        
        
        /*  
        var weeks = (Math.ceil((((endDate.getTime()-startDate.getTime())/1000)/60)/60/24/7));
        for(var week = 0; week <= weeks; week++){
            newAttendanceReport.weeks.push( week);
        }
        */
        newAttendanceReport.ffs.name = $('#ffsName').val();
        newAttendanceReport.ffs.id = $('#ffsId').val();
        console.log(table.data());
        while(table.rows().row(index) != [] &&  table.rows().row( index ).data() != undefined){
            newAttendanceReport.participants.push(table.rows().row( index ).data() ) ;
            index++;
        }
        try{
            Moss.ui.showLoader(Moss.fn.string("@_saving_data"));            
            newAttendanceReport.id ? Moss.svc.updateAttendanceReport(newAttendanceReport) : Moss.svc.saveNewAttendanceReport(newAttendanceReport);
            Moss.ui.hideLoader({timeout: 500, callback: function () {
                Moss.ui.notify(Moss.fn.string("@_data_saved"));
                Moss.fn.attendanceReportSearch();
            }});
        }catch(error){
           Moss.ui.hideLoader({timeout: 500, callback: function () {
                Moss.ui.notifyError(Moss.fn.string("@_error_saving"));
            }});
        }
        console.log(newAttendanceReport);
    });    
    createAttendanceReportDataTable(attendanceReport);
}


function getWeeks(startDate, endDate){
    var weeksArray = [];
    var weeks = (Math.ceil((((endDate.getTime()-startDate.getTime())/1000)/60)/60/24/7));
        for(var week = 0; week < weeks; week++){
            weeksArray.push( week);
        }
    return weeksArray;
}
           
function setParticipant(id, week){
	var table =  $('#datatable-attendance-report').DataTable();
	console.log( table.data());
	var index = 0;
	while(table.rows().row(index) != [] &&  table.rows().row( index ).data() != undefined){
		var item = table.rows().row( index ).data();
		if(item.id == id){
			item.weeks[week] = !item.weeks[week];
			break; 
		}
		index++;
	}
	console.log(table.data());
}

 function getColumn(c, visible){
	return  {
			"title" : Moss.fn.string("@_week") +" " + (parseInt(c)+1),
			"data" : "weeks."+[c],
			"visible" : visible,			
			"render" : function ( data, type, row ) {
	            if ( data  ) {
	                return "<input type=\"checkbox\" class=\"editor-true\" onchange=\" setParticipant('"+row.id+"', '"+ c +"')   \">";
	            }
	            return "<input type=\"checkbox\" class=\"editor-false\" onchange=\" setParticipant('"+row.id+"', '"+ c +"')   \">";
	        },	        
	        "className" : "dt-column datatable-column" 		
		}
 }



function destroyDatatable(datatableId){
	var $table = $(datatableId);

	if ( $.fn.dataTable.isDataTable( $table ) ) {
        $table.DataTable().destroy();
	    $table.empty();
	}
} 


function createAttendanceReportDataTable(attendanceReport){
	var rows = attendanceReport.participants;
	var columns = [];
	
	columns.push({"title" : Moss.fn.string("@_full_name"), data: "name", "width" : "20%"});

	var participant = attendanceReport.participants[0];
	
	for(var c in participant.weeks){	
		columns.push(getColumn(c, c<visibleColumns));
		//columns.push(column);
	}

    columns.push();
    
    
	destroyDatatable("#datatable-attendance-report")

	attendanceDatatable = $('#datatable-attendance-report').DataTable({
		"dom": '<"toolbar">frtip',
		data: rows,
		columns: columns,
		responsive: true,
		destroy : true,
        "oLanguage": {
            "sInfo": Moss.fn.string("@_showing") + " _START_ " + Moss.fn.string("@_to")+ " _END_ " + Moss.fn.string("@_of") +" _TOTAL_ " + Moss.fn.string("@_records"),
            "sLengthMenu": Moss.fn.string("@_show") + " _MENU_ " + Moss.fn.string("@_records"),
            "sSearch": Moss.fn.string("@_search"),
            "sEmptyTable": Moss.fn.string("@_no_data"),
            "oPaginate": {
            "sNext": Moss.fn.string("@_next"),
            "sPrevious": Moss.fn.string("@_previous")
          }
        },
		select: {
            style: 'os',
            selector: 'td:not(:last-child)' // no row selection on last column
        },
        rowCallback: function ( row, data ) {
            // Set the checked state of the checkbox in the table
            $('input.editor-true', row).prop( 'checked', true );	            
        }
	});

	//var btnNext = $();
	//var btnPrevious = $();
    var numberOfWeeks = $("<div class='ui-field-contain'>"+ 
                          "<label for='numberof-weeks' data-i18n='@_number_of_weeks'>Number of weeks to display</label>"+ 
                          "<input id='numberof-weeks' type='number' value='"+visibleColumns+"'onchange='visibleColumns=parseInt(this.value); showColumns()' style='width: 40px' >"+ 
                          "<button id='btnPrevious' onClick='previousColumns()' >&#60;&#60;</button>"+
                          "<button id='btnNext' onClick='nextColumns()' >&#62;&#62;</button>"+                          
                          "<button id='btnAdd' onClick='addNewParticipant()' data-i18n='@_add_person'>Add new Person</button>"+                          
                          "</div>");
	$("#datatable-attendance-report").parent().children(".toolbar").append(numberOfWeeks);
}

function addNewParticipant(){
    var startDate = new Date( $("#startDate").val()); //new Date( $("#startDate").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
    var endDate =   new Date( $("#endDate").val());  //new Date( $("#endDate").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ); 
    //init popup
    $("#ar-person-dialog").popup();
    $("#form-report-search").trigger('reset'); 
    $(document).off('click', '#ar-person-dialog #ar-btn-person-add').on('click', '#ar-person-dialog #ar-btn-person-add',function(e) {
        var person = {};
        person.ffs = Moss.model.superGroupId;
        //person.id = $("#input-person-id").val();
        //PID is a "friendly identifier for persons, like a cell number or id card or similar"
        person.pid = $("#ar-input-person-id").val();
        person.pid = $("#ar-input-person-pid").val();
        person.lastname = $("#ar-input-person-lastname").val();
        person.firstname = $("#ar-input-person-firstname").val();
        //TODO fix, just used to display in data table
        person.name = person.lastname + " " +person.firstname;
        person.weeks = [];
        var weeks = getWeeks(startDate, endDate);
        
        for(var week in weeks){
            //var l = attendanceReport.weeks[week];
            person.weeks.push( false );
        }	
        //person.country = $("#input-person-country").val();
        Moss.svc.saveNewPerson(person)
            .fail(function (tx, err) {                    
                Moss.ui.notifyError(Moss.fn.string("@_error_saving_person"));
            })
            .done(function (data) {                           
                person.id = data.insertId;
                $('#datatable-attendance-report').DataTable().row.add(person).draw();                
            });
    });        
    $("#person-dialog").popup("open");        
    
}

function nextColumns(){
	var table = $('#datatable-attendance-report').DataTable();
	var maxRows = table.columns().eq(0).length;
	if(fromColumn+visibleColumns < maxRows)
		fromColumn += visibleColumns;
	showColumns();		
}

	
function previousColumns(){
	var table = $('#datatable-attendance-report').DataTable();
	var maxRows = table.columns().eq(0).length;
	if(fromColumn-visibleColumns >=0)
		fromColumn -= visibleColumns;
	
	showColumns();
}

function showColumns(){
	//console.log("Show columns from " + fromColumn + " to " +(fromColumn+visibleColumns)  + " of " +$('#datatable-attendance-report').DataTable().columns().eq(0).length)
	var table = $('#datatable-attendance-report').DataTable();
	var maxRows = table.columns().eq(0).length;
    table.columns().eq(0).each(function (colIdx) {
        
        var title = table.columns( colIdx ).header().to$().text();
        var visible = colIdx==0 || (colIdx>=fromColumn && colIdx < fromColumn+visibleColumns )         
        table.column( colIdx ).visible(visible);
        
        /*
        console.log("--------------------");
        console.log("title: " + title);
        console.log("colIdx==0: " + colIdx==0);
        console.log("colIdx>=fromColumn: " + colIdx>=fromColumn);
        console.log("fromColumn+visibleColumns: "  + fromColumn+visibleColumns);
        console.log("visible: "  + visible);
        console.log("--------------------");
        
        console.log(table.column( colIdx ).title);
        console.log("Column idx: " + colIdx + " name: " + title);
        */
        if (title == "From" || title == "To") {
            return table.column( colIdx ).index( 'visible' );
        }        
    });
    table.draw();
    
    /*if(fromColumn-visibleColumns >=0){
        $('#btnPrevious').prop('disabled', false);		
    }else{
        $('#btnPrevious').prop('disabled', true);
    }
    
    if(fromColumn+visibleColumns <= maxRows){
        $('#btnNext').prop('disabled', false);		
    }else{
        $('#btnNext').prop('disabled', true);
    }*/
        
}


function getFFSList(){
	var ffss = [];
	for(var i = 1; i<4; i++){
		ffss.push({"id" : "ffs"+i, "name" : "Farmer Field School " +i })
	}
	return ffss;	
}

function populateFFS(selector){
    Moss.svc.findAllSuperGroups(function (rows) {
        $(selector).empty();
        $(selector).append($("<option>").attr("value", "").text(""));
        for(var row in rows){                          
            var option = $("<option>").attr("value", rows[row].id).text(rows[row].name );                                              
            $(selector).append(option);                
        }   
        $(selector).selectmenu('refresh');         

    });        
}


function populateParticipants(ffs){
    console.log("populateParticipants");
    Moss.svc.findAllPersonsByFFS(ffs,function(rows){  
        var divParticipants = $("#div-participants");
        //$(divParticipants).css("overflow-y","auto");
        $(divParticipants).empty();
        var fieldsetParticiants = $("<fieldset id='participants' data-role='controlgroup' style='height: 100px!important;'><legend>Participants</legend></fieldset>");        
        for(var row in rows){                                
            $(fieldsetParticiants).append("<input type='checkbox' name='checkbox-"+ row +"' id='checkbox-"+ row +"' data-value='"+ rows[row].id +"' data-label='"+ rows[row].firstname + " " + rows[row].lastname +"' /> <label for='checkbox-"+ row +"'> "+ rows[row].firstname + " " + rows[row].lastname+"</label>")		                    
        }
        var participants = $("#participants");

        $(divParticipants).append(fieldsetParticiants);
        $(divParticipants).trigger("create");	   
    });
}
