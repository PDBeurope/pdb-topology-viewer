"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PdbTopologyViewerPlugin = /** @class */ (function () {
    function PdbTopologyViewerPlugin() {
        this.defaultColours = {
            domainSelection: 'rgb(255,0,0)',
            mouseOver: 'rgb(105,105,105)',
            borderColor: 'rgb(0,0,0)',
            qualityGreen: 'rgb(0,182.85714285714286,0)',
            qualityRed: 'rgb(291.42857142857144,0,0)',
            qualityYellow: 'rgb(364.2857142857143,364.2857142857143,75.71428571428572)',
            qualityOrange: 'rgb(291.42857142857144,121.42857142857143,0)'
        };
        this.displayStyle = 'border:1px solid #696969;';
        this.errorStyle = 'border:1px solid #696969; height:54%; padding-top:46%; text-align:center; font-weight:bold;';
        this.menuStyle = 'position:relative;height:38px;line-height:38px;background-color:#696969;padding: 0 10px;font-size:16px; color: #efefef;';
        this.svgWidth = 100;
        this.svgHeight = 100;
        this.subscribeEvents = true;
        this.createNewEvent = function (eventTypeArr) {
            var eventObj = {};
            eventTypeArr.forEach(function (eventType, index) {
                var event;
                if (typeof MouseEvent == 'function') {
                    // current standard
                    event = new MouseEvent(eventType, { 'view': window, 'bubbles': true, 'cancelable': true });
                }
                else if (typeof document.createEvent == 'function') {
                    // older standard
                    event = document.createEvent('MouseEvents');
                    event.initEvent(eventType, true /*bubbles*/, true /*cancelable*/);
                }
                eventObj[eventType] = event;
            });
            return eventObj;
        };
        this.getAnnotationFromMappings = function () {
            var _this_1 = this;
            var mappings = this.apiData[1];
            if (typeof mappings == 'undefined')
                return;
            var mappingsData = this.apiData[1][this.entryId];
            var categoryArr = ['UniProt', 'CATH', 'Pfam', 'SCOP'];
            var _loop_1 = function (catIndex) {
                if (typeof mappingsData[categoryArr[catIndex]] !== 'undefined') {
                    if (Object.entries(mappingsData[categoryArr[catIndex]]).length !== 0) {
                        var residueDetails_1 = [];
                        //Iterate over mappings data to get start and end residues
                        var mappingRecords = mappingsData[categoryArr[catIndex]];
                        for (var accKey in mappingRecords) {
                            mappingRecords[accKey].mappings.forEach(function (domainMappings) {
                                if (domainMappings.entity_id == _this_1.entityId && domainMappings.chain_id == _this_1.chainId) {
                                    residueDetails_1.push({
                                        start: domainMappings.start.residue_number,
                                        end: domainMappings.end.residue_number,
                                        color: undefined
                                    });
                                }
                            });
                        }
                        if (residueDetails_1.length > 0) {
                            this_1.domainTypes.push({
                                label: categoryArr[catIndex],
                                data: residueDetails_1
                            });
                        }
                    }
                }
            };
            var this_1 = this;
            for (var catIndex = 0; catIndex < 3; catIndex++) {
                _loop_1(catIndex);
            }
        };
        this.createDomainDropdown = function () {
            this.domainTypes = [{
                    label: 'Annotation',
                    data: null
                }];
            this.getAnnotationFromMappings();
            this.getAnnotationFromOutliers();
            this.selectedDomain = this.domainTypes[0];
            if (this.domainTypes.length > 1) {
                var optionList_1 = '';
                this.domainTypes.forEach(function (opt, i) {
                    optionList_1 = optionList_1 + "<option value=\"" + i + "\">" + opt.label + "</option>";
                });
                var selectBoxEle = this.targetEle.querySelector('.menuSelectbox');
                selectBoxEle.innerHTML = optionList_1;
                selectBoxEle.addEventListener("change", this.displayDomain.bind(this));
                var resetIconEle = this.targetEle.querySelector('.resetIcon');
                resetIconEle.addEventListener("click", this.resetDisplay.bind(this));
            }
            else {
                this.targetEle.querySelector('.menuOptions').style.display = 'none';
            }
        };
    }
    PdbTopologyViewerPlugin.prototype.render = function (target, options) {
        var _this_1 = this;
        if (options && typeof options.displayStyle != 'undefined' && options.displayStyle != null)
            this.displayStyle += options.displayStyle;
        if (options && typeof options.errorStyle != 'undefined' && options.errorStyle != null)
            this.errorStyle += options.errorStyle;
        if (options && typeof options.menuStyle != 'undefined' && options.menuStyle != null)
            this.menuStyle += options.menuStyle;
        this.targetEle = target;
        if (this.targetEle)
            this.targetEle.innerHTML = '';
        if (!target || !options || !options.entryId || !options.entityId) {
            this.displayError('param');
            return;
        }
        if (options.subscribeEvents == false)
            this.subscribeEvents = false;
        this.entityId = options.entityId;
        this.entryId = options.entryId.toLowerCase();
        //If chain id is not provided then get best chain id from observed residues api
        if (typeof options.chainId == 'undefined' || options.chainId == null) {
            this.getObservedResidues(this.entryId).then(function (result) {
                if (typeof result != 'undefined' && typeof result[_this_1.entryId] != 'undefined' && typeof result[_this_1.entryId][_this_1.entityId] != 'undefined') {
                    _this_1.chainId = result[_this_1.entryId][_this_1.entityId][0].chain_id;
                    _this_1.initPainting();
                }
                else {
                    _this_1.displayError();
                }
            });
        }
        else {
            this.chainId = options.chainId;
            this.initPainting();
        }
    };
    PdbTopologyViewerPlugin.prototype.initPainting = function () {
        var _this_1 = this;
        this.getApiData(this.entryId, this.chainId).then(function (result) {
            if (result) {
                //Validate required data in the API result set (0, 2, 4)
                if (typeof result[0] == 'undefined' || typeof result[2] == 'undefined' || typeof result[4] == 'undefined') {
                    _this_1.displayError();
                    return;
                }
                _this_1.apiData = result;
                //default pdb events
                _this_1.pdbevents = _this_1.createNewEvent(['PDB.topologyViewer.click', 'PDB.topologyViewer.mouseover', 'PDB.topologyViewer.mouseout']);
                _this_1.getPDBSequenceArray(_this_1.apiData[0][_this_1.entryId]);
                _this_1.drawTopologyStructures();
                _this_1.createDomainDropdown();
                if (_this_1.subscribeEvents)
                    _this_1.subscribeWcEvents();
            }
            else {
            }
        });
    };
    PdbTopologyViewerPlugin.prototype.displayError = function (errType) {
        var errtxt = "Error: Data not available!";
        if (errType == 'param')
            errtxt = "Error: Invalid Parameters!";
        if (this.targetEle)
            this.targetEle.innerHTML = "<div style=\"" + this.errorStyle + "\">" + errtxt + "</div>";
    };
    PdbTopologyViewerPlugin.prototype.getObservedResidues = function (pdbId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://www.ebi.ac.uk/pdbe/api/pdb/entry/observed_residues_ratio/" + pdbId)];
                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        console.log("Couldn't load UniProt variants", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PdbTopologyViewerPlugin.prototype.getApiData = function (pdbId, chainId) {
        return __awaiter(this, void 0, void 0, function () {
            var dataUrls;
            return __generator(this, function (_a) {
                dataUrls = [
                    "https://www.ebi.ac.uk/pdbe/api/pdb/entry/entities/" + pdbId,
                    "https://www.ebi.ac.uk/pdbe/api/mappings/" + pdbId,
                    "https://www.ebi.ac.uk/pdbe/api/topology/entry/" + pdbId,
                    "https://www.ebi.ac.uk/pdbe/api/validation/residuewise_outlier_summary/entry/" + pdbId,
                    "https://www.ebi.ac.uk/pdbe/api/pdb/entry/polymer_coverage/" + pdbId + "/chain/" + chainId
                ];
                return [2 /*return*/, Promise.all(dataUrls.map(function (url) { return fetch(url); }))
                        .then(function (resp) { return Promise.all(resp.map(function (r) {
                        if (r.status == 200) {
                            return r.json();
                        }
                        else {
                            return undefined;
                        }
                    })); })];
            });
        });
    };
    PdbTopologyViewerPlugin.prototype.getPDBSequenceArray = function (entities) {
        var totalEntities = entities.length;
        for (var i = 0; i < totalEntities; i++) {
            if (entities[i].entity_id == this.entityId) {
                this.sequenceArr = entities[i].sequence.split('');
            }
        }
    };
    PdbTopologyViewerPlugin.prototype.chunkArray = function (arr, len) {
        var chunks = [], i = 0, n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    };
    PdbTopologyViewerPlugin.prototype.getDomainRange = function () {
        var _this_1 = this;
        var allCordinatesArray = [];
        var topologyData = this.apiData[2][this.entryId][this.entityId][this.chainId];
        for (var secStrType in topologyData) {
            if (topologyData[secStrType]) {
                // iterating on secondary str data array to get array spliced in x,y 
                topologyData[secStrType].forEach(function (secStrData) {
                    if (typeof secStrData.path !== 'undefined' && secStrData.path.length > 0) {
                        allCordinatesArray = allCordinatesArray.concat(_this_1.chunkArray(secStrData.path, 2));
                    }
                });
            }
        }
        ;
        this.xScale = d3.scaleLinear()
            .domain([d3.min(allCordinatesArray, function (d) { return d[0]; }), d3.max(allCordinatesArray, function (d) { return d[0]; })])
            .range([1, this.svgWidth - 1]);
        this.yScale = d3.scaleLinear()
            .domain([d3.min(allCordinatesArray, function (d) { return d[1]; }), d3.max(allCordinatesArray, function (d) { return d[1]; })])
            .range([1, this.svgHeight - 1]);
        this.zoom = d3.zoom()
            .on("zoom", function () { return _this_1.zoomDraw(); });
        //.scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        // .transform(this.xScale, this.yScale)
    };
    PdbTopologyViewerPlugin.prototype.drawStrandSubpaths = function (startResidueNumber, stopResidueNumber, index) {
        var _this = this;
        var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1;
        var subPathHeight = (this.scaledPointsArr[7] - this.scaledPointsArr[1]) / totalAaInPath;
        //create subsections/paths
        var dValArr = [];
        for (var subPathIndex = 0; subPathIndex < totalAaInPath; subPathIndex++) {
            var subPathObj = { type: 'strands', elementIndex: index };
            if (subPathIndex === 0) {
                subPathObj['residue_number'] = startResidueNumber;
                subPathObj['pathData'] = [
                    this.scaledPointsArr[4], this.scaledPointsArr[1],
                    this.scaledPointsArr[4], this.scaledPointsArr[1] + subPathHeight,
                    this.scaledPointsArr[8], this.scaledPointsArr[1] + subPathHeight,
                    this.scaledPointsArr[8], this.scaledPointsArr[13]
                ];
            }
            else {
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
        this.svgEle.selectAll('.subpath-strands' + index).remove();
        this.svgEle.selectAll('.subpath-strands' + index)
            .data(dValArr)
            .enter()
            .append('path')
            .attr('class', function (d, i) { return 'strandsSubPath subpath-strands' + index + ' topo_res_' + d.residue_number; })
            .attr('d', function (d, i) { return 'M ' + d.pathData.join(' ') + ' Z'; })
            .attr('stroke', '#111')
            .attr('stroke-width', '0')
            .attr('fill', 'white')
            .attr('fill-opacity', '0')
            .on('mouseover', function (d) { _this.mouseoverAction(this, d); })
            .on('mousemove', function (d) { _this.mouseoverAction(this, d); })
            .on('mouseout', function (d) { _this.mouseoutAction(this, d); })
            .on("click", function (d) { _this.clickAction(d); });
    };
    PdbTopologyViewerPlugin.prototype.drawStrandMaskShape = function (index) {
        var maskPointsArr = this.scaledPointsArr;
        var adjustmentFactor = 0.3;
        var adjustIndexAddArr = [7, 8, 10, 12];
        var adjustIndexSubtractArr = [0, 1, 2, 3, 4, 5, 9, 11, 13];
        //For arrow pointing upwards
        if (maskPointsArr[0] > maskPointsArr[6]) {
            adjustIndexAddArr = [0, 1, 2, 3, 4, 5, 9, 11, 13];
            adjustIndexSubtractArr = [7, 8, 10, 12];
        }
        var addIndexLength = adjustIndexAddArr.length;
        for (var maskPtIndex = 0; maskPtIndex < addIndexLength; maskPtIndex++) {
            maskPointsArr[adjustIndexAddArr[maskPtIndex]] = maskPointsArr[adjustIndexAddArr[maskPtIndex]] + adjustmentFactor;
        }
        var subtractIndexLength = adjustIndexSubtractArr.length;
        for (var maskPtIndex1 = 0; maskPtIndex1 < subtractIndexLength; maskPtIndex1++) {
            maskPointsArr[adjustIndexSubtractArr[maskPtIndex1]] = maskPointsArr[adjustIndexSubtractArr[maskPtIndex1]] - adjustmentFactor;
        }
        //Add the outer points          
        maskPointsArr[14] = maskPointsArr[8];
        maskPointsArr[15] = maskPointsArr[13];
        maskPointsArr[16] = maskPointsArr[8];
        maskPointsArr[17] = maskPointsArr[7];
        maskPointsArr[18] = maskPointsArr[4];
        maskPointsArr[19] = maskPointsArr[7];
        maskPointsArr[20] = maskPointsArr[4];
        maskPointsArr[21] = maskPointsArr[1];
        this.svgEle.selectAll('.maskpath-strands' + index).remove();
        this.svgEle.selectAll('.maskpath-strands' + index)
            .data([maskPointsArr])
            .enter()
            .append('path')
            .attr('class', function (d, i) { return 'strandMaskPath maskpath-strands' + index; })
            .attr('d', function (d, i) { return 'M' + maskPointsArr.join(' ') + 'Z'; })
            .attr('stroke', '#111')
            .attr('stroke-width', 0.3)
            .attr('fill', 'white')
            .attr('stroke-opacity', 0);
    };
    PdbTopologyViewerPlugin.prototype.renderTooltip = function (elementData, action) {
        var toolTipEle = d3.select('.pdbTopologyTooltip');
        if (toolTipEle._groups[0][0] == null) {
            toolTipEle = d3.select('body').append('div').attr('class', 'pdbTopologyTooltip').attr('style', 'display: none;width: auto;position: absolute;background: #fff;padding: 5px;border: 1px solid #666;border-radius: 5px;box-shadow: 5px 6px 5px 0 rgba(0,0,0,.17);font-size: .9em;color: #555;z-index: 998;');
        }
        if (action === 'show') {
            var x = d3.event.pageX, y = d3.event.pageY;
            var tooltipContent = 'Residue ' + elementData.residue_number + ' (' + this.sequenceArr[elementData.residue_number - 1] + ')';
            if (typeof elementData.tooltipMsg !== 'undefined') {
                if (typeof elementData.tooltipPosition !== 'undefined' && elementData.tooltipPosition === 'postfix') {
                    tooltipContent = tooltipContent + ' ' + elementData.tooltipMsg;
                }
                else {
                    tooltipContent = elementData.tooltipMsg + ' ' + tooltipContent;
                }
            }
            toolTipEle
                .html(tooltipContent)
                .style('display', 'block')
                .style('top', y + 15 + 'px')
                .style('left', x + 10 + 'px');
        }
        else {
            toolTipEle.style('display', 'none');
        }
    };
    ;
    PdbTopologyViewerPlugin.prototype.dispatchEvent = function (eventType, eventData, eventElement) {
        var dispatchEventElement = this.targetEle;
        if (typeof eventElement !== 'undefined') {
            dispatchEventElement = eventElement;
        }
        if (typeof eventData !== 'undefined') {
            this.pdbevents[eventType]['eventData'] = eventData;
        }
        dispatchEventElement.dispatchEvent(this.pdbevents[eventType]);
    };
    ;
    PdbTopologyViewerPlugin.prototype.clickAction = function (eleObj) {
        //Dispatch custom click event
        this.dispatchEvent('PDB.topologyViewer.click', {
            residueNumber: eleObj.residue_number,
            type: eleObj.type,
            entryId: this.entryId,
            entityId: this.entityId,
            chainId: this.chainId,
        });
    };
    PdbTopologyViewerPlugin.prototype.mouseoverAction = function (eleObj, eleData) {
        var selectedPath = d3.select(eleObj);
        //var selectedPathData = selectedPath.data();
        //Show Tooltip
        this.renderTooltip(eleData, 'show');
        //Highlight Residue
        if (eleData.type === 'strands' || eleData.type === 'helices') {
            selectedPath.attr('fill', this.defaultColours.mouseOver).attr('fill-opacity', '0.3');
        }
        if (eleData.type === 'coils') {
            selectedPath.attr('stroke', this.defaultColours.mouseOver).attr('stroke-width', 1);
        }
        //Dispatch custom mouseover event
        this.dispatchEvent('PDB.topologyViewer.mouseover', {
            residueNumber: eleData.residue_number,
            type: eleData.type,
            entryId: this.entryId,
            entityId: this.entityId,
            chainId: this.chainId,
        });
    };
    PdbTopologyViewerPlugin.prototype.mouseoutAction = function (eleObj, eleData) {
        var mouseOverColor = 'white';
        var fillOpacity = 0;
        var strokeOpacity = 0.3;
        var pathElement = d3.select(eleObj);
        //Hide Tooltip
        this.renderTooltip('', 'hide');
        //if path colour is changed then get the colour
        if (pathElement.classed('coloured')) {
            mouseOverColor = pathElement.attr('data-color');
            fillOpacity = 1;
            strokeOpacity = 1;
        }
        else {
            if (eleData.type === 'coils') {
                mouseOverColor = this.defaultColours.borderColor;
            }
        }
        if (eleData.type === 'strands' || eleData.type === 'helices') {
            pathElement.attr('fill', mouseOverColor).attr('fill-opacity', fillOpacity);
        }
        if (eleData.type === 'coils') {
            pathElement.attr('stroke', mouseOverColor).attr('stroke-width', strokeOpacity);
        }
        //Dispatch custom mouseover event
        this.dispatchEvent('PDB.topologyViewer.mouseout', {
            entryId: this.entryId,
            entityId: this.entityId,
            chainId: this.chainId,
        });
    };
    PdbTopologyViewerPlugin.prototype.drawHelicesSubpaths = function (startResidueNumber, stopResidueNumber, index, curveYdiff) {
        var _this = this;
        curveYdiff = 0;
        var diffVal = 5;
        var curveYdiff2 = curveYdiff - diffVal;
        if (this.scaledPointsArr[3] > this.scaledPointsArr[9])
            curveYdiff2 = curveYdiff + diffVal;
        var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1;
        if (curveYdiff === 0)
            curveYdiff2 = 0;
        var subPathHeight = ((this.scaledPointsArr[9] - curveYdiff2) - this.scaledPointsArr[3]) / totalAaInPath;
        var startPoint = 0;
        if (curveYdiff === 0) {
            var boxHeight = (this.svgEle.select('.helices' + index).node().getBBox().height) + (subPathHeight / 2);
            var singleUnitHt = boxHeight / totalAaInPath;
            //boxHeight = boxHeight - singleUnitHt; //height correction
            subPathHeight = (boxHeight - singleUnitHt / 2) / totalAaInPath;
            startPoint = (subPathHeight - singleUnitHt / 10);
            if (this.scaledPointsArr[3] > this.scaledPointsArr[9]) {
                //startPoint = -(boxHeight + singleUnitHt/3);
                startPoint = -(boxHeight + singleUnitHt);
            }
        }
        //create subsections/paths
        var dValArr2 = [];
        var subPathObj = {};
        if (curveYdiff === 0) {
            for (var subPathIndex = 0; subPathIndex < totalAaInPath; subPathIndex++) {
                subPathObj = { type: 'helices' };
                if (subPathIndex === 0) {
                    if (this.scaledPointsArr[3] > this.scaledPointsArr[9]) {
                        subPathObj['residue_number'] = stopResidueNumber;
                    }
                    else {
                        subPathObj['residue_number'] = startResidueNumber;
                    }
                    subPathObj['pathData'] = [
                        this.scaledPointsArr[0], this.scaledPointsArr[3] + startPoint,
                        this.scaledPointsArr[4], this.scaledPointsArr[3] + startPoint,
                        this.scaledPointsArr[4], this.scaledPointsArr[3] + startPoint + subPathHeight,
                        this.scaledPointsArr[0], this.scaledPointsArr[3] + startPoint + subPathHeight
                    ];
                }
                else {
                    if (this.scaledPointsArr[3] > this.scaledPointsArr[9]) {
                        subPathObj['residue_number'] = stopResidueNumber - subPathIndex;
                    }
                    else {
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
        }
        else {
            for (var subPathIndex = 0; subPathIndex < totalAaInPath; subPathIndex++) {
                subPathObj = { type: 'helices', elementIndex: index };
                if (subPathIndex === 0) {
                    subPathObj['residue_number'] = startResidueNumber;
                    subPathObj['pathData'] = [
                        _this.scaledPointsArr[0], _this.scaledPointsArr[3] + curveYdiff2 / 2,
                        _this.scaledPointsArr[4], _this.scaledPointsArr[3] + curveYdiff2 / 2,
                        _this.scaledPointsArr[4], _this.scaledPointsArr[3] + subPathHeight + curveYdiff2 / 2,
                        _this.scaledPointsArr[0], _this.scaledPointsArr[3] + subPathHeight + curveYdiff2 / 2
                    ];
                }
                else {
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
        this.svgEle.selectAll('.subpath-helices' + index).remove();
        this.svgEle.selectAll('.subpath-helices' + index)
            .data(dValArr2)
            .enter()
            .append('path')
            .attr('class', function (d) { return 'helicesSubPath subpath-helices' + index + ' topo_res_' + d.residue_number; })
            .attr('d', function (d) { return 'M' + d.pathData.join(' ') + ' Z'; })
            .attr('stroke', '#111')
            .attr('stroke-width', '0')
            .attr('fill', 'white')
            .attr('fill-opacity', '0')
            .on('mouseover', function (d) { _this.mouseoverAction(this, d); })
            .on('mousemove', function (d) { _this.mouseoverAction(this, d); })
            .on('mouseout', function (d) { _this.mouseoutAction(this, d); })
            .on("click", function (d) { _this.clickAction(d); });
    };
    PdbTopologyViewerPlugin.prototype.drawHelicesMaskShape = function (index) {
        var adjustmentFactor = 0.3;
        var helicesMaskArr = [
            [this.scaledPointsArr[0] - adjustmentFactor, this.scaledPointsArr[1],
                this.scaledPointsArr[2], this.scaledPointsArr[3] - adjustmentFactor,
                this.scaledPointsArr[4] + adjustmentFactor, this.scaledPointsArr[5],
                this.scaledPointsArr[4] + adjustmentFactor, this.scaledPointsArr[3],
                this.scaledPointsArr[0] - adjustmentFactor, this.scaledPointsArr[3]
            ],
            [this.scaledPointsArr[6] + adjustmentFactor, this.scaledPointsArr[7],
                this.scaledPointsArr[8], this.scaledPointsArr[9] + adjustmentFactor,
                this.scaledPointsArr[10] - adjustmentFactor, this.scaledPointsArr[11],
                this.scaledPointsArr[10] - adjustmentFactor, this.scaledPointsArr[9],
                this.scaledPointsArr[6] + adjustmentFactor, this.scaledPointsArr[9]
            ]
        ];
        if (this.scaledPointsArr[3] > this.scaledPointsArr[9]) {
            helicesMaskArr = [
                [this.scaledPointsArr[0] - adjustmentFactor, this.scaledPointsArr[1],
                    this.scaledPointsArr[2], this.scaledPointsArr[3] + 2,
                    this.scaledPointsArr[4] + adjustmentFactor, this.scaledPointsArr[5],
                    this.scaledPointsArr[4] + adjustmentFactor, this.scaledPointsArr[3],
                    this.scaledPointsArr[0] - adjustmentFactor, this.scaledPointsArr[3]
                ],
                [this.scaledPointsArr[6] + adjustmentFactor, this.scaledPointsArr[7],
                    this.scaledPointsArr[8], this.scaledPointsArr[9] - adjustmentFactor,
                    this.scaledPointsArr[10] - adjustmentFactor, this.scaledPointsArr[11],
                    this.scaledPointsArr[10] - adjustmentFactor, this.scaledPointsArr[9],
                    this.scaledPointsArr[6] + adjustmentFactor, this.scaledPointsArr[9]
                ]
            ];
        }
        //remove old maskpath
        this.svgEle.selectAll('.maskpath-helices' + index).remove();
        //create new resized mask path 
        this.svgEle.selectAll('.maskpath-helices' + index)
            .data(helicesMaskArr)
            .enter()
            .append('path')
            .attr('class', function (d) { return 'helicesMaskPath maskpath-helices' + index; })
            .attr('d', function (d) {
            return 'M' + d[0] + ' ' + d[1] + ' Q' + d[2] + ' ' + d[3] + ' ' + d[4] + ' ' + d[5] + ' L' + d[6] + ' ' + d[7] + ' ' + d[8] + ' ' + d[9] + ' Z';
        })
            .attr('stroke', '#111')
            .attr('stroke-width', 0.3)
            .attr('fill', 'white')
            .attr('stroke-opacity', 0);
    };
    PdbTopologyViewerPlugin.prototype.drawCoilsSubpaths = function (startResidueNumber, stopResidueNumber, index) {
        var _this = this;
        var coilEle = this.svgEle.select('.coils' + index);
        var totalAaInPath = (stopResidueNumber - startResidueNumber) + 1;
        var coilLength = coilEle.node().getTotalLength();
        var subPathLength = coilLength / totalAaInPath;
        var subPathCordsArr = [];
        var prevPathCord = undefined;
        var prevCordArrPositon = undefined;
        //var prevSubPathCord = [];
        var newSubPathCords = {};
        if (totalAaInPath === 1) {
            newSubPathCords = {
                residue_number: startResidueNumber,
                type: 'coils',
                pathData: _this.scaledPointsArr,
                elementIndex: index
            };
            subPathCordsArr.push(newSubPathCords);
        }
        else {
            for (var subPathIndex = 0; subPathIndex < totalAaInPath; subPathIndex++) {
                var segLength = subPathLength * (subPathIndex + 1);
                var subPathCord = coilEle.node().getPointAtLength(segLength);
                var cordArrPositon = coilEle.node().getPathSegAtLength(segLength);
                newSubPathCords = {
                    residue_number: startResidueNumber + subPathIndex,
                    type: 'coils',
                    elementIndex: index
                };
                if (cordArrPositon === 1) {
                    newSubPathCords['pathData'] = _this.scaledPointsArr.slice(0, 2);
                }
                else {
                    if (prevCordArrPositon === undefined) {
                        newSubPathCords['pathData'] = _this.scaledPointsArr.slice(0, cordArrPositon * 2);
                    }
                    else {
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
        if (startResidueNumber !== -1 && stopResidueNumber !== -1) {
            this.svgEle.selectAll('.subpath-coils' + index).remove();
            this.svgEle.selectAll('.subpath-coils' + index)
                .data(subPathCordsArr)
                .enter()
                .append('path')
                .attr('class', function (d) { return 'coilsSubPath subpath-coils' + index + ' topo_res_' + d.residue_number; })
                .attr('d', function (d) { return 'M ' + d.pathData.join(' '); })
                .attr('stroke', this.defaultColours.borderColor)
                .attr('stroke-width', 0.3)
                .attr('fill', 'none')
                .attr('stroke-opacity', '1')
                .on('mouseover', function (d) { _this.mouseoverAction(this, d); })
                .on('mousemove', function (d) { _this.mouseoverAction(this, d); })
                .on('mouseout', function (d) { _this.mouseoutAction(this, d); })
                .on("click", function (d) { _this.clickAction(d); });
            //Hide the main coil path
            this.svgEle.selectAll('.coils' + index).attr('stroke-opacity', 0);
        }
        var termsData = this.apiData[2][this.entryId][this.entityId][this.chainId].terms;
        var totalCoilsInStr = this.apiData[2][this.entryId][this.entityId][this.chainId].coils.length;
        if (index === 0) {
            this.svgEle.selectAll('.terminal_N').remove();
            this.svgEle.selectAll('.terminal_N')
                .data([termsData[0]])
                .enter()
                .append('text')
                .attr('class', 'terminals terminal_N')
                .attr('text-anchor', 'middle')
                .text('N')
                .attr('x', subPathCordsArr[0]['pathData'][0])
                .attr('y', subPathCordsArr[0]['pathData'][1])
                .attr('stroke', '#0000ff')
                .attr('stroke-width', '0.3')
                // .attr('font-size', 3 * this.zoom.scale() +'px')
                .attr('font-size', '3px')
                .attr('style', "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; line-height: normal; font-family: Arial;");
        }
        else if (index === totalCoilsInStr - 1) {
            var pathDataLen = subPathCordsArr[totalAaInPath - 1]['pathData'].length;
            var adjustmentFactor = -2;
            if (subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 1] > subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 3]) {
                adjustmentFactor = 2;
            }
            this.svgEle.selectAll('.terminal_C').remove();
            this.svgEle.selectAll('.terminal_C')
                .data([termsData[1]])
                .enter()
                .append('text')
                .attr('class', 'terminals terminal_N')
                .attr('text-anchor', 'middle')
                .text('C')
                .attr('x', subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 2])
                .attr('y', subPathCordsArr[totalAaInPath - 1]['pathData'][pathDataLen - 1] + adjustmentFactor)
                .attr('stroke', '#ff0000')
                .attr('stroke-width', '0.3')
                // .attr('font-size', 3 * this.zoom.scale() +'px')
                .attr('font-size', '3px')
                .attr('style', "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; line-height: normal; font-family: Arial;");
        }
    };
    PdbTopologyViewerPlugin.prototype.drawTopologyStructures = function () {
        var _this_1 = this;
        //Add container elements
        this.targetEle.innerHTML = "<div style=\"" + this.displayStyle + "\">\n            <div class=\"svgSection\" style=\"position:relative;width:100%;\"></div>\n            <div style=\"" + this.menuStyle + "\">\n                <img src=\"https://www.ebi.ac.uk/pdbe/entry/static/images/logos/PDBe/logo_T_64.png\" style=\"height:15px; width: 15px; border:0;position: absolute;margin-top: 11px;\" />\n                <a style=\"color: #efefef;border-bottom:none; cursor:pointer;margin-left: 16px;\" target=\"_blank\" href=\"https://pdbe.org/" + this.entryId + "\">" + this.entryId + "</a> | <span class=\"menuDesc\">Entity " + this.entityId + " | Chain " + this.chainId.toUpperCase() + "</span>\n                <div class=\"menuOptions\" style=\"float:right;margin-right: 20px;\">\n                    <select class=\"menuSelectbox\" style=\"margin-right: 10px;\"><option value=\"\">Select</option></select>\n                    <img class=\"resetIcon\" src=\"https://www.ebi.ac.uk/pdbe/pdb-component-library/images/refresh.png\" style=\"height:15px; width: 15px; border:0;position: absolute;margin-top: 11px;cursor:pointer;\" title=\"Reset view\" />\n                </div>\n            </div>\n        </div>";
        //Get dimenstions
        var targetEleWt = this.targetEle.offsetWidth;
        var targetEleHt = this.targetEle.offsetHeight;
        if (targetEleWt == 0 || this.targetEle.tagName === 'PDB-TOPOLOGY-VIEWER')
            targetEleWt = this.targetEle.parentElement.offsetWidth;
        if (targetEleHt == 0 || this.targetEle.tagName === 'PDB-TOPOLOGY-VIEWER')
            targetEleHt = this.targetEle.parentElement.offsetHeight;
        if (targetEleWt <= 330)
            this.targetEle.querySelector('.menuDesc').innerText = this.entityId + " | " + this.chainId.toUpperCase();
        //Set svg section dimensions
        var svgSection = this.targetEle.querySelector('.svgSection');
        var svgSectionHt = targetEleHt - 40;
        var svgSectionWt = targetEleWt;
        svgSection.style.height = svgSectionHt + 'px';
        //Set svg dimensions
        var svgHt = svgSectionHt - 20;
        var svgWt = svgSectionWt - 5;
        svgSection.innerHTML = "<svg class=\"topoSvg\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 100 100\" style=\"width:" + svgWt + "px;height:" + svgHt + "px;margin:10px 0;\"></svg>";
        this.svgEle = d3.select(this.targetEle).select('.topoSvg');
        this.getDomainRange();
        this.scaledPointsArr = [];
        this.svgEle.call(this.zoom).on("contextmenu", function (d, i) { d3.event.preventDefault(); }); //add zoom event and block right click event
        var topologyData = this.apiData[2][this.entryId][this.entityId][this.chainId];
        var _loop_2 = function (secStrType) {
            // angular.forEach(this.apiResult.data[_this.entryId].topology[scope.entityId][scope.bestChainId], function(secStrArr, secStrType) {
            var secStrArr = topologyData[secStrType];
            if (!secStrArr)
                return { value: void 0 };
            //iterating on secondary str data array
            secStrArr.forEach(function (secStrData, secStrDataIndex) {
                if (typeof secStrData.path !== 'undefined' && secStrData.path.length > 0) {
                    if (secStrType === 'terms') {
                        //Terms
                    }
                    else {
                        var curveYdiff = 0;
                        //modify helices path data to create a capsule like structure
                        if (secStrType === 'helices') {
                            var curveCenter = secStrData.path[0] + ((secStrData.path[2] - secStrData.path[0]) / 2);
                            curveYdiff = 2 * (secStrData.minoraxis * 1.3);
                            if (secStrData.path[1] > secStrData.path[3]) {
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
                        var newEle = _this_1.svgEle.selectAll('path.' + secStrType + '' + secStrDataIndex)
                            .data([secStrData])
                            .enter()
                            .append('path')
                            .attr('class', function () {
                            if (secStrData.start === -1 && secStrData.stop === -1 && secStrType !== 'terms') {
                                return 'dashedEle topologyEle ' + secStrType + ' ' + secStrType + '' + secStrDataIndex + ' topoEleRange_' + secStrData.start + '-' + secStrData.stop;
                            }
                            else {
                                return 'topologyEle ' + secStrType + ' ' + secStrType + '' + secStrDataIndex + ' topoEleRange_' + secStrData.start + '-' + secStrData.stop;
                            }
                        })
                            .attr('d', function (d) {
                            var dVal = 'M';
                            var pathLenth = secStrData.path.length;
                            var xScaleFlag = true;
                            //if(secStrData.path[1] > secStrData.path[7]) maskDiff = 1;
                            for (var i = 0; i < pathLenth; i++) {
                                if (secStrType === 'helices' && (i === 2 || i === 8))
                                    dVal += ' Q';
                                //if(secStrType === 'coils' && secStrData.path.length < 12 && i === 2) dVal += ' C'
                                //if(secStrType === 'coils' && secStrData.path.length < 14 && secStrData.path.length > 12 && i === 4) dVal += ' C'
                                if ((secStrType === 'helices' && i === 6) || (secStrType === 'coils' && secStrData.path.length < 12 && i === 8))
                                    dVal += ' L';
                                if (xScaleFlag) {
                                    var xScaleValue = _this_1.xScale(secStrData.path[i]);
                                    dVal += ' ' + xScaleValue;
                                    _this_1.scaledPointsArr.push(xScaleValue);
                                }
                                else {
                                    var yScaleValue = _this_1.yScale(secStrData.path[i]);
                                    dVal += ' ' + yScaleValue;
                                    _this_1.scaledPointsArr.push(yScaleValue);
                                }
                                xScaleFlag = !xScaleFlag;
                            }
                            if (secStrType === 'strands' || secStrType === 'helices')
                                dVal += ' Z';
                            return dVal;
                        })
                            .attr('fill', 'none')
                            .attr('stroke-width', 0.3)
                            .attr('stroke', _this_1.defaultColours.borderColor);
                        if (secStrData.start === -1 && secStrData.stop === -1) {
                            newEle.attr('stroke-dasharray', '0.9');
                        }
                        //hightlight node calculations
                        if (secStrType === 'strands') {
                            //create subsections/paths
                            _this_1.drawStrandSubpaths(secStrData.start, secStrData.stop, secStrDataIndex);
                            //Create mask to restore shape
                            _this_1.drawStrandMaskShape(secStrDataIndex);
                            //bring original/complete helices in front newEle
                            // this.svgEle.append(newEle.node());		
                            _this_1.svgEle._groups[0][0].append(newEle.node());
                        }
                        //for helices
                        if (secStrType === 'helices') {
                            //create subsections/paths
                            _this_1.drawHelicesSubpaths(secStrData.start, secStrData.stop, secStrDataIndex, curveYdiff);
                            //Create mask to restore shape
                            _this_1.drawHelicesMaskShape(secStrDataIndex);
                            // //bring original/complete helices in front
                            // angular.element(element[0].querySelector('.topoSvg')).append(newEle.node());
                            _this_1.svgEle._groups[0][0].append(newEle.node());
                        }
                        //for coils
                        if (secStrType === 'coils') {
                            //create subsections/paths
                            _this_1.drawCoilsSubpaths(secStrData.start, secStrData.stop, secStrDataIndex);
                        }
                        _this_1.scaledPointsArr = []; //empty the arr for next iteration
                    }
                }
            });
        };
        for (var secStrType in topologyData) {
            var state_1 = _loop_2(secStrType);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        ;
        //bring rsrz validation circles in front
        this.svgEle._groups[0][0].append(this.svgEle.selectAll('.validationResidue').node());
    };
    ;
    PdbTopologyViewerPlugin.prototype.zoomDraw = function () {
        var _this_1 = this;
        var new_xScale = d3.event.transform.rescaleX(this.xScale);
        var new_yScale = d3.event.transform.rescaleY(this.yScale);
        // return
        var _this = this;
        _this.scaledPointsArr = [];
        var pathEle = this.svgEle.selectAll('.topologyEle');
        var pathIndex = 0;
        var pathStartResidue = 0;
        var pathStopResidue = 0;
        var curveYdiff = 0;
        pathEle.each(function (d) {
            d3.select(d3.select(this).node()).attr('d', function (d) {
                pathIndex = d.pathIndex;
                pathStartResidue = d.start;
                pathStopResidue = d.stop;
                var dVal = 'M';
                var pathLenth = d.path.length;
                var xScaleFlag = true;
                // var maskDiff = -1; //value to add/minus to show the border properly
                for (var i = 0; i < pathLenth; i++) {
                    if (d.secStrType === 'helices' && (i === 2 || i === 8))
                        dVal += ' Q';
                    //if(d.secStrType === 'coils' && d.path.length < 12 && i === 2) dVal += ' C'
                    if ((d.secStrType === 'helices' && i === 6) || (d.secStrType === 'coils' && d.path.length < 12 && i === 8))
                        dVal += ' L';
                    if (xScaleFlag) {
                        var xScaleValue = new_xScale(d.path[i]);
                        dVal += ' ' + xScaleValue;
                        _this.scaledPointsArr.push(xScaleValue);
                    }
                    else {
                        var yScaleValue = new_yScale(d.path[i]);
                        dVal += ' ' + yScaleValue;
                        _this.scaledPointsArr.push(yScaleValue);
                    }
                    xScaleFlag = !xScaleFlag;
                }
                if (d.secStrType === 'strands' || d.secStrType === 'helices')
                    dVal += ' Z';
                return dVal;
            });
            //Create mask to restore shape
            if (d.secStrType === 'helices') {
                //create subsections/paths
                _this.drawHelicesSubpaths(pathStartResidue, pathStopResidue, pathIndex, curveYdiff);
                _this.drawHelicesMaskShape(pathIndex);
                //bring original/complete helices in front newEle
                _this.svgEle._groups[0][0].append(d3.select(this).node());
            }
            else if (d.secStrType === 'strands') {
                _this.drawStrandSubpaths(pathStartResidue, pathStopResidue, pathIndex);
                _this.drawStrandMaskShape(pathIndex);
                //bring original/complete helices in front newEle
                _this.svgEle._groups[0][0].append(d3.select(this).node());
            } //for coils
            else if (d.secStrType === 'coils') {
                //create subsections/paths
                _this.drawCoilsSubpaths(pathStartResidue, pathStopResidue, pathIndex);
            }
            _this.scaledPointsArr = []; //empty the arr for next iteration
        });
        //scale validation - rsrz circle's
        var ValResheight = 0;
        this.svgEle
            .selectAll('.validationResidue')
            .attr('transform', function (d) {
            //get Shape dimesions
            var residueEle = _this.svgEle.select('.topo_res_' + d.residue_number);
            var dimensions = residueEle.node().getBBox();
            var residueEleData = residueEle.data();
            var reszEleCordinates = { x: 0, y: 0 };
            if (residueEleData[0].type === 'strands' || residueEleData[0].type === 'helices') {
                reszEleCordinates = {
                    x: dimensions.x + dimensions.width / 2,
                    y: dimensions.y + dimensions.height / 2
                };
            }
            else {
                var coilCenter = residueEle.node().getPointAtLength(residueEle.node().getTotalLength() / 2);
                reszEleCordinates = {
                    x: coilCenter.x,
                    y: coilCenter.y
                };
            }
            ValResheight = dimensions.height / 2;
            return "translate(" + reszEleCordinates.x + "," + reszEleCordinates.y + ")";
        })
            .attr("d", d3.symbol().type(function (d, i) { return d3.symbols[0]; }).size(ValResheight));
        //scale selection paths
        this.svgEle
            .selectAll('.residueSelection')
            .attr('d', function (d) {
            //assign the d attribute of the corresponding sub-path
            var dataObj = d3.select(this).data();
            return _this.svgEle.select('.topo_res_' + dataObj[0].residueNumber).attr('d');
        });
        //shift coilssub path to top in DOM
        this.svgEle._groups[0][0].querySelectorAll('.coilsSubPath').forEach(function (node) { return _this_1.svgEle._groups[0][0].append(node); });
        //shift dashed paths to top in DOM
        this.svgEle._groups[0][0].querySelectorAll('.dashedEle').forEach(function (node) { return _this_1.svgEle._groups[0][0].append(node); });
        this.displayDomain('zoom');
        //bring rsrz validation circles in front
        this.svgEle._groups[0][0].querySelectorAll('.validationResidue').forEach(function (node) { return _this_1.svgEle._groups[0][0].append(node); });
        //bring selection in front
        this.svgEle._groups[0][0].querySelectorAll('.residueSelection').forEach(function (node) { return _this_1.svgEle._groups[0][0].append(node); });
    };
    PdbTopologyViewerPlugin.prototype.clearHighlight = function () {
        this.svgEle.selectAll('.residueHighlight').remove();
    };
    PdbTopologyViewerPlugin.prototype.highlight = function (startResidue, endResidue, color, eventType) {
        var _this = this;
        var fill = '#000000';
        var stroke = '#000000';
        var strokeWidth = 0.3;
        var strokeOpacity = 0;
        var _loop_3 = function (residueNumber) {
            //get topology residue details
            var residueEle = this_2.svgEle.select('.topo_res_' + residueNumber);
            if (residueEle && residueEle._groups && residueEle._groups[0][0] == null)
                return { value: void 0 }; //if residue element do not exist
            var residueEleNode = residueEle.node();
            var residueEleData = residueEle.data();
            if (color) {
                if (typeof color == 'string') {
                    stroke = color;
                    fill = color;
                }
                else {
                    stroke = d3.rgb(color.r, color.g, color.b);
                    fill = d3.rgb(color.r, color.g, color.b);
                }
            }
            if (residueEleData[0].type !== 'strands' && residueEleData[0].type !== 'helices') {
                fill = 'none';
                strokeWidth = 2;
                strokeOpacity = 0.5;
            }
            else {
                stroke = 'none';
            }
            this_2.svgEle
                .append('path')
                .data([{ residueNumber: residueNumber }])
                .attr('class', function (d) {
                if (eventType == 'click') {
                    return 'residueSelection seletectedResidue_' + residueNumber;
                }
                else {
                    return 'residueHighlight highlightResidue_' + residueNumber;
                }
            })
                .attr('d', residueEle.attr('d'))
                .attr('fill', fill)
                .attr('fill-opacity', 0.5)
                .attr('stroke', stroke)
                .attr('stroke-opacity', strokeOpacity)
                .attr('stroke-width', strokeWidth)
                .on('mouseover', function (d) { _this.mouseoverAction(residueEleNode, residueEleData[0]); })
                .on('mousemove', function (d) { _this.mouseoverAction(residueEleNode, residueEleData[0]); })
                .on('mouseout', function (d) { _this.mouseoutAction(residueEleNode, residueEleData[0]); })
                .on("click", function (d) { _this.clickAction(residueEleData[0]); });
        };
        var this_2 = this;
        for (var residueNumber = startResidue; residueNumber <= endResidue; residueNumber++) {
            var state_2 = _loop_3(residueNumber);
            if (typeof state_2 === "object")
                return state_2.value;
        }
    };
    PdbTopologyViewerPlugin.prototype.drawValidationShape = function (residueNumber, shape, rgbColor) {
        var _this = this;
        //calculate Shape dimesions
        var residueEle = _this.svgEle.select('.topo_res_' + residueNumber);
        if (residueEle._groups[0][0] == null)
            return; //if residue element do not exist
        var dimensions = residueEle.node().getBBox();
        var residueEleData = residueEle.data();
        var reszEleCordinates = { x: 0, y: 0 };
        if (residueEleData[0].type === 'strands' || residueEleData[0].type === 'helices') {
            reszEleCordinates = {
                x: dimensions.x + dimensions.width / 2,
                y: dimensions.y + dimensions.height / 2
            };
        }
        else {
            var coilCenter = residueEle.node().getPointAtLength(residueEle.node().getTotalLength() / 2);
            reszEleCordinates = {
                x: coilCenter.x,
                y: coilCenter.y
            };
        }
        var validationResData = {
            residue_number: residueNumber,
            tooltipMsg: 'Validation issue: RSRZ <br>',
            tooltipPosition: 'prefix',
        };
        this.svgEle
            .append('path')
            .attr('class', 'validationResidue rsrz_' + residueNumber)
            .data([validationResData])
            .attr('fill', rgbColor)
            .attr('stroke', '#000')
            .attr('stroke-width', 0.3)
            .attr("transform", function (d) { return "translate(" + reszEleCordinates.x + "," + reszEleCordinates.y + ")"; })
            .attr("d", d3.symbol().type(function (d, i) { return d3.symbols[0]; }).size(dimensions.height / 2))
            .style('display', 'none')
            .on('mouseover', function (d) { _this.mouseoverAction(this, d); })
            .on('mousemove', function (d) { _this.mouseoverAction(this, d); })
            .on('mouseout', function (d) { _this.mouseoutAction(this, d); })
            .on("click", function (d) { _this.clickAction(d); });
    };
    PdbTopologyViewerPlugin.prototype.getChainStartAndEnd = function () {
        //chains array from polymerCoveragePerChain api result
        if (typeof this.apiData[4] == 'undefined')
            return;
        var chainsData = this.apiData[4][this.entryId].molecules[0].chains;
        //Iterate molecule data to get chain start and end residue
        var chainRange = { start: 0, end: 0 };
        var totalChainsInArr = chainsData.length;
        for (var chainIndex = 0; chainIndex < totalChainsInArr; chainIndex++) {
            if (chainsData[chainIndex].chain_id == this.chainId) {
                //iterate over observed array
                chainsData[chainIndex].observed.forEach(function (observedData, observedDataIndex) {
                    if (observedDataIndex == 0) {
                        chainRange.start = observedData.start.residue_number;
                        chainRange.end = observedData.end.residue_number;
                    }
                    else {
                        if (observedData.start.residue_number < chainRange.start) {
                            chainRange.start = observedData.start.residue_number;
                        }
                        if (observedData.end.residue_number > chainRange.end) {
                            chainRange.end = observedData.end.residue_number;
                        }
                    }
                });
                break;
            }
        }
        return chainRange;
    };
    PdbTopologyViewerPlugin.prototype.getAnnotationFromOutliers = function () {
        var _this_1 = this;
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
        if (typeof this.apiData[3] == 'undefined')
            return;
        var outlierData = this.apiData[3][this.entryId];
        if (typeof outlierData !== 'undefined' && typeof outlierData.molecules !== 'undefined' && outlierData.molecules.length > 0) {
            outlierData.molecules.forEach(function (qualityData) {
                if (qualityData.entity_id == _this_1.entityId) {
                    //Iterate chains array in outliers
                    qualityData.chains.forEach(function (chainDataObj) {
                        if (chainDataObj.chain_id == _this_1.chainId) {
                            //Iterate models array in chains array in outliers
                            chainDataObj.models.forEach(function (chainModelObj) {
                                //Iterate residues array in models array in outliers
                                chainModelObj.residues.forEach(function (outlierResidue) {
                                    var resColor = _this.defaultColours.qualityYellow;
                                    var issueSpell = 'issue';
                                    if (outlierResidue.outlier_types.length === 1 && outlierResidue.outlier_types[0] === 'RSRZ') {
                                        resColor = _this.defaultColours.qualityRed;
                                        _this.drawValidationShape(outlierResidue.residue_number, 'circle', resColor);
                                        //add residue number in temporary rsrz array
                                        rsrzTempArray.push(outlierResidue.residue_number);
                                        //check if residue exist in other outliers
                                        var otherOutlierIndex = otherOutliersTempArray.indexOf(outlierResidue.residue_number);
                                        if (otherOutlierIndex > -1) {
                                            residueDetails[otherOutlierIndex]['tooltipMsg'] = residueDetails[otherOutlierIndex]['tooltipMsg'].replace('<br>', ', RSRZ<br>');
                                        }
                                        else {
                                            //Adding this to have tooltip on subpath with only rsrz validation 
                                            residueDetails.push({
                                                start: parseInt(outlierResidue.residue_number),
                                                end: parseInt(outlierResidue.residue_number),
                                                color: _this.defaultColours.qualityGreen,
                                                tooltipMsg: 'Validation issue: RSRZ <br>',
                                                tooltipPosition: 'prefix'
                                            });
                                            //add residue number in temporary other Outliers array
                                            otherOutliersTempArray.push(outlierResidue.residue_number);
                                        }
                                        return;
                                    }
                                    else if (outlierResidue.outlier_types.length === 1) {
                                        resColor = _this.defaultColours.qualityYellow;
                                    }
                                    else if (outlierResidue.outlier_types.length === 2) {
                                        resColor = _this.defaultColours.qualityOrange;
                                        issueSpell = 'issues';
                                    }
                                    else {
                                        resColor = _this.defaultColours.qualityRed;
                                        issueSpell = 'issues';
                                    }
                                    //add residue number in temporary other Outliers array
                                    otherOutliersTempArray.push(outlierResidue.residue_number);
                                    //check if residue exist in other outliers and set the tooltip message
                                    var tooltipMsgText = 'Validation ' + issueSpell + ': ' + outlierResidue.outlier_types.join(', ') + '<br>';
                                    var rsrzTempArrayIndex = rsrzTempArray.indexOf(outlierResidue.residue_number);
                                    if (rsrzTempArrayIndex > -1) {
                                        tooltipMsgText = 'Validation issues: ' + outlierResidue.outlier_types.join(', ') + ', RSRZ<br>';
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
            if (residueDetails.length > 0) {
                this.domainTypes.push({
                    label: 'Quality',
                    data: residueDetails
                });
            }
        }
    };
    PdbTopologyViewerPlugin.prototype.resetTheme = function () {
        var _this = this;
        this.svgEle.selectAll('.coloured').each(function (d) {
            var element = d3.select(this);
            var node = element.node();
            //Remover tooltip content
            element.data()[0]['tooltipMsg'] = undefined;
            element.data()[0]['tooltipPosition'] = undefined;
            //Set coloured flag false
            var nodeEle = d3.select(node)
                .classed('coloured', false);
            //Change fill and border
            var nodeClassArr = nodeEle.attr('class').split(' ');
            if (nodeClassArr.indexOf('strandsSubPath') > -1 || nodeClassArr.indexOf('helicesSubPath') > -1) {
                nodeEle.attr('fill', 'white').attr('fill-opacity', 0);
            }
            else {
                nodeEle.attr('stroke', _this.defaultColours.borderColor).attr('stroke-width', 0.3);
            }
        });
        //hide rsrz validation circles
        this.svgEle.selectAll('.validationResidue').style('display', 'none');
    };
    PdbTopologyViewerPlugin.prototype.changeResidueColor = function (residueNumber, rgbColor, tooltipContent, tooltipPosition) {
        if (typeof rgbColor === 'undefined') {
            rgbColor = this.defaultColours.domainSelection;
        }
        var residueEle = this.svgEle.select('.topo_res_' + residueNumber);
        if (residueEle._groups[0][0] == null)
            return; //if residue element do not exist
        residueEle.data()[0]['tooltipMsg'] = tooltipContent;
        residueEle.data()[0]['tooltipPosition'] = tooltipPosition;
        residueEle
            .attr('stroke', function (d) { if (d.type === 'coils') {
            return rgbColor;
        }
        else {
            return '#111';
        } })
            .attr('stroke-width', function (d) { if (d.type === 'coils') {
            return 1;
        }
        else {
            return 0;
        } })
            .attr('fill', function (d) { if (d.type === 'coils') {
            return 'none';
        }
        else {
            return rgbColor;
        } })
            .attr('fill-opacity', function (d) { if (d.type === 'coils') {
            return 0;
        }
        else {
            return 1;
        } })
            .classed("coloured", true)
            .attr('data-color', rgbColor);
    };
    PdbTopologyViewerPlugin.prototype.updateTheme = function (residueDetails) {
        var _this = this;
        residueDetails.forEach(function (residueDetailsObj) {
            for (var i = residueDetailsObj.start; i <= residueDetailsObj.end; i++) {
                _this.changeResidueColor(i, residueDetailsObj.color, residueDetailsObj.tooltipMsg, residueDetailsObj.tooltipPosition);
            }
        });
    };
    PdbTopologyViewerPlugin.prototype.displayDomain = function (invokedFrom) {
        var selectBoxEle = this.targetEle.querySelector('.menuSelectbox');
        var selectedValue = parseInt(selectBoxEle.value);
        var selectedDomain = this.domainTypes[selectedValue];
        if (selectedDomain.data !== null) {
            this.resetTheme();
            this.updateTheme(selectedDomain.data);
            //show rsrz validation circles if Quality
            if (selectedDomain.label === 'Quality') {
                this.svgEle.selectAll('.validationResidue').style('display', 'block');
            }
        }
        else {
            if (invokedFrom !== 'zoom') {
                this.resetTheme();
            }
        }
    };
    PdbTopologyViewerPlugin.prototype.resetDisplay = function () {
        var selectBoxEle = this.targetEle.querySelector('.menuSelectbox');
        selectBoxEle.value = 0;
        this.displayDomain();
    };
    PdbTopologyViewerPlugin.prototype.handleSeqViewerEvents = function (e, eType) {
        if (typeof e.eventData !== 'undefined') {
            //Abort if entryid and entityid do not match
            if (e.eventData.entryId.toLowerCase() != this.entryId.toLowerCase() || e.eventData.entityId != this.entityId)
                return;
            //Abort if chain id is different
            if (e.eventData.elementData.pathData.chain_id && e.eventData.elementData.pathData.chain_id != this.chainId)
                return;
            //Remove previous selection / highlight
            var selectionPathClass = 'residueSelection';
            if (eType == 'mouseover') {
                selectionPathClass = 'residueHighlight';
            }
            this.svgEle.selectAll('.' + selectionPathClass).remove();
            var startResidue = void 0;
            var endResidue = void 0;
            if (e.eventData.residueNumber) {
                startResidue = e.eventData.residueNumber;
                endResidue = e.eventData.residueNumber;
            }
            else if (e.eventData.elementData.pathData.start.residue_number && e.eventData.elementData.pathData.end.residue_number) {
                startResidue = e.eventData.elementData.pathData.start.residue_number;
                endResidue = e.eventData.elementData.pathData.end.residue_number;
            }
            if (typeof startResidue !== 'undefined' && typeof endResidue !== 'undefined') {
                var color = void 0;
                if (e.eventData.elementData.color && e.eventData.elementData.color.length == 1) {
                    color = e.eventData.elementData.color[0];
                }
                else {
                    color = { r: e.eventData.elementData.color[0], g: e.eventData.elementData.color[1], b: e.eventData.elementData.color[2] };
                }
                this.highlight(startResidue, endResidue, color, eType);
            }
        }
    };
    PdbTopologyViewerPlugin.prototype.handleProtvistaEvents = function (e, eType) {
        if (typeof e.detail !== 'undefined') {
            var selColor = undefined;
            //Remove previous selection / highlight
            var selectionPathClass = 'residueSelection';
            if (eType == 'mouseover') {
                selectionPathClass = 'residueHighlight';
            }
            this.svgEle.selectAll('.' + selectionPathClass).remove();
            //Abort if chain id is different
            if (typeof e.detail.feature != 'undefined') {
                if (typeof e.detail.feature.accession != 'undefined') {
                    var accessionArr = e.detail.feature.accession.split(' ');
                    if (accessionArr[0] == 'Chain' && (accessionArr[1].toLowerCase() != this.chainId.toLowerCase()))
                        return;
                }
                if (e.detail.trackIndex > -1 && e.detail.feature.locations && e.detail.feature.locations[0].fragments[e.detail.trackIndex].color)
                    selColor = e.detail.feature.locations[0].fragments[e.detail.trackIndex].color;
                if (typeof selColor == 'undefined' && e.detail.feature.color)
                    selColor = e.detail.feature.color;
            }
            if (typeof selColor == 'undefined' && e.detail.color)
                selColor = e.detail.color;
            if (typeof selColor != 'undefined') {
                var isRgb = /rgb/g;
                ;
                if (isRgb.test(selColor)) {
                    selColor = selColor.substring(4, selColor.length - 1).split(',');
                }
                else {
                    selColor = [selColor];
                }
            }
            var color = void 0;
            if (selColor) {
                if (selColor.length == 1) {
                    color = selColor[0];
                }
                else {
                    color = { r: selColor[0], g: selColor[1], b: selColor[2] };
                }
            }
            //Apply new selection
            this.highlight(e.detail.start, e.detail.end, color, eType);
        }
    };
    PdbTopologyViewerPlugin.prototype.handleMolstarEvents = function (e, eType) {
        if (typeof e.eventData !== 'undefined' && Object.keys(e.eventData).length > 0) {
            //Remove previous selection / highlight
            var selectionPathClass = 'residueSelection';
            if (eType == 'mouseover') {
                selectionPathClass = 'residueHighlight';
            }
            this.svgEle.selectAll('.' + selectionPathClass).remove();
            //Abort if entryid and entityid do not match or viewer type is unipdb
            if (e.eventData.entry_id.toLowerCase() != this.entryId.toLowerCase() || e.eventData.entity_id != this.entityId)
                return;
            //Abort if chain id is different
            if (e.eventData.label_asym_id.toLowerCase() != this.chainId.toLowerCase())
                return;
            //Apply new selection
            this.highlight(e.eventData.seq_id, e.eventData.seq_id, undefined, eType);
        }
    };
    PdbTopologyViewerPlugin.prototype.subscribeWcEvents = function () {
        var _this_1 = this;
        //sequence viewer events
        document.addEventListener('PDB.seqViewer.click', function (e) {
            _this_1.handleSeqViewerEvents(e, 'click');
        });
        document.addEventListener('PDB.seqViewer.mouseover', function (e) {
            _this_1.handleSeqViewerEvents(e, 'mouseover');
        });
        document.addEventListener('PDB.seqViewer.mouseout', function () {
            _this_1.svgEle.selectAll('.residueHighlight').remove();
        });
        //litemol viewer events
        document.addEventListener('PDB.litemol.click', function (e) {
            _this_1.svgEle.selectAll('.residueSelection').remove();
            //Abort if entryid and entityid do not match or viewer type is unipdb
            if (e.eventData.entryId.toLowerCase() != _this_1.entryId.toLowerCase() || e.eventData.entityId != _this_1.entityId)
                return;
            //Abort if chain id is different
            if (e.eventData.chainId.toLowerCase() != _this_1.chainId.toLowerCase())
                return;
            _this_1.highlight(e.eventData.residueNumber, e.eventData.residueNumber, undefined, 'click');
        });
        document.addEventListener('PDB.litemol.mouseover', function (e) {
            _this_1.svgEle.selectAll('.residueHighlight').remove();
            //Abort if entryid and entityid do not match or viewer type is unipdb
            if (e.eventData.entryId.toLowerCase() != _this_1.entryId.toLowerCase() || e.eventData.entityId != _this_1.entityId)
                return;
            //Abort if chain id is different
            if (e.eventData.chainId.toLowerCase() != _this_1.chainId.toLowerCase())
                return;
            _this_1.highlight(e.eventData.residueNumber, e.eventData.residueNumber, undefined, 'mouseover');
        });
        //protvista viewer events
        document.addEventListener('protvista-click', function (e) {
            _this_1.handleProtvistaEvents(e, 'click');
        });
        document.addEventListener('protvista-mouseover', function (e) {
            _this_1.handleProtvistaEvents(e, 'mouseover');
        });
        document.addEventListener('protvista-mouseout', function () {
            _this_1.svgEle.selectAll('.residueHighlight').remove();
        });
        //molstar viewer events
        document.addEventListener('PDB.molstar.click', function (e) {
            _this_1.handleMolstarEvents(e, 'click');
        });
        document.addEventListener('PDB.molstar.mouseover', function (e) {
            _this_1.handleMolstarEvents(e, 'mouseover');
        });
        document.addEventListener('PDB.molstar.mouseout', function () {
            _this_1.svgEle.selectAll('.residueHighlight').remove();
        });
    };
    return PdbTopologyViewerPlugin;
}());
window.PdbTopologyViewerPlugin = PdbTopologyViewerPlugin;
//# sourceMappingURL=pdb-topology-viewer-plugin.js.map