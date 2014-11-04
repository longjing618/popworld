(function ($) 
{
	jQuery( document ).ready(function() 
	{
		//jQuery("#edit-submitted-step-n-generations-forward").val("234");
		jQuery(".accept-help").live( "click", myHandler );

		function myHandler( event ) 
		{
			//alert($( this ).next().html())
			jQuery.ajax({
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

		jQuery("#edit-generate-popworld").click(function()
		{
			//var webformid = jQuery("#webform_id").html();
			generatepopworld();
		});

		function generatepopworld()
		{
			basics = init();
			getOutput();
		}

/*
		function print()
		{
			var ret = "";
			jQuery.each(basics, function(key,val){
				ret += key+": " + val + "<br/>";
			})
			jQuery("#result").html(ret);
		}
		*/

		function getOutput()
		{
			//alert("Basics");
			zeroGeneration();
			count = jQuery("#edit-submitted-step-n-generations-forward").val();
			calculateNextNGenerations(count);
			getChart();
			//print();
			if(jQuery("#edit-next").length == 0)
				jQuery( '<input id="edit-next" class="form-submit" type="submit" value="Next" name="op" onclick="return false;">' ).insertAfter( "#edit-generate-popworld" );
			
			jQuery("#edit-next").click(function(){
				calculateNextNGenerations(count);
				getChart();
				//print();
			})
		}

		function getChart()
		{
			var chartData = generateChartData();

			var chart = AmCharts.makeChart("chartdiv", {
			    "type": "serial",
			    "theme": "none",
			    "pathToImages": "http://www.amcharts.com/lib/3/images/",
			    "legend": {
			        "useGraphSettings": true
			    },
			    "dataProvider": chartData,
			    "valueAxes": [{
			        "id":"v1",
			        "axisColor": "#FF6600",
			        "axisThickness": 2,
			        "gridAlpha": 0,
			        "axisAlpha": 1,
			        "position": "left",
			        "minimum":0,
			        "maximum":basics.data[0].populationSize
			    }, {
			        "id":"v2",
			        "axisColor": "#FCD202",
			        "axisThickness": 2,
			        "gridAlpha": 0,
			        "axisAlpha": 1,
			        "position": "right",
					"minimum":0,
			        "maximum":basics.data[0].populationSize
			    },],
			    "graphs": [{
			        "valueAxis": "v1",
			        "lineColor": "#FF6600",
			        "bullet": "round",
			        "bulletBorderThickness": 1,
			        "hideBulletsCount": 30,
			        "title": "Red",
			        "valueField": "r",
					"fillAlphas": 0,
			        "type": "smoothedLine",
			        "balloonFunction":getTitle,
			    }, {
			        "valueAxis": "v2",
			        "lineColor": "#FCD202",
			        "bullet": "square",
			        "bulletBorderThickness": 1,
			        "hideBulletsCount": 30,
			        "title": "Blue",
			        "valueField": "b",
					"fillAlphas": 0,
			        "type": "smoothedLine",
			    },],
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

			chart.addListener("dataUpdated", zoomChart);
			zoomChart(chart);
		}


		function generateChartData() {
		    var chartData = [];
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

		        chartData.push({
		            count: i,
		            r: red,
		            b: blue,
		            des:"123"
		        });
		    }
		    return chartData;
		}

		function zoomChart(chart)
		{
		    chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
		}

		function getTitle(data,data1)
		{
			var ret = "";
			jQuery.each(basics.data[basics.count-1], function(key,val){
				ret += key+": " + val + "<br/>";
			});
			return ret;
		}
	});
}(jQuery));
