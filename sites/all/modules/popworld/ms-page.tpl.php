<!doctype html>
<html lang="en" style="height:100%">

<head>
<meta charset="utf-8">
<link rel="stylesheet" href="jquery-ui/jquery-ui.css">
<link rel="stylesheet" href="jquery-ui/jquery-ui.structure.css">
<link rel="stylesheet" href="jquery-ui/jquery-ui.theme.css">
<link rel="stylesheet" href="custom_libs/customcss.css">
<script src="jquery-ui/jquery-1.11.2.min.js"></script>
<script src="jquery-ui/jquery-ui.js"></script>
  
  <script src='custom_libs/amcharts.js'></script>
  <script src='custom_libs/serial.js'></script>
  <script src='custom_libs/none.js'></script>
  <script src='custom_libs/customjs_ms.js'></script>
  <script src='custom_libs/customjs.js'></script>

<style>
#draggable { width: 150px; height: 150px; padding: 0.5em; }
.pop_button
{
	font-size:8pt;font-weight:20;padding: 0px 0px
}
#slider label,#slider_A1A1 label,#slider_A1A2 label,#slider_A2A2 label {
  position: absolute;
  width: 20px;
  margin-top: 12px;
  margin-left: -10px;
  text-align: center;
  color: black;
}
</style>
<script>
$(function() 
{
	$("#result").hide();
	$("#graph").hide();
	$( "#draggable" ).draggable();
	$( "#result" ).draggable();
	$( "#chartdiv" ).draggable().resizable();
	//$( "#graph_type" ).selectmenu();
	$( "#graph_type" ).hide();
	$( "button.pop" ).button()
	.click(function( event ) 
	{
		event.preventDefault();
		var val = $.isNumeric($("#population").val())? parseInt($("#population").val()) : 0;
		val += parseInt($(this).attr('data-value'));
		$("#population").val(val);
	});
	$( "#slider,#slider_A1A1,#slider_A1A2,#slider_A2A2" ).slider(
	{
		min: 0,
		max: 1.001,
		step: 0.01,
	})
	.each(function() 
	{
	    var opt = $(this).data().uiSlider.options;
	    var vals = opt.max - opt.min;
	    for (var i = 0; i <= vals; i+=1) 
	    {
	        var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
	        $("#slider,#slider_A1A1,#slider_A1A2,#slider_A2A2").append(el);
		}
	});
	$( "#slider" ).on( "slide", function( event, ui ) {$( "#freq" ).val(ui.value);} );
	$( "#slider_A1A1" ).on( "slide", function( event, ui ) {$( "#a1a1" ).val(ui.value);} );
	$( "#slider_A1A2" ).on( "slide", function( event, ui ) {$( "#a1a2" ).val(ui.value);} );
	$( "#slider_A2A2" ).on( "slide", function( event, ui ) {$( "#a2a2" ).val(ui.value);} );
	$("#red").click(function(){
		$("#dominance").val("RED");
	});
	$("#blue").click(function(){
		$("#dominance").val("BLUE");
	});

	$("#clear").click(function(){
		clear();
		restart();
	});

	$("#restart").click(function(){
		restart();
	});

	$("#start").click(function(){
		$("#top").after('<div id = "chartdiv" style="min-height:300px;width:100%;background-color:white" ></div>');
		generatepopworld();
		$("#graph").show();
		showResult();
		$("#chartdiv").hide();
		$("#graph").click(function(){
			$("#chartdiv").toggle();
			$( "#graph_type" ).toggle();
		});
	});

	$("#graph_type").change(function(){
		if(this.value == "genotypes")
		{
			chart.hideGraph(graphs[0]);
			chart.hideGraph(graphs[1]);
			chart.showGraph(graphs[2]);
			chart.showGraph(graphs[3]);
			chart.showGraph(graphs[4]);			
		}
		else if(this.value == "phenotypes")
		{
			chart.showGraph(graphs[0]);
			chart.showGraph(graphs[1]);
			chart.hideGraph(graphs[2]);
			chart.hideGraph(graphs[3]);
			chart.hideGraph(graphs[4]);
		}
		else
			switchchart();
	})
});

function showResult()
{
	updateResult();
	$("#result").show();
}

function updateResult()
{
	//$("#result").html("this is a test");
	var data = basics.data[basics.data.length-1];

	if(data.dominant == "red")
	{
		$("#result_red_population").html(data.currentDominantPopCount);
		$("#result_blue_population").html(parseInt(data.populationSize)-data.currentDominantPopCount);
	}
	else
	{
		$("#result_red_population").html(parseInt(data.populationSize)-data.currentDominantPopCount);
		$("#result_blue_population").html(data.currentDominantPopCount);
	}
	
	$("#result_pval").html("p: "+data.currentFrequencyA1);
	$("#result_qval").html("q: "+data.currentFrequencyA2);
	
	$("#result_a1a1").html("N(A1A1): " + data.currentHomozygousDominantCount);
	$("#result_a1a2").html("N(A1A2): " + data.currentHeterozygousCount);
	$("#result_a2a2").html("N(A2A2): " + data.currentHomozygousRecessiveCount);

	$("#generations").html("Current generation: " + (basics.data.length-1));
}

