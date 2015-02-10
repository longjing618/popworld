basics = {};
chart = {};
graphs = {};

function generatepopworld()
{
	basics = init();
	getOutput("freq");
	chart.hideGraph(graphs[2]);
	chart.hideGraph(graphs[3]);
	chart.hideGraph(graphs[4]);
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

function validation(name)
{
	if($(".error_show").length)
		return false;
	return true;
}

function setvalid(name)
{
	$("#"+name).removeClass("invalid").addClass("valid");
	$("#"+name).next("span.error_show").remove();
}

function setinvalid(name,text)
{
	$("#"+name).removeClass("valid").addClass("invalid")
	if($("#"+name).next("span.error_show").length == 0)
		$("#"+name).after($("<span class='error_show'>"+text+"</span>"));
}

function checknumber(name)
{
	var number = $("#"+name).val();
	if($.isNumeric(number) && number > 0 && number.indexOf('.') == -1)
		return setvalid(name);
	return setinvalid(name,"Please input a positive integer");
}

function checkfrequency(name)
{
	var number = $("#"+name).val();
	if(number <= 1 && number >=0)
		return setvalid(name);
	return setinvalid(name,"Please input a frequency");
}

function checkfrequency2(name)
{
	var number = $("#"+name).val();
	if(number <= 0.00001 && number >=0.000000001)
		return setvalid(name);
	return setinvalid(name,"Please input a frequency between 0.00001 - 0.000000001");
}

function commoncheck()
{
	$("#population").on('input', function() {
		checknumber("population");
	});
	$("#freq").on('input', function() {
		checkfrequency("freq");
	});	
	$("#steps").on('input', function() {
		checknumber("steps");
	});			
}

function realtimevaliad(name)
{
	switch(name)
	{
		case "basic":
			commoncheck();
			break;
		case "migration":
			commoncheck();
			$("#a1start").on('input', function() {
				checkfrequency("a1start");
			});
			$("#fraction").on('input', function() {
				checkfrequency("fraction");
			});					
			break;
		case "drift":
			commoncheck();
			break;
		case "nrmating":
			commoncheck();
			$("#prob").on('input', function() {
				checkfrequency("prob");
			});
			break;
		case "mutation":
			commoncheck();
			$("#a1toa2").on('input', function() {
				checkfrequency2("a1toa2");
			});
			$("#a2toa1").on('input', function() {
				checkfrequency2("a2toa1");
			});			
			break;
		case "selection":
			commoncheck();
			$("#a1a1").on('input', function() {
				checkfrequency("a1a1");
			});
			$("#a1a2").on('input', function() {
				checkfrequency("a1a2");
			});
			$("#a2a2").on('input', function() {
				checkfrequency("a2a2");
			});				
			break;
		case "ms":
			commoncheck();
			$("#a1a1").on('input', function() {
				checkfrequency("a1a1");
			});
			$("#a1a2").on('input', function() {
				checkfrequency("a1a2");
			});
			$("#a2a2").on('input', function() {
				checkfrequency("a2a2");
			});
			$("#a1toa2").on('input', function() {
				checkfrequency2("a1toa2");
			});
			$("#a2toa1").on('input', function() {
				checkfrequency2("a2toa1");
			});					
			break;											
		default:
			break;
	}

}

function start()
{
	var module_name = $(".active-trail .active").attr("href").split("/")[2];
	
	if(module_name == "selection" || module_name == "ms")
	{
		if($("#a1a1").val() < 1 && $("#a1a2").val() < 1 && $("#a2a2").val() < 1)
		{
			alert("At least one fitness level must be 1.0");
			return;
		}
	}
	if(validation(module_name))
	{
		$("#top").after('<div id = "chartdiv" style="min-height:300px;width:100%;background-color:white" ></div>');
		generatepopworld();
		$("#graph").show();
		showResult();
		$("#chartdiv").hide();
		
		showanimation();
	}
}

function showanimation()
{
	$(".liz").remove();
	var data = basics.data[basics.data.length-1];
	var domcount = data.currentDominantPopCount;
	var nondomcount = parseInt(data.populationSize)-data.currentDominantPopCount;
	var dom = 0;
	var restcount = 0;
	var commoncount = 0;
	if(domcount > nondomcount)
	{
		dom = 1;
		restcount = domcount - nondomcount;
		commoncount = nondomcount;
	}
	else
	{
		restcount = nondomcount - domcount;
		commoncount = domcount;
	}
	for(var i=0;i<commoncount;i++)
	{
		showliz("pics/red.png");
		showliz("pics/blue.png");
	}
	if(dom == 0)
	{
		if(data.dominant == "red")
		{
			for(var i=0;i<restcount;i++)
				showliz("pics/blue.png");
		}
		else
		{
			for(var i=0;i<restcount;i++)
				showliz("pics/red.png");				
		}
	}
	else
	{
		if(data.dominant == "red")
		{
			for(var i=0;i<restcount;i++)
				showliz("pics/red.png");
		}
		else
		{
			for(var i=0;i<restcount;i++)
				showliz("pics/blue.png");				
		}			
	}
}

function showliz(path)
{
	showImage("#top", 900, 300, path, 100, 100,20,480);
}

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
		showResult();

		$(".liz").remove();
		showanimation();
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
				        "title": "p",
				        "valueField": "A1",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				        "balloonFunction":getText,
				    }, {
				        "valueAxis": "v2",
				        "lineColor": ($("#dominance").val() == "RED"? "blue":"red"),
				        "bullet": "square",
				        "bulletBorderThickness": 1,
				        "hideBulletsCount": 30,
				        "title": "q",
				        "valueField": "A2",
						"fillAlphas": 0,
				        "type": "smoothedLine",
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
				        "balloonFunction":getText,
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
	$( "#chartdiv" ).draggable();
	return chart;
}

function zoomChart(chart)
{
    chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
}

function getText(data,data1)
{
	var ret = "";
	ret += data1.title+": " + data.values.value;
	return ret;
}

function random(max) 
{
	return Math.floor(Math.random()*(max+1));
}

function showImage(container, maxwidth, maxheight, imgsrc, imgwidth, imgheight,marginleft,margintop) {
    var width = random(maxwidth - imgwidth)+marginleft;
    var top = random(maxheight - imgheight)+margintop;
    $(container).append(
        "<img src='" + imgsrc + 
        "' style='display:block; float:left; position:absolute;" + 
        "left:" + width + "px;" +
        "top:"  + top + "px'" +
        "class='liz'>");
}
