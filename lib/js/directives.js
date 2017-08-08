;(function () {
  
  'use strict';
  
  angular.module('pdb.topology.viewer', ['d3Core', 'pdb.common.services', 'template/topologyViewer/topologyViewer.html'])
	.directive('pdbTopologyViewer', ['d3', '$filter', 'commonServices', '$document', function(d3, $filter, commonServices, $document){
    
		return {
      		restrict: 'EAC',
      		scope: {
				entryId: '@',
				entityId: '@',
				height: '@',
				width: '@',
				subscribeEvents: '@'
			},
		
			templateUrl : "template/topologyViewer/topologyViewer.html",
      
      	link: function (scope, element, attrs) {
			
			scope.topoViewerOverlay = {
				width: '90%',
				height: '100%',
				'background-color': 'rgba(0,0,0,0.5)',
				color: '#fff',
				'z-index': 1,
				position: 'absolute',
				'text-align': 'center',
				padding: '0 5%',
				'webkit-box-sizing': 'content-box',
				'-moz-box-sizing': 'content-box',
				'box-sizing': 'content-box',
			}
			scope.topoViewerOverlayMessage = {
				'display': 'inline-block',
				'margin-top': '15%',
				'font-size': '12px'
			}
        
			//loading text
			scope.overlayText = 'Loading...';
			
			//Set subscribe event to true by default
			if(typeof scope.subscribeEvents == 'undefined'){
				scope.subscribeEvents = 'true';
			}
			
			//default config values
			scope.config = {
				wrapperWidth: '100%',
				wrapperHeigth: '100%',
				margin:10,
				wrapperBorder: 2,
				bottomMenuHeight: 27
			};
			
			//default pdb events
			scope.pdbevents = commonServices.createNewEvent(['PDB.topologyViewer.click','PDB.topologyViewer.mouseover','PDB.topologyViewer.mouseout']);
			
			//Set config object values 
			if(typeof scope.height !== 'undefined')scope.config.wrapperHeigth = scope.height+'px';
			if(typeof scope.width !== 'undefined')scope.config.wrapperWidth = scope.width+'px';
			scope.config.svgHeigth = '90%';
			scope.config.svgWidth = '100%';
			
			//Set styles object values (to be used in ng-style)
			scope.styles = {
				wrapper: {
					'width': scope.config.wrapperWidth,
					'height': scope.config.wrapperHeigth,
					'webkit-box-sizing': 'content-box',
					'-moz-box-sizing': 'content-box',
					 'box-sizing': 'content-box',
					position: 'relative',
                    overflow: 'hidden'
				},
				loader: {
					'width': scope.config.wrapperWidth,
					'height': scope.config.wrapperHeigth,
					'webkit-box-sizing': 'content-box',
					'-moz-box-sizing': 'content-box',
					 'box-sizing': 'content-box',
					position: 'absolute'
				},
				topoSvgWrapper: {
					'position': 'relative', 
					'webkit-box-sizing': 'content-box',
					'-moz-box-sizing': 'content-box',
					'box-sizing': 'content-box',
					'width': "100%",
					'height': "86%",
				},
				topoSvg: {
					'width': '100%',
					'height': '100%',
					display: 'inline-block',
					position: 'absolute',
					'top': 0,
					left: 0
				},
				bottomMenu: {
					'border-top': '1px solid #999', 
					background:'#DCECD7 none repeat scroll 0% 0%', 
					height: '10%', 
					'font-weight':'bold', 'border-radius':'0px 0px 2px 2px',
					'webkit-box-sizing': 'content-box',
					'-moz-box-sizing': 'content-box',
					'box-sizing': 'content-box',
                    position: 'relative',
                    width: '100%'
				},
				bottomMenuSelectBox: {
					'font-weight':'normal'
				}
			};
			
			//Validate Mandatory Parameters
			if(typeof scope.entryId === 'undefined' || scope.entryId == ""){
				scope.overlayText = 'Please specify \'entry-id\'';
				return;
			}else{
				scope.entryId = scope.entryId.toLowerCase()
			}
			if(typeof scope.entityId === 'undefined' || scope.entityId == ""){
				scope.overlayText = 'Please specify \'entity-id\'';
				return;
			}
			
			//Initialize domain type array with 'Annotation' as default
			scope.domainTypes = [{
				label: 'Annotation',
				data: null
			}];
			
			//Store Directive and SVG element selector in variable
			var directiveEle = d3.select(element[0]);
			var svgEle = directiveEle.select('.topoSvg');
			
			svgEle
			 	.attr("preserveAspectRatio", "xMidYMid meet")
				.attr("viewBox", "0 0 100 90")
				
			//if tooltip element do not exist append new
			var toolTipEle = d3.select('.pdbTopologyTooltip');
			if(toolTipEle[0][0] == null){
				toolTipEle = d3.select('body').append('div').attr('class','pdbTopologyTooltip')
			}
        
			//Component main defination start's here 
			var TopologyComponent = (function () {
				function TopologyComponent() {
					var commonColors = {
						green : commonServices.specificColors.qualityGreen,
						red : commonServices.specificColors.qualityRed,
						yellow : commonServices.specificColors.qualityYellow,
						orange : commonServices.specificColors.burntOrangeBright,
						lightGray: commonServices.specificColors.lightGray
					}
					
					this.defaultColours = {
						domainSelection: d3.rgb(255,0,0),
						mouseOver: d3.rgb(commonColors.lightGray[0],commonColors.lightGray[1],commonColors.lightGray[2]),
						borderColor: d3.rgb(0,0,0),
						qualityGreen: d3.rgb(commonColors.green[0],commonColors.green[1],commonColors.green[2]).brighter(),
						qualityRed: d3.rgb(commonColors.red[0],commonColors.red[1],commonColors.red[2]).brighter(),
						qualityYellow: d3.rgb(commonColors.yellow[0],commonColors.yellow[1],commonColors.yellow[2]).brighter(),
						qualityOrange: d3.rgb(commonColors.orange[0],commonColors.orange[1],commonColors.orange[2]).brighter()
					}
					
					this.entryId = scope.entryId.toLowerCase()
				
					this.getTopologyApiData();
				};
				TopologyComponent.prototype.getPDBSequenceArray = function (entities) {
					var totalEntities = entities.length;
					for(var i=0; i < totalEntities; i++){
						if(entities[i].entity_id == scope.entityId){
							this.sequenceArr = entities[i].sequence.split('');
						}
					}
				};
				TopologyComponent.prototype.getTopologyApiData = function () {
					var _this = this;
					this.apiResult = {};
					var ratioPromiseList = commonServices.createPromise([_this.entryId], ['observedResidueRatio']);
					commonServices.combinedDataGrabber(ratioPromiseList, _this.entryId, ['observedResidueRatio'], true).then(function(ratioResult) {
						
						//Check if entity id exist
						if(typeof ratioResult[_this.entryId].observedResidueRatio[scope.entityId] !== 'undefined'){
							scope.bestChainId = ratioResult[_this.entryId].observedResidueRatio[scope.entityId][0].chain_id;
                            scope.bestStructAsymId = ratioResult[_this.entryId].observedResidueRatio[scope.entityId][0].struct_asym_id;
								
							//Combined api call
							//var pdbApiNameList = ['summary','entities','polymerCoveragePerChain','mappings','topology','residueListingPerChain', 'outliers'];
							var pdbApiNameList = ['entities','mappings','topology', 'outliers','polymerCoveragePerChain'];
							var pdbPromiseList = commonServices.createPromise([_this.entryId], pdbApiNameList, scope.bestChainId);
							commonServices.combinedDataGrabber(pdbPromiseList, _this.entryId, pdbApiNameList, true).then(function(result) {
								
								//Validate topology data availability
								var topologyDataError = false;
								if(typeof result[_this.entryId]['topology'] == 'undefined' || result[_this.entryId]['topology'] == null){
									topologyDataError = true;
								}else if(typeof result[_this.entryId]['topology'][scope.entityId] == 'undefined' || 
									typeof result[_this.entryId]['topology'][scope.entityId][scope.bestChainId] == 'undefined'){
									topologyDataError = true;
								}
								
								if(topologyDataError){
									_this.apiResult = { status: 'error', data: 'Combined api call failed' }
									scope.overlayText = 'Topology Data Not Available!';
									scope.$apply(); //Apply changes done to the scope variable;
									return false;
								}
								
								_this.apiResult = { status: 'data', data: result }
								_this.getPDBSequenceArray(result[_this.entryId]['entities']);
								_this.drawTopologyStructures();
								_this.createDomainDropdown();
							}, function() {
								//_this.apiResult = { status: 'error', data: 'Combined api call failed' }
								scope.overlayText = 'Error: API call failed!';
								scope.$apply(); //Apply changes done to the scope variable;
								return false;
							});
								
						}else{
							//_this.apiResult = { status: 'error', data: 'Entity not found' }
							scope.overlayText = 'Error: Entity not found!';
							scope.$apply(); //Apply changes done to the scope variable;
							return false;
						}
						
					}, function() {
						//this.apiResult = { status: 'error', data: 'Observed residue ratio api failed' }
						scope.overlayText = 'Error: Observed residue ratio (best chain) API failed!';
						scope.$apply(); //Apply changes done to the scope variable;
						return false;
					});
					
				};
				TopologyComponent.prototype.chunkArray = function (arr, len) {
			
					var chunks = [], i = 0,	n = arr.length;
					while (i < n) {
						chunks.push(arr.slice(i, i += len));
					}
					return chunks;
				};
				TopologyComponent.prototype.getDomainRange = function () {
					var _this = this;
					var allCordinatesArray = [];
					angular.forEach(this.apiResult.data[_this.entryId].topology[scope.entityId][scope.bestChainId], function(secStrArr, secStrType) {
					
						//iterating on secondary str data array to get array spliced in x,y 
						angular.forEach(secStrArr, function(secStrData, secStrDataIndex) {
							if(typeof secStrData.path !== 'undefined' && secStrData.path.length > 0){
								allCordinatesArray= allCordinatesArray.concat(_this.chunkArray(secStrData.path, 2));
							}
						});
							
					});
					
					this.xScale = d3.scale.linear()
									.domain([d3.min(allCordinatesArray, function(d) { return d[0]; }), d3.max(allCordinatesArray, function(d) { return d[0]; })])
									.range([1, parseInt(scope.config.svgWidth) - 1]);
					
					this.yScale = d3.scale.linear()
									.domain([d3.min(allCordinatesArray, function(d) { return d[1]; }), d3.max(allCordinatesArray, function(d) { return d[1]; })])
									.range([1, parseInt(scope.config.svgHeigth) - 1]);
					
					this.zoom = d3.behavior.zoom()
								.on("zoom", function(){_this.zoomDraw(_this)})
								.x(this.xScale)
								.y(this.yScale)
					
				};
				TopologyComponent.prototype.drawStrandSubpaths = function (startResidueNumber, stopResidueNumber, index) {
					var _this = this;
					
					var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1
					var subPathHeight = (_this.scaledPointsArr[7] - _this.scaledPointsArr[1])/totalAaInPath;
					
					//create subsections/paths
					var dValArr = [];
					for(var subPathIndex=0; subPathIndex<totalAaInPath; subPathIndex++){
						var subPathObj = {type: 'strands', elementIndex: index};
						if(subPathIndex === 0){
							subPathObj['residue_number'] = startResidueNumber;
							subPathObj['pathData'] = [
							_this.scaledPointsArr[4], _this.scaledPointsArr[1],
							_this.scaledPointsArr[4], _this.scaledPointsArr[1] + subPathHeight,
							_this.scaledPointsArr[8], _this.scaledPointsArr[1] + subPathHeight,
							_this.scaledPointsArr[8], _this.scaledPointsArr[13]
							];
						}else{
							subPathObj['residue_number'] = startResidueNumber + subPathIndex;
							subPathObj['pathData'] = [
							dValArr[subPathIndex - 1]['pathData'][2], dValArr[subPathIndex - 1]['pathData'][3],
							dValArr[subPathIndex - 1]['pathData'][2], dValArr[subPathIndex - 1]['pathData'][3] + subPathHeight,
							dValArr[subPathIndex - 1]['pathData'][4], dValArr[subPathIndex - 1]['pathData'][5] + subPathHeight,
							dValArr[subPathIndex - 1]['pathData'][4], dValArr[subPathIndex - 1]['pathData'][5]
							];
						}
						dValArr.push(subPathObj);
					}
					
					
					svgEle.selectAll('.subpath-strands'+index).remove();
					
					svgEle.selectAll('.subpath-strands'+index)
					.data(dValArr)
					.enter()
					.append('path')  
					.attr('class', function(d,i){ return 'strandsSubPath subpath-strands'+index+' topo_res_'+d.residue_number })
					.attr('d', function(d,i){ return 'M '+d.pathData.join(' ')+' Z' })
					.attr('stroke', '#111')
					.attr('stroke-width', '0')
					.attr('fill', 'white')
					.attr('fill-opacity','0')
					.on('mouseover', function(d){ _this.mouseoverAction(this, d); })
					.on('mousemove', function(d){ _this.mouseoverAction(this, d); })
					.on('mouseout', function(d){ _this.mouseoutAction(this, d); })
					.on("click", function(d) { _this.clickAction(d); })
					
				};
				TopologyComponent.prototype.drawHelicesSubpaths = function (startResidueNumber, stopResidueNumber, index, curveYdiff) {
					var _this = this;
					curveYdiff = 0;
					var diffVal = 5;
					var curveYdiff2 = curveYdiff - diffVal;
					if(_this.scaledPointsArr[3] > _this.scaledPointsArr[9]) curveYdiff2 = curveYdiff + diffVal;
					var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1
					if(curveYdiff === 0) curveYdiff2 = 0;
					var subPathHeight = ((_this.scaledPointsArr[9] - curveYdiff2) - _this.scaledPointsArr[3])/totalAaInPath;
					if(curveYdiff === 0){
						var boxHeight = svgEle.select('.helices'+index).node().getBBox().height;
						var singleUnitHt = boxHeight/totalAaInPath;
						boxHeight = boxHeight - singleUnitHt; //height correction
						subPathHeight = (boxHeight - singleUnitHt/2)/totalAaInPath;
						var startPoint = subPathHeight - singleUnitHt/10;
						if(_this.scaledPointsArr[3] > _this.scaledPointsArr[9]){
							startPoint = -(boxHeight + singleUnitHt/3);
						}
					}
           
					//create subsections/paths
					var dValArr2 = [];
					var subPathObj = {};
					if(curveYdiff === 0){
						for(var subPathIndex=0; subPathIndex<totalAaInPath; subPathIndex++){
							subPathObj = {type: 'helices'};
							if(subPathIndex === 0){
								if(_this.scaledPointsArr[3] > _this.scaledPointsArr[9]){
									subPathObj['residue_number'] = stopResidueNumber;
								}else{
									subPathObj['residue_number'] = startResidueNumber;
								}
								subPathObj['pathData'] = [
									_this.scaledPointsArr[0], _this.scaledPointsArr[3] + startPoint,
									_this.scaledPointsArr[4], _this.scaledPointsArr[3] + startPoint,
									_this.scaledPointsArr[4], _this.scaledPointsArr[3] + startPoint + subPathHeight,
									_this.scaledPointsArr[0], _this.scaledPointsArr[3] + startPoint + subPathHeight
								];
							}else{
								if(_this.scaledPointsArr[3] > _this.scaledPointsArr[9]){
									subPathObj['residue_number'] = stopResidueNumber - subPathIndex;
								}else{
									subPathObj['residue_number'] = startResidueNumber + subPathIndex;
								}
								subPathObj['pathData'] = [
									dValArr2[subPathIndex - 1]['pathData'][6], dValArr2[subPathIndex - 1]['pathData'][7],
									dValArr2[subPathIndex - 1]['pathData'][4], dValArr2[subPathIndex - 1]['pathData'][5],
									dValArr2[subPathIndex - 1]['pathData'][4], dValArr2[subPathIndex - 1]['pathData'][5] + subPathHeight,
									dValArr2[subPathIndex - 1]['pathData'][6], dValArr2[subPathIndex - 1]['pathData'][5] + subPathHeight
								];
							}
							dValArr2.push(subPathObj);
						}
					}else{
						for(var subPathIndex=0; subPathIndex<totalAaInPath; subPathIndex++){
							subPathObj = {type: 'helices', elementIndex: index};
							if(subPathIndex === 0){
								subPathObj['residue_number'] = startResidueNumber;
								subPathObj['pathData'] = [
									_this.scaledPointsArr[0], _this.scaledPointsArr[3] + curveYdiff2/2,
									_this.scaledPointsArr[4], _this.scaledPointsArr[3] + curveYdiff2/2,
									_this.scaledPointsArr[4], _this.scaledPointsArr[3] + subPathHeight + curveYdiff2/2,
									_this.scaledPointsArr[0], _this.scaledPointsArr[3] + subPathHeight + curveYdiff2/2
								];
							}else{
								subPathObj['residue_number'] = startResidueNumber + subPathIndex;
								subPathObj['pathData'] = [
									dValArr2[subPathIndex - 1]['pathData'][6], dValArr2[subPathIndex - 1]['pathData'][7],
									dValArr2[subPathIndex - 1]['pathData'][4], dValArr2[subPathIndex - 1]['pathData'][5],
									dValArr2[subPathIndex - 1]['pathData'][4], dValArr2[subPathIndex - 1]['pathData'][5] + subPathHeight,
									dValArr2[subPathIndex - 1]['pathData'][6], dValArr2[subPathIndex - 1]['pathData'][5] + subPathHeight
								];
							}
							dValArr2.push(subPathObj);
						}
					}
					
					svgEle.selectAll('.subpath-helices'+index).remove();
					
					svgEle.selectAll('.subpath-helices'+index)
					.data(dValArr2)
					.enter()
					.append('path')
					.attr('class', function(d,i){ return 'helicesSubPath subpath-helices'+index+' topo_res_'+d.residue_number })
					.attr('d', function(d,i){ return 'M'+d.pathData.join(' ')+' Z' })
					.attr('stroke', '#111')
					.attr('stroke-width', '0')
					.attr('fill', 'white')
					.attr('fill-opacity','0')
					.on('mouseover', function(d){ _this.mouseoverAction(this, d); })
					.on('mousemove', function(d){ _this.mouseoverAction(this, d); })
					.on('mouseout', function(d){ _this.mouseoutAction(this, d); })
					.on("click", function(d) { _this.clickAction(d); })
          		};
				TopologyComponent.prototype.drawCoilsSubpaths = function (startResidueNumber, stopResidueNumber, index) {
					var _this = this;
					
					var coilEle = d3.select('.coils'+index);
					var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1
					var coilLength = coilEle.node().getTotalLength();
					var subPathLength = coilLength/totalAaInPath;
					
					var subPathCordsArr = [];
					var prevPathCord = undefined;
					var prevCordArrPositon = undefined;
					//var prevSubPathCord = [];
					var newSubPathCords = {};
					
					if(totalAaInPath === 1){
						newSubPathCords = {
							residue_number: startResidueNumber,
							type: 'coils',
							pathData: _this.scaledPointsArr,
							elementIndex: index
						}
						subPathCordsArr.push(newSubPathCords)
					
					}else{
						for(var subPathIndex=0; subPathIndex<totalAaInPath; subPathIndex++){
							
							var segLength = subPathLength * (subPathIndex + 1);
							var subPathCord = coilEle.node().getPointAtLength(segLength);
							var cordArrPositon = coilEle.node().getPathSegAtLength(segLength);
							newSubPathCords = {
								residue_number: startResidueNumber + subPathIndex,
								type: 'coils',
								elementIndex: index
							}
						
							if(cordArrPositon === 1){
								newSubPathCords['pathData'] = _this.scaledPointsArr.slice(0, 2);
							}else{
							
								if(prevCordArrPositon === undefined){
									newSubPathCords['pathData'] = _this.scaledPointsArr.slice(0, cordArrPositon * 2);
								}else{
									newSubPathCords['pathData'] = _this.scaledPointsArr.slice(prevCordArrPositon * 2, cordArrPositon * 2);
									newSubPathCords['pathData'].unshift(prevPathCord.x, prevPathCord.y);
								
								}
								
								prevPathCord = subPathCord;
								prevCordArrPositon = cordArrPositon;
							
							}
							
							newSubPathCords['pathData'] = newSubPathCords['pathData'].concat([subPathCord.x, subPathCord.y]);
							subPathCordsArr.push(newSubPathCords);
						}
					
					}
					
					if(startResidueNumber !== -1 && stopResidueNumber !== -1){
						svgEle.selectAll('.subpath-coils'+index).remove();
						
						svgEle.selectAll('.subpath-coils'+index)
							.data(subPathCordsArr)
							.enter()
							.append('path')  
							.attr('class', function(d,i){ return 'coilsSubPath subpath-coils'+index+' topo_res_'+d.residue_number })
							.attr('d', function(d,i){ return 'M '+d.pathData.join(' ') })
							.attr('stroke', _this.defaultColours.borderColor)
							.attr('stroke-width', 0.3)
							.attr('fill', 'none')
							.attr('stroke-opacity','1')
							.on('mouseover', function(d){ _this.mouseoverAction(this, d); })
							.on('mousemove', function(d){ _this.mouseoverAction(this, d); })
							.on('mouseout', function(d){ _this.mouseoutAction(this, d); })
							.on("click", function(d) { _this.clickAction(d); })
						
						//Hide the main coil path
						svgEle.selectAll('.coils'+index).attr('stroke-opacity',0);
					}
					var termsData = this.apiResult.data[_this.entryId].topology[scope.entityId][scope.bestChainId].terms;
					var totalCoilsInStr = this.apiResult.data[_this.entryId].topology[scope.entityId][scope.bestChainId].coils.length
					if(index === 0){
						svgEle.selectAll('.terminal_N').remove();
						svgEle.selectAll('.terminal_N')
								.data([termsData[0]])
								.enter()
								.append('text')
								.attr('class', 'terminals terminal_N')
								.attr('text-anchor','middle')
								.text('N')
								.attr('x', subPathCordsArr[0]['pathData'][0])
								.attr('y', subPathCordsArr[0]['pathData'][1])
								.attr('stroke','#0000ff')
								.attr('stroke-width','0.3')
								.attr('font-size', 3 * _this.zoom.scale() +'px')
								.attr('style',"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; line-height: normal; font-family: Arial;")
					}else if(index === totalCoilsInStr - 1){
						var pathDataLen = subPathCordsArr[totalAaInPath - 1]['pathData'].length;
						var adjustmentFactor = -2;
						if(subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 1] > subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 3]){
							adjustmentFactor = 2;
						}
						svgEle.selectAll('.terminal_C').remove();
						svgEle.selectAll('.terminal_C')
								.data([termsData[1]])
								.enter()
								.append('text')
								.attr('class', 'terminals terminal_N')
								.attr('text-anchor','middle')
								.text('C')
								.attr('x', subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 2])
								.attr('y', subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 1] + adjustmentFactor)
								.attr('stroke','#ff0000')
								.attr('stroke-width','0.3')
								.attr('font-size', 3 * _this.zoom.scale() +'px')
								.attr('style',"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; line-height: normal; font-family: Arial;")
					}
					
				};
				TopologyComponent.prototype.drawStrandMaskShape = function (index) {
					var _this = this;
					
					var maskPointsArr = _this.scaledPointsArr;
					
					var adjustmentFactor = 0.3
					var adjustIndexAddArr = [7,8,10,12];
					var adjustIndexSubtractArr = [0,1,2,3,4,5,9,11,13];
					//For arrow pointing upwards
					if(maskPointsArr[0] > maskPointsArr[6]){
						adjustIndexAddArr = [0,1,2,3,4,5,9,11,13];
						adjustIndexSubtractArr = [7,8,10,12];
					}
					
					
					var addIndexLength = adjustIndexAddArr.length;
					for(var maskPtIndex = 0; maskPtIndex < addIndexLength; maskPtIndex++){
						maskPointsArr[adjustIndexAddArr[maskPtIndex]] = maskPointsArr[adjustIndexAddArr[maskPtIndex]] + adjustmentFactor;
					}
					
					var subtractIndexLength = adjustIndexSubtractArr.length;
					for(var maskPtIndex1 = 0; maskPtIndex1 < subtractIndexLength; maskPtIndex1++){
						maskPointsArr[adjustIndexSubtractArr[maskPtIndex1]] = maskPointsArr[adjustIndexSubtractArr[maskPtIndex1]] - adjustmentFactor;
					}
					
				
					//Add the outer points          
					maskPointsArr[14] = maskPointsArr[8]
					maskPointsArr[15] = maskPointsArr[13]
					maskPointsArr[16] = maskPointsArr[8]
					maskPointsArr[17] = maskPointsArr[7]
					maskPointsArr[18] = maskPointsArr[4]
					maskPointsArr[19] = maskPointsArr[7]
					maskPointsArr[20] = maskPointsArr[4]
					maskPointsArr[21] = maskPointsArr[1]
					
					svgEle.selectAll('.maskpath-strands'+index).remove()
					
					svgEle.selectAll('.maskpath-strands'+index)
					.data([maskPointsArr])
					.enter()
					.append('path')
					.attr('class', function(d,i){ return 'strandMaskPath maskpath-strands'+index })
					.attr('d', function(d,i){ return 'M'+maskPointsArr.join(' ')+'Z' })
					.attr('stroke', '#111')
					.attr('stroke-width', 0.3)
					.attr('fill', 'white')
					.attr('stroke-opacity', 0)
					
				};
				TopologyComponent.prototype.drawHelicesMaskShape = function (index) {
					var adjustmentFactor = 0.3;
					var helicesMaskArr = [
											[this.scaledPointsArr[0]-adjustmentFactor, this.scaledPointsArr[1], 
											this.scaledPointsArr[2], this.scaledPointsArr[3]-adjustmentFactor,
											this.scaledPointsArr[4]+adjustmentFactor, this.scaledPointsArr[5],
											this.scaledPointsArr[4]+adjustmentFactor, this.scaledPointsArr[3],
											this.scaledPointsArr[0]-adjustmentFactor, this.scaledPointsArr[3]
											],
											[this.scaledPointsArr[6]+adjustmentFactor, this.scaledPointsArr[7], 
											this.scaledPointsArr[8], this.scaledPointsArr[9]+adjustmentFactor,
											this.scaledPointsArr[10]-adjustmentFactor, this.scaledPointsArr[11],
											this.scaledPointsArr[10]-adjustmentFactor, this.scaledPointsArr[9],
											this.scaledPointsArr[6]+adjustmentFactor, this.scaledPointsArr[9]
											]
										 ]
					if(this.scaledPointsArr[3] > this.scaledPointsArr[9]){
						helicesMaskArr = [
											[this.scaledPointsArr[0]-adjustmentFactor, this.scaledPointsArr[1], 
											this.scaledPointsArr[2], this.scaledPointsArr[3]+2,
											this.scaledPointsArr[4]+adjustmentFactor, this.scaledPointsArr[5],
											this.scaledPointsArr[4]+adjustmentFactor, this.scaledPointsArr[3],
											this.scaledPointsArr[0]-adjustmentFactor, this.scaledPointsArr[3]
											],
											[this.scaledPointsArr[6]+adjustmentFactor, this.scaledPointsArr[7], 
											this.scaledPointsArr[8], this.scaledPointsArr[9]-adjustmentFactor,
											this.scaledPointsArr[10]-adjustmentFactor, this.scaledPointsArr[11],
											this.scaledPointsArr[10]-adjustmentFactor, this.scaledPointsArr[9],
											this.scaledPointsArr[6]+adjustmentFactor, this.scaledPointsArr[9]
											]
										  ]
					}
					
					//remove old maskpath
					svgEle.selectAll('.maskpath-helices'+index).remove();
					
					//create new resized mask path 
					svgEle.selectAll('.maskpath-helices'+index)
					.data(helicesMaskArr)
					.enter()
					.append('path')
					.attr('class', function(d,i){ return 'helicesMaskPath maskpath-helices'+index })
					.attr('d', function(d,i){ 
						return 'M'+d[0]+' '+d[1]+' Q'+d[2]+' '+d[3]+' '+d[4]+' '+d[5]+' L'+d[6]+' '+d[7]+' '+d[8]+' '+d[9]+' Z';
					})
					.attr('stroke', '#111')
					.attr('stroke-width', 0.3)
					.attr('fill', 'white')
					.attr('stroke-opacity', 0)
					
				};
				TopologyComponent.prototype.renderTooltip = function (elementData, action) {
					
					if(action === 'show'){
						var x = d3.event.pageX, y = d3.event.pageY;
						
						var tooltipContent = 'Residue ' + elementData.residue_number + ' (' + this.sequenceArr[elementData.residue_number - 1] + ')'; 
						
						if(typeof elementData.tooltipMsg !== 'undefined'){
							if(typeof elementData.tooltipPosition !== 'undefined' && elementData.tooltipPosition === 'postfix'){
								tooltipContent = tooltipContent+' '+elementData.tooltipMsg;
							}else{
								tooltipContent = elementData.tooltipMsg+' '+tooltipContent;
							}
						}
						
						toolTipEle
								.html(tooltipContent)
								.style('display','block')
								.style('top', y + 15 +'px')
								.style('left', x + 10 +'px')
					}else{
						toolTipEle.style('display','none')
					}
				};
				TopologyComponent.prototype.dispatchEvent = function (eventType, eventData, eventElement) {
					var dispatchEventElement = element[0];
					if(typeof eventElement !== 'undefined'){
						dispatchEventElement = eventElement;
					}
					if(typeof eventData !== 'undefined'){
						scope.pdbevents[eventType]['eventData'] = eventData;
					}
					dispatchEventElement.dispatchEvent(scope.pdbevents[eventType])
				};
				TopologyComponent.prototype.clickAction = function (eleObj) {
					//Dispatch custom click event
					this.dispatchEvent('PDB.topologyViewer.click', {
						residueNumber: eleObj.residue_number,
						type: eleObj.type,
						entryId: scope.entryId.toLowerCase(),
						entityId: scope.entityId,
						chainId: scope.bestChainId,
                        structAsymId: scope.bestStructAsymId
					});
				};
				TopologyComponent.prototype.mouseoverAction = function (eleObj, eleData) {
					var selectedPath = d3.select(eleObj);
					//var selectedPathData = selectedPath.data();
					
					//Show Tooltip
					this.renderTooltip(eleData, 'show');
					
					//Highlight Residue
					if(eleData.type === 'strands' || eleData.type === 'helices'){
						selectedPath.attr('fill',this.defaultColours.mouseOver).attr('fill-opacity','0.3')
					}if(eleData.type === 'coils'){
						selectedPath.attr('stroke',this.defaultColours.mouseOver).attr('stroke-width', 1);
					}
					
					//Dispatch custom mouseover event
					this.dispatchEvent('PDB.topologyViewer.mouseover', {
						residueNumber: eleData.residue_number,
						type: eleData.type,
						entryId: scope.entryId.toLowerCase(),
						entityId: scope.entityId,
						chainId: scope.bestChainId,
                        structAsymId: scope.bestStructAsymId
					});
				};
			TopologyComponent.prototype.mouseoutAction = function (eleObj, eleData) {
				var mouseOverColor = 'none';
				var fillOpacity = 0;
				var strokeOpacity = 0.3;
				var pathElement = d3.select(eleObj);
				
				//Hide Tooltip
				this.renderTooltip('', 'hide');
				
				//if path colour is changed then get the colour
				if(pathElement.classed('coloured')){
					mouseOverColor = pathElement.attr('data-color');
					fillOpacity = 1;
					strokeOpacity = 1;
				}else{
					if(eleData.type === 'coils'){
						mouseOverColor = this.defaultColours.borderColor;
					}
				}
				
				if(eleData.type === 'strands' || eleData.type === 'helices'){
					pathElement.attr('fill',mouseOverColor).attr('fill-opacity', fillOpacity)
				}if(eleData.type === 'coils'){
					pathElement.attr('stroke',mouseOverColor).attr('stroke-width', strokeOpacity);
				}
				
				//Dispatch custom mouseover event
				this.dispatchEvent('PDB.topologyViewer.mouseout', {
					entryId: scope.entryId.toLowerCase(),
					entityId: scope.entityId,
					chainId: scope.bestChainId,
                    structAsymId: scope.bestStructAsymId
				});
			}
			TopologyComponent.prototype.drawTopologyStructures = function () {
				var _this = this;
				this.getDomainRange();
				this.scaledPointsArr = [];
				svgEle.call(_this.zoom); //add zoom event
				angular.forEach(this.apiResult.data[_this.entryId].topology[scope.entityId][scope.bestChainId], function(secStrArr, secStrType) {
									
					//iterating on secondary str data array
					angular.forEach(secStrArr, function(secStrData, secStrDataIndex) {
						if(typeof secStrData.path !== 'undefined' && secStrData.path.length > 0){
							if(secStrType === 'terms'){
								//Terms
							}else{
								var curveYdiff = 0
								//modify helices path data to create a capsule like structure
								if(secStrType === 'helices'){
									var curveCenter = secStrData.path[0] + ((secStrData.path[2] - secStrData.path[0])/2);
																		
									curveYdiff = 2 * (secStrData.minoraxis * 1.3);
									if(secStrData.path[1] >  secStrData.path[3]){
										curveYdiff = -2 * (secStrData.minoraxis * 1.3);
									}
									
									var newPathCords = [
										secStrData.path[0], secStrData.path[1],
										curveCenter, secStrData.path[1] - curveYdiff,
										secStrData.path[2], secStrData.path[1],
										secStrData.path[2], secStrData.path[3],
										curveCenter, secStrData.path[3] + curveYdiff,
										secStrData.path[0], secStrData.path[3]
									];
									
									secStrData.path = newPathCords;
								}
								
								secStrData.secStrType = secStrType;
								secStrData.pathIndex = secStrDataIndex;
								var newEle = svgEle.selectAll('path.'+secStrType+''+secStrDataIndex)
								.data([secStrData])
								.enter()
								.append('path')  
								.attr('class', function(){
									if(secStrData.start === -1 && secStrData.stop === -1 && secStrType !== 'terms'){
										return 'dashedEle topologyEle '+secStrType+' '+secStrType+''+secStrDataIndex+' topoEleRange_'+secStrData.start+'-'+secStrData.stop;
									}else{
										return 'topologyEle '+secStrType+' '+secStrType+''+secStrDataIndex+' topoEleRange_'+secStrData.start+'-'+secStrData.stop;
									}
								})
								.attr('d', function(d){
									var dVal = 'M';
									var pathLenth = secStrData.path.length;
									var xScaleFlag = true;
									//if(secStrData.path[1] > secStrData.path[7]) maskDiff = 1;
									for(var i=0; i<pathLenth; i++){
										if(secStrType === 'helices' && (i === 2 || i === 8)) dVal += ' Q'
										//if(secStrType === 'coils' && secStrData.path.length < 12 && i === 2) dVal += ' C'
										//if(secStrType === 'coils' && secStrData.path.length < 14 && secStrData.path.length > 12 && i === 4) dVal += ' C'
										if((secStrType === 'helices' && i === 6) || (secStrType === 'coils' && secStrData.path.length < 12 && i === 8)) dVal += ' L'
										if(xScaleFlag){
											var xScaleValue = _this.xScale(secStrData.path[i]);
											dVal += ' '+xScaleValue;
											_this.scaledPointsArr.push(xScaleValue);
										}else{
											var yScaleValue = _this.yScale(secStrData.path[i]);
											dVal += ' '+yScaleValue;
											_this.scaledPointsArr.push(yScaleValue);
										}
										
										xScaleFlag = !xScaleFlag;
									}
									if(secStrType === 'strands' || secStrType === 'helices') dVal += ' Z'
									return dVal;
								})
								.attr('fill', 'none')
								.attr('stroke-width', 0.3)
								.attr('stroke', _this.defaultColours.borderColor)
							
								if(secStrData.start === -1 && secStrData.stop === -1){
									newEle.attr('stroke-dasharray', '0.9')
								}
							
								//hightlight node calculations
								if(secStrType === 'strands'){
									//create subsections/paths
									_this.drawStrandSubpaths(secStrData.start, secStrData.stop, secStrDataIndex)
									
									//Create mask to restore shape
									_this.drawStrandMaskShape(secStrDataIndex);
									
									//bring original/complete helices in front newEle
									angular.element(element[0].querySelector('.topoSvg')).append(newEle.node());								
								}
								
								//for helices
								if(secStrType === 'helices'){
									//create subsections/paths
									_this.drawHelicesSubpaths(secStrData.start, secStrData.stop, secStrDataIndex, curveYdiff)
									
									//Create mask to restore shape
									_this.drawHelicesMaskShape(secStrDataIndex);
									
									//bring original/complete helices in front
									angular.element(element[0].querySelector('.topoSvg')).append(newEle.node());
								}
							
								//for coils
								if(secStrType === 'coils'){
									//create subsections/paths
									_this.drawCoilsSubpaths(secStrData.start, secStrData.stop, secStrDataIndex);
								}
							
								_this.scaledPointsArr = []; //empty the arr for next iteration
							}
						}
						
					});
					
				});
				
				//bring rsrz validation circles in front
				angular.element(element[0].querySelector('.topoSvg')).append(d3.selectAll('.validationResidue').node());
			};
			TopologyComponent.prototype.zoomDraw = function (topoObj) {
				var _this = this;
				
				_this.scaledPointsArr = [];
				
				var pathEle = svgEle.selectAll('.topologyEle');
				var pathIndex = 0;
				var pathStartResidue = 0;
				var pathStopResidue = 0;
				var curveYdiff = 0;
				pathEle.each(function(d){
				d3.select(d3.select(this).node())
					.attr('d', function(d){
					pathIndex = d.pathIndex;
					pathStartResidue = d.start;
					pathStopResidue = d.stop;
					
					var dVal = 'M';
					var pathLenth = d.path.length;
					var xScaleFlag = true;
					var maskDiff = -1; //value to add/minus to show the border properly
					for(var i=0; i<pathLenth; i++){
						if(d.secStrType === 'helices' && (i === 2 || i === 8)) dVal += ' Q'
						//if(d.secStrType === 'coils' && d.path.length < 12 && i === 2) dVal += ' C'
						if((d.secStrType === 'helices' && i === 6) || (d.secStrType === 'coils' && d.path.length < 12 && i === 8)) dVal += ' L'
						if(xScaleFlag){
							var xScaleValue = _this.xScale(d.path[i])
							dVal += ' '+xScaleValue;
							_this.scaledPointsArr.push(xScaleValue);
						}else{
							var yScaleValue = _this.yScale(d.path[i])
							dVal += ' '+yScaleValue;
							_this.scaledPointsArr.push(yScaleValue);
						}
						
						xScaleFlag = !xScaleFlag;
					}
					if(d.secStrType === 'strands' || d.secStrType === 'helices') dVal += ' Z'
						return dVal;
					});
					
					//Create mask to restore shape
					if(d.secStrType === 'helices'){
						//create subsections/paths
						_this.drawHelicesSubpaths(pathStartResidue, pathStopResidue, pathIndex, curveYdiff)
						_this.drawHelicesMaskShape(pathIndex);
						
						//bring original/complete helices in front newEle
						angular.element(element[0].querySelector('.topoSvg')).append(d3.select(this).node());
					}else if(d.secStrType === 'strands'){
						_this.drawStrandSubpaths(pathStartResidue, pathStopResidue, pathIndex)
						_this.drawStrandMaskShape(pathIndex);
						
						//bring original/complete helices in front newEle
						angular.element(element[0].querySelector('.topoSvg')).append(d3.select(this).node());
					}//for coils
					else if(d.secStrType === 'coils'){
						//create subsections/paths
						_this.drawCoilsSubpaths(pathStartResidue, pathStopResidue, pathIndex);
					}
					
					_this.scaledPointsArr = []; //empty the arr for next iteration
				});
				
				//scale validation - rsrz circle's
				var ValResheight = 0;
				svgEle
					.selectAll('.validationResidue')
						.attr('transform', function(d){
							//get Shape dimesions
							var residueEle = svgEle.select('.topo_res_'+d.residue_number);
							var dimensions = residueEle.node().getBBox();
							var residueEleData = residueEle.data();
							var reszEleCordinates = {x:0, y:0};
							if(residueEleData[0].type ==='strands' || residueEleData[0].type ==='helices'){
								reszEleCordinates = {
									x : dimensions.x + dimensions.width/2, 
									y : dimensions.y + dimensions.height/2
								};
							}else{
								var coilCenter = residueEle.node().getPointAtLength(residueEle.node().getTotalLength()/2);
								reszEleCordinates = {
									x : coilCenter.x, 
									y : coilCenter.y
								};
							}
							ValResheight = dimensions.height/2;
							return "translate(" + reszEleCordinates.x + "," + reszEleCordinates.y + ")";
							
						})
						.attr("d", d3.svg.symbol().type('circle').size(ValResheight));
				
				//scale selection paths
				svgEle
					.selectAll('.residueSelection')
					.attr('d', function(d){
						//assign the d attribute of the corresponding sub-path
						return svgEle.select('.topo_res_'+d3.select(this).data()[0].residueNumber).attr('d')
					})
								
				//shift coilssub path to top in DOM
				angular.element(element[0].querySelector('.topoSvg')).append(angular.element(element[0].querySelectorAll('.coilsSubPath')));
				
				//shift dashed paths to top in DOM
				angular.element(element[0].querySelector('.topoSvg')).append(angular.element(element[0].querySelectorAll('.dashedEle')));
				
				this.highlightDomain('zoom');
				
				//bring rsrz validation circles in front
				angular.element(element[0].querySelector('.topoSvg')).append(angular.element(element[0].querySelectorAll('.validationResidue')));
				
				//bring selection in front
				angular.element(element[0].querySelector('.topoSvg')).append(angular.element(element[0].querySelectorAll('.residueSelection')));
				
			};
			TopologyComponent.prototype.changeResidueColor = function (residueNumber, rgbColor, tooltipContent, tooltipPosition) {
				if(typeof rgbColor === 'undefined'){
					rgbColor = this.defaultColours.domainSelection;
				}
				var residueEle = svgEle.select('.topo_res_'+residueNumber);
				if(residueEle[0][0] == null)return; //if residue element do not exist
				residueEle.data()[0]['tooltipMsg'] = tooltipContent;
				residueEle.data()[0]['tooltipPosition'] = tooltipPosition;
				residueEle
					.attr('stroke', function(d){ if(d.type === 'coils'){ return rgbColor; }else{ return '#111'; }})
					.attr('stroke-width', function(d){ if(d.type === 'coils'){ return 1; }else{ return 0; }})
					.attr('fill', function(d){ if(d.type === 'coils'){ return 'none'; }else{ return rgbColor; }})
					.attr('fill-opacity', function(d){ if(d.type === 'coils'){ return 0; }else{ return 1; }})
					.classed("coloured", true)
					.attr('data-color', rgbColor)
			};
			TopologyComponent.prototype.showSelectionArea = function (residueNumber, persistPreviousSelection, colorArr, eventType) {
				var _this = this;
				
				var fill = '#000000'; //'#fbb917';
				var stroke = '#000000'; //'#fbb917';
				var selectionPathClass = 'residueSelection';
				if(eventType == 'mouseover'){
					fill = '#000000';
					stroke = '#000000';
					selectionPathClass = 'residueHighlight';
				}
				var strokeWidth = 0.3;
				var strokeOpacity = 0;
				//Remove old selection
				if(typeof persistPreviousSelection !== 'undefined' && persistPreviousSelection !== true){
					svgEle.selectAll('.'+selectionPathClass).remove();
				}
				
				//get topology residue details
				var residueEle = svgEle.select('.topo_res_'+residueNumber);
				if(residueEle[0][0] == null)return; //if residue element do not exist
				var residueEleNode = residueEle.node();
				var residueEleData = residueEle.data();
				
				if(residueEleData[0].type ==='strands' || residueEleData[0].type ==='helices'){
					if(typeof colorArr !== 'undefined'){
						stroke = fill = d3.rgb(colorArr[0],colorArr[1],colorArr[2]);
					}
				}else{
					if(typeof colorArr !== 'undefined'){
						stroke = d3.rgb(colorArr[0],colorArr[1],colorArr[2]);
					}
					fill = 'none';
					strokeWidth = 2;
					strokeOpacity = 0.5;
				}
				
				svgEle
					.append('path')
						.data([{residueNumber: residueNumber}])
						.attr('class', function(d){
							if(eventType == 'mouseover'){
								return 'residueHighlight highlightResidue_'+residueNumber;
							}else{
								return 'residueSelection seletectedResidue_'+residueNumber;
							}
						})
						.attr('d', residueEle.attr('d'))
						.attr('fill', fill)
						.attr('fill-opacity', 0.5)
						.attr('stroke', stroke)
						.attr('stroke-opacity', strokeOpacity)
						.attr('stroke-width', strokeWidth)
						.on('mouseover', function(d){ _this.mouseoverAction(residueEleNode, residueEleData[0]); })
						.on('mousemove', function(d){ _this.mouseoverAction(residueEleNode, residueEleData[0]); })
						.on('mouseout', function(d){ _this.mouseoutAction(residueEleNode, residueEleData[0]); })
						.on("click", function(d) { _this.clickAction(residueEleData[0]); })
				
			};
			TopologyComponent.prototype.drawValidationShape = function (residueNumber, shape, rgbColor) {
				var _this = this;
				//calculate Shape dimesions
				var residueEle = svgEle.select('.topo_res_'+residueNumber);
				if(residueEle[0][0] == null)return; //if residue element do not exist
				var dimensions = residueEle.node().getBBox();
				var residueEleData = residueEle.data();
				var reszEleCordinates = {x:0, y:0};
				if(residueEleData[0].type ==='strands' || residueEleData[0].type ==='helices'){
					reszEleCordinates = {
						x : dimensions.x + dimensions.width/2, 
						y : dimensions.y + dimensions.height/2
					};
				}else{
					var coilCenter = residueEle.node().getPointAtLength(residueEle.node().getTotalLength()/2);
					reszEleCordinates = {
						x : coilCenter.x, 
						y : coilCenter.y
					};
				}	
				var validationResData = {
					residue_number: residueNumber,
					tooltipMsg : 'Validation issue: RSRZ <br>',
					tooltipPosition: 'prefix',	
				};
				
				svgEle
					.append('path')
						.attr('class', 'validationResidue rsrz_'+residueNumber)
						.data([validationResData])
						.attr('fill',rgbColor)
						.attr('stroke', '#000')
						.attr('stroke-width', 0.3)
						.attr("transform", function(d) { return "translate(" + reszEleCordinates.x + "," + reszEleCordinates.y + ")"; })
						.attr("d", d3.svg.symbol().type(shape).size(dimensions.height/2))
						.style('display', 'none')
						.on('mouseover', function(d){ _this.mouseoverAction(this, d); })
						.on('mousemove', function(d){ _this.mouseoverAction(this, d); })
						.on('mouseout', function(d){ _this.mouseoutAction(this, d); })
						.on("click", function(d) { _this.clickAction(d); })
				
			};
			TopologyComponent.prototype.highlightResidues = function (residueDetails) {
				var _this = this;
				angular.forEach(residueDetails, function(residueDetailsObj, index){
					for(var i=residueDetailsObj.start; i<=residueDetailsObj.end; i++){
						_this.changeResidueColor(i, residueDetailsObj.color, residueDetailsObj.tooltipMsg, residueDetailsObj.tooltipPosition);
					}
				});
			};
			TopologyComponent.prototype.getAnnotationFromMappings = function () {
				var mappingsData = this.apiResult.data[this.entryId].mappings;
				var categoryArr = ['UniProt','CATH','Pfam','SCOP'];
				for(var catIndex=0; catIndex < 3; catIndex++){
					if(typeof mappingsData[categoryArr[catIndex]] !== 'undefined'){
						
						if(!angular.equals({}, mappingsData[categoryArr[catIndex]])){
							var residueDetails = [];
							//Iterate over mappings data to get start and end residues
							angular.forEach(mappingsData[categoryArr[catIndex]], function(domainRec, index){
								angular.forEach(domainRec.mappings, function(domainMappings, index){
									if(domainMappings.entity_id == scope.entityId && domainMappings.chain_id == scope.bestChainId){
										
										residueDetails.push({
											start: domainMappings.start.residue_number,
											end: domainMappings.end.residue_number,
											color: undefined
										});
									}
								});
								
							});
							
							if(residueDetails.length > 0){
								scope.domainTypes.push(
									{
										label: categoryArr[catIndex],
										data: residueDetails
									}
								)
							}
													
						}
					}
				}
				
			};
			TopologyComponent.prototype.getChainStartAndEnd = function () {
				//chains array from polymerCoveragePerChain api result
				var chainsData = this.apiResult.data[this.entryId].polymerCoveragePerChain.molecules[0].chains;
				
				//Iterate molecule data to get chain start and end residue
				var chainRange = {start:0, end:0}
				var totalChainsInArr = chainsData.length;
				for(var chainIndex=0; chainIndex < totalChainsInArr; chainIndex++){
					if(chainsData[chainIndex].chain_id == scope.bestChainId){
						
						//iterate over observed array
						angular.forEach(chainsData[chainIndex].observed, function(observedData, observedDataIndex){
							
							if(observedDataIndex == 0){
								chainRange.start = observedData.start.residue_number;
								chainRange.end = observedData.end.residue_number;
							}else{
								if(observedData.start.residue_number < chainRange.start){
									chainRange.start = observedData.start.residue_number;
								}
								if(observedData.end.residue_number > chainRange.end){
									chainRange.end = observedData.end.residue_number;
								}
							}
							
						})
						
						break;
					}
				}
				
				return chainRange;
				
			};
			TopologyComponent.prototype.getAnnotationFromOutliers = function () {
				var _this = this;
				var chainRange = this.getChainStartAndEnd();
				var residueDetails = [{
					start: chainRange.start,
					end: chainRange.end,
					color: _this.defaultColours.qualityGreen,
					tooltipMsg: 'No validation issue reported for '
				}];
				
				//Two temporary arrays for grouping rsrz and other outliers tooltip message  
				var rsrzTempArray = [];
				var otherOutliersTempArray = [0];
				
				//Iterate Outlier data
				var outlierData = this.apiResult.data[_this.entryId].outliers;
				if(typeof outlierData !== 'undefined' && typeof outlierData.molecules !== 'undefined' && outlierData.molecules.length > 0){
					angular.forEach(outlierData.molecules, function(qualityData, qualityDataIndex){
						if(qualityData.entity_id == scope.entityId){
							
							//Iterate chains array in outliers
							angular.forEach(qualityData.chains, function(chainDataObj, chainDataIndex){
								if(chainDataObj.chain_id == scope.bestChainId){
									
									//Iterate models array in chains array in outliers
									angular.forEach(chainDataObj.models, function(chainModelObj, chainDataIndex){
									
										//Iterate residues array in models array in outliers
										angular.forEach(chainModelObj.residues, function(outlierResidue, index){
											
											var resColor = _this.defaultColours.qualityYellow;
											var issueSpell = 'issue';
											if(outlierResidue.outlier_types.length === 1 && outlierResidue.outlier_types[0] === 'RSRZ'){
												resColor = _this.defaultColours.qualityRed;
												_this.drawValidationShape(outlierResidue.residue_number, 'circle', resColor);
												
												//add residue number in temporary rsrz array
												rsrzTempArray.push(outlierResidue.residue_number)
												
												//check if residue exist in other outliers
												var otherOutlierIndex = otherOutliersTempArray.indexOf(outlierResidue.residue_number);
												if(otherOutlierIndex > -1){
													residueDetails[otherOutlierIndex]['tooltipMsg'] = residueDetails[otherOutlierIndex]['tooltipMsg'].replace('<br>', ', RSRZ<br>');
												}else{
													
													//Adding this to have tooltip on subpath with only rsrz validation 
													residueDetails.push({
														start: parseInt(outlierResidue.residue_number),
														end: parseInt(outlierResidue.residue_number),
														color: _this.defaultColours.qualityGreen,
														tooltipMsg: 'Validation issue: RSRZ <br>',
														tooltipPosition: 'prefix'
													});
													//add residue number in temporary other Outliers array
													otherOutliersTempArray.push(outlierResidue.residue_number)
												}
												
												return;
											}else if(outlierResidue.outlier_types.length === 1){
												resColor = _this.defaultColours.qualityYellow;
											}else if(outlierResidue.outlier_types.length === 2){
												resColor = _this.defaultColours.qualityOrange;
												issueSpell = 'issues';
											}else{
												resColor = _this.defaultColours.qualityRed;
												issueSpell = 'issues';
											}
											
											//add residue number in temporary other Outliers array
											otherOutliersTempArray.push(outlierResidue.residue_number)
											
											//check if residue exist in other outliers and set the tooltip message
											var tooltipMsgText = 'Validation '+issueSpell+': '+outlierResidue.outlier_types.join(', ')+'<br>';
											var rsrzTempArrayIndex = rsrzTempArray.indexOf(outlierResidue.residue_number);
											if(rsrzTempArrayIndex > -1){
												tooltipMsgText = 'Validation issues: '+outlierResidue.outlier_types.join(', ')+', RSRZ<br>';
											}
											
											residueDetails.push({
												start: parseInt(outlierResidue.residue_number),
												end: parseInt(outlierResidue.residue_number),
												color: resColor,
												tooltipMsg: tooltipMsgText,
												tooltipPosition: 'prefix'
											});
											
										
										});
									
									});
								
								}
							
							
							});
							
						}
					
					});
					
					if(residueDetails.length > 0){
						scope.domainTypes.push(
							{
								label: 'Quality',
								data: residueDetails
							}
						)
					}
					
				}
			};
			TopologyComponent.prototype.clearHighlight = function (mappingsData) {
				var _this = this;
				svgEle.selectAll('.coloured').each(function(d){
					
					var element = d3.select(this);
					var node = element.node();
					
					//Remover tooltip content
					element.data()[0]['tooltipMsg'] = undefined;
					element.data()[0]['tooltipPosition'] = undefined;
					
					//Set coloured flag false
					var nodeEle = d3.select(node)
						.classed('coloured', false)
					
					//Change fill and border
					var nodeClassArr = nodeEle.attr('class').split(' ');
					if(nodeClassArr.indexOf('strandsSubPath') > -1 || nodeClassArr.indexOf('helicesSubPath') > -1){
						nodeEle.attr('fill', 'none').attr('fill-opacity', 0)
					}else{
						nodeEle.attr('stroke', _this.defaultColours.borderColor).attr('stroke-width', 0.3);
					}
					
				});
				
				//hide rsrz validation circles
				svgEle.selectAll('.validationResidue').style('display', 'none');
			};
			TopologyComponent.prototype.highlightDomain = function (invokedFrom) {
				if(scope.selectedDomain.data !== null){
					this.clearHighlight();
					this.highlightResidues(scope.selectedDomain.data);
					
					//show rsrz validation circles if Quality
					if(scope.selectedDomain.label === 'Quality'){
						svgEle.selectAll('.validationResidue').style('display', 'block');
					}
				}else{
				
					if(invokedFrom !== 'zoom'){
						this.clearHighlight();
					}
				}
			};
			TopologyComponent.prototype.createDomainDropdown = function () {
				
				this.getAnnotationFromMappings();
				this.getAnnotationFromOutliers();
				
				scope.selectedDomain = scope.domainTypes[0];
				scope.overlayText = '';
				
				scope.$apply(); //Apply changes done to the scope variable;
			};
			
			return TopologyComponent;
			
		})();
		
        //Instantiate topologyComponent
        scope.topologyComponent = new TopologyComponent();
		
		//Method for domain dropdown change 
        scope.highlightDomain = function(){
          scope.topologyComponent.highlightDomain();
		}
		
		//Method to clear selection / highlight paths
		scope.clearSelectionAndHighlight = function(){
			directiveEle.selectAll('.residueHighlight').remove();
			directiveEle.selectAll('.residueSelection').remove();
			scope.selectedDomain = scope.domainTypes[0];
			scope.topologyComponent.clearHighlight();
		}
		
		//bind/listen to other library compoenent events
		if(scope.subscribeEvents == 'true'){
			var elementTypeArrForRange = ['uniprot', 'pfam', 'cath', 'scop', 'strand', 'helice']
			var elementTypeArrForSingle = ['chain', 'quality', 'quality_outlier', 'binding site', 'alternate conformer']
			$document.on('PDB.seqViewer.click', function(e){
				if(typeof e.eventData !== 'undefined'){
					//Abort if entryid and entityid do not match or viewer type is unipdb
					if(e.eventData.entryId.toLowerCase() != scope.entryId.toLowerCase() || e.eventData.entityId != scope.entityId) return;
					
					if(typeof e.eventData.elementData !== 'undefined' && elementTypeArrForSingle.indexOf(e.eventData.elementData.elementType) > -1){
						//Abort if chain id is different
						if(e.eventData.elementData.pathData.chain_id != scope.bestChainId)return;
						scope.topologyComponent.showSelectionArea(e.eventData.residueNumber, false, undefined, 'click')
					}else if(typeof e.eventData.elementData !== 'undefined' && elementTypeArrForRange.indexOf(e.eventData.elementData.elementType) > -1){
						//Residue range
						var startResidue = e.eventData.elementData.pathData.start.residue_number;
						var endResidue = e.eventData.elementData.pathData.end.residue_number;
						
						//Iterate over the range and mark selection
						for(var rangeIndex = startResidue; rangeIndex <= endResidue; rangeIndex++){
							var persistPreviousSelection = true;
							if(rangeIndex == startResidue)persistPreviousSelection = false;
							scope.topologyComponent.showSelectionArea(rangeIndex, persistPreviousSelection, e.eventData.elementData.color, 'click');
						}
						
					}
					
				}
			});
			
			$document.on('PDB.seqViewer.mouseover', function(e){
				if(typeof e.eventData !== 'undefined'){
					//Abort if entryid and entityid do not match or viewer type is unipdb
					if(e.eventData.entryId.toLowerCase() != scope.entryId.toLowerCase() || e.eventData.entityId != scope.entityId) return;
					
					if(typeof e.eventData.elementData !== 'undefined' && elementTypeArrForSingle.indexOf(e.eventData.elementData.elementType) > -1){
						//Abort if chain id is different
						if(e.eventData.elementData.pathData.chain_id != scope.bestChainId)return;
						scope.topologyComponent.showSelectionArea(e.eventData.residueNumber, false, undefined, 'mouseover')
					}else if(typeof e.eventData.elementData !== 'undefined' && elementTypeArrForRange.indexOf(e.eventData.elementData.elementType) > -1){
						//Residue range
						var startResidue = e.eventData.elementData.pathData.start.residue_number;
						var endResidue = e.eventData.elementData.pathData.end.residue_number;
						
						//Iterate over the range and mark selection
						for(var rangeIndex = startResidue; rangeIndex <= endResidue; rangeIndex++){
							var persistPreviousSelection = true;
							if(rangeIndex == startResidue)persistPreviousSelection = false;
							scope.topologyComponent.showSelectionArea(rangeIndex, persistPreviousSelection, e.eventData.elementData.color, 'mouseover');
						}
						
					}
					
				}
			});
			
			$document.on('PDB.seqViewer.mouseout', function(e){
				//Remove highligh on mouseout
				svgEle.selectAll('.residueHighlight').remove();
			});
			
			$document.on('PDB.litemol.mouseover', function(e){
				//Remove highlight
				directiveEle.selectAll('.residueHighlight').remove();
				if(typeof e.eventData !== 'undefined' && !angular.equals({}, e.eventData)){
					
					//Abort if entryid and entityid do not match or viewer type is unipdb
					if(e.eventData.entryId.toLowerCase() != scope.entryId.toLowerCase() || e.eventData.entityId != scope.entityId) return;								
					
					//Abort if chain id is different
					if(e.eventData.chainId.toLowerCase() != scope.bestChainId.toLowerCase())return;
					scope.topologyComponent.showSelectionArea(e.eventData.residueNumber, false, undefined, 'mouseover')
					
				}
			});
			
			$document.on('PDB.litemol.click', function(e){
				//Remove selection
				directiveEle.selectAll('.residueSelection').remove();
				if(typeof e.eventData !== 'undefined' && !angular.equals({}, e.eventData)){
					
					//Abort if entryid and entityid do not match or viewer type is unipdb
					if(e.eventData.entryId.toLowerCase() != scope.entryId.toLowerCase() || e.eventData.entityId != scope.entityId) return;								
					
					//Abort if chain id is different
					if(e.eventData.chainId.toLowerCase() != scope.bestChainId.toLowerCase())return;
					scope.topologyComponent.showSelectionArea(e.eventData.residueNumber, false, undefined, 'click')
					
				}
			});
			
		}
		
      } //link function end here
    }
  }]); 
	  
}());