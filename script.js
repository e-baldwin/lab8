d3.csv('driving.csv').then(data=>{
	console.log('driving-data', data);
    data.forEach(function(d) {
        d.year = +d.year;
        d.miles = +d.miles;
        d.gas = +d.gas;
    })
    const margin = ({top: 50, right: 40, bottom: 50, left: 80})
    const width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom; 

    const xScale = d3
        .scaleLinear()
        .nice()
        .rangeRound([0,width])
        .domain([d3.min(data, function(d){return d.miles;}),d3.max(data, function(d) {return d.miles;})])//[d3.min(data, function(d){return d.stores;})
        //console.log('xScale', xScale);
        

    const yScale = d3
        .scaleLinear()
        .nice()
        .domain([d3.min(data, function(d){return d.gas;}),d3.max(data, function(d) {return d.gas;})])//[d3.min(data, function(d){return d.stores;})
        .rangeRound([0,height])
        

    const xAxis = d3.axisBottom()
        .scale(xScale)
       // .ticks(5, "s");
    const yAxis =  d3.axisLeft()
        .scale(yScale);
   

    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    //Axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
    //Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    
    
       
    svg.append("g")
        .attr("fill", d3.color('white'))
        .attr("stroke", d3.color('black'))
        .attr("stroke-width", 2)
        //.attr("stroke-width", 2)
    .selectAll("circle")
    .data(data)
    .join('circle')
        .attr("cx", function(d){return xScale(d.miles);})
        .attr("cy", function(d){return yScale(d.gas);})
        .attr("r", 4);

    function position(d) {
        const t = d3.select(this);
            switch (d.side) {
              case "top":
                t.attr("text-anchor", "middle").attr("dy", "-0.7em");
                break;
              case "right":
                t.attr("dx", "0.5em")
                  .attr("dy", "0.32em")
                  .attr("text-anchor", "start");
                break;
              case "bottom":
                t.attr("text-anchor", "middle").attr("dy", "1.4em");
                break;
              case "left":
                t.attr("dx", "-0.5em")
                  .attr("dy", "0.32em")
                  .attr("text-anchor", "end");
                break;
            }
    }
    //Halo
    function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }


    /*const label = svg.append("g")
        .selectAll("g")
        .data(data)
        .attr("class", "labels")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        //.join("g");
    label.enter().append("text")
        .selectAll("text")
        .attr("dx", function(d) { return xScale(d.miles); })
        .attr("dy", function(d) { return yScale(d.gas); })
        .style("fill", "steelblue")
        .text(function(d){return d.year;})

       
        .each(position);
        console.log('labels',label);*/
    //Labels
    svg.selectAll(".labels")
        .data(data)
        
        .enter().append("text")
        .attr("class",".labels")
        .attr("x", function(d) { return xScale(d.miles); })
        .attr("y", function(d) { return yScale(d.gas); })
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .style("fill", "black")
        .each(position)
        .text(function(d){return d.year;});
        
      //Halo --- how do you know if this worked??
    svg.selectAll(".halos")
        .data(data)
        .selectAll("text")
        .enter().append()
        .attr("class","halos")
        .attr("x", function(d) { return xScale(d.miles); })
        .attr("y", function(d) { return yScale(d.gas); })
        .each(position)
        .call(halo);

      //make gridlines

      //axisGroup.select(".domain").remove()) "more elegant way below"
      //grid
      svg.call(xAxis)
            .call(svg => svg.select(".domain").remove())
            .selectAll(".tick line")
            .clone()
                .attr("y2", margin.top)//+ margin.bottom - height)
                .attr("stroke-opacity", 0.1) // make it transparent 
            .call(g=>
                svg.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .text("Mile per gallon")
                
                .call(halo) // optional halo effect
            );
        //ygrid
        svg.call(yAxis)
            .call(svg => svg.select(".domain").remove())
            .selectAll(".tick line")
            .clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1) // make it transparent 
            .call(g=>
                svg.append("text")
                .attr("x", width)//-margin.left-margin.right)
                .attr("y", margin.bottom - 4)
                .attr("text-anchor", "start")
                .text("Cost per gallon")
                
                .call(halo) // optional halo effect
            );
    


        const line = d3
            .line()
            .x(function(d) { return xScale(d.miles);})
            .y(function(d) { return yScale(d.gas);});
        const path = svg.selectAll("path")
            .datum(data)
            .enter().append("path")
            .attr("class",".paths")
            .attr("fill", "none")
            .attr("stroke", d3.color('black'))
            .attr("stroke-width", 2)
        //.attr("stroke-linejoin", "round")
            .attr("d",line);
})