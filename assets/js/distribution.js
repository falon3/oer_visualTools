//array of objects for all the table rows' data
var data_table;
var efficiency_plot
var distribution_plot;
var manual_entry = true;
//default table valuess
var defaults = [
	{
		"lower_bound": "1",
		"upper_bound": "2",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "2",
		"upper_bound": "4",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "4",
		"upper_bound": "6",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "6",
		"upper_bound": "8",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "8",
		"upper_bound": "10",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "10",
		"upper_bound": "15",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "15",
		"upper_bound": "20",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "20",
		"upper_bound": "40",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "40",
		"upper_bound": "70",
		"inlet_psd": "10"
  },
	{
		"lower_bound": "70",
		"upper_bound": "90",
		"inlet_psd": "10"
  }
];

/**
 * Initiate the app. i.e. duplicate the table rows and start two empty plots.
 * @author Adel Wehbi
 */
function init(formula_group) {
	// Determine if the user wants manual input or not 
	$('.device_button').each(function() {
   		var device_name = $(this).context.id;
   		var selector = "#" + device_name;
   		$(selector).on("click", function() {
   			if(device_name != "default") {
   				manual_entry = false;
   			}
   			else {
   				manual_entry = true;
   			}
   		});
   	});

	if(manual_entry) {
	// if the user is analysing a regular distribution, then set the global variable formulas
		var unit = _GET('unit', undefined);
		if(unit !== undefined) {
			formulas = formulas[unit];
			efficiency_vars_list = generate_vars_list(formulas['eta']);
			delete(efficiency_vars_list['dp']);
		}
		var template = $('#table tbody tr');
		template.find('.efficiency').html('<input autocomplete="off">');
		template.find('.mid_diameter').html('<input autocomplete="off">');
		template.find('.outlet_psd').html('<input autocomplete="off">');
		$("#variables").html("");

	};
	if(!manual_entry) {
		// if the user is analysing the efficiency of a device, load the efficiency formula and all input variables for that device 
		formulas = all_formulas[formula_group];
		eff_formula = formulas['eta'];
		//display the inputs
		var template = $("#value-template");
		$("#variables").html("");
		var variable_list = generate_vars_list(eff_formula);
		for(key in variable_list) {	
			variable = variable_list[key];
			var group = template.clone();
			group.removeAttr('id');
			group.find('label').html("$" + variable.tex + "$: ");
			group.find('input').val(variable.default || 0).attr('name', key);
			group.find('span.variable-units').html("$" + variable.unit + "$");
			group.appendTo("#variables");
			if(variable.slider === undefined || variable.slider === true) {
				//set up the slider
				group.find('.slider').slider({
					min: variable["slider-min"] || config.defaults.slider.min,
					max: variable["slider-max"] || config.defaults.slider.max,
					step: variable["slider-step"] || config.defaults.slider.step,
					slide: function (event, ui) {
						$(this).siblings('input').val($(this).slider('value')).trigger('change');
					},
					change: function (event, ui) {
						$(this).siblings('input').val($(this).slider('value')).trigger('change');
					}
				});
			} 
			else if(variable.slider === false) {
			group.find('.slider').remove();
			}
		group.removeAttr("style");
	};
	//and add it the the MathJax queue in order for it to render nicely
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
};
	//fill the default values
	populate_values();
	$('input').on('change', function () {
		update();
	});

	//init empty graphs
	efficiency_plot = $.plot($('#efficiency-plot'), [{
		label: 'Fractional efficiency',
		data: []
	}], {
		series: {
			bars: {
				show: true,
				align: 'center',
				barWidth: 0.8
			}
		}
	});
	distribution_plot = $.plot($('#distribution-plot'), [{
		label: "Inlet PSD",
		data: [],
	}, {
		label: "Outlet PSD",
		data: [],
	}], {
		series: {
			bars: {
				show: true,
			}
		},
	});

	//first update
	update();
};
// initialzes all rows outside of the init() function as to not append multiple tables after the other when selecting each device to analyse
var rows = $('#table tbody tr');
for(var i = 0; i < 9; i++) {
	rows.clone().appendTo('#table tbody');
};

/**
 * Fills the table with the default values
 * @author Adel Wehbi
 */
function populate_values() {
	defaults.forEach(function (row, index) {
		$('#table tbody').find('tr').eq(index).find('.lower_bound input').val(row.lower_bound);
		$('#table tbody').find('tr').eq(index).find('.upper_bound input').val(row.upper_bound);
		$('#table tbody').find('tr').eq(index).find('.inlet_psd input').val(row.inlet_psd);
	});
}

/**
 * Collects the first 3 fields of each row from the table in the interface.
 * @author Adel Wehbi
 */
function collect_data_table() {
var fields = ['lower_bound', 'upper_bound', 'inlet_psd'];
	if(manual_entry)
		fields.push('efficiency');

	data_table = [];

	$('#table').find('tbody tr').each(function () {
		var table_row = $(this);
		var data_row = {};
		var values_defined = true;
		fields.forEach(function (value) {
			data_row[value] = math.eval(table_row.find("." + value).find('input').val());
			if(data_row[value] === undefined)
				values_defined = false;
		});
		if(values_defined)
			data_table.push(data_row);
	});
}


