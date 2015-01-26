$(".accept-help").on( "click", myHandler );

function myHandler( event ) 
{
	//alert($( this ).next().html())
	$.ajax({
	      url: 'node/get/ajax/'+$( this ).next().html(),
	      type: 'post',
	      success: function(data, status) 
	      {
	      		;
	      },
	      error: function(xhr, desc, err) {
	      		;
	      }
	    });
}

basics = {};
chart = {};
graphs = {};

function generatepopworld()
{
	basics = init();
	getOutput("freq");
}

/*
function print()
{
	var ret = "";
	$.each(basics, function(key,val){
		ret += key+": " + val + "<br/>";
	})
	$("#result").html(ret);
}
*/

function getOutput(name)
{
	//alert("Basics");
	zeroGeneration();
	count = $("#steps").val();
	calculateNextNGenerations(count);
	chart = getChart(name);
	//print();
	//if($("#edit-next").length == 0)
		$( '<button role="button" class="pop_button" id="next"><span class="ui-button-text">Next</span></button>' ).insertAfter( "#start" );
		$("#start").hide();

	$("#next").click(function(){
		count = $("#steps").val();
		var status = 0;
		if($("#chartdiv").is(":visible"))
			status = 1;

		if(status == 0)
			$("#chartdiv").show();

		calculateNextNGenerations(count);
		chart = getChart($("#graph_type").val());
		//print();

		if(status == 0)
			$("#chartdiv").hide()
	})
}

function switchchart()
{
	var status = 0;
	if($("#chartdiv").is(":visible"))
		status = 1;

	if(status == 0)
		$("#chartdiv").show();

	chart = getChart($("#graph_type").val());
	//print();

	if(status == 0)
		$("#chartdiv").hide()
}

function roundnumber(num)
{
	var temp = 100000;
	num = (Math.round(num * temp)/temp).toFixed(5);
	return num;
}

function generatecdata(name)
{
	cdata = [];
	var red;
    var blue;
    var data;
    for (var i = 0; i < basics.count; i++) 
    {
    	data = basics.data[i];
    	if(data.dominant == "red")
    	{
       		//red = data.currentFrequencyA1.toFixed(2);
       		//blue = data.currentFrequencyA2.toFixed(2);
       		red = data.currentDominantPopCount;
       		blue = data.currentRecessivePopCount;
       	}
       	else
       	{
       		//blue = data.currentFrequencyA1.toFixed(2);
       		//red = data.currentFrequencyA2.toFixed(2);
       		blue = data.currentDominantPopCount;
       		red = data.currentRecessivePopCount;
       	}

       	switch(name)
		{
			case "freq":
				cdata.push({
		            count: i,
		            A1: roundnumber(data.currentFrequencyA1),
		            A2: roundnumber(data.currentFrequencyA2),
					A1A1:roundnumber(data.currentFrequencyA1A1),
					A1A2:roundnumber(data.currentFrequencyA1A2),
					A2A2:roundnumber(data.currentFrequencyA2A2),
		            //des:"123"
	        	});
	        	break;
			case "pop_count":
					cdata.push({
		            count: i,
		            dominant: roundnumber(data.currentDominantPopCount),
		            heterozygous: roundnumber(data.currentHeterozygousCount),
					homozygousrecessive:roundnumber(data.currentHomozygousRecessiveCount),
					homozygousdominant:roundnumber(data.currentHomozygousDominantCount),
	        	});
	        	break;
			case "genotypes":
			case "phenotypes":
			default:
				return [];
		}
    }
    return cdata;
}

