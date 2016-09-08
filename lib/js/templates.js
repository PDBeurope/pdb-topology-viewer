angular.module("template/topologyViewer/topologyViewer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/topologyViewer/topologyViewer.html",
    '<div class="topologyViewerWrapper" ng-style="styles.wrapper" >'+
		'<!--<div class="topologyViewLoader" ng-style="styles.loader" ng-show="showLoader">'+
			'<img ng-src="//www.ebi.ac.uk/pdbe/widgets/html/loading.gif" border="0" ng-style="styles.loaderImg" />'+
		'</div>'+
		'<div class="topologyViewLoader" ng-style="styles.errorMsg" ng-show="showErrorMessage"><span ng-style="styles.errorMsgSpan">{{errorMessage}}</span></div>-->'+
		'<div ng-style="topoViewerOverlay" ng-show="overlayText != \'\'"><span ng-style="topoViewerOverlayMessage">{{overlayText}}</span></div>'+
		'<div class="rowSpacing">&nbsp;</div>'+
		'<div ng-style="styles.topoSvgWrapper">'+
			'<svg class="topoSvg" ng-style="styles.topoSvg" ></svg>'+
		'</div>'+
		'<div class="rowSpacing">&nbsp;</div>'+
		'<div ng-style="styles.bottomMenu">'+
			'<div class="controlsWrapper">'+
				'&nbsp;&nbsp;{{entryId}}:{{bestChainId}}&nbsp;'+
				'<select ng-style="styles.bottomMenuSelectBox" ng-model="selectedDomain" ng-options="domainType as domainType.label for domainType in domainTypes" ng-change="highlightDomain()"></select>'+
				'<span ng-click="clearSelectionAndHighlight()" class="topologyRefreshIcon icon-black" data-icon="R" title="Clear Highlight / Selection"></span>'+
			'</div>'+
		'</div>'+
	'</div>');
}]);