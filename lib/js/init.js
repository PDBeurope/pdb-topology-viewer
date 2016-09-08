/*document level component bootstrap to make it available across the document scope*/
(function () {
	'use strict';
	angular.element(document).ready(function () {
        angular.bootstrap(document, ["pdb.topology.viewer"]);
    });
}());