/*
data: the chart data
title: chart title
valueAxes
graphs
*/
function getChartData(name)
{
	var chartdata = {};
	var cdata = generatecdata(name);
	var title;
	var valueAxes;

	switch(name)
	{
		case "freq":
			valueAxes = [{
					        "id":"v1",
					        "axisColor": "#FF6600",
					        "axisThickness": 2,
					        "gridAlpha": 0,
					        "axisAlpha": 1,
					        "position": "left",
					        "minimum":0,
					        "maximum":1
					    }, {
					        "id":"v2",
					        "axisColor": "#FCD202",
					        "axisThickness": 2,
					        "gridAlpha": 0,
					        "axisAlpha": 1,
					        "position": "right",
							"minimum":0,
					        "maximum":1
					    },];
			title = "Frequency";
			graphs = [{
				        "valueAxis": "v1",
				        "lineColor": ($("#dominance").val() == "RED"? "red":"blue"),
				        "bullet": "round",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Red",
				        "valueField": "A1",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				        //"balloonFunction":getTitle,
				    }, {
				        "valueAxis": "v2",
				        "lineColor": ($("#dominance").val() == "RED"? "blue":"red"),
				        "bullet": "square",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Blue",
				        "valueField": "A2",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    }, {
				        "valueAxis": "v1",
				        "lineColor": "#009900",
				        "bullet": "diamond",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "A1A1",
				        "valueField": "A1A1",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    }, {
				        "valueAxis": "v1",
				        "lineColor": "#CC6600",
				        "bullet": "triangleLeft",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "A1A2",
				        "valueField": "A1A2",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    }, {
				        "valueAxis": "v1",
				        "lineColor": "#FF3399",
				        "bullet": "triangleRight",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "A2A2",
				        "valueField": "A2A2",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    },];
			break;
		case "pop_count":
			valueAxes = [{
			        "id":"v1",
			        "axisColor": "#FF6600",
			        "axisThickness": 2,
			        "gridAlpha": 0,
			        "axisAlpha": 1,
			        "position": "left",
			        "minimum":0,
			        "maximum":parseInt($("#population").val()),
			    }, {
			        "id":"v2",
			        "axisColor": "#FCD202",
			        "axisThickness": 2,
			        "gridAlpha": 0,
			        "axisAlpha": 1,
			        "position": "right",
					"minimum":0,
			        "maximum":parseInt($("#population").val()),
			    },];
			title = "Population Count";
			graphs = [{
				        "valueAxis": "v1",
				        "lineColor": "red",
				        "bullet": "round",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Dominant",
				        "valueField": "dominant",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				        //"balloonFunction":getTitle,
				    }, {
				        "valueAxis": "v2",
				        "lineColor": "blue",
				        "bullet": "square",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Heterozygous",
				        "valueField": "heterozygous",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    }, {
				        "valueAxis": "v1",
				        "lineColor": "#009900",
				        "bullet": "diamond",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Homozygous Recessive",
				        "valueField": "homozygousrecessive",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    }, {
				        "valueAxis": "v1",
				        "lineColor": "#CC6600",
				        "bullet": "triangleLeft",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "Homozygous Dominant",
				        "valueField": "homozygousdominant",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				    },];
			break;
		case "genotypes":
			return "Genotypes";
		case "phenotypes":
			return "Phenotypes";
		default:
			return "";
	}

	chartdata.data = cdata;
	chartdata.title = title;
	chartdata.valueAxes = valueAxes;
	chartdata.graphs = graphs;

	return chartdata;
}

function getChart(name)
{
	var chartData = getChartData(name);

	chart = AmCharts.makeChart("chartdiv", {
		"titles": 
		[
			{
				"text": chartData.title,
				"size": 15
			}
		],
	    "type": "serial",
	    "theme": "none",
	    "pathToImages": "http://www.amcharts.com/lib/3/images/",
	    "legend": {
	        "useGraphSettings": true
	    },
	    "dataProvider": chartData.data,
	    "valueAxes": chartData.valueAxes,
	    "graphs": chartData.graphs,
	    "chartScrollbar": {},
	    "chartCursor": {
	        "cursorPosition": "mouse"
	    },
	    "categoryField": "count",
	    "categoryAxis": {
	        //"parseDates": true,
	        "axisColor": "#DADADA",
	        "minorGridEnabled": true
	    },
	});

	zoomChart(chart);
	return chart;
}

function zoomChart(chart)
{
    chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
}

function getTitle(data,data1)
{
	var ret = "";
	$.each(basics.data[basics.count-1], function(key,val){
		ret += key+": " + val + "<br/>";
	});
	return ret;
}