function clear()
{
	$("#population").val("");
	$("#freq").val("");
	$("#dominance").val("");
	$("#steps").val("");
	$("#slider").slider('value', "");
	basics = {};
}
function restart()
{
	$("#chartdiv").remove();
	$("#next").remove();
	$("#start").show();
	$("#graph").hide();
	$("#graph_type").hide();
	$("#result").hide();
}

</script>

</head>
<body style="height:100%">
	<div id="top">
	<div id="draggable" class="ui-widget-content" style="height:15%;width:50%;float:left">
		<table style="border-top:0;margin-top:0;padding-top:0;margin-bottom:0;padding-bottom:0;">
			<tr>
				<td style="width:20%">Population: </td>
				<td style="width:60%">
					<button class="pop_button pop" data-value="10">10</button>
					<button class="pop_button pop" data-value="100">100</button>		
					<button class="pop_button pop" data-value="1000">1000</button>
					<button class="pop_button pop" data-value="10000">10000</button>
				</td>
				<td style="width:20%"><input id="population" style="width:50%"></input></td>
			</tr>
			<tr>
				<td style="width:20%">Frequency of A1 allele(Red): </td>
				<td style="width:60%">
					<div id="slider" style="width:80%;"></div>
				</td>
				<td style="width:20%"><input id="freq" style="width:50%"></input></td>
			</tr>
		</table>
		<table style="border-top:0;margin-top:0;padding-top:0;margin-bottom:0;padding-bottom:0;">
			<tr>
				<td style="width:45%">Fitness of A1A1: <div id="slider_A1A1" style="width:80%;"></div></td>
				<td style="width:15%">
					<input id="a1a1" style="width:50%">
				</td>
				<td style="width:40%" rowspan="3">
					<table>
						<tr>
							Mutation rate A1 to A2:(0.00001 - 0.000000001)
							<input id="a1toa2" style="width:80%"></input>
						</tr>
						<br/>
						<tr>
							Mutation rate A2 to A1:(0.00001 - 0.000000001)
							<input id="a2toa1" style="width:80%"></input>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td>Fitness of A1A2: <div id="slider_A1A2" style="width:80%;"></td>
				<td><input id="a1a2" style="width:50%"></td>
			</tr>
			<tr>
				<td>Fitness of A2A2: <div id="slider_A2A2" style="width:80%;"></div></td>
				<td><input id="a2a2" style="width:50%"></td>
			</tr>			
		</table>
		<table>
			<tr>
				<td style="width:20%">Dominance: </td>
				<td style="width:60%">
					<svg height="30" width="30">
					  <circle id="red" cx="15" cy="15" r="10" stroke="black" stroke-width="3" fill="red" />
					</svg> 
					<svg height="30" width="30">
					  <circle id="blue" cx="15" cy="15" r="10" stroke="black" stroke-width="3" fill="blue" />
					</svg> 					
				</td>
				<td style="width:20%"><input id="dominance" style="width:50%" disabled></input></td>
			</tr>
			<tr>
				<td style="width:20%" colspan="2">Step n generations forwarded: </td>
				<td style="width:20%"><input id="steps" value="1" style="width:50%"></input></td>
			</tr>
		</table>
		<button class="pop_button" id="start">Start</button>
		<button class="pop_button" id="clear">Clear</button>
		<button class="pop_button" id="restart">Restart</button>
		<button class="pop_button" id="graph">Graph</button>

		<select id="graph_type">
			<option value="freq">Frequency</option>
			<option value="pop_count">Pop count</option>
			<option value="genotypes">Genotypes</option>
			<option value="phenotypes">Phenotypes</option>
		</select>
	</div>
	
	<div id="result" class="ui-widget-content" style="height:15%;width:45%;margin-left:53%">
		<table>
			<tr>
				<td id="result_red">
					<div>
					<svg height="30" width="30" style="float:left">
					  <circle cx="15" cy="15" r="10" stroke="black" stroke-width="3" fill="red" />
					</svg> 
					<span id="result_red_population"></span>
				</td>
				<td id="result_pval">
				</td>
				<td id="result_a1a1">
				</td>		
			</tr>
			<tr>
				<td id="result_blue">
					<div>
					<svg height="30" width="30" style="float:left">
					  <circle cx="15" cy="15" r="10" stroke="black" stroke-width="3" fill="blue" />
					</svg> 
					<span id="result_blue_population"></span>
				</td>
				<td id="result_qval">
				</td>
				<td id="result_a1a2">
				</td>	
			</tr>
			<tr>
				<td colspan="2" id="generations">
				</td>
				<td id="result_a2a2">
				</td>
			</tr>
		</table>

	<div>
	</div>
</body>


</html>