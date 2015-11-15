
function update_chart(counter) {

    var ctx = document.getElementById("chart").getContext("2d");
    var options = {
        animation : false
    }
    var chart = new Chart(ctx).Doughnut(counter, options);
}

