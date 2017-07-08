var chartConfig = {
        chart: {
            height: 30,
            width: 100,
            marginLeft: 5,
            marginRight: 5,
            marginTop: 0,
            marginBottom: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        tooltip: {
            enabled: true,
            formatter: function () {
                "use strict";
                return '<b>' + this.y + '</b>';
            }
        },
        xAxis: {
            labels: {
                enabled: false
            },
            lineWidth: 1,
            gridLineWidth: 0,
            tickWidth: 0
        },
        yAxis: {
            labels: {
                enabled: false
            },
            lineWidth: 1,
            gridLineWidth: 0,
            tickWidth: 0,
            title: {
                text: ''
            }
        },
        plotOptions: {
            line: {
                color: '#00FF00',
                lineWidth: 1,
        		marker: {
        			enabled: false
        		}
        	},
        	area: {
        		marker: {
        			enabled: true,
        			radius: 1
        		}
        	},
        	column: {
        		borderWidth: 0,
        		pointWidth: 2
        	}
        },
        series: [
        {
        	type: 'area',
            name: 'John',
            data: [
            	{	
            		color: "#FF0000",
            		y: 93
            	},
            	{
            		color: "#FF0000",
            		y:69
            	},
            	{
            		color: "#FF0000",
            		y: 75
            	},
            	{
            		color: "#FF0000",
            		y: 88
            	}
			]
        }
        ]
    }