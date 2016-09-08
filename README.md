# PDB Topology Viewer

[![NPM version](http://img.shields.io/npm/v/pdb-topology-viewer.svg)](https://www.npmjs.org/package/pdb-topology-viewer) 

The topology viewer depicts the secondary structure of a protein in a 2D representation, taking into account the interactions of these secondary structure elements. This leads to a consistent display of sheets and domains in the structure. For PDB entries with multiple copies of a protein, the best chain is used. The topology viewer also depicts value-added annotation from SIFTS including residue-level mapping to UniProt, sequence families (Pfam), structure domains (SCOP, CATH) and structure quality from wwPDB validation reports.

It is a <a href="http://www.ebi.ac.uk/pdbe/pdb-component-library" target="_blank">PDB Component Library</a> component.

![PDB Topology Viewer](/assets/pdb-topology-viewer.png)

## Getting Started
It takes only 3 easy steps to get started with PDB Components.

* Include module files and required dependencies
* Install the component
* Use component as custom element anywhere in the page

>*If you have installed the <a href="http://www.ebi.ac.uk/pdbe/pdb-component-library" target="_blank">PDB Component Library</a> in your application then you can directly start using the component as custom element (refer step 3
).*

#### **1.** Include module files and dependencies
Download the module javascript and stylesheet files (pdb.topology.viewer.min.js and pdb.topology.viewer.min.css) stored in the 'build' folder. Include the files in your page &lt;head&gt; section.

You'll also need to include the D3.js and AngularJS library file (please refer *'bower.json'* file for complete dependencey details).
```html
<!-- minified component css -->
<link rel="stylesheet" type="text/css" href="build/pdb.topology.viewer.min.css">

<!-- Dependencey scripts (these can be skipped if already included in page) -->
<script src="bower_components/d3/d3.min.js"></script>
<script src="bower_components/angular/angular.min.js"></script>

<!-- minified component js -->
<script src="build/pdb.topology.viewer.min.js"></script>
```

#### **2.** Installation
As soon as you've got the dependencies and library files included in your application page you just need to include following installation script :

***I)*** If you are developing an AngularJs Application

```html
<script>
angular.module('myModule', ['pdb.topology.viewer']);
</script>
```

***II)*** For other Applications

```html
<script>
(function () {
  'use strict';
  angular.element(document).ready(function () {
      angular.bootstrap(document, ['pdb.topology.viewer']);
  });
}());
</script>
```

#### **3.** Using component as custom element anywhere in the page

The component can be used as custom element, attribute or class anywhere in the page.

```html
<!-- component as custom element -->
<pdb-topology-viewer entry-id="1aqd" entity-id="1"></pdb-topology-viewer>

<!-- component as attribute -->
<div pdb-topology-viewer entry-id="1aqd" entity-id="1"></div>

<!-- component as class -->
<div class="pdb-topology-viewer" entry-id="1aqd" entity-id="1"></div>

```
## Documentation

### Attributes
| Sr. No.        | Attribute           | Values  | Description |
|:-------------:|:-------------|:-----|:-----|
| 1      | entry-id | _PDB ID_ <br>**Mandatory attribute!**  | Example : entry-id="1cbs" |
| 2      | entity-id | _Entity ID_ <br>**Mandatory attribute!** |Example : entity-id="1"  |
| 3      | height | _Number_ <br>*(Optional Attribute)* |Example : height="300"  |
| 4      | width | _Number_ <br>*(Optional Attribute)* |Example : width="400"  |
| 4      | subscribe-events | _Boolean (true/false)_ <br>*(Optional Attribute)*<br>Default : 'true' |Subscribes to custom events of other PDB Components.<br>Example : subscribe-events="true"  |

### Custom Events
Use this to subscript/bind events of this component. Event data (available in key = 'eventData') contains information about the residue number, chain, entry and entity, etc.

| Sr. No.        | Event | Description |
|:-------------:|:-------------|:-----|
| 1 | PDB.topologyViewer.click | use this to bind to click event<br> Example:<br> document.addEventListener('PDB.topologyViewer.click', function(e){ /\/do something on event }) |
| 2 | PDB.topologyViewer.mouseover | use this to bind to mouseover event<br> Example:<br> document.addEventListener('PDB.topologyViewer.mouseover', function(e){ /\/do something on event }) |
| 3 | PDB.topologyViewer.mouseout | use this to bind to mouseout event<br> Example:<br> document.addEventListener('PDB.topologyViewer.mouseout', function(e){ /\/do something on event }) |

*Please refer <a href="http://www.ebi.ac.uk/pdbe/pdb-component-library/doc.html#a_topologyViewer" target="_blank">this link</a> for more documentation, demo and parameters details.*

## Contact
Please <a href="https://github.com/mandarsd/pdb-topology-viewer">use github</a> to report **bugs**, discuss potential **new features** or **ask questions** in general. Also you can <a href="http://www.ebi.ac.uk/pdbe/about/contact" target="_blank">contact us here</a> for support, feedback or to report any issues.

## License
The plugin is released under the Apache License Version 2.0. You can find out more about it at http://www.apache.org/licenses/LICENSE-2.0 or within the license file of the repository.

## If you are interested in this plugin...
...you might also want to have a look at the <a href="http://www.ebi.ac.uk/pdbe/pdb-component-library" target="_blank">PDB Component Library</a>.


"# pdb-topology-viewer" 