/**
 * Collects the variable values from the interface.
 * @author Adel Wehbi
 * @returns {object} An object containing the key-value pairs variable_id and value.
 */
function get_vars() {
	var vars = {};
	$('#variables').find('input').each(function () {
		var variable_id = $(this).attr('name');
		vars[variable_id] = math.eval($(this).val());
	});
	return vars;
};

/**
 * Calculates all the other fields of the table. Result is stored in global object data_table.
 * @author Adel Wehbi
 */
function compute_data_table() {
	vars = get_vars();
	var sum_mi_eta = 0;
	var sum_mass_out = 0;
	var sum_inlet_psd = 0;
	data_table.forEach(function (row) {
		var lower_bound = row.lower_bound;
		var upper_bound = row.upper_bound;
		row.avg_dp = (lower_bound + upper_bound) / 2;
		vars['dp'] = row.avg_dp;
		if(!manual_entry){
		var row_eff = compute(eff_formula, vars);
		row.efficiency = row_eff/100;
		}
		sum_inlet_psd += row.inlet_psd;
		row.mass_out = row.inlet_psd * (1 - row.efficiency);
		sum_mass_out += row.mass_out;
	});
	data_table.sum_mass_out = sum_mass_out;
	data_table.sum_inlet_psd = sum_inlet_psd;
	data_table.forEach(function (row) {
		if(typeof (row) !== 'object')
			return;
		row.outlet_psd = row.mass_out / data_table.sum_mass_out * 100 || 0;
		row.inlet_psd_percentage = row.inlet_psd / data_table.sum_inlet_psd * 100;

		row.mi_eta = row.inlet_psd_percentage * row.efficiency;
		sum_mi_eta += row.mi_eta;
	});
	data_table.sum_mi_eta = sum_mi_eta;
};

/**
 * Displays the data in the fields of the table.
 * @author Adel Wehbi
 */
function display_data_table() {
	data_table.forEach(function (row, index) {
		if(typeof (row) !== 'object')
			return;
		$('#table tbody').find('tr').eq(index).find('.mid_diameter').html(row.avg_dp.toPrecision(4));
		if(!manual_entry)
			$('#table tbody').find('tr').eq(index).find('.efficiency').html(row.efficiency.toPrecision(4));
			$('#sum_mi_eta').html(data_table.sum_mi_eta.toPrecision(4));
		$('#table tbody').find('tr').eq(index).find('.outlet_psd').html(row.outlet_psd.toPrecision(4));
	});
};


/**
 * Refreshes. i.e. collects the data, computes, displays, updates graphs
 * @author Adel Wehbi
 */
function update() {
	collect_data_table();
	compute_data_table();
	display_data_table();
	update_efficiency_plot();
	update_distribution_plot();
}

/**
 * Compiles the dataset, determines the ticks, and draws to the efficiency plot.
 * @author Adel Wehbi
 */
function update_efficiency_plot() {
	var dataset = [];
	var ticks = [];
	//generate the dataset
	data_table.forEach(function (row, index) {
		if(typeof (row) !== 'object')
			return;
		dataset.push([index, row.efficiency]);
		ticks.push([index, row.avg_dp]);
	});

	//get the xaxis object
	var xaxis = efficiency_plot.getAxes().xaxis;
	xaxis.options.ticks = ticks;

	efficiency_plot.setData([{
		label: 'Fractional efficiency',
		data: dataset
	}]);
	efficiency_plot.setupGrid();
	efficiency_plot.draw();
}

/**
 * Determines both datasets of the distribution plot, finds the ticks, and draws it.
 * @author Adel Wehbi
 */
function update_distribution_plot() {
	var inlet_dataset = [];
	var outlet_dataset = [];
	var ticks = [];
	data_table.forEach(function (row, index) {
		if(typeof (row) !== 'object')
			return;
		inlet_dataset.push([index, row.inlet_psd_percentage]);
		outlet_dataset.push([index, row.outlet_psd]);
		ticks.push([index, row.avg_dp]);
	});

	var xaxis = distribution_plot.getAxes().xaxis;
	xaxis.options.ticks = ticks;

	distribution_plot.setData([{
		label: "Inlet PSD (%)",
		data: inlet_dataset,
		bars: {
			align: "right",
			barWidth: 0.4,
		}
	}, {
		label: "Outlet PSD (%)",
		data: outlet_dataset,
		bars: {
			align: "left",
			barWidth: 0.4
		},
	}]);
	distribution_plot.setupGrid();
	distribution_plot.draw();
};

// This function changes the color of an active button in order to identify which device you are evaluating/using
function update_active_button() {
	var devices = document.querySelectorAll("button");
	for (num in devices) {
		devices[num].onclick = function () {
			var activeButton = document.querySelectorAll(".active")[0];
			if (this.className = "inactive")
				if(activeButton) activeButton.className = "inactive";
				this.className = "active";
			};
		};
};

